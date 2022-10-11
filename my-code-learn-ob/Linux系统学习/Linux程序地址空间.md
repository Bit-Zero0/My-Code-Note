# C/C++语言内存布局图
在C语言中我们学到的内存布局图
![[Pasted image 20220521212957.png]]

用以下代码来验证以下这个内存布局图是否正确
![[Pasted image 20220521210205.png]]




# 进程虚拟地址空间
实际上，以上代码的地址都不是在实际的内存中的

## 证明
```cpp
#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>

int g_val = 0;

int main()
{
	pid_t id = fork();
	if(id < 0)
	{
		perror("fork");
		return 0;
	}
	
	else if(id == 0)
	{ //child,子进程肯定先跑完，也就是子进程先修改，完成之后，父进程再读取
		g_val=100;
		printf("child[%d]: %d : %p\n", getpid(), g_val, &g_val);
	}
	
	else
	{ //parent
		sleep(3);
		printf("parent[%d]: %d : %p\n", getpid(), g_val, &g_val);
	}
	sleep(1);
	return 0;
}
```
![[Pasted image 20220521213442.png]]
我们发现，父子进程，输出地址是一致的，但是变量内容不一样！能得出如下结论:

> * 变量内容不一样,所以父子进程输出的变量绝对不是同一个变量
> * 但**地址值是一样**的，说明，该**地址绝对不是物理地址**！
> * 在Linux地址下，这种地址叫做 **虚拟地址**
> * **我们在用C/C++语言所看到的地址，全部都是虚拟地址！物理地址用户一概看不到，由==OS统一管理==**

OS必须负责将 **`虚拟地址`** 转化成 **`物理地址`** 。


## 每个进程的地址空间
每个进程都有一个地址空间都认为自己在独占物理内存！
**在 32位系统下 ，每个进程都认为自己有 4GB 内存。**

如下图：
![[Pasted image 20220521214405.png]]
mm_struct 的构成[大概]





# 虚拟地址空间的划分

进程虚拟地址空间 在内核中的是一个数据结构类型 **`struct mm_strcut`**
![[Pasted image 20220521214532.png]]


在 **`mm_struct`** 中详细的记录了虚拟地址空间的详细信息。
![[Pasted image 20220522144925.png]]
如图中的 `code_start`  和 `code_end` 代表的就是==代码区==地址空间区域。



**`task_struct`** 的结构体中也会有一个指向 **`mm_struct`** 的指针。
![[Pasted image 20220521214935.png]]
# 将虚拟地址转化为物理地址

## 页表  和 MMU

==**页表**==：是负责虚拟地址和物理地址相对应的表。

==**MMU[内存管理单元]**==：是一种硬件，在集成在cpu中，负责==查页表==。

![[Pasted image 20220522150432.png]]
 
 ## 如何控制物理地址区域中的的权限呢？
 
 如 `const char* s = "hello world"` 中的  `hello world` 就是在==字符常量区==的，只有 ==**r**==[只读]权限，无法进行修改。
 ![[Pasted image 20220522151346.png]]
 代码在查询页表时，会查询到虚拟地址对应的物理地址的权限，从而映射到物理地址中响应权限的区域。


# 为什么要有虚拟地址
1.通过添加一层==软件层==，完成有效的对进程操作内存进行==**风险管理（权限管理）**==，本质目的是为了，**保护物理内存**以及各个**进程的数据安全**！

2.将==**内存申请**==和==**内存使用**==的概念在==时间上划分==清楚，通过**虚拟地址空间，来屏蔽底层申请内存的过程，达到进程读写内存和0S进行内存管理操作，进行软件上面的分离**！

3.站在CPU和应用层的角度，**进程统一可以看做统一使用4GB空间**，而且**每个空间区域的相对位置**，是==比较确定==的！


## 解释 1

>通过添加一层==软件层==，完成有效的对进程操作内存进行==**风险管理（权限管理）**==，本质目的是为了，**保护物理内存**以及各个**进程的数据安全**

如果我们没有虚拟地址，而是直接使用物理地址。
![[Pasted image 20220522152802.png]]
当我们的进程A越界时， 很有可能访问到其他进程的代码和数据，严重危害了其他进程的安全性，所以添加虚拟地址是非常有必要的。


## 解释 2
>将==**内存申请**==和==**内存使用**==的概念在==时间上划分==清楚，通过**虚拟地址空间，来屏蔽底层申请内存的过程，达到进程读写内存和0S进行内存管理操作，进行软件上面的分离**！

当我们申请空间后，可能暂时不会全部使用，甚至不使用。
![[Pasted image 20220522153239.png]]
就像你和父母说，你要买什么东西，这时你提前和他们说了，当父母和你一起去买的时候的这段时间，父母再想办法凑到钱去买这件物品。
> 你申请空间成功时， 只是虚拟地址上申请成功了，物理地址上可能还没申请成功，要等到你真正去用时，才会申请。


## 解释 3
>站在CPU和应用层的角度，**进程统一可以看做统一使用4GB空间**，而且**每个空间区域的相对位置**，是==比较确定==的！

CPU是如何找到代码的入口（如：`main()` 函数）的？
不可能为了查找 ==代码的入口== ，把整个虚拟地址都遍历吧？
![[Pasted image 20220522155425.png]]
所以我们需要告诉CPU去指定的虚拟地址的区域（如：代码区）, 查找即可。
==**注意：程序的代码和数据可以被加载到物理内存的任意位置。**==

# 父子进程的虚拟地址空间
还是这段代码
![[Pasted image 20220522155756.png]]
![[Pasted image 20220522160243.png]]
但子进程或父进程发生修改时，就会发生写时拷贝，此时父进程或子进程的物理地址实际上已经发生了改变， 但是虚拟地址还是同一个 。


# 虚拟地址的内存布局图
```cpp
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>

int g_unval;
int g_val = 100;
int main(int argc, char *argv[], char *env[])
{
    
    const char *s ="hello world";
    printf("code addr: %p\n", main);
    printf("string rdonly addr: %p\n", s);
    printf("init addr: %p\n", &g_val);
    printf("uninit addr: %p\n", &g_unval);
    char *heap = (char*)malloc(10);
    char *heap1 = (char*)malloc(10);
    char *heap2 = (char*)malloc(10);
    char *heap3 = (char*)malloc(10);
    char *heap4 = (char*)malloc(10);

    printf("heap addr: %p\n", heap1);
    printf("heap addr: %p\n", heap2);
    printf("heap addr: %p\n", heap3);
    printf("heap addr: %p\n", heap4);

    printf("stack addr: %p\n", &s);
    printf("stack addr: %p\n", &heap);
    int a = 10;
    int b = 30;
    printf("stack addr: %p\n", &a);
    printf("stack addr: %p\n", &b);

    for(int i = 0; argv[i]; i++){
        printf("argv[%d]: %p\n", i, argv[i]);
    }

    for(int i =0; env[i] ;i++){
        printf("env[%d]: %p\n", i, env[i]);
    }
}
```

![[Pasted image 20220522161128.png]]

由此代码运行结果可知，在栈区之上还有内存区域， 那就是==**命令行参数、环境变量区**==。

![[Pasted image 20220522161437.png]]