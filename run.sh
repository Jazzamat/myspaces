#!/bin/bash
sudo chmod 666 /var/run/docker.sock
docker compose -f "docker-compose.yml" up -d --build && echo "MySpaces is now running on localhost:3000"
