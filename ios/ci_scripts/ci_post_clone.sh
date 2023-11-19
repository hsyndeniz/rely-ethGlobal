#!/bin/zsh

# fail if any command fails

echo "🧩 Stage: Post-clone is activated .... "

set -e
# debug log
set -x

# Install dependencies using Homebrew. This is MUST! Do not delete.
brew install node yarn cocoapods fastlane
gem install bundler --user-install

# Install dependencies using yarn and bundler
cd .. && yarn && bundle install && npx pod deintegrate && npx pod update && yarn pod-install:prod && yarn ios:bundle

echo "🎯 Stage: Post-clone is done .... "

exit 0