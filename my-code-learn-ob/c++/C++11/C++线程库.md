# thread类的简单介绍
在C++11之前，涉及到多线程问题，都是和平台相关的，比如windows和linux下各有自己的接口，这使得代码的可移植性比较差。C++11中最重要的特性就是对线程进行支持了，使得C++在 并行编程时**不需要依赖第三方库**，而且在原子操作中还引入了原子类的概念。要使用标准库中的线程，必须包含`<thread>`头文件。
[C++11中线程类](http://www.cplusplus.com/reference/thread/thread/?kw=thread)

| 函数名|功能|
|:-:|:-|
 |thread()|构造一个线程对象，没有关联任何线程函数，即没有启动任何线程|
|thread(fn,args1, args2,...)|构造一个线程对象，并关联线程函数fn,args1,args2，...为线程函数的参数|
|get_id()|获取线程id|
|joinable()|线程是否还在执行，joinable代表的是一个正在执行中的线程。|
|join()|该函数调用后会阻塞住线程，当该线程结束后，主线程继续执行|
|detach()|在创建线程对象后马上调用，用于把被创建线程与线程对象分离开，分离的线程变为后台线程，创建的线程的"死活"就与主线程无关|

1. 线程是操作系统中的一个概念，线程对象可以关联一个线程，用来控制线程以及获取线程的状态。

2. **当创建一个线程对象后，没有提供线程函数，该对象实际没有对应任何线程。**

3. 当**创建一个线程对象后**，并且给**线程关联线程函数**，该线程就被启动，与主线程一起运行。线程函数一般情况下可按照以下三种方式提供：
	- 函数指针
	- lambda表达式
	- 函数对象

4. ==thread类是**防拷贝**的==，**不允许拷贝构造以及赋值**，但是**可以移动构造和移动赋值**，即将一个线程对象关联线程的状态转移给其他线程对象，转移期间不意向线程的执行。

5. 可以通过joinable()函数判断线程是否是有效的，如果是以下任意情况，则线程无效
	- 采用无参构造函数构造的线程对象
	- 线程对象的状态已经转移给其他线程对象
	- 线程已经调用join或者detach结束

用法和[[Linux多线程|Linux的多线程]]差不多。不过linux中的更多是面向过程的，C++中则是面向对象。
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

# 线程函数参数
线程函数的参数是以==**值拷贝**==的方式拷贝到线程栈空间中的，因此：==即使线程参数为引用类型，在线程中修改后也不能修改外部实参，因为其实际引用的是线程栈中的拷贝，而不是外部实参==。

如果想要通过形参改变外部实参时，必须借助`std::ref()`函数
```cpp
#include <thread>
void ThreadFunc1(int& x)//引用 是不起作用的
{
	x += 10;
}

void ThreadFunc2(int* x)
{
	*x += 10;
}

int main()
{
	int a = 10;
	
	// 在线程函数中对a修改，不会影响外部实参，因为：线程函数参数虽然是引用方式，但其实际引用的是线程栈中的拷贝
	thread t1(ThreadFunc1, a);
	t1.join();
	cout << a << endl;
	
	// 如果想要通过形参改变外部实参时，必须借助std::ref()函数
	thread t2(ThreadFunc1, std::ref(a); 
	t2.join();
	cout << a << endl;
	
	thread t3(ThreadFunc2, &a);// 地址的拷贝
	t3.join();
	cout << a << endl;
	return 0;
}
```

如果是类成员函数作为线程参数时，必须将this作为线程函数参数。

# mutex
[[Linux多线程]]
在多线程环境下，如果想要保证某个变量的安全性，只要将其设置成对应的==原子类型==即可，即高效又不容易出现死锁问题。但是有些情况下，我们可能需要保证一段代码的安全性，那么就只能通过锁的方式来进行控制。

比如：一个线程对变量number进行加一100次，另外一个减一100次，每次操作加一或者减一之后，输出number的结果，要求：number最后的值为1。
```cpp
#include <thread>
#include <mutex>
int number = 0;
mutex g_lock;
int ThreadProc1()
{
	for (int i = 0; i < 100; i++)
	{
		g_lock.lock();
		++number;
		cout << "thread 1 :" << number << endl;
		g_lock.unlock();
	}
	return 0;
}

int ThreadProc2()
{
	for (int i = 0; i < 100; i++)
	{
		g_lock.lock();
		--number;
		cout << "thread 2 :" << number << endl;
		g_lock.unlock();
	}
	return 0;
}

int main()
{
	thread t1(ThreadProc1);
	thread t2(ThreadProc2);
	t1.join();
	t2.join();
	cout << "number:" << number << endl;
	system("pause");
	return 0;
}

```

## ### mutex的种类
在C++11中，Mutex总共包了四个互斥量的种类：

1.  std::mutex  
    C++11提供的最基本的互斥量，该类的对象之间不能拷贝，也不能进行移动。mutex最常用  
    的三个函数：
    
|==**函数名**==|==**函数功能**==|
|:-:|:-|
|lock()|上锁：锁住互斥量|
|unlock()|解锁：释放对互斥量的所有权|
|try_lock()|尝试锁住互斥量，如果互斥量被其他线程占有，则当前线程也不会被阻塞|
注意，线程函数调用lock()时，可能会发生以下三种情况：

- 如果该互斥量当前没有被锁住，则调用线程将该互斥量锁住，直到调用 unlock之前，该线程一直拥有该锁
- 如果当前互斥量被其他线程锁住，则当前的调用线程被阻塞住
- 如果当前互斥量被当前调用线程锁住，则会产生死锁(deadlock)

线程函数调用try_lock()时，可能会发生以下三种情况：
- 如果当前互斥量没有被其他线程占有，则该线程锁住互斥量，直到该线程调用 unlock释放互斥量
- 如果当前互斥量被其他线程锁住，则当前调用线程返回 false，而并不会被阻塞掉
- 如果当前互斥量被当前调用线程锁住，则会产生死锁(deadlock)

2. `std::recursive_mutex`
	其允许同一个线程对互斥量多次上锁（即==**递归上锁**==），来获得对互斥量对象的多层所有权，释放互斥量时需要调用与该锁层次深度相同次数的 unlock()，除此之外，`std::recursive_mutex` 的特性和 `std::mutex` 大致相同。

3. `std::timed_mutex`
	比` std::mutex `多了两个成员函数，`try_lock_for()`，`try_lock_until()` 。
	- `try_lock_for()`
		- 接受一个时间范围，表示在这一段时间范围之内线程如果没有获得锁则被阻塞住（与`std::mutex `的 `try_lock()` 不同，`try_lock`如果被调用时没有获得锁则直接返回`false`），如果在此期间其他线程释放了锁，则该线程可以获得对互斥量的锁，如果超时（即在指定时间内还是没有获得锁），则返回` false`。
	- `try_lock_until()`
		- 接受一个时间点作为参数，在指定时间点未到来之前线程如果没有获得锁则被阻塞住，如果在此期间其他线程释放了锁，则该线程可以获得对互斥量的锁，如果超时（即在指定时间内还是没有获得锁），则返回 `false`。

4. `std::recursive_timed_mutex`

### 锁加在何处？
但我们遇到需要加锁的环境，且这个环境中有循环，我们应该怎么加锁？为什么？
>- 锁加在何处其实是需要根据代码量来进行调整的，如果临界区只有一两条语句，锁应该加在循环外(串行)，若语句比较多，则加在循环内(并行)。
>- 原因如下
>	- ==**并行**==：如果临界区只有一两条语句，cpu的处理速度是十分快速的，如果我们的锁加在循环内，多个线程需要频繁的切换线程的上下文，而保存线程的上下文是需要时间的，切换时，线程不一定准备好了，需要等线程准备完毕，所以时间的比较耗时的，如果临界区的资源多，就不会出现此问题，就可以将锁加在循环内。
>	- ==**串行**==：如果临界区的只有一两条语句，将锁加在循环外，就避免了多线程之间的频繁切换上下文，当我们准确切换线程时，另一线程也已准备就绪，所以效率在此环境下比并行高。



#### 锁在循环内部
```cpp
#include <mutex>  
#include <thread>  
int x = 0;  
mutex mtx;  
void Func(int n)  
{  
   // 加锁，加再循环里面还是循环外面？为什么？  
   // 2  
   for (int i = 0; i < n; ++i)  
   {  
	   mtx.lock();  
   
      //cout << std::this_thread::get_id() <<"->"<< x << endl;      
      ++x;  
      
	   mtx.unlock();  
   }  
}  
int main()  
{  
   thread t1(Func, 5000000);  
   thread t2(Func, 5000000);  
  
   t1.join();  
   t2.join();  
  
   cout << x << endl;  
  
   return 0;  
}
```

#### 锁在循环内部
```cpp
#include <mutex>  
#include <thread>  
int x = 0;  
mutex mtx;  
void Func(int n)  
{  
   mtx.lock();  
   for (int i = 0; i < n; ++i)  
   {  
      //cout << std::this_thread::get_id() <<"->"<< x << endl;      
      ++x;  
   }
   mtx.unlock();  
     
}  
int main()  
{  
   thread t1(Func, 5000000);  
   thread t2(Func, 5000000);  
  
   t1.join();  
   t2.join();  
  
   cout << x << endl;  
  
   return 0;  
}
```

# 原子性操作库(atomic)
多线程最主要的问题是共享数据带来的问题(即线程安全)。如果共享数据都是只读的，那么没问题，因为只读操作不会影响到数据，更不会涉及对数据的修改，所以所有线程都会获得同样的数据。但是，当一个或多个线程要修改共享数据时，就会产生很多潜在的麻烦。

虽然加锁可以解决，但是加锁有一个缺陷就是：只要一个线程在对sum++时，其他线程就会被阻塞，会影响程序运行的效率，而且锁如果控制不好，还容易造成死锁。

因此C++11中引入了原子操作。所谓原子操作：即不可被中断的一个或一系列操作，C++11引入的原子操作类型，使得线程间数据的同步变得非常高效。

在C++11中，程序员不需要对原子类型变量进行加锁解锁操作，线程能够对原子类型变量互斥的访问。
更为普遍的，程序员可以使用atomic类模板，定义出需要的任意原子类型
```cpp
atmoic<T> t;   // 声明一个类型为T的原子类型变量t
```
原子类型通常属于"资源型"数据，多个线程只能访问单个原子类型的拷贝，因此在C++11中，**原子类型只能从其模板参数中进行构造，不允许原子类型进行拷贝构造、移动构造以及operator=等** ，为了防止意外，标准库已经将atmoic模板类中的拷贝构造、移动构造、赋值运算符重载默认删除掉了。
![[Pasted image 20221016224938.png]]
注意：需要使用以上原子操作变量时，必须添加头文件`<atomic>`

但临界区的数据很少时，可以将数据设置为原子操作变量。
```cpp
#include <iostream> 
using namespace std; 
#include <thread> 
#include <atomic>

atomic_long sum{ 0 }; 

void fun(size_t num)
{
	for (size_t i = 0; i < num; ++i) 
	sum ++;   // 原子操作
}

int main() 
{
	cout << "Before joining, sum = " << sum << std::endl; 
	thread t1(fun, 1000000);
	thread t2(fun, 1000000); 
	t1.join();
	t2.join();
	cout << "After joining, sum = " << sum << std::endl; 
	return 0;
}
```




# lock_guard
在多线程环境下，如果想要保证某个变量的安全性，只要将其设置成对应的原子类型即可，即高效又不容易出现死锁问题。但是有些情况下，我们可能需要保证一段代码的安全性，那么就只能通过锁的方式来进行控制。

`lock_guard` 对象的**拷贝构造和移动构造**(move construction)均**被禁用**，因此 `lock_guard` **对象不可被拷贝构造或移动构造**。

比如：一个线程对变量number进行加一100次，另外一个减一100次，每次操作加一或者减一之后，输出number的结果，要求：number最后的值为1。


在我们写代码的实际过程中，直接将一段代码加锁保护其实是不安全的，距举例以下的例子
```cpp
mutex mtx;
mtx.lock();
//代码段......
mtx.unlock();
```
==**为什么说他是不安全的呢？**==
1、从两个角度出发，如果代码在执行的过程中被突然中断了return后那么原来lock了之后锁是没有被释放的，如果是在多线程环境下这就会导致死锁，

先看`malloc`的表现，`malloc`失败后会返回null, 那么if判断之后，会直接返回`-1`, 整个程序就结束了，可是如果是多线程环境下，那么还是会死锁，一个线程拿到锁之后并没有释放，另外一个线程就会被卡在执行处.
```cpp
mutex mtx;
int func2() 
{
	
	mtx.lock();

	int* p = (int*)malloc(sizeof(int) * 10);
	if (!p) return -1; //内存申请失败后返回
	for (int i = 0; i < 10; i++) {
		*(p + i) = i;
	}
	for (int i = 0; i < 10; i++) cout << p[i] << " ";

	mtx.unlock();
}

int main()
{
	thread t1(func2);
	thread t2(func2);

	t1.join();
	t2.join();
	return 0;
}

```

2、如果抛==**异常**==了之后，跳转到catch处，可是catch并不能为你释放锁资源，那么也会导致死锁的问题

如果代码是正常执行的话，那么并没有什么问题，可以如果是在多线程的环境下new一旦失败了，就会抛异常而try 捕捉到了之后就会交给catch处理，可是catch也并没有去释放锁。

以下代码已做catch处理。
```cpp
#include <mutex>  
#include <thread>  
#include <atomic>  
  
void func(vector<int>& v, int n, int base, mutex& mtx)  
{  
   try  
   {  
      // 死锁  
      for (int i = 0; i < n; ++i)  
      {  
         mtx.lock();  
         cout << this_thread::get_id() << ":" << base + i << endl;  
  
         // 失败了 抛异常 -- 异常安全的问题  
         v.push_back(base+i);  
         // 模拟push_back失败抛异常  
         if (base == 1000 && i == 888)  
            throw bad_alloc();  
  
         mtx.unlock();  
      }  
   }  
   catch (const exception& e)  
   {  
      cout << e.what() << endl;  
      mtx.unlock();  
   }  
}  
  
int main()  
{  
   thread t1, t2;  
   vector<int> vec;  
   mutex mtx;  
  
   try   {  
      t1 = thread(func, std::ref(vec), 1000, 1000, std::ref(mtx));  
      t2 = thread(func, std::ref(vec), 1000, 2000, std::ref(mtx));  
   }  
   catch (const exception& e)  
   {  
      cout << e.what() << endl;  
   }  
  
   t1.join();  
   t2.join();  
  
   for (auto e : vec)  
   {  
      cout << e << " ";  
   }  
   cout << endl << endl;  
   cout << vec.size() << endl;  
  
  
   return 0;  
}
```

锁控制不好时，可能会造成死锁，最常见的比如在锁中间代码返回，或者在锁的范围内抛异常。因此：C++11采用==RAII（ RAII (Resource Acquisition Is Initialization)是一种利用对象生命周期来控制程序资源(如内存、文件句 柄r网络连接、斥量等等)的简单技术==。 ）的方式对锁进行了封装，即 **`lock_guard`** 和 **`unique_lock`** ，引入`lock_guard`之后，并不会出现这样的问题

## lock_guard的实现
```cpp
template<class Lock>

class LockGuard // 锁的守卫
{
public:
	LockGuard(Lock& lock)
		:_lock(lock)
	{
		_lock.lock();
	}

	~LockGuard()
	{
		_lock.unlock();
	}

private:
	Lock& _lock;
};
```
此时我们可以发现，在使用`lock_guard`之后，无论是抛异常还是程序中间返回，都会被处理。
通过上述代码可以看到，`lock_guard`类模板主要是通过==RAII==的方式，对其管理的互斥量进行了封装，在需要加锁的地方，只需要用上述介绍的任意互斥体实例化一个lock_guard，**调用构造函数成功上锁，出作用域前, lock_guard对象要被销毁，调用析构函数自动解锁**，可以有效避免死锁问题。

### lock_guard的使用
```cpp
// 模拟lock_guard的实现过程
namespace mzt 
{
	template<class T>
	class lock_guard
	{
	public:
		lock_guard(T& lock) : _lock(lock)
		{
			_lock.lock();
		}
		~lock_guard() { _lock.unlock(); }
		
	
		lock_guard(lock_guard<T>& lock) = delete;
		lock_guard<T>& operator=(lock_guard<T>& lock) = delete;
	private:
		T& _lock;
	};

}
mutex mtx;
int func2() 
{
	mzt::lock_guard<mutex> lg (mtx);
	//mtx.lock();

	int* p = (int*)malloc(sizeof(int) * 10);
	if (!p) return -1; //内存申请失败后返回
	for (int i = 0; i < 10; i++) {
		*(p + i) = i;
	}
	for (int i = 0; i < 10; i++) cout << p[i] << " ";

	//mtx.unlock();
	return 0;
}

int main()
{
	thread t1(func2);
	thread t2(func2);
	//test();

	t1.join();
	t2.join();
	return 0;
}

```

lock_guard的缺陷：太单一，用户没有办法对该锁进行控制，因此C++11又提供了unique_lock。

# unique_lock
与`lock_gard`类似，`unique_lock`类模板也是采用==RAII==的方式对锁进行了封装，并且也是以独占所有权的方式，管理mutex对象的上锁和解锁操作，即**其对象之间不能发生拷贝**。
在**构造**(或**移动(move)赋值**)时，`unique_lock` 对象需要传递一个 `Mutex` 对象作为它的参数，**新创建的 unique_lock 对象负责传入的 `Mutex`对象的上锁和解锁操作**。
使用以上类型互斥量实例化`unique_lock`的对象时，自动调用构造函数上锁，unique_lock对象销毁时自动调用析构函数解锁，可以很方便的防止死锁问题。 
与lock_guard不同的是，`unique_lock`**更加的灵活，提供了更多的成员函数**：

- ==**上锁/解锁操作**==：lock、try_lock、try_lock_for、try_lock_until和unlock

- ==**修改操作**== ：移动赋值、交换(swap：与另一个unique_lock对象互换所管理的互斥量所有权)、释放(release：返回它所管理的互斥量对象的指针，并释放所有权)

- ==**获取属性**==：owns_lock(返回当前对象是否上了锁)、operator bool()(与owns_lock()的功能相同)、mutex(返回当前unique_lock所管理的互斥量的指针)。

## lock_guard 和 unique_lock详解链接
[lock_guard/unique_lock详解](https://blog.csdn.net/zzhongcy/article/details/85230200)
