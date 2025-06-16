#!/bin/sh

# package front-end and move to back-end
npm run build
rm -r ../back-end/dist
cp -r dist ../back-end/
echo 'packaging finish'