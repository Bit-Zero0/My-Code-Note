---
Type: Note
tags: 
Status: writing
Start-date: 2025-04-26 11:16
Finish-date: 
Modified-date: 2025-04-26 11:19
Publish: false
---


## C++ 异常处理 (Exception Handling)

### 1. 为什么需要异常处理？

在程序执行过程中，可能会遇到各种错误或非预期的情况，例如：

* 试图打开一个不存在的文件。
* 网络连接中断。
* 除以零。
* 内存分配失败。
* 传递给函数的参数无效。

传统的错误处理方法通常依赖**返回值**或**全局错误码** (如 C 语言中的 `errno`)。

```c++
// 传统错误码方式
int process_data(int input) {
    if (input < 0) {
        return -1; // 错误码 1: 无效输入
    }
    // ... 处理 ...
    if (/* 发生内部错误 */ false) {
        return -2; // 错误码 2: 内部处理失败
    }
    return 0; // 成功
}

int main() {
    int result = process_data(-5);
    if (result == -1) {
        std::cerr << "Error: Invalid input provided." << std::endl;
    } else if (result == -2) {
        std::cerr << "Error: Internal processing failed." << std::endl;
    } else {
        std::cout << "Processing successful." << std::endl;
    }
    return 0;
}
```

这种方式的缺点：

1.  **错误处理代码与正常逻辑混杂:** 每个可能出错的函数调用后都需要检查返回值，使代码变得冗长和难以阅读。
2.  **容易忽略错误:** 调用者可能忘记检查返回值，导致错误被忽略，程序在错误状态下继续运行。
3.  **错误信息丢失:** 返回码通常只能表示错误的类型，难以传递错误的详细上下文信息。
4.  **无法在构造函数中有效报告错误:** 构造函数没有返回值，虽然可以设置成员变量状态，但这需要在每次使用对象前检查状态。

C++ 异常处理机制提供了一种更强大、更清晰的方式来处理程序运行时的**异常**情况（即那些阻止程序正常执行流程的事件）。

### 2. 异常处理的基本机制：`throw`, `try`, `catch`

C++ 异常处理涉及三个核心关键字：

* **`throw`:** 当检测到无法在当前上下文处理的错误时，使用 `throw` 关键字**抛出 (throw)** 一个异常。抛出异常会**立即**中断当前的执行流程。
* **`try`:** 将可能抛出异常的代码块放入 `try` 块中。
* **`catch`:** 在 `try` 块之后紧跟一个或多个 `catch` 块（称为**异常处理器 (exception handler)**）。每个 `catch` 块指定它能处理的异常类型。如果 `try` 块中的代码抛出了异常，程序会寻找能够匹配该异常类型的 `catch` 块来执行。

**基本语法结构：**

```c++
#include <iostream>
#include <stdexcept> // 包含标准异常类
#include <string>

double divide(double numerator, double denominator) {
    if (denominator == 0.0) {
        // 抛出一个 runtime_error 类型的异常
        throw std::runtime_error("Division by zero error!");
    }
    return numerator / denominator;
}

int main() {
    double a = 10.0;
    double b = 0.0;
    double result;

    try {
        std::cout << "Attempting division..." << std::endl;
        result = divide(a, b); // 这行代码可能会抛出异常
        // 如果上面抛出异常，下面的代码不会执行
        std::cout << "Division successful: " << result << std::endl;
    } catch (const std::runtime_error& e) {
        // 捕获 std::runtime_error 类型的异常及其派生类异常
        std::cerr << "Caught an exception: " << e.what() << std::endl;
        // e.what() 是 std::exception 类及其派生类提供的虚函数，用于获取错误描述字符串
        result = 0.0; // 可以进行一些恢复操作
    } catch (const std::exception& e) {
        // 可以捕获其他类型的标准异常
        std::cerr << "Caught another std::exception: " << e.what() << std::endl;
    } catch (...) {
        // 捕获任意类型的异常 (Catch-all block)，通常放在最后
        std::cerr << "Caught an unknown exception!" << std::endl;
    }

    // 程序在 catch 块执行后会继续执行 try-catch 结构之后的代码
    std::cout << "Program continues after try-catch block. Result is: " << result << std::endl;

    return 0;
}
```

### 3. 可以抛出什么？(What to Throw)

你可以 `throw` 几乎任何类型的值：

* 基本类型 (如 `int`, `const char*`)
* 自定义类对象
* 指针

**最佳实践:** 推荐抛出**类类型对象**，特别是派生自标准异常基类 `std::exception` (定义在 `<exception>` 头文件) 的对象。

* **标准异常类:** C++ 标准库在 `<stdexcept>` 头文件中提供了一系列标准的异常类，它们都派生自 `std::exception`。常用的包括：
    * `std::logic_error`: 指程序逻辑错误，理论上可在运行前被检测到。
        * `std::invalid_argument`: 无效参数。
        * `std::domain_error`: 参数值超出有效域。
        * `std::length_error`: 试图创建超出最大长度的对象。
        * `std::out_of_range`: 访问越界（如 `vector::at()`）。
    * `std::runtime_error`: 指只有在运行时才能检测到的错误。
        * `std::overflow_error`: 算术上溢。
        * `std::underflow_error`: 算术下溢。
        * `std::range_error`: 计算结果无法表示。
    * `std::bad_alloc`: `new` 内存分配失败时抛出 (在 `<new>` 中定义)。
    * `std::bad_cast`: `dynamic_cast` 对引用类型转换失败时抛出。
    * 等等...
* **自定义异常类:** 你可以定义自己的异常类，通常建议继承自 `std::exception` 或其派生类，并重写 `what()` 虚函数以提供有意义的错误信息。

```c++
#include <exception>
#include <string>

class MyCustomError : public std::runtime_error {
public:
    MyCustomError(const std::string& message) : std::runtime_error(message) {}
    // 可以添加额外的成员变量来携带更多错误信息
};

void doSomethingRisky() {
    // ...
    if (/* a specific error condition */ true) {
        throw MyCustomError("Something specific went wrong!");
    }
}
```

**为什么推荐抛出类对象 (尤其是 `std::exception` 派生类)?**
1.  **包含信息:** 对象可以携带丰富的错误信息（通过成员变量和 `what()` 方法）。
2.  **类型层次:** 可以利用继承关系来组织不同类型的错误，并通过捕获基类来处理一类相关的错误。
3.  **标准化:** 使用标准异常类或继承自它们，使得代码更容易被他人理解和集成。

### 4. 如何捕获异常？(Catching Exceptions)

* **类型匹配:** 当异常被抛出时，程序会按顺序检查当前 `try` 块关联的 `catch` 块。第一个**类型匹配**的 `catch` 块将被执行。
* **匹配规则:**
    * 精确匹配。
    * 允许非 `const` 到 `const` 的转换。
    * 允许派生类到基类的转换（**重要！**）。
    * 允许数组或函数到指针的转换。
* **捕获顺序:** `catch` 块的顺序很重要。应该**先捕获派生类异常，再捕获基类异常**。否则，基类 `catch` 块会先捕获到派生类异常，导致专门处理派生类的 `catch` 块永远不会被执行。
* **捕获方式:**
    * **按值捕获 (`catch (MyError e)`):** 会创建异常对象的**副本**。这可能导致**对象切割 (slicing)** 问题（如果捕获的是基类，派生类特有的部分会丢失），并且有拷贝开销。**不推荐**。
    * **按引用捕获 (`catch (MyError& e)`):** 直接引用原始的异常对象，无拷贝开销，无切割问题。如果需要在 `catch` 块内修改异常对象（很少见），可以使用非 `const` 引用。
    * **按 `const` 引用捕获 (`catch (const MyError& e)`):** **最佳实践！** 既避免了拷贝和切割，又表明不会在 `catch` 块内修改异常对象。
    * **按指针捕获 (`catch (MyError* p)`):** 只能捕获通过指针 `throw` 的异常。**不推荐**，因为异常对象的所有权管理会变得复杂。
* **捕获所有异常 (`catch (...)`):** 可以捕获任何类型的异常。通常用作最后的防线，用于执行通用清理或记录未知错误，之后可能重新抛出 (`throw;`)。

```c++
class BaseError : public std::exception { /* ... */ };
class DerivedError : public BaseError { /* ... */ };

try {
    // ... 可能抛出 DerivedError 或 BaseError
} catch (const DerivedError& de) { // 先捕获派生类
    std::cerr << "Caught DerivedError: " << de.what() << std::endl;
} catch (const BaseError& be) {    // 再捕获基类
    std::cerr << "Caught BaseError (or derived): " << be.what() << std::endl;
} catch (const std::exception& e) { // 捕获其他标准异常
    std::cerr << "Caught std::exception: " << e.what() << std::endl;
} catch (...) {                     // 捕获其他所有类型
    std::cerr << "Caught unknown exception." << std::endl;
    throw; // 可以重新抛出当前捕获的异常，让外层调用栈处理
}
```

### 5. 栈展开 (Stack Unwinding) 与 RAII

这是异常处理中最关键、最强大的部分，也是它与 RAII 紧密联系的地方。

当 `throw` 语句执行时：

1.  **暂停当前执行流程。**
2.  **开始栈展开过程:**
    * 程序沿着函数调用链**反向**查找匹配的 `catch` 块。
    * 在查找过程中，每退出一个函数（或一个作用域块），该作用域内创建的所有**局部对象 (栈对象)** 都会按照**与构造相反的顺序**被**销毁**，即它们的**析构函数会被自动调用**。
3.  **找到匹配的 `catch` 块:** 一旦找到第一个类型匹配的 `catch` 块，栈展开停止。
4.  **执行 `catch` 块:** 控制权转移到该 `catch` 块。
5.  **继续执行:** `catch` 块执行完毕后，程序继续执行 `try-catch` 结构之后的代码（除非 `catch` 块中重新抛出了异常或程序终止）。

**栈展开确保了即使在异常发生的情况下，局部对象的析构函数也会被调用。** 这就是为什么 RAII (Resource Acquisition Is Initialization) 是 C++ 中进行异常安全资源管理的核心。

```c++
#include <fstream>
#include <iostream>
#include <stdexcept>

class FileHandler { // 一个简单的 RAII 类
public:
    FileHandler(const std::string& filename) : file_(filename) {
        if (!file_.is_open()) {
            throw std::runtime_error("RAII: Failed to open file " + filename);
        }
        std::cout << "RAII: File opened: " << filename << std::endl;
    }

    ~FileHandler() {
        if (file_.is_open()) {
            file_.close();
        }
        std::cout << "RAII: File closed." << std::endl; // 析构函数总是会被调用
    }

    void write(const std::string& data) {
        if (!file_.is_open()) throw std::logic_error("RAII: File not open for writing.");
        file_ << data;
    }

private:
    std::ofstream file_;
};

void process_with_raii() {
    FileHandler fh("raii_test.txt"); // 构造函数获取资源
    fh.write("Hello ");

    // 模拟一个错误发生
    std::cout << "RAII: Simulating an exception..." << std::endl;
    throw std::runtime_error("RAII: Something went wrong during processing!");

    // 下面的代码不会执行
    fh.write("World!");
} // <--- 在异常导致函数退出前，fh 的析构函数会被调用 (栈展开)

int main() {
    try {
        process_with_raii();
    } catch (const std::exception& e) {
        std::cerr << "RAII Main: Caught exception: " << e.what() << std::endl;
    }
    // 输出会显示 "RAII: File opened..." 和 "RAII: File closed."，证明析构函数被调用了
    return 0;
}
```

### 6. `noexcept` 说明符 (C++11 及以后)

`noexcept` 用来**声明**一个函数**不会**抛出任何异常。

```c++
void func_might_throw();
void func_never_throws() noexcept; // 声明不抛异常
int compute() noexcept { return 42; } // 定义不抛异常
```

**目的:**

1.  **文档化:** 清晰地告诉调用者该函数的异常行为。
2.  **优化:** 编译器可以根据 `noexcept` 信息进行一些优化（例如，移动构造函数/赋值运算符如果是 `noexcept`，`std::vector` 等容器在扩容时会优先使用移动而非拷贝，效率更高）。

**如果一个被声明为 `noexcept` 的函数实际上抛出了异常会怎么样？**

* 程序不会进行栈展开去查找 `catch` 块。
* 程序会**立即调用 `std::terminate()`** (通常导致程序异常终止)。

**`noexcept` 运算符:** 可以用来检查一个表达式是否会抛出异常（编译时判断）。

```c++
void f1() {}
void f2() { throw 1; }
void f3() noexcept {}

int main() {
    std::cout << std::boolalpha;
    std::cout << "f1() noexcept? " << noexcept(f1()) << std::endl; // 可能 false (取决于编译器推断)
    std::cout << "f2() noexcept? " << noexcept(f2()) << std::endl; // false
    std::cout << "f3() noexcept? " << noexcept(f3()) << std::endl; // true
    return 0;
}
```

**建议:**

* **析构函数** 默认且应该总是 `noexcept`。如果析构函数在栈展开过程中抛出异常，会导致 `std::terminate`。
* **移动构造函数** 和 **移动赋值运算符** 尽量设为 `noexcept` 以获得性能优势。
* **内存释放函数** (`delete`, `free`) 应该是 `noexcept`。
* 对于你确定不会抛出异常的函数，可以显式标记 `noexcept`。

### 7. 异常安全 (Exception Safety)

指当异常发生时，程序仍能保持有效状态（不泄漏资源、数据结构不被破坏）的能力。有几个常见的保证级别：

1.  **基本保证 (Basic Guarantee):** 如果异常发生，程序状态仍然是有效的（例如，对象的不变量保持满足），并且没有资源泄漏。但是对象的状态可能已经改变（例如，一个事务只完成了一半）。RAII 是实现基本保证的关键。
2.  **强保证 (Strong Guarantee):** 如果异常发生，程序状态**回滚**到操作开始之前的状态（就像操作从未发生过一样）。这通常通过 "Commit or Rollback" 语义实现，例如，先在临时对象上执行所有可能抛出异常的操作，成功后再用 `noexcept` 操作（如 `swap`）更新原对象。
3.  **不抛掷保证 (Nothrow Guarantee / No-throw Guarantee):** 操作保证不会抛出任何异常 (`noexcept`)。析构函数、`swap` 函数、移动操作通常需要提供此保证。

RAII 对于实现**基本保证**至关重要（自动资源释放）。实现**强保证**通常需要更多工作，比如 Copy-and-Swap 惯用法。

### 8. 异常处理的最佳实践与注意事项

* **何时使用异常:** 用于处理**预期之外**、阻止程序正常流程继续执行的**错误**，而不是用于正常的控制流（比如循环退出条件）。
* **不要滥用异常:** 对于可以预期的、非错误性的情况（如文件结束、查找未命中），通常使用返回值、`std::optional` (C++17) 或 `std::expected` (C++23) 更合适。异常处理有运行时开销（尤其是在抛出时）。
* **抛出对象，按 `const` 引用捕获。**
* **优先使用标准异常类或继承自它们。**
* **`catch` 块的顺序：先派生类，后基类。**
* **析构函数绝不应主动抛出异常。** 如果析构函数内部的操作可能失败，应将该操作移出析构函数，或者在析构函数内部处理掉该异常。
* **构造函数中抛出异常:** 如果构造函数因异常退出，对象的析构函数**不会**被调用（因为对象未完全构造）。但是，**已完全构造的成员变量**的析构函数**会**被调用。因此，构造函数中的资源获取也应该使用 RAII（例如，使用智能指针作为成员变量）。
* **避免在 C/C++ 边界抛出异常:** C 代码不理解 C++ 异常，异常穿越 C 代码边界通常是未定义行为。
* **考虑性能:** 异常处理机制在没有异常抛出时（`try` 块）开销很小（“零开销原则”），但在异常实际抛出时，栈展开和查找处理程序的过程开销较大。

### 9. 未捕获的异常 (Unhandled Exceptions)

如果在异常抛出后，直到调用栈的顶端（`main` 函数）都没有找到匹配的 `catch` 块，程序会调用 `std::terminate()` 函数。`std::terminate()` 的默认行为是调用 `std::abort()`，导致程序异常终止。你可以通过 `std::set_terminate()` 设置一个自定义的终止处理函数。

---

**总结:** C++ 异常处理提供了一种结构化的方式来处理运行时错误，它通过 `throw`, `try`, `catch` 机制将错误处理逻辑与正常逻辑分离。与 RAII 结合使用时，它能极大地提高代码的健壮性和异常安全性。理解栈展开以及 `noexcept` 的含义对于编写可靠的 C++ 代码至关重要。

现在，你应该对 C++ 异常处理有了更深入的理解。接下来可以继续学习**智能指针**了，智能指针正是利用 RAII 和异常处理机制来安全管理动态内存的典范。