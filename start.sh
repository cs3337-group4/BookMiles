#!/bin/sh
nohup node server.js > server.log 2>&1 </dev/null &
echo $! > server.pid