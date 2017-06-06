#!/bin/bash
#PBS -V
#PBS -r n
#PBS -q SL_q
#PBS -l select=1:ngpus=1:ncpus=1,walltime=48:00:00
#PBS -N permute
#PBS -j oe
date
cd $PBS_O_WORKDIR
pwd
MPD_CON_EXT=`date`
cat $PBS_NODEFILE
./main.o
date
