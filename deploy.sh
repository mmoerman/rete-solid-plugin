#!/bin/bash
#
# This is a utility script to publish with a One TOme Passcode
#
if [ -n "$1" ]; then
    npm publish --access public --otp $1
else
    npm publish
fi
