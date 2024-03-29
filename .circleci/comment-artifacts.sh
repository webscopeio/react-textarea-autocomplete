#!/bin/bash

# Hit the bot https://github.com/jukben/rta-bot
URL="https://rta-bot-jukben.vercel.app"

read -r -d '' DATA << EOM
{
  "prURL": "$CIRCLE_PULL_REQUEST",
  "buildNumber": "$CIRCLE_BUILD_NUM",
  "nodeIndex": "$CIRCLE_NODE_INDEX"
}
EOM

curl \
  --insecure \
  -H "Content-Type: application/json" \
  -d "$DATA" \
  -X POST $URL
