#!/usr/bin/env bash

docker rm -f devfunny-api

docker rmi devfunny-api

docker image prune

docker volume prune

docker build -t devfunny-api .
