---
Type: Note
tags: 
Status: writing
Start-date: 2025-04-23 22:31
Finish-date: 
Modified-date: 2025-04-23 22:58
Publish: false
---


## 2.1 Qt 中的基本数据类型
### 2.1.1 整数类型
在 Qt 中，提供了一系列的整数类型，以满足不同的存储需求。
- `qint8`：等同于 `signed char`，占用 1 个字节，范围是 -128 到 127。常用于存储小范围的整数，如表示颜色分量等。
```cpp
qint8 num1 = -10;
```
- `qint16`：等同于 `signed short`，占用 2 个字节，范围是 -32768 到 32767。在一些需要稍大范围整数的场景中使用。
```cpp
qint16 num2 = 30000;
```
- `qint32`：等同于 `signed int`，占用 4 个字节，范围是 -2147483648 到 2147483647。是最常用的整数类型之一。
```cpp
qint32 num3 = 1000000;
```
- `qint64`：等同于 `signed long long`，占用 8 个字节，能表示非常大的整数。
```cpp
qint64 num4 = 123456789012345;
```

### 2.1.2 浮点数类型
- `qreal`：在 32 位系统上等同于 `float`，在 64 位系统上等同于 `double`。它提供了一种跨平台的浮点数表示方式。
```cpp
qreal num5 = 3.14159;
```

### 2.1.3 布尔类型
- `bool`：和标准 C++ 中的布尔类型一样，只有 `true` 和 `false` 两个值，用于表示逻辑状态。
```cpp
bool isTrue = true;
```

### 2.1.4 字符类型
- `QChar`：用于表示一个 Unicode 字符，占用 2 个字节，能处理各种语言的字符。
```cpp
QChar ch = 'A';
```

## 2.2 字符串操作
### 2.2.1 `QString` 类的使用
`QString` 是 Qt 中用于处理字符串的类，它提供了丰富的方法来操作字符串。
```cpp
#include <QString>
#include <QDebug>

int main() {
    QString str = "Hello, Qt!";
    qDebug() << str;
    return 0;
}
```

### 2.2.2 字符串拼接、截取、查找
- 拼接：可以使用 `+` 运算符或 `append()` 方法。
```cpp
QString str1 = "Hello";
QString str2 = " World";
QString result = str1 + str2;
str1.append(str2);
```
- 截取：使用 `mid()` 方法。
```cpp
QString str = "Hello, Qt!";
QString subStr = str.mid(7, 2); // 从索引 7 开始，截取 2 个字符
```
- 查找：使用 `indexOf()` 方法。
```cpp
QString str = "Hello, Qt!";
int pos = str.indexOf("Qt"); // 查找 "Qt" 的位置
```

### 2.2.3 字符串格式化
使用 `arg()` 方法进行字符串格式化。
```cpp
QString name = "John";
int age = 25;
QString message = QString("My name is %1 and I'm %2 years old.").arg(name).arg(age);
```

### 2.2.4 字符串编码转换
可以使用 `toUtf8()`、`toLocal8Bit()` 等方法进行编码转换。
```cpp
QString str = "你好";
QByteArray utf8Data = str.toUtf8();
```

## 2.3 容器类
### 2.3.1 `QList` 的使用及特点
`QList` 是一个动态数组，类似于 `std::vector`，但在 Qt 中使用更方便。
```cpp
#include <QList>
#include <QDebug>

int main() {
    QList<int> list;
    list.append(1);
    list.append(2);
    list.append(3);
    for (int i = 0; i < list.size(); ++i) {
        qDebug() << list[i];
    }
    return 0;
}
```
`QList` 支持快速的随机访问和在列表末尾添加元素。

### 2.3.2 `QVector` 的使用及性能优势
`QVector` 也是一个动态数组，和 `QList` 类似，但它在内存布局上更紧凑，对于存储基本数据类型性能更好。
```cpp
#include <QVector>
#include <QDebug>

int main() {
    QVector<int> vector;
    vector << 1 << 2 << 3;
    for (int i = 0; i < vector.size(); ++i) {
        qDebug() << vector[i];
    }
    return 0;
}
```

### 2.3.3 `QMap` 和 `QHash` 的区别与应用场景
- `QMap`：是一个有序的关联容器，按键的升序排列。适用于需要按键排序的场景。
```cpp
#include <QMap>
#include <QDebug>

int main() {
    QMap<QString, int> map;
    map.insert("one", 1);
    map.insert("two", 2);
    for (auto it = map.begin(); it != map.end(); ++it) {
        qDebug() << it.key() << ": " << it.value();
    }
    return 0;
}
```
- `QHash`：是一个无序的关联容器，使用哈希表实现，查找速度更快。适用于需要快速查找的场景。
```cpp
#include <QHash>
#include <QDebug>

int main() {
    QHash<QString, int> hash;
    hash.insert("one", 1);
    hash.insert("two", 2);
    for (auto it = hash.begin(); it != hash.end(); ++it) {
        qDebug() << it.key() << ": " << it.value();
    }
    return 0;
}
```

### 2.3.4 容器的遍历方式
除了上述使用迭代器的方式，还可以使用范围 for 循环。
```cpp
QList<int> list = {1, 2, 3};
for (int num : list) {
    qDebug() << num;
}
```

## 2.4 枚举类型与 `Q_ENUM` 宏
`Q_ENUM` 是 Qt 提供的一个宏，它的主要作用是将自定义的枚举类型集成到 Qt 的元对象系统中。Qt 的元对象系统是 Qt 框架的核心特性之一，它允许在运行时进行类型信息查询、信号与槽机制、属性系统等操作。通过使用 `Q_ENUM` 宏，你可以让自定义的枚举类型在这些操作中被识别和使用，例如在属性系统中使用枚举类型，或者通过 `QMetaObject` 系统获取枚举类型的信息。

### 2.4.1 自定义枚举类型
```cpp
enum class Color {
    Red,
    Green,
    Blue
};
```

### 2.4.2 使用 `Q_ENUM` 宏在 Qt 元对象系统中注册枚举
要使用 `Q_ENUM`，需要满足以下几个条件：
1. **枚举类型必须定义在 `QObject` 派生类中**：因为 `Q_ENUM` 依赖于 Qt 的元对象系统，而只有 `QObject` 的派生类才支持元对象系统。
2. **类必须使用 `Q_OBJECT` 宏**：`Q_OBJECT` 宏是启用元对象系统的关键，它会自动生成一些必要的代码，使得类可以参与到元对象系统的各种操作中。
3. **在类中使用 `Q_ENUM` 宏声明枚举类型**：将自定义的枚举类型作为 `Q_ENUM` 宏的参数。
```cpp
#include <QObject>
#include <QDebug>

class MyClass : public QObject
{
    Q_OBJECT
public:
    // 定义自定义枚举类型
    enum class MyEnum {
        Value2,
        Value3
    };
    // 使用 Q_ENUM 宏将枚举类型注册到元对象系统中
    Q_ENUM(MyEnum)

    explicit MyClass(QObject *parent = nullptr) : QObject(parent) {}
};

#include "main.moc"

int main()
{
    //获取 MyClass 的元对象
    const QMetaObject *metaObject = MyClass::staticMetaObject;
    // 获取枚举类型的索引
    int enumIndex = metaObject->indexOfEnumerator("MyEnum");
    if (enumIndex != -1) {
        // 获取枚举类型的元信息
        QMetaEnum metaEnum = metaObject->enumerator(enumIndex);
        // 打印枚举值的名称
        qDebug() << "Enum name:" << metaEnum.name();
        // 遍历枚举值
        for (int i = 0; i < metaEnum.keyCount(); ++i) {
            qDebug() << "Key:" << metaEnum.key(i) << "Value:" << metaEnum.value(i);
        }
    }
    return 0;
}
```

### 2.4.3 枚举类型在属性系统和信号槽机制中的应用
可以在属性系统中使用枚举类型，也可以在信号槽中传递枚举值。
```cpp
#include <QObject>
#include <QDebug>

class Sender : public QObject
{
    Q_OBJECT
public:
    enum class MyEnum {
        Value1,
        Value2,
        Value3
    };
    Q_ENUM(MyEnum)

    explicit Sender(QObject *parent = nullptr) : QObject(parent) {}

signals:
    void mySignal(MyEnum value);

    void sendSignal() {
        emit mySignal(MyEnum::Value2);
    }
};

class Receiver : public QObject
{
    Q_OBJECT
public:
    explicit Receiver(QObject *parent = nullptr) : QObject(parent) {}

public slots:
    void mySlot(Sender::MyEnum value) {
        qDebug() << "Received value:" << static_cast<int>(value);
    }
};

#include "main.moc"

int main()
{
    Sender sender;
    Receiver receiver;
    // 连接信号与槽
    QObject::connect(&sender, &Sender::mySignal, &receiver, &Receiver::mySlot);
    // 发送信号
    sender.sendSignal();
    return 0;
}
```

在这个示例中，我们定义了一个 `Sender` 类和一个 `Receiver` 类。`Sender` 类发出一个包含 `MyEnum` 类型参数的信号，`Receiver` 类有一个槽函数来接收这个信号。通过 `Q_ENUM` 宏，我们可以在信号与槽中正常传递这个枚举类型。

通过以上示例，你应该对 `Q_ENUM` 的作用和使用方法有了更深入的理解。它可以让你更方便地在 Qt 应用程序中使用自定义的枚举类型，并且与 Qt 的元对象系统、属性系统、信号与槽机制等进行集成。
