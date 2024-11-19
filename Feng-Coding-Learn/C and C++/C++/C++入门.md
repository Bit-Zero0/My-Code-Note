---
Type: Note
tags:
  - CPP
  - siyuan
Status: done
Start-date: 2024-11-17 22:09
Finish-date: 2024-11-18
Modified-date: 2024-11-18 21:49
Publish: false
---

## C++简介

### C++与C语言的关系
嘿！既然你已经学习过C语言了，那么C++对你来说就像是一个"升级版"的C语言。C++最初的名字叫"C with Classes"（带类的C语言），它是由**比雅尼·斯特劳斯特卢普**在1979年开发的。

==C++完全兼容C语言==，这意味着你之前学习的C语言知识都能在C++中使用！但C++提供了更多强大的特性，特别是面向对象编程的支持。

### C++的主要特点
1. ==**既能进行底层操作，又能进行高层抽象**==
2. **支持多种编程范式**：
   - 面向过程（就像C语言一样）
   - 面向对象
   - 泛型编程
3. **更强的类型检查**
4. **更现代的语言特性**

### 为什么要学习C++？
1. ==性能卓越==：C++的性能几乎与C语言相当
2. **应用广泛**：游戏开发、操作系统、数据库等
3. **就业方向好**：C++开发者的薪资普遍较高

> [!tip] 小贴士
> C++的学习曲线可能比较陡峭，但不要害怕！我们会从最基础的部分开始，循序渐进地学习。

## C++关键字

C++总计63个关键字，C语言32个关键字
>下面我们只是看一下C++有多少关键字，不对关键字进行具体的讲解。

C++比C语言增加了更多的关键字，这些关键字让C++的功能更加强大。这里列出一些重要的新增关键字：
![[C++关键字图.png]]
==新增的重要关键字==：
- `class`: 定义类
- `private/protected/public`: 访问限定符
- `new/delete`: 动态内存管理
- `try/catch/throw`: 异常处理
- `namespace`: 命名空间
- `bool`: 布尔类型
- `inline`: 内联函数
- `const`: 常量（比C语言增强）
- `template`: 模板

## 命名空间

### 命名空间的定义
想象一下，你和你的朋友都在写代码，而且你们可能会用到相同名字的变量或者函数。比如，你们都写了一个名为 `add` 的函数，一个用于整数相加，一个用于字符串拼接。如果没有命名空间，当这两个代码放在一起编译的时候，编译器就会懵圈，不知道该用哪个 `add` 函数。

但是有了命名空间，就好像给你们各自的代码放进了不同的盒子里。你可以把你的 `add` 函数放在一个命名空间，比如 `yourNamespace`，你的朋友把他的放在 `friendNamespace`。这样，当你想要使用自己的 `add` 函数时，就可以通过 `yourNamespace::add` 来明确地告诉编译器你要用的是这个函数，而不是你朋友定义的那个。

以下是一个简单的示例：
```cpp
// 定义一个命名空间yourNamespace
namespace yourNamespace {
    int add(int a, int b) {
        return a + b;
    }
}

// 定义另一个命名空间friendNamespace
// 因为我们还没开始学习STL ,string是标准库中的字符串, 这个add函数的作用为字符串拼接
namespace friendNamespace {
    std::string add(std::string a, std::string b) {
        return a + b;
    }
}

int main() {
    // 使用yourNamespace中的add函数
    int result1 = yourNamespace::add(3, 5);
    // 使用friendNamespace中的add函数
    std::string result2 = friendNamespace::add("Hello, ", "World!");
    return 0;
}
```


#### 普通的命名空间
```cpp
namespace N1 // N1为命名空间的名称
{
	// 命名空间中的内容，既可以定义变量，也可以定义函数
	int a;
	int Add(int left, int right)
	{
		return left + right;
	}
}
```

#### 嵌套命名空间
命名空间还可以嵌套，就像盒子里面再放小盒子一样。
```cpp
#include <iostream>

namespace N2
{
    int a;
    int b;
    int Add(int left, int right)
    {
        return left + right;
    }

    namespace N3
    {
        int c;
        int d;
        int Sub(int left, int right)
        {
            return left - right;
        }
    }
}
```

> [!warning]+ 注意
> **一个命名空间就定义了一个新的作用域**，命名空间中的所有内容都局限于该命名空间中.

#### 命名空间合并
==同一个工程中允许存在多个相同名称的命名空间,编译器最后会合成同一个命名空间中。==
```cpp hl:1-7
namespace N1
{
	int Mul(int left, int right)
	{
		return left * right;
	}
}

namespace N1 // N1为命名空间的名称
{
	// 命名空间中的内容，既可以定义变量，也可以定义函数
	int a;
	int Add(int left, int right)
	{
		return left + right;
	}
}

```


### 命名空间的使用
使用 作用域解析运算符 `::`

有三种使用方式：

#### 完整的命名空间名称：
> [!tip]+ 实际项目中比较推荐该方式

```cpp
#include<iostream>
namespace N1 // N1为命名空间的名称
{
	// 命名空间中的内容，既可以定义变量，也可以定义函数
	int a;
	int Add(int left, int right)
	{
		return left + right;
	}
}

int main()
{
	int x = 10, y = 20;
	printf("%d \n", N1::Add(x, y)); // 使用Add函数必须加上域空间名和域限定符::

	N1::a = 66;// 使用为N1空间内的a进行初始化 , 必须加上域空间名和域限定符::才能访问到
	printf("%d \n", N1::a); 

	return 0;
}
```

对于嵌套命名空间，需要使用多个`::`来指定完整的路径。
```cpp
namespace N2
{
    int a;
    int b;
    int Add(int left, int right)
    {
        return left + right;
    }

    namespace N3
    {
        int c;
        int d;
        int Sub(int left, int right)
        {
            return left - right;
        }
    }
}

int main()
{
    N2::N3::c = 8;
    N2::N3::d = 3;
	return 0;
}
```


#### 部分展开(授权)： using声明
可以使用`using`声明来简化命名空间成员的访问。
```cpp
namespace N1 // N1为命名空间的名称
{
	// 命名空间中的内容，既可以定义变量，也可以定义函数
	int a;
	int Add(int left, int right)
	{
		return left + right;
	}
}

using namespace N1;
int main()
{
	a = 20;
    Add(10 , 20);
	return 0;
}
```

不过要注意，这种方式可能会增加命名冲突的风险，因为它将命名空间中的某个成员引入到当前作用域，就好像这个成员是在当前作用域定义的一样。


#### 全部展开(授权) : `using namespace`指令
这是一种更 “激进” 的方式，它将整个命名空间引入到当前作用域。==**不推荐在头文件中使用**==
```cpp
#include<iostream>
namespace N1 // N1为命名空间的名称
{
	// 命名空间中的内容，既可以定义变量，也可以定义函数
	int a;
	int Add(int left, int right)
	{
		return left + right;
	}
}
using namespace N1;
int main()
{
	int x = 10, y = 20;
	printf("%d \n", Add(x, y)); 
	a = 66;
	printf("%d \n", a); 
	return 0;
}
```

- 这种方式虽然方便，但在大型项目中可能会导致命名冲突，因为它把命名空间中的所有标识符都引入进来了，很可能会和当前作用域或其他引入的命名空间中的同名标识符发生冲突。

> [!warning] 注意事项
> 使用`using namespace std;`虽然方便，但可能会导致命名冲突。因为我这里是教学内容, 所以大部分文章都会使用到 `using namespace std;` , 实际开发中一定要谨慎使用.
> 
> 建议：
> 1. 在小型程序中可以使用
> 2. 在大型项目中最好使用具体的using声明
> 3. 或使用完整的命名空间名称

### 命名空间常见错误案列
#### 命名冲突
**错误示例**
```cpp
// 文件1.cpp
namespace MySpace {
    int myVariable = 10;
}
// 文件2.cpp
namespace MySpace {
    int myVariable = 20;
}
```
**解释与解决方法**：在这个例子中，两个源文件都定义了`MySpace`命名空间，并且都有一个名为`myVariable`的变量。当链接这两个文件时，就会出现重复定义的错误。解决方法是确保每个标识符在整个程序的命名空间中是唯一的，或者将变量定义为`static`（这样变量的作用域就限制在当前文件内），或者将变量放在不同的命名空间子区域。

#### 错误使用using namespace
**错误示例**
```cpp
// 文件1.cpp
namespace Math {
    int add(int a, int b) {
        return a + b;
    }
}
// 文件2.cpp
using namespace Math;
namespace Math {
    int subtract(int a, int b) {
        return a - b;
    }
}
```
**解释与解决方法**：这里在使用`using namespace`引入`Math`命名空间后，又在同一个文件中重新定义了`Math`命名空间的一部分。这可能会导致一些难以发现的错误，因为`using namespace`会把之前的`Math`命名空间中的所有成员都引入到当前作用域。正确的做法是避免在一个文件中同时使用`using namespace`和重新定义部分命名空间，可以使用`using`声明来引入特定的成员，或者不使用`using namespace`，而是通过`::`运算符来访问命名空间成员。

## C++输入&输出

C++引入了==流式输入输出==，比C语言的`printf`和`scanf`更安全、更方便！

```cpp
#include <iostream>
using namespace std;

int main() {
    string name;
    int age;
    
    // 输入
    cout << "请输入你的名字：";
    cin >> name;
    cout << "请输入你的年龄：";
    cin >> age;
    
    // 输出
    cout << "你好，" << name << "！你今年" << age << "岁了！" << endl;
    
    return 0;
}
```

**代码解析：**
说明：
1. 使用**cout标准输出(控制台**)和**cin标准输入(键盘)** 时，必须包含< iostream >头文件以及std标准命名空间。

> [!warning]+ 注意
> 早期标准库将所有功能在全局域中实现，声明在.h后缀的头文件中，使用时只需包含对应头文件即可，后来将其实现在std命名空间下，为了和C头文件区分，也为了正确使用命名空间，规定C++头文件不带.h；旧编译器(vc 6.0)中还支持<iostream.h>格式，后续编译器已不支持，因此推荐使用`<iostream>`+std的方式。

2. 使用C++输入输出更方便，不需增加数据格式控制，比如：整形--`%d`，字符--`%c`

- `cout`：标准输出流对象
- `cin`：标准输入流对象
- `<<`：输出运算符
- `>>`：输入运算符
- `endl`：换行并刷新缓冲区

> [!tip] 小贴士
> 1. ==C++的输入输出更安全==，不用担心格式符不匹配的问题
> 2. **可以连续使用**`<<`**或**`>>`
> 3. 支持自定义类型的输入输出

> [!note] C++11新特性
> C++11引入了原始字符串字面量，使用`R"()`语法：
> ```cpp
> string path = R"(C:\Program Files\Some App)";  // 不需要转义反斜杠
> ```



好的，让我们继续生成后面的内容：


## C++的类型增强

### bool类型
C++引入了==真正的布尔类型==！不再需要用整数 0 和 1 来表示真假了。

```cpp
bool isStudent = true;  // 直接使用true
bool isWorking = false; // 直接使用false

if(isStudent) {
    cout << "是学生" << endl;
}
```

### const增强
C++中的const比C语言更加强大！

1. ==**const具有真正的常量属性**==
```cpp
const int MAX_SIZE = 100;
int arr[MAX_SIZE];  // C++中可以直接用const变量定义数组大小！
```

2. **默认内部链接**
```cpp
// a.cpp
const int num = 10;

// b.cpp
extern const int num;  // 需要显式声明extern才能使用其他文件的const变量
```

### struct增强
C++中的结构体可以==**包含成员函数**==，**这是向类过渡的第一步**！

```cpp
struct Student {
    string name;
    int age;
    
    // 结构体内的函数！
    void printInfo() {
        cout << "姓名：" << name << endl;
        cout << "年龄：" << age << endl;
    }
};

int main() {
    Student s = {"小明", 18};
    s.printInfo();  // 直接调用结构体的成员函数
    return 0;
}
```

## 缺省参数

### 缺省参数的概念
在 C++ 中，缺省参数（Default Argument）是指==在函数声明或定义时为参数指定一个默认值==。当调用该函数时，如果没有为这个有默认值的参数提供实际的值，编译器就会自动使用默认值。这提供了一种灵活性，允许函数在不同的调用场景下有不同的行为，而不需要为每种情况都定义一个单独的函数重载。

```cpp
#include <iostream>
// 这里我们定义了一个函数add，它有两个参数，其中b有一个缺省值为5
int add(int a, int b = 5) {
    return a + b;
}

int main() {
    // 我们可以只传递一个参数来调用add函数，这时候b就会使用默认值5
    int result1 = add(3);
    std::cout << "result1: " << result1 << std::endl; 

    // 当然，我们也可以传递两个参数，这时候b的值就会被我们传递的值覆盖
    int result2 = add(3, 7); 
    std::cout << "result2: " << result2 << std::endl;
    return 0;
}
```
在这个代码里，`add` 函数的参数 `b` 有一个缺省值 `5`。在 `main` 函数中，当我们只传递一个参数调用 `add` 函数时，就像 `add(3)`，参数 `b` 就会自动取默认值 `5`，函数返回的结果就是 `3 + 5 = 8`。而当我们像 `add(3, 7)` 这样调用时，参数 `b` 的值就被我们传递的 `7` 覆盖了，函数返回 `3 + 7 = 10`。

> [!tip]+ 小贴士
> 1. 半缺省参数必须从右往左依次来给出，不能间隔着给
> 2. 缺省参数不能在函数声明和定义中同时出现
> 3. 缺省值必须是常量或者全局变量
> 4. C语言不支持（编译器不支持）

### 缺省参数的分类

#### 全缺省参数
**所有参数都有默认值**：
```cpp
void showMessage(string msg = "Hello", int times = 1, char end = '\n') {
    for(int i = 0; i < times; i++) {
        cout << msg << end;
    }
}
```

#### 半缺省参数
==**从右向左**依次给出默认值==：
```cpp
// 正确：从右向左给默认值
void func(int a, int b = 10, int c = 20) { }

// 错误：不能跳过b给c默认值
void func(int a, int b, int c = 20) { }
```


> [!warning] 注意事项
> 1. ==默认参数只能在声明或定义中出现一次==
> 2. **必须从右向左连续给出默认值**
> 3. 调用时==从左向右依次传参==


### 缺省参数的规则

####  缺省参数必须从右向左连续设置

这是什么意思呢？比如说我们不能这样定义函数：

```cpp
int wrongFunction(int a = 3, int b); // 这是错误的，因为缺省参数a在非缺省参数b的左边
```

正确的做法应该是这样：

```cpp
int correctFunction(int a, int b = 5); // 正确，缺省参数b在右边
```

>[!tip]+ 小贴士：
> 这样规定是为了让编译器能够清楚地知道我们在调用函数时传递的参数是对应哪个参数的。如果缺省参数不连续或者顺序不对，编译器就会搞不清楚啦！

#### 在函数声明和定义中只能有一处指定缺省参数
我们可以在==函数声明中指定缺省参数，也可以在函数定义中指定，但不能两处都指定==哦。**一般来说，我们会在函数声明中指定，这样代码的可读性会更好**。

例如，我们有一个头文件 `myheader.h`：

```cpp
// myheader.h
#ifndef MYHEADER_H
#define MYHEADER_H

// 在函数声明中指定缺省参数
int anotherFunction(int a, int b = 10);

#endif
```

然后在对应的源文件 `myfile.cpp` 中实现这个函数：
```cpp
// myfile.cpp
#include "myheader.h"

// 这里不需要再指定缺省参数的值了
int anotherFunction(int a, int b) {
    return a * b;
}
```

## 缺省参数的好处

### 1. 简化函数调用
就像我们前面看到的 `add` 函数的例子一样，当我们经常使用某个参数的特定值时，设置缺省参数可以让我们在调用函数的时候少写一些代码呢！

### 2. 增加函数的灵活性
我们可以根据需要选择是否覆盖缺省参数的值，这使得函数可以适应更多不同的情况哦。
>如之后的篇章[[类和对象]], 就能有直观的体验.




## 函数重载

### 函数重载的概念
简单来讲，**函数重载就是在同一个作用域内，可以有一组具有相同函数名，但参数列表不同（参数个数不同、参数类型不同或者参数顺序不同）的函数**。编译器会根据调用函数时传递的实际参数来决定调用哪个版本的函数。这就好比你有几个同名的小伙伴，但是他们每个人都有不同的特点，通过一些线索（参数）就能区分出你到底是在叫谁啦！

```cpp
#include <iostream>

// 函数重载的例子

// 这个函数用于计算两个整数的和
int add(int num1, int num2) {
    return num1 + num2;
}

// 这个函数用于计算三个整数的和
int add(int num1, int num2, int num3) {
    return num1 + num2 + num3;
}

// 这个函数用于计算一个整数和一个浮点数的和
float add(int num, float fnum) {
    return num + fnum;
}

int main() {
    int result1 = add(3, 5); 
    std::cout << "两个整数相加的结果: " << result1 << std::endl; 

    int result2 = add(2, 4, 6); 
    std::cout << "三个整数相加的结果: " << result2 << std::endl; 

    float result3 = add(3, 5.5f); 
    std::cout << "整数和浮点数相加的结果: " << result3 << std::endl;
    return 0;
}

```
在这段代码中，我们有三个 `add` 函数。编译器在执行 `main` 函数中的 `add` 调用时，会根据传递的参数类型和个数来决定调用哪个 `add` 函数。比如 `add(3, 5)`，因为传递了两个整数，所以会调用 `int add(int num1, int num2)` 这个函数；`add(2, 4, 6)` 会调用 `int add(int num1, int num2, int num3)`；而 `add(3, 5.5f)` 则会调用 `float add(int num, float fnum)`。

### 函数重载的规则

### 1. 函数名必须相同
这是函数重载的基本要求啦，就像同名的小伙伴一样，函数重载的函数们都共享同一个名字。

### 2. 参数列表必须不同
这是重点哦！参数列表不同可以体现在以下几个方面：
- **参数个数不同**：就像我们上面的例子中，有两个参数的 `add` 函数和三个参数的 `add` 函数。
- **参数类型不同**：比如一个参数是 `int`，另一个参数是 `float` 的 `add` 函数。
- **参数顺序不同（注意：参数类型不同才有效）**：例如有一个函数 `func(int a, float b)` 和另一个函数 `func(float b, int a)`，这两个函数是重载关系。但如果是 `func(int a, int b)` 和 `func(int b, int a)`，这样是不行的，因为仅仅参数顺序不同且类型相同，编译器无法区分。
    

>[!warning]+ 注意事项  
> 返回类型不同不能作为函数重载的依据哦！也就是说，仅仅返回类型不同的两个函数不能构成重载。比如下面这样是错误的：
> ```cpp
> int myFunction(int a); 
> float myFunction(int a); // 错误，仅返回类型不同，不能构成函数重载
> ```



### 名字修饰
为什么C++支持函数重载而C语言不支持？这就要说到==名字修饰==（Name Mangling）了！

C++编译器会根据函数的参数类型对函数名进行修饰，例如：
- `max(int, int)` 可能被修饰为 `_max_int_int`
- `max(double, double)` 可能被修饰为 `_max_double_double`


#### C 语言不支持函数重载的原因
**简单的函数命名规则**：C 语言的函数名在编译和链接过程中基本保持不变。当编译器在编译一个 C 程序时，它只是简单地将函数名作为一个符号来处理。例如，有两个函数`int add(int a, int b)`和`float add(float a, float b)`，在 C 语言的编译器眼中，它们的名字都是`add`。在链接阶段，如果同时存在这两个函数，链接器就无法区分应该调用哪一个函数，会产生符号冲突。

**缺乏名字修饰机制**：C 语言没有像 C++ 那样的名字修饰机制，它无法根据函数的参数来改变函数名，以区分不同的函数。所以 C 语言不支持函数重载这种同名函数但参数不同的情况。


##### 验证:  gcc函数重载
由于Windows下vs的修饰规则过于复杂，而Linux下gcc的修饰规则简单易懂，下面我们使用了gcc演示了这个修饰后的名字。

采用C语言编译器编译后结果
![[gcc验证函数重载.svg]]
结论：**在linux下，采用gcc编译完成后，函数名字的修饰没有发生改变。**

#### C++ 支持函数重载的原因
 **编译阶段的类型检查**：C++ 是一种强类型语言，在编译阶段会进行严格的类型检查。编译器能够根据函数调用时提供的参数类型、个数和顺序来确定具体调用哪一个重载函数。
>例如，当调用`add(1,2)`时，编译器会根据参数是整数，选择`int add(int a, int b)`这个函数。

> [!tip]+ **名字修饰（Name Mangling）机制**
> 这是 C++ 支持函数重载的关键因素。C++ 编译器会对函数名进行名字修饰，根据函数的参数列表等信息来修改函数名。例如，对于`int add(int a, int b)`和`float add(float a, float b)`，编译器可能会将它们的名字分别修饰为类似`_Z3addii`和`_Z3addff`（这只是一种示意，不同编译器的名字修饰规则不同）。这样，在链接阶段，就可以根据修饰后的名字来区分不同的函数，从而实现函数重载。

##### 验证: g++ 函数重载

![[g++验证函数重载图.svg]]
g++的函数修饰后变成【`_Z+函数长度+函数名+类型首字母`】。

结论：在linux下，采用g++编译完成后，函数名字的修饰发生改变，编译器将函数参数类型信息
添加到修改后的名字中。


> [!abstract] 原理解释
> 这就是为什么C++支持重载：==实际上这些函数的真实名字是不同的==！

##### Windows下名字修饰规则
![[Windows下的名字修饰图.png]]
对比Linux会发现，windows下C++编译器对函数名字修饰非常诡异，但道理都是一样的。


### extern "C"
如果想在C++中使用C语言的函数，或者想让C++函数被C语言调用，就需要使用`extern "C"`：

```cpp
// C++代码
extern "C" {
    int add(int a, int b) {
        return a + b;
    }
}
```

> [!tip] 小贴士
> 1. ==函数重载主要看参数类型和个数==
> 2. **返回值类型不同不构成重载**
> 3. `extern "C"`用于关闭名字修饰机制



## 引用

### 引用的概念
**引用是 C++ 中的一种机制，它为一个变量创建了一个==别名==**。可以把引用想象成是变量的另一个名字，它们就像一对双胞胎，共享相同的内存空间。当你使用引用时，实际上就是在操作它所引用的那个变量。例如

```cpp
int num = 10;
int& ref = num;  // ref是num的引用（别名）

ref = 20;        // 通过ref修改，num的值也会改变
cout << num;     // 输出20
```

在这个例子中，`ref` 是 `num` 的引用。它们指向同一块内存，对 `ref` 的任何操作，就等同于对 `num` 的操作。

### 引用特性
1. ==**必须初始化**==
>一旦定义了引用，就必须立即将它初始化为一个已存在的变量，不能像指针那样先定义后赋值。
```cpp
int& ref;      // 错误：引用必须初始化
int num = 10;
int& ref = num; // 正确
```

2. ==**一旦引用某个变量，就不能再引用其他变量**==
>引用一旦初始化指向一个变量，就不能再指向其他变量了。它就像一个忠诚的伙伴，一生只绑定一个变量。
```cpp
int a = 10;
int b = 20;
int& ref = a;  // ref引用了a
ref = b;       // 这是赋值，不是改变引用！
```

### 常引用
常引用就是==**给常量起别名**==，用`const`修饰：
>可以定义对常量的引用，比如`const int &ref = 10;`，这里编译器会创建一个临时的整型常量，`ref` 引用这个临时常量。这种引用不能用于修改它所引用的值。
```cpp
const int& ref = 10;  // 正确：常引用可以引用字面值
int num = 20;
const int& ref2 = num;  // 可以引用变量，但不能通过ref2修改num
```

### 使用场景

#### 做参数
==引用作参数可以避免拷贝，提高效率==：

```cpp
// 传统方式
void swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

// 引用方式（更简洁）
void swap(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
}

int main() {
    int x = 10, y = 20;
    swap(x, y);  // 使用引用方式更简单
    return 0;
}
```
在 `swap` 函数中，参数 `a` 和 `b` 是引用类型。当我们在 `main` 函数中调用 `swap(x, y)` 时，`a` 引用了 `x`，`b` 引用了 `y`。所以在 `swap` 函数中对 `a` 和 `b` 的操作，实际上就是对 `x` 和 `y` 的操作。

#### 做返回值
引用作为返回值可以==**返回局部变量的引用**==：

```cpp
int& getElement(vector<int>& arr, int index) {
    return arr[index];  // 返回引用
}

int main() {
    vector<int> nums = {1, 2, 3};
    getElement(nums, 1) = 20;  // 直接修改元素
    cout << nums[1];  // 输出20
    return 0;
}
```


### 常见错误案列
1. **返回局部变量的引用**
```cpp
int& wrongFunction() {
    int localNum = 15;
    return localNum; // 错误，函数结束后localNum就不存在了
}
```
在这个例子中，`wrongFunction` 返回了一个局部变量的引用。当函数结束后，局部变量被销毁，这个引用就变成了 “悬空引用”，使用它会导致未定义的行为，可能会使程序崩溃或者出现奇怪的结果。


2. **未初始化引用**
```cpp
int main() { int &uninitializedRef; // 错误，引用未初始化 return 0; }
```
这种情况是不允许的，一定要记住引用在定义的时候就要初始化！


### 传值、传引用效率比较

```cpp
struct BigStruct {
    int arr[10000];
};

// 传值：会拷贝整个结构体
void func1(BigStruct s) { }

// 传引用：只传递引用，不拷贝
void func2(const BigStruct& s) { }

int main() {
    BigStruct s;
    func1(s);  // 性能较差
    func2(s);  // 性能更好
    return 0;
}
```

> [!tip] 性能建议
> 1. ==对于内置类型（如int），直接传值==
> 2. ==**对于自定义类型或大型结构，使用常引用**==


### 引用和指针的区别

1. ==**语法层面**==：
   - 引用必须初始化
   - 引用不能为空
   - 引用不能更改指向

2. **底层实现**：
   - ==引用通常由指针实现==
   - 编译器会自动解引用

```cpp
int num = 10;
int* ptr = &num;  // 指针
int& ref = num;   // 引用

*ptr = 20;  // 使用指针修改
ref = 30;   // 使用引用修改（更直观）
```

> [!warning] 注意事项
> 1. ==不要返回局部变量的引用==
> 2. **函数返回引用时，要确保引用的对象生命周期足够长**
> 3. 如果不需要修改引用的值，尽量使用常引用

## 内联函数

### 内联函数的概念
==内联函数是C++为了替代C语言中的宏定义函数而引入的==。它可以**避免函数调用的开销**，同时保持代码的可读性。

```cpp
// 宏定义方式（C语言风格）
#define MAX(a, b) ((a) > (b) ? (a) : (b))

// 内联函数方式（C++风格）
inline int max(int a, int b) {
    return a > b ? a : b;
}

int main() {
    int x = 10, y = 20;
    cout << max(x, y) << endl;  // 使用内联函数
    return 0;
}
```

### 内联函数的特性
1. ==**内联仅仅是对编译器的建议**==，编译器不一定会采纳
2. **内联函数在编译时展开**，节省了函数调用的开销
3. ==内联函数可以进行类型检查==，比宏定义更安全


### 注意事项
1. **函数复杂度**：内联函数一般适用于函数体非常简单短小的情况。如果函数体有复杂的逻辑、大量的语句或者包含循环、递归等结构，使用内联函数可能会导致代码膨胀，反而降低程序的性能。因为内联函数会在每个调用处展开，如果函数体很大，会增加可执行文件的大小。
2. **编译优化**：虽然使用了 `inline` 关键字，但编译器并不一定会按照我们的意愿将函数内联。编译器会根据自己的优化策略来决定是否内联一个函数。例如，如果函数的地址被获取（比如通过函数指针），或者函数递归调用，编译器可能不会内联这个函数。
3. **代码维护**：过多地使用内联函数可能会使代码的可读性变差。因为内联函数的代码在展开后会分散在各个调用处，不像普通函数那样有清晰的函数定义和调用关系。所以在使用内联函数时，要权衡效率和代码的可维护性。

> [!abstract]+  总结: 不适合内联的情况
> 1. ==函数体太大==
> 2. ==含有循环或递归==
> 3. ==虚函数（运行时多态）==
## 常见错误案例
1. **过度使用内联函数**  
    假设我们有一个很长很复杂的函数，却错误地将它声明为内联函数：
```cpp
inline int complexFunction(int a, int b, int c, int d) {
    // 这里有大量复杂的计算逻辑，比如多个嵌套的循环、条件判断等
    int result = 0;
    for (int i = 0; i < a; ++i) {
        for (int j = 0; j < b; ++j) {
            // 更多复杂计算...
        }
    }
    return result;
}
```

这种情况下，由于函数在每个调用处都会展开，会使代码变得非常庞大，增加了编译时间和可执行文件的大小，而且可能因为代码缓存等问题导致程序性能下降。


2. **依赖内联函数的地址获取**  
    如果我们获取了内联函数的地址，编译器可能不会将它内联。例如：
```cpp
inline int simpleFunction(int x) {
    return x * 2;
}

int (*funcPtr)(int) = simpleFunction; // 获取内联函数的地址，可能导致函数不被内联

int main() {
    int result = simpleFunction(5);
    return 0;
}
```
在这个例子中，因为获取了 `simpleFunction` 的地址，编译器可能不会将它内联，这可能会与我们预期的性能优化效果不一致。所以在使用内联函数时，要注意避免这种情况。

### 宏的优缺点

**优点：**
1. ==在预处理阶段展开，不会有函数调用开销==
2. **可以处理任意类型**

**缺点：**
1. ==**没有类型检查，容易出错**==
2. **调试困难**
3. **容易产生意想不到的问题**

```cpp
// 宏定义的问题示例
#define SQUARE(x) x * x

int main() {
    int result = SQUARE(2 + 3);  // 展开为：2 + 3 * 2 + 3
    cout << result << endl;      // 输出11，而不是25！
    return 0;
}
```

## auto关键字

### auto简介
C++11引入的==**auto关键字可以自动推导变量类型**==，在使用 auto 关键字时，编译器会根据变量的初始化表达式自动推断出变量的类型。这意味着我们不需要显式地写出变量的类型，编译器会帮我们搞定。

```cpp
// 不使用auto
vector<int>::iterator it = vec.begin();

// 使用auto
auto it = vec.begin();  // 编译器自动推导类型
```

### auto的使用细则

#### auto与指针和引用结合使用
```cpp
int x = 10;
auto p = &x;     // p是int*类型
auto& ref = x;   // ref是int&类型
auto* ptr = &x;  // ptr是int*类型

const auto& cr = x;  // cr是const int&类型
```

#### 在同一行定义多个变量
==**同一行定义的所有变量必须是相同的类型**==：
```cpp
// 正确：a和b都是int类型
auto a = 1, b = 2;  

// 错误：c是int，d是double
auto c = 1, d = 2.0;  
```

### auto不能推导的场景
1. ==**类的非静态成员变量**==
```cpp
class MyClass {
    auto x = 1;  // 错误：非静态成员变量不能使用auto
    static auto y = 1;  // 错误：静态成员变量也不能使用auto
};
```

2. **函数参数**
```cpp
void func(auto x) { }  // 错误：函数参数不能使用auto
```

3. **数组**
```cpp
auto arr[10] = {1, 2, 3};  // 错误：数组声明不能使用auto
```

> [!tip] 使用建议
> 1. ==用auto来简化复杂的类型声明==
> 2. **迭代器类型推导特别有用**
> 3. ==**不要过度使用auto，可能降低代码可读性**==

## 基于范围的for循环(C++11)

### 范围for的语法
C++11引入了==更简洁的循环语法==，特别适合遍历容器：

```cpp
vector<int> nums = {1, 2, 3, 4, 5};

// 传统for循环
for(size_t i = 0; i < nums.size(); i++) {
    cout << nums[i] << " ";
}

// 范围for循环
for(const auto& num : nums) {  // 使用引用避免拷贝
    cout << num << " ";
}
```

### 范围for的使用条件
要使用范围for循环，容器必须满足以下条件：
1. ==**有begin()和end()成员函数**==
2. **迭代器支持++操作和!=比较**
3. ==能够返回元素的引用==

```cpp
// 自定义类型使用范围for
class MyContainer {
public:
    int* begin() { return data; }
    int* end() { return data + size; }
private:
    int data[100];
    int size;
};

MyContainer container;
for(auto& element : container) {
    // 处理每个元素
}
```

> [!warning] 注意事项
> 1. ==遍历时最好使用引用，避免拷贝==
> 2. **如果不需要修改元素，使用const引用**
> 3. ==不要在循环体中修改容器的大小==

## 指针空值-nullptr(C++11)

在 C++ 中，`nullptr` 是一个表示空指针的关键字。它专门用于表示指针不指向任何有效的内存地址。**在 C++11 之前，我们常用 `NULL` 来表示空指针，但 `NULL` 在 C++ 中实际上是一个宏，它的值在一些情况下可能会被定义为整数 0。这就可能导致一些混淆，因为整数 0 和空指针在语义上是不同的，虽然在很多情况下它们的行为相似。** 而 `nullptr` 是一个真正的指针类型空值，它的类型是 `std::nullptr_t`，这使得它在类型检查等方面更加严格和安全。

### C++98中的指针空值NULL
在C++98中，我们使用`NULL`或`0`来表示空指针，但这可能会带来一些问题：

```cpp
#define NULL 0  // NULL实际上就是整数0

void func(int n) { cout << "整数版本" << endl; }
void func(int* p) { cout << "指针版本" << endl; }

int main() {
    func(0);    // 调用整数版本
    func(NULL); // 也调用整数版本！这可能不是我们想要的
    return 0;
}
```

### nullptr关键字
C++11引入了==**nullptr关键字，专门用于表示空指针**==：

```cpp
void func(int n) { cout << "整数版本" << endl; }
void func(int* p) { cout << "指针版本" << endl; }

int main() {
    func(nullptr);  // 调用指针版本
    
    int* p = nullptr;  // 推荐使用nullptr初始化指针
    if(p == nullptr) { // 判断指针是否为空
        cout << "p是空指针" << endl;
    }
    return 0;
}
```


> [!tip]+ 小贴士
> 1. 在使用`nullptr`表示指针空值时，不需要包含头文件，因为`nullptr`是C++11作为新关键字引入的。
> 2. 在C++11中，`sizeof(nullptr)` 与 `sizeof((void*)0)`所占的字节数相同。
> 3. 为了提高代码的健壮性，在后续表示指针空值时建议最好使用`nullptr`。

## 类型转换
在C++中，==不再推荐使用C风格的强制类型转换==，而是引入了四种新的类型转换操作符：

### static_cast
==**用于基本类型之间的转换，以及有继承关系的指针或引用之间的转换**==：

```cpp
double d = 3.14;
int i = static_cast<int>(d);  // double转int

class Base {};
class Derived : public Base {};
Derived* pd = new Derived();
Base* pb = static_cast<Base*>(pd);  // 向上转换（安全）
```

### dynamic_cast
==主要用于多态类型的转换==，可以在运行时进行类型检查：

```cpp
class Base {
    virtual void dummy() {}  // 需要有虚函数才能使用dynamic_cast
};
class Derived : public Base {};

Base* pb = new Derived();
// 运行时检查转换是否安全
Derived* pd = dynamic_cast<Derived*>(pb);
if(pd) {
    cout << "转换成功" << endl;
}
```

### const_cast
==**用于去除或添加const属性**==：

```cpp
const int constant = 21;
const int* const_p = &constant;
int* modifiable = const_cast<int*>(const_p);  // 去除const
*modifiable = 7;  // 可以修改，但不建议这样做
```

### reinterpret_cast
==**最危险的转换，用于任意指针类型之间的转换**==：

```cpp
int* p = new int(42);
// 将int*重新解释为char*
char* cp = reinterpret_cast<char*>(p);
```

> [!warning] 注意事项
> 1. ==优先使用static_cast==
> 2. **dynamic_cast主要用于多态类型**
> 3. ==const_cast应谨慎使用==
> 4. ==**尽量避免使用reinterpret_cast**==

## 面向对象预览

### 类的基本概念
C++中的类是==**对数据和操作数据的方法的封装**==：

```cpp
class Student {
private:  // 私有成员
    string name;
    int age;
    
public:   // 公有成员
    // 构造函数
    Student(string n, int a) : name(n), age(a) {}
    
    // 成员函数
    void printInfo() {
        cout << "姓名：" << name << endl;
        cout << "年龄：" << age << endl;
    }
};
```

### 从C语言结构体到C++类的过渡
让我们看看结构体是如何演变成类的：

```cpp
// C语言风格
struct Student_C {
    char name[50];
    int age;
};
void printStudent(struct Student_C* s) {
    printf("姓名：%s\n", s->name);
    printf("年龄：%d\n", s->age);
}

// C++风格
class Student_CPP {
private:
    string name;
    int age;
public:
    void printInfo() {  // 成员函数
        cout << "姓名：" << name << endl;
        cout << "年龄：" << age << endl;
    }
};
```

> [!tip] 类的特点
> 1. ==**数据和函数的组合**==
> 2. **访问控制**（private、public、protected）
> 3. ==封装性更好==
> 4. **代码更容易维护**

> [!note] 后续学习建议
> 1. 深入学习类的其他特性（继承、多态等）
> 2. 理解面向对象的三大特性
> 3. 学习STL（标准模板库）的使用

这就是C++入门的主要内容了！记住，==**学习C++最重要的是多练习**==，从简单的程序开始，逐步提高。祝你学习愉快！