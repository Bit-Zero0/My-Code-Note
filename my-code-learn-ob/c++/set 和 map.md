# 关联性容器 和序列性容器

序列性容器： vector  ， list  , ...
关联性容器： set ， map , ...


# set

[set](https://cplusplus.com/reference/set/set/)

## set的创建与遍历
排序，value不可重复

### set使用迭代器进行遍历
```c
void set_test1()
{
	set<int> s;

	s.insert(1);
	s.insert(1);
	s.insert(4);
	s.insert(6);
	s.insert(1);
	s.insert(5);
	s.insert(8);
	s.insert(9);


	set<int>::iterator lt = s.begin();
	while (lt != s.end())
	{
		cout << *lt << " ";
		lt++;
	}
	cout << endl;
}

int main()
{
	set_test1();
	return 0;
}
```

其实可以优化一下，使用auto进行类型推断
```c
void set_test1()
{
	set<int> s;

	s.insert(1);
	s.insert(1);
	s.insert(4);
	s.insert(6);
	s.insert(1);
	s.insert(5);
	s.insert(8);
	s.insert(9);


	auto lt = s.begin(); //使用auto进行类型推断
	while (lt != s.end())
	{
		cout << *lt << " ";
		lt++;
	}
	cout << endl;
}

int main()
{
	set_test1();
	return 0;
}
```
![[Pasted image 20220916094509.png]]

### 使用 范围for
```c
void set_test1()
{
	set<int> s;

	s.insert(1);
	s.insert(1);
	s.insert(4);
	s.insert(6);
	s.insert(1);
	s.insert(5);
	s.insert(8);
	s.insert(9);


	for(auto e : s)
	{
		cout << *e << " ";
	}
	cout << endl;
}

int main()
{
	set_test1();
	return 0;
}
```
![[Pasted image 20220916094509.png]]

## find()
返回找到的的迭代器。
![[Pasted image 20220916105454.png]]

```c
void set_test1()
{
	set<int> s;

	s.insert(1);
	s.insert(1);
	s.insert(4);
	s.insert(6);
	s.insert(1);
	s.insert(5);
	s.insert(8);
	s.insert(9);


	set<int>::iterator lt = s.begin();
	while (lt != s.end())
	{
		cout << *lt << " ";
		lt++;
	}
	cout << endl;

	//set<int>::iterator = s.find(5);
	auto f = s.find(5);//自动推断为set<int>::iterator 类型

	cout << *f << endl;
}

int main()
{
	set_test1();
	return 0;
}
```
![[Pasted image 20220916122502.png]]



# multiset

[multiset](https://cplusplus.com/reference/set/multiset/)

排序 可重复
```c
void set_test2()
{
	multiset<int> s;
	s.insert(1);
	s.insert(1);
	s.insert(4);
	s.insert(6);
	s.insert(1);
	s.insert(5);
	s.insert(8);
	s.insert(9);

	auto e = s.begin();
	while (e != s.end())
	{
		cout << *e << " ";
		e++;
	}
	cout << endl;
}

int main()
{
	set_test2();
	return 0;
}
```
![[Pasted image 20220916094907.png]]


## find()
multiset的find()
// find 的val有多个值时，返回中序第一个val值所在节点的迭代器
```cpp
void set_test2()
{
	multiset<int> s;
	s.insert(1);
	s.insert(1);
	s.insert(4);
	s.insert(8);
	s.insert(3);
	s.insert(6);
	s.insert(1);
	s.insert(5);
	s.insert(8);
	s.insert(9);
	s.insert(8);

	auto f = s.find(8);
	cout << *f << endl;
	 
	auto e = s.begin();
	while (e != s.end())
	{
		cout << *e << " ";
		e++;
	}
	cout << endl;
}

int main()
{
	set_test2();
	return 0;
}
```
![[Pasted image 20220916124333.png]]


# set 和 multiset 的共同点
set 和 multiset 的value都不能被修改。修改是会会报错。
因为set 和multiset的 value都是 `const T const * p` 的
```cpp
void set_test2()
{
	multiset<int> s1;
	s1.insert(1);
	s1.insert(1);
	s1.insert(4);
	s1.insert(8);
	s1.insert(3);
	s1.insert(6);
	s1.insert(1);
	s1.insert(5);
	s1.insert(8);
	s1.insert(9);
	s1.insert(8);

	set<int> s2;
	s2.insert(1);
	s2.insert(1);
	s2.insert(4);
	s2.insert(8);
	s2.insert(3);
	s2.insert(6);
	s2.insert(1);
	s2.insert(5);
	s2.insert(8);
	s2.insert(9);
	s2.insert(8);
	 
	auto e = s1.begin();  //multiset的
	while (e != s1.end())
	{
		*e+=10;
		e++;
	}
	cout << endl;


	auto e1 = s2.begin();//set的
	while (e1 != s2.end())
	{
		*e1 += 10;
		e1++;
	}
	cout << endl;
}

int main()
{
	set_test2();
	return 0;
}
```
![[Pasted image 20220916125029.png]]

![[Pasted image 20220916125159.png]]



# map
