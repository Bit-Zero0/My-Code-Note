# stack

## stack容器的介绍
![[Pasted image 20220528202034.png]]
类模板也是可以有缺省值的  **`Container = deque<T>`** 就是模板缺省值。
而这个缺省值其实就是 ==**容器适配器**==。
>1. stack是一种容器适配器，专门用在具有==**后进先出**==操作的上下文环境中，**其删除只能从容器的一端进行元素的插入与提取操作**。
>
>2. stack是作为**容器适配器**被实现的，**容器适配器即是对特定类封装作为其底层的容器**，并提供一组特定的成员函数来访问其元素，将特定类作为其底层的，元素特定容器的尾部(即栈顶)被压入和弹出。
>
>3. **stack的底层容器可以是任何标准的容器类模板或者一些其他特定的容器类**，这些容器类应该支持以下操作：
>		* ==empty==：判空操作
>		* ==back==：获取尾部元素操作
>		* ==push_back==：尾部插入元素操作
>		* ==pop_back==：尾部删除元素操作
>
>4. 标准容器==**vector、deque、list**==均符合这些需求，默认情况下，如果没有为stack指定特定的底层容器，默认情况下使用==**deque**==。

![[Pasted image 20220528202916.png]]


## stack常见方法
![[Pasted image 20220528202958.png]]


## stack的模拟实现
如我们传入的`vector`容器，`stack`则会适配`vector`容器
```cpp
#pragma once
#include <vector>
#include <list>
#include <forward_list>

namespace fmy 
{
	template<class T ,class Container= deque<T>>
	class stack
	{
	public:
		bool empty() const
		{
			return _con.empty();
		}

		size_t size() const
		{
			return _con.size();
		}

		const T& front() const
		{
			return _con.front();
		}

		const T& top() const
		{
			return _con.back();
		}

		void push(const T& x)
		{
			_con.push_back(x);
		}

		void pop()
		{
			_con.pop_back();
		}
	private:
		Container _con;
	};
}

```

如这里我们传入的就是 vector容器
```cpp
#include "stack.h"
#include <iostream>
#include <stack>
using namespace std;

void test1()
{
	fmy::stack<int , std::vector<int>> s;

	s.push(10);
	s.push(20);
	s.push(30);
	s.push(40);

	while (!s.empty())
	{
		cout << s.top() << " ";
		s.pop();
	}
	cout << endl;

}

int main()
{
	test1();
	return 0;
}
```
![[Pasted image 20220528203454.png]]


## 练习
[155. 最小栈 - 力扣（LeetCode）](https://leetcode.cn/problems/min-stack/submissions/)
[栈的压入、弹出序列_牛客题霸_牛客网 (nowcoder.com)](https://www.nowcoder.com/practice/d77d11405cc7470d82554cb392585106?tpId=13&tqId=23290&ru=/practice/4c776177d2c04c2494f2555c9fcc1e49&qru=/ta/coding-interviews/question-ranking)
[150. 逆波兰表达式求值 - 力扣（LeetCode）](https://leetcode.cn/problems/evaluate-reverse-polish-notation/submissions/)



# queue
## queue容器的介绍
![[Pasted image 20220528204020.png]]
类模板也是可以有缺省值的  **`Container = deque<T>`** 就是模板缺省值。
而这个缺省值其实就是 ==**容器适配器**==。


>1. 队列是一种==**容器适配器**==，专门用于在==**FIFO上下文(先进先出)**==中操作，其中==从容器一端插入元素，另一端提取元素==。
>
>2. ==队列作为容器适配器实现，容器适配器即将特定容器类封装作为其底层容器类，queue提供一组特定的成员函数来访问其元素==。==**元素从队尾入队列，从队头出队列**==。
>
>3. 底层容器可以是标准容器类模板之一，也可以是**其他==专门==设计的容器类。该底层容器应至少支持以下操作**:
		* ==**empty**==：检测队列是否为空
		* ==**size**==：返回队列中有效元素的个数
		* ==**front**==：返回队头元素的引用
		* ==**back**==：返回队尾元素的引用
		* ==**push_back**==：在队列尾部入队列
		* ==**pop_front**==：在队列头部出队列
>
>4. 标准容器类==**deque**==和==**list**==满足了这些要求。默认情况下，如果没有为queue实例化指定容器类，则使用标准容器==**deque**==。
![[Pasted image 20220528204216.png]]


## stack的常见方法
![[Pasted image 20220528204153.png]]


## queue的模拟实现
```cpp
#pragma once
#include<vector>
#include<list>

namespace fmy
{
	// stack<int, vector<int>> s;
	// stack<int, list<int>> s;

	template<class T, class Container = deque<T>>
	class queue
	{
	public:
		bool empty() const
		{
			return _con.empty();
		}

		size_t size() const
		{
			return _con.size();
		}

		const T& front() const
		{
			return _con.front();
		}

		const T& back() const
		{
			return _con.back();
		}

		void push(const T& x)
		{
			_con.push_back(x);
		}

		void pop()
		{
			_con.pop_front();
		}
	private:
		Container _con;
	};
}
```

```cpp
#include "queue.h"
#include <iostream>
#include <list>
#include <queue>

using namespace std;
void test2()
{
	fmy::queue<int ,list<int>> q;
	q.push(1);
	q.push(2);
	q.push(3);
	q.push(4);

	while (!q.empty())
	{
		cout << q.front() << " ";
		q.pop();
	}
	cout << endl;
}

int main()
{
	test2();
	return 0;
}
```
![[Pasted image 20220528204446.png]]


# priovity_queue
![[Pasted image 20220529201932.png]]
## priority_queue的介绍
1. 优先队列是一种==**容器适配器**==，根据严格的==弱排序标准==，它的**第一个元素总是它所包含的元素中最大的**。

2. 此上下文类似于==**堆**==，在堆中可以随时插入元素，并且只能检索最大堆元素(优先队列中位于顶部的元素)。

3. 优先队列被实现为==**容器适配器**==，容器适配器即将特定容器类封装作为其底层容器类，`queue`提供一组特定的成员函数来访问其元素。元素从==特定容器的“尾部”弹出，其称为优先队列的顶部==。

4. 底层容器可以是任何标准容器类模板，也可以是其他特定设计的容器类。容器应该可以通过随机访问迭代器访问，并支持以下操作：
		`empty()`：检测容器是否为空
		`size()`：返回容器中有效元素个数
		`front()`：返回容器中第一个元素的引用
		`push_back()`：在容器尾部插入元素
		`pop_back()`：删除容器尾部元素

5. 标准容器类`vector`和`deque`满足这些需求。默认情况下，如果没有为特定的priority_queue类实例化指定容器类，则使用`vector`。

6. 需要支持==**随机访问迭代器**==，以便始终在内部保持堆结构。容器适配器通过在需要时自动调用算法函数`make_heap`、`push_heap`和`pop_heap`来自动完成此操作。


## priority_queue的使用
>优先级队列默认使用vector作为其底层存储数据的容器，在vector上又使用了堆算法将vector中元素构造成堆的结构，因此priority_queue就是堆，所有需要用到堆的位置，都可以考虑使用priority_queue。
>
>注意：默认情况下priority_queue是大堆。
>
>![[Pasted image 20220529201449.png]]


# priority_queue 的模拟实现
要注意到我们事项priority_queue 时，需要用到==**仿函数**== 。

实现代码：
```cpp
#pragma once

namespace fmy
{
	template<class T>
	struct Less // 这就是一个仿函数
	{
		bool operator()(const T& x, const T& y) const
		{
			return x < y;
		}
	};

	template<class T>
	struct Greater // 这就是一个仿函数
	{ 
		bool operator()(const T& x , const T& y) const{
			return x > y;
		}
	};

	template<class T, class Container = vector<T>, class Compare = Less<T> > //默认的仿函数为Less。
	class priority_queue
	{
	private:
		void adjust_up(size_t child)
		{
			Compare com;
			size_t parent = (child - 1) / 2;

			while (child > 0)
			{
				if (com(_con[parent], _con[child]))
				{
					swap(_con[parent], _con[child]);
					child = parent;
					parent = (child - 1) / 2;
				}
				else
				{
					break;
				}
			}
		}


		void adjust_down(size_t parent)
		{
			Compare com;
			size_t child = parent * 2 + 1;
			while (child < _con.size())
			{
				if (child + 1 < _con, size() && com(_con[child] < _con[child + 1]))
				{
					++child;
				}

				if (com(_con[parent], _con[child]))
				{
					swap(_con[parent], _con[child]);
					parent = child;
					child = parent * 2 + 1;
				}
				else
				{
					break;
				}
			}
		}

	public:
		priority_queue()
		{}

		template <class InputIterator>
		priority_queue(InputIterator first, InputIterator last)
			:_con(first , last)
		{
			for (int i = (_con.size() - 1 - 1) / 2; i >= 0; --i)
			{
				abjust_down(i);
			}
		}

		void push(const T& x)
		{
			_con.push(x);
			adjust_up(_con.size() - 1);
		}

		void pop()
		{
			swap(_con[0], _con[size() - 1]);
			_con.pop();
			adjust_down(0);
		}

		const T& top()
		{
			return _con[0];
		}

		size_t size()
		{
			return _con.size();
		}

		bool empty()
		{
			return _con.empty();
		}

	private:
		Container _con;
	};
}
```

测试代码：
```cpp
#include <iostream>
#include <vector>
#include <functional>
#include "priority_queue" //这就是我们写的priority_queue

using std::cout;
using std::endl;

void test_priority_queue()
{
	priority_queue<int , vector<int> , greater<int> > pq;
	pq.push(1);
	pq.push(2);
	pq.push(6);
	pq.push(4);
	pq.push(1);

	while (!pq.empty())
	{
		cout << pq.top() << " ";
		pq.pop();
		cout << endl;
	}
}

int main()
{
	test_priority_queue();
	return 0;
}
```

## 仿函数
仿函数，又名 函数对象。

仿函数(functor)，就是使**一个类的使用看上去像一个函数**。其实现就是类中实现一个`operator()`，这个类就有了类似函数的行为，就是一个仿函数类了。


先看priority_queue的类模板：
```cpp
template<class T, class Container = vector<T>, class Compare = Less<T> > //默认的仿函数为Less。
	class priority_queue
```
**类模板**的==第三个参数==就是我们实现的仿函数 ，默认的Less缺省值就是以==降序排序==。


在priority_queue中，两个仿函数的实现，如：
```cpp
template<class T>
struct Less // 这就是一个仿函数
{
	bool operator()(const T& x, const T& y) const
	{
		return x < y;
	}
};

template<class T>
struct Greater // 这就是一个仿函数
{ 
	bool operator()(const T& x , const T& y) const{
		return x > y;
	}
};
```

==**Less**== 控制的的 `priority_queue`  中的==**数组的降序(大堆)**==，==**Greater**==控制的则是==**数组的升序(小堆)**==。

**所以重载了`()`  操作符 ，所以调用起来，非常像一个函数， 但实际上并不是函数，而是操作符重载。**



在方法中就实现了调用：  以下默认调用仿函数 `Less`
```cpp
void adjust_up(size_t child)
{
	Compare com; //定义出类名，这里默认内部使用的是Less
	size_t parent = (child - 1) / 2;

	while (child > 0)
	{
		if (com(_con[parent], _con[child])) //这里就是调用了我们写的Less的仿函数，在仿函数进行比较
		{
			swap(_con[parent], _con[child]);
			child = parent;
			parent = (child - 1) / 2;
		}
		else
		{
			break;
		}
	}
}


void adjust_down(size_t parent)
{
	Compare com;//实例化仿函数
	size_t child = parent * 2 + 1;
	while (child < _con.size())
	{
		if (child + 1 < _con, size() && com(_con[child] < _con[child + 1]))//此处的com也是调用了仿函数Less
		{
			++child;
		}

		if (com(_con[parent], _con[child]))//此处的com也是调用了仿函数Less
		{
			swap(_con[parent], _con[child]);
			parent = child;
			child = parent * 2 + 1;
		}
		else
		{
			break;
		}
	}
}
```
