# 背景
Lambda表达式是Java SE 8中一个重要的新特性。lambda表达式允许你通过表达式来代替功能接口。 lambda表达式就和方法一样,它提供了一个正常的参数列表和一个使用这些参数的主体(body,可以是一个表达式或一个代码
块)。 **Lambda 表达式（Lambda expression）**，基于数学中的`λ`演算得名，也可称为**闭包**（Closure） 

## 冗余的匿名内部类
当需要启动一个线程去完成任务时，通常会通过`java.lang.Runnable`接口来定义任务内容，并使用`java.lang.Thread`类来启动该线程。代码如下：

```java
public class UseFunctionalProgramming {  
    public static void main(String[] args) {  
        new Thread(new Runnable() {  
            @Override  
            public void run() {  
                System.out.println("多线程任务执行！");  
            }  
        }).start(); // 启动线程  
    }  
}
```
本着“一切皆对象”的思想，这种做法是无可厚非的：首先创建一个`Runnable`接口的匿名内部类对象来指定任务内容，再将其交给一个线程来启动。


**代码分析：**
对于`Runnable`的匿名内部类用法，可以分析出几点内容：
- `Thread`类需要`Runnable`接口作为参数，其中的抽象`run`方法是用来指定线程任务内容的核心；
- 为了指定`run`的方法体，**不得不**需要`Runnable`接口的实现类；
- 为了省去定义一个`RunnableImpl`实现类的麻烦，**不得不**使用匿名内部类；
- 必须覆盖重写抽象`run`方法，所以方法名称、方法参数、方法返回值**不得不**再写一遍，且不能写错；
- 而实际上，**似乎只有方法体才是关键所在**。


而使用 lambda表达式, 就很简单
```java
public class test {  
    public static void main(String[] args) {  
        new Thread(()->{  
                System.out.println("多线程任务执行!");  
        }).start();  
    }  
}
```

# Lambda 表达式的语法
基本语法: (parameters) -> expression 或 (parameters) ->{ statements; } 
Lambda表达式由三部分组成：

1. paramaters：类似方法中的形参列表，这里的参数是函数式接口里的参数。这里的参数类型可以明确的声明也可不声明而由JVM隐含的推断。另外当只有一个推断类型时可以省略掉圆括号。

2. `->`：可理解为“被用于”的意思

3. 方法体：可以是表达式也可以代码块，是函数式接口里方法的实现。代码块可返回一个值或者什么都不反回，这里的代码块块等同于方法的方法体。如果是表达式，也可以返回一个值或者什么都不反回。

```java
// 1. 不需要参数,返回值为 2
() -> 2

// 2. 接收一个参数(数字类型),返回其2倍的值
x -> 2 * x

// 3. 接受2个参数(数字),并返回他们的和
(x, y) -> x + y

// 4. 接收2个int型整数,返回他们的乘积
(int x, int y) -> x * y

// 5. 接受一个 string 对象,并在控制台打印,不返回任何值(看起来像是返回void)
(String s) -> System.out.print(s)
```