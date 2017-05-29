#!/bin/bash

local RESULTS
cd "$(dirname "$0")"
cd ../
#echo $PWD
#echo "$PWD/$1"
scp -r "$PWD/$1" aim@sci-permute.sscc.ru:~/amorgunov/store
RESULTS=$(ssh aim@sci-permute.sscc.ru 'bash -s' < "$PWD/$1/run2.sh" "$1")
scp "aim@sci-permute.sscc.ru:~/amorgunov/store/$1/output.txt" "$PWD/$1/output2.txt"
echo "${RESULTS}"
echo "success"
# cd "$(dirname "$0")"
# echo $PWD
# g++ main.cpp -o main.out
# ./main.out
