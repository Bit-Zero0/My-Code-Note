---
Type: Note
tags: 
Status: writing
Start-date: 2024-11-17 22:09
Finish-date: 
Modified-date: 2024-11-17 22:38
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

C++比C语言增加了更多的关键字，这些关键字让C++的功能更加强大。这里列出一些重要的新增关键字：

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
想象一下，如果你和你的朋友都写了一个叫`print`的函数，如何区分它们呢？这就是命名空间要解决的问题！

```cpp
// 张三的代码
namespace zhangsan {
    void print() {
        cout << "这是张三的打印函数" << endl;
    }
}

// 李四的代码
namespace lisi {
    void print() {
        cout << "这是李四的打印函数" << endl;
    }
}
```

### 命名空间的使用
有三种使用方式：

1. ==完整的命名空间名称==：
```cpp
zhangsan::print(); // 调用张三的print
lisi::print();     // 调用李四的print
```

2. **使用using声明**：
```cpp
using zhangsan::print;
print(); // 调用张三的print
```

3. **使用using namespace**（==**不推荐在头文件中使用**==）：
```cpp
using namespace zhangsan;
print(); // 调用张三的print
```

> [!warning] 注意事项
> 使用`using namespace std;`虽然方便，但可能会导致命名冲突。建议：
> 1. 在小型程序中可以使用
> 2. 在大型项目中最好使用具体的using声明
> 3. 或使用完整的命名空间名称

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
1. `cout`：标准输出流对象
2. `cin`：标准输入流对象
3. `<<`：输出运算符
4. `>>`：输入运算符
5. `endl`：换行并刷新缓冲区

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
C++中的结构体可以==**包含成员函数**==，这是向类过渡的第一步！

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
==缺省参数就是函数参数的默认值==！如果调用函数时没有传递该参数，就使用默认值。

```cpp
void printStars(int count = 5, char symbol = '*') {
    for(int i = 0; i < count; i++) {
        cout << symbol;
    }
    cout << endl;
}

int main() {
    printStars();      // 打印5个*：*****
    printStars(3);     // 打印3个*：***
    printStars(4, '#'); // 打印4个#：####
    return 0;
}
```

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

## 函数重载

### 函数重载的概念
C++允许==**同名函数但参数列表不同**==！这就是函数重载。

```cpp
// 三个同名的max函数
int max(int a, int b) {
    return a > b ? a : b;
}

double max(double a, double b) {
    return a > b ? a : b;
}

int max(int a, int b, int c) {
    return max(max(a, b), c);
}

int main() {
    cout << max(3, 4) << endl;      // 调用第一个max
    cout << max(3.5, 4.2) << endl;  // 调用第二个max
    cout << max(3, 4, 5) << endl;   // 调用第三个max
    return 0;
}
```

### 名字修饰
为什么C++支持函数重载而C语言不支持？这就要说到==名字修饰==（Name Mangling）了！

C++编译器会根据函数的参数类型对函数名进行修饰，例如：
- `max(int, int)` 可能被修饰为 `_max_int_int`
- `max(double, double)` 可能被修饰为 `_max_double_double`

> [!note] 原理解释
> 这就是为什么C++支持重载：==实际上这些函数的真实名字是不同的==！

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
引用可以看作是变量的==**别名**==，它是C++对C语言的重要扩充。

```cpp
int num = 10;
int& ref = num;  // ref是num的引用（别名）

ref = 20;        // 通过ref修改，num的值也会改变
cout << num;     // 输出20
```

### 引用特性
1. ==**必须初始化**==
```cpp
int& ref;      // 错误：引用必须初始化
int num = 10;
int& ref = num; // 正确
```

2. ==**一旦引用某个变量，就不能再引用其他变量**==
```cpp
int a = 10;
int b = 20;
int& ref = a;  // ref引用了a
ref = b;       // 这是赋值，不是改变引用！
```

### 常引用
常引用就是==**给常量起别名**==，用`const`修饰：

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

> [!warning] 注意事项
> 不适合内联的情况：
> 1. ==函数体太大==
> 2. ==含有循环或递归==
> 3. ==虚函数（运行时多态）==

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
C++11引入的==**auto关键字可以自动推导变量类型**==，让代码更简洁！

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

### C++98中的指针空值
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