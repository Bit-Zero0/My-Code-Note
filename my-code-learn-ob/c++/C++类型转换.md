 # C语言中的类型转换 
 在C语言中，如果**赋值运算符左右两侧类型不同，或者形参与实参类型不匹配，或者返回值类型与接收返回值类型不一致时，就需要发生类型转化**，C语言中总共有两种形式的类型转换:隐式类型转换和显式类型转换。
1. 隐式类型转化:编译器在编译阶段自动进行，能转就转，不能转就编译失败
2. 显式类型转化:需要用户自己处理
```cpp
void Test ()
{
	int i = 1; 
	// 隐式类型转换 
	double d = i;
	printf("%d, %.2f\n" , i, d); 
	
	int* p = &i;
	// 显示的强制类型转换 
	int address = (int) p;

	printf("%x, %d\n" , p, address);
}
```
**缺陷：  转换的可视性比较差，所有的转换形式都是以一种相同形式书写，难以跟踪错误的转换**

# C++强制类型转换
标准C++为了加强类型转换的可视性，引入了四种命名的强制类型转换操作符： 
`static_cast`、`reinterpret_cast`、`const_cast`、`dynamic_cast` .


## static_cast
`static_cast`用于**非多态类型**的转换（静态转换），编译器隐式执行的任何类型转换都可用`static_cast`，但它**不能用于两个不相关的类型进行转换**.
```cpp
 int main()
 {
	 double d = 12.34;
	 int a = static_cast<int>(d);
	 cout << a << endl;
	 return 0;
 }
```

## reinterpret_cast
`reinterpret_cast`**操作符通常为操作数的位模式提供较低层次的重新解释，==用于将一种类型转换为另一种不同的类型==**
```cpp
typedef void (* FUNC)(); 
int DoSomething (int i)
{
	cout<<"DoSomething" <<endl; 
	return 0;
}

void Test () 
{
	//
	// reinterpret_cast可以编译器以FUNC的定义方式去看待DoSomething函数
	// 所以非常的BUG，下面转换函数指针的代码是不可移植的，所以不建议这样用 
	// C++不保证所有的函数指针都被一样的使用，所以这样用有时会产生不确定的结果 
	//
	FUNC f = reinterpret_cast< FUNC>(DoSomething ); 
	f();
 }
```


## const_cast
**`const_cast`最常用的用途就是删除变量的const属性，方便赋值** ,const属性被去掉以后，会被修改。小心跟编译器优化冲突误判 但是最好很voliate关键字一起使用。
```cpp
void Test () 
 {
	voliate const int a = 2;
	int* p = const_cast< int*>(&a ); //虽然使用了const_cast取消了常量属性，但是编译器还是会对其进行优化，所以最好在被const修饰的变量上使用voliate关键字
	*p = 3;
	cout<<a <<endl; 
 }
```


## dynamic_cast
`dynamic_cast`用于**将一个父类对象的指针/引用转换为子类对象的指针或引用(动态转换)**
==向上转型==：子类对象指针/引用->父类指针/引用(不需要转换，赋值兼容规则)
==向下转型==：父类对象指针/引用->子类指针/引用(用`dynamic_cast`转型是安全的)

注意：  
1. **`dynamic_cast`只能用于含有虚函数的类**  
2. `dynamic_cast`会**先检查**是否能转换成功，能成功则转换，不能则返回0.

```cpp
class A
 {
public :
	explicit A (int a) 
    {
		cout<<"A(int a)" <<endl;
    }
	
	A(const A& a) 
    {
	    cout<<"A(const A& a)" <<endl;
    } 
private :
	int _a ; 
 };
 
int main () 
 {
	A a1 (1)
	
	// 隐式转换-> A tmp(1); A a2(tmp); 
	A a2 = 1;
}
```

