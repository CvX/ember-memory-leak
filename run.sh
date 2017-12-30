#!/usr/bin/env bash

# Rebuild the test app
ember build

# Start the FastBoot server
node --expose-gc --optimize_for_size --max_old_space_size=460 server.js | grep -B 2 -A 5 RESULTS &

# Wait for the server to start
sleep 6

echo 'Starting the memory leak test (500 requests)'
ab -n 500 -c 2 -H 'accept: text/html' http://0.0.0.0:3000/ > /dev/null

# Kill the server process
jobs -p | xargs kill
