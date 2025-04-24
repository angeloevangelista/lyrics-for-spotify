#!/bin/zsh

set -e

rm -rf dist temp

pnpm build

mkdir temp

mv dist/* temp
mv temp dist/dist/

cp -r manifest.json dist
cp -r extension dist

cd dist

zip -r ../dist.zip *

cd -
