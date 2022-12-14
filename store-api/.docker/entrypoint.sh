#!/bin/bash

if [ ! -f ".env" ]; then
  cp .env.local .env
fi

npm install
npm run typeorm migration:run
npm run start:dev