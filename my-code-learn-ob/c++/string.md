# string模板

string模板常被叫做字符串类型，但在c++中，它属于一种模板。

使用string时需要导入头文件  `<string>` 。


## string的创建
> string 的自动扩容：第一次是两倍，之后一般都稳定在1.5倍的自动扩容。

![[Pasted image 20220422220209.png]]

这是string类型有三种最常见的创建的方式

```c
#include <string>
int main()
{
	string s; //string)
	string s2 = "hello Linux"; 


	string s1("hello world");//string(const char* s)
	

	string s3(s1);//调用了拷贝构造 string(const string& s)
	
	return 0;
}
```


## string常用方法
###  string类对象的容量操作
> `operator[]`  Get character of string
> > `at`  Get character of string 
> `size`    Return length of string    
> `capacity`  Return size of allocated  storage
> `clear`  Clear string
> `reserve` The member function ensures that `capacity()` henceforth returns at least `n`.

总结；
>* size()与length()方法底层实现原理完全相同，引入size()的原因是为了与其他容器的接口保持一致，一般情况下基本都是用size()。
>* clear()只是将string中有效字符清空，不改变底层空间大小。
>*  resize(size_t n) 与 resize(size_t n, char c)都是将字符串中有效字符个数改变到n个，不同的是当字符个数增多时：resize(n)用0来填充多出的元素空间，resize(size_t n, char c)用字符c来填充多出的元素空间。注意：resize在改变元素个数时，如果是将元素个数增多，可能会改变底层容量的大小，如果是将元素个数减少，底层空间总大小不变。
>* reserve(size_t res_arg=0)：为string预留空间，不改变有效元素个数，当reserve的参数小于string的底层空间总大小时，reserver不会改变容量大小。

`resize` , `size` ,`capacity` 的使用
```c
void Teststring1()
{
	// 注意：string类对象支持直接用cin和cout进行输入和输出
	string s("hello, bit!!!");
	cout << s.length() << endl; 
	cout << s.capacity() << endl;
	cout << s << endl;

	// 将s中的字符串清空，注意清空时只是将size清0，不改变底层空间的大小
	s.clear();
	cout << s.size() << endl;
	cout << s.capacity() << endl;
	
	// 将s中有效字符个数增加到10个，多出位置用'a'进行填充
	// “aaaaaaaaaa”
	s.resize(10, 'a');
	cout << s.size() << endl;
	cout << s.capacity() << endl;
	
	// 将s中有效字符个数增加到15个，多出位置用缺省值'\0'进行填充
	// "aaaaaaaaaa\0\0\0\0\0"
	// 注意此时s中有效字符个数已经增加到15个
	s.resize(15);
	cout << s.size() << endl;
	cout << s.capacity() << endl;
	cout << s << endl;
	// 将s中有效字符个数缩小到5个
	s.resize(5);
	cout << s.size() << endl;
	cout << s.capacity() << endl;
	cout << s << endl;
}
```
![[Pasted image 20220424230859.png]]

`reserve` 的使用
```c
void Teststring2()
{
	string s;
	
	// 测试reserve是否会改变string中有效元素个数
	s.reserve(100);
	cout << s.size() << endl;
	cout << s.capacity() << endl;
	
	// 测试reserve参数小于string的底层空间大小时，是否会将空间缩小
	s.reserve(50);
	cout << s.size() << endl;
	cout << s.capacity() << endl;
}
```
![[Pasted image 20220424231658.png]]
仅此得出结论，`reserve` 只会改变 容量(capacity) ,如果reserve小于string的容量空间，它也不会将空降缩小。


### string的增容：
```c
void TestPushBack()
{
	string s;
	size_t sz = s.capacity();
	cout << "making s grow:\n";
	for (int i = 0; i < 100; ++i)
	{
		s.push_back('c');
		if (sz != s.capacity())
		{
			sz = s.capacity();
			cout << "capacity changed: " << sz << '\n';
		}
	}
}
```
![[Pasted image 20220425071241.png]]

> 结论：string的初识容量是 16byte ，因为 '\0' 要占用一个byte，所以是15byte，第一次增容是2倍 ， 但之后的增容速率就稳定在 1.5 倍了。



### string类对象的访问及遍历操作

>operator[]    返回pos位置的字符，const string类对象调用
>
begin+ end     begin获取一个字符的迭代器 + end获取最后一个字符下一个位置的迭代器
>
rbegin + rend   begin获取一个字符的迭代器 + end获取最后一个字符下一个位置的迭代器
>
范围for    C++11支持更简洁的范围for的新遍历方式


```c
void test_string1()
{
	string s1("hello world");

	// 遍历+修改
	// 方式1：下标+[]
	for (size_t i = 0; i < s1.size(); ++i)
	{
		s1[i] += 1;
	}

	for (size_t i = 0; i < s1.size(); ++i)
	{
		cout << s1[i] << " ";
	}
	cout << endl;

	// 方式2：迭代器
	string::iterator it = s1.begin();
	while (it != s1.end())
	{
		*it -= 1;
		++it;
	}
	cout << endl;

	it = s1.begin();
	while (it != s1.end())
	{
		cout << *it << " ";
		++it;
	}
	cout << endl;

	// 方式3：范围for,自动往后迭代，自动判断结束
	// C++11
	//for (char& e : s1)
	for (auto& e : s1)
	{
		e -= 1;
	}

	for (auto e : s1)
	{
		cout << e << " ";
	}
	cout << endl;
}
```
![[Pasted image 20220425074449.png]]

使用迭代器迭代的意义：对于string，无论是正着遍历，还是反着遍历，`[]` 和下标就已经足够使用了，但是对于其他容器(数据结构) 就就无法使用，如：`list`, `map/set`等容器不支持`[]`和下标，用的就是迭代器遍历


`operator[]` 和 `at` 的区别：检查越界的方式是不一样的，`operator[]` 是断言；`at`是抛异常。
```c
int main()
{
	char& operator[] (size_t pos)
	{
		return str[pos]; //这里的引用不是为了减少拷贝，而是为了支持修改返回对象
	}
	return 0;
}
```



### string类对象的修改操作

>push_back  在字符串后面尾插字符。
>append        在字符串后追加一个字符串。
>operator+=  在字符串后追加字符串str。
>s_str              返回C格式的字符串。
>find+npos     从字符串pos位置开始==往后==找字符c，返回该字符在字符串中的地址。
>rfind              从字符串pos位置开始==往前==找字符c，返回该字符在字符串中的地址。
>substr           在str中从pos位置开始，截取n个字符，然后返回。
>insert            在指定位置插入
>earse             删除指定位置的数据

```c
void Teststring()
{
	string str;
	str.push_back(' '); // 在str后插入空格
	str.append("hello"); // 在str后追加一个字符"hello"
	str += 'b'; // 在str后追加一个字符'b' 
	str += "it"; // 在str后追加一个字符串"it"
	cout << str << endl;
	cout << str.c_str() << endl; // 以C语言的方式打印字符串
	cout << endl;

	// 获取file的后缀
	string file1("string.cpp");
	size_t pos = file1.rfind('.');
	string suffix(file1.substr(pos, file1.size() - pos));
	cout << suffix << endl;
	cout << endl;

	// npos是string里面的一个静态成员变量
	// static const size_t npos = -1;

	// 取出url中的域名
	string url("http://www.cplusplus.com/reference/string/string/find/");
	cout << url << endl;
	size_t start = url.find("://");
	if (start == string::npos)
	{
		cout << "invalid url" << endl;
		return;
	}
	start += 3;
	size_t finish = url.find('/', start);
	string address = url.substr(start, finish - start);
	cout << address << endl;
	cout << endl;

	// 删除url的协议前缀
	pos = url.find("://");
	url.erase(0, pos + 3);
	cout << url << endl;
}

int main()
{
	Teststring();
	return 0;
}
```

![[Pasted image 20220425081040.png]]


`insert` 方法的使用，`insert`尽量少使用头插，因为是时间是`O(n)`
```c
int main()
{
	string s("hello world");
	s += ' ';
	s += "!!!!";

	// 头插  效率，O(N),尽量少用
	s.insert(0, 1, 'x');
	cout << s << endl;
	cout << endl;

	s.insert(s.begin(), 'y');
	s.insert(0, "test");
	cout << s << endl;
	cout << endl;
	// 中间位置插入
	s.insert(4, "&&&&&");
	cout << s << endl;
	return 0;
}
```
![[Pasted image 20220425082200.png]]



`earse` 的使用 , `earse` 尽量少使用头部和中间删除，效率低，
如果需要删除最尾部的字符，可以使用`pop_back` ,但需要 ==c++11== 版本
```c
int main()
{
	string s("hello world");
	// 尽量少用头部和中间删除，因为要挪动数据，效率低
	s.erase(0, 1);
	s.erase(s.size() - 1, 1);
	cout << s << endl;

	s.erase(3);
	cout << s << endl;
	return 0;
}
```
![[Pasted image 20220425120403.png]]



 ![[在使用读取string字符串时，容易出现的问题#getline 函数 | getline函数]]

## string的模拟实现
因为string是标椎库里的类，所以需要使用[[命名空间|命名空间]] , 不然容易与库函数中的 **`string`** 有冲突。

string的成员属性有三个 
> **==size==** 当前字符串的长度。类型为：==**size_t**==
> ==**capacity**== 当前字符串的容量 。类型为：==**size_t**==
> ==**str**== 当前字符串。 类型为：==**char***== 

主要实现：**`insert` , `erase` ,`operator+=` , `find` , `resize` , ` reserve` , `push_back` ,`append`， `find`** ,等函数
```cpp
#pragma once
#include <string>
#include <assert.h>
#include <iostream>

using namespace std;
namespace fmy {

	class string {

	private:
		size_t _size;
		size_t _capacity;
		char* _str;

		static const size_t npos = -1;

	public:

		typedef char* iterator;
		typedef const char* const_iterator;

		iterator begin()
		{
			return _str;
		}
		
		iterator end()
		{
			return _str + _size;
		}

		const_iterator begin() const
		{
			return _str;
		}

		const_iterator end() const
		{
			return _str + _size;
		}

		string(const char* str = "") //当我们进行深拷贝时，如果没有目标 字符 ，则创建空字符串
			:_size(strlen(str)) //没有字符，则为 0 。
			,_capacity(_size) //_size为0 ，则 _capacity 也为0
		{
			_str = new char[_capacity + 1]; //开辟空间，+1是因为要给 '\0' 留一个位
			strcpy(_str, str); 
		}

		////拷贝构造  s1(s)   
		//string(const string& s)
		//	:_size(s._size)
		//	,_capacity(s._capacity)
		//{
		//	_str = new char[_capacity + 1];
		//	strcpy(_str, s._str);
		//}


		void swap(string& s)
		{
			std::swap(_size, s._size);
			std::swap(_capacity, s._capacity);
			std::swap(_str, s._str);
		}

		//拷贝构造的现代写法
		string(string& s)
			:_size(0)
			,_capacity(0)
			,_str(nullptr)
		{
			string tmp(s._str);
			swap(tmp);
		}

		~string()
		{
			delete[] _str;
			_str = nullptr;
			_size = _capacity = 0;
		}

		////此方法有缺陷，不能自己给自己赋值 如：  s3 = s3 , 因为他会把自己先给释放了，所以之后赋值的内容就是乱码了
		//string& operator=(const string& s)
		//{
		//	delete[] _str;
		//	_str = new char[strlen(s._str) + 1]; // new是有可能会开辟空间失败的，那时抛异常后就会返回，但是我们之前却把 _str 给释放了
		//	strcpy(_str, s._str);

		//	return *this;
		//}

		//string& operator=(const string& s)
		//{
		//	if (this != &s) //注意 this 和 &s 是取到的地址
		//	{
		//		char* tmp = new char[strlen(s._str) + 1]; //因为new有可能开辟失败，所以使用tmp来暂存
		//		strcpy(tmp, s._str);
		//		delete[] _str; //当new开辟失败时，也不会影响到 _str了
		//		_str = tmp;
		//		_size = s._size;
		//		_capacity = s._capacity;
		//	}
		//	return *this;
		//}

		string& operator=(string s)
		{
			swap(s);
			return *this;
		}



		const char* c_str() const  //将string转化为C语言中字符串
		{
			return _str;
		}

		size_t size() const
		{
			return _size;
		}

		const char& operator[](size_t pos) const //const 修饰放回值，可以避免返回值被修改，但是同样的，也需要const修饰对象才能调用。
		{
			assert(pos < _size); //使用assert防止数组越界，如果越界，assert就会直接终止程序，并报错 
			return _str[pos];
		}

		char& operator[](size_t pos)
		{
			assert(pos < _size);
			return _str[pos];
		}

		void push_back(char ch)
		{
			if (_size == _capacity)
			{
				reserve(_capacity == 0 ? 4 : _capacity * 2);
			}
			_str[_size] = ch;
			++_size;
			_str[_size] = '\0';

			//insert(_size , ch);
		}

		void reserve(size_t n)
		{
			if (n > _capacity)
			{
				char* tmp = new char[n + 1];
				strcpy(tmp, _str);
				delete[] _str;

				_str = tmp;

				_capacity = n;
			}
		}

		void resize(size_t n, char ch = '\0')
		{
			if (n <= _size)
			{
				_size = n;
				_str[_size];
			}
			else
			{
				if (n > _capacity)
				{
					reserve(n);
				}
				memset(_str + _size, ch, n - _size);
				_size = n;
				_str[_size] = '\0';
			}
		}

		string& insert(size_t pos, char ch)
		{
			assert(pos <= _size); //因为要有可能尾插，所以是 <= _size、

			if (_size == _capacity)
			{
				reserve(_capacity == 0 ? 4 : _capacity * 2);
			}

			size_t end = _size + 1;
			while (end > pos)
			{
				_str[end] = _str[end - 1];
				end--;
			}

			_str[pos] = ch;
			_size++;
			
			return *this;
		}

		string& insert(size_t pos, const char* s)
		{
			assert(pos <= _size);
			size_t len = strlen(s);
			if (_size + len > _capacity)
			{
				reserve(_size + len);
			}

			size_t end = _size + len;
			while (end >= pos+len) 
			{
				_str[end] = _str[end - len];
				--end;
			}
			
			strncpy(_str + pos, s, len);
			_size += len;
			return *this;
		}

		void append(const char* str)
		{
			/*size_t len = strlen(str);
			if (_size + len > _capacity)
			{
				reserve(_size + len);
			}
			strcpy(_str + _size, str);
			_size += len;*/

			insert(_size, str);
		}

		string& operator+=(const char* str)
		{
			append(str);
			return *this;
		}

		string& operator+=(char ch)
		{
			push_back(ch);
			return *this;
		}

		size_t find(char ch)
		{
			for (size_t i = 0; i < _size; ++i)
			{
				if (ch == _str[i])
				{
					return i;
				}
			}
			return npos;
		}


		size_t find(char* s, size_t pos = 0)
		{
			const char* ptr = strstr(_str + pos , s);
			if (ptr == nullptr)
			{
				return npos;
			}
			else
			{
				return ptr - _str; //指针减指针可以得到两个之间相隔的距离。
			}
		}

		string& erase(size_t pos = 0, size_t len = npos)
		{
			assert(pos < _size);

			if (len == npos || len + pos >= _size)
			{
				_str[pos] = '\0';
				_size = pos;
			}
			else
			{
				strcpy(_str + pos, _str + pos + len);
				_size -= len;
			}
			return *this;
		}
		
		void clear()
		{
			_str[0] = '\0';
			_size = 0;
		}
	};
	//const size_t string::npos = -1;

	bool operator<(const string& s1, const string& s2)
	{
		size_t l1 = 0, l2 = 0;
		while (l1 < s1.size() && l2 < s2.size())
		{
			if (s1[l1] < s2[l2])
				return true;
			else if (s1[l1] > s2[l2])
				return false;
			else
			{
				l1++;
				l2++;
			}
		}
		return l2 < s2.size() ? true : false;

		//strcmp(s1.c_str() , s2.c_str());
	}

	bool operator==(string& s1, string& s2)
	{
		return strcmp(s1.c_str(), s2.c_str()) == 0;
	}

	bool operator>=(string& s1, string& s2)
	{
		return !(s1 < s2) ;
	}

	bool operator>(string& s1, string& s2)
	{
		return !(s1 >= s2);
	}

	bool operator<=(string& s1, string& s2)
	{
		return !(s1 > s2);
	}

	bool operator!=(string& s1, string& s2)
	{
		return !(s1 == s2);
	}

	ostream& operator<<(ostream& out, const string& s)
	{
		for (auto ch : s)
		{
			out << ch;
		}
		return out;
	}

	istream& operator>>(istream& in, string& s)
	{
		s.clear();

		char ch = in.get();

		while (ch != '\n' && ch != ' ')
		{
			s += ch;
			ch = in.get();
		}

		return in;
	}
}
```


### 有看头的函数

#### string构造函数
```cpp
string(const char* str = "") //当我们进行深拷贝时，如果没有目标 字符 ，则创建空字符串
	:_size(strlen(str)) //没有字符，则为 0 。
	,_capacity(_size) //_size为0 ，则 _capacity 也为0
{
	_str = new char[_capacity + 1]; //开辟空间，+1是因为要给 '\0' 留一个位
	strcpy(_str, str); 
}
```

#### string拷贝构造函数
##### 传统写法：
这种写法是传统学法，比较保守。
```cpp
string(const string& s)
	:_size(s._size)
	,_capacity(s._capacity)
{
	_str = new char[_capacity + 1];
	strcpy(_str, s._str);
}
```

##### 现代写法：
```cpp
string(string& s) //先将 *this  初始化为空，因为会需要交换
	:_size(0)
	,_capacity(0)
	,_str(nullptr)
{
	string tmp(s._str); //使用普通构造临时函数，因为普通的构造函数会为我们开辟空间，
	swap(tmp); //交换tmp和this中的成员函数
}
```
在其中使用swap时，我们使用的是，我们自己创建的swap函数。
因为自带swap函数是交换对象时，会调用构造函数，会对浪费一些资源，所以推荐自己写。
```cpp
void swap(string& s) //只交换必要的成员变量
{
	std::swap(_str , s._str);
	std::swap(_size , s._size);
	std::swap(_capacity , s._capacity);
}

string(string& s) //先将 *this  初始化为空，因为会需要交换
	:_size(0)
	,_capacity(0)
	,_str(nullptr)
{
	string tmp(s._str); //使用普通构造临时函数，因为普通的构造函数会为我们开辟空间，
	swap(tmp); //交换tmp和this中的成员函数
}
```


#### `operator=` 函数
作用：对象赋值。

##### 传统写法：
注意：在使用 `new` 函数时，有可能开辟失败，那时就是结束程序并抛异常，所以不能先删除 `_str` 
错误写法：
```cpp
//错误写法
////此方法有缺陷，不能自己给自己赋值 如：  s3 = s3 , 因为他会把自己先给释放了，所以之后赋值的内容就是乱码了
string& operator=(const string& s)
{
	delete[] _str;
	_str = new char[strlen(s._str) + 1]; // new是有可能会开辟空间失败的，那时抛异常后就会返回，但是我们之前却把 _str 给释放了
	strcpy(_str, s._str);

	return *this;
}
```

正确写法：
```cpp
string& operator=(const string& s)
{
	if(this != &s) //判断是否是自己给自己赋值，所以用的是地址
	{
		char* tmp = new char[strlen(s._str)+1]; //先开辟一个临时变量tmp，
		strcpy(tmp,s._str); //将s中的字符串拷贝到tmp中。
		delete[] _str; //释放this->_str 的空间
		_str = tmp; //将tmp赋值给this->_str
		_size = s._size;
		_capacity = s._capacity;
	}
	return *this;
}
```


##### 现代写法：
```cpp
string& operator=(string s) //注意这里没有引用传递，是值传递
{
	swap(s); //使用我们自己写的swap函数
	return *this;
}
```
注意：形参部分是没有引用的，因为我们要交换，所以这里是不能使用引用传递，用的是==**值传递**==。
而值传递又会开辟新的空间，所以此方法是最推荐使用的



#### `insert` 函数
作用：==**在指定位置插入字符或字符串。**==

```cpp
string& insert(size_t pos, char ch)
{
	assert(pos <= _size); //因为要有可能尾插，所以是 <= _size、

	if (_size == _capacity)
	{
		reserve(_capacity == 0 ? 4 : _capacity * 2);
	}

	size_t end = _size + 1; //因为要添加一个数据，end是size后一个的空位，所以需要+1。
	while (end > pos)
	{
		_str[end] = _str[end - 1];
		end--;
	}

	_str[pos] = ch;
	_size++;
	
	return *this;
}

string& insert(size_t pos, const char* s)
{
	assert(pos <= _size);
	size_t len = strlen(s);
	if (_size + len > _capacity)
	{
		reserve(_size + len);
	}

	size_t end = _size + len;
	while (end > pos) 
	{
		_str[end] = _str[end - len];
		--end;
	}
	
	strncpy(_str + pos, s, len);
	_size += len;
	return *this;
}
```

==**插入字符串的  `insert` 函数**== ， 有一些缺陷的，在循环判断条件中`while(end > pos)`  。
```cpp
string& insert(size_t pos, const char* s)
{
	assert(pos <= _size);
	size_t len = strlen(s);
	if (_size + len > _capacity)
	{
		reserve(_size + len);
	}

	size_t end = _size + len;
	while (end > pos)  
	{
		_str[end] = _str[end - len];
		--end;
	}
	
	strncpy(_str + pos, s, len);
	_size += len;
	return *this;
}
```
虽然此结果的运行结果没有毛病， 但是确实存在一些==越界问题==。

若：我们定义 `string s("hello")`  , 我们要在索引1处插入字符串`abc`  
![[Pasted image 20220511161041.png]]
>1.当 end = 3 时，我们已经挪动出我们需要的空位了，但是循环还在继续。
>2.当end= 3 时， `_str[end] = _str[end -len]` 中  `len = 3` ， `_str[3] = _str[1]` 是没问题的。
>3.但是当end = 2时 `_str[end -len]` 中的 `end -len` 是等于  `2 - 3` 是等于 `-1` ， 这已经是越界的了。

##### ==正确写法：==
将循环判断语句的 `while(end > pos)`  改为 `while(end >= pos + len)` ，即可解决问题。
```cpp
string& insert(size_t pos, const char* s)
{
	assert(pos <= _size);
	size_t len = strlen(s);
	if (_size + len > _capacity)
	{
		reserve(_size + len);
	}

	size_t end = _size + len;
	while (end >= pos+len)  
	{
		_str[end] = _str[end - len];
		--end;
	}
	
	strncpy(_str + pos, s, len);
	_size += len;
	return *this;
}
```



#### `push_back`函数
此函数注意 `_size` 和  `_capacity` 的大小
##### 传统写法：
```cpp
void push_back(char ch)
{
	if (_size == _capacity) 
	{
		reserve(_capacity == 0 ? 4 : _capacity * 2);
	}
	_str[_size] = ch;
	_size++;
	_str[_size] = '\0';
}
```

##### 现代写法：
```cpp
void push_back(char ch)
{
	insert(_size , ch);
}
```


#### `append` 函数
作用：在==**字符串后追加字符或字符串**== 

##### 传统写法：
```cpp
void append(const char* str)
{
	size_t len = strlen(str);
	if (_size + len > _capacity)
	{
		reserve(_size + len);
	}
	strcpy(_str + _size, str);
	_size += len;
}
```

##### 现代写法：
复用 `insert` 函数
```cpp
void append(const char* str)
{
	insert(_size , str);
}
```


####  `erase` 函数
作用：==**删除指定位置上的字符或字符串**==
```cpp
string& erase(size_t pos = 0, size_t len = npos)
{
	assert(pos < _size);

	if (len == npos || len + pos >= _size)
	{
		_str[pos] = '\0';
		_size = pos;
	}
	else
	{
		strcpy(_str + pos, _str + pos + len);
		_size -= len;
	}
	return *this;
}
```

#### `operator<<`函数
写此函数需要展开 ==**std命名空间**==

##### ==错误写法：==
```cpp
ostream& operator<<(ostream& out, const string& s)
{
	out << s.c_str(); //不能这样写
	return out；
}
```
因为如果使用`c_str`函数的话，遇到 `\0`  就会返回

看以下代码
```cpp
int main()
{
	string s("hello");
	s+='\0'; //这个 '\0' 是作为有效字符插入进去的，所以不代表结果，一般是以空格显示
	s+='world';
	return 0;
}
```
如果这段代码我们使用 `c_str()` 这个函数，他就不会把 `s+='\0'` 中的 `'\0'` 当作有效字符，而是当作==**结束标志**==。
![[Pasted image 20220511193724.png]]

但是实际上，有效字符却是 **11** 个
![[Pasted image 20220511193959.png]]、

##### 正确写法：
```cpp
ostream& operator<<(ostream& out, const string& s)
{
	for (auto ch : s) //使用正常的循环也可以
	{
		out << ch;
	}
	return out;
}
```
![[Pasted image 20220511194200.png]]

`\0`作为有效字符时，在vs2019中不显示，而不是用 `' '`(空格) 代替，


#### `operator>>`函数
写此函数需要展开 ==**std命名空间**==
```cpp
istream& operator>>(istream& in, string& s)
{
	s.clear();

	char ch = in.get();

	while (ch != '\n' && ch != ' ')
	{
		s += ch;
		ch = in.get();
	}

	return in;
}
```