# 进程创建
使用 **`fork()`** 函数创建进程。


程调用fork，当控制转移到内核中的fork代码后，内核做：
* 分配新的内存块和内核数据结构给子进程。
* 将父进程部分数据结构内容拷贝至子进程。
* 添加子进程到系统进程列表当中。
* fork返回，开始调度器调度 。

![[Pasted image 20220526124350.png]]
当一个进程调用fork之后，就有==两个二进制代码相同的进程==。而且它们都运行到相同的地方。但每个进程都将可以开始它们自己的旅程。

![[Linux进程#使用fork创建子进程]]


## fork函数返回值
* 子进程返回0，
* 父进程返回的是子进程的pid。


## 写时拷贝
父子代码共享，父子再不写入时，数据也是共享的，当任意一方试图写入，便以写时拷贝的方式各自一份副本。
![[Pasted image 20220526125325.png]]

## fork的常规用法
* 一个父进程希望复制自己，使父子进程同时==执行不同的代码段==。例如，父进程等待客户端请求，生成子进程来处理请求。
* 一个进程要执行一个不同的程序。例如子进程从fork返回后，调用==**exec**==函数。


# 进程终止
进程退出，0S层面做了什么呢？？
> 系统层面，少了一个进程：`free PCB` ,  `free mm_struct` ,free页表和各种映射关系，代码+数据申请的空间也要给**释放**掉！

## 进程退出场景
* ==**代码运行完毕，结果正确**==
* ==**代码运行完毕，结果不正确**==
* ==**代码异常终止**==

>代码运行完毕，结果**正确**，退出码返回 ==**0**==
>代码运行完毕，结果**不正确** ， 退出码返回 ==**!0**==，结果不正确的原因有很多
>代码异常终止: 程序崩溃，退出码也就没有意义了。

![[Pasted image 20220527205434.png]]

### 进程退出码

进程的退出码大概有 **`140`** 个
进程退出码可以通过 c语言提供的 `strerror` 函数查看。

```c
#include <stdio.h>
#include <unistd.h>
#include <string.h>
int main()
{
    for(int i  = 0 ; i < 100 ; i++)
    {
        printf("%d : %s\n" , i , strerror(i)); // strerror是打印错误码的函数
    }
    return 100;
}
```

这里并不是完整的退出码，这是部分。
![[Pasted image 20220527211417.png]]

## 进程常见的退出方法
### 正常终止（可以通过 echo $? 查看进程退出码）：
1. 从 **`main`** 返回
2. 调用 **`exit`**
3. **`_exit`**

### 异常退出：
**`ctrl + c`**，信号终止


#### `main` 函数返回
`main` 函数的退出值是进程的退出码。

![[Pasted image 20220527203638.png]]
如以上代码中的main返回值是 **100**； 我们查询到的==退出信号==也 就是 **100** 。
查询退出信号使用 `echo $?`
![[Pasted image 20220527204218.png]]


#### `exit` 函数返回
==作用==：exit在任意地方调用，都代表终止进程，参数是退出码。
需要导入头文件 `stdlib.h`

此代码并不会走到 **return** ， 因为 **exit** 在 **return** 之前使用 **exit** 之后便退出进程了，并显示退出码为 **66**。
```c
int main()
{
    printf("exit 退出码测试\n");
    exit(66);
    
    return 0;//不会使用return退出进程了
}
```
![[Pasted image 20220527212631.png]]


#### `_exit` 函数返回
`_exit` 函数作用也是 退出进程， 但是也exit有些区别。
需要导入头文件 `unistd.h`。
![[Pasted image 20220527215140.png]]

`_exit` 函数是不会负责善后工作的。
![[Pasted image 20220527215228.png]]
```c
int main()
{
    printf("exit 退出码测试");
    sleep(5);

    _exit(10);
    return 100;
}
```
使用exit和 main中的return是 在5秒后会打印输出缓冲区中的内容的， 但是 `_exit` 不会负责这些善后工作，而是直接带着==**退出码**==退出进程。



#### `exit` 、`main return` 与 `_exit`  的一些不同之处

```c
#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <stdlib.h>
int main()
{
    printf("return 退出码测试");
    sleep(5);
    return 100;
}
```
使用这段代码时，`printf` 的内容并不会先显示出来，而是在输出缓冲区中休眠了5秒才打印。

```c
#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <stdlib.h>
int main()
{
    printf("exit 退出码测试");
    sleep(5);

	exit(EXIT_SUCCESS);
}
```
这段代码和上面的一样， 要在输出输出缓冲区中休眠了5秒才打印。
![[Pasted image 20220527214945.png]]
> `exit` or `main return`本身就会要求系统进行，缓冲区刷新！



```c
int main()
{
    printf("exit 退出码测试");
    sleep(5);

    _exit(10);
    return 100;
}
```
使用exit和 main中的return是 在5秒后会打印输出缓冲区中的内容的， 但是 `_exit` 不会负责这些善后工作，而是直接带着==**退出码**==退出进程。
![[Pasted image 20220527215819.png]]

>1.`main`函数`return`,代表进程退出！！
>	* 非`main`函数呢？？ 函数返回！
>
>2.`exit`在任意地方调用，都代表终止进程，参数是退出码！
>
>3.`_exit`终止进程，强制终止进程，不要进行进程的后续收尾工作，比如刷新缓冲区！


# 进程等待

进程等待的函数有：
 ![[Pasted image 20220528080653.png]]


## 进程等待必要性
1. 通过**获取子进程退出的信息**，能够得知子进程执行结果。
2. 可以保证：==时序问题==，子进程先退出，父进程后退出。
3. 进程退出的时候会先进入僵尸状态会造成内存泄漏的问题，需要**通过父进程wait,释放该子进程占用的资源**！

另外，进程旦变成**僵尸状态**，那就刀枪不入，“杀人不眨眼"的 `kill -9` 也无能为力，因为谁也没有办法杀死一个已经死去的进程。

## `wait()` 函数 
`wait()` 只能等待==**指定**==一个子进程。

使用时需要包含头文件 `sys/wait.h`
![[Pasted image 20220527224411.png]]
```c
#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <stdlib.h>
#include <sys/wait.h>
int main()
{
    int id = fork();
    if(id == 0)
    {
        //child
		int cut = 5;
        while(cut)
        {        
	        printf("child[%d] is running : cut is : %d!\n" ,getpid(), cut);
			cut--;
			sleep(1);
        }
		exit(0);
    }
   //parent
   sleep(10);
    printf("father  wait begin!!\n");
	int ret = wait(NULL);
	if(ret > 0)
		printf("father wait : %d\n", ret);
	else
		printf("father wait failed \n");

    sleep(10);
    return 100;
}
```
先让子进程运行5秒，然后退出子进程，在监视的那一头就会显示子进程进入了 ==**Z** 僵尸状态==  ,之后休息10秒，父进程开始等待子进程，当发现子进程的状态后对子进程进行管理，若子进程的状态为 ==**Z**== ，则保存子进程信息后回收子进程。
![[Pasted image 20220527232649.png]]

### `wait()` 的函数参数
>pid_t wait(int* status);

==返回值==：**成功**返回被等待**进程pid**，**失败返回-1**。

==参数== : 输出型参数，**获取子进程退出状态**,不关心则可以设置成为NULL



## `waitpid()`的函数
`waitpid()` 可以等待==**任意**==一个子进程。

代码几乎和`wait()` 的一样，只是将`wait()` 改为 `waitpid()` 。
```c
#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <stdlib.h>
#include <sys/wait.h>
int main()
{
    int id = fork();
    if(id == 0)
    {
        //child
		int cut = 5;
        while(cut)
        {        
	        printf("child[%d] is running : cut is : %d!\n" ,getpid(), cut);
			cut--;
			sleep(1);
        }
		exit(0);
    }
    
   //parent
   sleep(10);
    printf("father  wait begin!!\n");
	int ret = waitpid(id, NULL , 0);
	if(ret > 0)
		printf("father wait : %d\n", ret);
	else
		printf("father wait failed \n");

    sleep(10);
    return 100;
}
```

###  `waitpid()` 函数参数
>pid_ t waitpid(pid_t pid, int* status, int options);

==**返回值**==：
* 当正常返回的时候waitpid返回收集到的子进程的进程ID；
* 如果设置了选项WNOHANG,而调用中waitpid发现没有已退出的子进程可收集,则返回0；
* 如果调用中出错,则返回-1,这时errno会被设置成相应的值以指示错误所在；


==**参数**==
 ==pid==：
	* Pid = -1 , 等待任意一个子进程。与wait等效。
	* Pid > 0 . 等待其进程ID与pid相等的子进程。

==status==:
	* ==WIFEXITED(status)==: 若为正常终止子进程返回的状态，则为真。（查看进程是否是正常退出）
	* ==WEXITSTATUS(status)==: 若WIFEXITED非零，提取子进程退出码。（查看进程的退出码） ^b4ad32

==options==:
	* ==WNOHANG==: 若pid指定的子进程没有结束，则waitpid()函数返回0，不予以等待。若正常结束，则返回该子进程的ID。

看一以下代码
```c
#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <stdlib.h>
#include <sys/wait.h>
int main()
{
    int id = fork();
    if(id == 0)
    {
        //child
		int cut = 5;
        while(cut)
        {        
	        printf("child[%d] is running : cut is : %d!\n" ,getpid(), cut);
			cut--;
			sleep(1);
        }
		exit(10); //退出码改为10
    }
    
   //parent
    printf("father  wait begin!!\n");
    
    int status = 0; //定义status
	int ret = waitpid(id, &status , 0);
	
	if(ret > 0)
		printf("father wait : %d  status：%d\n", ret，status);
	else
		printf("father wait failed \n");
    return 100;
}
```
但是我们发现status的结果并不是 **10** ，而是 2560。
![[Pasted image 20220528083904.png]]

#### status的构成

* wait和waitpid，都有一个status参数，该参数是一个==输出型参数==，由操作**系统填充**。
* 如果==传递NULL==，表示==不关心子进程的退出状态==信息。否则，操作系统会根据该参数，将子进程的退出信息反馈给父进程。
* status不能简单的当作整形来看待，可以当作位图来看待，具体细节如下图（只研究status==**低16比特位**==）
* ![[Pasted image 20220528084249.png]]

最终status一定要让父进程得到子进程的执行结果。

![[Pasted image 20220528085226.png]]

==在代码中可以通过 左移操作符`>>` ， 右移操作符`<<` 来的得到**退出状态**和**终止信号==**。

测试代码
```c
#include <sys/wait.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>

int main( void )
{
	pid_t pid;
	
	if ( (pid=fork()) == -1 )
		perror("fork"),exit(1);
	
	if ( pid == 0 )
	{
		sleep(20);
		exit(10);
	} 
	else 
	{
		int st;	
		int ret = wait(&st);
		if ( ret > 0 && ( st & 0X7F ) == 0 ){ // 正常退出
			printf("child exit code:%d\n", (st>>8)&0XFF); //将退出码右移八位后 & 上 0XFF，即可得到退出码。
		} 
		else if( ret > 0 ) { // 异常退出
			printf("sig code : %d\n", st&0X7F );
		}
	
	}

}
```
`0XFF`  = `1111 1111` 


当然也可以使用 ==**WIFEXITED**==  和 ==**WEXITSTATUS**== 。![[Linux进程控制#^b4ad32]] 
```c
#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <stdlib.h>
#include <sys/wait.h>
int main()
{
                int id = fork();
                if(id == 0)
                {
                        //child
                        int cut = 5;
        while(cut){        
        printf("child[%d] is running : cut is : %d!\n" ,getpid(), cut);
                                        cut--;
                sleep(1);
        }
                        exit(10);
    }
  
	//parent
   printf("father  wait begin!!\n");

    int status = 0;
                int ret = waitpid(id,&status,0);


                if(ret > 0)
      if(WIFEXITED(status))//没有收到任何退出信号
        printf("exit code : %d\n",WEXITSTATUS(status));//正常结束的，获取相应的退出码。

    return 100;
}
```
![[Pasted image 20220528091820.png]]


![[Pasted image 20220528092236.png]]


#### options 的构成
##### 进程的阻塞等待
阻寒的本质：其实是进程的PCB被放入了等待队列，并将进程的状态改为S状态。

返回的本质：进程的PCB从等待队列拿到R队列，从而被CPU调度。


##### 进程的非阻塞等待
看到某些应用或者OS本身，卡住了长时间不动，应用或者程序==hang==住了。

在options参数选项填入 ==**WNOHANG**==。

WNOHANG:非阻塞。
```c
#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <stdlib.h>
#include <sys/wait.h>
int main()
{
	int id = fork();
	if(id == 0)
	{
		//child
		int cut = 10;
        while(cut)
        {        
	        printf("child[%d] is running : cut is : %d!\n" ,getpid(), cut);
			cut--;
			sleep(1);
        }
		exit(10);
    }
    
    int status  = 0;
    while(1)
    {
	    int ret = waitpid(id , &status , WNOHANG);
	    if(ret == 0)
	    {
	      //子进程没有退出，但是waitpid的等待是成功的，需要父进程重复进行等待
	      printf("Do my things! \n");
	    }
	    else if(ret > 0) // 子进程退出了，waitpid也成功了，获取到了对应的结果
	    {
	      printf("father wait : %d , success , status exit code : %d m status exit signal : %d \n", ret , (status >> 8)&0xFF, status&0x7F );
	      break;
	    }
	    else{ // ret < 0 ,等待失败
	      perror("waitpid");
	        break;
	    }
	    sleep(1);
    }
	return 0;
}
```

此时的父子进程都在同时进行了。
![[Pasted image 20220528095540.png]]


# 进程程序替换
## 替换原理
用fork创建子进程后执行的是和父进程相同的程序(但有可能执行不同的代码分支),子进程往往要调用一种==exec函数==以**执行另一个程序**。**当进程调用一种exec函数时,该进程的用户空间代码和数据完全被新程序替换,从新程序的启动例程开始执行**。==调用exec并不创建新进程,所以调用exec前后该进程的id并未改变==。

**进程不变，仅仅替换当前进程的代码和数据的技术，叫做，进程的程序替换！**
>有没有创建任何新的进程？？
>没有！！

如，将我们的代码和数据，直接替换到进程的物理地址之中，即完成了进程的程序替换。
![[Pasted image 20220528095902.png]]

## 进程替换函数
![[Pasted image 20220528100715.png]]
>int execve(const char *path, char *const argv[], char *const envp[]);


![[Pasted image 20220530214610.png]]
其中 `execve` 是系统调用， 其余的五个函数都是以 `execve` 为基本 来进行封装的。




### 函数解释
1. 这些函数如果**调用成功**则加载新的程序从启动代码开始执行,**不再返回**。
2. 如果**调用出错**则返回==**-1**==。 
3. 所以`exec`函数**只有出错的返回值**而没有成功的返回值。

### 命名理解
这些函数原型看起来很容易混,但只要掌握了规律就很好记。
> ==**l**==(list) : 表示参数采用列表
> ==**v**==(vector) : 参数用数组
> ==**p**==(path) : 有p自动搜索环境变量PATH
> ==**e**==(env) : 表示自己维护环境变量

![[Pasted image 20220530192819.png]]


### `execl` 函数
```c
#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <stdlib.h>
#include <sys/wait.h>
int main()
{
  printf("i am a process! ,pid : %d\n" , getpid());
  execl("/usr/bin/ls","ls" , "-a" ,"-l", NULL);  

  printf("hahahhahahahahha\n");
  printf("hahahhahahahahha\n");
  printf("hahahhahahahahha\n");
  printf("hahahhahahahahha\n");
  printf("hahahhahahahahha\n");
  return 0;
}
```
当代码走到 execl时 ，就会被进程替换了，此处是替换为了 `ls` 指令,进程替换后就不会执行后续的代码，因为进程已经被替换。

执行结果
![[Pasted image 20220528101720.png]]


![[Pasted image 20220528102319.png]]


![[Pasted image 20220528103704.png]]
![[Pasted image 20220528103723.png]]

只要进程的程序替换成功，就不会执行后续代码，意味着`exec*`函数，成功的时候，不需要返回值检测！
只要`exec*`  返回了，就一定是因为调用失败了。
```c
int main()
{
	printf("I am a process!,pid:%d\n",getpid());
	//只要进程的程序替换成功，就不会执行后续代码，意味着exec*函数，成功的时候，不需要返回值检测！
	//只要exec*返回了，就一定是因为调用失败了！！！！！！！！I
	execl("/usr/bin/1ssss","1s","-a","-1",NULL);//execl执行程序替换exit(1);
	
	printf ("hahahhaahha\n");
	printf ("hahahhaahha\n");
	printf("hahahhaahha \n");
	printf("hahahhaahha\n");
	return 0;
}
```
执行结果
![[Pasted image 20220528104256.png]]


>int execl(const char* path, const char* arg, ...);

* ==path== 你的要执行的目标程序的全路径所在路径/文件名 .
* ==arg==   要执行的目标程序在命令行上怎么执行这里参数就怎么一个一个的传递进去.
* ==...==  可变参数列表。


![[Pasted image 20220528105119.png]]




### `execlp` 函数
>int execlp(const char * file , const char * arg , ...);

**第一个参数可以直接使用文件名进行传参；** 如 需要替换 `ls`  ，在第一个参数就直接使用 `ls` 就行了。 


`exec`后面的 `lp` 分别代表：
> ==**l**==(list) : 表示参数采用列表 ， 
> ==**p**==(path) : 有p自动搜索环境变量PATH



```cpp
#include <stdio.h>
#include <unistd.h>
int main()
{
  printf("process chaneg beginning ...\n");

  execlp("ls" , "ls" , "-a" , "-l" , NULL);

  printf("process change fail");
  return 0;
}
```
运行结果：
![[Pasted image 20220530202640.png]]



### `execle` 函数
>int execle(const char * path , const char * arg, ... , char * const envp[]);


> ==**l**==(list) : 表示参数采用列表
> ==**e**==(env) : 表示自己维护环境变量

带e的，需要自己组装环境变量

我们需要创建两个文件，用[[makefile的使用|makefile]]编写一下
![[Pasted image 20220530212705.png]]

main.c 文件
```c
#include <stdio.h>
#include <unistd.h>
int main()
{
  printf("process chaneg beginning ...\n");

  char* env[] = {
    "TEST1 = emmmmmmm",
    "TEST2 = yhhhhhhh",
    "TEST3 = emmyhh",
    NULL
  };

  execle("./myload" , "myload" , NULL , env);

  printf("process change fail");
  return 0;
}
```

myload.c 文件
```c
#include <stdio.h>

int main()
{
    extern char** environ;
    for(int i = 0; environ[i]; i++){
        printf("%s\n", environ[i]);
    }

    printf("my exe running .... done\n");
    return 0;
}
```

运行可执行文件时 ==**myload**== 时
![[Pasted image 20220530213223.png]]
运行==**myload**==只执行文件时，其中打印的我们的环境变量。


而当我们在==**myexec**==可执行文件中，使用使用程序替换后的结果。
![[Pasted image 20220530213432.png]]
成功的使用 **`env`** 替换了myload中的环境环境变量。





### `execv` 函数
>int execv(const char *path, char *const argv[]);

> ==**v**==(vector) : 参数用数组

**其实就是将 “你想怎么执行” 这个步骤放到一个指针数组中。**

```c
#include <stdio.h>
#include <unistd.h>
int main()
{
  printf("process chaneg beginning ...\n");

  char* argv[] = { //指针数组中放的就是 “你想怎么执行” 这个步骤。
    "ls",
    "-a",
    "-l",
    NULL
  }; 

  execv("/usr/bin/ls",argv);//将argv传入execv，它会按数组中的字符串顺序依次执行。

  printf("process change fail");
  return 0;
}
```

![[Pasted image 20220530204740.png]]



### `execvp` 函数
>int execvp(const char* file  , char* const argv[]);

> ==**v**==(vector) : 参数用数组
> ==**p**==(path) : 有p自动搜索环境变量PATH

第一个参数直接传入我们要使用的文件名即可，因为它会去环境变量中寻找。
第二个参数就需要定义一个数组指针，要执行的命令就放在其中。

```c
#include <stdio.h>
#include <unistd.h>
int main()
{
  printf("process chaneg beginning ...\n");

  char* argv[] = { //指针数组中放的就是 “你想怎么执行” 这个步骤。
    "ls",
    "-a",
    "-l",
    NULL
  }; 

  execv("ls",argv);

  printf("process change fail");
  return 0;
}
```


### `execve` 函数
>int execve(const char* path  ,  char* const argv[], char* const envp[]);

> ==**v**==(vector) : 参数用数组
> ==**e**==(env) : 表示自己维护环境变量

此函数其实和上面的 `execv` 和 `execle` 这两个函数很相同。

```c
#include <stdio.h>
#include <unistd.h>
int main()
{
  printf("process chaneg beginning ...\n");

  char* argv[] = {
    "ls",
    "-a",
    "-l",
    NULL
  }; 
  
  char* env[] = {
    "TEST1 = emmmmmmm",
    "TEST2 = yhhhhhhh",
    "TEST3 = emmyhh",
    NULL
  };
  
  execve("./myload" , argv , env);
  printf("process change fail");
  return 0;
}
```

# 小练习

## 实现一个 `mini_shell`

```c
#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <stdlib.h>
#include <sys/wait.h>

#define NUM 128
#define CMD_NUM 64

int main()
{

    char command[NUM];
    while(1){
        char *argv[CMD_NUM] = { NULL };
        
        //1. 打印提示符
        command[0] = 0; //用这种方式，可以做到O(1)时间复杂度，清空字符串
        printf("[fmy@myhost EmmYhh]# ");
        fflush(stdout);

        //2. 获取命令字符串
        fgets(command, NUM, stdin);
        command[strlen(command) - 1] = '\0'; //"ls\n\0"


        //"ls -a -b -c\0";
        //3. 解析命令字符串, char *argv[]
        const char *sep = " ";
        argv[0] = strtok(command, sep);
        int i = 1;
        while(argv[i] = strtok(NULL, sep))
        {
            i++;
        }

        //4.检测命令是否是需要shell本身执行的，内建命令
        if(strcmp(argv[0], "cd") == 0)
        {
            if(argv[1] != NULL) 
            {
	            chdir(argv[1]);
	        }
	        
            continue;
        }

        //5. 执行第三方命令
        if(fork() == 0)
        {
            //child
            execvp(argv[0], argv);
            exit(1);
        }

        int status = 0;
        waitpid(-1, &status, 0);
        printf("exit code: %d\n", (status >> 8)&0xFF);
    }
}
```

![[Pasted image 20220605144659.png]]