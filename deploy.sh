#! /bin/bash

git fetch && git reset --hard origin/develop
. ~/.nvm/nvm.sh nvm use 10.13
wait

npm install
wait

npm run build:prod
wait

echo "🚀 Application deployed!"