#!/bin/bash

# Exit on error
set -e

# Trace commands as we run them:
set -x

# Disable auto apt-update check by ubuntu
sudo sed -i 's/APT::Periodic::Update-Package-Lists "1"/APT::Periodic::Update-Package-Lists "0"/' /etc/apt/apt.conf.d/10periodic

# Manually run apt-update
sudo apt-get update

# redis
sudo apt-get -y install redis-server
sudo sed -i 's/supervised no/supervised systemd/g' /etc/redis/redis.conf
sudo sed -i 's/bind 127.0.0.1 ::1/bind 0.0.0.0/g' /etc/redis/redis.conf

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
if [ $1 ]
then
    proxy_ip=$1;
    if [ $PROXY_IP ]
    then
        #update
        sudo sed "s/PROXY_IP=.*/PROXY_IP=$proxy_ip/g" -i /etc/environment
    else
        echo "PROXY_IP=$proxy_ip" | sudo tee -a /etc/environment
    fi
fi

if [ $2 ]
then
    proxy_port=$2;
    if [ $PROXY_PORT ]
    then
        #update
        sudo sed "s/PROXY_PORT=.*/PROXY_PORT=$proxy_port/g" -i /etc/environment
    else
        echo "PROXY_PORT=$proxy_port" | sudo tee -a /etc/environment
    fi
fi

if [ $3 ]
then
    blue_ip=$3;
    if [ $BLUE_IP ]
    then
        #update
        sudo sed "s/BLUE_IP=.*/BLUE_IP=$blue_ip/g" -i /etc/environment
    else
        echo "BLUE_IP=$blue_ip" | sudo tee -a /etc/environment
    fi
fi

if [ $4 ]
then
    green_ip=$4;
    if [ $GREEN_IP ]
    then
        #update
        sudo sed "s/GREEN_IP=.*/GREEN_IP=$green_ip/g" -i /etc/environment
    else
        echo "GREEN_IP=$green_ip" | sudo tee -a /etc/environment
    fi
fi

if [ $5 ]
then
    blue_name=$5;
    if [ $BLUE_NAME ]
    then
        #update
        sudo sed "s/BLUE_NAME=.*/BLUE_NAME=$blue_name/g" -i /etc/environment
    else
        echo "BLUE_NAME=$blue_name" | sudo tee -a /etc/environment
    fi
fi

if [ $6 ]
then
    green_name=$6;
    if [ $GREEN_NAME ]
    then
        #update
        sudo sed "s/GREEN_NAME=.*/GREEN_NAME=$green_name/g" -i /etc/environment
    else
        echo "GREEN_NAME=$green_name" | sudo tee -a /etc/environment
    fi
fi

if [ $7 ]
then
    port=$7;
    if [ $SERVICE_PORT ]
    then
        #update
        sudo sed "s/SERVICE_PORT=.*/SERVICE_PORT=$port/g" -i /etc/environment
    else
        echo "SERVICE_PORT=$port" | sudo tee -a /etc/environment
    fi
fi

if [ $8 ]
then
    branch=$8;
    if [ $SERVICE_BRANCH ]
    then
        #update
        sudo sed "s/SERVICE_BRANCH=.*/SERVICE_BRANCH=$branch/g" -i /etc/environment
    else
        echo "SERVICE_BRANCH=$branch" | sudo tee -a /etc/environment
    fi
fi

if [ $9 ]
then
    service_name=$9;
    if [ $SERVICE_NAME ]
    then
        #update
        sudo sed "s/SERVICE_NAME=.*/SERVICE_NAME=$service_name/g" -i /etc/environment
    else
        echo "SERVICE_NAME=$service_name" | sudo tee -a /etc/environment
    fi
fi
