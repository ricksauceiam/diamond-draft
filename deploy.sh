#!/bin/bash

# ── Diamond Draft Auto-Deploy Script ──────────────────────────────────────────
# Double-click this file (or run it in Terminal) to push updates to GitHub.
# Your site will be live on Vercel about 30 seconds after this runs.

# Where your repo lives on your computer
REPO="$HOME/Documents/diamond-draft"

# Where your Downloads folder is
DOWNLOADS="$HOME/Downloads"

echo "🚀 Diamond Draft Deploy"
echo "────────────────────────"

# Check the repo exists
if [ ! -d "$REPO" ]; then
  echo "❌ Repo not found at $REPO"
  echo "   Run: gh repo clone ricksauceiam/diamond-draft ~/Documents/diamond-draft"
  read -p "Press Enter to close..."
  exit 1
fi

# Copy files from Downloads if they exist
COPIED=0

if [ -f "$DOWNLOADS/index.html" ]; then
  cp "$DOWNLOADS/index.html" "$REPO/public/index.html"
  echo "✓ Copied index.html"
  COPIED=$((COPIED+1))
fi

if [ -f "$DOWNLOADS/players.json" ]; then
  cp "$DOWNLOADS/players.json" "$REPO/public/players.json"
  echo "✓ Copied players.json"
  COPIED=$((COPIED+1))
fi

if [ -f "$DOWNLOADS/vercel.json" ]; then
  cp "$DOWNLOADS/vercel.json" "$REPO/vercel.json"
  echo "✓ Copied vercel.json"
  COPIED=$((COPIED+1))
fi

# Check for extracted zip folder
if [ -d "$DOWNLOADS/diamond-draft" ]; then
  if [ -f "$DOWNLOADS/diamond-draft/public/index.html" ]; then
    cp "$DOWNLOADS/diamond-draft/public/index.html" "$REPO/public/index.html"
    echo "✓ Copied index.html from zip folder"
    COPIED=$((COPIED+1))
  fi
  if [ -f "$DOWNLOADS/diamond-draft/public/players.json" ]; then
    cp "$DOWNLOADS/diamond-draft/public/players.json" "$REPO/public/players.json"
    echo "✓ Copied players.json from zip folder"
    COPIED=$((COPIED+1))
  fi
  if [ -f "$DOWNLOADS/diamond-draft/vercel.json" ]; then
    cp "$DOWNLOADS/diamond-draft/vercel.json" "$REPO/vercel.json"
    echo "✓ Copied vercel.json from zip folder"
    COPIED=$((COPIED+1))
  fi
  if [ -f "$DOWNLOADS/diamond-draft/api/mlb.js" ]; then
    mkdir -p "$REPO/api"
    cp "$DOWNLOADS/diamond-draft/api/mlb.js" "$REPO/api/mlb.js"
    echo "✓ Copied api/mlb.js from zip folder"
    COPIED=$((COPIED+1))
  fi
  if [ -f "$DOWNLOADS/diamond-draft/api/fix-players.js" ]; then
    mkdir -p "$REPO/api"
    cp "$DOWNLOADS/diamond-draft/api/fix-players.js" "$REPO/api/fix-players.js"
    echo "✓ Copied api/fix-players.js from zip folder"
    COPIED=$((COVERED+1))
  fi
fi

if [ $COPIED -eq 0 ]; then
  echo "⚠️  No new files found in Downloads."
  echo "   Make sure the zip is extracted or files are in ~/Downloads"
  read -p "Press Enter to close..."
  exit 1
fi

echo ""
echo "📦 Pushing to GitHub..."

# Go to repo and push
cd "$REPO"
git add .
git commit -m "Update $(date '+%b %d %H:%M')"
git push

echo ""
echo "✅ Done! Vercel is deploying now."
echo "   Your site will be live in ~30 seconds:"
echo "   https://diamond-draft.vercel.app"
echo ""
read -p "Press Enter to close..."
