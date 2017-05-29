#!/bin/bash
cd "/home/aim/amorgunov/store/$1"
echo $PWD
echo "start exucation"
g++ main.cpp -o main.out
./main.out
# echo "end exucation"