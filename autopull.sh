#!/bin/bash
cd ~/WOWERS

# I-pull at i-check kung may bagong changes
OLD=$(git rev-parse HEAD)
git pull origin main
NEW=$(git rev-parse HEAD)

# Kung may bagong changes, mag-notify sa Discord
if [ "$OLD" != "$NEW" ]; then
  WEBHOOK_URL="https://discord.com/api/webhooks/1511616433166221373/E8B9UZBppvdTQSiqqHIxezZb0DxNSlYJFobgsT5RPK8uRyAL5sQfbQS5DtJPVVEb4vqf"
  MESSAGE="✅ WOWERS updated! New changes pulled from GitHub."
  curl -H "Content-Type: application/json" \
       -d "{\"content\": \"$MESSAGE\"}" \
       "$WEBHOOK_URL"
fi
