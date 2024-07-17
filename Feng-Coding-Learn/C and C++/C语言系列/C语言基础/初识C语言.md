---
Type: Note
tags:
  - C
Status: writing
start-date: 2024-05-20 16:57
Finish-date: 
Modified-date: 2024-07-17 11:03
Publish:
---

# 本文摘要
基本了解C语言的基础知识，对C语言有一个大概的认识。每个知识点就是简单认识，不做详细讲解，后期都会细讲。

- 什么是C语言
- 第一个C语言程序
- 数据类型
- 变量、常量
- 字符串+转义字符+注释
- 选择语句
- 循环语句
- 函数
- 数组
- 操作符
- 常见关键字
- define 定义常量和宏
- 指针
- 结构体

> [!warning]+ 注意
> 本文会讲解以上知识, 但是只是浅尝一下, 能让你看懂一些非常简单的C语言程序, C语言不止是这些内容, 后续的内容也很重要.
## 前提知识
无任何前提知识, 专为编程初学者而写.


# 什么是C语言

## C语言简介
C语言是一门通用计算机编程语言，广泛应用于底层开发。C语言的设计目标是提供一种能以简易的方式编译、处理低级存储器、产生少量的机器码以及不需要任何运行环境支持便能运行的编程语言。

尽管C语言提供了许多低级处理的功能，但仍然保持着良好跨平台的特性，以一个标准规格写出的
C语言程序可在许多电脑平台上进行编译，甚至包含一些嵌入式处理器（单片机或称MCU）以及超级电脑等作业平台。

二十世纪八十年代，为了避免各开发厂商用的C语言语法产生差异，由美国国家标准局为C语言制
定了一套完整的美国国家标准语法，称为**ANSI C**，作为C语言最初的标准。 目前2011年12月8日，国际标准化组织（ISO）和国际电工委员会（IEC）发布的C11标准是C语言的第三个官方标准，也是C语言的最新标准，该标准更好的支持了汉字函数名和汉字标识符，一定程度上实现了汉字编程。

C语言是一门面向过程的计算机编程语言，与C++，Java等面向对象的编程语言有所不同。

其编译器主要有**Clang**、**GCC**、WIN-TC、SUBLIME、**MSVC**、Turbo C等。

## 标准 和 编译器的影响
1. 可将C语⾔的标准理解为C语⾔说明书。但其并没有强制性约束⼒。
2. **如果编译器不⽀持标准，我们即使使⽤标准中的语法仍然会报错**。
3. 编译器版本也会影响程序。因此，编写程序之前要确定编译器版本。

> 如：微软拿到标准，认为有些标准不合理，不⽀持。 
> 微软认为某些特性⾮常好，但标准中没有，微软可以修改标准，新增语法.\

## 常见的C/C++编译器
1. Borland C++   宝蓝公司
1. Intel C++   英特尔编译器
2. **MSVC**        微软公司
3. Clang        JetBrains公司
4. g++编译器（gcc是编译套件）, Linux 默认使⽤的编译器. 对标准⽀持最好.

> [!tip] C语言系列使用的编译器与编译环境
> - 运行系统: Windows11 
> - 开发环境: Visual Studio 2022(编译器为**MSVC**) .  极少数案例会使用**GCC**(用的时会特殊说明)


## 常见开发工具
- Windows操作系统
    - vs（visual studio）2013、2015、2017、2019、2022
    - Clion：跨平台IDE、跟Java的IDEA、python的pycharm是同一家公司的
    - Qt Creator 跨平台IDE
    
- MacOS（苹果电脑的操作系统）
    - Xcode Clion：跨平台IDE。 Qt Creator 跨平台IDE。
    
- Linux：
    - vi/vim —— ⽂本编辑器。 Clion：跨平台IDE。 Qt Creator 跨平台IDE。

> [!info] 跨平台性最好的是Clion
> Clion的跨平台性是最好的, 因为不管在MacOS 还是Linux 还是Windows上, Clion 使用的编译器都是Clang. 但是该工具是收费的. 

本系列使用的是 Visual Studio 2022 , 它的社区版本是免费的, 并且足够我们使用, 这里是[[安装 Visual Studio 2022 并创建项目|安装教程]].

# 第一个 C 语言程序: Hello World
[[安装 Visual Studio 2022 并创建项目#创建项目]]

我在 **源文件** 这目录中创建 HelloWorld.c 文件, 名称前缀可以随意改, 但是文件后缀必须是 `.c` .

## 体验

在HelloWorld.c 文件中写如下内容:  

```c
#include <stdio.h>
int main()
{
    printf("Hello World!\n");
    return 0;
}
```


> [!info] 这段代码的意义
> 在屏幕上打印: Hello World


点击键盘上的 ==F5== 运行程序.

或者点击这这两个按钮中的其中一个(这两个按钮是有差别的, 后续内容会讲到, 不会影响到前期的内容): 
![[Pasted image 20240604135908.png]]

以下是运行结果:
![[Pasted image 20240604135214.png]]

运行后会出现一个黑框, 其中就有这个我们代码的运行结果.

## 详细解析
```c
#include <stdio.h>
int main()
{
    printf("Hello World!\n");
    return 0;
}
```

C语言中main函数是程序的入口, 程序是从main函数的第一行开始执行的, main函数有且仅有一个.

`#include` ： 引⼊头⽂件专⽤关键字。
- 如上: `#include <stdio.h>`, 意思为导入 `stdio.h` 这个头文件
- `stdio.h`  C 标准输入和输出库.  程序中使⽤了 printf() 函数。就必须使⽤该头⽂件。
	- std：标准：standard 
	- i： input 输⼊ 
	- o： output 输出

`printf()`是一个库函数 是C语言编译器提供的一个现成的函数, 直接可以使用
- 功能就是在屏幕上打印数据
- 但是在使用之前得包含头文件，`stdio.h`
- `"Hello World\n"` - 是一个字符串
	- `\n` 表示换行
	- 双引号引起来的就是字符串


> [!warning]+ 注意事项
> - 程序中使⽤的所有的字符，全部是 “英⽂半⻆” 字符。
> - 程序中，==严格区分**⼤⼩写**==。
> - 分号`;` 代表⼀⾏结束。不能使⽤ 中⽂分号 “`；`”，必须是英⽂。

## 代码执行流程分析
写好的 `.c` 文件中的代码是文本信息, 这些代码是不能直接运行的, 那是如何成为程序的呢?
那就必须了解C语言的代码执行过程了.

完整的C语言运行，分为以下4步，在VS中我们直接运行，其实是把中间的步骤给省略了
![[C语言简易编译原理图.excalidraw|598]]
- 预处理（这一步后面单独讲解）
    - 简单理解，就是先找到#include后面的 <stdio.h>这个文件
- 编译
    - 把c文件编译成二进制文件后缀名为obj
- 连接/链接积分
    - 把预处理找到的h文件，还有编译之后产生的obj文件打包在一起，产生exe文件
- 运行
	- 运行exe文件


# 基础数据类型
> [!note] 什么是数据类型?
> 数据类型是编程中用来定义变量可以存储的数据种类的一种方式。就像我们在生活中有不同的容器用来存放不同的东西一样，编程中也有不同的数据类型来存放不同类型的数据。
> 1. **整数（Integer）**：用来存储没有小数点的数字，比如：`5`, `-3`, `42`。
> 	-  **例子**：假设你有一个盒子用来存放年龄，你只能放整数进去，因为年龄没有小数点。
>2. **浮点数（Floating-point number）**：用来存储有小数点的数字，可以表示更精确的数值，比如：`3.14`, `-0.001`, `2.99792458e8`（光速的近似值，科学记数法表示）。
 > 	  - **例子**：如果你要计算一个圆的面积，你需要使用浮点数来存储圆的半径，因为半径可能有小数。
>1. **字符（Character）**：用来存储单个字母或者数字，比如：`'a'`, `'3'`, `'@'`。
  > 	 - **例子**：如果你要编写一个程序来检查用户输入的密码的第一个字符，那么你会用到字符类型。
>1. **布尔值（Boolean）**：用来表示真或假，只有两个值：`True` 或 `False`。
 > 	  - **例子**：假设你有一个门禁系统，它只允许年龄大于18岁的人进入。系统会检查一个布尔值，如果年龄大于18，布尔值为`True`，门就会打开。


C语言有7中基础数据类型, 分别为: 
```c
char //字符数据类型
short //短整型
int //整形
long //长整型
long long //更长的整形
float //单精度浮点数
double //双精度浮点数
```

C语言的基础数据类型按类型可以划分为:
- 数值型
	- `int` , `short` , `long` , `long long`  (整型) , 如: `1`, `666`,  `293`, `42892231`.
	- `float` , `double` (浮点型) , 如:  `0.1` , `66.6` , `19880.2312`
	- `_bool` (布尔型):   **C语言标准（直到C99标准）中也没有原生的布尔类型**。不过，C语言使用整数类型来表示布尔值，==**其中`0`表示`false`，非`0`值表示`true`**==。但是，从C99标准开始，引入了一个叫做`_Bool`的布尔类型，以及两个宏`true`和`false`（注意`true`和`false`是宏而不是关键字）。
- 字符型
	- `char` (字符型),  如：`'a'`, `'3'`, `'@'`

> [!question]+ C语言有没有字符串类型？
> 在C语言中，并没有专门的字符串类型，但是字符串是通过字符数组来表示的。通常，字符串在C语言中以字符数组的形式存在，并以空字符（null terminator，值为'\0'）结尾，这表示字符串的结束。例如：
>```c
>char myString[] = "Hello, World!";
>```
>关于字符串, 之后的内容会细讲.



## 为什么出现这么多的类型？
在C语言的广阔天地中，我们经常会遇到int、short、char, long ...等类型。这些类型就像是不同尺寸的容器，每个容器都有其特定的用途和携带能力。
> 若我们需要存放的东西很少, 却使用 long long 这个类型的容器进行存放, 那就会造成很大的空间浪费.
> 
> 而在实际编程中, `int` , `char` , `long long` 这些基本类型就是我们的容器, 
>  `2` , `3` , `66` , `998` ,`'c'`  `"哈哈"` 等信息就是可以存入相应容器的数据

请看一下代码
```c
int main()
{
	long long big_box = 1;
	// 名叫 big_box 有 long long 这么大的空间, 但是它里面数据只放了1, 虽然可用, 但是有比较大的空间浪费

	int box = 2458568785;
	// 名叫 box 一个中号的容器, 但它容器里放的数据超出了它的容纳范围, 会数值溢出

	int small_box = 18266;
	// 名叫 box 一个小号的容器, 但它容器里放的数据在它的容纳范围内, 可用

	return 0;
}
```

看了以上代码, 那有一个问题, 我怎么知道每个类型它能容纳的大小是多少呢?


## 每种类型的大小是多少？

> [!question]+ 如何计算每个类型的大小?
> 每种数据类型，都有自己固定的占用内存大小和取值范围。具体展开讲解前，我们先来看下，C 语言提供的查看变量或类型占用内存大小的运算符，`sizeof`。
>- **语法 1：sizeof(变量名)**
>```c
>int a = 10;  
 >   printf("%llu\n", sizeof(a));//sizeof(a) 获取 a 变量占用内存大小。可以用 printf 显示出来  
 >   // 查看 sizeof 返回的占用内存大小，需要使用 %llu 格式符
>```

    
    
- **语法 2：sizeof(类型名)**
    printf("%llu\n", sizeof(double)); // 也可以使用 sizeof 直接查看某种类型占用的内存大小
>
>

```c
#include <stdio.h>
int main()
{
	printf("%d\n", sizeof(char));
	printf("%d\n", sizeof(short));
	printf("%d\n", sizeof(int));
	printf("%d\n", sizeof(long));
	printf("%d\n", sizeof(long long));
	printf("%d\n", sizeof(float));
	printf("%d\n", sizeof(double));
	printf("%d\n", sizeof(long double));
	return 0;
}
```


注意：存在这么多的类型，其实是为了更加丰富的表达生活中的各种值。

类型的使用：
```c
char ch = 'w';
int weight = 120;
int salary = 20000;
```


# 变量和常量
生活中的有些值是不变的（比如：圆周率，性别，身份证号码，血型等等）
有些值是可变的（比如：年龄，体重，薪资）。

不变的值，C语言中用**常量**的概念来表示，变得值C语言中用**变量**来表示。

## 定义变量的方法
```c
int age = 150;
float weight = 45.5f;
char ch = 'w';
```



## 变量的分类
- 局部变量
- 全局变量

```c
#include <stdio.h>

int global = 2019;//全局变量

int main()
{
	int local = 2018;//局部变量
	//下面定义的global会不会有问题？
	int global = 2020;//局部变量
	printf("global = %d\n", global);
	return 0;
}
```

### 局部变量和全局变量总结：
上面的局部变量global变量的定义其实没有什么问题的！
当局部变量和全局变量同名的时候，局部变量优先使用。


## 变量的使用
```c
#include <stdio.h>
int main()
{
	int num1 = 0;
	int num2 = 0;
	int sum = 0;
	printf("输入两个操作数:>");
	scanf("%d %d", &num1, &num2);
	sum = num1 + num2;
	printf("sum = %d\n", sum);
	return 0;
}
//这里介绍一下输入，输出语句
//scanf
//printf
```


## 变量的作用域和生命周期
作用域
>作用域（scope）是程序设计概念，通常来说，一段程序代码中所用到的名字并不总是有效/可用的
>而限定这个名字的可用性的代码范围就是这个名字的作用域。

1. 局部变量的作用域是变量所在的局部范围。
2. 全局变量的作用域是整个工程。

生命周期
> 变量的生命周期指的是变量的创建到变量的销毁之间的一个时间段.

1. 局部变量的生命周期是：进入作用域生命周期开始，出作用域生命周期结束。
2. 全局变量的生命周期是：整个程序的生命周期。

## 常量
语言中的常量和变量的定义的形式有所差异。
C语言中的常量分为以下以下几种：
- 字面常量
- `const` 修饰的常变量
- `#define`  定义的标识符常量
- `enum` 枚举常量
```c
#include <stdio.h>
//举例
enum Sex
{
	MALE,
	FEMALE,
	SECRET
};
//括号中的MALE,FEMALE,SECRET是枚举常量

int main()
{
	//字面常量演示
	3.14;//字面常量
	1000;//字面常量
	//const 修饰的常变量
	const float pai = 3.14f; //这里的pai是const修饰的常变量
	pai = 5.14;//是不能直接修改的！
	//#define的标识符常量 演示
	#define MAX 100
	printf("max = %d\n", MAX);
	//枚举常量演示
	printf("%d\n", MALE);
	printf("%d\n", FEMALE);
	printf("%d\n", SECRET);
	//注：枚举常量的默认是从0开始，依次向下递增1的
	return 0;
}
```


# 字符串+转义字符+注释

## 字符串

```c
"hello bit.\n"
```

这种由双引号（Double Quote）引起来的一串字符称为字符串字面值（String Literal），或者简称字符串。
注：字符串的结束标志是一个\0 的转义字符。在计算字符串长度的时候\0 是结束标志，不算作字符串内容。

```c
#include <stdio.h>
//下面代码，打印结果是什么？为什么？（突出'\0'的重要性）
int main()
{
	char arr1[] = "bit";
	char arr2[] = {'b', 'i', 't'};
	char arr3[] = {'b', 'i', 't'， '\0'};
	printf("%s\n", arr1);
	printf("%s\n", arr2);
	printf("%s\n", arr3);
	return 0;
}
```


## 转义字符

加入我们要在屏幕上打印一个目录： `c:\code\test.c`
我们该如何写代码？

```c
#include <stdio.h>
int main()
{
	printf("c:\code\test.c\n");
	return 0;
}
```

实际上程序运行的结果是这样的：
> [!example]+ 运行结果
> ```
> c:code    est.c
> ```

这里就不得不提一下转义字符了。转义字符顾名思义就是转变意思。
下面看一些转义字符



| 转义字符   | 释义                         |
| :----- | -------------------------- |
| `\?`   | 在书写连续多个问号时使用，防止他们被解析成三字母词  |
| `\'`   | 用于表示字符常量'                  |
| `\“`   | 用于表示一个字符串内部的双引号            |
| `\\`   | 用于表示一个反斜杠，防止它被解释为一个转义序列符。  |
| `\a`   | 警告字符，蜂鸣                    |
| `\b`   | 退格符                        |
| `\f`   | 进纸符                        |
| `\n`   | 换行                         |
| `\r`   | 回车                         |
| `\t`   | 水平制表符                      |
| `\v`   | 垂直制表符                      |
| `\ddd` | ddd表示1~3个八进制的数字。 如： \130 X |
| `\xdd` | dd表示2个十六进制数字。 如： \x30 0    |

```c
#include <stdio.h>
int main()
{
	//问题1：在屏幕上打印一个单引号'，怎么做？
	//问题2：在屏幕上打印一个字符串，字符串的内容是一个双引号“，怎么做？
	printf("%c\n", '\'');
	printf("%s\n", "\"");
	return 0;
}
```

### 笔试题
```c
#include <stdio.h>
int main()
{
	printf("%d\n", strlen("abcdef"));
	// \62被解析成一个转义字符
	printf("%d\n", strlen("c:\test\628\test.c"));
	return 0;
}
```



## 注释

1. 代码中有不需要的代码可以直接删除，也可以注释掉
2. 代码中有些代码比较难懂，可以加一下注释文字
比如：

```c
#include <stdio.h>
int Add(int x, int y)
{
	return x+y;
}
/*C语言风格注释
int Sub(int x, int y)
{
	return x-y;
}
*/
int main()
{
	//C++注释风格
	//int a = 10;
	//调用Add函数，完成加法
	printf("%d\n", Add(1, 2));
	return 0;
}
```

注释有两种风格：
- C语言风格的注释 `/*xxxxxx*/`
	- 缺陷：不能嵌套注释
- C++风格的注释 `//xxxxxxxx`
	- 可以注释一行也可以注释多行


# 选择语句

> [!info]+ 栗子
> 如果你好好学习，校招时拿一个好offer，走上人生巅峰。
> 如果你不学习，毕业等于失业，回家卖红薯。
> 这就是选择！

![[选择语句图.excalidraw|465]]

```c
#include <stdio.h>
int main()
{
	int coding = 0;
	printf("你会去敲代码吗？（选择1 or 0）:>");
	scanf("%d", &coding);
	if(coding == 1)
	{
		prinf("坚持，你会有好offer\n");
	}
	else
	{
		printf("放弃，回家卖红薯\n");
	}
	return 0;
}
```

# 循环语句
有些事必须一直做，比如我日复一日的讲课，比如大家，日复一日的学习。

![[循环语句图.excalidraw|459]]

C语言中如何实现循环呢？
`while` 语句-讲解
`for`语句（后期讲）
`do ... while`语句（后期讲）

```c
//while循环的实例
#include <stdio.h>
int main()
{
	printf("加入比特\n");
	int line = 0;
	while(line<=20000)
	{
		line++;
		printf("我要继续努力敲代码\n");
	}
	if(line>20000)
		printf("好offer\n");
	return 0;
}
```



# 函数
函数的特点就是简化代码，代码复用。

如: 
```c
#include <stdio.h>
int main()
{
	int num1 = 0;
	int num2 = 0;
	int sum = 0;
	printf("输入两个操作数:>");
	scanf("%d %d", &num1, &num2);
	sum = num1 + num2;
	printf("sum = %d\n", sum);
	return 0;
	}
```


上述代码，写成函数如下：
```c
#include <stdio.h>
int Add(int x, int y)
{
	int z = x+y;
	return z;
}

int main()
{
	int num1 = 0;
	int num2 = 0;
	int sum = 0;
	printf("输入两个操作数:>");
	scanf("%d %d", &num1, &num2);
	sum = Add(num1, num2);
	printf("sum = %d\n", sum);
	return 0;
}
```

# 数组
要存储1-10的数字，怎么存储？
C语言中给了数组的定义：一组相同类型元素的集合

## 数组的定义
```c
int arr[10] = {1,2,3,4,5,6,7,8,9,10};//定义一个整形数组，最多放10个元素
```


## 数组的下标
C语言规定：数组的每个元素都有一个下标，下标是从0开始的。
数组可以通过下标来访问的。
比如：
```c
int arr[10] = {0};
//如果数组10个元素，下标的范围是0-9
```

![[数组下标图.excalidraw]]


## 数组的使用
```c
#include <stdio.h>
int main()
{
	int i = 0;
	int arr[10] = {1,2,3,4,5,6,7,8,9,10};
	for(i=0; i<10; i++)
	{
		printf("%d ", arr[i]);
	}
	printf("\n");
	return 0;
}
```



# 操作符
简单介绍为主，后面课件重点讲。

## 算术操作符
```c
+ - * / %
```

## 位移操作符

```c
>>   <<
```

## 位操作符
```c
&    ^    |
```


## 赋值操作符
```c
=   +=   -=   *=   /=   &=   ^=   |=   >>=   <<=
```

## 单目操作符

`!`   逻辑反操作
`-`   负值
`+`   正值
`&` 取地址
`sizeof` 操作数的类型长度（以字节为单位）
`~` 对一个数的二进制按位取反
`--` 前置、后置--
`++` 前置、后置++
`*`  间接访问操作符(解引用操作符)
`(类型)`   强制类型转换


## 关系操作符
`>`
`>=`
`<`
`<=`
`!=` 用于测试“不相等”
`==` 用于测试“相等”


## 逻辑操作符
`&&`  逻辑与
`||`  逻辑或


## 条件操作符
```c
exp1 ? exp2 : exp3
```

## 逗号表达式
```c
exp1, exp2, exp3, …expN
```

## 下标引用, 函数调用和结构成员
`[]`   `()`    `.`    `->`



# 常见关键字
```c
auto break case char const continue default do double else enum
extern float for goto if int long register return short signed
sizeof static struct switch typedef union unsigned void volatile while
```
注：关键字，先介绍下面几个，后期遇到讲解。

## 关键字 typedef
typedef 顾名思义是类型定义，这里应该理解为类型重命名。
比如：
```c
//将unsigned int 重命名为uint_32, 所以uint_32也是一个类型名
typedef unsigned int uint_32;
int main()
{
	//观察num1和num2,这两个变量的类型是一样的
	unsigned int num1 = 0;
	uint_32 num2 = 0;
	return 0;
}
```


## 关键字static
在C语言中：
static是用来修饰变量和函数的
1. 修饰局部变量-称为静态局部变量
2. 修饰全局变量-称为静态全局变量
3. 修饰函数-称为静态函数

### static 修饰局部变量
代码1
```c
#include <stdio.h>
void test()
{
	int i = 0;
	i++;
	printf("%d ", i);
}
int main()
{
	int i = 0;
	for(i=0; i<10; i++)
	{
		test();
	}
	return 0;
}
```

代码2
```c
#include <stdio.h>
void test()
{
	//static修饰局部变量
	static int i = 0;
	i++;
	printf("%d ", i);
}
int main()
{
	int i = 0;
	for(i=0; i<10; i++)
	{
	test();
	}
	return 0;
}
```


对比代码1和代码2的效果理解static修饰局部变量的意义。
结论：
static修饰局部变量改变了变量的生命周期
让静态局部变量出了作用域依然存在，到程序结束，生命周期才结束。



### static 修饰全局变量

代码1
add.c
```c title:"add.c"
int g_val = 2018;
```

test.c
```c title:"test.c"
#include <stdio.h>
int main()
{
	printf("%d\n", g_val);
	return 0;
}
```



代码2
add.c
```c title:"add.c"
static int g_val = 2018;
```



test.c
```c title:"test.c"
#include <stdio.h>
int main()
{
	printf("%d\n", g_val);
	return 0;
}
```



代码1正常，代码2在编译的时候会出现连接性错误。
结论：
一个全局变量被static修饰，使得这个全局变量只能在本源文件内使用，不能在其他源文件内使用。


### static 修饰函数

代码1

add.c
```c title:"add.c"
int Add(int x, int y)
{
	return c+y;
}
```

test.c
```c title:"test.c"
#include <stdio.h>
int main()
{
	printf("%d\n", Add(2, 3));
	return 0;
}
```



代码2
add.c
```c title:"add.c"
static int Add(int x, int y)
{
	return c+y;
}
```

test.c
```c title:"test.c"
#include <stdio.h>
int main()
{
	printf("%d\n", Add(2, 3));
	return 0;
}
```

代码1正常，代码2在编译的时候会出现连接性错误.

结论：
>一个函数被static修饰，使得这个函数只能在本源文件内使用，不能在其他源文件内使用。

剩余关键字后续课程中陆续会讲解。


# `#define` 定义常量

```c
//define定义标识符常量
#define MAX 1000

//define定义宏
#define ADD(x, y) ((x)+(y))


#include <stdio.h>
int main()
{
	int sum = ADD(2, 3);
	printf("sum = %d\n", sum);
	
	sum = 10*ADD(2, 3);
	printf("sum = %d\n", sum);
	
	return 0;
}
```



# 指针

## 内存
内存是电脑上特别重要的存储器，计算机中程序的运行都是在内存中进行的 。
所以为了有效的使用内存，就把内存划分成一个个小的内存单元，**每个内存单元的大小是==1个字节==**。
为了能够有效的访问到内存的每个单元，就给内存单元进行了编号，这些编号被称为该**内存单元的地址**。

![[初识C语言-内存图1.excalidraw]]变量是创建内存中的（在内存中分配空间的），每个内存单元都有地址，所以变量也是有地址的。
取出变量地址如下：
```c
#include <stdio.h>
int main()
{
	int num = 10;
	&num;//取出num的地址
	//注：这里num的4个字节，每个字节都有地址，取出的是第一个字节的地址（较小的地址）
	printf("%p\n", &num);//打印地址，%p是以地址的形式打印
	return 0;
}
```
![[初识C语言-内存图2.excalidraw|652]]

那地址如何存储，需要定义指针变量。

```c
int num = 10;
int *p;//p为一个整形指针变量
p = &num;
```

指针的使用实例：
```c
#include <stdio.h>
int main()
{
	int num = 10;
	int *p = &num;
	*p = 20;
	return 0;
}
```

![[Drawing 2024-06-24 23.21.16.excalidraw]]

以整形指针举例，可以推广到其他类型，如：
```c
#include <stdio.h>
int main()
{
	char ch = 'w';
	char* pc = &ch;
	*pc = 'q';
	printf("%c\n", ch);
	return 0;
}
```

## 指针变量的大小
```c
#include <stdio.h>
//指针变量的大小取决于地址的大小
//32位平台下地址是32个bit位（即4个字节）
//64位平台下地址是64个bit位（即8个字节）

int main()
{
	printf("%d\n", sizeof(char *));
	printf("%d\n", sizeof(short *));
	printf("%d\n", sizeof(int *));
	printf("%d\n", sizeof(double *));
	return 0;
}
```

结论：指针大小在32位平台是4个字节，64位平台是8个字节。

# 结构体
结构体是C语言中特别重要的知识点，结构体使得C语言有能力描述复杂类型。
比如描述学生，学生包含： 名字+年龄+性别+学号这几项信息。
这里只能使用结构体来描述了。

例如：
```c
struct Stu
{
	char name[20];//名字
	int age; //年龄
	char sex[5]; //性别
	char id[15]； //学号
};
```


结构体的初始化：
```c
//打印结构体信息
struct Stu s = {"张三"， 20， "男"， "20180101"};

//.为结构成员访问操作符
printf("name = %s age = %d sex = %s id = %s\n", s.name, s.age, s.sex, s.id);

//->操作符
struct Stu *ps = &s;
printf("name = %s age = %d sex = %s id = %s\n", ps->name, ps->age, ps->sex, ps->id);
```