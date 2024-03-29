# 基本概念
>课本概念：程序的一个执行实例，正在执行的程序等
>内核观点：担当分配系统资源（CPU时间，内存）的实体。

# 描述进程-PCB
进程信息被放在一个叫做进程控制块的数据结构中，可以理解为进程属性的集合。

课本上称之为PCB（process control block），Linux操作系统下的PCB是: task_struct

## task_struct-PCB的一种
>在Linux中描述进程的结构体叫做task_struct。
>task_struct是Linux内核的一种数据结构，它会被装载到RAM(内存)里并且包含着进程的信息。


# task_ struct内容分类
>**标示符**: 描述本进程的唯一标示符，用来区别其他进程。
>**状态**: 任务状态，退出代码，退出信号等。
>**优先级**: 相对于其他进程的优先级。
>**程序计数器**: 程序中即将被执行的下一条指令的地址。
>**内存指针**: 包括程序代码和进程相关数据的指针，还有和其他进程共享的内存块的指针
>**上下文数据**: 进程执行时处理器的寄存器中的数据[休学例子，要加图CPU，寄存器]。
>**I／O状态信息**: 包括显示的I/O请求,分配给进程的I／O设备和被进程使用的文件列表。
>**记账信息**: 可能包括处理器时间总和，使用的时钟数总和，时间限制，记账号等。
>其他信息
 
## 标识符
==说明==：述本进程的唯一标示符，用来区别其他进程。
在Linux中用 **`pid`**  标识。

查询指令 `ps axj | grep 进程名` 
如我们要查询`myproc` 的进程
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317155113.png)

myproc 进程的 `pid` 标识符就是 **730** .

## 状态
==说明==：任务状态，退出代码，退出信号等。 

### 任务状态：
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317155125.png)




### 退出信号：
如：注意我们在==myproc==进程中的`main.c`文件。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317155131.png)

如我们在main.c中的 return 放回值是 100 。这就是退出信号

当我们使用 `echo $?` 这个指令就能打印出最近的==退出信号==。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317155152.png)

这个 `100`  就是我们的退出信号。


### 内存指针
==说明==： 包括程序代码和进程相关数据的指针，还有和其他进程共享的内存块的指针。

这个指针叫做 ==**PC指针**== ，其实也就是寄存器 **`EIP`**

### 上下文数据
==说明==：**上下文数据**: 进程执行时处理器的寄存器中的数据[休学例子，要加图CPU，寄存器]
进程是有并发性的，当从就绪态进入运行态时，会将我们需要处理的数据交给CPU，但进程是时间片完了后，就会切换下一个进程，而没有被处理完的数据就会保存`task_struct`中，以便下次进入运行态时，恢复现场。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317155213.png)


### I／O状态信息:
==说明==：包括显示的I/O请求,分配给进程的I／O设备和被进程使用的文件列表。

### 记账信息:
说明：可能包括处理器时间总和，使用的时钟数总和，时间限制，记账号等。

# 组织进程
可以在内核源代码里找到它。所有运行在系统里的进程都以==**task_struct**==链表的形式存在内核里。

# 查看进程
进程的信息可以通过 /proc 系统文件夹查看
如：要获取PID为1的进程信息，你需要查看  `/proc/`  这个文件夹。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317155231.png)


# 使用fork创建子进程
==**fork()函数的本质就是创建子进程。**==

如在文件中写一下代码
```cpp
#include <iostream>                                                                                         
#include <unistd.h>                                                                                                                       
int main()                                                                                                  
{                                                                                                           
   fork();                                                                                                 
   std::cout<<"hello proc: " << getpid()<<" "<< "helloproc parent: " << getppid()<< std::endl;             
   return 0;                                                                                               
}     
```

但是执行后发现有两条执行结果。这是因为 `fork()` 函数创建了一个子进程。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317155301.png)


注意：子进程的数据和父进程是共享的。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317155312.png)
但父进程或子进程修改数据时， 就会发生==**写时拷贝**==后变成独立的数据。


## fork的返回值

### 成功
* 给父进程返回子进程的pid
* 给子进程返回0

### 失败
返回值小于0   ==<0==

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317155340.png)



![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317155345.png)


**但是fork之后，父进程和子进程谁先执行呢？**
>不确定，由调度器调度



# 进程状态
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317155430.png)


进程的状态类
>"R (running)", /* 0 */
>"S (sleeping)", /* 1 */
>"D (disk sleep)", /* 2 */
>"T (stopped)", /* 4 */
>"t (tracing stop)", /* 8 */
>"X (dead)", /* 16 */
>"Z (zombie)", /* 32 */

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230323212929.png)


## 后台运行
在状态后面有个 `+`  ， 这是说明这个进程运行在前台，如果没有 `+` ，就是表示进程运行在后台，运行在后台的进程是无法被 `ctrl^c`  kill的。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317155519.png)


在运行程序的使用时候可以在 其后 加一个 `&` 符号，就可变为后台进程。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317155523.png)




## R运行状态（running）: 
并不意味着进程一定在运行中，它表明进程要么是在运行中要么在运行队列里。
```cpp
#include <iostream>
#include <unistd.h>

int main()
{
    
    while(1)
    {
      int c = 10;
      int a= c;
    }
    return 0;
}
```
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317155554.png)
在当前进程中没有 **I/O** 流的使用，所以使用的是==**R**==状态。

## S睡眠状态（sleeping):
意味着进程在等待事件完成（这里的睡眠有时候也叫做可中断睡眠（interruptible sleep））。
```cpp
#include <iostream>
#include <unistd.h>

int main()
{
    while(1)
    {
      int c = 10;
      int a = c;
      std::cout << a << std::endl; 
    }
    return 0;
}
```
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317190050.png)

比如这进程就是在等待 I/O ,因为这个进程中就有一个输出语句。

## 磁盘休眠状态（Disk sleep）
有时候也叫**不可中断睡眠状态**（uninterruptible sleep），在这个状态的进程通常会等待IO的结束。
当进程处于==**D状态**==时，是==不可被杀==掉的。



## T停止状态（stopped）：
可以通过发送 SIGSTOP 信号给进程来停止（T）进程。这个被暂停的进程可以通过发送 SIGCONT 信号让进程继续运行。

使用 [[linux常用命令#kill|kill]] 的指令 来停止进程运行，注意：只是==**停止**==；
![[linux常用命令#kill]]
使用 ==19==号 `SIGSTOP` 来停止进程

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317190155.png)

此时的进程状态就是 ==**T**==
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317190159.png)


当我们在使用 ==18==号 `SIGCONT` 来开始进程时,进程就会没有后面的==**+**==了，表示在后台运行。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317190215.png)

此时的进程就无法使用 `ctrl^c`来==**终止**==进程了，只有使用 `kill -9` 指令来终止进程。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317190221.png)



## X死亡状态（dead）：
这个状态只是一个返回状态，你不会在任务列表里看到这个状态。


## Z(zombie)僵尸进程
- ==**僵死状态**==（Zombies）是一个比较特殊的状态。当==进程退出==并且父进程（使用wait()系统调用,后面讲）没有读取到子进程退出的返回代码时就会产生僵死(尸)进程

- 僵死进程会以终止状态保持在进程表中，并且会一直在等待父进程读取退出状态代码。

- 所以，只要子进程退出，父进程还在运行，但父进程没有读取子进程状态，子进程进入Z状态


```cpp
include <iostream>
#include <unistd.h>
#include <cstdlib>
using namespace std;
int main()
{
    pid_t id = fork();
    if(id == 0){
        //child
        while(true){
            cout << " I am child, running!" << endl;
            sleep(2);
        }
    }
    else{
        //parent
        cout << "father do nothing!\n" << endl;
        sleep(10);
        exit(1);
    }
    return 0;
}
```
运行以上代码，在右边的窗口中运行 这段脚本 `while :; do ps axj |head -1 && ps ajx| grep myproc | grep -v grep ;sleep 1; echo "###############"; done`

由此可以在父进程还么退出前，[[linux常用命令#kill|kill]] 了子进程。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317190346.png)


由此就看能看到Z状态的僵尸子进程。

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317190353.png)

# 孤儿进程
 >*  父进程如果提前退出，那么子进程后退出，进入Z之后，那该如何处理呢？
>* **父进程先退出，子进程就称之为“孤儿进程”**
>* 孤儿进程被==**1号init进程**==**领养**，当然要有init进程**回收**喽。

还是这段代码
```cpp
include <iostream>
#include <unistd.h>
#include <cstdlib>
using namespace std;
int main()
{
    pid_t id = fork();
    if(id == 0){
        //child
        while(true){
            cout << " I am child, running!" << endl;
            sleep(2);
        }
    }
    else{
        //parent
        cout << "father do nothing!\n" << endl;
        sleep(10);
        exit(1);
    }
    return 0;
}
```

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317190445.png)



# 进程优先级
## 基本概念
> * cpu资源分配的先后顺序，就是指进程的优先权(priority)。
> * 优先权高的进程有优先执行权利。配置进程优先权对多任务环境的ux很有用，可以改善系统性能.
> * 还可以把进程运行到指定的CPU上，这样一来，把不重要的进程安排到某个CPU,可以大大改善系统整体性能。

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317190504.png)
==UID== : 代表执行者的身份
==PID== : 代表这个进程的代号
==PPID== ：代表这个进程是由哪个进程发展衍生而来的，亦即父进程的代号
==PRI== ：代表这个进程可被执行的优先级，其值越小越早被执行
==NI== ：代表这个进程的nice值


## PRI and NI
==**PRI**==也还是比较好理解的，即==**进程的优先级**==，或者通俗点说就是程序被CPU执行的先后顺序，此==**值越小进程的优先级别越高**==

那==**NI**==呢?就是我们所要说的==**nice值**==了，其表示==**进程可被执行的优先级的修正数值**==。PRI值越小越快被执行，那么加入nice值后，将会使得PRI变为：**`PRI(new)=PRI(old)+nice`**

所以，调整进程优先级，在Linux下，就是调整进程nice值

nice其==取值范围==是==**-20至19**==，一共40个级别

## 优先级修改
优先级最好不要修改，因为我们对于资源的分配上没有系统了解，让系统自己做就好了。但是基于学习我们就学习用 ==**top**== 来修改进程优先级。
注意：==**NI值**得修改范围是 **-20至19**== ，频繁进行修改时需要使用 `sudo`指令`sudo top`。

nice值为何要是一个相对比较小的范围呢？？
>优先级再怎么设置，也只能是一种==**相对的优先级**==，**不能**出现==**绝对的优先级**==，否则会出现很严重的==进程“饥饿问题”==
>调度器：较为均衡的让每个进程享受到CPU资源

使用 top后，会出现这个页面
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317190554.png)

进入后，按下 `r`键 ，就会出现调整优先级的命令行 ：
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317190612.png)
虽然上面会有**默认调整**的进程，但是只要输入我们的==**进程的pid**==就是进行修改了。

如我们的输入的进程pid为 `23283` , 修改的 ==**NI**== 为 **10**；
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317190648.png)


查看是否修改成功
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317190752.png)

修改成功

如果再将NI的值该为5呢，结果是95吗？
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317190810.png)

结果：并不是，而是以==**默认的PRI的值作为基础修改的**==。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317190821.png)



而当NI值修改为-100时呢？
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317190845.png)

结果：发现Ni值==最低==只能为==**-20**== ，当然最高为 ==19==。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317190848.png)
