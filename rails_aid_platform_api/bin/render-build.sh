#!/usr/bin/env bash
# exit on error
set -o errexit

# Add build commands for front end
rm -rf public
npm install --prefix react_aid_platform
npm run build --prefix react_aid_platform
cp -a react_aid_platform/build/. public/

bundle install
bundle exec rake db:migrate
