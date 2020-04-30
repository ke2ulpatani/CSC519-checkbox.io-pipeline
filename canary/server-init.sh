#!/bin/bash

# Exit on error
set -e

# Trace commands as we run them:
set -x

# Disable auto apt-update check by ubuntu
sudo sed -i 's/APT::Periodic::Update-Package-Lists "1"/APT::Periodic::Update-Package-Lists "0"/' /etc/apt/apt.conf.d/10periodic

# Nodejs
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt install nodejs -y

# Script used to initialize your ansible server after provisioning.
sudo add-apt-repository ppa:ansible/ansible -y
sudo apt-get update
sudo apt-get install ansible -y

# Ensure security key has proper permissions
chmod 700 ~/.ssh/mm_rsa

# Set Environment Variables
if [ $# -eq 0 ]
then
    # no args passed
    exit 0;
fi

branch=$1;

if [ $SERVICE_BRANCH ]
then
    #update
    sudo sed "s/SERVICE_BRANCH=.*/SERVICE_BRANCH=$branch/g" -i /etc/environment
else
    echo "SERVICE_BRANCH=$branch" | sudo tee -a /etc/environment
fi
