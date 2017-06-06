/********************************************************************
*  sample.cu
*  This is a example of the CUDA program.
*********************************************************************/

#include <stdio.h>
#include <stdlib.h>
//#include <cutil_inline.h>
#include <iostream>
#include <sstream>
#include <vector>
//#include "conio.h"
#include <fstream> // File-stream
#include <string>
#include <map> 
#include <omp.h>
#include <time.h>
#include <list>
#include <cublas.h>



#include "mt.h"
//#include "SAnTimer.h"
//#include "Debug.h"

/************************************************************************/
/* Init CUDA                                                            */
/************************************************************************/
#if __DEVICE_EMULATION__

bool InitCUDA(void){return true;}

#else
bool InitCUDA(void)
{
	int count = 0;
	int i = 0;

	cudaGetDeviceCount(&count);
	if(count == 0) {
		fprintf(stderr, "There is no device.\n");
		return false;
	}

	for(i = 0; i < count; i++) {
		cudaDeviceProp prop;
		if(cudaGetDeviceProperties(&prop, i) == cudaSuccess) {
			if(prop.major >= 1) {
				break;
			}
		}
	}
	if(i == count) {
		fprintf(stderr, "There is no device supporting CUDA.\n");
		return false;
	}
	cudaSetDevice(i);

	printf("CUDA initialized.\n");
	return true;
}

#endif
/************************************************************************/
/* CUDA                                                             */
/************************************************************************/

__global__ static void HelloCUDA(char* result, int num)
{
	int i = 0;
	char p_HelloCUDA[] = "Hello CUDA!";
	for(i = 0; i < num; i++) {
		result[i] = p_HelloCUDA[i];
	}
}

__global__ void StatCount(float* real, float* rand, int* mas1, int* mas2, int* mas3, int* mas4, int* mas5, int temp_0gen)
{
	int tid = threadIdx.x + blockIdx.x * blockDim.x;
	while ( tid < temp_0gen)//
	{
		if (real[tid] <  rand[tid]) mas1[tid]++;
		if (real[tid] <= rand[tid]) mas2[tid]++;
		if (real[tid] >  rand[tid]) mas3[tid]++;
		if (real[tid] >= rand[tid]) mas4[tid]++;
		if (real[tid] == rand[tid]) mas5[tid]++;
		tid += blockDim.x * gridDim.x;
	}
	__syncthreads();
}

//*******************************************************************************

// Функция для разделения строки s на подстроки по символу delim. Результат в векторе elems
std::vector<std::string> &split (const std::string &s, char delim, std::vector<std::string> &elems)
{
	std::stringstream ss(s);
	std::string item;
	//std::string tmp = " ";
	while(std::getline(ss, item, delim))
	{
		if(item !="")// && item !=tmp.c_str()) //.c_str()
		{
			for (std::string::iterator it = item.begin() ; it<item.end(); ++it )
			{
				if (*it == ' ') item.erase(it);
			}
			elems.push_back(item);
		}
	 }
	//split (elems.at(0), ' ', elems);
	return elems;
}

// Аналогично предыдущей функции
void tokenize(const std::string& str, std::vector<std::string>& tokens,\
              const std::string& delimiters = " ", const bool trimEmpty = true)
{
	std::string::size_type pos, lastPos = 0;
	while(true)
	{
		pos = str.find_first_of(delimiters, lastPos);
		if(pos == std::string::npos)
		{
			pos = str.length();
			if(pos != lastPos || !trimEmpty)
			{
				tokens.push_back(std::string(str.data()+lastPos,(std::string::size_type)pos-lastPos ));
			}
			break;
		}
		else
		{
			if(pos != lastPos || !trimEmpty)
			{
				tokens.push_back(std::string(str.data()+lastPos,(std::string::size_type)pos-lastPos ));
			}
		}
		lastPos = pos + 1;
	}
};

using namespace std;

/************************************************************************/
/* HelloCUDA                                                            */
/************************************************************************/
int main(int argc, char* argv[])
{

	if(!InitCUDA()) {
		return 0;
	}
	string str;
	string filename;
	string name_delim;//Делиметер ФА
	string stps,smp_sub_stp; // Количество итераций и количество перестановок
	int temp_0gen = 0;
	int temp_1gen = 0;

	//timer::Timer t_all(true); //Создаём таймер всей работы программы и сразу его запускаем
	//timer::Timer t_file(true); //Создаём таймер обработки файла и сразу его запускаем
	//Чтение файла и разбор файла
	//===================================================================
	int count_str = 0; //количество строк в файле
	ifstream file,file1,conf;//

	conf.open( "conf.txt" ); // открываем файл для чтения настроек
	if(file == NULL)
	{
		printf("file conf.txt not found");
		getchar();
		return EXIT_SUCCESS;
	}
	else
	{
			getline(conf,filename);
			getline(conf,name_delim);
			getline(conf,stps);
			getline(conf,smp_sub_stp);
	}
	conf.close();

	file.open("input.txt");// открываем файл первый раз для подсчета кол-ва строк
	if(file == NULL) 
	{
    printf("file not found");
		printf("%s", filename.c_str());
		getchar();
		return EXIT_SUCCESS;
	}
	else
	{
		while( getline(file,str) )//пока есть строки
		{
			count_str++; //счет строк
		}
	}
	string *arr = new string[count_str];// массив для строк
	int *GEN_ID_arr = new int[count_str-1]; // массив идентификаторов строк
	float *ValueGen_arr = new float[count_str-1]; // массив значений генов //new
	
	file.close();//закрыли файл

	cout << " Start parsing file! " << endl;
	
	file1.open( "input.txt" );// открыли снова для разбора строк по столбцам
	
	int id = 0;
	while( getline(file1,str, '\n') )//пока есть строки читаем строки в str
		{
			arr[id] = str; //помещаем строки в массив
			id++;
		}

	file1.close();

	std::vector <std::vector<std::string> > all_term_gen;//Двумерный вектор с генами строк по строкам
	all_term_gen.resize(count_str-1); // Первое измерение по кол-ву рабочих строк
	
	map <string, std::list<std::string> > FA_in_gen;// вхождения ФА с ненулевыми значениями в гены пара(ФА, вектор и ид генов)
	map <string, std::list<std::string> > ::iterator IT_FA_in_gen;// итератор для мапа 
	map <string, std::list<std::string> > FA_in_gen_all;// вхождения ФА в гены пара(ФА, вектор и ид генов)
	map <string, std::list<std::string> >::iterator IT_FA_in_gen_all;// итератор для мапа 
 

	map<string, float> real_val_sum_for_term;// накопление значений на ген пара(ген, значение гена)
	map<string, int> sum_of_gens_for_term;// количество генов пара(ген, количество)
	map<string, float>::iterator IT_real_val_sum_for_term;// итератор для мапа по значением генов
	map<string, int>::iterator IT_sum_of_gens_for_term;// итератор для мапа по количеству генов

	map<string, int> gen_in_term;// набор генов со значением больше ноля пара(ген, индекс строки)
	map<int, float> value_for_gen;// значение гена пара(индекс строки, значение гена)
	map<string, int>::iterator IT_gen_in_term;// итератор для мапа 
	map<int, float>::iterator IT_value_for_gen;// итератор для мапа

	map<string, int> all_gen_in_term;//набор генов пара(ген, индекс строки)
	map<string, int>::iterator IT_all_gen_in_term;// итератор для мапа

	map<int, int> size_map;// мап с парой (индекс строки, кол-во генов в ней)
	map<int, int>::iterator IT_size_map;// итератор для мапа

	for(int i = 1;i<count_str;i++)// i=1 Пропускаем первую строчку с заголовком и по оставшимся идем
	{
		std::vector<std::string> elems;
		split (arr[i], '\t', elems); // дробим строчку на составляющие по пробелу (пробелы вырезаются)
		std::vector<std::string> tmp_gen_terms;//временное хранилище генов
		tokenize(elems.at(1), tmp_gen_terms,name_delim);
		size_map[atoi(elems.at(0).c_str())] = tmp_gen_terms.size(); // мап с количеством генов по строкам
		all_term_gen[i-1].resize(tmp_gen_terms.size());// второе измерение по кол-ву генов

		for(unsigned int k=0; k<tmp_gen_terms.size(); k++) // 
		{
			all_term_gen[i-1][k] = tmp_gen_terms.at(k);// складываем гены в вектор соответствующей строки
			real_val_sum_for_term[tmp_gen_terms.at(k)] += (float)(atof(elems.at(elems.size()-1).c_str()));
			sum_of_gens_for_term[tmp_gen_terms.at(k)] += 1;
			
			if(all_gen_in_term.count(tmp_gen_terms.at(k)) != 1)
			{
				all_gen_in_term[tmp_gen_terms.at(k)]=(int)(atoi(elems.at(0).c_str()));//!!!
				temp_0gen++;
			}

			if (FA_in_gen_all.count(tmp_gen_terms.at(k))!= 1)
			{
				//создаем список
				list<string> lst;
				// добавляем в него идентификатор строки;
				lst.push_back(elems.at(0));
				FA_in_gen_all[tmp_gen_terms.at(k)] = lst;
			}
			else
			{
				(*FA_in_gen_all.find(tmp_gen_terms.at(k))).second.push_back(elems.at(0));
			}

			if((float)(atof(elems.at(elems.size()-1).c_str()))>0)
			{
				//FA_in_gen формируем с списком строк с ФА с ненулевым значением
				//---------------------
				if (FA_in_gen.count(tmp_gen_terms.at(k))!= 1)
				{
					//создаем список
					list<string> lst;
					// добавляем в него идентификатор строки;
					lst.push_back(elems.at(0));
					FA_in_gen[tmp_gen_terms.at(k)] = lst;
				}
				else
				{
					(*FA_in_gen.find(tmp_gen_terms.at(k))).second.push_back(elems.at(0));
				}
				//--------------------
				if(gen_in_term.count(tmp_gen_terms.at(k)) != 1)
				{
					gen_in_term[tmp_gen_terms.at(k)]=(int)(atoi(elems.at(0).c_str()));//!!!
					temp_1gen++;
				}
			}
		}
		value_for_gen[(int)(atoi(elems.at(0).c_str()))] = (float)(atof(elems.at(elems.size()-1).c_str()));
		GEN_ID_arr[i-1] = (int)(atoi(elems.at(0).c_str()));
		ValueGen_arr[i-1] = (float)(atof(elems.at(elems.size()-1).c_str()));// new
	}

	float *SqData = new float[temp_0gen*(count_str-2)];//двумерный массив, вытянутый в одномерный, хранящий 0 или 1 вхождения ФА [countFA * countStr]
	for (int i = 0; i < temp_0gen*(count_str-2); i++)
	{
		SqData[i] = 0.0;
	}
	//Замечание 
	//j*str+i - транспонированный вид ФА*Стр
	//temp_0gen*i+j - Нормальный вид Стр*ФА
	for (int i = 0; i < count_str-2; i++)
	{
		//test << "----i " << i << endl;
		int j = 0;
		//int str = count_str-2;
		for (IT_all_gen_in_term = all_gen_in_term.begin();\
			IT_all_gen_in_term != all_gen_in_term.end();\
			IT_all_gen_in_term++)
		{
			//test << "--j " << j << endl;
			for (int k = 0; k < all_term_gen[i].size(); k++)
			{
				//test << "k " << k;
				if ((*IT_all_gen_in_term).first == all_term_gen[i][k])
				{
					SqData[temp_0gen*i+j] = 1.0;// temp_0gen*i+j j*str+i
				}
			}
			j++;
		}
	}

	//t_file.pause();
	cout << " Parsing file complete! " << endl;
	//cout << "Time to parse the file = " << t_file << " seconds." << endl;
	
	int steps = atoi(stps.c_str());
	int subsample_size = atoi(smp_sub_stp.c_str());
	
	if (subsample_size > count_str-1) 
	{
		cout << " Incorrect fourth parameters!!! Now he is " << count_str-1 << endl;
		subsample_size = count_str-1;
	}

	// Initialize a Mersenne Twister
	MersenneTwister mt;
	
	cout << " Start shuffle! " << endl;
	
	//timer::Timer t_shuffle(true); //Создаём таймер и сразу его запускаем

	//mt.init_genrand((unsigned long)t_shuffle.getTickCount());
	//Весь цикл расчета
	//timer::Timer t_3(false); //
	//timer::Timer t_2(false); //
	//timer::Timer t_1(false); //



	//Создаем массивы для вычисления рандомной суммы на ГПУ
	float *d_AA, *d_x, *d_Ax, *d_AxReal;//, *d_test;
	int size_str = (count_str-2);
	int size_Full = temp_0gen*size_str;
	
	/*
	cutilSafeCall( cudaMalloc((void**) &d_AxReal, temp_0gen*sizeof(float)) ); //Реальные суммы
	cutilSafeCall( cudaMalloc((void**) &d_x, size_str*sizeof(float)) ); // Вектор значений
	cutilSafeCall( cudaMalloc((void**) &d_Ax, temp_0gen*sizeof(float)) );// Случайные суммы
	cutilSafeCall( cudaMalloc((void**) &d_AA, size_Full*sizeof(float)) );// Матрица вхождений ФА
	cutilSafeCall( cudaMemcpy(d_AA, SqData, size_Full*sizeof(float), cudaMemcpyHostToDevice) );
	*/
	
	cudaMalloc((void**) &d_AxReal, temp_0gen*sizeof(float)); //Реальные суммы
	cudaMalloc((void**) &d_x, size_str*sizeof(float)); // Вектор значений
	cudaMalloc((void**) &d_Ax, temp_0gen*sizeof(float));// Случайные суммы
	cudaMalloc((void**) &d_AA, size_Full*sizeof(float));// Матрица вхождений ФА
	cudaMemcpy(d_AA, SqData, size_Full*sizeof(float), cudaMemcpyHostToDevice);
	
	//Создаем массивы для насчета количеств вхождений по рандомной сумме
	int *sum_of_cases_with_more_values_sum_arr,\
		*sum_of_cases_with_more_or_equal_values_sum_arr,\
		*sum_of_cases_with_less_values_sum_arr,\
		*sum_of_cases_with_less_or_equal_values_sum_arr,\
		*sum_of_cases_with_equal_values_sum_arr;
		
	float *AxReal, *Ax;
	
	sum_of_cases_with_more_values_sum_arr = new int[temp_0gen];
	sum_of_cases_with_more_or_equal_values_sum_arr = new int[temp_0gen];
	sum_of_cases_with_less_values_sum_arr = new int[temp_0gen];
	sum_of_cases_with_less_or_equal_values_sum_arr = new int[temp_0gen];
	sum_of_cases_with_equal_values_sum_arr = new int[temp_0gen];
	
	AxReal = new float[temp_0gen];
	Ax = new float[temp_0gen];
	
	for(int i = 0; i < temp_0gen; i++)
	{
		sum_of_cases_with_more_values_sum_arr[i] = 0;
		sum_of_cases_with_more_or_equal_values_sum_arr[i] = 0;
		sum_of_cases_with_less_values_sum_arr[i] = 0;
		sum_of_cases_with_less_or_equal_values_sum_arr[i] = 0;
		sum_of_cases_with_equal_values_sum_arr[i] = 0;
		AxReal[i] = 0.0f;
		Ax[i] = 0.0f;
	}

	sum_of_cases_with_more_values_sum_arr = (int*) calloc (temp_0gen,sizeof(int));
	sum_of_cases_with_more_or_equal_values_sum_arr = (int*) calloc (temp_0gen,sizeof(int));
	sum_of_cases_with_less_values_sum_arr = (int*) calloc (temp_0gen,sizeof(int));
	sum_of_cases_with_less_or_equal_values_sum_arr = (int*) calloc (temp_0gen,sizeof(int));
	sum_of_cases_with_equal_values_sum_arr = (int*) calloc (temp_0gen,sizeof(int));

	int *d_sum_of_cases_with_more_values_sum,\
		*d_sum_of_cases_with_more_or_equal_values_sum,\
		*d_sum_of_cases_with_less_values_sum,\
		*d_sum_of_cases_with_less_or_equal_values_sum,\
		*d_sum_of_cases_with_equal_values_sum;
	
	/*
	cutilSafeCall( cudaMalloc((void**)&d_sum_of_cases_with_more_values_sum, temp_0gen*sizeof(int)) );
	cutilSafeCall( cudaMalloc((void**)&d_sum_of_cases_with_more_or_equal_values_sum, temp_0gen*sizeof(int)) );
	cutilSafeCall( cudaMalloc((void**)&d_sum_of_cases_with_less_values_sum, temp_0gen*sizeof(int)) );
	cutilSafeCall( cudaMalloc((void**)&d_sum_of_cases_with_less_or_equal_values_sum, temp_0gen*sizeof(int)) );
	cutilSafeCall( cudaMalloc((void**)&d_sum_of_cases_with_equal_values_sum, temp_0gen*sizeof(int)) );

	cutilSafeCall( cudaMemcpy(d_sum_of_cases_with_more_values_sum,			sum_of_cases_with_more_values_sum_arr, temp_0gen*sizeof(int), cudaMemcpyHostToDevice) );
	cutilSafeCall( cudaMemcpy(d_sum_of_cases_with_more_or_equal_values_sum, sum_of_cases_with_more_or_equal_values_sum_arr, temp_0gen*sizeof(int), cudaMemcpyHostToDevice) );
	cutilSafeCall( cudaMemcpy(d_sum_of_cases_with_less_values_sum,			sum_of_cases_with_less_values_sum_arr, temp_0gen*sizeof(int), cudaMemcpyHostToDevice) ); 
	cutilSafeCall( cudaMemcpy(d_sum_of_cases_with_less_or_equal_values_sum, sum_of_cases_with_less_or_equal_values_sum_arr, temp_0gen*sizeof(int), cudaMemcpyHostToDevice) );
	cutilSafeCall( cudaMemcpy(d_sum_of_cases_with_equal_values_sum,			sum_of_cases_with_equal_values_sum_arr, temp_0gen*sizeof(int), cudaMemcpyHostToDevice) );
	cutilSafeCall( cudaMemcpy(d_AxReal, AxReal, temp_0gen*sizeof(float), cudaMemcpyHostToDevice) );
	cutilSafeCall( cudaMemcpy(d_Ax, Ax, temp_0gen*sizeof(float), cudaMemcpyHostToDevice) );
	*/
	
	
	
	

	cudaMalloc((void**)&d_sum_of_cases_with_more_values_sum, temp_0gen*sizeof(int));
	cudaMalloc((void**)&d_sum_of_cases_with_more_or_equal_values_sum, temp_0gen*sizeof(int));
	cudaMalloc((void**)&d_sum_of_cases_with_less_values_sum, temp_0gen*sizeof(int));
	cudaMalloc((void**)&d_sum_of_cases_with_less_or_equal_values_sum, temp_0gen*sizeof(int));
	cudaMalloc((void**)&d_sum_of_cases_with_equal_values_sum, temp_0gen*sizeof(int));

	cudaMemcpy(d_sum_of_cases_with_more_values_sum,			sum_of_cases_with_more_values_sum_arr, temp_0gen*sizeof(int), cudaMemcpyHostToDevice);
	cudaMemcpy(d_sum_of_cases_with_more_or_equal_values_sum, sum_of_cases_with_more_or_equal_values_sum_arr, temp_0gen*sizeof(int), cudaMemcpyHostToDevice);
	cudaMemcpy(d_sum_of_cases_with_less_values_sum,			sum_of_cases_with_less_values_sum_arr, temp_0gen*sizeof(int), cudaMemcpyHostToDevice); 
	cudaMemcpy(d_sum_of_cases_with_less_or_equal_values_sum, sum_of_cases_with_less_or_equal_values_sum_arr, temp_0gen*sizeof(int), cudaMemcpyHostToDevice);
	cudaMemcpy(d_sum_of_cases_with_equal_values_sum,			sum_of_cases_with_equal_values_sum_arr, temp_0gen*sizeof(int), cudaMemcpyHostToDevice);
	cudaMemcpy(d_AxReal, AxReal, temp_0gen*sizeof(float), cudaMemcpyHostToDevice);
	cudaMemcpy(d_Ax, Ax, temp_0gen*sizeof(float), cudaMemcpyHostToDevice);
	
	int sG,sB;
	if (temp_0gen < 128)
	{
		sG = 1;
		sB = temp_0gen;
	}
	else
	{
		sG = temp_0gen/128 + 1;
		sB = 128;
	}

	// Вычисляем сумму значений по каждой ФА и результат в d_Ax
	// Заводим массив с реальными значениями сумм по каждой ФА				!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//cutilSafeCall( cudaMemcpy(d_x, ValueGen_arr, size_str*sizeof(float), cudaMemcpyHostToDevice) );
	cudaMemcpy(d_x, ValueGen_arr, size_str*sizeof(float), cudaMemcpyHostToDevice);
	const float alpha = 1.0f;
    const float beta = 0.0f;
	cublasSgemv('n', temp_0gen, size_str, alpha, d_AA, temp_0gen, d_x, 1, beta, d_AxReal, 1);

	for(int stp = 0;stp < steps;stp++)
	{
		//Цикл перестановки
		//t_1.start();
		//mt.init_genrand((unsigned long)t_1.getTickCount());
		for(int sample_stp = 0; sample_stp < subsample_size; sample_stp++)
		{
			int pos = (int)((count_str-2)*mt.genrand_res53());//+0.5);
			int pos2 = (int)((count_str-2)*mt.genrand_res53());//+0.5);
			float tmp = ValueGen_arr[pos2];
			ValueGen_arr[pos2] = ValueGen_arr[pos];
			ValueGen_arr[pos] = tmp;
		}
		//Копируем перемешанный вектор значений на GPU
		//cutilSafeCall( cudaMemcpy(d_x, ValueGen_arr, size_str*sizeof(float), cudaMemcpyHostToDevice) );
		cudaMemcpy(d_x, ValueGen_arr, size_str*sizeof(float), cudaMemcpyHostToDevice);
		//Конец Копируем перемешанный вектор значений на GPU

		//t_1.pause();//
		//t_2.start();

		// -----------  Насчет суммы Этап 2  -----------------
		// Вычисляем сумму значений по каждой ФА и результат в d_Ax, перед этим обнулив d_Ax
		cublasSgemv('N', temp_0gen, size_str, alpha, d_AA, temp_0gen, d_x, 1, beta, d_Ax, 1);
		//-------------------------------------
		//t_2.pause();//
		//t_3.start();
		// -----------  Этап 3. Насчет количеств -----------------
		\

		// завести выше фора 5 массивов соответствующих +
		// завести выше фора 5 массивов соответствующих на ГПУ +
		// аллоцировать на ГПУ 0 +
		// Написать функцию для ГПУ считающую количества
		// после фора скопировать эти массивы на хост+
		StatCount<<<sG, sB>>>(d_AxReal, d_Ax, d_sum_of_cases_with_more_values_sum,\
			d_sum_of_cases_with_more_or_equal_values_sum,\
			d_sum_of_cases_with_less_values_sum,\
			d_sum_of_cases_with_less_or_equal_values_sum,\
			d_sum_of_cases_with_equal_values_sum,\
			temp_0gen) ;
		cudaThreadSynchronize();
		// ---------------------------------
		//t_3.pause();//
		
	}//Конец всего цикла расчета

	/*
	cutilSafeCall( cudaMemcpy(sum_of_cases_with_more_values_sum_arr, d_sum_of_cases_with_more_values_sum , temp_0gen*sizeof(int), cudaMemcpyDeviceToHost) );
	cutilSafeCall( cudaMemcpy(sum_of_cases_with_more_or_equal_values_sum_arr, d_sum_of_cases_with_more_or_equal_values_sum , temp_0gen*sizeof(int), cudaMemcpyDeviceToHost) );
	cutilSafeCall( cudaMemcpy(sum_of_cases_with_less_values_sum_arr, d_sum_of_cases_with_less_values_sum , temp_0gen*sizeof(int), cudaMemcpyDeviceToHost) );
	cutilSafeCall( cudaMemcpy(sum_of_cases_with_less_or_equal_values_sum_arr, d_sum_of_cases_with_less_or_equal_values_sum , temp_0gen*sizeof(int), cudaMemcpyDeviceToHost) );
	cutilSafeCall( cudaMemcpy(sum_of_cases_with_equal_values_sum_arr, d_sum_of_cases_with_equal_values_sum , temp_0gen*sizeof(int), cudaMemcpyDeviceToHost) );
	*/
	
	cudaMemcpy(sum_of_cases_with_more_values_sum_arr, d_sum_of_cases_with_more_values_sum , temp_0gen*sizeof(int), cudaMemcpyDeviceToHost);
	cudaMemcpy(sum_of_cases_with_more_or_equal_values_sum_arr, d_sum_of_cases_with_more_or_equal_values_sum , temp_0gen*sizeof(int), cudaMemcpyDeviceToHost);
	cudaMemcpy(sum_of_cases_with_less_values_sum_arr, d_sum_of_cases_with_less_values_sum , temp_0gen*sizeof(int), cudaMemcpyDeviceToHost);
	cudaMemcpy(sum_of_cases_with_less_or_equal_values_sum_arr, d_sum_of_cases_with_less_or_equal_values_sum , temp_0gen*sizeof(int), cudaMemcpyDeviceToHost);
	cudaMemcpy(sum_of_cases_with_equal_values_sum_arr, d_sum_of_cases_with_equal_values_sum , temp_0gen*sizeof(int), cudaMemcpyDeviceToHost);
	
	
	//t_shuffle.pause();
	
	cout << " Shuffle complete!"<<endl;
	//cout << "Time to permutation of rows = " << t_shuffle << " seconds." << endl;
	//cout << " shuffle time " << t_1 << endl;//
	//cout << " Calculate sum " << t_2 << endl;//
	//cout << " Calculate counting " <<t_3 << endl;//

	
	//timer::Timer t_stat(true);

	float *bArr, *bEArr, *sArr, *sEArr, *eArr;
	bArr = new float[temp_0gen];
	bEArr = new float[temp_0gen];
	sArr = new float[temp_0gen];
	sEArr = new float[temp_0gen];
	eArr = new float[temp_0gen];
	for (int i = 0; i < temp_0gen; i++)
	{
		if(sum_of_cases_with_more_values_sum_arr[i] > 0)
		{
			bArr[i] = (float)sum_of_cases_with_more_values_sum_arr[i]/(float)steps;
		}
		else 
		{
			bArr[i] = 1.f/(float)(steps+1);
		}

		if(sum_of_cases_with_more_or_equal_values_sum_arr[i] > 0)
		{
			bEArr[i] = (float)sum_of_cases_with_more_or_equal_values_sum_arr[i]/(float)steps;
		}
		else 
		{
			bEArr[i] = 1.f/(float)(steps+1);
		}

		if(sum_of_cases_with_less_values_sum_arr[i] > 0)
		{
			sArr[i] = (float)sum_of_cases_with_less_values_sum_arr[i]/(float)steps;
		}
		else 
		{
			sArr[i] = 1.f/(float)(steps+1);
		}

		if(sum_of_cases_with_less_or_equal_values_sum_arr[i] > 0)
		{
			sEArr[i] = (float)sum_of_cases_with_less_or_equal_values_sum_arr[i]/(float)steps;
		}
		else 
		{
			sEArr[i] =1.f/(float)(steps+1);
		}

		if(sum_of_cases_with_equal_values_sum_arr[i] > 0)
		{
			eArr[i] = (float)sum_of_cases_with_equal_values_sum_arr[i]/(float)steps;
		}
		else 
		{
			eArr[i] = 1.f/(float)(steps+1); 
		}
	}

	//t_stat.pause();
	//cout << "Time to gather statistics = " << t_stat << " seconds." << endl;

	ofstream out;
	out.open("output.txt");

	//t_all.pause();
	

	if(out == NULL) printf("file not found");
	else
	{
		out << "Count of string in file = "<< count_str - 1 <<endl;
		out << "Number of steps = "<< steps <<endl;
		out << "Size of sub sample = "<< subsample_size <<endl;
		out << "Count of FA = "<< temp_0gen <<endl;
		out << "Count of FA with non-zero value = "<< temp_1gen <<endl;
	//	out << "Full execution time = " << t_all << " seconds." << endl;
	//	out << "Time to parse the file = " << t_file << " seconds." << endl;
	//	out << "Time to permutation of rows = " << t_shuffle << " seconds." << endl;
	//	out << "Time to gather statistics = " << t_stat << " seconds." << endl;
		out << "----------Begin stat info----------"<< endl;
		out << "FA" << '\t'<< "No of All IDs" << '\t' << "No of IDs with NZ" << '\t'<<" s " << '\t' << " e " << '\t' << " b " << '\t' << " sE " << '\t' << " bE " <<endl;
		
		int ci = 0;
		for (IT_all_gen_in_term = all_gen_in_term.begin();IT_all_gen_in_term != all_gen_in_term.end();IT_all_gen_in_term++)
		{
			if(gen_in_term.count((*IT_all_gen_in_term).first) == 1)
			{
				out  << (*IT_all_gen_in_term).first << '\t'; //Имя ФА
				out  << (*FA_in_gen_all.find((*IT_all_gen_in_term).first)).second.size() << '\t';// Число генов с ФА
				out  << (*real_val_sum_for_term.find((*IT_all_gen_in_term).first)).second << '\t'; // Сумма значений генов с ФА
				out  << sArr[ci] << '\t'; 
				out  << eArr[ci] << '\t';
				out  << bArr[ci] << '\t';
				out  << sEArr[ci] << '\t';
				out  << bEArr[ci] << '\t';
				//out  << show(-1) << (*FA_in_gen.find((*IT_all_gen_in_term).first)).second << endl;
				}
			ci++;
		}
		out << "--------End File--------" << endl;
	}
	out.close();

	//-------------------Удаление объектов---------------------
	delete[] GEN_ID_arr;
	delete[] arr;
	cudaFree( d_AA );
	cudaFree( d_x );
	cudaFree( d_Ax );
	cudaFree( d_AxReal );
	cudaFree( d_sum_of_cases_with_more_values_sum );
	cudaFree( d_sum_of_cases_with_more_or_equal_values_sum );
	cudaFree( d_sum_of_cases_with_less_values_sum );
	cudaFree( d_sum_of_cases_with_less_or_equal_values_sum );
	cudaFree( d_sum_of_cases_with_equal_values_sum );
	//cudaFree( );
	//----------------Конец Удаления объектов------------------

	//cout << "Full execution time = " << t_all << " seconds." << endl;
	cout << " END! " << endl;
  printf ("success");
	//=========================================================
	//getchar();
  return EXIT_SUCCESS;

	//return 0;
}
