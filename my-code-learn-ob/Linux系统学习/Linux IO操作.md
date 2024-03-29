# I/O的一些概念
在**C语言**中会默认打开三个==输入输出流== ： **`stdin`** ， **`stdout`** , **`stderr`** 。
仔细观察发现，这三个流的类型都是`FILE*` , ` fopen`返回值类型，==**文件指针**==  

>**stdin** : 标准输入
>**stdout**：标准输出
>**stderr**：标准错误

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317212848.png)

所有的语言上的对“文件”的操作，都必须**贯穿OS**!

**操作系统不相信任何人，访问操作系统，需要通过==系统调用接口==的！**！！

几乎所有的语言`fopen` , `fclose` , `fread` , `fwrite`  ,  `fgets` , `fputs` , `fgetc` ,  `fputc`等底层一定需要使用OS提供的系统调用！！！


其实是可以把输出的内容 ，通过 [[重定向与通道#输出重定向 |输出重定向]] **`>`** 输出到其他文件中的
```cpp
#include <stdio.h>

int main()
{
  FILE* fp = fopen("./log.txt", "r");

  if(NULL == fp)
  {
    perror("fopen");
    return 1;
  }

  char buf[64];
  while(fgets(buf , sizeof(buf) , fp))
  {
    printf("%s",buf);
  }

  if(!feof(fp))
  {
    printf("fgets quit not normal!\n");
  }
  else{
    printf("fgets quit normal! \n");
  }                                                                                                                                                 

  fclose(fp);
  return 0;
}
```

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317212904.png)



# 系统调用接口 `open`
`open` 属于==**系统调用**==的接口，在Linux中使用 ==2 号手册==查询。

需要导入的头文件
> <sys/types.h>
> <sys/stat.h>
> <fcntl.h>

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317212916.png)

open的返回值：
>成功： 返回文件标识符
>失败： 返回 -1 

## 函数参数解析
第一个参数 **`const char* pathname`** 
 这个参数是代表我们要打开的文件，需要包含路径
 ![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317213010.png)


第二个参数 **`int flags`** 
表示是我们要对这个文件进行的操作，**读 写 创建**
有三个参数可供我们选择
>==**O_RDONLY:**== 只读打开
>==**O_WRONLY**==: 只写打开
>==**O_RDWR** ==: 读，写打开
>				以上这三个常量，必须==**指定一个且只能指定一个**==
>				
>==**O_CREAT**== : 若文件不存在，则创建它。需要使用mode选项，来指明新文件的访问权限
>==**O_APPEND**==: 追加写
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317213034.png)


第三参数 **`mode_t mode`**
此参数一般在第二个参数使用了 O_CREAT时使用，此参数用来设置我们创建文件的[[Linux权限管理#基本权限|权限]]的。 使用的就是**八进制**来控制文件权限
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317213100.png)

这个 `0644` 设置为
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317213108.png)



## flags 详解
open 的第二个参数 `int flags`  ，是一个整型，但是它的参数却又有好几个。
>==**O_RDONLY:**== 只读打开
>==**O_WRONLY**==: 只写打开
>==**O_RDWR** ==: 读，写打开
>				以上这三个常量，必须==**指定一个且只能指定一个**==
>				
>==**O_CREAT**== : 若文件不存在，则创建它。需要使用mode选项，来指明新文件的访问权限
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317213146.png)


int 类型 有 32个 bit位 ， 而在 flags 中，一个bit位，其实可以代表一个标志。
**`O_WRONLY`** , **`O_RDONLY`** , **`O_CREAT`** 等都是**只有一个比特位**是 ==**1**== 的数据，而且不重复。

如：
>#define 0 WRONLY  0x1     0000 0001
>#define 0 RDONLY   0x2    0000 0010
>#define 0 CREAT      0x4    0000 0100


## open的返回值
```c
#include <stdio.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <fcntl.h>
#include <unistd.h>

int main()
{
  int fp = open("./test.txt" , O_WRONLY | O_CREAT , 0644);
  int fp1 = open("./test1.txt" , O_WRONLY | O_CREAT , 0644);
  int fp2 = open("./test2.txt" , O_WRONLY | O_CREAT , 0644);
  int fp3 = open("./test3.txt" , O_WRONLY | O_CREAT , 0644);
  if(fp < 0)
  {
    printf("open error");
  }
  
  printf("fd: %d\n",fp);
  printf("fd1: %d\n",fp1);
  printf("fd2: %d\n",fp2);
  printf("fd3: %d\n",fp3);
  
  close(fp);
  close(fp1);
  close(fp2);
  close(fp3);

  return 0;
}
```
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317213255.png)


为什么文件的返回值是从3开始？
因为文件返回值中的 **0**  ， **1**  ， **2** ， 是已经被使用的了
分别对应：
>0    标准输入       键盘
>1    标准输出       显示器
>2    标准输出      显示器


![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317213300.png)

==进程与文件的关系==是 一对多 **`1 : n`**。

那么，OS要不要把打开的文件在内存中（系统中）管理起来呢？？
如何管理打开的文件怩？先描述，在组织！！！

C语言中对文件进行管理的结构
```c
struct file
{
	//包含了打开文件的相关属性
	//链接属性
}
```


# 系统调用 `write` 和 `read`
## write
向指定的文件写入数据
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317213439.png)


### 函数参数详解
**`int fd`**  就是文件描述符，指的就是我们打开的文件。
**`const void* buf`**  就是我们要写入的内容
**`size_t`** 就是我们要写入的字节个数
**返回值**  **`ssize_t`**  返回的是我们写入的字符量

**注意：在文件中是没有 `\0` 的概念， `\0` 只是语言级别的结束符，在文件中是不需要的。**


### 实例
```cpp
#include <stdio.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <string.h>

int main()
{

  int fd = open("./log.txt", O_WRONLY | O_CREAT , 0644);
  if(fd < 0)
  {
    perror("file fail");
    return 1;
  }

  const char* msg = "hello Linus\n";

  int count = 5;
  while(count--) //要写入五次 msg 的内容
  {
    write(fd , msg , strlen(msg)); 
  }

  close(fd);
  return 0
}  
```
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317214212.png)





## read
向指定的文件读取数据
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317214222.png)

**`int fd`**  就是文件描述符，指的就是我们打开的文件。
**`void* buf`** 表示将读到的内容写到 buf数组中 
**`size_t`** 就是我们要读取的字节个数
**返回值**  **`ssize_t`**  返回的是我们写入的字符量


### 实例
**注意：在文件中是没有 `\0` 的概念， `\0` 只是语言级别的结束符，在文件中是不需要的。**
```cpp
#include <stdio.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

int main()
{
  int fd = open("./log.txt" , O_RDONLY);
  if(fd < 0)
  {
    perror("open");
    return 1;
  }

  char buf[1024]; //这就是我们要用来接收读取到的文件数据的数组
  size_t s = read(fd , buf , sizeof(buf)-1 ); //在文件中虽然没有 \0 的概念，但是在C语言中是有的，所以留一个空位来放 \0
  if(s > 0)
  {
    buf[s] = 0; //s放回的就是 read() 读取到的字节个数，所以在 s 处放 \0 就是相当于结束符。
    printf("%s\n" , buf);
  }

  close(fd);

  return 0;
}
```
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317214428.png)



# 文件在哪？是什么？
如果一个文件，没有被打开，这个文件在哪里？==**磁盘！**==
如果我创建了一个空文件，该文件要不要占磁盘空间？==**必须的！**==
文件有属性，==属性也是数据==
> **==磁盘文件= 文件内容+文件属性==**

在文件还没打开时，OS怎么对**打开的文件**进行管理？ 使用 `struct file` 。 



# 文件描述符 `fd`
通过对 `open` 函数的学习，我们知道了文件描述符就是一个小整数.

## 0 & 1 & 2
Linux进程默认情况下会有3个缺省打开的文件描述符，分别是标准输入 **`0`**， 标准输出 **`1`**， 标准错误 **`2`**  .

==**0 ,1 ,2**==  对应的物理设备一般是：==**键盘，显示器，显示器**== 。


![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317214436.png)

在我们的 `task_struct` 中包含了一个指针 `struct files_struct* fs` 。

`struct files_struct* fs` 指向了文件操作符结构体` struct file_struct `。

` struct file_struct `中就包含了我们所需要的指向文件描述符的指针数组`struct file* fd_array[]` 。

`struct file* fd_array[]` 数组中是从 **`0`** 开始的，每一个指向指针指向一个文件，这个文件时一个结构体`struct file` 。**`0`** 标准输入，**`1`** 标准输出 ，**`2`** 标准错误   ，从 `3` 开始的 fd描述符就是指向我们创建的文件了。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317214545.png)

而在每一个外设都会在驱动层有特有的 **IO**，是和其他外设是不同的，如：键盘是write{} ; 显示器是 read()；

那在struct file 中怎么找到对应的外设或IO呢？ 其实这就像C++中的多态一样，而在C语言中使用的就是函数指针来进行多态 ， 在struct file 中就有两个函数指针 `int (*read)()` , `int (*write)()`来与外设和IO进行交互。

既然文件描述符 1 ， 2 ，对应的是标准输出，那我们可不可以使用他们进行直接输出呢？
```c
#include <stdio.h>                                                                                                                                    
#include <unistd.h>                                                                                                                                   
#include <string.h>                                                                                                                                       
int main()                                                                                                                                            
{                                                                                                                                                     
    const char* msg = "hello code\n";                                                                                                                 
    write(1 , msg,strlen(msg));                                                                                                                       
    write(1 , msg,strlen(msg));                                                                                                                       
    write(1 , msg,strlen(msg));                                                                                                                       
    write(1 , msg,strlen(msg));                                                                                                                       
    write(1 , msg,strlen(msg));                                                                                                                       
    write(1 , msg,strlen(msg));                                                                                                                       
    return 0;                                                                                                                                         
}
```
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317214600.png)


**标准错误流 `2`** 也可以进行输出
```c
#include <stdio.h>                                                                                                                                    
#include <unistd.h>                                                                                                                                   
#include <string.h>                                                                                                                                   

int main()                                                                                                                                            
{                                                                                                                                                     
    const char* msg = "hello code\n";                                                                                                                 
    write(2 , msg,strlen(msg));                                                                                                                       
    write(2 , msg,strlen(msg));                                                                                                                       
    write(2 , msg,strlen(msg));                                                                                                                       
    write(2 , msg,strlen(msg));                                                                                                                       
    write(2 , msg,strlen(msg));                                                                                                                       
    write(2 , msg,strlen(msg));                                                                                                                       
    return 0;                                                                                                                                         
}
```
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317214612.png)



既然 1 , 2 这个两个fd，都可以输出，那 0 这标准输入可以进行输入吗？ ==当然可以==
```c
#include <stdio.h>                                                                                                                                    
#include <unistd.h>                                                                                                                                                                                                                                                                      
   
int main()                                                                                                                                          
{                                                                                                                                                   
    char buf[64];                                                                                                                                   
    int s  = read(0 , buf , sizeof(buf));                                                                                                           
    buf[s] = 0; //这表示 \0                                                                                                                           
    printf("echo# %s\n",buf);                                                                                                                                                                                                                                             
    return 0;                                                                                                                                       
}
```
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317214623.png)

为什么结果下面会有一个空行？ ==因为在读取的过程中会读取我们的 回车（也就是\n）==


## 文件描述符的分配规则

文件描述符的分配规则，给新文件分配的fd，是从fd_array中找一个最小的，没有被使用的，作为新的fd！

### `0` 标准输入流
我们关闭 `0` 后，建立新文件，新文件就会占用 `0` 这个文件描述符
```c
  #include <stdio.h>
  #include <unistd.h>
  #include <string.h>
  #include <sys/types.h>
  #include <sys/stat.h> 
  #include <fcntl.h>

  int main()
  {
      close(0);
      int fd = open("./log.txt" , O_CREAT | O_WRONLY , 0644);
      printf("%d\n" , fd);
      return 0;
  }
```
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317215121.png)


### `2`标准错误流

再如，我们关闭 `2` ， 新文件也会占用 `2` 这个文件描述符
```c
#include <stdio.h>                                                          
#include <unistd.h>                               #include <string.h>                               #include <sys/stat.h>                             #include <sys/types.h>                           #include <fcntl.h>                                  
int main()                                 
{                                                 
    close(2);                                       
    int fd = open("./log.txt" , O_CREAT | O_WRONLY , 0644);           
    printf("%d\n" , fd);                        
    return 0;        
}
```
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317215159.png)


### `1` 标准输出流
为什么不把 `1` 放在前面呢， ==因为 `1`比较特殊==。
```c
#include <stdio.h>                                                                                                                                     
#include <sys/stat.h>                                                                                                                                  
#include <sys/types.h>                                                                                                                                 
#include <fcntl.h>                                                                                                                                     
#include <unistd.h>                                                                                                                                    
int main()                                                                                                                                             
{                                                                                                                                                      
    close(1);                                                                                                                                          
    int fd = open("./log.txt" , O_WRONLY|O_CREAT , 0644);                                                                                              
    printf("fd = %d\n" , fd);                                                                                                                          
    return 0;                                                                                                                                          
}
```

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317215241.png)

当我们运行程序时，发现并没有在屏幕上显示结果，结果去哪了？

其实在我们的`log.txt` 文件中
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317215248.png)


#### `1`标准输出流与编程语言的关系
标准输出流`1`对应的是显示器文件，当关闭了标准输出流`1`时，`1`就处于空缺状态，我们创建后log.txt文件后，log.txt文件就会对应 `1`。

在编程语言，所有的IO操作，其实都是对OS的系统调用进行封装，而这里的`printf`就是对`open`，`write`中之一的封装，而printf的本质是 `stdout`，`stdout`的返回值是`FILE*`，`FILE*`也是C语言层面上的结构体，但在这个结构体中，一定包含一个整数，这个整数就是文件打开对应的fd。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317215323.png)


**==因为编程语言的IO函数只认对应的fd_array数组中的fd，而不管fd对应的是不是显示器文件或键盘文件==**，所以我们打印的数据都进入的log.txt文件中。

其实这种操作已经相当于输出重定向1了。

# 重定向
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317215421.png)

那重定向的本质是什么呢？
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317215540.png)


## 追加重定向

上面的内容已经演示了输出重定向了，那追加重定向要怎么办呢？

使用 在linux中使用[[linux常用命令#man|man]]的2号手册查找open这个系统调用接口的手册[`man 2 open`]，可以发现，有个选项 `O_APPEND`
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317220834.png)

使用`O_APPEND`就可以在进行追加重定向了

在log.txt文件中，已经只有一条数据。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317220840.png)

现在在open系统调用中，添加`O_APPEND`,并加入五条数据 `hello Linux`。
```c
#include <stdio.h>                                                                                                                                            
#include <sys/stat.h>                                                                                                                                         
#include <sys/types.h>                                                                                                                                        
#include <fcntl.h>                                                                                                                                            
#include <unistd.h>                                                                                                                                           
int main()                                                                                                                                                  
{                                                                                                                                                           
    close(1);                                                                                                                                               
    int fd = open("./log.txt" , O_WRONLY | O_CREAT | O_APPEND, 0644);  //这里添加了O_APPEND选项                                                                                        
    printf("fd = %d\n" , fd);                                                                                                                                                                     
    printf("hello Linux");                                                                                                                                  
    printf("hello Linux");                                                                                                                                  
    printf("hello Linux");                                                                                                                                  
    printf("hello Linux");                                                                                                                                  
    printf("hello Linux");                                                                                                                                  
    return 0;                                                                                                                                               
}        
```
运行结果
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317220941.png)



## 输入重定向
输入重定向的原理和上面的两个系统调用类似。就是将 fd `0`原本是从键盘文件读取，改动为我们的 log.txt 文件读取。

而在这里使用了一个C语言函数 `fgets`
>**char *fgets(char * s , int size , FILE *stream);**
>
> [fgets 详细介绍](https://cplusplus.com/reference/cstdio/fgets/?kw=fgets)

```c
#include <stdio.h>                                                                                                                                            
#include <sys/stat.h>                                                                                                                                         
#include <sys/types.h>                                                                                                                                        
#include <fcntl.h>                                                                                                                                            
#include <unistd.h>                                                                                                                                           
int main()                                                                                                                                                  
{                                                                                                                                                           
   close(0);                                                                                                                                                
   int fd = open("./log.txt", O_RDONLY);                                                                                                                    
   printf("fd = %d", fd);                                                                                                                                   
   char line[128];                                                                                                                                          
   while(fgets(line,sizeof(line)-1,stdin))                                                                                                                  
   {                                                                                                                                                        
       printf("%s",line);                                                                                                                                   
   }                                                                                                                                                                                                                                                                                          
    return 0;                                                                                                                                               
}  
```
运行结果，成功把log.txt文件的内容读取出来了
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317221124.png)



## 重定向的注意事项

### 标准输出`1` 和 标准错误`2` 的区别
当我文件中有 标准输出 1 和标准错误 2 时，虽然两个都是输出到屏幕上，但其实还是有差别的。

运行以下文件
```c
#include <stdio.h>                                                                                                                                          
#include <sys/stat.h>                                                                                                                                       
#include <sys/types.h>                                                                                                                                      
#include <fcntl.h>                                                                                                                                          
#include <unistd.h>
#include <string.h>

int main()
{
    const char* msg1 = "hello 标准输出\n";
    const char* msg2 = "hello 标准错误\n";
    write(1 , msg1 ,strlen(msg1) );
    write(2 , msg2 ,strlen(msg2) );
    return 0;
}
```
运行结果：
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317221143.png)

初看运行结果没有问题，那我们在shell命令界面使用 输出重定向 `>` 呢？
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317221147.png)

此时发现，两条数据，只有标准输出 `1` 的那条数据被重定向到了log.txt文件中去了，而标准错误 `2` 的那条则没有被重定向。

==原因在于输出重定向只会 重定向 标准输出 1==。


### 标准输出`1` 和标准错误`2` 同时重定向的方法
使用 `运行文件 > 被定向文件 2>&1`

在当前环境下就是 `./myfile > log.txt 2>&1`
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317221217.png)

解析
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317221221.png)


就是将 `1` 指向的内容指向了 新文件 ， `2` 指向与`1`一样的内容​， `2` 就指向了新文件。
[详细解释](https://developer.aliyun.com/article/977075)

# `dup2` 系统调用
dup2系统调用就可以轻松的实现重定向的功能，而可以不使用 `close`关闭文件来实现。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317222548.png)

dup系统调用共有三个， `dup` ， `dup2`，`dup3`，**但是最常用的还是 `dup2`**

## dup2的描述
> **int dup2( int oldfd , int newfd );**

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317222610.png)

也就是使用oldfd将newfd进行覆盖，从而进行重定向。

## 使用dup2进行输出重定向
```c
#include <fcntl.h>                                                                                                                                            
#include <unistd.h>                                                                                                                                           
int main()                                                                                                                                                  
{                                                                                                                                               
    int fd =  open("./log.txt" ,O_WRONLY );                                                                                                                 
    if(fd < 0)                                                                                                                                              
    {                                                                                                                                                       
        perror("file open");                                                                                                                               
        return 1;                                                                                                                                           
    }
                                
    dup2(fd , 1); //本来应该显示到显示器的内容，写入到文件！
    printf("hello Linux\n");                                                                                                                                
    fprintf(stdout, "hello Linux\n");                                                                                                                       
    fputs("hello Linux\n" , stdout);  
    return 0;
}
```
运行结果
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317222628.png)
在原有数据的基础上添加了我们的三条 `hello Linux`

使用open的 `O_TRUNC` 选项可以在每次写入前，清空文件，就可以达到C语言中`fwrite`函数的作用了。
```c
#include <fcntl.h>                                                                                                                                            
#include <unistd.h>                                                                                                                                           
int main()                                                                                                                                                  
{                                                                                                                                               
    int fd =  open("./log.txt" ,O_WRONLY | O_TRUNC );                                                                                                                 
    if(fd < 0)                                                                                                                                              
    {                                                                                                                                                       
        perror("file open");                                                                                                                               
        return 1;                                                                                                                                           
    }                                      
    dup2(fd , 1); //本来应该显示到显示器的内容，写入到文件！
    printf("hello Linux\n");                                                                                                                                
    fprintf(stdout, "hello Linux\n");                                                                                                                       
    fputs("hello Linux\n" , stdout);  
    return 0;
}
```
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317222653.png)



## 使用dup2进行输入重定向
```c
#include <stdio.h>                                                                                                                                          
#include <sys/stat.h>                                                                                                                                       
#include <sys/types.h>                                                                                                                                      
#include <fcntl.h>                                                                                                                                          
#include <unistd.h>                                                                                                                                         
int main()                                                                                                                                              
{                                                                                                                                                                                            
    int fd =  open("./log.txt" ,O_RDWR);                                                                                                                
    if(fd < 0)                                                                                                                                          
    {                                                                                                                                                   
        perror("file open");                                                                                                                            
        return 1;                                                                                                                                       
    }                                                                                                                                                                                      
    dup2(fd , 0);                                                                                                                                                                        
    char buf[1024]; 
    while(fgets(buf , sizeof(buf)-1, stdin)
    {
        printf("%s",buf);
    }
    return 0;
}
```

log.txt文件的内容是
```c
sdfjskfje jji  
asdfgh uio
```

运行结果
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317222708.png)



# 缓冲区
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317222720.png)

==在我们所写的数据原本都在用户层的 **C语言缓冲区** 中，**C语言缓冲区** 通过 [[Linux IO操作#文件描述符|fd]] 将数据拷贝到了OS层的 **文件的内核缓冲区**，**文件内核缓冲区** 会定期的将数据刷新到磁盘或某种外设中。==

## 内部细节
当C语言缓冲区拷贝数据到OS层的文件的内核缓冲区时，一定需要 [[Linux IO操作#文件描述符|fd]] ，因为我们需要系统调用接口，没有OS提供的这层接口，我们无法找到文件。

在C语言的IO函数中，一定有是有 **`FILE*`** 类型构成的，而 **`FILE*`** 指向的结构体封装的不仅仅是 [[Linux IO操作#文件描述符|fd]]  ， 还包含了 **维护C语言缓冲区相关的内容**。

**注意：==系统调用== 的所书写的数据是不会在C语言缓冲区中的，而是直接在文件的内核缓冲区。**

## 缓冲区的刷新策略
1.  **立即刷新（不缓冲）。**
2.  **行刷新（行缓冲，就是遇到\n就刷新），比如，显示器打印。** 
3.  **缓冲区满了，才刷新（全缓冲），比如，往磁盘文件中写入。**


## `close` 引发的问题

以上的文件都有一个问题，为什么我们在源文件的结尾都没有 `close`这个系统调用。

在源文件的结尾使用`close`会怎样。

源文件结尾没有 `close` 的
```c
#include <stdio.h>                                                                                                                                              
#include <sys/stat.h>                                                                                                                                           
#include <sys/types.h>                                                                                                                                          
#include <fcntl.h>                                                                                                                                              
#include <unistd.h>                                                                                                                                             
#include <string.h>                                                                                    
int main()                                                                                                                                                    
{                                                                                                                                                             
    close(1);                                                                                                                                                 
    int fd = open("./log.txt" , O_CREAT | O_WRONLY |O_TRUNC ,0644);                                                                                           
  
    printf("fd = %d \n" , fd);                                                                                                                                
    printf("hello printf\n");                                                                                                                                 
    fprintf(stdout,"hello fprintf\n");   
    return 0;
	//就是这里没有 close(fd) ;
}
```
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317222748.png)


但是加了close以后呢？
```c
#include <stdio.h>                                                                                                                                          
#include <sys/stat.h>                                                                                                                                       
#include <sys/types.h>                                                                                                                                      
#include <fcntl.h>                                                                                                                                          
#include <unistd.h>                                                                                                                                         
#include <string.h>                                                                                                                                         
int main()                                                                                                                                            
{                                                                                                                                                     
    close(1);                                                                                                                                         
    int fd = open("./log.txt" , O_CREAT | O_WRONLY |O_TRUNC ,0644);                                                                                   
  
    printf("fd = %d \n" , fd);                                                                                                                        
    printf("hello printf\n");                                                                                                                         
    fprintf(stdout,"hello fprintf\n"); 
      
    close(fd);//加了这一行                                                                                                   
    return 0;                                                                                                                                         
} 
```
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317222758.png)


就会发现没有内容了，原因其实就是出自于缓冲区。

在以上问题中，其实就是 当我们[[重定向与通道#输出重定向|输出重定向]]后，`1`的指向就已经不是显示器文件了，而且其他的普通文件，**行缓冲 就变成了 全缓冲**，**普通文件**的缓冲区的[[Linux IO操作#缓冲区的刷新策略|刷新策略]]是 ==**全缓冲**==。

所以**C缓冲区还没有满**是不会拷贝数据到 **文件的内核缓冲区**的，而当我们关闭了 fd，就相当于断了它们之间的唯一联系，C缓冲区就**无法拷贝**数据到 **文件内核缓冲区**里去了。

## 解决方法
**在 [[Linux IO操作#文件描述符|fd]] 关闭前，刷新C语言缓冲区**

可以使用 `fflush()`函数

```c
#include <stdio.h>                                                                                                                                            
#include <sys/stat.h>                                                                                                                                         
#include <sys/types.h>                                                                                                                                        
#include <fcntl.h>                                                                                                                                            
#include <unistd.h>                                                                                                                                           
#include <string.h>                                                                                                                                           
int main()                                                                                                                                                  
{                                                                                                                                                           
    //close(1);                                                                                                                                               
    int fd = open("./log.txt" , O_CREAT | O_WRONLY |O_TRUNC ,0644);                                                                                         
    printf("fd = %d \n" , fd);                                                                                                                              
    printf("hello printf\n");                                                                                                                               
    fprintf(stdout,"hello fprintf\n");
    
    fflush(stdout); //在close(fd)之前，立即刷新C语言缓冲区                                                                                                                                           
    close(fd);                                                                                                                                              
    return 0;                                                                                                                                               
}
```
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317222817.png)



## 案列  `fork()`与缓冲区
在以下代码中，可以发现，[[Linux进程#使用fork创建子进程|fork()]] 在源代码的末尾，按理来说是不会对文件运行结果有影响的
```c
#include <stdio.h>                                                                                                                                            
#include <sys/stat.h>                                                                                                                                         
#include <sys/types.h>                                                                                                                                        
#include <fcntl.h>                                                                                                                                            
#include <unistd.h>                                                                                                                                           
#include <string.h>                                                                                                                                           
int main()                                                                                                                                                  
{                                                                                                                                                           
    const char* msg = "hello 标准输出\n";                                                                                                                     
    write( 1 , msg , strlen(msg) );                                                                                                                         
    printf("hello printf\n");                                                                                                                               
    fprintf(stdout , "hello fprintf\n");                                                                                                                    
    fputs("hello fputs\n" , stdout);                                                                                                                        
    fork();
    return 0;                                                                                                                                               
} 
```
运行结果如下：但确实也对运行结果没有影响
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317222830.png)


但如果我们对结果进行**输出重定向 `>`** 呢？
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317222835.png)

此时发现
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317222848.png)



### 原因
原因在于当我们把运行结果重定向时，就会发生[[Linux IO操作#缓冲区的刷新策略|刷新策略]]的改变，由显示器文件的**行刷新**变为了**普通文件的全缓冲**，所C接口的数据还在用户层的C语言缓冲区中。

[[Linux进程#使用fork创建子进程|fork()]] 的时候就会发生**写时拷贝**，因为父进程的缓冲区[buffer]要刷新，子进程的buffer也要刷新，所以必须发生写时拷贝。

而**系统接口**是由 **OS**负责的，所以数据是直接在 **文件的内核缓冲区**中的。


### 解决方法
==在fork() 之前强制刷新缓冲区==。
```c
#include <stdio.h>                                                                                                                                            
#include <sys/stat.h>                                                                                                                                         
#include <sys/types.h>                                                                                                                                        
#include <fcntl.h>                                                                                                                                            
#include <unistd.h>                                                                                                                                           
#include <string.h>                                                                                                                                           
int main()                                                                                                                                                  
{                                                                                                                                                           
    const char* msg = "hello 标准输出\n";                                                                                                                     
    write( 1 , msg , strlen(msg) );                                                                                                                         
    printf("hello printf\n");                                                                                                                               
    fprintf(stdout , "hello fprintf\n");                                                                                                                    
    fputs("hello fputs\n" , stdout);                                                                                                                        
    
    fflush(stdout);  //在fork() 之前刷新缓冲区                                                                                                                                                
    
    fork();
    return 0;                                                                                                                                               
} 
```
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317222909.png)



### 小知识点
在语言级别的 IO 中是会包含==刷新缓冲效果==的。
如：
> stdout , cout/cin ,fstream , iostream.
> 这些类中会包含 缓冲区，而 `std::endl ` 就是刷新其缓冲区，效果就类似于 `/n`,进行 **==行缓冲==**


# Linux文件系统
![[Linux文件系统]]


# AMC文件三时间
使用 [[linux常用命令#stat|stat]] 指令可以查看文件属性。

`Access` 最后访问时间
`Modify` 文件内容最后修改时间
`Change` 属性最后修改时间

- 当我们访问文件后，在退出，可以发现 **`Access`时间**并没有刷新，因为最近访问时间是OS自己定时刷新的，我们无法手动刷新。
- **`Change`时间** 可能会随着 **`Modify`时间**改变而改变，因为文件大小可能一直随着我们修改文件时改变而改变，文件大小是属于文件属性的。


## makefile 和 AMC时间的关系
为什么我们每次使用[[makefile的使用|Makefile]]的make指令后，就暂时无法在make了，如果我们修改了源文件，make指令又可以继续使用了？ 
原因就在于==AMC时间==，make指令就是根据==AMC时间==来进行判定是否需要make，判断条件就是源文件的AMC时间和make编译出的文件的==AMC时间==进行判定。


![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317223002.png)

[[linux常用命令#touch|touch指令]] 不仅可以创建文件，还可以对已存在的文件进行刷新。


# 动静态库
![[Linux动静态库]]