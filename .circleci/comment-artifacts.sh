#!/bin/bash

# Hit the bot https://github.com/jukben/rta-bot
URL="https://rta-bot.now.sh/"

read -r -d '' DATA << EOM
{
  "prURL": "$CIRCLE_PULL_REQUEST",
  "buildNumber": "$CIRCLE_BUILD_NUM",
  "nodeIndex": "$CIRCLE_NODE_INDEX"
}
EOM

curl \
  -H "Content-Type: application/json" \
  -d "$DATA" \
  -X POST $URL
