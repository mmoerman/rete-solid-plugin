#!/bin/bash
#
# This is a utility script to publish from the dist directory
# which seems to be the intention from how rete bundles things.
#
npm run build
cp .npmrc dist
cd dist
npm publish
