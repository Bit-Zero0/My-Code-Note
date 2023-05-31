# 为什么需要Lambda 表达式
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
public class UseFunctionalProgramming {  
    public static void main(String[] args) {  
        new Thread(()->{  
                System.out.println("多线程任务执行!");  
        }).start();  
    }  
}
```

## Lambda 表达式的语法
基本语法: (parameters) -> expression 或 (parameters) ->{ statements; } 
Lambda表达式由三部分组成：
1. paramaters：类似方法中的形参列表，这里的参数是函数式接口里的参数。这里的参数类型可以明确的声明也可不声明而由JVM隐含的推断。另外当只有一个推断类型时可以省略掉圆括号`()`。
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


## 函数式接口
要了解Lambda表达式,首先需要了解什么是函数式接口，函数式接口定义：一个接口有且只有一个抽象方法 。

**注意：**
1. **如果一个接口只有一个抽象方法，那么该接口就是一个函数式接口**
2. 如果我们在某个接口上声明了 `@FunctionalInterface` 注解，那么编译器就会按照函数式接口的定义来要求该接口，这样如果有两个抽象方法，程序编译就会报错的。所以，从某种意义上来说，只要你保证你的接口中只有一个抽象方法，你可以不加这个注解。加上就会自动进行检测的。

定义方法:
```java
@FunctionalInterface
interface NoParameterNoReturn {
	//注意：只能有一个方法
	void test();
}
```


但是这种方式也是可以的：
```java
@FunctionalInterface
interface NoParameterNoReturn {
	void test();
	
	default void test2() {
		System.out.println("JDK1.8新特性，default默认方法可以有具体的实现");
	}
}
```

# Lambda 表达式的基本使用
首先，我们实现准备好几个接口：
```java
//无返回值无参数
@FunctionalInterface
interface NoParameterNoReturn {
	void test();
}

//无返回值一个参数
@FunctionalInterface
interface OneParameterNoReturn {
	void test(int a);
}

//无返回值多个参数
@FunctionalInterface
interface MoreParameterNoReturn {
	void test(int a,int b);
}

//有返回值无参数
@FunctionalInterface
interface NoParameterReturn {
	int test();
}

//有返回值一个参数
@FunctionalInterface
interface OneParameterReturn {
	int test(int a);
}

//有返回值多参数
@FunctionalInterface
interface MoreParameterReturn {
	int test(int a,int b);
}
```

我们在上面提到过，Lambda可以理解为：Lambda就是匿名内部类的简化，实际上是创建了一个类，实现了接口，重写了接口的方法 。

**没有使用lambda表达式的时候的调用方式 ：** (这里就只写其中一个)
```java
public class test {  
    public static void main(String[] args) {  
        NoParameterReturn noParameterReturn = new NoParameterReturn() {  
            @Override  
            public void test() {  
                System.out.println("hello");  
            }  
        };  

		noParameterReturn.test();
    }  
}
```

**使用 lambda 表达式的调用方法:**
```java
public class test {  
    public static void main(String[] args) {  
        NoParameterNoReturn noParameterNoReturn = ()->{  
            System.out.println("无参数无返回值");  
        };  
        noParameterNoReturn.test();  
  
        OneParameterNoReturn oneParameterNoReturn = (int a)->{  
            System.out.println("一个参数无返回值："+ a);  
        };  
        oneParameterNoReturn.test(10);  
  
        MoreParameterNoReturn moreParameterNoReturn = (int a,int b)->{  
            System.out.println("多个参数无返回值："+a+" "+b);  
        };  
        moreParameterNoReturn.test(20,30);  
  
        NoParameterReturn noParameterReturn = ()->{  
            System.out.println("有返回值无参数！");  
            return 40;  
        };  
        //接收函数的返回值  
        int ret = noParameterReturn.test();  
        System.out.println(ret);  
  
        OneParameterReturn oneParameterReturn = (int a)->{  
            System.out.println("有返回值有一个参数！");  
            return a;  
        };  
        ret = oneParameterReturn.test(50);  
        System.out.println(ret);  
        MoreParameterReturn moreParameterReturn = (int a,int b)->{  
            System.out.println("有返回值多个参数！");  
            return a+b;  
        };  
        ret = moreParameterReturn.test(60,70);  
        System.out.println(ret);  
    }  
}
```

## 语法精简
1. 参数类型可以省略，如果需要省略，每个参数的类型都要省略。
2. 参数的小括号里面只有一个参数，那么小括号可以省略
3. 如果方法体当中只有一句代码，那么大括号可以省略
4. 如果方法体中只有一条语句，且是return语句，那么大括号可以省略，且去掉return关键字。

```java
public class test {  
    public static void main(String[] args) {  
        MoreParameterNoReturn moreParameterNoReturn = ( a, b)->{  
            System.out.println("无返回值多个参数，省略参数类型："+a+" "+b);  
        };  
        moreParameterNoReturn.test(20,30);  
        
        OneParameterNoReturn oneParameterNoReturn = a ->{  
            System.out.println("无参数一个返回值,小括号可以省略："+ a);  
        };  
        oneParameterNoReturn.test(10);  
        
        NoParameterNoReturn noParameterNoReturn = ()->System.out.println("无参数无返回值，方法体中只有一行代码");  
        noParameterNoReturn.test();  
        
        //方法体中只有一条语句，且是return语句  
        NoParameterReturn noParameterReturn = ()-> 40;  
        int ret = noParameterReturn.test();  
        System.out.println(ret);  
    }  
}
```

# 变量捕获
Lambda 表达式中存在变量捕获 ，了解了变量捕获之后，我们才能更好的理解Lambda 表达式的作用域 。Java当中的匿名类中，会存在变量捕获。

## 匿名内部类
匿名内部类就是没有名字的内部类 。我们这里只是为了说明变量捕获，所以，匿名内部类只要会使用就好，那么下面我们来，简单的看看匿名内部类的使用就好了。

具体想详细了解的同学戳这里：[[类和对象#匿名内部类|匿名内部类]]

我们通过简单的代码来学习一下：
```java
class Test{  
    public void func(){  
        System.out.println("func()");  
    }  
}  
  
public class test {  
    public static void main(String[] args) {  
        new Test(){  
            @Override  
            public void func() {  
                System.out.println("我是内部类，且重写了func这个方法！");  
            }  
        };  
    }  
}
```
在上述代码当中的main函数当中，我们看到的就是一个匿名内部类的简单的使用。

## 匿名内部类的变量捕获
```java
class Test{  
    public void func(){  
        System.out.println("func()");  
    }  
}  
  
  
public class TestDemo {  
    public static void main(String[] args) {  
        int a = 100;  
        Test t= new Test(){  
            @Override  
            public void func() {  
                System.out.println("我是内部类，且重写了func这个方法！");  
                System.out.println("我是捕获到变量 a == "+ a +" 我是一个常量，或者是一个没有改变过值的变量！");  
            }  
        };  
        t.func();  
    }  
}
```
在上述代码当中的变量`a`就是，捕获的变量。这个变量要么是被`final`修饰，如果不是被`final`修饰的 你要保证在使用之前，没有修改。如下代码就是错误的代码。
```java
class Test{  
    public void func(){  
        System.out.println("func()");  
    }  
}  
  
  
public class TestDemo {  
    public static void main(String[] args) {  
        int a = 100;  
        Test t= new Test(){  
            @Override  
            public void func() {  
	            int a = 66; //这里进行了修改
                System.out.println("我是内部类，且重写了func这个方法！");  
                System.out.println("我是捕获到变量 a == "+ a +" 我是一个常量，或者是一个没有改变过值的变量！");  
            }  
        };  
        t.func();  
    }  
}
```
该代码直接编译报错。


## Lambda的变量捕获
在Lambda当中也可以进行变量的捕获，具体我们看一下代码。
```java
interface Test{   // 这里改为了 interface 接口
    void func();  
}  
  
  
public class TestDemo {  
    public static void main(String[] args) {  
        int a = 100;  
        Test test = ()-> {  
                System.out.println("我是lambda表达式，且重写了func这个方法！");  
                System.out.println("我是捕获到变量 a == "+ a +" 我是一个常量，或者是一个没有改变过值的变量！");  
        };  
  
        test.func();  
    }  
}
```


# Lambda 在集合中的使用
为了能够让Lambda和Java的集合类集更好的一起使用，集合当中，也新增了部分接口，以便与Lambda表达式对
接。

|对应的接口 | 新增的方法|
|:-:|:--|
|Collection | `removeIf()` `spliterator()` `stream()` `parallelStream()` `forEach()` 
|List | `replaceAll()` `sort()`|
|Map |`getOrDefault()` `forEach()` `replaceAll()` `putIfAbsent()` `remove()` `replace()` `computeIfAbsent()` `computeIfPresent()` `compute()` `merge()`|
以上方法的作用可自行查看我们发的帮助手册。我们这里会示例一些方法的使用。注意：Collection的`forEach()`方法是从接口 `java.lang.Iterable` 拿过来的。


## Collection 接口
`forEach()` 方法演示
该方法在接口 `Iterable` 当中，原型如下：
```java
default void forEach(Consumer<? super T> action) {
	Objects.requireNonNull(action);
	for (T t : this) {
		action.accept(t);
	}
}
```


该方法表示：对容器中的每个元素执行action指定的动作 。
```java
public class TestDemo {  
    public static void main(String[] args) {  
        ArrayList<String> list = new ArrayList<>();  
        list.add("Hello");  
        list.add("bit-zero");  
        list.add("hello");  
        list.add("lambda");  
        list.forEach(new Consumer<String>(){  
            @Override  
            public void accept(String str){  
                //简单遍历集合中的元素。  
                System.out.print(str+" ");  
            }  
        });  
    }  
}
```

输出结果：`Hello bit-zero hello lambda`

我们可以修改为如下代码：
```java
public class TestDemo {  
    public static void main(String[] args) {  
        ArrayList<String> list = new ArrayList<>();  
        list.add("Hello");  
        list.add("bit-zero");  
        list.add("hello");  
        list.add("lambda");  
        
        //表示调用一个，不带有参数的方法，其执行花括号内的语句，为原来的函数体内容。
        list.forEach(s-> System.out.print(s + ' '));  
    }  
}
```
输出结果：`Hello bit-zero hello lambda`


## List接口
**`sort()`方法的演示**
sort方法源码：该方法根据c指定的比较规则对容器元素进行排序。
```java
public void sort(Comparator<? super E> c) {
	final int expectedModCount = modCount;
	Arrays.sort((E[]) elementData, 0, size, c);
	if (modCount != expectedModCount) {
		throw new ConcurrentModificationException();
	}
	modCount++;
}
```

使用示例:
```java
public class TestDemo {  
    public static void main(String[] args) {  
        ArrayList<String> list = new ArrayList<>();  
        list.add("Hello");  
        list.add("bit-zero");  
        list.add("hello");  
        list.add("lambda");  
        list.sort(new Comparator<String>() {  
            @Override  
            public int compare(String str1, String str2){  
                //注意这里比较长度  
                return str1.length()-str2.length();  
            }  
        });  
        System.out.println(list);  
    }  
}
```


修改为lambda表达式：
```java
public class TestDemo {  
    public static void main(String[] args) {  
        ArrayList<String> list = new ArrayList<>();  
        list.add("Hello");  
        list.add("bit-zero");  
        list.add("hello");  
        list.add("lambda");  
        
        //调用带有2个参数的方法，且返回长度的差值  
        list.sort((str1 , str2)->str1.length() - str2.length());  
        System.out.println(list);  
    }  
}
```


## Map接口
HashMap 的`forEach()`
该方法原型如下：
```java
default void forEach(BiConsumer<? super K, ? super V> action) {
	Objects.requireNonNull(action);
	for (Map.Entry<K, V> entry : entrySet()) {
		K k;
		V v;
		try {
			k = entry.getKey();
			v = entry.getValue();
		} catch(IllegalStateException ise) {
			// this usually means the entry is no longer in the map.
			throw new ConcurrentModificationException(ise);
		}
		action.accept(k, v);
	}
}
```
作用是对Map中的每个映射执行action指定的操作。

代码示例：
```java
public class TestDemo {  
    public static void main(String[] args) {  
        HashMap<Integer, String> map = new HashMap<>();  
        map.put(1, "hello");  
        map.put(2, "bit-zero");  
        map.put(3, "hello");  
        map.put(4, "lambda");  
        map.forEach(new BiConsumer<Integer, String>(){  
            @Override  
            public void accept(Integer k, String v){  
                System.out.println(k + "=" + v);  
            }  
        });  
    }  
}
```

使用lambda表达式后的代码：
```java
public class TestDemo {  
    public static void main(String[] args) {  
        HashMap<Integer, String> map = new HashMap<>();  
        map.put(1, "hello");  
        map.put(2, "bit-zero");  
        map.put(3, "hello");  
        map.put(4, "lambda");  
        map.forEach((k ,v)-> System.out.println(k + "=" + v));  
    }  
}
```


# 总结
Lambda表达式的优点很明显，在代码层次上来说，使代码变得非常的简洁。缺点也很明显，代码不易读。

==**优点：**==
1. 代码简洁，开发迅速
2. 方便函数式编程
3. 非常容易进行并行计算
4. Java 引入 Lambda，改善了集合操作

==**缺点：**==
1. 代码可读性变差
2. 在非并行计算中，很多计算未必有传统的 for 性能要高
3. 不容易进行调试

