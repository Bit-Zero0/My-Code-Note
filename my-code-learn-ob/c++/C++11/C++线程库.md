# thread类的简单介绍
在C++11之前，涉及到多线程问题，都是和平台相关的，比如windows和linux下各有自己的接口，这使得代码的可移植性比较差。C++11中最重要的特性就是对线程进行支持了，使得C++在 并行编程时不需要依赖第三方库，而且在原子操作中还引入了原子类的概念。要使用标准库中的 
线程，必须包含`<thread>`头文件。
[C++11中线程类](http://www.cplusplus.com/reference/thread/thread/?kw=thread)

| 函数名|功能|
|:-:|:-|
 |thread()|构造一个线程对象，没有关联任何线程函数，即没有启动任何线程|
|thread(fn,args1, args2,...)|构造一个线程对象，并关联线程函数fn,args1,args2，...为线程函数的参数|
|get_id()|获取线程id|
|joinable()|线程是否还在执行，joinable代表的是一个正在执行中的线程。|
|join()|该函数调用后会阻塞住线程，当该线程结束后，主线程继续执行|
|detach()|在创建线程对象后马上调用，用于把被创建线程与线程对象分离开，分离的线程变为后台线程，创建的线程的"死活"就与主线程无关|
用法和[[多线程|Linux的多线程]]差不多。不过linux中的更多是面向过程的，C++中则是面向对象。
```cpp
#include <thread>
#include <vector>
void Print(int x)
{
	for (int i = 0; i < x; ++i) {
		cout << i << endl;
	}
}

int main()
{
	int n;
	cin >> n;
	vector<thread>vthds;
	vthds.resize(n);

	for (auto& t : vthds)
	{
		t = thread(Print, 100);
	}

	for (auto& t : vthds)
	{
		t.join();
	}
	return 0;
}
```