all: mt.o multiplication.o kernel.o utils.o main.o
        icpc mt.o kernel.o multiplication.o utils.o main.o -debug all -o permute -lrt -qopenmp -lpthread -L/usr/local/cuda/lib64 -lcudart -lcublas -lm
main.o: main.cpp
        icpc -g -O2 -debug all -O2 -std=c++11 -xhost -I /usr/local/cuda/include -c $< -o $@
        echo "main DONE"

utils.o: utils.cpp utils.h
        icpc -g -debug all -O2 -std=c++11 -xhost -qopenmp -I /usr/local/include -c $< -o $@

mt.o: mt.cc mt.h
        icpc -g -debug all -std=c++11 -I /usr/local/cuda/include -c $< -o $@
        echo "mt DONE"

kernel.o: permutation_device.cu multiplication.cuh
        nvcc -g -c $< -o $@
        echo "kernel.o DONE"

multiplication.o: multiplication.cu multiplication.cuh
        nvcc -g -c $< -o $@
        echo "multiplication.o DONE"

clean:
      	rm -rf *.o


nvcc -lcublas -g mt.cc sample.cu -o out.out