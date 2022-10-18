# 为什么需要智能指针？
1. `malloc`出来的空间，**没有进行释放，存在内存泄漏的问题**。
2. [[C++异常#异常安全|异常安全]]问题。如果在`malloc`和`free`之间如果存在抛异常，那么还是有**内存泄漏**。这种问题就叫异常安全。

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

# 标准库提供的智能指针
C++库中的智能指针都定义在`<memory>`这个头文件中.

# std::auto_ptr
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

## unique_ptr
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

### `unique_ptr`的模拟实现
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

## shared_ptr
**`shared_ptr`实现共享式拥有概念。通过引用计数，多个智能指针可以指向相同对象，该对象和其相关资源会在最后一个引用被销毁时候释放。**

它使用计数机制来表明资源被几个指针共享。可以通过成员函数`use_count()`来查看**资源的所有者个数**。除了可以通过`new`来构造，还可以通过传入`auto_ptr` ,  `unique_ptr`, `weak_ptr`来构造。

当复制一个`shared_ptr`，**引用计数会`+1`**。**当我们调用`release()`或者当一个`shared_ptr`离开作用域时，计数减1（普通的指针如果没有delete操作，离开作用域时并不会被释放，只有在进程结束后才会被释放）。当计数等于0时，则delete内存。**

成员函数：
>`use_count` ：返回引用计数的个数
>`unique` ：返回是否是独占所有权( use_count 为 1)
>`swap` ：交换两个 shared_ptr 对象(即交换所拥有的对象)
>`reset` ：放弃内部对象的所有权或拥有对象的变更, 会引起原有对象的引用计数的减少
>`get` ：返回内部对象(指针)


### share_ptr模拟实现
```cpp

```