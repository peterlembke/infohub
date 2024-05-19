#!/usr/bin/env bash

echo ""
echo "Setting up local development for InfoHub"

echo ""
echo "---<<< Downloading ROX >>>---"
git clone git@github.com:peterlembke/rox.git

echo ""
echo "---<<< Copying InfoHub ROX config files to ROX >>>---"
\cp -rfv folder/dev.local/project.conf rox/
\cp -rfv folder/dev.local/images/app/* rox/images/app/
\cp -rfv folder/dev.local/images/web/* rox/images/web/

echo ""
echo "---<<< Copying InfoHub example config files to the config folder >>>---"
\mkdir folder/config
\cp -rfv folder/config_example/*.json folder/config/
echo ""
\cat folder/config_example/infohub_login/README.md

echo ""
echo "---<<< MANUAL STEPS >>>---"
echo "OPTIONAL: Set your GITHUB_TOKEN in rox/images/app/Dockerfile if you want to use composer"
echo "Run: rox up. It will never finish. Wait 10-15 min."
echo "Open a new tab in the terminal Run: rox start"
