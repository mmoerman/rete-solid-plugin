#!/bin/bash
#
# This is a utility script to publish from the dist directory
# which seems to be the intention from how rete bundles things.
#
npm run build
if [ -f .npmrc ]; then
    cp .npmrc dist
fi
cd dist
if [ -n "$1" ]; then
    npm publish --access public --otp $1
else
    npm publish
fi
