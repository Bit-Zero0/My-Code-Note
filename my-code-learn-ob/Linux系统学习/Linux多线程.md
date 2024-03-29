# 什么是线程
线程:是在进程内部运行的一个执行分支(执行流)，属于进程的一部分，粒度要比进程更加细和轻量化。一般叫做：==**TCB**==

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315201714.png)


## 线程的优缺点
### 线程的优点
- 创建一个新线程的代价要比创建一个新进程小得多
- 与进程之间的切换相比，线程之间的切换需要操作系统做的工作要少很多 
- 线程占用的资源要比进程少很多
- 能充分利用多处理器的可并行数量
- 在等待慢速I/O操作结束的同时，程序可执行其他的计算任务
- 计算密集型应用，为了能在多处理器系统上运行，将计算分解到多个线程中实现 
- I/O密集型应用，为了提高性能，将I/O操作重叠。线程可以同时等待不同的I/O操作。


### 线程的缺点
1. 性能损失
	- 一个很少被外部事件阻塞的计算密集型线程往往无法与共它线程共享同一个处理器。如果计算密集型线程的数量比可用的处理器多，那么可能会有较大的性能损失，这里的性能损失指的是增加了额外的同步和调度开销，而可用的资源不变。
2. 健壮性降低
	- 编写多线程需要更全面更深入的考虑，在一个多线程程序里，因时间分配上的细微偏差或者因共享了不该共享的变量而造成不良影响的可能性是很大的，换句话说线程之间是缺乏保护的。
3. 缺乏访问控制
	- 进程是访问控制的基本粒度，在一个线程中调用某些OS函数会对整个进程造成影响。 
4. 编程难度提高
	- 编写与调试一个多线程程序比单线程程序困难得多



# Linux的进程的概念
==**Linux中没有专门为线程设计TCB，而是用进程的PCB来模拟线程**==
优点：不用维护复杂的进程和线程的关系，不用单独为线程设计任何算法,直接使用进程的一套相关的方法。0S只需要聚焦在线程间的资源分配上就可以了!
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315201735.png)

进程是承担分配系统资源的基本实体! !
线程是CPU调度的基本单位，承担进程资源的一部分的基本实体！
==**进程划分资源给线程**==
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315201746.png)


## 之前学的进程 vs 今天的进程
之前学的进程,内部只有一个执行流的进程

今天的进程,内部可以具有多个执行流



## Linux线程与接口关系的认识
Linux PCB<=传统意义上的进程PCB Linux进程，轻量级进程
1. OS创建"线程"
2. CPU调度

Linux因为是用进程模拟的，所以Linux下不会给我们提供直接操作线程的接口，而是给我们提供，在同一个地址空间内创建PCB的方法，分配资源给指定的PCB的接口
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315202027.png)

系统级别的工程师，在用户层对Linux轻量级进程接口进行封装,给我们打包成库，让用直接使用库接口，**原生线程库**(用户层)


## Linux进程VS线程

### 进程和线程
**进程是资源分配的基本单位** 
**线程是调度的基本单位**
**线程共享进程数据，但也拥有自己的一部分数据**
>线程ID 
>一组寄存器 
>栈
>errno
>信号屏蔽字 
>调度优先级


进程的多个线程共享  同一地址空间,因此Text Segment、Data Segment都是共享的,如果定义一个函数,在各线程中都可以调用,如果定义一个全局变量,在各线程中都可以访问到,除此之外,各线程还**共享以下进程资源和环境**:
>文件描述符表
>每种信号的处理方式(SIG_ IGN、SIG_ DFL或者自定义的信号处理函数) 
>当前工作目录
>用户id和组id

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315202051.png)





# pthread_create() 函数
作用：创建一个线程
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315202109.png)

函数参数：
>==**thread**==:返回线程ID
>==**attr**==:设置线程的属性，attr为NULL表示使用默认属性 
>==**start_routine**==:是个函数地址，线程启动后要执行的函数 
>==**arg**==:传给线程启动函数的参数
>==**返回值**==：成功返回0；失败返回错误码



```c
#include <stdio.h>
#include <pthread.h>//想要调用pthread.h中的函数必须在编译时，动态链接到pthread库
#include <unistd.h>

void *thread_run(void *args)
{
    const char *id = (const char*)args;
    while(1)
    {
        printf("我是%s线程, %d\n", id, getpid());
        sleep(1);
    }
}

int main()
{
    pthread_t tid;
    pthread_create(&tid, NULL, thread_run, (void*)"thread 1");

    while(1){
        printf("我是main 线程, %d\n", getpid());
        sleep(1);
    }
}
```
使用：`gcc  xxx.c -lpthread` 进行编译。

运行结果，发现在进程中只有一个进程，因为thread是一个线程，pid是与进程共享的。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315202139.png)


使用9号指令关闭进程，线程也相应关闭了。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315202146.png)



可以使用 [[linux常用命令#ps -aL|ps -aL]]指令来查看轻量级进程，也就是线程，可以看到线程的pid和进程pid是相同的，我们可以通过==**LWP**==来分辨线程，进程的PID和LWP是相同的，线程会比进程多1。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315202150.png)



## pthread_self()
==作用==：获得此线程的ID
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315202223.png)

建议在线程创建中的 thread_run() 函数中使用。




## 创建多个进程 并 验证健壮性
可以使用for循环来创建 多个线程，但是线程有个缺点：健壮性弱
只要有个线程因为因为错误崩了，相关的所有进程与线程都会崩溃。

==**线程崩溃的影响一定是有限的->在进程内部->进程具有独立性!**==
```c
#include <stdio.h>
#include <unistd.h>
#include <pthread.h>


void* thread_run(void* args)
{
    int num = *(int*)args;
    while(1)
    {
        printf("我是新进程[%d] , 我创建的线程ID是：%lu\n", num , pthread_self());
        sleep(10);
        if(num == 3)//野指针问题
        {
            printf("thread number : %d , quit \n" , num);
            int* p = NULL;
            *p = 10;
        }
    }
}


int main()
{
    pthread_t tid[5];

    for(int i = 0; i < 5 ; i++)
    {
        pthread_create(tid+i , NULL, thread_run ,(void*)&i );
        sleep(1);
    }

    while(1)
    {
        printf("##################begin###################\n");
        for(int i = 0 ; i < 5 ; i++ )
        {
            printf("我创建的线程[%d]是：%lu\n", i ,tid[i]);
        }
        printf("##################end####################\n");
        sleep(1);
    }

    return 0;
}
```
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315202300.png)



# pthread_join()
一般而言，线程也是需要等待的，如果不等待，可能会出现“僵尸进程”的问题
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315202317.png)


## 函数参数：
==thread==: 也就是我们得到的线程ID
==retral== ：是获取thread_run 函数的返回值。
==返回值==：成功则返回0，失败返回 **错误码**

## pthread_join()实例代码
```c
#include <stdio.h>
#include <unistd.h>
#include <pthread.h>


void* thread_run(void* args)
{
    int num = *(int*)args;
    while(1)
    {
        printf("我是新进程[%d] , 我创建的线程ID是：%lu\n", num , pthread_self());
        sleep(5);
	    break;
    }

    return (void*)100;
}

#define NUM 1
int main()
{
    pthread_t tid[NUM];

    for(int i = 0; i < NUM ; i++)
    {
        pthread_create(tid+i , NULL, thread_run ,(void*)&i );
        sleep(1);
    }

    void* status = NULL;//因为pthread_join函数的第二个参数是 二级指针，所以需要使用一级指针来存储

    pthread_join(tid[0] , &status );

    printf("ret : %d\n" , (int)status);

    return 0;
}

```
等待成功
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315202346.png)


线程只用关心代码跑完结果是对还是不对，不关心异常，因为异常是由进程负责的。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315202353.png)



**注意：等待多个线程的时，需要一个一个的等，也需要用到循环**





# 线程终止
如果需要只终止某个线程而不终止整个进程,可以有三种方法:
1. 函数中return(a. main函数退出return的时候代表(主线程and进程退出)     b.其他线程函数return，只代表当前线程退出)
2．新线程通过pthread_exit()终止自己( vs exit()是终止进程，不要在其他线程中调用，如果你就想终止一个线程的话! !)
3.使用pthread_cancel()取消目标线程!

## pthread_exit()
==作用==：终止本线程
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315202530.png)

### 函数参数
==retval== : retval不要指向一个局部变量。
==返回值==：无返回值，跟进程一样，线程结束的时候无法返回到它的调用者（自身）

>需要注意,pthread_exit或者return返回的指针所指向的内存单元必须是全局的或者是用malloc分配的,不能在线程函数的栈上分配,因为当其它线程得到这个返回指针时线程函数已经退出了。


### pthread_exit()实例
```c
#include <stdio.h>
#include <unistd.h>
#include <pthread.h>


void* thread_run(void* args)
{
    int num = *(int*)args;
    while(1)
    {
        printf("我是新进程[%d] , 我创建的线程ID是：%lu\n", num , pthread_self());
        sleep(5);
        pthread_exit((void*)765);
       break;
    }

    return (void*)100;
}

#define NUM 1
int main()
{
    pthread_t tid[NUM];
    for(int i = 0; i < NUM ; i++)
    {
        pthread_create(tid+i , NULL, thread_run ,(void*)&i );
        sleep(1);
    }

    void* status = NULL;

    pthread_join(tid[0] , &status );

    printf("ret : %d\n" , (int)status);
    return 0;
}

```
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315202554.png)





## pthread_cancel()
作用：终止本进程或其他线程
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315202600.png)


### 函数参数
==thread==:线程ID
==返回值==：成功返回0；失败返回错误码



### pthread_cancel()实例
```c
#include <stdio.h>
#include <unistd.h>
#include <pthread.h>

pthread_t g_id;

void* thread_run(void* args)
{
    int num = *(int*)args;
    while(1)
    {
        printf("我是新进程[%d] , 我创建的线程ID是：%lu\n", num , pthread_self());
        sleep(10);
        break;

    }
}

#define NUM 1
int main()
{
    pthread_t tid[NUM];

    g_id = pthread_self();

    for(int i = 0; i < NUM ; i++)
    {
        pthread_create(tid+i , NULL, thread_run ,(void*)&i );
        sleep(1);
    }
    printf("wait sub thread... \n");

    sleep(1);

    printf("cancel sub thread ...\n");
    pthread_cancel(tid[0]);
    
    void* status = NULL;

    sleep(3);

    pthread_join(tid[0] , &status );

    printf("ret : %d\n" , (int)status); 

    return 0;
}

```
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315202645.png)

成功退出指定线程后，线程函数带回的返回值是 ==**-1**==。




线程可以使用pthread_cancel() 可以关闭主线程，但是主线程会是 ==**僵尸进程**== ，因为线程还在进程中运行
```c
#include <stdio.h>
#include <unistd.h>
#include <pthread.h>

pthread_t g_id;

void* thread_run(void* args)
{
    int num = *(int*)args;
    while(1)
    {
        printf("我是新进程[%d] , 我创建的线程ID是：%lu\n", num , pthread_self());
        sleep(2);
        pthread_cancel(g_id);
    }
}

#define NUM 1
int main()
{
    pthread_t tid[NUM];

    g_id = pthread_self();

    for(int i = 0; i < NUM ; i++)
    {
        pthread_create(tid+i , NULL, thread_run ,(void*)&i );
        sleep(1);
    }
    printf("wait sub thread... \n");

    sleep(30);

    printf("cancel sub thread ...\n");

    pthread_cancel(tid[0]);
    void* status = NULL;

    sleep(3);

    pthread_join(tid[0] , &status );

    printf("ret : %d\n" , (int)status);

    return 0;
}

```
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315202701.png)

 defunct 就表示僵尸进程。
 此时使用进程查询也能查询到进程处于 Z 状态
 ![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315202706.png)



# 线程分离
默认情况下，新创建的线程是join的，线程退出后，需要对其进行pthread_join操作，否则无法释放 
资源，从而造成系统泄漏。
如果不关心线程的返回值，join是一种负担，这个时候，我们可以告诉系统，当线程退出时，自动释放线 
程资源。
## pthread_datach()
可以是线程组内其他线程对目标线程进行分离，也可以是线程自己分离:
join和分离是冲突的，一个线程不能既是join又是分离的。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315202810.png)


```c
#include <stdio.h>
#include <unistd.h>
#include <pthread.h>

pthread_t g_id;

void* thread_run(void* args)
{
    pthread_detach(pthread_self());//进行线程分离    
    int num = *(int*)args;
    while(1)
    {
        printf("我是新进程[%d] , 我创建的线程ID是：%lu\n", num , pthread_self());
        sleep(10);


    }

    return (void*)100;
}

#define NUM 1
int main()
{
    pthread_t tid[NUM];

    g_id = pthread_self();

    for(int i = 0; i < NUM ; i++)
    {
        pthread_create(tid+i , NULL, thread_run ,(void*)&i );
        sleep(1);
    }
    printf("wait sub thread... \n");

    sleep(5);

    printf("cancel sub thread ...\n");

    pthread_cancel(tid[0]);
    void* status = NULL;

    sleep(3);

    pthread_join(tid[0] , &status );//最好不要join

    printf("ret : %d\n" , (int)status);


    return 0;
}

```

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315202826.png)




# 我们看到的线程ID
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315202831.png)

我们查看到的线程id是pthread库的线程id，不是Linux内核中的LWP，pthread库的线程id是一个内存地址!!!

pthread_ create函数第一个参数指向一个虚拟内存单元，该内存单元的地址即为新创建线程的线程ID， 
属于NPTL线程库的范畴。线程库的后续操作，就是根据该线程ID来操作线程的。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315202904.png)

在物理内存中，一定会加载pthread[[Linux IO操作#动态库的构成|动态库]]，然后通过页表映射到了虚拟地址中的mmap区域，也就是共享区。

每个线程都有要运行的临时数据，所以每个线程都有自己的**私有**栈结构，在物理地址中，一定会使用像 `tcb tcbs[1000]` 的数组形式来存储线程的结构，映射到了虚拟地址后，由动态库对其进行维护，如图中的`pthread_t tid` 来对相应线程进行管理。


## 用户级线程怎么对应内核级的轻量级进程呢？
其实就像 [[Linux IO操作#文件描述符 fd|FIFE->fd]]的关系一样，在用户级线程一定要包含LWP来找到内核中的对应的内核级线程。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315202909.png)



# 线程互斥
需具有的背景知识
- ==临界资源==：多线程执行流共享的资源就叫做临界资源
- ==临界区==：每个线程内部，访问临界资源的代码，就叫做临界区
- ==互斥==：任何时刻，互斥保证有且只有一个执行流进入临界区，访问临界资源，通常对临界资源起保护作用 
- ==原子性==（后面讨论如何实现）：不会被任何调度机制打断的操作，该操作只有两态，要么完成，要么未完成



## 线程互斥的必要性
因为多个线程是共享地址空间的，也就是很多资源都是共享的
优点:通信方便
缺点:缺乏访问控制
因为一个线程的操作问题，给其他线程造成了不可控，或者引起崩溃，异常，逻辑不正确等问题，这种现象:==**线程安全**==
创建一个函数没有线程安全问题的话，不要使用全局，stl， malloc， new等会在全局内有效的数据，使用的话也需要==**访问控制**==

那为什么我们之前使用的那些变量没有问题？ ==因为全部都是局部变量!线程有自己的独立栈结构!==


综上，所以我们需要线程的==互斥==与==同步==

```cpp
#include <iostream>
#include <unistd.h>
#include <pthread.h>
#include <cstdio>
#include <string>
#include <ctime>

// 抢票逻辑，10000票，5线程同时再抢
//tickets是不是就是所谓的临界资源！ tickets-- 是原子的吗？(是安全的吗？)
//为了让多个线程进行切换，线程什么时候可能切换(1. 时间片到了 2. 检测的时间点：从内核态返回用户态的时候)
int tickets = 1000;

void* pthread_route(void *args)
{
    int id = *(int*)args;

    delete (int*)args;
    while(true)
    {
        if(tickets > 0 )
        {
            usleep(1000);
            std::cout << "我是[" << id << "]我要抢的票是："<< tickets << std::endl;
            tickets--;
            printf("");
        }
        else
        {
            break;
        }
    }
}

int main()
{
    pthread_t tid[5];
    for(int i = 0 ; i < 5 ; i++)
    {
        int *id = new int(i);
        pthread_create(tid+i , nullptr , pthread_route , (void*)id );
    }

    for(int i = 0 ; i < 5 ; i++)
    {
        pthread_join(tid[i] , nullptr);
    }
    return 0;
}
```
发现票被抢到了负数。原因就在于 tickets不是==**原子**==的。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315203201.png)


## `--` 和 `++`的原子性探讨
为了让多个线程进行切换，线程什么时候可能切换
1. 时间片到了 
2. 检测的时间点：从内核态返回用户态的时候


因为 `--` 或 `++` 在汇编中是多行代码，并非是原子的
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315203206.png)

所以当线程在CPU寄存器中进行运算时，随时都有可能被切走。

- 若此时A线程的tickets计算到了999，A线程就会将其保存到了A线程的上下文中。
- 随后切换到B线程，B线程比较幸运，一直运算到将1000 减到了 10，但也还没运算结束，保存上下文数据到B线程中。
- 随后在切换到A线程，恢复A线程的上下文数据，A线程的tickets是999，故此tickets又恢复到了999，B线程之前的工作也就白做了。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315203229.png)






## 互斥量的接口
```c
NAME
       pthread_mutex_destroy, pthread_mutex_init - destroy  and  initialize  a
       mutex

SYNOPSIS
       #include <pthread.h>

       int pthread_mutex_destroy(pthread_mutex_t *mutex);//销毁锁
       
       int pthread_mutex_init(pthread_mutex_t *restrict mutex,const pthread_mutexattr_t *restrict attr); //对锁进行初始化
       
       pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;//创建锁变量

```

### 初始化互斥量
初始化互斥量有两种方法：
方法1，静态分配:
`pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER`

方法2，动态分配:
`int pthread_mutex_init(pthread_mutex_t *restrict mutex, const pthread_mutexattr_t *restrict attr);`
>参数：
>	mutex：要初始化的互斥量 
>	attr：NULL


### 销毁互斥量
`int pthread_mutex_destroy(pthread_mutex_t *mutex)；`

>销毁互斥量需要注意：
>	- 使用 `PTHREAD_ MUTEX_ INITIALIZER` 初始化的互斥量不需要销毁 
>	- 不要销毁一个已经加锁的互斥量
>	- 已经销毁的互斥量，要确保后面不会有线程再尝试加锁


### 互斥量加锁和解锁
```c
NAME
       pthread_mutex_lock, pthread_mutex_trylock, pthread_mutex_unlock -  lock
       and unlock a mutex

SYNOPSIS
       #include <pthread.h>

       int pthread_mutex_lock(pthread_mutex_t *mutex);
       int pthread_mutex_trylock(pthread_mutex_t *mutex);
       int pthread_mutex_unlock(pthread_mutex_t *mutex);
```

`int pthread_mutex_lock(pthread_mutex_t *mutex);` 
`int pthread_mutex_unlock(pthread_mutex_t *mutex); `
返回值:成功返回0,失败返回错误号

>调用 pthread_ lock 时，可能会遇到以下情况:
>	- 互斥量处于未锁状态，该函数会将互斥量锁定，同时返回成功
>	- 发起函数调用时，其他线程已经锁定互斥量，或者存在其他线程同时申请互斥量，但没有竞争到互斥量， 
>	- 那么pthread_ lock调用会陷入阻塞(执行流被挂起)，等待互斥量解锁。



## 互斥量实现原理探究
经过上面的例子，大家已经意识到单纯的 i++ 或者 ++i 都不是原子的，有可能会有数据一致性问题为了实现互斥锁操作,大多数体系结构都提供了==**swap**== 或==**exchange**==指令,该指令的作用是把寄存器和内存单元的数据相交换,由于只有一条指令,保证了原子性,即使是多处理器平台,访问内存的  总线周期也有先后,  现在我们把lock和unlock的伪代码改一下
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315203331.png)


swap 和 exchange 指令
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315203336.png)

如上图所示，其实就是将线程A或线程B一起去申请 锁(mutex) ,  
==注意：当CPU执行线程的代码的时候，CPU内寄存器内的数据，是不是线程私有的!   **答案：是的，其实就是执行流的上下文**==
`%al` 是一个CPU寄存器,`movb`指令 其实就是在设置线程自己的上下文数据

`xchgb`指令使用一行汇编，原子性的完成共享的内存数据mutex，交换到线程A的上下文中，从而实现私有的过程!! 
如：线程A先进行`xchgb`指令中，将`%al`中的值与内存中**mutex**的值进行交换，之后线程A被切走，当线程B进入`xchgb`中时，但发现**mutex**的值已经被线程A给拿走了，这就是线程A竞争到了 锁。

==**mutex的本质:其实是通过一条汇编，将锁数据交换到自己的上下文中! !**==


## 对线程进行加锁
写个抢票小程序，如果再不加锁的情况下，抢票时可能会出现负数，或多人抢到了同一张票，这就是因为抢票这个动作不是原子的，所以需要加锁
```cpp
#include <iostream>
#include <unistd.h>
#include <pthread.h>
#include <cstdio>
#include <string>
#include <ctime>

// 抢票逻辑，10000票，5线程同时再抢
//tickets是不是就是所谓的临界资源！ tickets-- 是原子的吗？(是安全的吗？)
//为了让多个线程进行切换，线程什么时候可能切换(1. 时间片到了 2. 检测的时间点：从内核态返回用户态的时候)
//int tickets = 1000;

class Ticket
{
private:
    int tickets;
    pthread_mutex_t mtx;//定义 锁变量

public:
    Ticket()
        :tickets(1000)
    {
        pthread_mutex_init(&mtx , nullptr); //对锁进行初始化
    }

    ~Ticket()
    {
        pthread_mutex_destroy(&mtx);//使用析构函数来销毁锁
    }
    bool GetTicket()
    {
        bool res = true;
        pthread_mutex_lock(&mtx); //对以下代码进行加锁
        if(tickets > 0 )
        {
            usleep(100);
            std::cout << "我是[" << pthread_self() << "]我要抢的票是："<< tickets << std::endl;
            tickets--;
            printf("");
        }
        else
        {
            printf("票已经被抢空\n");
            res = false;
        }
        pthread_mutex_unlock(&mtx);//与lock对应，进行解锁
        return res;
    }
};

void* pthread_route(void *args)
{
   Ticket *t = (Ticket*)args;

    while(true)
    {
      if (!t->GetTicket())//每次抢票后，退出循环，因为要给其他线程进行抢票
		break;
    }
}

int main()
{
    Ticket* t = new Ticket();
    pthread_t tid[5];
    for(int i = 0 ; i < 5 ; i++)
    {
        int *id = new int(i);
        pthread_create(tid+i , nullptr , pthread_route , (void*)t );
    }

    for(int i = 0 ; i < 5 ; i++)
    {
        pthread_join(tid[i] , nullptr);
    }
    return 0;
}
```
此时的抢票程序是原子的了，就不会出现负数，或多人抢到了同一张票。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315203504.png)


每个线程抢到的票都是不固定的，是因为每个线程抢票的时间片不同，所以票的多少是不一的，而且因为没有同步机制。使用锁的线程，离锁比较近，所以竞争能力强，很容易申请到锁。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315203510.png)





## '锁' 是临界资源吗？
其实锁也是一种临界资源，因为它也可以被其他线程看到，不然无法保护 临界区。

### 锁的工作方式
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315203555.png)



# 可重入VS线程安全 
## 概念
- ==**线程安全**==：多个线程并发同一段代码时，不会出现不同的结果。常见对全局变量或者静态变量进行操作，并且没有锁保护的情况下，会出现该问题。
- ==**重入**==：同一个函数被不同的执行流调用，当前一个流程还没有执行完，就有其他的执行流再次进入，我们称之为重入。一个函数在重入的情况下，运行结果不会出现任何不同或者任何问题，则该函数被称为可重入函数，否则，是不可重入函数。


## 常见的线程不安全的情况
- 不保护共享变量的函数
- 函数状态随着被调用，状态发生变化的函数 
- 返回指向静态变量指针的函数
- 调用线程不安全函数的函数

## 常见的线程安全的情况
- 每个线程对全局变量或者静态变量只有读取的权限，而没有写入的权限，一般来说这些线程是安全的 
- 类或者接口对于线程来说都是原子操作
- 多个线程之间的切换不会导致该接口的执行结果存在二义性

## 常见不可重入的情况
- 调用了malloc/free函数，因为malloc函数是用全局链表来管理堆的
- 调用了标准I/O库函数，标准I/O库的很多实现都以不可重入的方式使用全局数据结构 
- 可重入函数体内使用了静态的数据结构


## 常见可重入的情况
- 不使用全局变量或静态变量
- 不使用用malloc或者new开辟出的空间 
- 不调用不可重入函数
- 不返回静态或全局数据，所有数据都有函数的调用者提供
- 使用本地数据，或者通过制作全局数据的本地拷贝来保护全局数据

## 可重入与线程安全联系
- 函数是可重入的，那就是线程安全的
- 函数是不可重入的，那就不能由多个线程使用，有可能引发线程安全问题 
- 如果一个函数中有全局变量，那么这个函数既不是线程安全也不是可重入的。

## 可重入与线程安全区别
- 可重入函数是线程安全函数的一种
- ==线程安全不一定是可重入的，而可重入函数则一定是线程安全的。==
- 如果将对临界资源的访问加上锁，则这个函数是线程安全的，但如果这个重入函数若锁还未释放则会产生死锁，因此是不可重入的。

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315203617.png)

就如上图，main函数进入insert中申请了一把锁，通过信号递达后，由需要再次进入insert函数，又需要再次申请锁，但是锁被自己占用着，形成了一种骑驴找驴的现象。所以==线程安全不一定是可重入的，而可重入函数则一定是线程安全的。==

==**时刻注意死锁四个必要条件**==
- 互斥条件：一个资源每次只能被一个执行流使用
- 请求与保持条件：一个执行流因请求资源而阻塞时，对已获得的资源保持不放 
- 不剥夺条件:一个执行流已获得的资源，在末使用完之前，不能强行剥夺 
- 循环等待条件:若干执行流之间形成一种头尾相接的循环等待资源的关系


# 条件变量
- 当一个线程互斥地访问某个变量时，它可能发现在其它线程改变状态之前，它什么也做不了。
- 例如一个线程访问队列时，发现队列为空，它只能等待，只到其它线程将一个节点添加到队列中。这种情况就需要用到条件变量。

==**同步**==：在保证数据安全的前提下，让线程能够按照某种特定的顺序访问临界资源，从而有效避免饥饿问题，叫做同步
==**竞态条件**==：因为时序问题，而导致程序异常，我们称之为竞态条件。

## pthread_cond
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315203636.png)


### 条件变量初始化
```c
int pthread_cond_init(pthread_cond_t *restrict cond,const pthread_condattr_t *restrict attr);
```
>参数：
>	- cond：要初始化的条件变量 
>	- attr：NULL


### 条件变量销毁
```c
int pthread_cond_destroy(pthread_cond_t* cond)
```



### 等待条件满足
```c
int pthread_cond_wait(pthread_cond_t *restrict cond,pthread_mutex_t *restrict mutex); 
```
>参数：
>	- cond：要在这个条件变量上等待 
>	- mutex：互斥量，后面详细解释


### 唤醒等待
```c
int pthread_cond_broadcast(pthread_cond_t* cond); //唤醒所有等待中的线程

int pthread_cond_signal(pthread_cond_t* cond);//唤醒等待队列里等待的第一个线程
```


## pthread_cond 实例
```cpp
#include <iostream>
#include <pthread.h>
#include <unistd.h>
#include <string>


pthread_mutex_t mtx;
pthread_cond_t cond;

//ctrl线程 控制 work线程，让他定期运行
void *ctrl(void *args)
{
    std::string name = (char*)args;
    while(true){
        std::cout << "master say : begin work" << std::endl;
        
        //pthread_cond_signal: 唤醒在条件变量下在cond 等待队列里等待的第一个线程
         pthread_cond_signal(&cond);
        
        //唤醒所有线程
        //pthread_cond_broadcast(&cond);
        
        sleep(5);
    }
}

void *work(void *args)
{
    int number = *(int*)args;
    delete (int*)args;

    while(true){
        //此处我们的mutex不用，暂时这样，后面解释
        pthread_cond_wait(&cond, &mtx);
        std::cout << "worker: " << number << " is working ..." << std::endl;
    }
}

int main()
{
#define NUM 3

    pthread_mutex_init(&mtx, nullptr);
    pthread_cond_init(&cond, nullptr);

    pthread_t master;
    pthread_t worker[NUM];
    pthread_create(&master, nullptr, ctrl, (void*)"boss");
    for(int i = 0; i < NUM; i++){
        int *number = new int(i);
        pthread_create(worker+i, nullptr, work, (void*)number);
    }

    for(int i = 0; i < NUM; i++){
        pthread_join(worker[i], nullptr);
    }
    pthread_join(master, nullptr);

    pthread_mutex_destroy(&mtx);
    pthread_cond_destroy(&cond);
    return 0;
}

```
运行结果：
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315203709.png)

这就是同步，可以发现，线程的是按顺序进行执行的，这说明，条件变量内部一定存在一个等待队列
```cpp
struct cond{
	int status;
	task_struct *p;
}
```
可以通过status来控制等待队列的状态。

### 为什么`pthread_cond_wait`需要互斥量
- 条件等待是线程间同步的一种手段，如果只有一个线程，条件不满足，一直等下去都不会满足，所以必须要有一个线程通过某些操作，改变共享变量，使原先不满足的条件变得满足，并且友好的通知等待在条件变量上的线程。
- 条件不会无缘无故的突然变得满足了，必然会牵扯到共享数据的变化。所以一定要用互斥锁来保护。没有互斥锁就无法安全的获取和修改共享数据。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315203817.png)


按照上面的说法，我们设计出如下的代码：先上锁，发现条件不满足，解锁，然后等待在条件变量上不就 
行了
1. 调用`pthread_cond_wait`的时候，会首先自动释放mtx_!,然后再挂起自己。
2. 返回的时候，会首先自动竞争锁，获取到锁之后，才能返回！


这是一段错误的设计：
```c
// 错误的设计
pthread_mutex_lock(&mutex); 
while (condition_is_false) {
	pthread_mutex_unlock(&mutex);
	//解锁之后，等待之前，条件可能已经满足，信号已经发出，但是该信号可能被错过 
	pthread_cond_wait(&cond);
	pthread_mutex_lock(&mutex); 
}
pthread_mutex_unlock(&mutex);
```
- 由于解锁和等待不是原子操作。调用解锁之后， pthread_cond_wait 之前，如果已经有其他线程获取到互斥量，摒弃条件满足，发送了信号，那么 pthread_cond_wait 将错过这个信号，可能会导致线程永远阻塞在这个`pthread_cond_wait`。所以解锁和等待必须是一个原子操作。
- ` int pthread_cond_wait(pthread_cond_ t *cond,pthread_mutex_ t * mutex)`; 进入该函数后， 会去看条件量等于0不？等于，就把互斥量变成1，直到cond_ wait返回，把条件量改成1，把互斥量恢复成原样。


# 生产者消费者模型

## 为何要使用生产者消费者模型
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315203834.png)

- 生产者消费者模式就是通过一个容器来解决生产者和消费者的强耦合问题。
- 生产者和消费者彼此之间不直接通讯，而通过阻塞队列来进行通讯，所以生产者生产完数据之后不用等待消费者处理，直接扔给阻塞队列，消费者不找生产者要数据，而是直接从阻塞队列里取，阻塞队列就相当于一个缓冲区，平衡了生产者和消费者的处理能力。
- 这个阻塞队列就是用来给生产者和消费者解耦的。

### "321"原则
#### "3"种关系
- 供货商vs供货商: 竞争 , 互斥
- 消费者vs 消费者:竞争，互斥
- 供货商vs 消费者:互斥，同步!

#### "2" 种角色
生产者(n) 和 消费者(n)

#### "1"个交易场所
超市一>交易场所、一段缓冲区（内存空间，stl容)




## 生产者消费者模型优点
- 解耦
- 支持并发 
- 支持忙闲不均


## CP模型的具体实现

### 单生产者单消费者模型
 CPtest.cpp文件
```cpp

using namespace ns_blockqueue;

void *consumer(void *args)
{
    BlockQueue<int> *bq = (BlockQueue<int>*)args;
    while(true){
        sleep(2);
        int data = 0;
        bq->Pop(&data);

        std::cout << "消费者消费了一个数据: " <<  data << std::endl;
    }
}

void *producter(void *args)
{
    BlockQueue<int> *bq = (BlockQueue<int>*)args;
    while(true){
         //sleep(1);
        //1. 制造数据,生产者的数据(task)从哪里来？？
        int data = rand()%20 + 1;
        std::cout << "生产者生产数据: " << data << std::endl;
        bq->Push(data);
    }
}

int main()
{
    srand((long long)time(nullptr));
    BlockQueue<int> *bq = new BlockQueue<int>();

    pthread_t c,p;
    pthread_create(&c, nullptr, consumer, (void*)bq);
    pthread_create(&p, nullptr, producter, (void*)bq);

    pthread_join(c, nullptr);
    pthread_join(p, nullptr);
    
    return 0;
}
```

 BlockQueue.hpp 文件
```cpp
#pragma once
#include <iostream>
#include <queue>
#include <pthread.h>

namespace ns_blockqueue
{
    const int default_cap = 5;

    template <class T>
    class BlockQueue
    {
    private:
        std::queue<T> bq_; //我们的阻塞队列
        int cap_;          //队列的元素上限
        pthread_mutex_t mtx_; //保护临界资源的锁
        //1. 当生产满了的时候，就应该不要生产了(不要竞争锁了)，而应该让消费者来消费
        //2. 当消费空了，就不应该消费（不要竞争锁了）,应该让生产者来进行生产
        pthread_cond_t is_full_; //bq_满的， 消费者在改条件变量下等待
        pthread_cond_t is_empty_; //bq_空的，生产者在改条件变量下等待
    private:
        bool IsFull()
        {
            return bq_.size() == cap_;
        }
        bool IsEmpty()
        {
            return bq_.size() == 0;
        }
        void LockQueue()
        {
            pthread_mutex_lock(&mtx_);
        }
        void UnlockQueue()
        {
            pthread_mutex_unlock(&mtx_);
        }
        void ProducterWait()
        {
            //pthread_cond_wait
            //1. 调用的时候，会首先自动释放mtx_!,然后再挂起自己
            //2. 返回的时候，会首先自动竞争锁，获取到锁之后，才能返回！
            pthread_cond_wait(&is_empty_, &mtx_);
        }
        void ConsumerWait()
        {
            pthread_cond_wait(&is_full_, &mtx_);
        }
        void WakeupComsumer()
        {
            pthread_cond_signal(&is_full_);
        }
        void WakeupProducter()
        {
            pthread_cond_signal(&is_empty_);
        }
    public:
        BlockQueue(int cap = default_cap):cap_(cap)
        {
            pthread_mutex_init(&mtx_, nullptr);
            pthread_cond_init(&is_empty_, nullptr);
            pthread_cond_init(&is_full_, nullptr);
        }
        ~BlockQueue()
        {
            pthread_mutex_destroy(&mtx_);
            pthread_cond_destroy(&is_empty_);
            pthread_cond_destroy(&is_full_);
        }
    public:
        //const &:输入
        //*: 输出
        //&: 输入输出
        void Push(const T &in)
        {
            LockQueue();
            //临界区
            while(IsFull()){ //不能使用if进行判断，因为wait有可能挂起失败
                //等待的，把线程挂起，我们当前是持有锁的！！！
                ProducterWait();
            }
            //向队列中放数据，生产函数
            bq_.push(in);

            //if(bq_.size() > cap_/2 ) WakeupComsumer();
            UnlockQueue();
            WakeupComsumer();

        }

        void Pop(T *out)
        {
            LockQueue();
            //从队列中拿数据，消费函数函数
            while(IsEmpty()){ //不能使用if进行判断，因为wait有可能挂起失败
                //无法消费
                ConsumerWait();
            }
            *out = bq_.front();
            bq_.pop();

            //if(bq_.size() < cap_/2 ) WakeupProducter();
            UnlockQueue();
			WakeupProducter();
        }
    };
}
```
运行结果，先让生产者生产两秒后，消费者开始购买
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315203926.png)



#### 线程条件变量等待是否使用 if ？
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315204010.png)

1. 调用`pthread_cond_wait`的时候，会首先自动释放mtx_!,然后再挂起自己。
2. 返回的时候，会首先自动竞争锁，获取到锁之后，才能返回！

根据上图与总结，最好使用while
```cpp
void Push(const T &in)
{
	LockQueue();
	//临界区
	while(IsFull()){ //不能使用if进行判断，因为wait有可能挂起失败
		//等待的，把线程挂起，我们当前是持有锁的！！！
		ProducterWait();
	}
	//向队列中放数据，生产函数
	bq_.push(in);

	//if(bq_.size() > cap_/2 ) WakeupComsumer();
	UnlockQueue();
	WakeupComsumer();

}
```



### 单生产者多消费者模型
这次改造使得生产者生产数据，消费者获取数据后，对数据进行处理工作。对生产者的数据进行 `+-*/%`
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315204028.png)

所以需要添加一个 Task类，这个类就包含了将生产者的数据进行任务处理的工作。

Task.hpp
```cpp
#pragma once
#include <iostream>
#include <pthread.h>

namespace fmy_task
{
    class Task
    {
    private:
        int _x ;
        int _y;
        char _op;

    public:
        Task(){}
        Task(int x , int y , int op)
            :_x(x)
            ,_y(y)
            ,_op(op)
        {}

        int Run()
        {
            int res = 0;
            switch (_op)
            {
            case '+':
                res = _x + _y;
                break;
            case '-':
                res = _x - _y;
                break;
            case '*':
                res = _x * _y;
                break;
            case '/':
                res = _x / _y;
                break;
            case '%':
                res = _x % _y;
                break;
            default:
                std::cout << "bug??" << std::endl;
                break;
            }
            std::cout << "当前任务正在被: " << pthread_self() << " 处理: " \
            << _x << _op << _y << "=" << res << std::endl;
            return res;
        }

        int operator()()
        {
            return Run();
        }
    };
}
```


CPtest.cpp
```cpp
#pragma once

#include <iostream>
#include <pthread.h>
#include <unistd.h>

#include "BlockQueue.hpp"
#include "Task.hpp"

using namespace fmy;
using namespace fmy_task;

void *consumer(void *args)
{
    BlockQueue<Task> *bq = (BlockQueue<Task>*)args;
    while(true){
        Task t;
        bq->Pop(&t);
        t();
        sleep(1);
    }
}

void *producter(void *args)
{
    BlockQueue<Task>* bq = (BlockQueue<Task>*)args;
    std::string ops = "+-*/%";
    while(true){

        int x = rand()%20+1;
        int y = rand()%20+1;
        char op = ops[rand()%5];

        Task t(x , y ,op);
        std::cout << "生产者派发了一个任务: " << x << op << y << "=?" << std::endl;
        bq->Push(t);
        //sleep(1);
    }
}

int main()
{
    srand((long long)time(nullptr));
    BlockQueue<Task> *bq = new BlockQueue<Task>();

    pthread_t c,p;
    pthread_t c1,c2,c3,c4;
    pthread_create(&c, nullptr, consumer, (void*)bq);
    pthread_create(&c1, nullptr, consumer, (void*)bq);
    pthread_create(&c2, nullptr, consumer, (void*)bq);
    pthread_create(&c3, nullptr, consumer, (void*)bq);
    pthread_create(&c4, nullptr, consumer, (void*)bq);
    pthread_create(&p, nullptr, producter, (void*)bq);

    pthread_join(c, nullptr);
    pthread_join(c1, nullptr);
    pthread_join(c2, nullptr);
    pthread_join(c3, nullptr);
    pthread_join(c4, nullptr);
    pthread_join(p, nullptr);
    return 0;
}
```

BlockQueue.hpp
```cpp
#pragma once
#include <iostream>
#include <queue>
#include <pthread.h>

namespace fmy
{

    const int default_cap = 5;

    template<class T>
    class BlockQueue
    {
    private:
        std::queue<T> _bq;
        int _cap;

        pthread_cond_t _is_full;
        pthread_cond_t _is_empty;

        pthread_mutex_t mtx;

        bool Is_Full()
        {
            return _bq.size() == _cap;
        }

        bool Is_Empty()
        {
            return _bq.size() == 0;
        }

        void LockQueue()
        {
            pthread_mutex_lock(&mtx);
        }

        void UnlockQueue()
        {
            pthread_mutex_unlock(&mtx);
        }

        void WaitConsumer()
        {
            pthread_cond_wait(&_is_full , &mtx);
        }

        void WaitProducter()
        {
            pthread_cond_wait(&_is_empty , &mtx);
        }

        void WakeConsumer()
        {
            pthread_cond_signal(&_is_full);
        }

        void WakeProducter()
        {
            pthread_cond_signal(&_is_empty);
        }



    public:
        BlockQueue(int cap = default_cap)
            :_cap(cap)
        {
            pthread_mutex_init(&mtx ,nullptr);
            pthread_cond_init(&_is_full , nullptr);
            pthread_cond_init(&_is_empty , nullptr);
        }

        ~BlockQueue()
        {
            pthread_mutex_destroy(&mtx);
            pthread_cond_destroy(&_is_full);
            pthread_cond_destroy(&_is_empty);
        }

        void Push(const T& in)
        {
            LockQueue();
            while(Is_Full())
            {
                WaitProducter();
            }

            _bq.push(in);

            // if(_bq.size() > _cap/2) WakeConsumer();

            UnlockQueue();
            WakeConsumer();
        }

        void Pop(T* out)
        {
            LockQueue();
            while(Is_Empty())
            {
                WaitConsumer();
            }

            *out = _bq.front();
            _bq.pop();

            // if(_bq.size() > _cap/2) WakeProducter();

            UnlockQueue();
            WakeProducter();
        }

    };
}

```
运行结果：
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315204051.png)




# POSIX信号量
POSIX信号量和SystemV信号量作用相同，都是用于同步操作，达到无冲突的访问共享资源目的。  但POSIX可以用于线程间同步。

需要导入头文件 `semapthore.h`

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315204110.png)


## 信号量函数
### 初始化信号量 sem_init()
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315204130.png)

参数：
>**pshared** : 0表示线程间共享，非零表示进程间共享 
>**value**：信号量初始值


### 销毁信号量
```c
int sem_destroy(sem_t *sem);
```


### 等待信号量
功能：等待信号量，会将信号量的值减1
```c
int sem_wait(sem_t *sem); //P()
```


### 发布信号量
功能：发布信号量，表示资源使用完毕，可以归还资源了。将信号量值加1。 
```c
int sem_post(sem_t *sem);//V()
```

## 使用环形队列的生产消费模型
- 环形队列采用数组模拟，用模运算来模拟环状特性
- ![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315204154.png)

- 环形结构起始状态和结束状态都是一样的，不好判断为空或者为满，所以可以通过加计数器或者标记位来判断满或者空。另外也可以预留一个空的位置，作为满的状态
- ![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315204213.png)


![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315204219.png)

定义blank信号量为10 ，代表着有十个空位。
当P(blank) 时 ， 就会多出一个==**数据**==，所以`V(data)`。
当`P(data)` 时 ， 就会多出一个==**空位**==，所以`V(blank)`。


### 环形队列的生产消费模型代码

#### 单生产单消费
**`ring_queue.hpp` 文件**
```c
#include <iostream>
#include <vector>
#include <semaphore.h>

namespace fmy_ring_queue
{
    const int cap_default = 10;
    template<class T>
    class RingQueue{
    private:
        std::vector<T> _ring_queue;
        int _cap;

        int _c_step;
        int _p_step;
  
		sem_t _blank_sem;//生产者关心空位置资源
        sem_t _data_sem;// 消费者关心空位置资源


    public:
        RingQueue(int cap = cap_default)
            :_ring_queue(cap)
            ,_cap(cap)
        {
            sem_init(&_blank_sem , 0 , cap);
            sem_init(&_data_sem , 0 , 0);
            _c_step = _p_step = 0;
        }

        ~RingQueue()
        {
            sem_destroy(&_blank_sem);
            sem_destroy(&_data_sem);
        }

        void Push(const T& in)//生产接口
        {
            sem_wait(&_blank_sem);//P(空位置)
            _ring_queue[_p_step] = in;
            sem_post(&_data_sem);//V(数据)

            _p_step++;
            _p_step %= _cap;
        }

        void Pop(T* out)//消费接口
        {
            sem_wait(&_data_sem);//P(数据)
            *out = _ring_queue[_c_step];
            sem_post(&_blank_sem);//V(空位置)

            _c_step++;
            _c_step %= _cap;
        }
    };
}
```

**`ring_cp.cc` 文件**
```c
#include <iostream>
#include <pthread.h>
#include <time.h>
#include <unistd.h>

#include "ring_queue.hpp"

using namespace fmy_ring_queue;

void* consumer(void* args)
{
     RingQueue<int>* rq = (RingQueue<int>*)args;
     while(true){
         int data = 0;
         rq->Pop(&data);
         std::cout << "消费数据是: " << data << std::endl;
	    //sleep(1);
     }
}

void* producter(void* args)
{
     RingQueue<int>* rq = (RingQueue<int>*)args;
     while(true){
         int data = rand()%20 + 1;
         std::cout << "生产数据是:  " << data << std::endl;
         rq->Push(data);
        sleep(1);
     }
}

int main()
{

    RingQueue<int>* rq = new RingQueue<int>();
    pthread_t c,p;
    pthread_create(&c , nullptr , consumer , (void*)rq);
    pthread_create(&p , nullptr ,  producter, (void*)rq);
    
    pthread_join(c , nullptr);
    pthread_join(p , nullptr);
    return 0;
}
```
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315204348.png)



#### 多生产多消费的环形队列
多生产和多消费的优势在于并发的获取和处理任务

==**ring_cp.cpp(主文件)**==
```cpp
#include <iostream>
#include <pthread.h>
#include <time.h>
#include <unistd.h>

#include "ring_queue.hpp"
#include "Task.hpp"
using namespace fmy_task;
using namespace fmy_ring_queue;


using namespace fmy_ring_queue;

void* consumer(void* args)
{
     RingQueue<Task>* rq = (RingQueue<Task>*)args;
     while(true){
         Task t;
         rq->Pop(&t);
         t();
         //std::cout << "消费数据是: " << data << std::endl;
          sleep(1);
     }
}

void* producter(void* args)
{
     RingQueue<Task>* rq = (RingQueue<Task>*)args;
     const std::string ops = "+-*/%";
     while(true){
         int x = rand()%20 + 1;
         int y = rand()%10 + 1;
         char op = ops[rand() % ops.size()];
         Task t(x , y , op);
        std::cout << "生产数据是:  " << t.Show() << "我是: " << pthread_self()<< std::endl;
         rq->Push(t);

        //sleep(1);
     }
}

int main()
{
    srand((long long)time(nullptr));
    RingQueue<Task>* rq = new RingQueue<Task>();

    pthread_t c, c1 , c2, p  , p1 , p2;

    pthread_create(&c , nullptr , consumer , (void*)rq);
    pthread_create(&c1 , nullptr , consumer , (void*)rq);
    pthread_create(&c2 , nullptr , consumer , (void*)rq);
    pthread_create(&p , nullptr ,  producter, (void*)rq);
    pthread_create(&p1 , nullptr ,  producter, (void*)rq);
    pthread_create(&p2 , nullptr ,  producter, (void*)rq);

    pthread_join(c , nullptr);
    pthread_join(c1 , nullptr);
    pthread_join(c2 , nullptr);
    pthread_join(p , nullptr);
    pthread_join(p1 , nullptr);
    pthread_join(p2 , nullptr);
    return 0;
}

```

==**ring_queue.hpp**==
```cpp
#include <iostream>
#include <vector>
#include <semaphore.h>

namespace fmy_ring_queue
{
    const int cap_default = 10;
    template<class T>
    class RingQueue{
    private:
        std::vector<T> _ring_queue;
        int _cap;

        int _c_step;
        int _p_step;

        sem_t _blank_sem;
        sem_t _data_sem;
        pthread_mutex_t _c_mtx;
        pthread_mutex_t _p_mtx;

    public:
        RingQueue(int cap = cap_default)
            :_ring_queue(cap)
            ,_cap(cap)
        {
            sem_init(&_blank_sem , 0 , cap);
            sem_init(&_data_sem , 0 , 0);
            _c_step = _p_step = 0;

            pthread_mutex_init(&_c_mtx , nullptr);
            pthread_mutex_init(&_p_mtx , nullptr);
        }

        ~RingQueue()
        {
            sem_destroy(&_blank_sem);
            sem_destroy(&_data_sem);

            pthread_mutex_destroy(&_c_mtx);
            pthread_mutex_destroy(&_p_mtx);

        }

        void Push(const T& in)
        {
            sem_wait(&_blank_sem);//线程都可以先进行信号量等待，然后再竞争锁

            pthread_mutex_lock(&_p_mtx);
            _ring_queue[_p_step] = in;

            _p_step++;
            _p_step %= _cap;
            pthread_mutex_unlock(&_p_mtx);

            sem_post(&_data_sem);//这里也是等解锁以后，释放信号量

        }

        void Pop(T* out)
        {
            sem_wait(&_data_sem);//线程都可以先进行信号量等待，然后再竞争锁

            pthread_mutex_lock(&_c_mtx);
            *out = _ring_queue[_c_step];
            _c_step++;
            _c_step %= _cap;
            pthread_mutex_unlock(&_c_mtx);

            sem_post(&_blank_sem);//这里也是等解锁以后，释放信号量
        }
    };
}
```

==**Task.hpp**==
```cpp
#pragma once

#include <iostream>
#include <pthread.h>

namespace fmy_task
{
    class Task
    {
    private:
        int x_;
        int y_;
        char op_; 
    public:
        Task() {}
        Task(int x, int y, char op) : x_(x), y_(y), op_(op)
        {
        }
        std::string Show()
        {
            std::string message = std::to_string(x_);
            message += op_;
            message += std::to_string(y_);
            message += "=?";
            return message;
        }
        int Run()
        {
            int res = 0;
            switch (op_)
            {
            case '+':
                res = x_ + y_;
                break;
            case '-':
                res = x_ - y_;
                break;
            case '*':
                res = x_ * y_;
                break;
            case '/':
                res = x_ / y_;
                break;
            case '%':
                res = x_ % y_;
                break;
            default:
                std::cout << "bug??" << std::endl;
                break;
            }
            std::cout << "当前任务正在被: " << pthread_self() << " 处理: " \
            << x_ << op_ << y_ << "=" << res << std::endl;
            return res;
        }
        int operator()()
        {
            return Run();
        }
        ~Task() {}
    };
}
```
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315204422.png)



# 线程池
一种线程使用模式。线程过多会带来调度开销，进而影响缓存局部性和整体性能。而线程池维护着多个线程，等待着监督管理者分配可并发执行的任务。这避免了在处理短时间任务时创建与销毁线程的代价。线程池不仅能够保证内核的充分利用，还能防止过分调度。可用线程数量应该取决于可用的并发处理器、处理器内核、内存、网络sockets等的数量。

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315222654.png)


==**线程池示例：**==
*      1.  **创建固定数量线程池，循环从任务队列中获取任务对象，** 
*      2.  **获取到任务对象后，执行任务对象中的任务接口**

## 代码实例
==**main.cpp(主文件)**==
```cpp
#include <iostream>
#include <ctime>
#include <cstdlib>

#include "thread_pool.hpp"
#include "Task.hpp"

using namespace fmy_task;
using namespace fmy_threadPool;

int main()
{
    ThreadPool<Task>* tp = new ThreadPool<Task>(3);
    tp->InitThreadPool();

    srand((long long)time(nullptr));

    while(true)
    {
        Task t(rand()%20+1 , rand()%10+1 ,"+-*/%"[rand()%5]);
        tp->PushTask(t);
    }


    return 0;
}
```

==**thread_pool.hpp**==
本次的重头戏，线程池文件，
```cpp
#pragma once

#include <iostream>
#include <queue>
#include <pthread.h>
#include <unistd.h>
#include <string>

namespace fmy_threadPool
{
    const int g_num = 5;

    template<class T>
    class ThreadPool
    {
    private:
        int _num;
        std::queue<T> _task_queue;

        pthread_mutex_t  _mtx;
        pthread_cond_t _cond;

    public:
        void Lock()
        {
            pthread_mutex_lock(&_mtx);
        }

        void Unlock()
        {
            pthread_mutex_unlock(&_mtx);
        }

        void Wait()
        {
            pthread_cond_wait(&_cond , &_mtx);
        }

        void WakeUp()
        {
            pthread_cond_signal(&_cond);
        }

        bool IsEmpty()
        {
            return _task_queue.empty();
        }

    public:
        ThreadPool(int num = g_num)
            :_num(num)
        {
            pthread_mutex_init(&_mtx , nullptr);
            pthread_cond_init(&_cond , nullptr);
        }

        ~ThreadPool()
        {
            pthread_mutex_destroy(&_mtx);
            pthread_cond_destroy(&_cond);
        }

		// 在类中要让线程执行类内成员方法，是不可行的！
        // 必须让线程执行静态方法
        static void *Rountine(void* args)//线程的运行函数
        {
            pthread_detach(pthread_self());//将每个线程进行分离
            ThreadPool<T>* tp = (ThreadPool<T>*)args;

            while(true)
            {
                tp->Lock();//以下是临界区
                
                while(tp->IsEmpty())
                {
                    tp->Wait();
                }
                T t;
                tp->PopTask(&t);
                
                tp->Unlock();//以上是临界区
                t();
            }
        }

        void InitThreadPool()
        {
            pthread_t tid;
            for(int i = 0 ; i < _num; i++)//定义_num个线程
            {
                pthread_create(&tid , nullptr , Rountine , (void*)this);//传入this指针是因为Rountine线程函数是一个静态方法，无法执行类内成员方法。
            }
        }

        void PushTask(const T& in)//push也需要是原子的
        {
            Lock();
            _task_queue.push(in);

            Unlock();
            WakeUp();
        }

        void PopTask(T* out)//pop 直接取数据就行，无需锁
        {
            *out = _task_queue.front();
            _task_queue.pop();
        }
    };
}
```

==**Task.hpp**==
和上面的Task.hpp文件一样的
```cpp
#pragma once

#include <iostream>
#include <pthread.h>

namespace fmy_task
{
    class Task
    {
    private:
        int x_;
        int y_;
        char op_; //+/*/%
    public:
        Task() {}
        Task(int x, int y, char op) : x_(x), y_(y), op_(op)
        {
        }
        std::string Show()
        {
            std::string message = std::to_string(x_);
            message += op_;
            message += std::to_string(y_);
            message += "=?";
            return message;
        }
        int Run()
        {
            int res = 0;
            switch (op_)
            {
            case '+':
                res = x_ + y_;
                break;
            case '-':
                res = x_ - y_;
                break;
            case '*':
                res = x_ * y_;
                break;
            case '/':
                res = x_ / y_;
                break;
            case '%':
                res = x_ % y_;
                break;
            default:
                std::cout << "bug??" << std::endl;
                break;
            }
            std::cout << "当前任务正在被: " << pthread_self() << " 处理: " \
            << x_ << op_ << y_ << "=" << res << std::endl;
            return res;
        }
        int operator()()
        {
            return Run();
        }
        ~Task() {}
    };
}
```

运行结果：
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315222734.png)


但运行结果占用太多资源时，系统会自动把进程被19号信号kill的。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315222741.png)


## 单例模式
某些类, 只应该具有一个对象(实例), 就称之为单例. 
例如一个男人只能有一个媳妇.
在很多服务器开发场景中, 经常需要让服务器加载很多的数据 (上百G) 到内存中. 此时往往要用一个单例的类来管理这些数据，创建太多相似的对象时，容易造成严重的数据冗余。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315222842.png)


## 饿汉实现方式和懒汉实现方式
本次主要使用懒汉方式实现单例模式

饿汉方式
>- 吃完饭, 立刻洗碗, 这种就是==**饿汉方式.**== 因为下一顿吃的时候可以立刻拿着碗就能吃饭. ==也就是程序一启动就创建好==。

懒汉方式
>- 吃完饭, 先把碗放下, 然后下一顿饭用到这个碗了再洗碗, 就是==**懒汉方式**==.当我们需要的时候才进行创建

懒汉方式最核心的思想是 "延时加载". 从而能够优化服务器的启动速度.

### 饿汉方式实现单例模式
```cpp
template <typename T> 
class Singleton {
	static T data; 
public:
	static T* GetInstance() { 
		return &data;
	} 
};
```

### 懒汉方式实现单例模式
只要通过 Singleton 这个包装类来使用 T 对象, 则一个进程中只有一个 T 对象的实例.
还是使用到了Task.hpp文件，但是和上面的一样，这里就不写了。

==**main.cpp**==
```cpp
#include <ctime>
#include <cstdlib>

#include "Task.hpp"
#include "thread_pool.hpp"

using namespace fmy_task;
using namespace fmy_threadPool;

int main()
{
    std::cout << "当前正在运行我的进程其他代码..." << std::endl;
    std::cout << "当前正在运行我的进程其他代码..." << std::endl;
    std::cout << "当前正在运行我的进程其他代码..." << std::endl;
    std::cout << "当前正在运行我的进程其他代码..." << std::endl;
    std::cout << "当前正在运行我的进程其他代码..." << std::endl;
    std::cout << "当前正在运行我的进程其他代码..." << std::endl;
    std::cout << "当前正在运行我的进程其他代码..." << std::endl;

    srand((long long)time(nullptr));

    while(true)
    {
        sleep(1);
        Task t(rand()%20+1 ,rand()%10+1 , "+-*/%"[rand()%5] );
        ThreadPool<Task> :: GetInstance()->PushTask(t);
        std::cout << ThreadPool<Task>::GetInstance() << std::endl;
    }
    return 0;
}
```

==**thread_pool.hpp**==
存在一个严重的问题, **线程不安全.**
第一次调用 GetInstance 的时候, 如果两个线程同时调用, 可能会创建出两份 T 对象的实例. 
但是后续再次调用, 就没有问题了.
```cpp
#pragma once

#include <iostream>
#include <queue>
#include <pthread.h>
#include <unistd.h>
#include <string>

namespace fmy_threadPool
{
    const int g_num = 5;

    template<class T>
    class ThreadPool
    {
    private:
        int _num;
        std::queue<T> _task_queue;

        pthread_mutex_t  _mtx;
        pthread_cond_t _cond;

        static ThreadPool<T>* ins;//这就是需要我们创建的对象，必须是静态的，不然将会重复创建

    private:
        ThreadPool(int num = g_num)
            :_num(num)
        {
            pthread_mutex_init(&_mtx , nullptr);
            pthread_cond_init(&_cond , nullptr);
        }

        ThreadPool(const ThreadPool<T>& tp) = delete;

        ThreadPool<T> &operator=(ThreadPool<T> &tp) = delete;

    public:
        static ThreadPool<T>* GetInstance()
        {
            static pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;

            if(ins == nullptr)//存在一个严重的问题, 线程不安全.第一次调用 GetInstance 的时候, 如果两个线程同时调用, 可能会创建出两份 T 对象的实例. 
            {
				ins = new ThreadPool<T>();
				ins->InitThreadPool();//创建对对象成功后，则调用多线程。
				std::cout << "首次加载对象"<< std:: endl;   
            }
            
            return ins;//如果已经存在对象，则返回对象。
        }

        void Lock()
        {
            pthread_mutex_lock(&_mtx);
        }

        void Unlock()
        {
            pthread_mutex_unlock(&_mtx);
        }

        void Wait()
        {
            pthread_cond_wait(&_cond , &_mtx);
        }

        void WakeUp()
        {
            pthread_cond_signal(&_cond);
        }

        bool IsEmpty()
        {
            return _task_queue.empty();
        }

    public:
        ~ThreadPool()
        {
            pthread_mutex_destroy(&_mtx);
            pthread_cond_destroy(&_cond);
        }

        static void *Rountine(void* args)
        {
            pthread_detach(pthread_self());
            ThreadPool<T>* tp = (ThreadPool<T>*)args;

            while(true)
            {
                tp->Lock();
                while(tp->IsEmpty())
                {
                    tp->Wait();
                }
                T t;
                tp->PopTask(&t);
                tp->Unlock();
                t();
            }
        }

        void InitThreadPool()
        {
            pthread_t tid;
            for(int i = 0 ; i < _num; i++)
            {
                pthread_create(&tid , nullptr , Rountine , (void*)this);
            }
        }

        void PushTask(const T& in)
        {
            Lock();
            _task_queue.push(in);

            Unlock();
            WakeUp();
        }

        void PopTask(T* out)
        {
            *out = _task_queue.front();
            _task_queue.pop();
        }
    };

    template <class T>
    ThreadPool<T> *ThreadPool<T>::ins = nullptr;// 因为ins是static的，所以需要对类中的ins进行初始化
}
```


解决线程安全问题，对 `GetInstance()`方法进行加锁。
thread_pool.cpp
```cpp
#pragma once

#include <iostream>
#include <queue>
#include <pthread.h>
#include <unistd.h>
#include <string>

namespace fmy_threadPool
{
    const int g_num = 5;

    template<class T>
    class ThreadPool
    {
    private:
        int _num;
        std::queue<T> _task_queue;

        pthread_mutex_t  _mtx;
        pthread_cond_t _cond;

        static ThreadPool<T>* ins;//这就是需要我们创建的对象，必须是静态的，不然将会重复创建

    private:
        ThreadPool(int num = g_num)
            :_num(num)
        {
            pthread_mutex_init(&_mtx , nullptr);
            pthread_cond_init(&_cond , nullptr);
        }

        ThreadPool(const ThreadPool<T>& tp) = delete;

        ThreadPool<T> &operator=(ThreadPool<T> &tp) = delete;

    public:
        static ThreadPool<T>* GetInstance()
        {
            static pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;//使用static初始化锁，因为该锁无需被初始化和destroy。

            if(ins == nullptr)////双判定，减少锁的争用，当线程创建了对象时，也就不用在争用锁了，从而提高获取单例的效率！
            {
                pthread_mutex_lock(&lock);
                if(ins == nullptr)
                {
                    ins = new ThreadPool<T>();
                    ins->InitThreadPool();
                    std::cout << "首次加载对象"<< std:: endl;
                }

                pthread_mutex_unlock(&lock);
            }
            return ins;
        }

        void Lock()
        {
            pthread_mutex_lock(&_mtx);
        }

        void Unlock()
        {
            pthread_mutex_unlock(&_mtx);
        }

        void Wait()
        {
            pthread_cond_wait(&_cond , &_mtx);
        }

        void WakeUp()
        {
            pthread_cond_signal(&_cond);
        }

        bool IsEmpty()
        {
            return _task_queue.empty();
        }

    public:
        ~ThreadPool()
        {
            pthread_mutex_destroy(&_mtx);
            pthread_cond_destroy(&_cond);
        }

        static void *Rountine(void* args)
        {
            pthread_detach(pthread_self());
            ThreadPool<T>* tp = (ThreadPool<T>*)args;

            while(true)
            {
                tp->Lock();
                while(tp->IsEmpty())
                {
                    tp->Wait();
                }
                T t;
                tp->PopTask(&t);
                tp->Unlock();
                t();
            }
        }

        void InitThreadPool()
        {
            pthread_t tid;
            for(int i = 0 ; i < _num; i++)
            {
                pthread_create(&tid , nullptr , Rountine , (void*)this);
            }
        }

        void PushTask(const T& in)
        {
            Lock();
            _task_queue.push(in);

            Unlock();
            WakeUp();
        }

        void PopTask(T* out)
        {
            *out = _task_queue.front();
            _task_queue.pop();
        }
    };

    template <class T>
    ThreadPool<T> *ThreadPool<T>::ins = nullptr;// 因为ins是static的，所以需要在类外 对类中的ins进行初始化
}
```
运行结果：
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315222944.png)




# STL,智能指针和线程安全

## STL中的容器是否是线程安全的?
==**不是.**==
原因是, ==STL 的设计初衷是将性能挖掘到极致==, 而一旦涉及到加锁保证线程安全, 会对性能造成巨大的影响. 
而且对于不同的容器, 加锁方式的不同, 性能可能也不同(例如hash表的锁表和锁桶).
因此 STL 默认不是线程安全. 如果需要在多线程环境下使用, 往往需要调用者自行保证线程安全.

## 智能指针是否是线程安全的?
对于 unique_ptr, 由于只是在当前代码块范围内生效, 因此不涉及线程安全问题.
对于 shared_ptr, 多个对象需要共用一个引用计数变量, 所以会存在线程安全问题. 但是标准库实现的时候考虑到了这个问题, 基于原子操作(CAS)的方式保证 shared_ptr 能够高效, 原子的操作引用计数.


# 其他常见的各种锁
- ==**悲观锁**==：在每次取数据时，总是担心数据会被其他线程修改，所以会在取数据前先加锁（读锁，写锁，行锁等），当其他线程想要访问数据时，被阻塞挂起。
- ==**乐观锁**==：每次取数据时候，总是乐观的认为数据不会被其他线程修改，因此不上锁。但是在更新数据前，会判断其他数据在更新前有没有对数据进行修改。主要采用两种方式：版本号机制和CAS操作。
- ==**CAS操作**==：当需要更新数据时，判断当前内存值和之前取得的值是否相等。如果相等则用新值更新。若不 等则失败，失败则重试，一般是一个自旋的过程，即不断重试。
- ==自旋锁，公平锁，非公平锁==？



# 读者写者问题
在编写多线程的时候，有一种情况是十分常见的。那就是，**有些公共数据修改的机会比较少。相比较改写，它们读的机会反而高的多。通常而言，在读的过程中，往往伴随着查找的操作，中间耗时很长。给这种代码段加锁，会极大地降低我们程序的效率。** 那么有没有一种方法，可以专门处理这种多读少写的情况呢？     ==**有，那就是读写锁。**==

其实也还是[[Linux多线程#321 原则|321原则]]
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315223006.png)


==**生产和消费vs读者写者**==
>根本原因:读者不会取走资源,而消费者会拿走数据!

一个人在写，多个人在读
>写者和写者: 互斥关系
>读者和写者: 互斥，同步
>读者和读者: 没有关系



## 读写锁
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315223021.png)


## 读写锁接口
**设置读写优先**
```cpp
int pthread_rwlockattr_setkind_np(pthread_rwlockattr_t *attr, int pref); 
/*
pref 共有    3 种选择
PTHREAD_RWLOCK_PREFER_READER_NP (默认设置) 读者优先，可能会导致写者饥饿情况

PTHREAD_RWLOCK_PREFER_WRITER_NP 写者优先，目前有    BUG，导致表现行为和
PTHREAD_RWLOCK_PREFER_READER_NP 一致

PTHREAD_RWLOCK_PREFER_WRITER_NONRECURSIVE_NP 写者优先，但写者不能递归加锁
*/
```

**初始化**
```cpp
int pthread_rwlock_init(pthread_rwlock_t *restrict rwlock , const pthread_rwlockattr_t *restrict attr);
```


**销毁**
```cpp
int pthread_rwlock_destroy(pthread_rwlock_t *rwlock);
```

**加锁与解锁**
```cpp
int pthread_rwlock_rdlock(pthread_rwlock_t *rwlock);//读锁

int pthread_rwlock_wrlock(pthread_rwlock_t *rwlock);//写锁

int pthread_rwlock_unlock(pthread_rwlock_t *rwlock);
```

## 读写锁伪代码理解
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315223049.png)

**写者**
```cpp
mtx1.lock()
while(readers > 0)//只要还有读者在读，写者就一直等待，直到读者为0
{
	wait();
}

//读者为0，进入临界区，对内容进行修改

mtx1.unlock（）
```

**读者**
```cpp
mtx1.lock();
readers++;
mtx1.unlock();


mtx1.lock();
readers--;//读者减少，
mtx1.unlock();
```

## 读者写者的优先级问题
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315223107.png)

- 读者优先:读者和写者同时到来的时候，我们让读者先进入访问
- 写者优先:当读者和写者同时到来的时候，比当前写者晚来的所有的读者，都不要进入临界区访问了，等临界区中没有读者的时候，让写者先


## 读写锁案列
```cpp
#include <vector>
#include <sstream>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <unistd.h>
#include <pthread.h> 
volatile int ticket = 1000;

pthread_rwlock_t rwlock;

void* reader(void* arg)
{
	char* id = (char*)arg;
	while (1) {
		pthread_rwlock_rdlock(&rwlock);
		if (ticket <= 0) {
			pthread_rwlock_unlock(&rwlock);
			break;
		}
		printf("%s: %d\n", id, ticket);
		pthread_rwlock_unlock(&rwlock);
		usleep(1);
	}
	return nullptr;
}

void* writer(void* arg)
{
	char* id = (char*)arg;
	while (1) {
		pthread_rwlock_wrlock(&rwlock);
		if (ticket <= 0) {
			pthread_rwlock_unlock(&rwlock);
			break;
		}
		printf("%s: %d\n", id, --ticket);
		pthread_rwlock_unlock(&rwlock);
		usleep(1);
	}
	return nullptr;
}

struct ThreadAttr
{
	pthread_t tid;
	std::string id;
};

std::string create_reader_id(std::size_t i)
{
	// 利用    ostringstream 进行    string 拼接
	std::ostringstream oss("thread reader ", std::ios_base::ate);
	oss << i;
	return oss.str();
}

std::string create_writer_id(std::size_t i)
{
	// 利用    ostringstream 进行    string 拼接
	std::ostringstream oss("thread writer ", std::ios_base::ate);
	oss << i;
	return oss.str();
}

void init_readers(std::vector<ThreadAttr>& vec)
{
	for (std::size_t i = 0; i < vec.size(); ++i) {
		vec[i].id = create_reader_id(i);
		pthread_create(&vec[i].tid, nullptr, reader, (void*)vec[i].id.c_str());
	}
}

void init_writers(std::vector<ThreadAttr>& vec)
{
	for (std::size_t i = 0; i < vec.size(); ++i) {
		vec[i].id = create_writer_id(i);
		pthread_create(&vec[i].tid, nullptr, writer, (void*)vec[i].id.c_str());
	}
}

void join_threads(std::vector<ThreadAttr> const& vec)
{
	// 我们按创建的    逆序    来进行线程的回收
	for (std::vector<ThreadAttr>::const_reverse_iterator it = vec.rbegin(); it !=
		vec.rend(); ++it) {
		pthread_t const& tid = it->tid;
		pthread_join(tid, nullptr);
	}
}

void init_rwlock()
{
#if 0   // 写优先
	pthread_rwlockattr_t attr;
	pthread_rwlockattr_init(&attr);
	pthread_rwlockattr_setkind_np(&attr, PTHREAD_RWLOCK_PREFER_WRITER_NONRECURSIVE_NP);
	pthread_rwlock_init(&rwlock, &attr);
	pthread_rwlockattr_destroy(&attr);
#else   // 读优先，会造成写饥饿
	pthread_rwlock_init(&rwlock, nullptr);
#endif
}
int main()
{
	// 测试效果不明显的情况下，可以加大    reader_nr
	// 但也不能太大，超过一定阈值后系统就调度不了主线程了 
	const std::size_t reader_nr = 1000;
	const std::size_t writer_nr = 2;
	std::vector<ThreadAttr> readers(reader_nr);
	std::vector<ThreadAttr> writers(writer_nr);
	init_rwlock();
	init_readers(readers);
	init_writers(writers);
	join_threads(writers);
	join_threads(readers);
	pthread_rwlock_destroy(&rwlock);
}
```
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315223140.png)



# 挂起等待特性的锁 vs 自旋锁
自旋锁与互斥锁有点类似，**只是自旋锁不会引起调用者睡眠，如果自旋锁已经被别的执行单元保持，调用者就一直循环在那里看是否该自旋锁的保持者已经释放了锁**，"自旋"一词就是因此而得名。

由于自旋锁使用者一般保持锁时间非常短，因此选择自旋而不是睡眠是非常必要的，自旋锁的效率远高于互斥锁。

## 使用自旋锁的场景
其实就像等人，如果需要等人的时间长，我们可以去其他地方做其他事情，但是如果需要等的时间非常短，我们就会在约定地点等人，不断的询问她快到没。    其实不断询问的这个过程其实就是自旋锁的过程。

而线程访问临界资源是需要花费时间的，线程如何得知，自己会在临界资源中待多长时间呢?﹖==线程不知道!!，程序员知道!   因为临界区是程序员写的，程序员能判断是否需要使用自旋锁==。

**如果花费的时间非常短?**
>比较适合自旋锁,不断的通过循环，检测锁的状态

**如果花费的时间非常长?**
>比较适合挂起等待锁

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315223222.png)



## 自旋锁函数
```cpp
#include <pthread.h>
int pthread_spin_destroy(pthread_spinlock_t *lock);//销毁自旋锁

int pthread_spin_init(pthread_spinlock_t *lock, int pshared);//初始化自旋锁

int pthread_spin_lock(pthread_spinlock_t *lock);//自旋锁

int pthread_spin_unlock(pthread_spinlock_t *lock);
```