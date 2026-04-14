from __future__ import annotations

import base64
from io import BytesIO

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Request
from fastapi.responses import JSONResponse

from backend.auth import get_current_user
from backend.config import settings
from backend.models.schemas import AvatarResponse
from backend.services.openai_service import get_openai
from backend.services.supabase_service import get_supabase

router = APIRouter(prefix="/avatar", tags=["avatar"])


def _build_style_prompt(capacity_answer: str) -> str:
    lower = capacity_answer.lower()
    if any(w in lower for w in ("build", "start", "found", "create")):
        return "Studio founder aesthetic. Confident, composed expression. Professional but not corporate."
    if any(w in lower for w in ("write", "design", "art", "creative")):
        return "Creative director aesthetic. Thoughtful expression. Artistic but precise."
    if any(w in lower for w in ("invest", "money", "financial", "business")):
        return "Executive portrait aesthetic. Polished, authoritative expression."
    if any(w in lower for w in ("health", "fit", "run", "workout")):
        return "Performance-oriented aesthetic. Alert, energized expression."
    if any(w in lower for w in ("think", "learn", "read", "research")):
        return "Intellectual aesthetic. Perceptive, engaged expression."
    return "Professional portrait. Composed, confident expression. Premium editorial quality."


@router.post("/generate", response_model=AvatarResponse)
async def generate_avatar(
    request: Request,
    photo: UploadFile = File(...),
    capacity_answer: str = Form(default=""),
    user: dict[str, str] = Depends(get_current_user),
) -> AvatarResponse:
    if not photo.content_type or not photo.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    photo_bytes = await photo.read()
    photo_b64 = base64.b64encode(photo_bytes).decode()
    mime = photo.content_type or "image/jpeg"

    openai_client = get_openai()

    # Step 1 — analyse the photo with GPT-4o vision
    analysis = await openai_client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:{mime};base64,{photo_b64}",
                            "detail": "high",
                        },
                    },
                    {
                        "type": "text",
                        "text": (
                            "Describe this person for a portrait painting prompt: "
                            "age range, gender presentation, hair color/style, skin tone "
                            "(be specific and respectful), distinguishing facial features. "
                            "Be precise. 2-3 sentences maximum."
                        ),
                    },
                ],
            }
        ],
        max_tokens=150,
    )
    person_description = analysis.choices[0].message.content or "a person"

    # Step 2 — generate stylized portrait with DALL-E 3
    style_prompt = _build_style_prompt(capacity_answer)
    generation_prompt = (
        f"Editorial portrait photograph. {person_description}. {style_prompt} "
        "Rembrandt lighting: warm key light at 45 degrees illuminating one side, "
        "subtle triangle of warm light on the shadow side of the face. "
        "Background: deep warm dark brown gradient. "
        "Cinematic quality, sharp focus on face, shallow depth of field. "
        "Shot on medium format film. No text, no watermarks, photorealistic."
    )

    image_response = await openai_client.images.generate(
        model="dall-e-3",
        prompt=generation_prompt,
        size="1024x1024",
        quality="hd",
        style="natural",
        n=1,
    )

    image_url = image_response.data[0].url if image_response.data else None
    if not image_url:
        raise HTTPException(status_code=500, detail="Image generation returned no URL")

    # Step 3 — download generated image and upload to Supabase Storage
    import httpx

    async with httpx.AsyncClient() as http:
        img_response = await http.get(image_url)
        img_bytes = img_response.content

    supabase = await get_supabase()
    storage_path = f"{user['id']}/avatar_{photo.filename or 'avatar'}.png"

    await supabase.storage.from_("avatars").upload(
        storage_path,
        img_bytes,
        {"content-type": "image/png", "upsert": "true"},
    )

    public_url_response = supabase.storage.from_("avatars").get_public_url(storage_path)
    avatar_url: str = (
        public_url_response if isinstance(public_url_response, str)
        else public_url_response.get("publicUrl", "")
    )

    # Update profile
    await supabase.table("profiles").update({"avatar_url": avatar_url}).eq("id", user["id"]).execute()

    return AvatarResponse(avatar_url=avatar_url)
