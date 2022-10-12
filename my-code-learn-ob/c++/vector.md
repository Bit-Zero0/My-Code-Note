# vector的介绍与使用
## vector的介绍
>1. vector是表示==**可变大小数组**==的序列容器。
>2. 就像数组一样，vector也**采用**的**连续存储空间**来存储元素。也就是意味着可以采用下标对vector的元素进行访问，和数组一样高效。但是又不像数组，它的==大小是可以动态改变==的，而且它的==大小会被容器自动处理==。
>3. 本质讲，vector使用动态分配数组来存储它的元素。当新元素插入时候，这个数组需要被重新分配大小为了增加存储空间。其做法是，分配一个新的数组，然后将全部元素移到这个数组。就时间而言，这是一个相对代价高的任务，因为每当一个新的元素加入到容器的时候，vector并不会每次都重新分配大小。
>4. ==**vector分配空间策略**==：vector会分配一些额外的空间以适应可能的增长，因为存储空间比实际需要的存储空间更大。不同的库采用不同的策略权衡空间的使用和重新分配。但是无论如何，重新分配都应该是对数增长的间隔大小，以至于在末尾插入一个元素的时候是在常数时间的复杂度完成的。(**增长速度大约为1.5倍**)
>5. 因此，vector占用了更多的存储空间，为了获得管理存储空间的能力，并且以一种有效的方式动态增长。
>6. 与其它动态序列容器相比（deques, lists and forward_lists）， vector在访问元素的时候更加高效，在末尾添加和删除元素相对高效。对于其它不在末尾的删除和插入操作，效率更低。比起lists和forward_lists统一的迭代器和引用更好。

## vector的使用
![[Pasted image 20220511204407.png]]
>value_type 就是数据的类型

```cpp
#include <vector>
int main()
{
	vector<int> v1; //无参构造
	
	vector<int> v2(10, 8); // 构造出 10个 8

	vector<int> v3(++v2.begin(), --v2.end()); //使用迭代器构造出8个 8

	string s("emm");
	vector<char> v4(s.begin(), s.end()); //使用迭代器构造
	return 0;
}
```
![[Pasted image 20220511210741.png]]
### vector iterator 的使用

|iterator的使用 |接口说明|
|:--|:--|
|begin +end（重点）|获取==第一个数据位置==的iterator/const_iterator， 获取==最后一个数据的下一个位置==的iterator/const_iterator|
|rbegin + rend|获取最后一个数据位置的reverse_iterator，获取第一个数据前一个位置的|reverse_iterator|
![[Pasted image 20220511213051.png]]




### vector 空间增长问题
| 容量空间 | 接口说明 |
|:-:|:-:|
| size | 获取数据个数 |
|capacity|获取容量大小|
|empty|判断是否为空|
|reserve （重点）|改变vector放入capacity|
|resize（重点）|改变vector的size|

>1. capacity的代码在vs和g++下分别运行会发现，vs下capacity是按1.5倍增长的，g++是按2倍增长的。这个问题经常会考察，不要固化的认为，顺序表增容都是2倍，具体增长多少是根据具体的需求定义的。vs是PJ版本STL，g++是SGI版本STL。
>2. reserve只负责开辟空间，如果确定知道需要用多少空间，reserve可以缓解vector增容的代价缺陷问题。
>3. resize在开空间的同时还会进行初始化，影响size。


### vector 增删查改
|vector增删查改|接口说明|
|:--|:--|
|push_back（重点）| 尾插|
|pop_back （重点）| 尾删|
|find|查找。**（注意这个是算法模块实现，不是vector的成员接口）,需要导入头文件`<algorithm>`**|
|insert|在position之前插入val|
|erase|删除position位置的数据|
|swap|交换两个vector的数据空间|
|operator[] （重点）| 像数组一样访问|

vector中使用find,需要使用到[[迭代器]]。
```cpp
#include <vector>
int main()
{
	vector<int> v;
	v.push_back(1);
	v.push_back(2);
	v.push_back(3);
	v.push_back(4);

	vector<int>::iterator ret = find(v.begin(), v.end(), 3);//使用迭代器来寻找
	if (ret != v.end())
	{
		v.insert(ret, 66); //在迭代器处插入66

		v.erase(ret);//不能在这里删除，这里涉及到迭代器失效问题
	}

	v.insert(v.begin(), -1);

	v.clear();
	return 0;
}
```
![[Pasted image 20220511215636.png]]


# vector模拟实现
vector使用的[[迭代器#随机迭代器|随机迭代器]]

```cpp
namespace fmy
{
	template<class T>
	class vector
	{
	public:
		typedef T* iterator;
		typedef const T* const_iterator;

		vector()
			:_start(nullptr)
			, _finish(nullptr)
			, _end_of_storage(nullptr)
		{

		}

		////v2(v1) 传统写法
		//vector(const vector<T>& v)
		//{
		//	_start = new T[v.capacity()];
		//	_finish = _start + v.size();
		//	_end_of_storage = _start + v.capacity();

		//	memcpy(_start, v._start, v.size() * sizeof(T));
		//}
		
		//现代写法
		vector(const vector<T>& v)
			:_start(nullptr)
			, _finish(nullptr)
			, _end_of_storage(nullptr)
		{
			vector<T> tmp(v.begin(), v.end());

			swap(tmp);
		}

		template <class InputIterator>
		vector(InputIterator first, InputIterator last)
			:_start(nullptr)
			, _finish(nullptr)
			, _end_of_storage(nullptr)
		{
			while (first != last)
			{
				push_back(*first);
				first++;
			}
		}

		~vector()
		{
			if (_start)
			{
				delete[] _start;
				_start = _finish = _end_of_storage = nullptr;
			}
		}


		iterator begin()
		{
			return _start;
		}

		iterator end()
		{
			return _finish;
		}

		const_iterator begin() const
		{
			return _start;
		}

		const_iterator end() const
		{
			return _finish;
		}


		vector<T>& operator=(vector<T> v)
		{
			swap(v);

			return *this;
		}

		void swap(vector<T>& v)
		{
			std::swap(_start,v._start);
			std::swap(_finish, v._finish);
			std::swap(_end_of_storage, v._end_of_storage);
		}

		size_t size() const
		{
			return _finish - _start; //指针减指针，得到指针相隔的距离
		}

		size_t capacity() const
		{
			return _end_of_storage - _start;
		}

		const T& operator[](size_t i) const//作为返回值T&不可被修改。
		{
			assert(i < size());
			return _start[i]; // 相当于指针 _start + i ;
		}

		T& operator[](size_t i) 
		{
			assert(i < size());
			return _start[i]; // 相当于指针 _start + i ;
		}

		void reserve(size_t n)
		{
			if (n > capacity())
			{
				size_t sz = size();
				T* tmp = new T[n];

				if (_start)
				{
					//memcpy(tmp, _start, sizeof(T) * size());
					for (int i = 0; i < sz; i++)
					{
						// T 是int，一个一个拷贝没问题
						// T 是string， 一个一个拷贝调用是T的深拷贝赋值，也没问题
						tmp[i] = _start[i];
					}
					delete[] _start;
				}

				_start = tmp;
				_finish = _start + sz; // _finish = _start + size();   size（）有问题
				_end_of_storage = _start + n;
			}
		}

		void resize(size_t n , const T& val = T())
		{
			if (n < size())
			{
				_finish = _start + n;
			}
			else
			{
				if (n > capacity())
				{
					reserve(n);
				}

				while (_finish != _start + n)
				{
					*_finish = val;
					++_finish;
				}
			}
		}

		iterator insert(iterator pos, const T& x)
		{
			assert(pos >= _start);
			assert(pos <= _finish);

			if (_finish == _end_of_storage)
			{
				int len = pos - _start;
				reserve(capacity() == 0 ? 4 : capacity() * 2);
				pos = _start + len;
			}

			iterator end = _finish - 1;
			while (end >= pos)
			{
				*(end + 1) = *end;
				end--;
			}
			*pos = x;
			_finish++;

			return pos;
		}

		iterator erase(iterator pos)
		{
			assert(pos >= _start);
			assert(pos < _finish);

			iterator begin = pos + 1;
			while (begin < _finish)
			{
				*(begin - 1) = *begin;
				begin++;
			}

			_finish--;

			return pos;
			
		}

		void push_back(const T& x)
		{
			if (_finish == _end_of_storage)
			{
				reserve(capacity() == 0 ? 4 : capacity() * 2);
			}

			*_finish = x;
			++_finish;
		}

		void pop_back()
		{
			assert(_finish > _start);
			--_finish;
		}


		void print()
		{
			for (int i = 0; i < size(); i++)
			{
				cout << _start[i] << " " ;
			}
			printf("\n");
		}
	private:
		iterator _start;
		iterator _finish;
		iterator _end_of_storage;
	};

}
```

## vector的拷贝构造



### 传统写法
```cpp
//v2(v1) 传统写法
vector(const vector<T>& v)
{
	_start = new T[v.capacity()];
	_finish = _start + v.size();
	_end_of_storage = _start + v.capacity();

	memcpy(_start, v._start, v.size() * sizeof(T));
}
```

### 现代写法
现代写法实际上是使用了==迭代器==来初识化。
```cpp
//现代写法
vector(const vector<T>& v)
	:_start(nullptr)
	, _finish(nullptr)
	, _end_of_storage(nullptr)
{
	vector<T> tmp(v.begin(), v.end());

	swap(tmp);
}

template <class InputIterator>
vector(InputIterator first, InputIterator last)
	:_start(nullptr)
	, _finish(nullptr)
	, _end_of_storage(nullptr)
{
	while (first != last)
	{
		push_back(*first);
		first++;
	}
}
```


## vector的析构函数
```cpp
~vector()
{
	delete[] _start;
	_start = _finish = _end_of_storage = nullptr;
}
```

## reserve()
```cpp
void reserve(size_t n)
{
	if (n > capacity())
	{
		size_t sz = size();
		T* tmp = new T[n];

		if (_start)
		{
			//memcpy(tmp, _start, sizeof(T) * size()); //不能使用memcpy，因为如果vector中存储的是string，那就会出现一些乱码。
			
			for (int i = 0; i < sz; i++)
			{
				// T 是int，一个一个拷贝没问题
				// T 是string， 一个一个拷贝调用是T的深拷贝赋值，也没问题
				tmp[i] = _start[i];
			}
			delete[] _start;
		}

		_start = tmp;
		_finish = _start + sz; // _finish = _start + size();   size（）有问题
		_end_of_storage = _start + n;
	}
}
```

sz的大小一定要事先记录好， 不然等到释放了`_start` 时，`size()` 就是不是原来的值，`_finish` 也会因此出问题。


## resize()
```cpp
void resize(size_t n , const T& val = T()) // T() 是 匿名对象。
{
	if (n < size())
	{
		_finish = _start + n;
	}
	else
	{
		if (n > capacity())
		{
			reserve(n); //复用reserve
		}

		while (_finish != _start + n)//reserve之后，将_finish及其之后的空间设置为 val；
		{
			*_finish = val;
			++_finish;
		}
	}
}
```


## insert()
涉及到[[迭代器#迭代器失效|迭代器失效]]的问题。
```cpp
iterator insert(iterator pos, const T& x)
{
	assert(pos >= _start);
	assert(pos <= _finish);

	if (_finish == _end_of_storage) 
	{
		int len = pos - _start; //扩容后迭代器可以会失效，需要要先保存pos到_start之间的长度。
		reserve(capacity() == 0 ? 4 : capacity() * 2);
		pos = _start + len;//恢复迭代器的位置
	}

	iterator end = _finish - 1;
	while (end >= pos)
	{
		*(end + 1) = *end;
		end--;
	}
	*pos = x;
	_finish++;

	return pos;
}
```

## erase()
```cpp
iterator erase(iterator pos)
{
	assert(pos >= _start);
	assert(pos < _finish);

	iterator begin = pos + 1;
	while (begin < _finish)
	{
		*(begin - 1) = *begin;
		begin++;
	}

	_finish--;

	return pos;
	
}
```

### 使用erase()的注意事项
当要删除vector中所有偶数时容易出现的逻辑错误。
```cpp
int main()
{
	vector<int> v;
	v.push_back(1);
	v.push_back(2);
	v.push_back(3);
	v.push_back(4);
	v.push_back(5);
	v.push_back(6);
	
	//删除v中所有的偶数
	vector<int>::iterator ret = v.begin();
	while (ret != v.end())
	{
		if (*ret % 2 == 0)
		{
			v.erase(ret);
		}
		ret++; //此处有逻辑错误
	}

	v.print();
	return 0;
}
```
![[Pasted image 20220522172624.png]]

此处是有问题的，因为ret其实走了两步，当erase执行完后，会返回新pos节点的数据，就不需要 ret++ 了。所以需要加一个else判断。

```cpp
int main()
{
	vector<int> v;
	v.push_back(1);
	v.push_back(2);
	v.push_back(3);
	v.push_back(4);
	v.push_back(5);
	v.push_back(6);
	
	//删除v中所有的偶数
	vector<int>::iterator ret = v.begin();
	while (ret != v.end())
	{
		if (*ret % 2 == 0)
		{
			v.erase(ret);
		}
		else
		{
			ret++; //此处有逻辑错误
		}
	}

	v.print();
	return 0;
}
```
此时就是正确的了。



## vector的反向迭代器
![[迭代器#反向迭代器]]

在vector文件中添加`revser_iterator`和 `const_reverse_iterator` 的定义

```cpp
namespace fmy
{
	template<class T>
	class vector
	{
	public:
		typedef T* iterator;
		typedef const T* const_iterator;

		typedef reverse_iterator<const_iterator, const T&, const T*> const_reverse_iterator;
		typedef reverse_iterator<iterator, T&, T*> reverse_iterator;

		
		reverse_iterator rbegin()
		{
			return reverse_iterator(end());
		}

		reverse_iterator rend()
		{
			return reverse_iterator(begin());
		}
		
		iterator begin()
		{
			return _start;
		}

		iterator end()
		{
			return _finish;
		}
	}
}
```

reverse_iterator 的使用
```cpp
void test5()
{
	vector<int> v1;
	v1.push_back(1);
	v1.push_back(2);
	v1.push_back(3);
	v1.push_back(4);
	v1.push_back(5);

	vector<int>::reverse_iterator it = v1.rbegin();
	while (it != v1.rend())
	{
		cout << *it << " ";
		++it;
	}
	cout << endl;

}

int main()
{
	test5();
	return 0;
}
```
![[Pasted image 20220528152522.png]]


## 使用initializer_list来构造vector
使用[[列表初始化#initializer_list|initializer_list]]来构造vector
```cpp
vector(initializer_list<T> itl)
	:_start(nullptr)
	, _finish(nullptr)
	, _end_of_storage(nullptr)
{
	vector<T> tmp;
	for (auto e : itl)
	{
		tmp.push_back(e);
	}
	swap(tmp);
}
```
