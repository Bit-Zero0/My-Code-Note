# C++最常见的三个默认成员函数

## c++类的6个默认成员函数
* 构造函数
* 析构函数
* 拷贝构造函数
* 赋值运算符重载函数
* 取地址运算符重载
* const修饰的取地址操作符重载

[日期类代码](D:\code\cpp-learn\date\date)

## 构造函数
构造函数是特殊的成员函数，需要注意的是，构造函数的虽然名称叫构造，但是需要注意的是构造函数的主要任务并不是开空间创建对象，而是==**初始化对象**==。

其特征如下：

1. 函数名与类名相同。
1. 无返回值。
2. 对象实例化时编译器自动调用对应的构造函数。
3. 构造函数可以重载。
4. 如果类中没有显式定义构造函数，则C++编译器会自动生成一个无参的默认构造函数，一旦用户显式定义编译器将不再生成。

如：
```c

class Date
{
public :
	// 1.无参构造函数
	Date ()
	{}
	
	// 2.带参构造函数
	Date (int year, int month , int day )
	{
		_year = year ;
		_month = month ;
		_day = day ;
	}

private :
	int _year ;
	int _month ;
	int _day ;
};

void TestDate()

{
	Date d1; // 调用无参构造函数
	
	Date d2 (2015, 1, 1); // 调用带参的构造函数
	
	// 注意：如果通过无参构造函数创建对象时，对象后面不用跟括号，否则就成了函数声明
	// 以下代码的函数：声明了d3函数，该函数无参，返回一个日期类型的对象
	Date d3();
}
```


当我们定义构造函数时， 我们可以使用全缺省的方式来定义，这样的话我们能减少很多代码量，而且复用性更强。
```c
class Date
{
public:
	Date (int year = 1900, int month = 1, int day = 1)
	{
		_year = year;	
		_month = month;
		_day = day;
	}

private :
	int _year ;
	int _month ;
	int _day ;
};

// 以下测试函数能通过编译吗？

void Test()
{
	Date d1;
}
```




## 析构函数

析构函数：与构造函数功能相反，析构函数不是完成对象的销毁，局部对象销毁工作是由编译器完成的。而==**对象在销毁时会自动调用析构函数，完成类的一些资源清理工作**==。

### 特征
1. 析构函数名是在类名前加上字符 `~`。
2. 无参数无返回值。
3. 一个类有且只有一个析构函数。若未显式定义，系统会自动生成默认的析构函数。
4. 对象生命周期结束时，C++编译系统系统自动调用析构函数。
5. 编译器生成的默认析构函数，对会自定类型成员调用它的析构函数。

### 什么时候会调用析构函数
- 变量在离开其作用域时被销毁。
- 当一个对象被销毁时，其成员被销毁。
- 容器（无论是标准库容器还是数组）被销毁时，其元素被销毁。
- 对于动态分配的对象,当对指向它的指针应用delete运算符时被销毁。
- 对于临时对象，当创建它的完整表达式结束时被销毁。

```c
typedef int DataType;

class SeqList

{

public :
	SeqList (int capacity = 10)
	{
		_pData = (DataType*)malloc(capacity * sizeof(DataType));
		assert(_pData);
		_size = 0;
		_capacity = capacity;
	}

	~SeqList()
	{
		if (_pData)
		{
		free(_pData ); // 释放堆上的空间
		_pData = NULL; // 将指针置为空
		_capacity = 0;
		_size = 0;
		}
	}

private :
	int* _pData ;
	size_t _size;
	size_t _capacity;
};

```

未被析构前
![[Pasted image 20220424162840.png]]

被析构后
![[Pasted image 20220424162944.png]]



### 编译器生成的默认析构函数，对会自定类型成员调用它的析构函数。
```c
class Stack
{
public:
	Stack(int capacity = 4)
	{
		_a = (int*)malloc(sizeof(int)*capacity);
		if (_a == nullptr)
		{
			cout << "malloc fail\n" << endl;
			exit(-1);
		}

		_top = 0;
		_capacity = capacity;
	}

	void Push(int x)
	{}

	// 如果我们不写默认生成析构函数和构造函数类似
	// 对于内置类型不做处理
	// 对于自定义类型回去调用它的析构函数
	~Stack()
	{
		free(_a);
		_a = nullptr;
		_top = _capacity = 0;
	}
private:
	int* _a;
	size_t _top;
	size_t _capacity;
};

// 两个栈实现一个队列
class MyQueue {
public:
	// 默认生成构造函数和析构函数会对自定义类型成员调用他的构造和析构
	void push(int x) {

	}
private:
	Stack pushST;
	Stack popST;
};

int main()
{

	Stack s1;
	//Stack s2(20);

	MyQueue mq;

	return 0;
}
```

当我们需要销毁 `MyQueue` 时，它会自动调用我们定义的==自定义类型==中的析构函数来完成释放。
![[Pasted image 20220424163357.png]]


## 拷贝构造函数
拷贝构造函数：只有单个形参，该形参是对**本类类型对象的引用**(一般常用const修饰)，在用已存在的类型对象创建新对象时由编译器自动调用。

**特征**
1. 拷贝构造函数是构造函数的一个重载形式。
2. 拷贝构造函数的参数只有一个且必须使用引用传参，使用传值方式会引发无穷递归调用。
3. 若未显示定义，系统生成默认的拷贝构造函数。 默认的拷贝构造函数对象按内存存储按字节序完成拷贝，这种拷贝我们叫做==**浅拷贝**==，或者==**值拷贝**==。

如：如果我们使用值传递，就会引发无限递归
```c
class Date
{
public:
	Date(int year = 1900, int month = 1, int day = 1)
	{
		_year = year;
		_month = month;
		_day = day;
	}

	Date(const Date d)//这里没有使用 引用传递，所以会无限递归
	{
		_year = d._year;
		_month = d._month;
		_day = d._day;
	}

private:
	int _year;
	int _month;
	int _day;
};

int main()
{
	Date d1;
	Date d2(d1);
	return 0;
}
```
![[Pasted image 20220424163942.png]]

**传值**发生无线递归的原因 ：
> 因为传值时，传递的就是对象，而对象又需要调用拷贝构造函数，而拷贝构造函数接收的是一个对象拷贝，而不是本体，所以形参又是一个对象，这个对象又会去调用它的拷贝构造函数，以此不断循环。
> 
> 所以在应该使用**引用方式传参,那样的话 形参就是实参的别名,就不会造成无限递归了**


### 默认生成的拷贝构造函数的问题：
默认是生成的拷贝构造，只是对值进行浅拷贝
```c
class Date
{
public:
	Date(int year = 1900, int month = 1, int day = 1)
	{
		_year = year;
		_month = month;
		_day = day;
	}

private:
	int _year;
	int _month;
	int _day;
};

int main()
{
	Date d1;
	Date d2(d1);
	return 0;
}
```


当成员函数中含有指针时，会造成一个严重的问题。
>两个对象或之内的成员的地址是相同的，当对两个对象进行析构时，就会造成一个对同一个地址的==**二次释放**==。

```c
class String
{
public:
	String(const char* str = "jack")
	{
		_str = (char*)malloc(strlen(str) + 1);
		strcpy(_str, str);
	}

	~String()
	{
		cout << "~String()" << endl;
		free(_str);
	}

private:
	char* _str;
};

int main()
{
	String s1("hello");
	String s2(s1);
	return 0;
}
```

![[Pasted image 20220424170023.png]]



## 赋值运算符重载
C++为了增强代码的可读性引入了运算符重载，运算符重载是具有特殊函数名的函数，也具有其返回值类型，函数名字以及参数列表

函数原型：返回值类型 operator操作符(参数列表)

注意 :
>1. 不能通过连接其他符号来创建新的操作符：比如operator@
>2. 重载操作符必须有一个类类型或者枚举类型的操作数
>3. 用于内置类型的操作符，其含义不能改变，例如：内置的整型+，不 能改变其含义
>4. 作为类成员的重载函数时，其形参看起来比操作数数目少1成员函数的操作符有一个默认的形参this，限定为第一个形参
>5. `.*` 、`::` 、`sizeof` 、`?:(三目操作符)` 、`.` 注意以上5个运算符不能重载。

全局的 `operator==` 
```c
class Date

{

public:
	Date(int year = 1900, int month = 1, int day = 1)
	{
		_year = year;
		_month = month;
		_day = day;
	}
	
int _year;
int _month;
int _day;
};


// 这里会发现运算符重载成全局的就需要成员变量是共有的，那么问题来了，封装性如何保证？
// 这里其实可以用我们后面学习的友元解决，或者干脆重载成成员函数。
bool operator==(const Date& d1, const Date& d2)
{
	return d1._year == d2._year;
	&& d1._month == d2._month
	&& d1._day == d2._day;
}

void Test ()
{
	Date d1(2018, 9, 26);
	Date d2(2018, 9, 27);
	cout<<(d1 == d2)<<endl;
}
```

在类中的`operator==`
```c
class Date
{
public:
	Date(int year = 1900, int month = 1, int day = }1)
	{
		_year = year;
		_month = month;
		_day = day;
	}

// bool operator==(Date* this, const Date& d2)
// 这里需要注意的是，左操作数是this指向的调用函数的对象
	bool operator==(const Date& d2)
	{
		return _year == d2._year;
		&& _month == d2._month
		&& _day == d2._day;
	}

private:
	int _year;
	int _month;
	int _day;
};

void Test ()
{
	Date d1(2018, 9, 26);	
	Date d2(2018, 9, 27);
	cout<<(d1 == d2)<<endl;
}
```


### 赋值运算符的重载
```c
class Date
{
public:
	Date(int year = 1900, int month = 1, int day = 1)
	{
		_year = year;
		_month = month;
		_day = day;
	}

	Date (const Date& d)
	{
		_year = d._year;
		_month = d._month;
		_day = d._day;
	}

	Date& operator=(const Date& d)//d1=d2调用的是这个
	{
		if(this != &d)
		{
			_year = d._year;
			_month = d._month;
			_day = d._day;
		}
		return *this;
	}

private:
	int _year;
	int _month;
	int _day;
};


int main()
{
	Date d1;
	Date d2(2018，10， 1);
	
	// 这里d1调用的编译器生成operator=完成拷贝，d2和d1的值也是一样的。
	d1 = d2；
	
	return 0;
}

```



## const 修饰类的成员函数

将const修饰的类成员函数称之为const成员函数，const修饰类成员函数，实际==**修饰该成员函数隐含的this指针**==，表明在**该成员函数中不能对类的任何成员进行修改**。
![[Pasted image 20220424173601.png]]



## 取地址及const取地址操作符重载

**主要任务**：都是取出对象的 **this指针**，即对象的**地址**

这两个默认成员函数一般不用重新定义 ，编译器默认会生成

```c
class Date
{
public :
	Date* operator&()
	{
		return this ;
	}

	const Date* operator&()const
	{
		return this ;
	}

private :
	int _year ; // 年
	int _month ; // 月
	int _day ; // 日
};
```
这两个运算符一般不需要重载，使用编译器生成的默认取地址的重载即可，只有特殊情况，才需要重载，比如想让别人获取到指定的内容