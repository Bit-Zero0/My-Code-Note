# lambda的由来
++98中的一个例子
在C++98中，如果想要对一个数据集合中的元素进行排序，可以使用std::sort方法。

```cpp
int main()  
{  
    int array[] = {4,1,8,5,3,7,0,9,2,6};  
    // 默认按照小于比较，排出来结果是升序  
    std::sort(array, array+sizeof(array)/sizeof(array[0]));  
    
    // 如果需要降序，需要改变元素的比较规则  
    std::sort(array, array + sizeof(array) / sizeof(array[0]), greater<int>());  
    return 0;  
}
```
如果待排序元素为自定义类型，需要用户定义排序时的比较规则:
```cpp
struct Goods
{
    string _name;
    double _price;
};
struct Compare
{
    bool operator()(const Goods& gl, const Goods& gr)
    {
        return gl._price <= gr._price;
    }
};
int main()
{
    Goods gds[] = { { "苹果", 2.1 }, { "相交", 3 }, { "橙子", 2.2 }, {"菠萝", 1.5} };
    sort(gds, gds + sizeof(gds) / sizeof(gds[0]), Compare());
    return 0;
}
```
随着C++语法的发展，**人们开始觉得上面的写法太复杂了，每次为了实现一个algorithm算法， 都要重新去写一个类，如果每次比较的逻辑不一样，还要去实现多个类，特别是相同类的命名，这些都给编程者带来了极大的不便**。因此，在C11语法中出现了Lambda表达式

上面例子改用lambda表达式
```cpp
int main()  
{  
    Goods gds[] = { { "苹果", 2.1 }, { "相交", 3 }, { "橙子", 2.2 }, {"菠萝", 1.5} };  
    sort(gds, gds + sizeof(gds) / sizeof(gds[0]), [](const Goods& l, const Goods& r)->bool  
    {  
        return l._price < r._price;  
    });  
    return 0;  
}
```
上述代码就是使用C++11中的lambda表达式来解决，可以看出lamb表达式实际是一个匿名函数。

# lambda表达式语法
lambda表达式书写格式：`[capture-list] (parameters) mutable -> return-type { statement }`
1. lambda表达式各部分说明
	- [capture-list] : **捕捉列表**，该列表总是出现在lambda函数的开始位置，**编译器根据[]来判断接下来的代码是否为lambda函数，捕捉列表能够捕捉上下文中的变量供lambda函数使用**。 
	- (parameters)：参数列表。**与普通函数的参数列表一致**，如果不需要参数传递，则可以连同()一起省略
	- mutable：默认情况下，lambda函数总是一个const函数，mutable可以取消其常量性。使用该修饰符时，参数列表不可省略(即使参数为空)。
	- ->return-type：返回值类型。用追踪返回类型形式声明函数的返回值类型，没有返回值时此部分可省略。返回值类型明确情况下，也可省略，由编译器对返回类型进行推导。
	- **{statement}：函数体**。在该函数体内，除了可以使用其参数外，还可以使用所有捕获到的变量。 
**注意**：  在lambda函数定义中，**参数列表和返回值类型都是可选部分，而捕捉列表和函数体可以为空**。因此C++11中**最简单的lambda函数**为：`[]{}` ; 该lambda函数不能做任何事情。

```cpp
int main()
{
    // 最简单的lambda表达式, 该lambda表达式没有任何意义
    [] {};

    // 省略参数列表和返回值类型，返回值类型由编译器推导为int 
    int a = 3, b = 4;
    [=] {return a + 3; };

    // 省略了返回值类型，无返回值类型
    auto fun1 = [&](int c) {b = a + c; };
    fun1(10);
    cout << a << " " << b << endl;

    // 各部分都很完善的lambda函数
    auto fun2 = [=, &b](int c)->int {return b += a + c; };
    cout << fun2(10) << endl;

    // 复制捕捉x ,但捕捉到的x是不可变的，所以需要加上mutable
    int x = 10;
    auto add_x = [x](int a) mutable { x *= 2; return a + x; };
    cout << add_x(10) << endl;
    return 0;
}
```
通过上述例子可以看出，lambda表达式实际上可以理解为无名函数，该函数无法直接调用，如果想要直接调用，可借助auto将其赋值给一个变量。

2. 捕获列表说明
捕捉列表描述了上下文中那些数据可以被lambda使用，以及使用的方式传值还是传引用。
>- [var]：表示值传递方式捕捉变量var
>- [=]：表示值传递方式捕获所有父作用域中的变量(包括this) 
>- [&var]：表示引用传递捕捉变量var
>- [&]：表示引用传递捕捉所有父作用域中的变量(包括this) 
>- [this]：表示值传递方式捕捉当前的this指针

注意：
- a. **父作用域指包含lambda函数的语句块**
- b. **语法上捕捉列表可由多个捕捉项组成，并以逗号分割**。
	- 比如：[=, &a, &b]：以引用传递的方式捕捉变量a和b，值传递方式捕捉其他所有变量 [&，a, this]：值传递方式捕捉变量a和this，引用方式捕捉其他变量 
- c. **捕捉列表不允许变量重复传递，否则就会导致编译错误**。 比如：[=, a]：=已经以值传递方式捕捉了所有变量，捕捉a重复
- d.  **在块作用域以外的lambda函数捕捉列表必须为空**。
- e. 在块作用域中的lambda函数仅能捕捉父作用域中局部变量，捕捉任何非此作用域或者非局部变量都会导致编译报错。
- f. **lambda表达式之间不能相互赋值**，即使看起来类型相同

```cpp
void (*PF)();
int main()
{
	auto f1 = [] {cout << "hello world" << endl; };
	auto f2 = [] {cout << "hello world" << endl; };
	// 此处先不解释原因，等lambda表达式底层实现原理看完后，大家就清楚了 
	//f1 = f2;    // 编译失败--->提示找不到operator=()
	
	// 允许使用一个lambda表达式拷贝构造一个新的副本 
	auto f3(f2);
	f3();
	
	// 可以将lambda表达式赋值给相同类型的函数指针 
	PF = f2;
	PF();
	return 0;
}
```

# 函数对象与lambda表达式
函数对象，又称为仿函数，即可以想函数一样使用的对象，就是在类中重载了`operator()`运算符的类对象。
```cpp
class Rate 
{
public:
	Rate(double rate): _rate(rate) 
    {}
    
	double operator()(double money, int year) 
    { 
	    return money * _rate * year;
	}
    
private:
	double _rate; 
};

int main() 
{
	// 函数对象
	double rate = 0.49; 
	Rate r1(rate);
	r1(10000, 2); 
	
	// lambda
	auto r2 = [=](double monty, int year)->double{return monty*rate*year; }; 
	r2(10000, 2);
	return 0;
}
```
从使用方式上来看，函数对象与lambda表达式完全一样。
函数对象将rate作为其成员变量，在定义对象时给出初始值即可，lambda表达式通过捕获列表可以直接将该变量捕获到。


# lambda的本质
**lambda其实是一个类，定义了一个lambda表达式，编译器会自动生成一个类，在该类中重载了operator()**。  这也是定义lambda表达式的需要使用 [[变量类型推导#auto 使用细则|auto]] 来定义
![[Pasted image 20221012223030.png]]
实际在底层编译器对于lambda表达式的处理方式，完全就是按照函数对象的方式处理的，即：如果定义了一个lambda表达式，编译器会自动生成一个类，在该类中重载了operator()。