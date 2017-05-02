#!/bin/bash
cd "$(dirname "$0")"
#echo $PWD
g++ main.cpp -o main.out
./main.out