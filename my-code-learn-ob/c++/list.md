# list介绍
[list的文档介绍]([list - C++ Reference (cplusplus.com)](http://m.cplusplus.com/reference/list/list/?kw=list))

1. list是可以在常数范围内在任意位置进行插入和删除的序列式容器，并且该容器可以前后双向迭代。
2. list的底层是==**双向链表结构**==，双向链表中每个元素存储在互不相关的独立节点中，在节点中通过指针指向其前一个元素和后一个元素。
3. list与forward_list非常相似：最主要的不同在于forward_list是单链表，只能朝前迭代，已让其更简单高效。
4. 与其他的序列式容器相比(array，vector，deque)，list通常在任意位置进行插入、移除元素的执行效率更好。
5. 与其他序列式容器相比，list和forward_list最大的缺陷是不支持任意位置的随机访问，比如：要访问list的第6个元素，必须从已知的位置(比如头部或者尾部)迭代到该位置，在这段位置上迭代需要线性的时间开销；list还需要一些额外的空间，以保存每个节点的相关联信息(对于存储类型较小元素的大list来说这可能是一个重要的因素)

# list的使用
## list的构造
|构造函数（ (constructor) | 接口说明|
| :--|:--|
|ist() |构造空的list|
|list (size_type n, const value_type& val = value_type()) |构造的list中包含n个值为val的元素|
|list (const list& x)|拷贝构造函数
|list (InputIterator first, InputIterator last) | 用 [fifirst, last) 区间中的元素构造list

```cpp
#include <iostream>
using namespace std;
#include <list>

void print_list(const list<int>& l) {
	// 注意这里调用的是list的 begin() const，返回list的const_iterator对象
	for (list<int>::const_iterator it = l.begin(); it != l.end(); ++it)
	{
		cout << *it << " ";
		// *it = 10; 编译不通过
	}

	cout << endl;
}

int main()
{
	int array[] = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 0 };
	list<int> l(array, array + sizeof(array) / sizeof(array[0]));
	// 使用正向迭代器正向list中的元素
	for (list<int>::iterator it = l.begin(); it != l.end(); ++it)
		cout << *it << " ";
	cout << endl;
	// 使用反向迭代器逆向打印list中的元素
	for (list<int>::reverse_iterator it = l.rbegin(); it != l.rend(); ++it)
		cout << *it << " ";
	cout << endl;
	return 0;
}
```


## list capacity
|函数声明 | 接口说明|
|:--|:--|
|empty |检测Iist是否为空，是返回true,否则返回false|
|size | 返回Iist中有效节点的个数|

  

## list element access
|函数声明|接口说明|
|:--|:--|
|front|返回ist的第一个节点中值的引用|
|back|返回ist的最后一个节点中值的引用|

  
## list modifiers
|函数声明 | 接口说明|
|:--|:--|
|push_front|在ist首元素前插入值为val的元素|
|pop_front|删除st中第一个元素|
|push_back|在ist尾部插入值为val的元素
|pop_back|删除st中最后一个元素|
|insert|在list position位置中插入值为val的元素
|erase|删除list position位置的元素|
|swap|交换两个ist中的元素|
|clear|清空Iist中的有效元素|

```cpp
#include <list>
void PrintList(list<int>& l) {
	for (auto& e : l)
		cout << e << " ";
	cout << endl;
}
//=====================================================================================
====
// push_back/pop_back/push_front/pop_front
void TestList1()
{
	int array[] = { 1, 2, 3 };
	list<int> L(array, array + sizeof(array) / sizeof(array[0]));
	// 在list的尾部插入4，头部插入0
	L.push_back(4);
	L.push_front(0);
	PrintList(L);
	// 删除list尾部节点和头部节点
	L.pop_back();
	L.pop_front();
	PrintList(L);
}
//=====================================================================================
====
// insert /erase 
void TestList3()
{
	int array1[] = { 1, 2, 3 };
	list<int> L(array1, array1 + sizeof(array1) / sizeof(array1[0]));
	// 获取链表中第二个节点
	auto pos = ++L.begin();
	cout << *pos << endl;
	// 在pos前插入值为4的元素
	L.insert(pos, 4);
	PrintList(L);
	// 在pos前插入5个值为5的元素
	L.insert(pos, 5, 5);
	PrintList(L);
	// 在pos前插入[v.begin(), v.end)区间中的元素
	vector<int> v{ 7, 8, 9 };
	L.insert(pos, v.begin(), v.end());
	PrintList(L);
	// 删除pos位置上的元素
	L.erase(pos);
	PrintList(L);
	// 删除list中[begin, end)区间中的元素，即删除list中的所有元素
	L.erase(L.begin(), L.end());
	PrintList(L);
}
// resize/swap/clear
void TestList4()
{
	// 用数组来构造list
	int array1[] = { 1, 2, 3 };
	list<int> l1(array1, array1 + sizeof(array1) / sizeof(array1[0]));
	PrintList(l1);
	// 交换l1和l2中的元素
	l1.swap(l2);
	PrintList(l1);
	PrintList(l2);
	// 将l2中的元素清空
	l2.clear();
	cout << l2.size() << endl;
}
```


# list的模拟实现
list使用的[[迭代器#双向迭代器：|双向迭代器]]
并带有[[迭代器#反向迭代器|反向迭代器]]的实现。

## `ListNode`节点结构体定义
此结构体用来初始化节点
```cpp
template <class T>
struct ListNode
{
	ListNode<T>* _next;
	ListNode<T>* _prev;
	T _data;

	ListNode(const T& data = T()) //T()是一个匿名结构体
		:_next(nullptr)
		, _prev(nullptr)
		, _data(data)
	{}
};
```
ListNode的构造函数的**缺省值**是使用一个**匿名结构体**来进行赋值的。匿名结构体被==const==修饰会延迟他的生命周期，直到此栈帧被释放。


## `__list_iterator` 迭代器的定义
定义了list的迭代器，以及一些运算符重载的函数。

==**Ref 是 const T*
Ptr 是 const T&**==
```cpp
template <class T , class Ref , class Ptr>
struct __list_iterator
{
	typedef ListNode<T> Node;
	typedef __list_iterator<T, Ref, Ptr> self;
	Node* _node;

	__list_iterator(Node* x)
		:_node(x)
	{}

	//Ref 是 const T&
	Ref operator*()
	{
		return _node -> _data;
	}

	//ptr 是 const T*
	Ptr operator->()
	{
		return &_node->_data;
	}

	//++int
	self& operator++()
	{
		_node = _node->_next;
		return *this;
	}
	//int++
	self operator++(int)
	{
		__list_iterator<T> tmp(*this);
		_node = _node->_next;
		return tmp;
	}

	//--int
	self& operator--()
	{
		_node = _node->_prev;
		return *this;
	}

	// int--
	self operator--(int)
	{
		__list_iterator<T> tmp(*this);
		_node = _node->_prev;
		return tmp;
	}

	bool operator!=(const self& it) const
	{
		return _node != it._node;
	}

	bool operator==(const self& it) const
	{
		return _node == it._node;
	}
};
```


## `list` 主体

```cpp
template<class T>
	class list
	{
		typedef ListNode<T> Node;

	public:
		typedef __list_iterator<T , T& , T*> iterator; //这是普通的迭代器
		typedef __list_iterator<T, const T&, const T*> const_iterator; //这是const迭代器

		typedef reverse_iterator<const_iterator, const T&, const T*> const_reverse_iterator;
		typedef reverse_iterator<iterator, T&, T*>  reverse_iterator;
		

		reverse_iterator rbegin()
		{
			return reverse_iterator(end());
		}

		reverse_iterator rend()
		{
			return reverse_iterator(begin());
		}

		iterator begin() //因为 _head->_next 是指针，所以iterator放回的是一个 T*
		{
			return iterator(_head->_next);
		}

		iterator end()//因为 _head是指针，所以iterator放回的是一个 T*
		{
			return iterator(_head);
		}

		const_iterator begin() const//因为 _head->_next 是指针，但const_iterator是const修饰的，所以返回的是一个 const T*
		{
			return const_iterator(_head->_next);
		}

		const_iterator end() const//因为 _head 是指针，但const_iterator是const修饰的，所以返回的是一个 const T*
		{
			return const_iterator(_head);
		}

		list()
		{
			_head = new Node();
			_head->_next = _head;
			_head->_prev = _head;
		}

		////传统写法 lt2(lt1)
		//list(const list<T>& lt)
		//{
		//	_head = new Node();
		//	_head->_next = _head;
		//	_head->_prev = _head;

		//	for (auto e : lt)
		//	{
		//		push_back(e);
		//	}
		//}
		////lt2 = lt1
		//list<T>& operator=(const list<T>& lt)
		//{
		//	if (this != &lt)
		//	{
		//		clear();
		//		for (auto e : lt)
		//		{
		//			push_back(e);
		//		}
		//	}

		//	return *this;
		//}


		list(int n, const T& val = T())
		{
			_head = new Node();
			_head->_next = _head;
			_head->_prev = _head;
			for (int i = 0; i < n; i++)
			{
				push_back(val);
			}
		}
		list(size_t n, const T& val = T())
		{
			_head = new Node();
			_head->_next = _head;
			_head->_prev = _head;
			for (size_t i = 0; i < n; i++)
			{
				push_back(val);
			}
		}
		//现代写法
		template<class InputIterator>
		list(InputIterator first, InputIterator last )
		{
			_head = new Node();
			_head->_next = _head;
			_head->_prev = _head;

			while (first != last)
			{
				push_back(*first);
				++first;
			}
		}
		list(const list<T>& lt)
		{
			_head = new Node();
			_head->_next = _head;
			_head->_prev = _head;

			list<T> tmp(lt.begin(), lt.end());
			std::swap(_head, tmp._head);
		}

		list<T>& operator=(list<T> lt)
		{
			std::swap(_head, lt._head);
			return *this;
		}

		~list()
		{
			clear();

			delete _head;
			_head = nullptr;
		}

		


		void clear()
		{

			/*iterator it = begin();
			while (it != end())
			{
				iterator del = it++;
				delete del._node;
			}

			_head->_next = _head;
			_head->_prev = _head;*/


			iterator lt = begin();
			while (lt != end())
			{
				erase(lt++);
			}
		}


		void push_front(const T& x)
		{
			insert(begin(), x);
		}

		void pop_front()
		{
			erase(begin());
		}


		iterator insert(iterator pos , const T& x)
		{
			Node* cur = pos._node;
			Node* prev = cur->_prev;
			Node* NewNode = new Node(x);

			prev->_next = NewNode;
			NewNode->_prev = prev;
			NewNode->_next = cur;
			cur->_prev = NewNode;

			return iterator(NewNode);
		}

		void push_back(const T& x)
		{
			/*Node* tail = _head->_prev;
			Node* NewNode = new Node(x);
			tail->_next = NewNode;
			NewNode->_prev = tail;
			NewNode->_next = _head;
			_head->_prev = NewNode;*/

			insert(end(), x);
		}


		void pop_back()
		{
			erase(--end());
		}


		iterator erase(iterator pos)
		{
			assert(pos != end());

			Node* prev = pos._node->_prev;
			Node* next = pos._node->_next;
			delete pos._node;
			prev->_next = next;
			next->_prev = prev;

			return iterator(next); //返回的是删除节点的下一个节点
		}


	private:
		Node* _head;
	};
```

这部分的其实就是指定迭代器所用的模板参数
![[Pasted image 20220518220442.png]]
对应的就是`__list_iterator`中 `self` 中的 ==模板== 
![[Pasted image 20220518220728.png]]

## `list` 迭代器失效
在list的增删查改中，都有可能会出现迭代器失效。

错误案例：
```cpp
void test3()
{
	list<int> lt3;
	lt3.push_back(44);
	lt3.push_back(66);
	lt3.push_back(68);
	lt3.push_back(87);

	list<int>::iterator b = lt3.begin();
	while (b != lt3.end())
	{
		if (b._node->_data == 66)
		{
			lt3.erase(b); //必须要考虑到迭代器失效，所以必须为b = erase 的返回值。 erase的返回值是一个iterator，也就是一个新的迭代器了。然后却没有变量接收。
		}
		else
		{
			++b;
		}
	}                               
	print_list(lt3);//打印list

	list<int>::iterator c = lt3.begin();
	while (c != lt3.end())
	{
		if (c._node->_data == 68)
		{
			c = lt3.insert(c, 77);//insert 插入后迭代器是在插入值的位置，后一个就是我们的目标值68，所以会陷入死循环
		}
		else
		{
			++c;
		}
	}
	print_list(lt3);//打印list
}
```

正确做法：
```cpp
void test3()
{
	list<int> lt3;
	lt3.push_back(44);
	lt3.push_back(66);
	lt3.push_back(68);
	lt3.push_back(87);

	list<int>::iterator b = lt3.begin();
	while (b != lt3.end())
	{
		if (b._node->_data == 66)
		{
			b = lt3.erase(b); //必须要考虑到迭代器失效，所以必须为b = erase 的返回值。 erase的返回值是一个iterator，也就是一个新的迭代器了。然后却没有变量接收。
		}
		else
		{
			++b;
		}
	}                               
	print_list(lt3);//打印list

	list<int>::iterator c = lt3.begin();
	while (c != lt3.end())
	{
		if (c._node->_data == 68)
		{
			lt3.insert(c, 77);//insert 插入后迭代器是在插入值的位置，后一个就是我们的目标值68，，如果再使用 c=lt3.insert(c, 77) 就会会陷入死循环.
			c++;
		}
		else
		{
			++c;
		}
	}
	print_list(lt3);//打印list
}
```

## 添加initializer_list构造函数
[[列表初始化#initializer_list|initializer_list]]来构造list。
```cpp
list(std::initializer_list<T> ilt)
{
	_head = new Node();
	_head->_next = _head;
	_head->_prev = _head;

	for (auto e : ilt)
	{
		push_back(e);
	}
}
```