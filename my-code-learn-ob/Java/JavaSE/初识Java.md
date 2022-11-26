# 初识Java的main方法

## main方法示例
```java
public class HelloWorld{
	public static void main(String[] args){ 
		System.out.println("Hello,world");
	} 
}
```
如上展示的就是最简单的一个Java程序，可能同学们看到后一头雾水，可以说，Java的main方法应该是当前主流编程语言中最“长”的。
通过上述代码，我们可以看到一个完整的Java程序的结构，Java程序的结构由如下三个部分组成：
> 1. 源文件（扩展名为*.java)：源文件带有类的定义。类用来表示程序的一个组件，小程序或许只会有一个类。 类的内容必须包含在花括号里面。
> 2. 类：类中带有一个或多个方法。方法必须在类的内部声明。
> 3. 方法：在方法的花括号中编写方法应该执行的语句。
>总结一下：类存在于源文件里面；方法存在于类中；语句存在于方法中。

**注意：在一个源文件中只能有一个`public`修饰的类，而且源文件名字必须与`public`修饰的类名字相同。** 
好了，代码编写完了，如何让它“运行”起来呢？


## 运行Java程序
Java是一门半编译型、半解释型语言。先通过javac编译程序把源文件进行编译，编译后生成的.class文件是由字节码组成的平台无关、面向JVM的文件。最后启动java虚拟机来运行.class文件，此时JVM会将字节码转换成平台能够理解的形式来运行。
![[Pasted image 20221125231325.png]]
注意：在运行Java程序前，必须先安装好JDK( Java Development Kit即Java开发工具包)，JDK里面就包含了javac和java工具，Java程序最终是在JVM( Java虚拟机)中运行的。

>==【面试题】JDK、JRE、JVM之间的关系？==
>- **JDK**( Java Development Kit):Java开发工具包，提供给Java程序员使用，包含了JRE，同时还包含了编译器javac与自带的调试工具Jconsole、jstack等。
>- **JRE**( Java Runtime Environment):Java运行时环境，包含了JVM，Java基础类库。是使用Java语言编写程序运行的所需环境。
>- **JVM**：Java虚拟机，运行Java代码
>![[Pasted image 20221125231527.png]]

编写和运行第一个Java程序时，可能会遇到的一些错误：
1. 源文件名后缀不是`.java`
2. 类名与文件名不一致
3. main方法名字写错：mian
4. 类没有使用`public`修饰
5. 方法中语句没有以分号结尾
6. 中文格式的分号
7. JDK环境没有配置好，操作系统不能识别`javac`或者`java`命令


# 注释
Java中的注释主要分为以下三种
- 单行注释：`// 注释内容`（用的最多） 
- 多行注释：`/* 注释内容*/`（不推荐）
- 文档注释： `/** 文档注释 */`（常见于方法和类之上描述方法和类的作用)，可以被javadoc工具解析，生成一套以网页文件形式体现的程序说明文档

注意：
1. 多行注释不能嵌套使用
2. 不论是单行还是多行注释，都不参与编译，即编译之后生成的.class文件中不包含注释信息。

```java
/**
文档注释：
	@version v1.0.0 
	@author will
	作用HelloWorld类，入门第一个程序练习 
*/
public class HelloWorld{ 
	/*
		多行注释：
		1. main方法是Java程序的入口方法
		2. main函数的格式是固定的，必须为public static void main(String[] args) 
	*/

	/**
		main方法是程序的入口函数 
		@param args 命令行参数。 
	*/
   public static void main(String[] args){
   // 单行注释：System.out.println是Java中标准输出，会将内容输出到控制台 
   System.out.println("Hello World");
	} 
}
------------------------------------------------------------------------------------
// 在cmd中，使用javadoc工具从Java源码中抽离出注释 
// -d 创建目录         myHello为目录名
// -author 显示作者 
// -version 显示版本号
// -encoding UTF-8 -charset UTF-8 字符集修改为UTF-8
javadoc -d myHello -author -version -encoding UTF-8 -charset UTF-8 HelloWorld.java
```

## 注释规范
1. 内容准确: 注释内容要和代码一致, 匹配, 并在代码修改时及时更新.
2. 篇幅合理: 注释既不应该太精简, 也不应该长篇大论.
3. 使用中文: 一般中国公司都要求使用中文写注释, 外企另当别论.
4. 积极向上: 注释中不要包含负能量(例如  领导 SB 等).


# 标识符
在上述程序中，Test称为类名，main称为方法名，也可以将其称为标识符，即：**在程序中由用户给类名、方法名或者变量所取的名字。**

**【硬性规则】**
- **标识符中可以包含：字母、数字以及  下划线和 `$` 符号等等。**
- **注意：标识符不能以数字开头，也不能是关键字，且严格区分大小写。** 

**【软性建议】**
- 类名：每个单词的首字母大写(大驼峰)
- 方法名：首字母小写，后面每个单词的首字母大写(小驼峰) 
- 变量名：与方法名规则相同
一个大型的工程，是由多名工程师协同开发的，如果每个人都按照自己的方式随意取名，比如：`person`、`PERSON`、`Person`、`_person`，将会使程序非常混乱。如果大家在取名时能够遵守一定的约束(即规范)，那多人写除的代码仿佛一个人写的。

下面那些标识符是合法的？
A：class     B：HelloWorld       C：main         D：123abc       E：ARRAY_SIZE         F: $name         G: name:jim


# 关键字
通过观察上述程序可以发现，public、class以及static等颜色会发生变化，将这些具有特殊含义的标识符称为关键字。即：关键字是由Java语言提前定义好的，有特殊含义的标识符，或者保留字。

注意：用户不能使用关键字定义标识符。

在Java中关键字有很多，这里给大家列出来一部分，先了解下后序在逐一详细解释。
![[Pasted image 20221125232207.png]]
