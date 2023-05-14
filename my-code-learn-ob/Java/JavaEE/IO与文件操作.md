
# Java中操作文件
本节内容中，我们主要涉及文件的元信息、路径的操作，暂时不涉及关于文件中内容的读写操作。
Java 中通过 java.io.File 类来对一个文件（包括目录）进行抽象的描述。注意，有 File 对象，并不
代表真实存在该文件。

## File 概述
我们先来看看 File 类中的常见属性、构造方法和方法


***属性***
|修饰符及类型 | 属性 | 说明 | 
|:--|:--|:--|
|`static String` | `pathSeparator` | 依赖于系统的路径分隔符，String 类型的表示|
|`static char` | `pathSeparator` | 依赖于系统的路径分隔符，char 类型的表示|


***构造方法***
|签名 | 说明|
|:--|:--|
|`File(File parent, String child)` | 根据父目录 + 孩子文件路径，创建一个新的 File 实例|
|`File(String pathname)`|根据文件路径创建一个新的 File 实例，路径可以是绝对路径或者相对路径|
|`File(String parent, String child)`| 根据父目录 + 孩子文件路径，创建一个新的 File 实例，父目录用 | 路径表示|


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
|`String[] list()`| 返回 File 对象代表的目录下的所有文件名|
|`File[] listFiles()`|返回 File 对象代表的目录下的所有文件，以 File 对象表示|
|`boolean mkdir()`| 创建 File 对象代表的目录|
|`boolean mkdirs()`| 创建 File 对象代表的目录，如果必要，会创建中间目录|
|`boolean renameTo(Filedest)`| 进行文件改名，也可以视为我们平时的剪切、粘贴操作|
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

# IO流的原理及流的分类
`java.io`包下提供了各种“流”类和接口，用以获取不同种类的数据，并通过`标准的方法`输入或输出数据。
-   按==**数据的流向**==不同分为：**输入流**和**输出流**。
    -   **输入流** ：把数据从`其他设备`上读取到`内存`中的流。
        -   以InputStream、Reader结尾
            
    -   **输出流** ：把数据从`内存` 中写出到`其他设备`上的流。
        -   以OutputStream、Writer结尾


-   按==**操作数据单位**==的不同分为：**字节流（8bit）** 和 **字符流（16bit）**。    
    -   **字节流** ：以字节为单位，读写数据的流。
        -   以InputStream、OutputStream结尾
        
    -   **字符流** ：以字符为单位，读写数据的流。        
        -   以Reader、Writer结尾


-   根据==**IO流的角色**==不同分为：**节点流**和**处理流**。
	- **节点流**：直接从数据源或目的地读写数据
	    - ![image-20220412230745170.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/image-20220412230745170.png)

	- **处理流**：不直接连接到数据源或目的地，而是“连接”在已存在的流（节点流或处理流）之上，通过对数据的处理为程序提供更为强大的读写功能。
		- ![image-20220412230751461.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/image-20220412230751461.png)

## 流的API
Java的IO流共涉及40多个类，实际上非常规则，都是从如下4个抽象基类派生的。

| （抽象基类） |   输入流    |    输出流    |
| :----------: | :---------: | :----------: |
|    字节流    | InputStream | OutputStream |
|    字符流    |   Reader    |    Writer    |

![image-20220412230501953.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/image-20220412230501953.png)

### 常用的节点流
文件流： FileInputStream、FileOutputStrean、FileReader、FileWriter 

字节/字符数组流： ByteArrayInputStream、ByteArrayOutputStream、CharArrayReader、CharArrayWriter 
  * 对数组进行处理的节点流（对应的不再是文件，而是内存中的一个数组）。

# 字符流
## Reader与Writer

Java提供一些字符流类，以字符为单位读写数据，专门用于处理文本文件。不能操作图片，视频等非文本文件。

> 常见的文本文件有如下的格式：.txt、.java、.c、.cpp、.py等
> 
> 注意：.doc、.xls、.ppt这些都不是文本文件。

### 字符输入流：Reader
`java.io.Reader`抽象类是表示用于读取字符流的所有类的父类，可以读取字符信息到内存中。它定义了字符输入流的基本共性功能方法。

-   `public int read()`： 从输入流读取一个字符。 虽然读取了一个字符，但是会自动提升为int类型。返回该字符的Unicode编码值。如果已经到达流末尾了，则返回-1。
    
-   `public int read(char[] cbuf)`： 从输入流中读取一些字符，并将它们存储到字符数组 cbuf中 。每次最多读取cbuf.length个字符。返回实际读取的字符个数。如果已经到达流末尾，没有数据可读，则返回-1。
    
-   `public int read(char[] cbuf,int off,int len)`：从输入流中读取一些字符，并将它们存储到字符数组 cbuf中，从cbuf[off]开始的位置存储。每次最多读取len个字符。返回实际读取的字符个数。如果已经到达流末尾，没有数据可读，则返回-1。
    
-   `public void close()` ：关闭此流并释放与此流相关联的任何系统资源。
> 注意：当完成流的操作时，必须调用close()方法，释放系统资源，否则会造成内存泄漏。


### 字符输出流：Writer
`java.io.Writer`抽象类是表示用于写出字符流的所有类的超类，将指定的字符信息写出到目的地。它定义了字节输出流的基本共性功能方法。

-   `public void write(int c)` ：写出单个字符。
    
-   `public void write(char[] cbuf)`：写出字符数组。
    
-   `public void write(char[] cbuf, int off, int len)`：写出字符数组的某一部分。off：数组的开始索引；len：写出的字符个数。
    
-   `public void write(String str)`：写出字符串。
    
-   `public void write(String str, int off, int len)` ：写出字符串的某一部分。off：字符串的开始索引；len：写出的字符个数。
    
-   `public void flush()`：刷新该流的缓冲。
    
-   `public void close()` ：关闭此流。

> 注意：当完成流的操作时，必须调用`close()`方法，释放系统资源，否则会造成内存泄漏。


## FileReader 与 FileWriter
### FileReader
`java.io.FileReader`类用于读取字符文件，构造时使用系统默认的字符编码和默认字节缓冲区。
-   `FileReader(File file)`： 创建一个新的 FileReader ，给定要读取的File对象。
    
-   `FileReader(String fileName)`： 创建一个新的 FileReader ，给定要读取的文件的名称。

**举例：** 读取hello.txt文件中的字符数据，并显示在控制台上

***实现方法1:***
```java
public class IODemo {  
    public static void main(String[] args) throws IOException {  
        File file = new File("hello.txt");  //创建File类的对象，对应着物理磁盘上的某个文件

		 //创建FileReader流对象，将File类的对象作为参数传递到FileReader的构造器中
        FileReader fr = new FileReader(file);  

		 //通过相关流的方法，读取文件中的数据
        int data = 0;  
        while((data = fr.read()) != -1){  
            System.out.println((char) data);  
        }  
        
        fr.close();   //关闭相关的流资源，避免出现内存泄漏
    }  
}
```


***实现方式1.5：***
在方式1的基础上改进，使用`try()`处理异常。保证流是可以关闭的.
```java
public class IODemo {  
    public static void main(String[] args) throws IOException {  
        File file = new File("hello.txt");  
        try(FileReader fr = new FileReader(file)){  
            int data = 0;  
            while((data = fr.read()) != -1){  
                System.out.print((char) data);  
            }  
        }  
    }  
}
```

因为 FileReader 类实现了closeable接口 , 所以可以使用 `try()` 语法糖
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230514171323.png)
使用`try()`语法糖 , 必须要要我们的类实现了`Closeable`接口 , 当 try()中的数据执行完毕后,会自动调用 `close()` 方法回收资源.

在 `try()` 中可以放多条语句, 使用 `;` 进行分割.


***实现方法2:***
调用`read(char[] cbuf)`,每次从文件中读取多个字符
```java
public class IODemo {  
    public static void main(String[] args) throws IOException {  
        File file = new File("hello.txt");  
        try(FileReader fr = new FileReader(file)){  
            char[] buf = new char[5]; //通过相关流的方法，读取文件中的数据  
  
            int len;//记录每次读入的字符的个数  
            while((len = fr.read(buf)) != -1){  
                String str = new String(buf , 0 , len);  
                System.out.print(str);  
            }  
        }  
    }  
}
```

这种方法能减少大量的IO次数, 所有效率更高.



不同实现方式的类比：
![image-20220518095907714.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/image-20220518095907714.png)



### FileWriter
`java.io.FileWriter`类用于写出字符到文件，构造时使用系统默认的字符编码和默认字节缓冲区。
-   `FileWriter(File file)`： 创建一个新的 FileWriter，给定要读取的File对象。
    
-   `FileWriter(String fileName)`： 创建一个新的 FileWriter，给定要读取的文件的名称。
    
-   `FileWriter(File file,boolean append)`： 创建一个新的 FileWriter，指明是否在现有文件末尾追加内容。


***例子1:***
```java
public class IODemo {  
    public static void main(String[] args) throws IOException {  
        File file = new File("hello.txt");  
        try(FileWriter fw = new FileWriter(file)){  
            fw.write(97);  
            fw.write('b');  
            fw.write('c');  
            fw.write(3000);  
        }  
    }  
}
```



***例子2:***
```java
public class IODemo {  
    public static void main(String[] args) throws IOException {  
        File file = new File("hello.txt");  
        try(FileWriter fw = new FileWriter(file)){  
            char[] chars = "我爱中国".toCharArray();  
  
            // 写出字符数组  
            fw.write(chars); // 我爱中国  
  
            // 写出从索引1开始，3个字符  
            fw.write(chars , 1 ,3);//爱中国  
  
        }  
    }  
}
```


***例子3:***
```java
public class IODemo {  
    public static void main(String[] args) throws IOException {  
        File file = new File("hello.txt");  
        try(FileWriter fw = new FileWriter(file)){  
            String str = "I am Bit-zero";  
  
            fw.write(str); //I am Bit-zero  
  
            // 写出从索引1开始，3个字符  
            fw.write(str  , 1 , 3);// am  这里的结果包含了空格,所以确实是三个字符  
  
        }  
    }  
}
```


***例子4:***
```java
public class IODemo {  
    public static void main(String[] args) throws IOException {  
        File file = new File("hello.txt");  
        try(FileWriter fw = new FileWriter(file)){  
            String str = "I am Bit-zero";  
  
            fw.write("I love you,");  
            fw.write("you love him.");  
            fw.write("so sad".toCharArray());  
  
        }  
    }  
}
```

### 小结

对于输出流来说，File类的对象是可以不存在的。
-  如果File类的对象不存在，则可以在输出的过程中，自动创建File类的对象
-  如果File类的对象存在，
	- 如果调用FileWriter(File file)或FileWriter(File file,false)，输出时会新建File文件覆盖已有的文件
      - 如果调用FileWriter(File file,true)构造器，则在现有的文件末尾追加写出内容。



# 字节流
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
// 需要先在项目目录下准备好一个 hello.txt 的文件，里面填充 "你好" 的内容
public class IODemo8 {  
    public static void main(String[] args) throws IOException {  
        try(InputStream is =  new FileInputStream("hello.txt")){  
            byte[] buf = new byte[1024];  
            int len;  
  
            while(true) {  
                 len = is.read(buf);  
                 if(len == -1) // 代表文件全部读完  
                 {  
                     break;  
                 }  

				// 每次使用 3 字节进行 utf-8 解码，得到中文字符
				// 利用 String 中的构造方法完成
				// 这个方法了解下即可，不是通用的解决办法
                for (int i = 0; i < len; i+=3) {  
                    String s = new String(buf , i , 3 , "UTF-8");  
                    System.out.printf("%s\n" , s);  
                }  
            }  
        }  
    }  
}
```



## 利用 Scanner 进行字符读取
上述例子中，我们看到了对字符类型直接使用 InputStream 进行读取是非常麻烦且困难的，所以，我们使用一种我们之前比较熟悉的类来完成该工作，就是 Scanner 类。


|构造方法 | 说明|
|:--|:--|
|`Scanner(InputStream is, String charset) `|使用 charset 字符集进行 is 的扫描读取|
作用也就是相当于 **输出重定向** 一样

```java
// 需要先在项目目录下准备好一个 hello.txt 的文件，里面填充 "你好中国" 的内容  
public class IODemo9 {  
    public static void main(String[] args) {  
        try(InputStream is = new FileInputStream("hello.txt")){  
            try(Scanner scanner = new Scanner(is , "UTF-8")){   //相当于输出重定向
                while(scanner.hasNext()){  
                    String s = scanner.next();  
                    System.out.println(s);  
                }  
            }  
        }catch (IOException e) {  
            e.printStackTrace();  
        }  
    }  
}
```


## OutputStream 概述

### 方法
|修饰符及返回值类型 | 方法签名 | 说明|
|:--|:--|:--|
|`void` | `write(int b)`|写入要给字节的数据|
|`void` | `write(byte[]b)`| 将 b 这个字符数组中的数据全部写入 os 中|
|`int`  |`write(byte[] b, int off, int len)` | 将 b 这个字符数组中从 off 开始的数据写入 os 中，一共写 len 个|
|`void` |`close()` | 关闭字节流 |
|`void` | `flush()`|重要：我们知道 I/O 的速度是很慢的，所以，大多的 OutputStream 为了减少设备操作的次数，在写数据的时候都会将数据先暂时写入内存的一个指定区域里，直到该区域满了或者其他指定条件时才真正将数据写入设备中，这个区域一般称为缓冲区。但造成一个结果，就是我们写的数据，很可能会遗留一部分在缓冲区中。需要在最后或者合适的位置，调用 flush（刷新）操作，将数据刷到设备中。 |

### 说明
OutputStream 同样只是一个抽象类，要使用还需要具体的实现类。我们现在还是只关心写入文件中，所以使用 **FileOutputStream**


### 利用 OutputStreamWriter 进行字符写入
```java
public class IODemo10 {  
    public static void main(String[] args) throws IOException {  
        try(OutputStream os = new FileOutputStream("output.txt")){  
            os.write('H');  
            os.write('e');  
            os.write('l');  
            os.write('l');  
            os.write('o');  
  
            os.flush(); // 使用flush 刷新缓冲区  
        }  
    }  
}
```


```java
public class IODemo10 {
	public static void main(String[] args) throws IOException {
		try (OutputStream os = new FileOutputStream("output.txt")) {
			String s = "Nothing";
			byte[] b = s.getBytes();
			os.write(b);
			// 不要忘记 flush
			os.flush();
		}
	}
}
```

```java
public class IODemo10 {
	public static void main(String[] args) throws IOException {
		try (OutputStream os = new FileOutputStream("output.txt")) {
			String s = "你好中国";
			byte[] b = s.getBytes("utf-8");
			os.write(b);
			
			// 不要忘记 flush
			os.flush();
		}
	}
}
```


### 利用 PrintWriter 找到我们熟悉的方法
上述，我们其实已经完成输出工作，但总是有所不方便，我们接来下将 OutputStream 处理下，使用PrintWriter 类来完成输出，因为 PrintWriter 类中提供了我们熟悉的 print/println/printf 方法
```java
public class IODemo11 {
	public static void main(String[] args) throws IOException {
		try (OutputStream os = new FileOutputStream("output.txt")) {
			try (OutputStreamWriter osWriter = new OutputStreamWriter(os, "UTF-8")) {
				try (PrintWriter writer = new PrintWriter(osWriter)) {
					writer.println("我是第一行");
					writer.print("我的第二行\r\n");
					writer.printf("%d: 我的第三行\r\n", 1 + 1);
					
					writer.flush();
				}
			}
		}
	}
}
```



# 练习

## 查找指定目录文件
扫描指定目录，并找到名称中包含指定字符的所有普通文件（不包含目录），并且后续询问用户是否要删除该文件
```java
public class IODemo12 {  
    private static Scanner scanner = new Scanner(System.in);  
  
    public static void main(String[] args) {  
        System.out.println("输入您要查找的目录"); // 让用户输入一个指定搜索的目录  
        String basePath = scanner.next();  
  
        File root = new File(basePath);  
  
        if(!root.isDirectory()){  
            // 路径不存在, 或者只是一个普通文件, 此时无法进行搜索  
            System.out.println("输入的目录有误!");  
            return;        }  
  
        // 再让用户输入一个要删除的文件名  
        System.out.println("请输入要删除的文件名");  
        String nameToDelete = scanner.next();  
  
        // 针对指定的路径进行扫描. 递归操作.  
        // 先从根目录出发. (root)  
        // 先判定一下, 当前的这个目录里, 看看是否包含咱们要删除的文件. 如果是, 就删除; 否则就跳过下一个.  
        // 如果当前这里包含了一些目录, 再针对子目录进行递归.  
        scanDir(root, nameToDelete);  
    }  
  
    public static void scanDir(File root , String name){  
        System.out.println("[scanDir]" + root.getAbsolutePath());  
  
        File[] files = root.listFiles();  
  
        // 当前 root 目录下没东西. 是一个空目录  
        // 结束继续递归.  
        if(files == null){  
            return ;  
        }  
  
        for(File file : files){  
            // 如果是目录, 就进一步递归  
            if(file.isDirectory()){  
                scanDir(file , name);  
            }else{  
                // 如果是普通文件, 则判定是否要删除  
                if (file.getName().contains(name)){  
                    System.out.println("确认是否删除"+ file.getAbsolutePath() + " ?");  
                    String choice = scanner.next();  
                    if(choice.equals("y") ||choice.equals("Y") ){  
                        file.delete();  
                        System.out.println("删除成功");  
                    }else{  
                        System.out.println("删除取消");  
                    }  
                }  
  
            }  
        }  
    }  
}
```


## 拷贝文件到指定目录
```java
public class IODemo13 {  
    public static void main(String[] args) throws IOException {  
        Scanner scanner = new Scanner(System.in);  
        System.out.println("请输入要拷贝的文件:");  
        String srcPath = scanner.next();  
  
        System.out.println("请输入要拷贝到的路径");  
        String destPath = scanner.next();  
  
        File srcFile = new File(srcPath);  
        if(!srcFile.isFile()){  
            System.out.println("输入的源路径有误");  
            return;        }  
  
        File destFile = new File(destPath);  
        if(destFile.isFile()){  
            System.out.println("输入的目标路径有误");  
            return;        }  
  
        //try() 语法支持多个流对象 , 多个流对象之间使用 ; 分割即可  
        try(InputStream inputStream = new FileInputStream(srcFile);  
            OutputStream outputStream = new FileOutputStream(destFile)) {  
            while(true){  
                int b = inputStream.read();  
                if(b == -1){  
                    break;  
                }  
                outputStream.write(b);  
            }  
        }  
    }  
}
```
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230514121708.png)
