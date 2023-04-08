
先说结论: **java 只有==值传递==, 没有==引用传递==**

# 形参与实参
我们先来重温一组语法：

> 1.  **形参**：方法被调用时需要传递进来的参数，如：func(int a)中的a，它只有在func被调用期间a才有意义，也就是会被分配内存空间，在方法func执行完成后，a就会被销毁释放空间，也就是不存在了
> 2.  **实参**：方法被调用时是传入的实际值，它在方法被调用前就已经被初始化并且在方法被调用时传入。

看以下代码:
```java
public static void func(int a){
	a=20;
	System.out.println(a);
}
public static void main(String[] args) {
	int a=10;//实参
	func(a);
	System.out.println(a);
}
```

运行结果:
```
20
10
```

`int a=10;`中的`a`在被调用之前就已经创建并初始化，在调用`func`方法时，他被当做参数传入，所以这个`a`是实参。  

`func(int a)`中的`a`只有在`func`被调用时它的生命周期才开始，而在`func`调用结束之后，它也随之被JVM释放掉，所以这个`a`是形参。

而且 `a` 是一个Java数据类型中的基本类型 , 被存储在 栈 上 , 当传递进入 `func`方法时 , 其实是复制一份 `a` 传入`func`方法中.

# Java数据类型
![[Java的数据类型]]
有了数据类型，JVM对程序数据的管理就规范化了，不同的数据类型，它的存储形式和位置是不一样的，要想知道JVM是怎么存储各种类型的数据，就得先了解JVM的内存划分以及每部分的职能。


# JVM内存的划分及职能
Java语言本身是不能操作内存的，它的一切都是交给JVM来管理和控制的，因此Java内存区域的划分也就是JVM的区域划分，在说JVM的内存划分之前，我们先来看一下Java程序的执行过程，如下图：
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230407134217.png)
上图可以看出：Java代码被编译器编译成字节码之后，JVM开辟一片内存空间（也叫运行时数据区），通过类加载器加到到运行时数据区来存储程序执行期间需要用到的数据和相关信息，在这个数据区中，它由以下几部分组成：
>1. 虚拟机栈
>2. 堆
>3. 程序计数器
>4. 方法区
>5. 本地方法栈

我们接着来了解一下每部分的原理以及具体用来存储程序执行过程中的哪些数据。

##  虚拟机栈
虚拟机栈是Java方法执行的内存模型，栈中存放着栈帧，每个栈帧分别对应一个被调用的方法，方法的调用过程对应栈帧在虚拟机中入栈到出栈的过程。

栈是线程私有的，也就是线程之间的栈是隔离的；当程序中某个线程开始执行一个方法时就会相应的创建一个栈帧并且入栈（位于栈顶），在方法结束后，栈帧出栈。

下图表示了一个Java栈的模型以及栈帧的组成：
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230407134445.png)
**栈帧**:是用于支持虚拟机进行方法调用和方法执行的数据结构，它是虚拟机运行时数据区中的虚拟机栈的栈元素。

每个栈帧中包括：
1.  **局部变量表**:用来存储方法中的局部变量（非静态变量、函数形参）。当变量为基本数据类型时，直接存储值，当变量为引用类型时，存储的是指向具体对象的引用。
2.  **操作数栈**:Java虚拟机的解释执行引擎被称为"基于栈的执行引擎"，其中所指的栈就是指操作数栈。
3.  **指向运行时常量池的引用**:存储程序执行时可能用到常量的引用。
4.  **方法返回地址**:存储方法执行完成后的返回地址。


## 堆
堆是用来存储**对象**本身和**数组**的，在JVM中只有一个堆，因此，堆是被所有线程共享的。


## 方法区
方法区是一块所有线程共享的内存逻辑区域，在JVM中只有一个方法区，用来存储一些线程可共享的内容，它是线程安全的，多个线程同时访问方法区中同一个内容时，只能有一个线程装载该数据，其它线程只能等待。

方法区可存储的内容有：类的全路径名、类的直接超类的权全限定名、类的访问修饰符、类的类型（类或接口）、类的直接接口全限定名的有序列表、常量池（字段，方法信息，静态变量，类型引用（class））等。


## 本地方法栈
本地方法栈的功能和虚拟机栈是基本一致的，并且也是线程私有的，它们的区别在于虚拟机栈是为执行Java方法服务的，而本地方法栈是为执行本地方法服务的。

**有人会疑惑：什么是本地方法？为什么Java还要调用本地方法？**



## 程序计数器
线程私有的。  
记录着当前线程所执行的字节码的行号指示器，在程序运行过程中，字节码解释器工作时就是通过改变这个计数器的值来选取下一条需要执行的字节码指令，分支、循环、异常处理、线程恢复等基础功能都需要依赖计数器完成。


# 数据如何在内存中存储

## 基本数据类型的局部变量
定义基本数据类型的局部变量以及数据都是直接存储在内存中的栈上，也就是前面说到的**“虚拟机栈”**，数据本身的值就是存储在栈空间里面。
```java
int age=50;
int weight=50;
int grade=6;
```

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230407135256.png)

首先JVM创建一个名为`age`的变量，存于局部变量表中，然后去栈中查找是否存在有字面量值为50的内容，如果有就直接把`age`指向这个地址，如果没有，JVM会在栈中开辟一块空间来存储“50”这个内容，并且把`age`指向这个地址。因此我们可以知道：  
**我们声明并初始化基本数据类型的局部变量时，变量名以及字面量值都是存储在栈中，而且是真实的内容。**

我们再来看`“int weight=50`；”，按照刚才的思路：字面量为50的内容在栈中已经存在，因此`weight`是直接指向这个地址的。由此可见：**栈中的数据在当前线程下是共享的**。


那么如果再执行下面的代码呢？
```
weight=40；
```

当代码中重新给weight变量进行赋值时，JVM会去栈中寻找字面量为40的内容，发现没有，就会开辟一块内存空间存储40这个内容，并且把weight指向这个地址。由此可知：

**基本数据类型的数据本身是不会改变的，当局部变量重新赋值时，并不是在内存中改变字面量内容，而是重新在栈中寻找已存在的相同的数据，若栈中不存在，则重新开辟内存存新数据，并且把要重新赋值的局部变量的引用指向新数据所在地址。**


## 基本数据类型的成员变量
成员变量：顾名思义，就是在类体中定义的变量。  
看下图：
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230407135623.png)

我们看per的地址指向的是堆内存中的一块区域，我们来还原一下代码：
```java
public class Person{
	  private int age;
	  private String name;
	  private int grade;
	//篇幅较长，省略setter getter方法
	  static void run(){
	     System.out.println("run...."); 
	   };
}

//调用
Person per=new Person();
```
同样是局部变量的age、name、grade却被存储到了堆中为`per`对象开辟的一块空间中。因此可知：**基本数据类型的成员变量名和值都存储于==堆==中，其生命周期和对象的是一致的。**

# 值传递和引用传递

## 值传递
前面已经介绍过形参和实参，也介绍了数据类型以及数据在内存中的存储形式，接下来，就是文章的主题：值传递和引用的传递。
> **值传递：**  
> 在方法被调用时，实参通过形参把它的内容副本传入方法内部，此时形参接收到的内容是实参值的一个拷贝，因此在方法内对形参的任何操作，都仅仅是对这个副本的操作，不影响原始值的内容。

来看个例子：
```java
public static void valueCrossTest(int age,float weight){
    System.out.println("传入的age："+age);
    System.out.println("传入的weight："+weight);
    age=33;
    weight=89.5f;
    System.out.println("方法内重新赋值后的age："+age);
    System.out.println("方法内重新赋值后的weight："+weight);
    }

//测试
public static void main(String[] args) {
        int a=25;
        float w=77.5f;
        valueCrossTest(a,w);
        System.out.println("方法执行后的age："+a);
        System.out.println("方法执行后的weight："+w);
}
```

输出结果：

```
传入的age：25
传入的weight：77.5

方法内重新赋值后的age：33
方法内重新赋值后的weight：89.5

方法执行后的age：25
方法执行后的weight：77.5
```
从上面的打印结果可以看到：
a和w作为实参传入valueCrossTest之后，无论在方法内做了什么操作，最终a和w都没变化。

我们根据上面学到的知识点，进行详细的分析：
>首先程序运行时，调用`mian()`方法，此时JVM为`main()`方法往虚拟机栈中压入一个栈帧，即为当前栈帧，用来存放`main()`中的局部变量表(包括参数)、操作栈、方法出口等信息，如a和w都是`mian()`方法中的局部变量，因此可以断定，a和w是躺着mian方法所在的栈帧中.

如图:
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230407140248.png)

而当执行到`valueCrossTest()`方法时，JVM也为其往虚拟机栈中压入一个栈，即为当前栈帧，用来存放`valueCrossTest()`中的局部变量等信息，因此age和weight是躺着valueCrossTest方法所在的栈帧中，而**他们的值是从a和w的值copy了一份副本而得**，如图：
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230407140318.png)

因而可以a和age、w和weight对应的内容是不一致的，所以当在方法内重新赋值时，实际流程如图：
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230407140433.png)
也就是说，age和weight的改动，只是改变了当前栈帧（valueCrossTest方法所在栈帧）里的内容，当方法执行结束之后，这些局部变量都会被销毁，mian方法所在栈帧重新回到栈顶，成为当前栈帧，再次输出a和w时，依然是初始化时的内容。  
因此：  
**值传递传递的是真实内容的一个副本，对副本的操作不影响原内容，也就是形参怎么变化，不会影响实参对应的内容。**




## 引用传递
”引用”也就是指向真实内容的地址值，在方法调用时，实参的地址通过方法调用被传递给相应的形参，在方法体内，形参和实参指向通愉快内存地址，对形参的操作会影响的真实内容。

举个栗子：
先定义一个对象：

```java
public class Person {
        private String name;
        private int age;

        public String getName() {
            return name;
        }
        public void setName(String name) {
            this.name = name;
        }
        public int getAge() {
            return age;
        }
        public void setAge(int age) {
            this.age = age;
        }
}
```

我们写个函数测试一下：
```java
public static void PersonCrossTest(Person person){
        System.out.println("传入的person的name："+person.getName());
        person.setName("我是张小龙");
        System.out.println("方法内重新赋值后的name："+person.getName());
    }
//测试
public static void main(String[] args) {
        Person p=new Person();
        p.setName("我是马化腾");
        p.setAge(45);
        PersonCrossTest(p);
        System.out.println("方法执行后的name："+p.getName());
}
```

输出结果：
```
传入的person的name：我是马化腾
方法内重新赋值后的name：我是张小龙
方法执行后的name：我是张小龙
```

可以看出，`person`经过`personCrossTest()`方法的执行之后，内容发生了改变，这印证了上面所说的“**引用传递**”，对形参的操作，改变了实际对象的内容。

但是 "引用传递" 并不是那么简单

下面我们对上面的例子稍作修改，加上一行代码，
```java
public static void PersonCrossTest(Person person){
        System.out.println("传入的person的name："+person.getName());
        person=new Person();//加多此行代码
        person.setName("我是张小龙");
        System.out.println("方法内重新赋值后的name："+person.getName());
    }
```

输出结果：
```
传入的person的name：我是马化腾
方法内重新赋值后的name：我是张小龙
方法执行后的name：我是马化腾
```

为什么这次的输出和上次的不一样了呢？
看出什么问题了吗？

按照上面讲到JVM内存模型可以知道，对象和数组是存储在Java堆区的，而且堆区是共享的，因此程序执行到`main()`方法中的下列代码时

```
Person p=new Person();
        p.setName("我是马化腾");
        p.setAge(45);
        PersonCrossTest(p);
```

JVM会在堆内开辟一块内存，用来存储p对象的所有内容，同时在`main()`方法所在线程的栈区中创建一个引用p存储堆区中p对象的真实地址，如图：
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230407141531.png)
当执行到`PersonCrossTest()`方法时，因为方法内有这么一行代码：
`person=new Person();`
JVM需要在堆内另外开辟一块内存来存储`new Person()`，假如地址为“0x3333”，那此时形参person指向了这个地址，假如真的是引用传递，那么由上面讲到：**引用传递中形参实参指向同一个对象，形参的操作会改变实参对象的改变**。

可以推出：实参也应该指向了新创建的`person`对象的地址，所以在执行`PersonCrossTest()`结束之后，最终输出的应该是后面创建的对象内容。

然而实际上，最终的输出结果却跟我们推测的不一样，最终输出的仍然是一开始创建的对象的内容。

**由此可见：引用传递，在Java中并不存在。**

但是有人会疑问：为什么第一个例子中，在方法内修改了形参的内容，会导致原始对象的内容发生改变呢？

这是因为：无论是基本类型和是引用类型，在实参传入形参时，都是值传递，也就是说传递的都是一个副本，而不是内容本身。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230407141927.png)
**由图可以看出，方法内的形参person和实参p并无实质关联，它只是由p处copy了一份指向对象的地址**，此时： **p和person都是指向同一个对象**。

因此在第一个例子中，对形参p的操作，会影响到实参对应的对象内容。而在第二个例子中，当执行到new Person()之后，JVM在堆内开辟一块空间存储新对象，并且把person改成指向新对象的地址，此时：

**p依旧是指向旧的对象，person指向新对象的地址。**

所以此时**对person的操作，实际上是对新对象的操作，于实参p中对应的对象毫无关系**。

# 结语
- Java 中不存在引用传递, 只有值传递 .
- 基本类型进行传递时, 是把栈上的数据拷贝一份, 然后传递给形参, 修改时并不会对实参造成影响.
- 引用类型进行传递时,不过是把栈上的引用复制一份 ,然后传递给形参 . 此时形参即可通过该引用对堆上的数据进行使用.


## 参考资料
[这一次，彻底解决Java的值传递和引用传递 - 个人文章 - SegmentFault 思否](https://segmentfault.com/a/1190000016773324)
[【每天一个技术点】Java到底是值传递还是引用传递？_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1q34y1s72a/)