#!/bin/bash
# nvcc -lcublas -g mt.cc sample.cu -o out.out

cd "$(dirname "$0")"
echo $PWD
echo "start exucation"
#g++ main.cpp -o main.out
./main.origin.out
cp output.txt output2.txt