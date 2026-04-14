#!/usr/bin/env bash
set -e

git add .

# Bail early if nothing to commit
if git diff --cached --quiet; then
  echo "Nothing to commit."
  git push 2>/dev/null || true
  exit 0
fi

CHANGED=$(git diff --cached --name-only)

# Categorise touched areas
HAS_BACKEND=$(echo "$CHANGED" | grep -E "^backend/" | head -1 || true)
HAS_FRONTEND=$(echo "$CHANGED" | grep -E "^app/|^components/|^lib/|^types/" | head -1 || true)
HAS_CONFIG=$(echo "$CHANGED" | grep -E "^(next\.config|tailwind|postcss|tsconfig|vercel|Justfile|pyproject|package)" | head -1 || true)
HAS_DOCS=$(echo "$CHANGED" | grep -E "^(README|docs/|\.env)" | head -1 || true)
HAS_STYLES=$(echo "$CHANGED" | grep -E "globals\.css" | head -1 || true)
HAS_ROUTES=$(echo "$CHANGED" | grep -E "page\.tsx|route\.ts|layout\.tsx" | head -1 || true)
HAS_API=$(echo "$CHANGED" | grep -E "^backend/routers/" | head -1 || true)
HAS_AGENTS=$(echo "$CHANGED" | grep -E "agent|prompt|definition" | head -1 || true)

PARTS=()
[[ -n "$HAS_AGENTS" ]]  && PARTS+=("agent logic")
[[ -n "$HAS_API" ]]     && PARTS+=("API routes")
[[ -n "$HAS_ROUTES" ]]  && PARTS+=("pages")
[[ -n "$HAS_STYLES" ]]  && PARTS+=("styles")
[[ -n "$HAS_FRONTEND" && -z "$HAS_ROUTES" && -z "$HAS_STYLES" ]] && PARTS+=("frontend")
[[ -n "$HAS_BACKEND"  && -z "$HAS_API"    && -z "$HAS_AGENTS"  ]] && PARTS+=("backend")
[[ -n "$HAS_CONFIG" ]]  && PARTS+=("config")
[[ -n "$HAS_DOCS" ]]    && PARTS+=("docs")

if [ ${#PARTS[@]} -eq 0 ]; then
  SUBJECT="misc updates"
else
  SUBJECT=$(IFS=", "; echo "${PARTS[*]}")
fi

FILE_COUNT=$(echo "$CHANGED" | wc -l | tr -d ' ')
[[ "$FILE_COUNT" -eq 1 ]] && FILE_LABEL="1 file" || FILE_LABEL="${FILE_COUNT} files"

SUBJECT_LINE="update ${SUBJECT} (${FILE_LABEL})"
BODY=$(echo "$CHANGED" | sed 's/^/- /')

git commit -m "${SUBJECT_LINE}

${BODY}"

echo ""
echo "Committed: ${SUBJECT_LINE}"
echo ""
git push
echo "Pushed to GitHub"
