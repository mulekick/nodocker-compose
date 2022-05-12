#!/bin/bash

# image name
imgname='mulekick/nodocker-compose:latest'

# containers names
cntname1='toto'
cntname2='titi'

# pipe name
pipename='test.pipe'

# stop the trainwreck
function uncompose {
    # stop containers
    docker container stop "$cntname1" 1>/dev/null
    docker container stop "$cntname2" 1>/dev/null
    # delete pipe
    rm -f "$pipename"
    # echo and exit
    echo -e "(shell) received SIGINT, stopped containers, exiting"
    # success
    return 0
}

# trap SIGTERM
trap "uncompose" SIGINT

# build image
docker image build -t "$imgname" .  1>/dev/null

# create fifo
mkfifo "$pipename"

# launch containers
docker container run --name "$cntname1" --env CONTAINER_NAME="$cntname1" -d --rm "$imgname" 1>/dev/null
docker container run --name "$cntname2" --env CONTAINER_NAME="$cntname2" -d --rm "$imgname" 1>/dev/null

# redirect outputs
docker container logs --follow "$cntname1" &>"$pipename" &
docker container logs --follow "$cntname2" &>"$pipename" &

# launch node process
node compose.js "$pipename"