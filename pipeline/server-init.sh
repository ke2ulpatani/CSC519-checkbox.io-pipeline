#!/bin/bash

# Exit on error
set -e

# Trace commands as we run them:
set -x

# Script used to initialize your ansible server after provisioning.
sudo add-apt-repository ppa:ansible/ansible -y
sudo apt-get update
sudo apt-get install ansible -y

# Ensure security key has proper permissions
chmod 700 ~/.ssh/mm_rsa

# Set Environment Variables
ghUser=$1;
ghPass=$2;

if [ $GH_USER ]
then
    #update
    sudo sed "s/GH_USER=.*/GH_USER=$ghUser/g" -i /etc/environment
else
    echo "GH_USER=$ghUser" | sudo tee -a /etc/environment
fi

if [ $GH_PASS ]
then
    #update
    sudo sed "s/GH_PASS=.*/GH_PASS=$ghPass/g" -i /etc/environment
else
    echo "GH_PASS=$ghPass" | sudo tee -a /etc/environment
fi