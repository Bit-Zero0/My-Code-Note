
# Java中操作文件
本节内容中，我们主要涉及文件的元信息、路径的操作，暂时不涉及关于文件中内容的读写操作。
Java 中通过 java.io.File 类来对一个文件（包括目录）进行抽象的描述。注意，有 File 对象，并不
代表真实存在该文件。

## File 概述
我们先来看看 File 类中的常见属性、构造方法和方法


***属性***
|修饰符及类型 | 属性 | 说明 | 
|:--|:--|:--|
|static String | pathSeparator | 依赖于系统的路径分隔符，String 类型的表示|
|static char | pathSeparator | 依赖于系统的路径分隔符，char 类型的表示|


***构造方法***
|签名 | 说明|
|:--|:--|
|`File(File parent, Stringchild)` | 根据父目录 + 孩子文件路径，创建一个新的 File 实例|
|`File(String pathname)`|根据文件路径创建一个新的 File 实例，路径可以是绝对路径或者相对路径|
|`File(String parent, Stringchild)`| 根据父目录 + 孩子文件路径，创建一个新的 File 实例，父目录用 | 路径表示|


***方法***
| 方法签名和返回值 | 说明|
|:--|:--|
|`String getParent()`| 返回 File 对象的父目录文件路径|
|`String getName()`| 返回 FIle 对象的纯文件名称|
|`String getPath()`| 返回 File 对象的文件路径|
|`String getAbsolutePath()`| 返回 File 对象的绝对路径|
|`String getCanonicalPath()`| 返回 File 对象的修饰过的绝对路径|
|`boolean exists()`| 判断 File 对象描述的文件是否真实存在|
|`boolean isDirectory()`| 判断 File 对象代表的文件是否是一个目录|
|`boolean isFile()`| 判断 File 对象代表的文件是否是一个普通文件|
|`boolean createNewFile()`|  根据 File 对象，自动创建一个空文件。成功创建后返回 true|
|`boolean delete()`| 根据 File 对象，删除该文件。成功删除后返回 true|
|`void deleteOnExit()`|  根据 File 对象，标注文件将被删除，删除动作会到JVM 运行结束时才会进行|
|`String[] list`|() 返回 File 对象代表的目录下的所有文件名|
|`File[] listFiles`|() 返回 File 对象代表的目录下的所有文件，以 File 对象表示|
|`boolean mkdir()`| 创建 File 对象代表的目录|
|`boolean mkdirs()`| 创建 File 对象代表的目录，如果必要，会创建中间目录|
|`boolean renameTo(`|Filedest) 进行文件改名，也可以视为我们平时的剪切、粘贴操作|
|`boolean canRead()`| 判断用户是否对文件有可读权限|
|`boolean canWrite()`| 判断用户是否对文件有可写权限|


### 代码示例

#### 观察 get 系列的特点和差异
```java
public class IODemo1 {  
    public static void main(String[] args) throws IOException {  
        File file = new File("..\\hello-world.txt"); // 并不要求该文件真实存在  
        System.out.println(file.getParent());  
        System.out.println(file.getName());  
        System.out.println(file.getPath());  
        System.out.println(file.getAbsolutePath());  
        System.out.println(file.getCanonicalPath());  
    }  
}
```

运行结果: hello-world.txt文件之前的路径是我的路径, 这是根据个人的文件地址决定的.
```
..
hello-world.txt
..\hello-world.txt
S:\idea_data\test1\..\hello-world.txt
S:\idea_data\hello-world.txt
```


#### 普通文件的创建和删除
```java
public class IODemo2 {  
    public static void main(String[] args) throws IOException {  
        File file = new File("hello-world.txt");  
        System.out.println(file.exists());  
        System.out.println(file.isDirectory());  
        System.out.println(file.isFile());  
        System.out.println(file.createNewFile());  //此时文件才创建  
        System.out.println("----------------------------------");  
        System.out.println(file.exists());  
        System.out.println(file.isDirectory());  
        System.out.println(file.isFile());  
        System.out.println(file.createNewFile());  
    }  
}
```

运行结果:
```
false
false
false
true
----------------------------------
true
false
true
false
```


#### 普通文件的删除
```java
public class IODemo3 {  
    public static void main(String[] args) throws IOException {  
        File file = new File("some-file.txt");  
        System.out.println(file.exists());  
        System.out.println(file.createNewFile());  
        System.out.println(file.exists());  
        System.out.println(file.delete()); // 删除成功返回 true        System.out.println(file.exists());  
    }  
}
```

运行结果
```
false
true
true
true    //这个结果是file.delete返回的, 表示删除成功
false
```

#### 观察 deleteOnExit 的现象
`void deleteOnExit()` :  根据 File 对象，标注文件将被删除，删除动作会到JVM 运行结束时才会进行
```java
public class IODemo4 {  
    public static void main(String[] args) throws IOException {  
        File file = new File("some-file.txt");  
        System.out.println(file.exists());  
        System.out.println(file.createNewFile());  
        System.out.println(file.exists());  
        file.deleteOnExit();  
        System.out.println(file.exists());  
    }  
}
```

运行结果:   运行程序时, 文件确实还是存在的, 但是当程序结束, 文件就会被关闭且删除
```
false
true
true
true
```



#### 观察目录的创建
```java
public class IODemo5 {  
    public static void main(String[] args) {  
        File dir = new File("some-dir");  
        System.out.println(dir.isDirectory());  
        System.out.println(dir.isFile());  
        System.out.println(dir.mkdir());   // 创建文件夹,成功返回true
        System.out.println(dir.isDirectory());  
        System.out.println(dir.isFile());  
    }  
}
```

运行结果:
```
false
false
true
true
false
```


#### 递归创建目录
这是错误案例:
```java
public class IODemo6 {  
    public static void main(String[] args) {  
        File dir = new File("some-thing/some-dir ");  
        System.out.println(dir.isDirectory());  
        System.out.println(dir.isFile());  
        System.out.println(dir.mkdir());  
        System.out.println(dir.isDirectory());  
        System.out.println(dir.isFile());  
    }  
}
```
运行结果:
```
false
false
false
false
false
```

报错原因: `mkdir()` 的时候，如果中间目录不存在，则无法创建成功; `mkdirs()` 可以解决这个问题。
```java
public class IODemo6 {  
    public static void main(String[] args) {  
        File dir = new File("some-thing/some-dir ");  
        System.out.println(dir.isDirectory());  
        System.out.println(dir.isFile());  
        System.out.println(dir.mkdirs());  //这里更改为mkdirs()了
        System.out.println(dir.isDirectory());  
        System.out.println(dir.isFile());  
    }  
}
```

```
false
false
true
true
false
```


#### 观察文件重命名
创建一个文件 some-file.txt , 通过程序改名为 dest.txt  
```java
public class IODemo7 {  
    public static void main(String[] args) {  
        File file = new File("some-file.txt");// 要求 some-file.txt 得存在，可以是普通文件，可以是目录  
        File dest = new File("dest.txt"); // 要求 dest.txt 不存在  
        System.out.println(file.exists());  
        System.out.println(dest.exists());  
        System.out.println(file.renameTo(dest));  
        System.out.println(file.exists());  
        System.out.println(dest.exists());  
    }  
}
```

运行结果: 修改成功
```
true
false
true
false
true
```


# 文件内容的读写---数据流
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230511163027.png)

## InputStream 概述
***方法***
|修饰符及返回值类型| 方法签名| 说明|
|:-:|:--|:--|
|int| `read()`|  读取一个字节的数据，返回 -1 代表已经完全读完了 |
|int| `read(byte[] b)` | 最多读取 b.length 字节的数据到 b 中，返回实际读到的数量；-1 代表以及读完了
|int| `read(byte[] b, int off, int len)` | 最多读取 len - off 字节的数据到 b 中，放在从 off 开始，返回实际读到的数量；-1 代表以及读完了 |
|void| `close()` | 关闭字节流 |


***说明***
InputStream 只是一个抽象类，要使用还需要具体的实现类。关于 InputStream 的实现类有很多，基本可以认为不同的输入设备都可以对应一个 InputStream 类，我们现在只关心从文件中读取，所以使用**FileInputStream**


## FileInputStream 概述
### 构造方法

|签名 |说明|
|:-:|:--|
|`FileInputStream(File file)`| 利用 File 构造文件输入流|
|`FileInputStream(String name)`| 利用文件路径构造文件输入流|



### 代码示例

#### 使用FileInputStream读取文件内容
将文件完全读完的两种方式。相比较而言，后一种的 IO 次数更少，性能更好。

**需要先在项目目录下准备好一个 hello.txt 的文件，里面填充 "`hello`" 的内容**

第一种
```java
public class IODemo8 {  
    public static void main(String[] args) throws IOException {  
        try(InputStream is =  new FileInputStream("hello.txt")){  
             while(true) {  
                 int b = is.read();  
                 if(b == -1)  
                 {  
                     break;  
                 }  
                 System.out.printf("%x\n" , (byte)b);  
             }  
        }  
    }  
}
```

第二种
 这种的 IO 次数更少，性能更好 
```java
public class IODemo8 {  
    public static void main(String[] args) throws IOException {  
        try(InputStream is =  new FileInputStream("hello.txt")){  
            byte[] buf = new byte[1024];  
            int len;  
  
            while(true) {  
                 len = is.read(buf);//但是每次循环后, buf数组的内容会被重载为新内容
                 if(len == -1) // 代表文件全部读完  
                 {  
                     break;  
                 }  
  
                for (int i = 0; i < len; i++) {  
                    System.out.printf("%x\n" , (byte)buf[i]);  
                }  
            }  
        }  
    }  
}
```

#### 使用FileInputStream读取文件内容(中文版)
这里我们把文件内容中填充中文看看，注意，写中文的时候使用 UTF-8 编码。hello.txt 中填写 "`你好中国`"
注意：这里我利用了这几个中文的 UTF-8 编码后长度刚好是 3 个字节和长度不超过 1024 字节的现状，但这种方式并不是通用的
```java

```

















