
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