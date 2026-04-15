# AURA HQ — Justfile
# Install `just`: brew install just
# Install `uv`:  curl -LsSf https://astral.sh/uv/install.sh | sh

# Default — list all commands
default:
    @just --list

# ── Setup ─────────────────────────────────────────────────────────────────────

# First-time setup: install all deps and copy env file
setup:
    @echo "→ Setting up frontend…"
    npm install
    @echo "→ Setting up Python backend…"
    cd backend && uv venv && uv sync
    @if [ ! -f .env.local ]; then cp .env.example .env.local && echo "✓ .env.local created — fill in your keys"; else echo "✓ .env.local already exists"; fi
    @echo "✓ Setup complete. Fill in .env.local then run: just dev"

# Install frontend deps only
install-frontend:
    npm install

# Install backend deps only
install-backend:
    cd backend && uv sync

# ── Dev ───────────────────────────────────────────────────────────────────────

# Run BOTH frontend and backend together (requires: brew install concurrently)
dev:
    @echo "→ Clearing Next.js build cache…"
    @rm -rf .next
    @echo "→ Freeing ports 3000 and 8000…"
    @lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    @lsof -ti:8000 | xargs kill -9 2>/dev/null || true
    @echo "→ Starting dev servers…"
    npx concurrently \
      --names "next,fastapi" \
      --prefix-colors "cyan,magenta" \
      "npm run dev" \
      "cd backend && uv run --project . uvicorn backend.main:app --reload --port 8000 --app-dir .."

# Run frontend only
dev-frontend:
    @rm -rf .next
    @lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    npm run dev

# Run backend only
dev-backend:
    cd backend && uv run uvicorn backend.main:app --reload --port 8000 --app-dir ..

# ── Build ─────────────────────────────────────────────────────────────────────

# Production build (frontend)
build:
    npm run build

# Type check + lint (frontend)
check-frontend:
    npx tsc --noEmit
    npm run lint

# Lint + type check (backend)
check-backend:
    cd backend && uv run ruff check .
    cd backend && uv run mypy .

# Run all checks
check:
    @just check-frontend
    @just check-backend
    @echo "✓ All checks passed"

# ── Tests ─────────────────────────────────────────────────────────────────────

# Run Python tests
test:
    cd backend && uv run pytest

# ── Database ──────────────────────────────────────────────────────────────────

# Print reminder to run the migration in Supabase
db-migrate:
    @echo "Run this in your Supabase SQL editor:"
    @echo "  supabase/migrations/001_initial.sql"
    @echo ""
    @echo "Dashboard: https://supabase.com/dashboard/project/_/sql"

# ── Utilities ─────────────────────────────────────────────────────────────────

# Clean frontend build artifacts
clean:
    rm -rf .next out

# Clean backend cache
clean-backend:
    find backend -type d -name __pycache__ | xargs rm -rf
    find backend -name "*.pyc" -delete

# Clean everything and reinstall
reset:
    @just clean
    @just clean-backend
    rm -rf node_modules package-lock.json backend/.venv
    @just setup

# Show env var status (non-secret check)
env-check:
    @echo "NEXT_PUBLIC_SUPABASE_URL:       $${NEXT_PUBLIC_SUPABASE_URL:-(not set)}"
    @echo "NEXT_PUBLIC_SUPABASE_ANON_KEY:  $${NEXT_PUBLIC_SUPABASE_ANON_KEY:-(not set)}"
    @echo "SUPABASE_SERVICE_ROLE_KEY:      $${SUPABASE_SERVICE_ROLE_KEY:-(not set)}"
    @echo "OPENAI_API_KEY:                 $${OPENAI_API_KEY:-(not set)}"
    @echo "BACKEND_URL:                    $${BACKEND_URL:-http://localhost:8000 (default)}"

# Open FastAPI interactive docs
api-docs:
    open http://localhost:8000/api/docs

# ── Git ───────────────────────────────────────────────────────────────────────

# Smart push — auto-generates a meaningful commit message from what changed
push:
    bash scripts/push.sh

# Set GitHub remote URL (run once)
git-remote url:
    git remote remove origin 2>/dev/null || true
    git remote add origin {{url}}
    git push -u origin main

# ── Vercel / Deploy ───────────────────────────────────────────────────────────

# Deploy frontend to Vercel (requires: npm i -g vercel)
deploy:
    vercel --prod

# Deploy preview
deploy-preview:
    vercel
