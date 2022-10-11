 信号和[[进程间通信#信号量|信号量]] 没有关系，就像老婆和老婆饼
 
 # 生活中的信号
 - 你在网上买了很多件商品，再等待不同商品快递的到来。但即便快递没有到来，你也知道快递来临时， 你该怎么处理快递。也就是你能“识别快递”
- 当快递员到了你楼下，你也收到快递到来的通知，但是你正在打游戏，需5min之后才能去取快递。那 么在在这5min之内，你并没有下去去取快递，但是你是知道有快递到来了。也就是取快递的行为并不 是一定要立即执行，可以理解成“在合适的时候去取”。
- 在收到通知，再到你拿到快递期间，是有一个时间窗口的，在这段时间，你并没有拿到快递，但是你知道有一个快递已经来了。本质上是你“记住了有一个快递要去取”
- 当你时间合适，顺利拿到快递之后，就要开始处理快递了。而处理快递一般方式有三种：1. 执行默认动作（幸福的打开快递，使用商品）2. 执行自定义动作（快递是零食，你要送给你你的女朋友）3. 忽略快递（快递拿上来之后，扔掉床头，继续开一把游戏）
- 快递到来的整个过程，对你来讲是异步的，你不能准确断定快递员什么时候给你打电话



# 技术角度的信号
信号产生 --> 信号是给进程发的 --> 进程要在合适的时候要执行对应的动作

进程在没有收到信号时，进程是知道如何识别是哪一个信号的，因为工程师们在写进程源代码的时候就设置好了。==进程具有识别信号并处理信号的能力远远早于信号的产生的!==

![[Pasted image 20220910184733.png]]
既然进程收到进程时，不是立即处理的，那么这个信号保持在了那里？在 `struct task_struct` 。

task_struct 是一个内核数据结构，定义进程对象。==内核不相信任何人，只相信自己==。那是谁向task_struct 内写入信号数据呢？ ==**OS!!!!**==


# 信号概念
信号是进程之间事件异步通知的一种方式，属于软中断


# 用`kill -l`命令可以察看系统定义的信号列表
![[Pasted image 20220910185914.png]]
1号到31号的信号是 ==**普通信号**==，34号及以后的信号是 ==**实时信号**==。而我们只学习普通信号，不学习实时信号。
而我们在程序运行时使用的 `ctrl+c` ，其实就是2号信号 `SIGINT` .



# 信号捕捉函数 signal()
![[Pasted image 20220910215207.png]]
可以将捕捉信号 ， 并修改信号的处理方式。
第一个参数 ==signum== 表示我们要捕捉的信号， 
第二个参数 ==handler== 则是一个函数指针，指向了我们修改信号处理方式的函数地址。 


**注意：9号信号是无法被捕捉(自定义)的.**


![[Pasted image 20220911194956.png]]

```c
#include <stdio.h>
#include <unistd.h>
#include <signal.h>


void handler(int signo)//当捕捉到信号后，才会调用
{
    printf("get a signal: signal no : %d ,pid %d \n" , signo , getpid());
}


int main(){
    signal(2 , handler); //捕捉2号信号 ，也就SIGINT ， ctrl+c

    int count = 0;
    while(1){
        printf("count = %d\n" , count);
        sleep(1);
    }
    return 0;
}
```

当我们修改了2号信号默认的处理方式后，ctrl+c快捷键的功能也相应改变了。
![[Pasted image 20220911195248.png]]



# 信号处理的常见方式
1. **忽略**此信号。
2. 执行该信号的**默认处理动作**。
3. (信号的捕捉）**自定义动作**--我们刚刚用signal方法，就是在修改信号的处理动作由:默认->自定义动作


# 产生信号
1. 键盘产生，如我们的 `ctrl+c`  ， `ctrl+/` 等；
2. 进程异常，也能产生信号
3. 通过系统调用，产生信号
4. 软件条件,也能产生信号


## 1.键盘产生的信号
键盘产生的信号： ctrl+c , ctrl+/


对所有信号信息捕捉，但是我们的handler函数中，只是针对个别几个继续处理。
```c
#include <stdio.h>
#include <unistd.h>
#include <signal.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <stdlib.h>


void handler(int signo)
{
    switch(signo)
    {
        case 2:
             printf("hello fmy ... get a signal no : %d" , signo );
            break;

        case 3:
             printf("hello world ... get a signal no : %d" , signo );
            break;

       // case 11:
       //      printf("hello word... get a signal no : %d" , signo );
       //     break;

    }
    exit(0);
}


int main(){

    int sig = 1;
    for(; sig <= 31 ; sig++ )
    {
        signal(sig , handler);
    }



    while(1)
    {
        int* p = (int*)100;
        *p = 100;
        printf("hello");
        sleep(1);
    }

	return 0;
}
```


## 2.程序中存在异常问题，导致我们收到信号退出
硬件异常被硬件以某种方式被硬件检测到并通知内核,然后内核向当前进程发送适当的信号。例如当前进程执行了除以0的指令,CPU的运算单元会产生异常,内核将这个异常解释 为SIGFPE信号发送给进程。再比如当前进程访问了非法内存地址,,MMU会产生异常,内核将这个异常解释为SIGSEGV信号发送给进程。

- 在Linux中，当一个进程退出的时候，它的退出码和退出信号都会被设置(正常情况)。
- 当一个进程异常的时候，进程的退出信号会被设置，表明当前进程退出的原因。
- 如果必要，OS会设置退出信息中的[[Linux进程控制#status的构成|core dump]]标志位，并将进程在内存中的数据转储到磁盘当中，方便我们后期调试。
![[Pasted image 20220911205455.png]]

**如下8号信号 `SIGFPE`  和 11号信号 `SIGSEGV`** 就属于硬件异常产生的信号。
![[Pasted image 20220912092557.png]]
```c
#include <stdio.h>
#include <signal.h> 
void handler(int sig)
{
    printf("catch a sig : %d\n", sig); 
}
int main() 
{
    //signal(SIGSEGV, handler); 
    int *p = NULL; 
    p = (int*)100;
    *p = 100;
    return 0; 
}
```
![[Pasted image 20220912091043.png]]

捕捉信号
```c
#include <stdio.h>
#include <unistd.h>
#include <signal.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <stdlib.h>

void handler(int signo)
{
    printf("get a sig no: %d\n" , signo);
    exit(0);
}

int main(){

    signal(SIGSEGV , handler);

    int *p = NULL;
    p = (int*)100;
    *p = 100;

    return 0;
}

```
![[Pasted image 20220912091950.png]]



### core dump的使用
云服务器上的 core dump 一般是被关闭的，需要我们开启
![[Pasted image 20220911205704.png]]

开始时需要我们定义此文件的大小，使用 `ulimit -c 10240` 指令。 我这里定义为 10240byte , 表示开启core dump。
![[Pasted image 20220911212049.png]]


==**开启core dump前**==
```c
int main(){
    while(1)
    {
        printf("hello, pid:%d\n" ,getpid() );
        fflush(stdout);
        sleep(1);
    }
    return 0;
}

```
此时这个程序时和死循环。我们对此进程使用 `kill -11` 后
![[Pasted image 20220911212353.png]]
运行结果上就会报出 **Segmentation fault**  段错误。也就是11 号信号。
![[Pasted image 20220911211745.png]]


==**开启core dump后**== ，运行一样的代码发现  **Segmentation fault** 后多了一句 **core dumped**
，此时我们就可以使用[[gdb调试]]出产生信号的代码行了
![[Pasted image 20220911212650.png]]

在使用 [[linux常用命令#ls|ll]] 时，可以发现出现了一个 ==core.4323== 的文件4323其实就是我们的进程ID。
![[Pasted image 20220911212911.png]]


先看以下代码,以下代码会产生8号信号`SIGFPE`。
```c
int main(){
    while(1)
    {
        int a = 10 ;
        a /= 0;
        printf("hello, pid:%d\n" ,getpid() );
        sleep(1);
    }
    return 0;
}

```
我们开启core dump后就可以对其进行[[gdb调试]]了
![[Pasted image 20220911213658.png]]

![[Pasted image 20220911214448.png]]


## 3.系统调用产生的信号
还可以使用 系统调用 kill() ,  raise() , abort() 来产生信号

### kill()
kill可以给指定的进程发送信号。
![[Pasted image 20220911230221.png]]

其实可以配合[[Linux 进程参数|main函数参数]]来进行使用
```c
static void Usage(const char* proc)//使用手册
{
    printf("Usage:\n\t %s signo who\n" , proc);
}

int main(int argc , char* argv[]){

    if(argc != 3)//因为主要由三个参数，等于3时，这打开手册
    {
        Usage(argv[0]);
        return 1;
    }


    int signo = atoi(argv[1]);//因为argv中是字符或字符串，所以需要强转
    int who = atoi(argv[2]);

    kill(who ,signo);

    printf("signo: %d , who: %d \n" ,signo ,who);

    return 0;
}
```
![[Pasted image 20220911230136.png]]


### raise()
raise只能给自己发送信号；
![[Pasted image 20220911230717.png]]

```c
#include <stdio.h>
#include <unistd.h>
#include <signal.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <stdlib.h>


void handler(int signo)
{
    switch(signo)
    {
        case 2:
             printf("hello fmy ... get a signal no : %d" , signo );
            break;

        case 3:
             printf("hello world ... get a signal no : %d" , signo );
            break;
            
        default:
            printf("get a signal no : %d \n" ,signo );
    }
    exit(0);
}

static void Usage(const char* proc)
{
    printf("Usage:\n\t %s signo who\n" , proc);
}

int main(){

    int sig = 1;
    for(; sig <= 31 ; sig++ )
    {
        signal(sig , handler);
    }


    raise(8);//向自己发送8号信号
    printf("hello\n" );

    sleep(5);

    return 0;
}

```
![[Pasted image 20220911231456.png]]



### abort()
向自己进程发送6号==SIGABRT==信号
![[Pasted image 20220911231923.png]]

```c
#include <stdio.h>
#include <unistd.h>
#include <signal.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <stdlib.h>


void handler(int signo)
{
    switch(signo)
    {
        case 2:
             printf("hello fmy ... get a signal no : %d" , signo );
            break;

        case 3:
             printf("hello world ... get a signal no : %d" , signo );
            break;
            
        default:
            printf("get a signal no : %d \n" ,signo );
    }
    exit(0);
}


static void Usage(const char* proc)
{
    printf("Usage:\n\t %s signo who\n" , proc);
}

int main(){

    int sig = 1;
    for(; sig <= 31 ; sig++ )
    {
        signal(sig , handler);
    }

    abort(); //向自己进程发送6号信号
    printf("hello\n" );

    sleep(5);

    return 0;
}

```
![[Pasted image 20220911231907.png]]



## 4.由软件条件产生的信号
系统调用产生的信号就如 ==进程间通信:当读端不光不读，而且还关闭了读fd，写端一直在写，最终写进程会受到sigpipe （13)，就是一种典型的软件条件触发的信号发送==
![[进程间通信#b 读端关闭，写端收到SIGPIPE信号直接终止]]





### alarm()
这个函数的返回值是0或者是以前设定的闹钟时间还余下的秒数。函数的返回值仍然是以前设定的闹钟时间还余下的秒数。发送的信号是 ==14号 SIGALRM== 信号。
![[Pasted image 20220912084056.png]]

```c
#include <stdio.h>
#include <unistd.h>
#include <signal.h>
#include <sys/types.h>

int main(){

    int sig = 0;
    for(;sig <=31 ; sig++){
        signal(sig , handler);
    }

    int count = 10;
    alarm(5);
    while(1)
    {
        printf("hello world\n");
        count--;
        sleep(1);
    }

    return 0;
}

```
![[Pasted image 20220912084039.png]]


#### 取消alarm()
将设好的`alarm()`置零，`alarm(0)` 则取消闹钟。
```c
#include <stdio.h>
#include <unistd.h>
#include <signal.h>
#include <sys/types.h>
#include <stdlib.h>

void handler(int signo)
{
    switch(signo)
    {
        case 2:
             printf("hello fmy ... get a signal no : %d" , signo );
            break;

        case 3:
             printf("hello world ... get a signal no : %d" , signo );
            break;

        default:
            printf("get a signal no : %d \n" ,signo );
    }
    exit(0);
}

int main(){
     int sig = 1;
     for(; sig <= 31 ; sig++){
        signal(sig , handler);
     }

    int ret = alarm(30); //定时一个30秒的闹钟

    while(1){
        printf("I am process : ret:%d\n" , ret);
        sleep(5);
        int res = alarm(0);//取消闹钟 ，获取返回值
        printf("res: %d \n" , res);
    }

    return 0;
}

```
![[Pasted image 20220912090408.png]]



# 信号发送中
## 信号其他相关常见概念
- **实际执行信号的处理动作称为信号递达**(Delivery) 
- **信号从产生到递达之间的状态,称为信号未决**(Pending)。 
- 进程可以选择阻塞 (Block )某个信号。
	- 被阻塞的信号产生时将保持在未决状态,直到进程解除对此信号的阻塞,才执行递达的动作. 
	- 注意,阻塞和忽略是不同的,只要信号被阻塞就不会递达,而忽略是在递达之后可选的一种处理动作

![[Pasted image 20220912092732.png]]


## 在内核中的标识
![[Pasted image 20220912093157.png]]
这张表需要的数组是一一相应的。
- 每个信号都有两个标志位分别表示阻塞(block)和未决(pending),还有一个函数指针表示处理动作。信号产生时,内核在进程控制块中设置该信号的未决标志,直到信号递达才清除该标志。在上图的例子 中,SIGHUP信号未阻塞也未产生过,当它递达时执行默认处理动作。
- SIGINT信号产生过,但正在被阻塞,所以暂时不能递达。虽然它的处理动作是忽略,但在没有解除阻塞之前不能忽略这个信号,因为进程仍有机会改变处理动作之后再解除阻塞。
- SIGQUIT信号未产生过,一旦产生SIGQUIT信号也将被阻塞,无法递达,它的处理动作是用户自定义函数sighandler。


### pending
![[Pasted image 20220912093748.png]]
pending 本质上就是一个==**位图**==  `uint32_t sigs` 
![[Pasted image 20220912094011.png]]

### block
block表:本质上，也是位图结构uint32_t block ;
比特位的位置，代表信号的编号
比特位的内容，代表信号是否被阻塞阻塞位图也叫作信号屏蔽字

### handler 
是一个函数指针数组 `void (*handler[31])(int)` , 用来存放相应的默认信号函数或自定义函数。
![[Pasted image 20220912095705.png]]



### 伪代码
```c
int isHandler(int signo)
{
	if(block & signo) //该信号被 block 阻塞
	{
		//根本不看是否收到信号
	}
	else // 信号没被 block
	{
		if(signo & pending) //该信号没被block ，已收到。
		{
			handlier_arrar[signo](signo);
			return 0;
		}
	}
	return 1;
}
```


## sigset_t
从上图来看,每个信号只有一个bit的未决标志,非0即1,不记录该信号产生了多少次,阻塞标志也是这样表示的。 
因此,未决和阻塞标志可以用相同的数据类型sigset_t来存储,sigset_t称为信号集,这个类型可以表示每个信号的“有效”或“无效”状态,在阻塞信号集中“有效”和“无效”的含义是该信号是否被阻塞,而在未决信号集中“有效”和“无效”的含义是该信号是否处于未决状态。


## 信号集 操作函数
sigset_t类型对于每种信号用一个bit表示“有效”或“无效”状态,至于这个类型内部如何存储这些bit则依赖于系统实现,从使用者的角度是不必关心的,使用者只能调用以下函数来操作sigset_ t变量,而不应该对它的内部数据做任何解释,比如用printf直接打印sigset_t变量是没有意义的。

```c
#include <signal.h>

int sigemptyset(sigset_t *set);//将所有信号对应的bit位清零

int sigfillset(sigset_t *set);//将所有信号对应的bit位 置1

int sigaddset (sigset_t *set, int signo);//添加signo到set中

int sigdelset(sigset_t *set, int signo);//将set中的signo删除

int sigismember（const sigset_t *set, int signo);//判断是否与pending位图中的相应bit位相等
```

- 函数==**sigemptyset**==初始化set所指向的信号集,使其中所有信号的对应bit清零,表示该信号集不包含任何有效信号。
- 函数==**sigﬁllset**==初始化set所指向的信号集,使其中所有信号的对应bit置位,表示  该信号集的有效信号包括系统支持的所有信号。
==注意,在使用sigset_ t类型的变量之前,一定要调用**sigemptyset**或**sigﬁllset**做初始化,使信号集处于确定的状态==。初始化sigset_t变量之后就可以在调用==**sigaddset**==和==**sigdelset**==在该信号集中添加或删除某种有效信号。


### sigprocmask()
调用函数sigprocmask可以读取或更改进程的信号屏蔽字(阻塞信号集)。
![[Pasted image 20220912141720.png]]
如果oldset是非空指针,则读取进程的当前信号屏蔽字通过oset参数传出。如果set是非空指针,则 更改进程的信号屏蔽字
参数how指示如何更改。如果oldset和set都是非空指针,则先将原来的信号 屏蔽字备份到oset里,然后 根据set和how参数更改信号屏蔽字。

假设当前的信号屏蔽字为mask,下表说明了how参数的可选值。
![[Pasted image 20220912145508.png]]
如果调用sigprocmask解除了对当前若干个未决信号的阻塞,则在sigprocmask返回前,至少将其中一个信号递达。



### sigpending()
读取当前进程的未决信号集,通过set参数传出。。
![[Pasted image 20220912145931.png]]
调用成功则返回0,出错则返回-1





### 使用案例
将2号信号block后，查看 pending位图
```c
#include <stdio.h>
#include <unistd.h>
#include <signal.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <stdlib.h>

void show_pending(sigset_t* set) //打印pending位图
{
    int sig = 1;
    for( ; sig <= 31 ; sig++ )
    {
         if(sigismember(set , sig))//如果sig与pending位图相应的bit位 相同，则表示 未决
            printf("1");
         else
            printf("0");
     }
     printf("\n");
 }
int main()
{
    sigset_t iset , oset;

    sigemptyset(&iset); //将iset 和 oset 置零
    sigemptyset(&oset);

    sigaddset(&iset , 2); //添加2号信号到 iset。

    sigprocmask(SIG_SETMASK , &iset , &oset); //设置block位图中的屏蔽位，被修改的屏蔽位返回到oset中

    sigset_t pending;
    while(1)
    {
        sigemptyset(&pending);

        sigpending(&pending);//读取当前信号中的未决信号集，返回到pending中。

        show_pending(&pending);//打印penging位图

        sleep(1);
    }

    return 0;
}

```
以下是运行结果
![[Pasted image 20220912144331.png]]





恢复block位图，将oset传进 sigprocmask() 中。
```c
#include <stdio.h>
#include <unistd.h>
#include <signal.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <stdlib.h>

void show_pending(sigset_t* set)
{
    printf("curr process  pending: ");
    int sig = 1;
    for( ; sig <= 31 ; sig++ )
    {
         if(sigismember(set , sig))//如果sig与pending位图相应的bit位 相同，则表示 未决
            printf("1");
         else
            printf("0");
     }
     printf("\n");
 }
int main()
{
    sigset_t iset , oset;

    sigemptyset(&iset); //将iset 和 oset 置零
    sigemptyset(&oset);

    sigaddset(&iset , 2); //添加2号信号到 iset。

    sigprocmask(SIG_SETMASK , &iset , &oset); //设置block位图中的屏蔽位，被修改的屏蔽位返回到oset中

    sigset_t pending;
    while(1)
    {
        sigemptyset(&pending);

        sigpending(&pending);//读取当前信号中的未决信号集，返回到pending中。

        show_pending(&pending);//打印penging位图
	    
	    sleep(1);

        count++;
        if(count == 20){ //当count == 20 时，将会执行 2号信号
            printf("恢复2号信号可以递达了\n");
            sigprocmask(SIG_SETMASK , &oset , NULL);
        }
    }
    return 0;
}
```
![[Pasted image 20220912151902.png]]





# 信号发送后
信号发送到task_struct 后，在"==**合适**=="的时候会被处理。

==**为什么是“合适”的时候**==:
	信号的产生是异步的，当前进程可能在做更重要的事情。

==**什么时候是合适的时候？**==
	**从内核切换回用户态的时候进行信号检测与信号的处理!**




## 用户态与核心态
**所谓的系统调用:就是进程的身份转化成为内核，然后根据内核页表找到系统函数，执行就行了。**
![[Pasted image 20220912152829.png]]



![[Pasted image 20220912153215.png]]
==**每个进程都有各自的用户级页表，但是所有进程的内核空间都共用着一张系统级页表**==




## 信号的处理过程
![[Pasted image 20220912153814.png]]

具体出来就像这样。
![[Pasted image 20220912153859.png]]

总共进行了4次 态切换 ， 
- 第一次先从用户态->核心态 ，处理当前可以递达的信号。
- 第二次是如果要执行自定义捕捉的信号，则从核心态->用户态 去执行我们写的自定义捕捉函数。
- 执行自定义捕捉函数后，进行第三次切换，从用户态->核心态 调用`sys_sigreturn()`。
- 第四次 核心态->用户态 返回用户模式从主控制流程中上次被中断的地方继续句下执行
![[Pasted image 20220912154205.png]]


## 内核时如何捕捉信号的

### sigsction()
作用其实和signal一样，不过能捕捉实时信号，而且功能多一些
![[Pasted image 20220912161331.png]]

struct sigcation结构体的内容，被红线划了的内容表示我们用不到。
![[Pasted image 20220912161516.png]]


- sigaction函数可以读取和修改与指定信号相关联的处理动作。调用成功则返回0,出错则返回- 1。
- **signum** 是指定信号的编号。若act指针非空,则根据act修改该信号的处理动作。若oact指针非 空,则通过oldact传出该信号原来的处理动作。act和oldact指向sigaction结构体。
- 将**sa_handler**赋值为常数SIG_IGN传给sigaction表示忽略信号,赋值为常数SIG_DFL表示执行系统默认动作,赋值为一个函数指针表示用自定义函数捕捉信号,或者说向内核注册了一个信号处理函 数,该函数返回 值为void,可以带一个int参数,通过参数可以得知当前信号的编号,这样就可以用同一个函数处理多种信号。显然,这也是一个回调函数,不是被main函数调用,而是被系统所调用。


**当某个信号的处理函数被调用时,内核自动将当前信号加入进程的信号屏蔽字,当信号处理函数返回时自动恢复原来的信号屏蔽字,这样就保证了在处理某个信号时,如果这种信号再次产生,那么 它会被阻塞到当前处理结束为止。** 
**如果在调用信号处理函数时,除了当前信号被自动屏蔽之外,还希望自动屏蔽另外一些信号,则用`sa_mask`字段说明这些需要额外屏蔽的信号,当信号处理函数返回时自动恢复原来的信号屏蔽字。 sa_ﬂags字段包含一些选项,本章的代码都把`sa_ﬂags`设为0,`sa_sigaction`是实时信号的处理函数**.




当我们发送2号信号时，则会在handler自定义捕捉处理方式中死循环。由于对3号信号进行了block，所以也无法使用3号信号退出。
```c
#include <stdio.h>
#include <unistd.h>
#include <signal.h>
#include <stdlib.h>
#include <string.h>


void handler(int signo)
{
    while(1)
    {
        printf("get a signo: %d\n" ,signo );
        sleep(1);
    }
}

int main()
{
    struct sigaction act; //这个结构体在 signal.h 中包含了
    memset(&act , 0 , sizeof(act));//对act进行初始化

    sigemptyset(&act.sa_mask);//清空 act.mask 

    sigaddset(&act.sa_mask , 3 );//添加3号信号进入 act.sa_mask

    act.sa_handler = handler; //将默认的信号处理方法修改为我们定义handler方法
    //act.sa_handler = SIG_IGN //将默认的信号处理方法修改为 忽略
    //act.sa_handler = SIG_DFL; //将信号处理方法修改为 默认

    sigaction(2 , &act , NULL);

    while(1){
        printf("hello bit\n");
        sleep(1);
    }

    return 0;
}

```
![[Pasted image 20220912163359.png]]


# 可重入函数
![[Pasted image 20220913090449.png]]
- main函数调用insert函数向一个链表head中插入节点node1。
- 插入操作分为两步,刚做完第一步的时候,因为硬件中断使进程切换到内核,再次回用户态之前检查到有信号待处理,于是切换 到sighandler函数,sighandler也调用insert函数向同一个链表head中插入节点node2。
- 插入操作的两步都做完之后从sighandler返回内核态,再次回到用户态就从main函数调用的insert函数中继续 往下执行,先前做第一步之后被打断,现在继续做完第二步。
- 结果是,main函数和sighandler先后  向链表中插入两个节点,而最后只有一个节点真正插入链表中了。

像上例这样,insert函数被不同的控制流程调用,有可能在第一次调用还没返回时就再次进入该函数,这称为重入,insert函数访问一个全局链表,有可能因为重入而造成错乱,像这样的函数称为 不可重入函数,反之, 如果一个函数只访问自己的局部变量或参数,则称为可重入(Reentrant) 函数。
为什么两个不同的控制流程调用同一个函数,访问它的同一个局部变量或参数就不会造成错乱?

如果一个函数符合以下条件之一则是不可重入的:
>1. 调用了malloc或free,因为malloc也是用全局链表来管理堆的。
>2. 调用了标准I/O库函数。标准I/O库的很多实现都以不可重入的方式使用全局数据结构。

insert函数一旦重入，**有可能出现问题**---该函数**不可被重入**
insert函数一旦重入，**不会出现问题**--- 该函数:**可重入函数**
==我们所学到的大部分函数，STL，boost库中的函数，大部分都是**不可重入**的!==


# volatile

volatile的作用：保**存内存的可见性，告知编译器，被该关键字修饰的变量，不允许被优化，对该变量的任何操作，都必须在真实内存中进行操作。**

在编程程序是 ，我们的代码基本上都会被编译器进行一定程度的优化，以提升效率，编译器在优化时会出现问题吗？ ==会的==

以下代码使用gcc编译器的 [[gcc与g++的使用#^youhua|-O3]] 优化，正常的代码结果是，当按下 `ctrl+c` ， 程序将运行结束。
```c
#include <stdio.h>
#include <signal.h>


int flag = 0; 

void handler(int signo)
{
    flag = 1;
    printf("change flag 0 to 1\n");
}


int main()
{

    signal(2 , handler);
    while(!flag);

    printf("process exit normally!\n");
    return 0;
}
```

但是运行结果如下，当按下`ctrl+c` 时，程序还在不断运行，无法结束。
![[Pasted image 20220913093350.png]]


原因如下：
编译器在进行优化时，将flag变量加载到了寄存器中，省得每次都需要去内存中读取，但这也导致了我们之后在handler函数中对flag进行修改时，已经无效，因为flag现在寄存器中。
![[Pasted image 20220913094236.png]]

解决办法：
```c
#include <stdio.h>
#include <signal.h>


volatile int flag = 0;//在flag处使用volatile关键字，表示不然编译器对此变量进行优化

void handler(int signo)
{
    flag = 1;
    printf("change flag 0 to 1\n");
}


int main()
{

    signal(2 , handler);
    while(!flag);

    printf("process exit normally!\n");
    return 0;
}
```
![[Pasted image 20220913094651.png]]
问题解决


# SIGCHLD
进程一章讲过用[[Linux进程控制#wait 函数|wait()]]和[[Linux进程控制#main 函数返回|waitpid()]]清理僵尸进程,父进程可以阻塞等待子进程结束,也可以非阻塞地查询是否有子进程结束等待清理(也就是轮询的方式)。
采用第一种方式,父进程阻塞了就不 能处理自己的工作了;采用第二种方式,父进程在处理自己的工作的同时还要记得时不时地轮询一 下,程序实现复杂。
其实,**子进程在终止时会给父进程发==17号SIGCHLD信号==,该信号的默认处理动作是忽略,父进程可以自定义SIGCHLD信号的处理函数** ,这样父进程只需专心处理自己的工作,不必关心子进程了,子进程 终止时会通知父进程,父进程在信号处理函数中调用wait清理子进程即可。

```c
#include <stdio.h>
#include <signal.h>
#include <unistd.h>
#include <stdlib.h>

void GetChild(int signo)
{
    //waitpid();
    printf("get a signal : %d, pid: %d\n", signo, getpid());
}

int main()
{
    signal(SIGCHLD, GetChild);
    
   // signal(SIGCHLD, SIG_IGN); //显示设置忽略17号信号，当进程退出后，自动释放僵尸进程 ,只在Linux下有效
   
    pid_t id = fork();
    if(id == 0){
        //child
        int cnt = 5;
        while(cnt){
            printf("我是子进程: %d\n", getpid());
            sleep(1);
            cnt--;
        }
        exit(0);
    }

    while(1);
    return 0;
}
```
![[Pasted image 20220913124652.png]]


其实我们也能在自定义信号处理函数中进行[[Linux进程控制#wait 函数|wait()]]和[[Linux进程控制#main 函数返回|waitpid()]] 来回收子进程
```c
void GetChild(int signo)
{
    while( (id = waitpid(-1, NULL, WNOHANG)) > 0){ //因为子进程可能不止一个，所以进行多进程等待
        printf("wait child success: %d\n", id); 
    }
    printf("child is quit! %d\n", getpid());
}

int main()
{
    signal(SIGCHLD, GetChild);
    
   // signal(SIGCHLD, SIG_IGN); //显示设置忽略17号信号，当进程退出后，自动释放僵尸进程 ,只在Linux下有效
   
    pid_t id = fork();
    if(id == 0){
        //child
        int cnt = 5;
        while(cnt){
            printf("我是子进程: %d\n", getpid());
            sleep(1);
            cnt--;
        }
        exit(0);
    }

    while(1);
    return 0;
}
```


如果我们不关心子进程退出的状态和退出码。我们可以直接选择 忽略此信号 `signal(SIGCHLD , SIG_IGN)`；
```c
int main()
{    
   signal(SIGCHLD, SIG_IGN); //显示设置忽略17号信号，当进程退出后，自动释放僵尸进程 ,只在Linux下有效
   
    pid_t id = fork();
    if(id == 0){
        //child
        int cnt = 5;
        while(cnt){
            printf("我是子进程: %d\n", getpid());
            sleep(1);
            cnt--;
        }
        exit(0);
    }

    while(1);
    return 0;
}
```
![[Pasted image 20220913125636.png]]