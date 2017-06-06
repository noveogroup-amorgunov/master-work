#ifndef SAN_TIMER_H
#define SAN_TIMER_H



/*
	Copyright 2011 Sukhinov Anton
	E-mail: Soukhinov@gmail.com
	http://iproc.ru

	Version 1.3

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU Lesser General Public License as published
	by the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Lesser General Public License for more details.

	You should have received a copy of the GNU Lesser General Public License
	along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

#include <cassert>

#ifndef __OPENCV_CORE_HPP__
	//#define WINDOWS_LEAN_AND_MEAN 1
	//#include <windows.h>
#endif

#undef min
#undef max

namespace timer
{

	class Frequency
	{ //����� ��� ��������� � �������� ������� �������
	public:
		#ifndef __OPENCV_CORE_HPP__
			typedef long long Time;
		#else
			typedef double Time;
		#endif

	private:
		Time v; //������� ������� ��� �������� Time � �������

		inline Frequency(Frequency const &);            //������� ����������� �����
		inline Frequency &operator=(Frequency const &); //������� �������� ������������

	public:
		inline Frequency(void);  //����������� ��-���������
		inline ~Frequency(void); //����������

		inline Time value(void) const;
	};

	//***********************************************************************************************************

	Frequency const frequency; //������� ������� ��� �������� Time � �������

	//***********************************************************************************************************

	class Timer
	{ //����� Timer ��������� ����� ������� �������,
	  //  ������� ����� ��������� � ����������
	public:
		typedef long long Time;

	private:
		//���� true, �� ������ �������. ����� -- ���
		bool state;

		//������� ������� �������� �� ��� ���������� ���������
		Time timeTotal;
		//������ ������ ����������, ��� �������������� ��������� (���� �������)
		Time timeLastStart;

		//������ ������� �������� ������� � "�����"
		static inline Time now(void);

	public:
		//����������� ��-���������
		inline Timer(bool start = false);
		//����������� �����
		inline Timer(Timer const &T);
		//����������
		inline ~Timer(void);
		//�������� ������������
		inline Timer &operator=(Timer const &T);

		//������ ������� �������� ������� � ��������
		inline double get(void) const;
		//������ ������� �������� ������� � ��������
		inline operator double(void) const;
		//������ ������� �������� ������� � "�����" (������������ ��������)
		inline Time getTickCount(void) const;
		//������ ������� ������� (����� "�����" � �������)
		static inline Frequency::Time getFrequency(void);

		//��������� ������
		inline void start(bool reset = false);
		//��������� ������ � ������ �������� �� ������ �������
		inline double startGet(void);

		//����� �������
		inline void pause(void);
		//����� ������� � ������� ��������
		inline double pauseGet(void);

		//��������� �������. ���������� �� ����� ���������� ��������
		inline void stop(void);
		//��������� �������. ������������ �������� �� ������ ���������, �� ���������
		inline double stopGet(void);
	};

	//***********************************************************************************************************

	inline Frequency::Frequency(void): v(0)
	{ //����������� ��-���������
		#ifdef __OPENCV_CORE_HPP__
			v = cv::getTickFrequency();
		#else
			if( !QueryPerformanceFrequency( reinterpret_cast<LARGE_INTEGER *>(&v) ) ) v = 0;
		#endif
		assert( v );
	}

	inline Frequency::~Frequency(void)
	{ //����������
		;
	}

	inline Frequency::Time Frequency::value(void) const
	{
		return v;
	}

	//***********************************************************************************************************

	inline Timer::Time Timer::now(void)
	{ //������ ������� �������� ������� � "�����"
		Timer::Time timeNow;
		#ifdef __OPENCV_CORE_HPP__
			timeNow = cv::getTickCount();
		#else
			BOOL const res( QueryPerformanceCounter( reinterpret_cast<LARGE_INTEGER *>(&timeNow) ) );
			assert( res );
		#endif
		return timeNow;
	}

	inline Timer::Timer(bool const startNow): state(false),
	                                          timeTotal(0),
	                                          timeLastStart(0)
	{ //����������� ��-���������
		if(startNow) start();
	} 

	inline Timer::Timer(Timer const &T): state(T.state),
	                                     timeTotal(T.timeTotal),
	                                     timeLastStart(T.timeLastStart)
	{ //����������� �����
		;
	}

	inline Timer::~Timer(void)
	{ //����������
		;
	}

	inline Timer &Timer::operator=(Timer const &T)
	{ //�������� ������������
		state         = T.state;
		timeTotal     = T.timeTotal;
		timeLastStart = T.timeLastStart;
		return *this;
	}

	inline double Timer::get(void) const
	{ //������ ������� �������� ������� � ��������
		if(state) //������ �����
			return static_cast<double>( timeTotal + ( now() - timeLastStart ) ) / getFrequency();
		else //������ ����������
			return static_cast<double>( timeTotal ) / getFrequency();
	}

	inline Timer::operator double(void) const
	{
		return get();
	}

	inline Timer::Time Timer::getTickCount(void) const
	{ //������ ������� �������� ������� � "�����"
		if(state) //������ �����
			return timeTotal + ( now() - timeLastStart );
		else //������ ����������
			return timeTotal;
	}

	inline Frequency::Time Timer::getFrequency(void)
	{ //������ ������� ������� (����� "�����" � �������)
		return frequency.value();
	}

	inline void Timer::start(bool const reset)
	{ //��������� ������
		assert( !state );
		state = true;
		if(reset) timeTotal = 0;
		timeLastStart = now(); //������ �������
	}

	inline double Timer::startGet(void)
	{ //��������� ������ � ������ �������� �� ������ �������
		assert( !state );
		double const res( get() ); //����� �����. ����� ������� �� �������� ������, ������� get() �� ������
		state = true;
		timeLastStart = now(); //������ �������
		return res;
	}

	inline void Timer::pause(void)
	{ //����� �������
		assert( state );
		state = false;
		timeTotal += now() - timeLastStart; //����� �������
	}

	inline double Timer::pauseGet(void)
	{ //����� ������� � ������� ��������
		assert( state );
		state = false;
		timeTotal += now() - timeLastStart; //����� �������
		return get();
	}

	inline void Timer::stop(void)
	{ //��������� �������. ���������� �� ����� ���������� ��������
		assert( state );
		state = false;
		timeTotal = 0; //��������� �������
	}

	inline double Timer::stopGet(void)
	{ //��������� �������. ������������ �������� �� ������ ���������, �� ���������
		assert( state );
		state = false;
		timeTotal += now() - timeLastStart; //����� �������
		double const res( get() ); //����� ������� ���������� ����� �� ������ ���������
		timeTotal = 0; //������� ���������� �����
		return res; //��������� ����� �� ���������
	}

}

#endif //#ifndef SAN_TIMER