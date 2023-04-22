Object是Java默认提供的一个类。Java里面除了Object类，所有的类都是存在继承关系的。默认会继承Object父类。即所有类的对象都可以使用Object的引用进行接收。

**范例：使用Object接收所有类的对象**
```java
class Person{}
class Student{}

public class Test {
	public static void main(String[] args) {
		function(new Person());
		function(new Student());
	}
	
	public static void function(Object obj) {
		System.out.println(obj);
	}
}
```

执行结果
```
Person@1b6d3586
Student@4554617c
```

所以在开发之中，Object类是参数的最高统一类型。但是Object类也存在有定义好的一些方法。如下：
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230422151823.png)
对于整个Object类中的方法需要实现全部掌握。
本小节当中，我们主要来熟悉这几个方法：`toString()`方法，`equals()`方法，`hashcode()`方法

# 获取对象信息
如果要打印对象中的内容，可以直接重写Object类中的`toString()`方法，之前已经讲过了
```java
public String toString() {
	return getClass().getName() + "@" + Integer.toHexString(hashCode());
}
```


# 对象比较equals方法
在Java中，`==`进行比较时：
1. 如果`==`左右两侧是基本类型变量，比较的是变量中值是否相同
2. 如果`==`左右两侧是引用类型变量，比较的是引用变量地址是否相同
3. 如果要比较对象中内容，必须重写Object中的equals方法，因为equals方法默认也是按照地址比较的：

```java
// Object类中的equals方法
public boolean equals(Object obj) {
	return (this == obj); // 使用引用中的地址直接来进行比较
}
```

```java
class Person{  
    private  String name;  
    private int age;  
  
    public Person(String name , int age){  
        this.age = age;  
        this.name = name;  
    }  
}  
  
  
public class Test {  
    public static void main(String[] args) {  
        Person p1 = new Person("fmy", 20) ;  
        Person p2 = new Person("fmy", 20) ;  
        int a = 10;  
        int b = 10;  
        System.out.println(a == b); // 输出true  
        System.out.println(p1 == p2); // 输出false  
        System.out.println(p1.equals(p2)); // 输出false  
    }  
}
```

看以上代码,如果我们要认为 p1 和 p2 是同一个人, 我们应该怎么做? ==Student类重写equals方法后，然后比较==
```java
class Person{  
    private  String name;  
    private int age;  
  
    public Person(String name , int age){  
        this.age = age;  
        this.name = name;  
    }  
  
    @Override  
    public boolean equals(Object o) {   //重写equals方法
        if(o == null) return false;  
        if (this == o) return true;  

		// 不是Person类对象
        if(!(o instanceof Person)){  
            return false;  
        }  
  
        Person person = (Person) o;  // 向下转型，比较属性值
        return this.name.equals(person.name) && this.age == person.age;  
    }  
}  
  
  
public class Test {  
    public static void main(String[] args) {  
        Person p1 = new Person("fmy", 20) ;  
        Person p2 = new Person("fmy", 20) ;  
        int a = 10;  
        int b = 10;  
        System.out.println(a == b); // 输出true  
        System.out.println(p1 == p2); // 输出false  
        System.out.println(p1.equals(p2)); // 输出true
    }  
}
```



# hashcode方法
回忆刚刚的toString方法的源码：
```java
public String toString() {
	return getClass().getName() + "@" + Integer.toHexString(hashCode());
}
```
我们看到了`hashCode()`这个方法，他帮我算了一个具体的对象位置存在，这里面涉及数据结构，但是我们还没学数据结构，没法讲述，所以我们只能说它是个内存地址。然后调用Integer.toHexString()方法，将这个地址以16进制输出。

hashcode方法源码：
```java
public native int hashCode();
```
该方法是一个native方法，底层是由C/C++代码写的。我们看不到。
我们认为两个名字相同，年龄相同的对象，将存储在同一个位置，如果不重写`hashcode()`方法，我们可以来看示例代码：
```java
class Person {
	public String name;
	public int age;
	
	public Person(String name, int age) {
		this.name = name;
		this.age = age;
	}
}

public class TestDemo4 {
	public static void main(String[] args) {
		Person per1 = new Person("fmy", 20) ;
		Person per2 = new Person("fmy", 20) ;
		System.out.println(per1.hashCode());
		System.out.println(per2.hashCode());
	}
}
```

执行结果
```
990368553
1096979270
```

注意事项：两个对象的hash值不一样。
像重写equals方法一样，我们也可以重写`hashcode()`方法。此时我们再来看看。
```java
class Person {  
    public String name;  
    public int age;  
    public Person(String name, int age) {  
        this.name = name;  
        this.age = age;  
    }  
      
  
    @Override  
    public int hashCode() {  
        return Objects.hash(name, age);  
    }  
}  
  
public class Test {  
    public static void main(String[] args) {  
        Person per1 = new Person("fmy", 20) ;  
        Person per2 = new Person("fmy", 20) ;  
        System.out.println(per1.hashCode());  
        System.out.println(per2.hashCode());  
    }  
}
```

执行结果 : 此时哈希值一样
```
3148163
3148163
```

==**结论：**==
>1. `hashcode()`方法用来确定对象在内存中存储的位置是否相同
>2. 事实上`hashCode()` 在散列表中才有用，在其它情况下没用。在散列表中`hashCode()` 的作用是获取对象的散列码，进而确定该对象在散列表中的位置。


# 接收引用数据类型
**在之前已经分析了Object可以接收任意的对象，因为Object是所有类的父类，但是Obejct并不局限于此，它可以接收所有数据类型，包括：类、数组、接口。**

## 使用Object来接受数组对象
```java
public static void main(String[] args) {
	// Object接收数组对象，向上转型
	Object obj = new int[]{1,2,3,4,5,6} ;
	
	// 向下转型，需要强转
	int[] data = (int[]) obj ;
	for(int i :data){
		System.out.println(i+"、");
	}
}
```
而Object可以接收接口是Java中的强制要求，因为接口本身不能继承任何类。

## 使用Object接收接口对象
```java
interface IMessage {  
    public void getMessage() ;  
}  

class MessageImpl implements IMessage {  
    @Override  
    public String toString() {  
        return "I am small biter" ;  
    }  
    public void getMessage() {  
        System.out.println("比特欢迎你");  
    }  
}  

public class Test {  
    public static void main(String[] args) {  
        IMessage msg = new MessageImpl(); // 子类向父接口转型  
        Object obj = msg; // 接口向Obejct转型  
        System.out.println(obj);  
        IMessage temp = (IMessage) obj; // 强制类型转换  
        temp.getMessage();  
    }  
}
```
Object真正达到了参数的统一，如果一个类希望接收所有的数据类型，就是用Object完成，在Java中，泛型就是底层就是通过Object来实现的。