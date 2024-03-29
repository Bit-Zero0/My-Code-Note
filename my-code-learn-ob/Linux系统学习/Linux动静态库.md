# 动态库 and  静态库

## 概念
- **静态库（.a）**：程序在编译链接的时候把库的代码链接到可执行文件中。程序运行的时候将不再需要静态库
- **动态库（.so）**：程序在运行的时候才去链接动态库的代码，多个程序共享使用库的代码。
- 一个与动态库链接的可执行文件仅仅包含它用到的函数入口地址的一个表，而不是外部函数所在目标文件的整个机器码
- 在可执行文件开始运行以前，外部函数的机器码由操作系统从磁盘上的该动态库中复制到内存中，这个过程称为**动态链接（dynamic linking）**
- 动态库可以在多个程序间共享，所以动态链接使得可执行文件更小，节省了磁盘空间。操作系统采用虚拟内存机制允许物理内存中的一份动态库被要用到该库的所有进程共用，节省了内存和磁盘空间。

## Linux中C标准库的路径
`/lib64/libc.so.6`


## 库文件的命名
库文件的命名:  `libXXXX.so`  or  `libYYYY.a-..`
库的真实名字:  ==**去掉 `lib` 前缀，去掉 `.a- .so-` (包含）后缀，剩下的就是库名称**==!


## 如何查看可执行文件的依赖那些动态链接
使用 [[linux常用命令#ldd|ldd指令]] 
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315183327.png)


## 查看动/静态链接
在默认编译时，默认是使用**动态链接**。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315183428.png)


在编译的后面在 **`-static`** ，则可以编译将动态链接改为**静态链接**。 不过一般Linux系统是没有这个静态链接编译的需要 [[Linux 软件包管理器 yum|yum]] 下载一下
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315183450.png)



## 库的制作与使用
库文件本身就是二进制文件，一套完整的库有些什么？

一套完整的库： 
> 1. 库文件本身
> 2. 头文件.h
> 3. 说明文档

头文件和说明文档就是用来说明库中暴露出来的方法的基本使用。

### 库文件的构成
库文件就是由多个 `.o` 文件 , [[C++/c++一些细碎却必要的知识/[C语言] 程序的编译过程# 1.3 汇编|这里查看.o文件的生成]]。


## 静态库的构成
在有多个 `.o` 文件的情况下，使用 [[linux常用命令#ar -rc|ar -rc指令]] 进行打包就可以生成一个静态库。
```makefile
%.0:%.c
    gcc -c $<

libmymath.a:add.o sub.o
    ar -rc $@ $^

.PHONY:clean
clean:
	$(RM) *.a *o

```

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315183745.png)

生成`libmy.a` 静态库


## 静态库的使用
静态库文件在 lib 目录中
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315183818.png)

lib 目录的文件目录 ，对静态库`.a`使用 `ar -tv` 则可以查看静态库内的二进制文件
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315183831.png)


在main.c文件中，需要使用我们静态库内的相关函数的头文件。
```c
#include <stdio.h>
#include "./lib/sub.h"  //以下两个就是静态库内的相关函数的头文件
#include "./lib/add.h"

int main()
{
    int x = 10 ;
    int y = 20;

    printf("x + y = %d\n",add(x, y));
    printf("x - y = %d\n",sub(x, y));
    return 0;
}
```

使用 gcc 进行编译 
**`gcc main.c -I./lib -L./lib -l mymath`**
即可生成可执行文件 ， **测试目标文件生成后，静态库删掉，程序照样可以运行。**
>`-L` 指明库文件搜索路径
>`-l` 指明要链接哪一个库
>`-I` 指明头文件搜索路径 

**注意 `-l` 指明链接的库是库名，是需要去掉前缀和后缀的。**


## 动态库的构成
在 gcc 中使用 `-fPIC` 参数，产生位置无关码(position independent code)。
在使用 gcc 中的 `-shared` 参数生成共享库格式

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317201605.png)

生成无关码，并汇编为二进制`.o`文件。

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317201613.png)
生成共享库格式



## 动态库的使用
动态库的使用方法和静态库是是一样的，使用 **`gcc main.c -I./lib -L./lib -l mymath`**

但是会遇到一个问题
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315183947.png)


先看我们编译时的这句指令
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315183954.png)

**这里只是告知编译器头文件库路径在哪里,当程序编译好的时候，此时已经和编译无关了!所以可执行文件找不到动态库，就无法编译了**。


### 方法一 ：  `LD_LIBRARY_PATH`  [最推荐]
`LD_LIBRARY_PATH` 是一个库的临时[[Linux环境变量|环境变量]]。重新打开终端时，就会失效。

先使用 [[linux常用命令#pwd|pwd指令]] 取得库的所在句绝对路径

再使用 [[linux常用命令#export 设置一个新的环境变量|export指令]]在`LD_LIBRARY_PATH` 中添加我们的库路径
**`export LD_LIBRARY_PATH=/home/fmy/lesson/lesson413/lib`**

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315184029.png)




### 方法二：ldconfifig 配置
此方法比较实用，基本没有配置风险。
==进入 **`/etc/ld.so.conf.d`** 路径，新建一个 **`.conf`** 后缀的文件，文件名任意，新建与写入需要管理员权限。
在文件中写入我们 库的路径 ==
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315184045.png)


在库中写入我们的库路径
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315184049.png)


最后使用 `idconfig` 指令编译。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315184053.png)
