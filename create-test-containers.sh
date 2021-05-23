#! /bin/bash

SLEEP_TIME=3000
NUM_CONTAINERS=5
i=0

while [ $i -lt $NUM_CONTAINERS ]
do
    docker run -d flask-web:python sleep $SLEEP_TIME
    ((i++))
done


echo 5 containers created.