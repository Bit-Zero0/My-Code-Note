# 为什么需要智能指针？
1. `malloc`出来的空间，**没有进行释放，存在内存泄漏的问题**。
2. [[C++异常#异常安全|异常安全]]问题。如果在`malloc`和`free`之间如果存在抛异常，那么还是有**内存泄漏**。这种问题就叫异常安全。
3. C++库中的智能指针都定义在`<memory>`这个头文件中. 

# 内存泄漏

## 什么是内存泄漏，内存泄漏的危害
==**什么是内存泄漏**==：**内存泄漏指因为疏忽或错误造成程序未能释放已经不再使用的内存的情况**。内存泄漏并不是指内存在物理上的消失，而是应用程序分配某段内存后，因为设计错误，失去了对该段内存的控制，因而造成了内存的浪费。
==**内存泄漏的危害**==：长期运行的程序出现内存泄漏，影响很大，如操作系统、后台服务等等，出现内存泄漏会导致响应越来越慢，最终卡死。

## 内存泄漏分类（了解）
C/C++程序中一般我们关心两种方面的内存泄漏：

- ==**堆内存泄漏(Heap leak)**==
	- **堆内存**指的是程序执行中依据须要分配通过`malloc / calloc / realloc / new`等从堆中分配的一块内存，用完后必须通过调用相应的 `free`或者`delete` 删掉。假设程序的设计错误导致这部分内存没有被释放，那么以后这部分空间将无法再被使用，就会产生**Heap Leak**。
- ==**系统资源泄漏**==
	- 指程序使用系统分配的资源，比方**套接字**、**文件描述符**、**管道**等**没有使用对应的函数释放**掉，导致系统资源的浪费，严重可导致系统效能减少，系统执行不稳定。

##  如何检测内存泄漏（了解）
- 在linux下内存泄漏检测：[linux下几款内存泄漏检测工具](https://blog.csdn.net/gatieme/article/details/51959654) 
- 在windows下使用第三方工具：[VLD工具说明](https://blog.csdn.net/GZrhaunt/article/details/56839765)
- 其他工具：[内存泄漏工具比较](https://www.cnblogs.com/liangxiaofeng/p/4318499.html)


## 如何避免内存泄漏
1. 工程前期良好的设计规范，养成良好的编码规范，申请的内存空间记着匹配的去释放。ps：这个理想状态。但是如果碰上[[C++异常]]时，就算注意释放了，还是可能会出问题。需要下一条智能指针来管理才有保证。
2. 采用**RAII思想**或者**智能指针**来管理资源。
3. 有些公司内部规范使用内部实现的私有内存管理库。这套库自带内存泄漏检测的功能选项。
4. 出问题了使用内存泄漏工具检测。ps：不过很多工具都不够靠谱，或者收费昂贵。

==**总结一下:**==
内存泄漏非常常见，解决方案分为两种：
1. 事前预防型。如智能指针等。
2. 事后查错型。如泄漏检测工具。

# 智能指针的使用及原理

## RAII
RAII（Resource Acquisition Is Initialization）是一种**利用对象生命周期来控制程序资源**（如内存、文件句 
柄、网络连接、互斥量等等）的简单技术。
**在对象构造时获取资源**，接着控制对资源的访问使之在对象的生命周期内始终保持有效，**最后在对象析构的 
时候释放资源**。借此，我们实际上把管理一份资源的责任托管给了一个对象。这种做法有两大好处：
- ==不需要显式地释放资源==。
- 采用这种方式，==对象所需的资源在其生命期内始终保持有效==。
```cpp
// 使用RAII思想设计的SmartPtr类
template<class T>
class SmartPtr
{
public:
	SmartPtr(T* ptr = nullptr)
		:_ptr(ptr)
	{}

	~SmartPtr()
	{
		cout << "delete:" << _ptr << endl;
		delete _ptr;
	}

	// 像指针一样使用
	T& operator*()
	{
		return *_ptr;
	}

	T* operator->()
	{
		return _ptr;
	}
private:
	T* _ptr;
};
```

### SmartPtr简单使用
```cpp
struct Date
{
	int _year;
	int _month;
	int _day;
};

int main()
{
	SmartPtr<int> sp1(new int); //使用构造函数进行初始化智能指针sp1
	*sp1 = 10;
	cout << *sp1 << endl;
	SmartPtr<int> sparray(new Date);//使用构造函数进行初始化智能指针sparray
	// 需要注意的是这里应该是sparray.operator->()->_year = 2018; 
	// 本来应该是sparray->->_year这里语法上为了可读性，省略了一个->
	sparray->_year = 2018;
	sparray->_month = 1;
	sparray->_day = 1;
}//生命周期结束时会调用析构函数回收我们开辟的空间
```
总结一下智能指针的原理：
1. RAII特性
2. 重载`operator*`和 `opertaor->` ，具有像指针一样的行为。



# auto_ptr
[std::auto_ptr文档](http://www.cplusplus.com/reference/memory/auto_ptr/)
C++98版本的库中就提供了auto_ptr的智能指针。下面演示的auto_ptr的使用及问题。
```cpp
auto_ptr<string> p1 (new string ("I reigned lonely as a cloud.")); 
auto_ptr<string> p2; 
p2 = p1; //auto_ptr不会报错.
```

```cpp

#include <memory> 
class Date
{ 
public:
	Date() { cout << "Date()" << endl;} 
	~Date(){ cout << "~Date()" << endl;}
	int _year; 
	int _month;
	int _day; 
};

int main() 
{
	auto_ptr<Date> ap(new Date); 
	auto_ptr<Date> copy(ap);
	// auto_ptr的问题：当对象拷贝或者赋值后，前面的对象就悬空了
	// C++98中设计的auto_ptr问题是非常明显的，所以实际中很多公司明确规定了不能使用auto_ptr 
	ap->_year = 2018;
	return 0; 
}
```

auto_ptr的实现原理：管理权转移的思想，下面**简化模拟实现**了一份`auto_ptr`来了解它的原理
```cpp
template<class T>
class auto_ptr
{
public:
	auto_ptr(T* ptr)
		:_ptr(ptr)
	{}

	// 一旦发生拷贝，就将sp中资源转移到当前对象中，然后另sp与其所管理资源断开联系， 
	// 这样就解决了一块空间被多个对象使用而造成程序奔溃问题
	auto_ptr(auto_ptr<T>& sp)
		:_ptr(sp._ptr)
	{
		// 管理权转移
		sp._ptr = nullptr;
	}

	~auto_ptr()
	{
		if (_ptr)
		{
			cout << "delete:" << _ptr << endl;
			delete _ptr;
		}
	}

	AutoPtr<T>& operator=(AutoPtr<T>& ap) 
    {
		// 检测是否为自己给自己赋值 
		if(this != &ap)
		{
			// 释放当前对象中资源 
			if(_ptr)
				delete _ptr;
			
			// 转移ap中资源到当前对象中 
			_ptr = ap._ptr;
			ap._ptr = NULL;
		}
		return *this;
    }

	T& operator*()
	{
		return *_ptr;
	}

	T* operator->()
	{
		return _ptr;
	}
private:
	T* _ptr;
};
```

# unique_ptr
C++11中开始提供更靠谱的`unique_ptr`
[unique_ptr文档](http://www.cplusplus.com/reference/memory/unique_ptr/)

**`unique_ptr`用于替换`auto_ptr`，实现了独占式拥有概念，保证同一时间内只有一个智能指针可以指向该对象。为此，unique_ptr的拷贝构造和拷贝赋值均被声明为`delete`。因此==无法实施拷贝==和==赋值操作==，但可以移动构造和移动赋值**。它对于避免资源泄露(例如“以new创建对象后因为发生异常而忘记调用delete”)特别有用。
```cpp
unique_ptr<string> p3 (new string ("auto"));  
unique_ptr<string> p4；                       
p4 = p3;//此时会报错！！
```
编译器认为p4=p3非法，避免了p3不再指向有效数据的问题。尝试复制p3时会编译期出错，而auto_ptr能通过编译期从而在运行期埋下出错的隐患。因此，unique_ptr比auto_ptr更安全。

另外unique_ptr还有更聪明的地方：当程序试图将一个 unique_ptr 赋值给另一个时，如果源 unique_ptr 是个临时右值，编译器允许这么做；如果源 unique_ptr 将存在一段时间，编译器将禁止这么做，比如：
```cpp
unique_ptr<string> pu1(new string ("hello world")); 
unique_ptr<string> pu2; 
pu2 = pu1;                                      // #1 不允许
unique_ptr<string> pu3; 
pu3 = unique_ptr<string>(new string ("You"));   // #2 允许
```

其中#1留下悬挂的unique_ptr(pu1)，这可能导致危害。而#2不会留下悬挂的unique_ptr，因为它调用 unique_ptr 的构造函数，该构造函数创建的临时对象在其所有权让给 pu3 后就会被销毁。这种随情况而已的行为表明，unique_ptr 优于允许两种赋值的auto_ptr 。

**如果确实想执行类似与#1的操作，C++有一个标准库函数std::move()，让你能够将一个unique_ptr赋给另一个**。例如：
```cpp
unique_ptr<string> ps1, ps2;
ps1 = demo("hello");
ps2 = move(ps1);
ps1 = demo("alexia");
cout << *ps2 << *ps1 << endl;
```

## `unique_ptr`的模拟实现
```cpp
template<class T>
class UniquePtr
{
public:
	UniquePtr(T* ptr = nullptr)
		: _ptr(ptr)
	{}
	
	~UniquePtr()
	{
		if (_ptr)
			delete _ptr;
	}
	
	T& operator*() { return *_ptr; }
	T* operator->() { return _ptr; }


private:
	// C++98防拷贝的方式：只声明不实现+声明成私有 
	UniquePtr(UniquePtr<T> const&);
	UniquePtr& operator=(UniquePtr<T> const&);
	
	// C++11防拷贝的方式：delete
	UniquePtr(UniquePtr<T> const&) = delete;
	UniquePtr& operator=(UniquePtr<T> const&) = delete;

private:
	T* _ptr;
};
```

# shared_ptr
**`shared_ptr`实现共享式拥有概念。通过引用计数，多个智能指针可以指向相同对象，该对象和其相关资源会在最后一个引用被销毁时候释放。**

它使用计数机制来表明资源被几个指针共享。可以通过成员函数`use_count()`来查看**资源的所有者个数**。除了可以通过`new`来构造，还可以通过传入`auto_ptr` ,  `unique_ptr`, `weak_ptr`来构造。

当复制一个`shared_ptr`，**引用计数会`+1`**。**当我们调用`release()`或者当一个`shared_ptr`离开作用域时，计数减1（普通的指针如果没有delete操作，离开作用域时并不会被释放，只有在进程结束后才会被释放）。当计数等于0时，则delete内存。**

成员函数：
>`use_count` ：返回引用计数的个数
>`unique` ：返回是否是独占所有权( use_count 为 1)
>`swap` ：交换两个 shared_ptr 对象(即交换所拥有的对象)
>`reset` ：放弃内部对象的所有权或拥有对象的变更, 会引起原有对象的引用计数的减少
>`get` ：返回内部对象(指针)


## share_ptr模拟实现
```cpp
template <class T>
class shared_ptr
{
public:
	shared_ptr(T* ptr = nullptr)
		:_ptr(ptr)
		, _pRefCount(new int(1))
	{}

	shared_ptr(const shared_ptr<T>& sp)
		:_ptr(sp._ptr)
		, _pRefCount(sp._pRefCount)
	{
		AddRef();
	}


	int AddRef()
	{
		return ++(*_pRefCount);
	}

	void Release()
	{
		if (--(*_pRefCount) == 0 && _ptr)//析构1个引用计数时，释放资源
		{
			cout << "delete:" << _ptr << endl;
			delete _ptr;
			delete _pRefCount;

			//_ptr = nullptr;
			//_pRefCount = nullptr;
		}
	}

	shared_ptr<T>& operator=(const shared_ptr<T>& sp)
	{
		if (_ptr != sp._ptr)
		{
			Release();//先对之前指向的对象的引用计数-1.

			_ptr = sp._ptr;
			_pRefCount = sp._pRefCount;
			AddRef();//对现指向对象的引用计数+1；
		}

		return *this;
	}

	int use_count()
	{
		return *_pRefCount;
	}

	~shared_ptr()
	{
		Release();
	}

	T& operator*()
	{
		return *_ptr;
	}

	T* operator->()
	{
		return _ptr;
	}

	T* get() const
	{
		return _ptr;
	}

private:
	T* _ptr;
	int* _pRefCount; //定义在堆上才能共用 引用计数
};

int main()
{
	fmy::shared_ptr<int> sp1(new int);
 	fmy::shared_ptr<int> sp2(sp1);
	fmy::shared_ptr<int> sp3(sp1);

	fmy::shared_ptr<int> sp4(new int);
	fmy::shared_ptr<int> sp5(sp4);

	sp1 = sp1;
	sp1 = sp2;

	sp1 = sp4;
	sp2 = sp4;
	sp3 = sp4;

	*sp1 = 2;
	*sp2 = 3;

	return 0;
}
```

### share_ptr模拟实现(线程安全版)
[[C++线程库|多个线程]]中对同一个智能指针对象进行拷贝和析构时，`++`和`--`引用计数引用计数存在**线程安全**的问题，所以需要对引用计数进行加锁。但是这只保证了引用计数的线程安全，但没有保证其他数据的线程安全
```cpp
template <class T>
class shared_ptr
{
public:
	shared_ptr(T* ptr = nullptr)
		:_ptr(ptr)
		, _pRefCount(new int(1))
		, _pmtx(new mutex)
	{}

	shared_ptr(const shared_ptr<T>& sp)
		:_ptr(sp._ptr)
		, _pRefCount(sp._pRefCount)
		,_pmtx(sp._pmtx)
	{
		AddRef();
	}


	void AddRef()
	{
		_pmtx->lock;
		++(*_pRefCount);
		_pmtx->unlock();
	}

	void Release()
	{
		_pmtx->lock();

		bool flag = false;//定义的一个标志位，用于锁的回收
		if (--(*_pRefCount) == 0 && _ptr)//析构1个引用计数时，释放资源
		{
			cout << "delete:" << _ptr << endl;
			delete _ptr;
			delete _pRefCount;

			flag = true; //成功回收智能指针时，标志位为true。
		}

		_pmtx->unlock();

		if (flag)//当标志位为 true 时 ， 则释放锁
		{
			delete _pmtx;
		}
	}

	shared_ptr<T>& operator=(const shared_ptr<T>& sp)
	{
		if (_ptr != sp._ptr)
		{
			Release();//先对之前指向的对象的引用计数-1.

			_ptr = sp._ptr;
			_pRefCount = sp._pRefCount;
			_pmtx = sp._pmtx;
			AddRef();//对现指向对象的引用计数+1；
		}

		return *this;
	}

	int use_count()
	{
		return *_pRefCount;
	}

	~shared_ptr()
	{
		Release();
	}

	T& operator*()
	{
		return *_ptr;
	}

	T* operator->()
	{
		return _ptr;
	}

	T* get() const
	{
		return _ptr;
	}

private:
	T* _ptr;
	int* _pRefCount;//定义在堆上才能共用 引用计数
	mutex* _pmtx; //因为要共用一把锁，所以需要定义在堆上
};
```
但是这只保证了引用计数的线程安全，但没有保证其他数据的线程安全，如以下场景
```cpp
struct Date
{
	int _year = 0;
	int _month = 0;
	int _day = 0;
};
void SharePtrFunc(fmy::shared_ptr<Date>& sp, size_t n)
{
	cout << sp.get() << endl;

	for (size_t i = 0; i < n; ++i)
	{
		// 这里智能指针拷贝会++计数，智能指针析构会--计数，这里是线程安全的。
		fmy::shared_ptr<Date> copy(sp);

		// 这里智能指针访问管理的资源，不是线程安全的。所以我们看看这些值两个线程++了2n次，但是最终看到的结果，并一定是加了2n
		copy->_year++;
		copy->_month++;
		copy->_day++;
	}
}

int main()
{
	fmy::shared_ptr<Date> p(new Date);
	cout << p.get() << endl;
	const size_t n = 100000;
	thread t1(SharePtrFunc, std::ref(p), n);
	thread t2(SharePtrFunc, std::ref(p), n);

	t1.join();
	t2.join();

	cout << p->_year << endl;
	cout << p->_month << endl;
	cout << p->_day << endl;

	cout << p.use_count() << endl;

	return 0;
}
```
![[Pasted image 20221020211907.png]]

我们只保证了shared_ptr 中 引用计数的安全，因为Date的数据并不是在shared_ptr 类中中进行调用的，所以无法保证线程安全。那如何保证所有数据的线程安全呢？ 在调用的这层进行加锁。

### share_ptr模拟实现(线程安全版PLUS)
```cpp
struct Date
{
	int _year = 0;
	int _month = 0;
	int _day = 0;
};

void SharePtrFunc(fmy::shared_ptr<Date>& sp, size_t n , mutex& mtx)
{
	cout << sp.get() << endl;

	for (size_t i = 0; i < n; ++i)
	{
		// 这里智能指针拷贝会++计数，智能指针析构会--计数，这里是线程安全的。
		fmy::shared_ptr<Date> copy(sp);


		{
			unique_lock<mutex> lock(mtx); //在匿名作用域中进行加锁，出作用域也代表生命周期结束，自动解锁
			copy->_year++;
			copy->_month++;
			copy->_day++;
		}
	}
}

int main()
{
	fmy::shared_ptr<Date> p(new Date);
	cout << p.get() << endl;
	const size_t n = 50000;
	mutex mtx; //申请一把锁

	//将锁传入两个线程
	thread t1(SharePtrFunc, std::ref(p), n , std::ref(mtx));
	thread t2(SharePtrFunc, std::ref(p), n , std::ref(mtx));

	t1.join();
	t2.join();

	cout << p->_year << endl;
	cout << p->_month << endl;
	cout << p->_day << endl;

	cout << p.use_count() << endl;

	return 0;
}
```
![[Pasted image 20221020213339.png]]
此时就真正实现的线程安全了。


## 循环引用
```cpp
struct ListNode
{
	int _val;
	std::shared_ptr<ListNode> _next;
	std::shared_ptr<ListNode> _prev;

	~ListNode()
	{
		cout << "~ListNode()" << endl;
	}
};

int main()
{
	std::shared_ptr<ListNode> n1(new ListNode);
	std::shared_ptr<ListNode> n2(new ListNode);
	
	n1->_next = n2;

	return 0;
}
```
先看运行结果：正确调用了析构函数
![[Pasted image 20221020214859.png]]

如果我们在加一句	`n2->_prev = n1;` 呢？
```cpp
int main()
{
	std::shared_ptr<ListNode> node1(new ListNode);
	std::shared_ptr<ListNode> node2(new ListNode);

	node1->_next = node2;
	node2->_prev = node1;

	return 0;
}
```
![[Pasted image 20221020215046.png]]

结果却什么都没有。原因就在于出现了**循环引用**。
![[Pasted image 20221020213853.png]]
==**循环引用分析：**==
1. node1和node2两个智能指针对象指向两个节点，引用计数变成 1，我们不需要手动`delete`。
2. node1的`_next`指向node2，node2的`_prev`指向node1，引用计数变成2。
3. node1和node2析构，引用计数减到1，但是`_next`还指向下一个节点。但是`_prev`还指向上一个节点。
4. 也就是说`_next`析构了，node2就释放了。
5. 也就是说`_prev`析构了，node1就释放了。
6. 但是`_next`属于node的成员，node1释放了，`_next`才会析构，而node1由`_prev`管理，`_prev`属于node2成员，所以这就叫循环引用，谁也不会释放。

如果要解决循环引用，那就少不了 `weak_ptr`.

# weak_ptr
`weak_ptr`**不会增加引用计数**，**不影响对象的生命周期**，C++11标准虽然将 `weak_ptr` 定位为智能指针的一种，但该类型指针通常不单独使用，更像是为`shared_ptr` 而生，只能和 shared_ptr 类型指针搭配使用。

`weak_ptr`是一种不控制所指向对象生存期的智能指针，==它指向一个由`shared_ptr`管理的对象，将一个`weak_ptr`绑定到一个`shared_ptr` **不会改变** `shared_ptr`的**引用计数**==。**一旦最后一个指向对象的shared_ptr被销毁，对象就会被释放，即使有weak_ptr指向对象，对象还是会被释放**。

`weak_ptr` 模板类中没有重载 `*` 和 `->` 运算符，这也就意味着，`weak_ptr` 类型指针**只能访问**所指的**堆内存**，而**无法修改**它。  
由于`weak_ptr`指向的对象可能被释放，所以提供了`expired()`函数来**判断所指对象是否已经被销毁**。
![[Pasted image 20221020220754.png]]

## weak_ptr的使用
解决上述的shared_ptr 循环引用问题。
```cpp
struct ListNode
{
	int _val;
	//std::shared_ptr<ListNode> _next;
	//std::shared_ptr<ListNode> _prev;

	//更改为weak_ptr
	std::weak_ptr<ListNode> _next;
	std::weak_ptr<ListNode> _prev;

	~ListNode()
	{
		cout << "~ListNode()" << endl;
	}
};

int main()
{
	std::shared_ptr<ListNode> n1(new ListNode);
	std::shared_ptr<ListNode> n2(new ListNode);

	// 循环引用
	n1->_next = n2;
	n2->_prev = n1;

	n1->_next->_val++;

	cout << n1.use_count() << endl; //不使用 weak_ptr 的话，打印出来的是2
	cout << n2.use_count() << endl; //不使用 weak_ptr 的话，打印出来的是2

	return 0;
}
```
![[Pasted image 20221020221856.png]]

## weak_ptr模拟实现
```cpp
template<class T>
class weak_ptr
{
public:
	weak_ptr()
		:_ptr(nullptr)
	{}

	weak_ptr(const shared_ptr<T>& sp)
	{
		_ptr = sp.get();

		return *this;
	}

	T& operator*()
	{
		return *_ptr;
	}

	T* operator->()
	{
		return _ptr;
	}

private:
	T* _ptr;
};
```


# 定制删除器
默认情况，智能指针底层都是`delete`资源

为什么要定制删除器呢，如果我们用`new`开辟空间，那么需要用`delete`来释放，如果用`fopen`打开一个文件，那么我们需要用`fclose`来关闭，同理`malloc`与`free`对应，如果不匹配使用，那么程序就有可能会崩溃。比如：`new[]`、`malloc`、`fopen`

其实定制删除器就是 可调用对象(如仿函数，lambda表达式，包装器等)。

如shared_ptr中的模板 class D ，就是定制删除器
![[Pasted image 20221020225313.png]]

```cpp
namespace fmy
{
	template<class T>
	class default_delete
	{
	public:
		void operator()(const T* ptr)
		{
			cout << "delete:" << ptr << endl;
			delete ptr;
		}
	};

	// 释放方式有D删除器决定
	template<class T, class D = default_delete<T>>
	class unique_ptr
	{
	public:
		unique_ptr(T* ptr)
			:_ptr(ptr)
		{}

		~unique_ptr()
		{
			if (_ptr)
			{
				//cout << "delete:" << _ptr << endl;
				//delete _ptr;
				D del;
				del(_ptr);
			}
		}

		// 像指针一样使用
		T& operator*()
		{
			return *_ptr;
		}

		T* operator->()
		{
			return _ptr;
		}

		unique_ptr(const unique_ptr<T>& sp) = delete;
		unique_ptr<T>& operator=(const unique_ptr<T>& sp) = delete;

	private:
		T* _ptr;
	};
}
```