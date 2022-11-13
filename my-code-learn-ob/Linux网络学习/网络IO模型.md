# 网络IO
当两个主机进行交互时，各自的传输层都有各自的接受缓冲区和发送缓冲区，而数据不是随时都有的，而是当另一端发送到自己的接收缓冲区后，应用层才能向下到传输层的接收缓冲区中读取数据。
所以 `IO==等待数据+拷贝数据`

>==那要怎样提高IO的效率呢？==
>- 改变等待数据的方式
>- 减少等待的时间比重

# 五种IO模型
>例子：有五个人去钓鱼，分别是，张三， 李四，王五，赵六， 田七
>
>**张三**：专心的人，一心一意守着鱼竿。
>**李四**：三心二意的人，虽然守着鱼竿，但时不时的却做其他事。
>**王五**：聪明人，在鱼竿上放好铃铛，铃铛响时则专心钓鱼，不响时则进行其他活动。
>**赵六**：有钱人，在湖边放了很多鱼竿，哪个鱼竿钩住鱼则进行钓鱼
>**田七**：大老板 ， 他不想钓鱼，只想吃鱼，让手下来钓鱼，钓满一桶后手下打电话通知他来取。

==张三就是 **阻塞等待(BIO)**== ：无论是获取新的连接还是读取指定连接的数据，调用操作系统的函数都是阻塞的，如果要实现服务多个连接，就必须每个连接建立一个线程异步处理，否则，当建立起一个连接，但是客户端不发送数据，服务端就会被这个客户端占用，无法接受新的连接。

==李四 是 **非阻塞等待(NIO)**==: 解决了阻塞的问题，程序调用操作系统的函数，如果没有连接或数据，会立即返回，不会阻塞，避免了资源无效浪费。但是，它的问题在于，如果我有1万个连接，每次我需要挨个询问1万次，这个复杂度是O(n)的。每次询问都是一次系统调用，涉及到CPU的用户态内核态切换，成本很高。

==王五 是 **信号驱动**==：[[linux信号]]，等待系统的信号通知，然后进行处理。

==赵六 是 **多路转接**==： IO多路转接能够同时等待多个文件描述符的就绪状态.

==田七 是 **异步**==：由内核在数据拷贝完成时, 通知应用程序(而信号驱动是告诉应用程序何时可以开始拷贝数据).
	-  注意这里的异步不是系统概念的异步，网络的异步和系统的异步不是一个概念。
	- 网络异步就是这在乎结果，不参与过程

## 阻塞等待(BIO)
阻塞IO: 在内核将数据准备好之前, 系统调用会一直等待. 所有的套接字, 默认都是阻塞方式.
![[Pasted image 20221106230003.png]]

## 非阻塞等待(NIO)
如果内核还未将数据准备好, 系统调用仍然会直接返回, 并且返回`EWOULDBLOCK`错误码.

**非阻塞IO往往需要程序员循环的方式反复尝试读写文件描述符**, 这个过程称为==**轮询**==. 这对CPU来说是较大的浪费, 一般只有特定场景下才使用.
![[Pasted image 20221106230130.png]]


## 信号驱动IO
信号驱动IO: 内核将数据准备好的时候, 使用**SIGIO**信号()通知应用程序进行IO操作.
![[Pasted image 20221106230242.png]]


## 多路转接IO
IO多路转接: 虽然从流程图上看起来和阻塞IO类似. 实际上最核心在于IO多路转接能够同时等待多个文件描述符的就绪状态.
![[Pasted image 20221106231024.png]]



## 异步IO
异步IO: 由内核在数据拷贝完成时, 通知应用程序(而信号驱动是告诉应用程序何时可以开始拷贝数据).
![[Pasted image 20221106231107.png]]

## 小结
任何IO过程中, 都包含两个步骤. **第一是等待, 第二是拷贝**. 而且在实际的应用场景中, 等待消耗的时间往 
往都远远高于拷贝的时间. 让IO更高效, 最核心的办法就是让等待的时间尽量少.


| |BIO|	NIO	|IO多路	|信号驱动IO	|异步IO|
|:-:|:-:|:-:|:-:|:-:|:-:|
|第一阶段|	阻塞|	非阻塞|	阻塞|	非阻塞|	非阻塞|
|第二阶段|阻塞	|阻塞	|阻塞	|阻塞	|非阻塞|
![[Pasted image 20221107120859.png]]


# 网络IO的重要概念
## 同步通信 vs 异步通信(synchronous communication/ asynchronous communication)
### 同步和异步关注的是消息通信机制.
>- 所谓同步，就是在发出一个调用时，在没有得到结果之前，该调用就不返回. 但是一旦调用返回，就得到返回值了; 换句话说，就是由调用者主动等待这个调用的结果;
>- 异步则是相反，调用在发出之后，这个调用就直接返回了，所以没有返回结果; 换句话说，当一个异步过程调用发出后，调用者不会立刻得到结果; 而是在调用发出后，被调用者通过状态、通知来通知调用者，或通过回调函数处理这个调用.

另外, 我们回忆在讲多进程多线程的时候, 也提到同步和互斥. 这里的同步通信和进程之间的同步是完全不想干的概念.
>- 进程/线程同步也是进程/线程之间直接的制约关系
>- 是为完成某种任务而建立的两个或多个线程，这个线程需要在某些位置上协调他们的工作次序而等待、传递信息所产生的制约关系. 尤其是在访问临界资源的时候.

**以后在看到 "同步" 这个词, 一定要先搞清楚大背景是什么. 这个同步, 是同步通信异步通信的同步, 还是同步 
与互斥的同步.**

### 阻塞 vs 非阻塞
阻塞和非阻塞关注的是程序在等待调用结果（消息，返回值）时的状态.
>- 阻塞调用是指调用结果返回之前，当前线程会被挂起. 调用线程只有在得到结果之后才会返回. 
>- 非阻塞调用指在不能立刻得到结果之前，该调用不会阻塞当前线程.


# 非阻塞IO
## fcntl函数
一个文件描述符, 默认都是阻塞IO.
![[Pasted image 20221108160823.png]]

传入的cmd的值不同, 后面追加的参数也不相同. 

fcntl函数有5种功能:
>- 复制一个现有的描述符（cmd=F_DUPFD）.
>- 获得/设置文件描述符标记(cmd=F_GETFD或F_SETFD). 
>- 获得/设置文件状态标记(cmd=F_GETFL或F_SETFL). 
>- 获得/设置异步I/O所有权(cmd=F_GETOWN或F_SETOWN). 
>- 获得/设置记录锁(cmd=F_GETLK,F_SETLK或F_SETLKW).

我们此处只是用第三种功能, 获取/设置文件状态标记, 就可以将一个文件描述符设置为非阻塞.

## 实现函数SetNoBlock
基于`fcntl()`, 我们实现一个SetNoBlock函数, 将文件描述符设置为==**非阻塞**==.
```cpp
void SetNonBlock(int fd)
{
    int fl = fcntl(fd, F_GETFL);//取得 fd的标志位
    if(fl<0)
    {
        perror("fcntl");
        return;
    }

    fcntl(fd, F_SETFL, fl | O_NONBLOCK); //设置 fd 的标志位
}
```
- 使用`F_GETFL`将当前的文件描述符的属性取出来(这是一个位图).
- 然后再使用`F_SETFL`将文件描述符设置回去. 设置回去的同时, 加上一个`O_NONBLOCK`参数.
![[Pasted image 20221108163225.png]]


```cpp
#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>
#include <string.h>
#include <errno.h>
#include <stdlib.h>

void setNoBlock(int fd)
{
	int f1 = fcntl(fd, F_GETFL);

	if (f1 < 0)
	{
		perror("fcntl");
		exit(1);
	}

	fcntl(fd, F_SETFL, f1 | O_NONBLOCK);
}

int main()
{
	setNoBlock(0);

	while (1)
	{
		char buffer[1024];
		ssize_t s = read(1, buffer, strlen(buffer));
		if (s > 0)
		{
			buffer[s] = 0;
			write(1, buffer, strlen(buffer));
			printf("read success , s:%d , errno:%d \n", s, errno);
		}
		else
		{
			if (errno == EAGAIN || errno == EWOULDBLOCK)
			{
				printf("数据没有准备好，再试试吧!\n");
				printf("read failed, s: %d, errno: %d\n", s, errno);
				//做做其他事情
				sleep(1);
				continue;
			}
		}
	}
}
```
![[Pasted image 20221108173010.png]]

>==在非阻塞情况下，我们读取数据，如果数据没有就绪，系统是以出错的形式返回的(不是错误)，**没有就绪** 和**真正的错误**使用的是同样的方式标识，如何进一步区分呢??==
>那就是`errno` 中的  `EAGAIN` 表示的就是没有就绪。

# 多路转接IO
 多路IO转接服务器也叫做多任务IO服务器。该类服务器实现的主旨思想是，不再由应用程序自己监视客户端连接，取而代之由内核替应用程序监视文件。
 
 主要使用的方法有三种: **select** , **poll** , **epoll**

select，poll，epoll都是IO多路复用的机制。I/O多路复用就是通过一种机制，一个进程可以监视多个描述符，一旦某个描述符就绪（一般是读就绪或者写就绪），能够通知程序进行相应的读写操作。但select，poll，epoll本质上都是同步I/O，因为他们都需要在读写事件就绪后自己负责进行读写，也就是说这个读写过程是阻塞的，而异步I/O则无需自己负责进行读写，异步I/O的实现会负责把数据从内核拷贝到用户空间。

## select
系统提供select函数来实现多路复用输入/输出模型.
>- select系统调用是用来让我们的程序监视多个文件描述符的状态变化的;
>- 程序会停在select这里等待，直到被监视的文件描述符有一个或多个发生了状态改变;

### select函数分析
需要导入头文件 `sys/select.h`
![[Pasted image 20221108151253.png]]
>==nfds==: 监控的文件描述符集里最大文件描述符加1，因为此参数会告诉内核检测前多少个文件描述符的状态
>==readfds==： 监控有读数据到达文件描述符集合，传入传出参数
>==writefds==： 监控写数据到达文件描述符集合，传入传出参数
>==exceptfds==： 监控异常发生达文件描述符集合,如带外数据到达异常，传入传出参数
>==timeout==： 定时阻塞监控时间。
>	- NULL：则表示`select()`没有timeout，select将一直被阻塞，直到某个文件描述符上发生了事件;
>	- 0：仅检测描述符集合的状态，然后立即返回，并不等待外部事件的发生。
>	- 特定的时间值：使用timeval设置，如果在指定的时间段里没有事件发生，`select()`将超时返回。

#### timeout的取值
timeval结构用于描述一段时间长度，如果在这个时间内，需要监视的描述符没有事件发生则函数返回，返回值为0。
```cpp
struct timeval {
	long tv_sec; /* seconds */
	long tv_usec; /* microseconds */
};
```


#### fd_set的结构
![[Pasted image 20221108152720.png]]

![[Pasted image 20221108152817.png]]

其实这个结构就是一个整数数组, 更严格的说, 是一个 "**位图**". 使用位图中对应的位来表示要监视的文件描述符.

fd_set 的大小是 `128byte` ，但是使用的位图结构，所以能存储 `128 * 8`的fd

#### 函数返回值：
- 执行成功则**返回文件描述词状态已改变的个数**
- 如果返回**0**代表在描述词状态改变前已超过timeout时间，没有返回
- 当有错误发生时则返回 **-1**，错误原因存于errno，此时参数readfds，writefds, exceptfds和timeout的值变成不可预测。

>错误值可能为：
>EBADF 文件描述词为无效的或该文件已关闭 
>EINTR 此调用被信号所中断
>EINVAL 参数n 为负值。 
>ENOMEM 核心内存不足


### 用来操作fd_set 的接口
```cpp
void FD_CLR(int fd, fd_set *set); //把文件描述符集合里fd清0

int FD_ISSET(int fd, fd_set *set); //测试文件描述符集合里fd是否置1

void FD_SET(int fd, fd_set *set); //把文件描述符集合里fd位置1

void FD_ZERO(fd_set *set); //把文件描述符集合里所有位清0
```


### 理解select执行过程
 理解select模型的关键在于理解fd_set,为说明方便，取fd_set长度为1字节，fd_set中的每一bit可以对应一个文件描述符fd。则1字节长的fd_set最大可以对应8个fd.

这是执行一次的过程
>(1)执行`fd_set set`; `FD_ZERO(&set)`;则set用位表示是**0000,0000**。
>(2)若`fd＝5`,执行`FD_SET(fd,&set)`; 后set变为**0001,0000**(第5位置为1)
（3）若再加入`fd＝2`，`fd=1`,则**set**变为**0001,0011** 
（4）执行 `select(6,&set,0,0,0)`阻塞等待 
（5）若`fd=1,fd=2`上都发生可读事件，则select返回，此时set变为**0000,0011**。注意：**没有事件发生的`fd=5`被清空**。

`select()`因为使用输入输出型参数标识不同的含义，**意味着后面每一次，都需要对fd_set进行重新设置**!!

==但是你的程序，怎么知道你都有那些fd呢?**所以用户必须定义数组或者其他容器结构，来把历史fd全部保存起来，需要使用第三方数组**==

上面的执行过程其实是有一个文件的，也就是 `0` fd，怎么表示呢，为什么在上面的案例中没有？
其实不是没有，而是选择性省略了这个 `0` fd 所在的位置，可以这样想象，在一个数组中，0号fd对应的就是下标0，3号fd对应的就是下标3，6号fd对应的就是下标6，以此类推。所以0号fd不是没有对应的bit位，而是被选择性省略了。

### socket 就绪条件
#### 读就绪
- socket内核中, 接收缓冲区中的字节数, 大于等于低水位标记SO_RCVLOWAT. 此时可以无阻塞的读该文件描述符, 并且返回值大于0;
- socket TCP通信中, 对端关闭连接, 此时对该socket读, 则返回0; 
- 监听的socket上有新的连接请求;
- socket上有未处理的错误;

#### 写就绪
- socket内核中, 发送缓冲区中的可用字节数(发送缓冲区的空闲位置大小), 大于等于低水位标记 
- SO_SNDLOWAT, 此时可以无阻塞的写, 并且返回值大于0;
- socket的写操作被关闭(close或者shutdown). 对一个写操作被关闭的socket进行写操作, 会触发SIGPIPE信号;
- socket使用非阻塞connect连接成功或失败之后;
- socket上有未读取的错误;

## poll
poll 和 [[网络IO模型#select|select]] 的实现机制类似，本质上没有多大差别，也是管理多个套接字文件描述符，也是由内核进行轮询并根据描述符的状态进行处理，**但是 poll() 没有最大文件 描述符数量的限制**，勉强算是`select()`函数的升级版。poll 的函数原型如下
![[Pasted image 20221109124637.png]]
>参数解析
>==fds==: 是一个 pollfd 结构类型的数组的首地址，用于存放需要检测其状态的Socket描述符
>==nfds==: 监控数组中有多少文件描述符需要被监控
>==timeout==: 毫秒级等待
>		 `-1`：阻塞等，#define INFTIM -1（Linux中没有定义此宏，可以自己定义）
>		 `0`：立即返回，不阻塞进程
>		 `>0`：等待指定毫秒数，如当前系统时间精度不够毫秒，向上取值

### pollfd解析
==**pollfd的结构**==
```c
struct pollfd {
	int fd;        /* 文件描述符：用户设置关注的文件描述符（用户填充） */
	short events; /* 监控的事件：用户关注的事件类型（用户填充） */
	short revents; /* 监控事件中满足条件返回的事件：/由内核填充，就绪的事件类型 */
};
```

  
==**pollfd 结构监控的事件类型**==
|宏|含义|
|:-:|:-|
|`POLLIN` | 普通或带外优先数据可读,即`POLLRDNORM|POLLRDBAND` |
| `POLLRDNORM`|数据可读 |
|`POLLRDBAND` |优先级带数据可读|
|`POLLPRI`| 高优先级可读数据|
| `POLLOUT` |普通或带外数据可写|
| `POLLWRNORM`| 数据可写|
|`POLLWRBAND`| 优先级带数据可写|
| `POLLERR`| 发生错误|
|`POLLHUP` |发生挂起|
|`POLLNVAL` |描述字不是一个打开的文件|



### poll 特点
相对于 Linux 下 select 和 epoll，poll 特点如下：

- 相较于select而言，poll的优势：
	1. 传入、传出事件分离。无需每次调用时，重新设定监听事件（重新初始化）。
	2. 文件描述符上限，可突破1024限制。能监控的最大上限数可使用配置文件调整。
	3. 相比同步阻塞型 IO 模型，poll 用单线程（进程）执行，占用资源少，不消耗太多 CPU，同时能够为多客户端提供服务。

- 缺点和select一样：
	1. 大量遍历：只是返回变化的套接字文件描述符的个数，具体哪个变化需要遍历；
	2. 不必要的拷贝：监听的文件描述集合在应用层和内核之间来回拷贝；
	3. 大量并发时，少量触发（即只有少量描述符被触发）时遍历低效。


## epoll
epoll是在2.6内核中提出的，是之前的select和poll的增强版本。相对于select和poll来说，epoll更加灵活，没有描述符限制。epoll使用一个文件描述符管理多个描述符，将用户关系的文件描述符的事件存放到内核的一个事件表中，这样在用户空间和内核空间的copy只需一次。

### epoll 函数
epoll操作过程需要三个接口，分别如下：
```cpp
int epoll_create(int size)；//创建一个epoll的句柄，size用来告诉内核这个监听的数目一共有多大
int epoll_ctl(int epfd, int op, int fd, struct epoll_event *event)；
int epoll_wait(int epfd, struct epoll_event * events, int maxevents, int timeout);
```

#### epoll_create()
![[Pasted image 20221109131619.png]]
创建一个epoll的句柄(文件描述符)，`size`用来告诉内核这个监听的数目一共有多大，这个参数不同于`select()`中的第一个参数，给出最大监听的fd+1的值，**参数size并不是限制了epoll所能监听的描述符最大个数，只是对内核初始分配内部数据结构的一个建议**。  
当创建好epoll句柄后，它就会占用一个fd值，在linux下如果查看/proc/进程id/fd/，是能够看到这个fd的，所以在使用完epoll后，必须调用`close()`关闭，否则可能导致fd被耗尽。

#### epoll_ctl()
![[Pasted image 20221109131841.png]]
>函数解析
>- ==epfd==：是`epoll_create()`的返回值。 
>- ==op==：表示op操作，用三个宏来分别表示添加、删除和修改对fd的监听事件。：
>		- 添加`EPOLL_CTL_ADD`
>		- 删除`EPOLL_CTL_DEL`
>		- 修改`EPOLL_CTL_MOD`  
>- ==fd==：是需要监听的fd（文件描述符）  
>- ==epoll_event==：是告诉内核需要监听什么事，

==**struct epoll_event结构如下：**==
```cpp
struct epoll_event {
  uint32_t events;  /* Epoll events */
  epoll_data_t data;  /* User data variable */
};


//epoll_data_t data的结构
typedef union epoll_data{
	void* ptr;
	int fd;
	uint32_t u32;
	uint64_t u64;
}epoll_data_t;

//events可以是以下几个宏的集合：
EPOLLIN ：表示对应的文件描述符可以读（包括对端SOCKET正常关闭）；
EPOLLOUT：表示对应的文件描述符可以写；
EPOLLPRI：表示对应的文件描述符有紧急的数据可读（这里应该表示有带外数据到来）；
EPOLLERR：表示对应的文件描述符发生错误；
EPOLLHUP：表示对应的文件描述符被挂断；
EPOLLET： 将EPOLL设为边缘触发(Edge Triggered)模式，这是相对于水平触发(Level Triggered)来说的。
EPOLLONESHOT：只监听一次事件，当监听完这次事件之后，如果还需要继续监听这个socket的话，需要再次把这个socket加入到EPOLL队列里
```


#### epoll_wait()
![[Pasted image 20221109131905.png]]
- 参数`events`是分配好的`epoll_event`结构体数组.
- epoll将会把发生的事件赋值到`events`数组中 (`events`不可以是空指针，内核只负责把数据复制到这个`events`数组中，不会去帮助我们在用户态中分配内存).
- `maxevents`告之内核这个`events`有多大，这个 `maxevents`的值不能大于创建`epoll_create()`时的`size`. 
- 参数`timeout`是超时时间 (毫秒，0会立即返回，-1是永久阻塞).
- 返回值：如果函数调用成功，返回对应I/O上已准备好的文件描述符数目，如返回**0**表示已超时, 返回**小于0**表示函数失败.

### epoll原理
1.  首先调用epoll_create()创建一个epoll实例----在内核区，是一个eventpoll结构体类型；返回值是一个文件描述符，可以通过这个文件描述符操作内核中这块内存（通过epoll提供的API进行操作）
![[Pasted image 20221109152121.png]]


2. 生成的eventpoll内部，有两个类型：
		- rb_root，红黑树结构；–记录需要检测的文件描述符
		- list_head，链表 --要求检测的文件描述符中，哪些文件描述符是有数据的
优点： 与select和poll相比，直接在内核中创建一块内存，没有用户态到内核态的开销。
![[Pasted image 20221109152202.png]]


3. 委托内核检测，`epoll_ctl()`函数
		- `epollfd`就是epoll_create()函数的返回值；
		- `EPOLL_CTL_ADD`：指定做什么操作
		- `lfd`：需要检测的文件描述符
		- `ev`：内核需要检测的事件；
				- `ev`参数的类型是：`epoll_event`
				- `ev.events = EPOLLIN`，检测读事件；
				- `ev.data.fd = lfd`，检测的文件描述符值
注意：现在只是将需要检测的文件描述符添加到红黑树rbr结构中；–比如添加了5个需要检测。
![[Pasted image 20221109152412.png]]

4.  `epoll_wait()`，调用后，内核就会在内核中的红黑树结构中进行检测；
	    - 比如红黑树中需要检测5个文件描述符，有3个文件描述符发生了变化，将这3个文件描述符添加到链表rdlist中；
	    - 并且rdlist中数据会返回出去，速度是很快的（注意：可以返回具体是哪几个文件描述符）
![[Pasted image 20221109152448.png]]

![[Pasted image 20221109152454.png]]


### epoll 的 LT模式和 ET模式
`epoll`事件有两种模型，边沿触发：edge-triggered (ET)， 水平触发：level-triggered (LT)

>你正在吃鸡, 眼看进入了决赛圈, 你妈饭做好了, 喊你吃饭的时候有两种方式:
>1. 如果你妈喊你一次, 你没动, 那么你妈会继续喊你第二次, 第三次...(亲妈, 水平触发)
>2. 如果你妈喊你一次, 你没动, 你妈就不管你了(后妈, 边缘触发)

#### 水平触发(level-triggered)
epoll默认状态下就是LT工作模式.
-   socket接收缓冲区不为空 有数据可读 读事件一直触发  
-   socket发送缓冲区不满 可以继续写入数据 写事件一直触发  

>- 当epoll检测到socket上事件就绪的时候,可以不立刻进行处理.或者只处理一部分.
>- 如上面的例子,由于只读了1K数据,缓冲区中还剩1K数据,在第二次调用epoll_wait时,epoll_wait仍然会立刻返回并通知socket读事件就绪.
>- 直到缓冲区上所有的数据都被处理完,epoll_wait才不会立刻返回.
>- 支持阻塞读写和非阻塞读写
    

#### 边沿触发(edge-triggered)
-   socket的接收缓冲区状态变化时触发读事件，即空的接收缓冲区刚接收到数据时触发读事件
-   socket的发送缓冲区状态变化时触发写事件，即满的缓冲区刚空出空间时触发读事件

>- 当epoll检测到socket上事件就绪时,必须立刻处理.
>- 如上面的例子,虽然只读了1K的数据,缓冲区还剩1K的数据,在第二次调用`epoll_wait`的时候,`epoll_wait`不会再返回了.
>- 也就是说,ET模式下，文件描述符上的事件就绪后,只有一次处理机会.
>- ET的性能比LT性能更高(`epoll_wait`返回的次数少了很多).Nginx默认采用ET模式使用epoll.只支持非阻塞的读写

边沿触发仅触发一次，水平触发会一直触发。

**事件宏**
-   **EPOLLET**： 将 EPOLL设为边缘触发(Edge Triggered)模式（默认为水平触发），这是相对于水平触发(Level Triggered)来说的。

`libevent` 采用水平触发， `nginx` 采用边沿触发


#### 对比LT和ET
LT是 epoll 的默认行为. **使用 ET 能够减少 epoll 触发的次数. 但是代价就是强逼着程序猿一次响应就绪过程中就把所有的数据都处理完**.

相当于一个文件描述符就绪之后, 不会反复被提示就绪, 看起来就比 LT 更高效一些. 但是在 LT 情况下如果也能做到每次就绪的文件描述符都立刻处理, 不让这个就绪被重复提示的话, 其实性能也是一样的.

另一方面, ET 的代码复杂程度更高了.

#### 理解ET模式和非阻塞文件描述符
使用 ET 模式的 epoll, 需要将文件描述设置为非阻塞. 这个不是接口上的要求, 而是 "工程实践" 上的要求.

假设这样的场景: 服务器接受到一个10k的请求, 会向客户端返回一个应答数据. 如果客户端收不到应答, 不会发送第 
二个10k请求.
![[Pasted image 20221113164115.png]]

如果服务端写的代码是阻塞式的 `read`, 并且一次只 `read` **1k** 数据的话(read不能保证一次就把所有的数据都读出来,参考 [[linux常用命令#man|man]]手册的说明, 可能被信号打断), 剩下的**9k**数据就会待在缓冲区中.
![[Pasted image 20221113203758.png]]
此时由于epoll是**ET模式**,并不会认为文件描述符读就绪. `epoll_wait`就不会再次返回.剩下的9k数据会一直在缓冲区中.直到下一次客户端再给服务器写数据. `epoll_wait`才能返回

但是问题来了
- 服务器只读到`1k`个数据,要`10k`读完才会给客户端返回响应数据.
- 客户端要读到服务器的响应,才会发送下一个请求
- 客户端发送了下一个请求,`epoll_wait`才会返回,才能去读缓冲区中剩余的数据.

![[Pasted image 20221113203938.png]]
所以,为了解决上述问题(阻塞 `read` 不一定能一下把完整的请求读完)于是就可以使用**非阻塞轮训**的方式来读缓冲区,保证一定能把完整的请求都读出来.
而如果是**LT**没这个问题.只要缓冲区中的数据没读完,就能够让`epoll_wait`返回文件描述符读就绪.

## select实例代码
```cpp
#include <iostream>
#include <sys/select.h>

#include "Sock.hpp"

#define NUM (sizeof(fd_set) * 8)

int fd_array[NUM]; //>=0 有内容,合法的fd; 如果是-1,该位置没有fd

static void Usage(std::string proc)
{
    std::cout << "Usage: " << proc << " port" << std::endl;
}

int main(int argc, char* argv[])
{
    if (argc != 2)
    {
        Usage(argv[0]);
        exit(1);
    }

    uint16_t port = (uint16_t)atoi(argv[1]);
    int listen_sock = Sock::Socket();
    Sock::Bind(listen_sock, port);
    Sock::Listen(listen_sock);

    for (int i = 0; i < NUM; i++) // 对fd_array 初始化为-1 ， 表示没有fd进行管理。
    {
        fd_array[i] = -1;
    }

    //注意，这里不能使用accept ， 因为accept的本质叫做通过listen_sock获取新链接
    // 前提是listen_sock上面有新链接，accept怎么知道有新链接呢？？
    // 不知道！！！accept阻塞式等待
    // 站在多路转接的视角，我们认为，链接到来，对于listen_sock,就是读事件就绪！！！
    // 对于所有的服务器，最开始的时候，只有listen_sock

    fd_set rfds;
    fd_array[0] = listen_sock;
    while (true)
    {
        FD_ZERO(&rfds);           //把文件描述符集合里所有位清0
        int max_fd = fd_array[0]; //最大的fd

        for (int i = 0; i < NUM; i++)
        {
            if (fd_array[i] == -1)
                continue;

            //下面的都是合法的fd
            FD_SET(fd_array[i], &rfds); //所有要关心读事件的fd，添加到rfds中

            if (max_fd < fd_array[i])
                max_fd = fd_array[i]; //更新最大fd
        }

        struct timeval timeout = { 0, 0 };

        // 我们的服务器上的所有的fd(包括listen_sock),都要交给select进行检测！！
        // recv,read,write,send,accept : 只负责自己最核心的工作：真正的读写(listen_sock:accept)

        int n = select(max_fd + 1, &rfds, nullptr, nullptr, nullptr);
        switch (n)
        {
        case -1: //当有错误发生时则返回 -1，错误原因存于errno
            std::cerr << "select error" << std::endl;
            break;
        case 0: //返回 0 代表在描述词状态改变前已超过timeout时间
            std::cout << "select timeout" << std::endl;
            break;
        default: //执行成功则 返回文件描述词状态已改变的个数
            std::cout << "有fd对应的事件就绪啦!" << std::endl;
            for (int i = 0; i < NUM; i++)
            {
                if (fd_array[i] == -1)
                    continue;

                //下面的fd都是合法的fd，但合法的fd不一定是就绪的fd
                if (FD_ISSET(fd_array[i], &rfds)) //测试文件描述符集合里fd是否置1
                {
                    std::cout << "sock: " << fd_array[i] << " 上面有了读事件，可以读取了" << std::endl;
                    // 一定是读事件就绪了！！！
                    // 就绪的fd就在fd_array[i]保存！
                    // read, recv时，一定不会被阻塞！
                    // 读事件就绪，就一定是可以recv，read吗？？不一定！！
                    if (fd_array[i] == listen_sock)
                    {
                        std::cout << "listen_sock: " << listen_sock << " 有了新的链接到来" << std::endl;
                        // accept
                        int sock = Sock::Accept(listen_sock);
                        if (sock >= 0)
                        {
                            std::cout << "listen_sock: " << listen_sock << " 获取新的链接成功" << std::endl;
                            // 获取成功
                            // recv,read了呢？绝对不能！
                            // 新链接到来，不意味着有数据到来！！什么时候数据到来呢?不知道
                            // 可是，谁可以最清楚的知道那些fd，上面可以读取了？select！
                            // 无法直接将fd设置进select，但是，好在我们有fd_array[]!
                            int pos = 1;
                            for (; pos < NUM; pos++)
                            {
                                if (fd_array[pos] == -1)
                                    break;
                            }

                            // 1. 找到了一个位置没有被使用
                            if (pos < NUM)
                            {
                                std::cout << "新链接: " << sock << " 已经被添加到了数组[" << pos << "]的位置" << std::endl;
                                fd_array[pos] = sock;
                            }
                            else
                            {
                                // 2. 找完了所有的fd_array[],都没有找到没有被使用位置
                                // 说明服务器已经满载，没法处理新的请求了
                                std::cout << "服务器已经满载了，关闭新的链接" << std::endl;
                                close(sock);
                            }
                        }
                    }
                    else
                    {
                        // 普通的sock，读事件就绪啦！
                        // 可以进行读取啦，recv，read
                        // 可是，本次读取就一定能读完吗？读完，就一定没有所谓的数据包粘包问题吗？
                        // 但是，我们今天没法解决！我们今天没有场景！仅仅用来测试
                        std::cout << "sock: " << fd_array[i] << " 上面有普通读取" << std::endl;

                        char recv_buffer[1024] = { 0 };
                        ssize_t s = recv(fd_array[i], recv_buffer, sizeof(recv_buffer) - 1, 0);
                        if (s > 0)
                        {
                            recv_buffer[s] = '\0';
                            std::cout << "client[ " << fd_array[i] << "]# " << recv_buffer << std::endl;
                        }
                        else if (s == 0) //对端关闭了链接
                        {
                            std::cout << "sock: " << fd_array[i] << "关闭了, client退出啦!" << std::endl;
                            //对端关闭了链接
                            close(fd_array[i]);
                            std::cout << "已经在数组下标fd_array[" << i << "]"
                                << "中,去掉了sock: " << fd_array[i] << std::endl;
                            fd_array[i] = -1; //该fd已关闭，所以必须把该位置 -1。
                        }
                        else //读取失败
                        {
                            close(fd_array[i]);
                            std::cout << "已经在数组下标fd_array[" << i << "]"
                                << "中,去掉了sock: " << fd_array[i] << std::endl;
                            fd_array[i] = -1;
                        }
                    }
                }
            }
            break;
        }
    }
    return 0;
}

```



## poll实例代码
```cpp
#include <iostream>
#include <unistd.h>
#include <poll.h>

int main()
{
    struct pollfd rfds;
    rfds.fd = 0;
    rfds.events = POLLIN;
    rfds.revents = 0;

    while (true)
    {
        int n = poll(&rfds, 1, -1);
        switch (n)
        {
        case 0:
            std::cout << "time out ..." << std::endl;
            break;
        case -1:
            std::cerr << "poll error" << std::endl;
            break;
        default:
            std::cout << "有事件发生..." << std::endl;
            if (rfds.revents & POLLIN)
            {
                std::cout << rfds.fd << " 上面的读事件发生了" << std::endl;
                char buffer[128];
                ssize_t s = read(0, buffer, sizeof(buffer) - 1);
                if (s > 0)
                {
                    std::cout << "有人说# " << buffer << std::endl;
                }
            }
            break;
        }
    }

    return 0;
}
```


## epoll实例代码
### epoll 代码使用框架
```cpp
for( ; ; )  
{  
   nfds = epoll_wait(epfd,events,20,500);  
   for(i=0;i
   {  
	   if(events[i].data.fd==listenfd) //有新的连接  
	   {  
		   connfd = accept(listenfd,(sockaddr *)&clientaddr, &clilen); //accept这个连接  
		   ev.data.fd=connfd;  
			ev.events=EPOLLIN|EPOLLET;  
			epoll_ctl(epfd,EPOLL_CTL_ADD,connfd,&ev); //将新的fd添加到epoll的监听队列中  
		}
		else if( events[i].events&EPOLLIN ) //接收到数据，读socket  
		{  
			n = read(sockfd, line, MAXLINE)) < 0    //读  
			ev.data.ptr = md;     //md为自定义类型，添加数据  
			ev.events=EPOLLOUT|EPOLLET;  
			epoll_ctl(epfd,EPOLL_CTL_MOD,sockfd,&ev);//修改标识符，等待下一个循环时发送数据，异步处理的精髓  
		}  
		else if(events[i].events&EPOLLOUT) //有数据待发送，写socket  
		{  
			struct myepoll_data* md = (myepoll_data*)events[i].data.ptr;    //取数据  
			sockfd = md->fd;  
			send( sockfd, md->ptr, strlen((char*)md->ptr), 0 );        //发送数据  
			ev.data.fd=sockfd;  
			ev.events=EPOLLIN|EPOLLET;  
			epoll_ctl(epfd,EPOLL_CTL_MOD,sockfd,&ev); //修改标识符，等待下一个循环时接收数据  
		}  
		else  
		{  
			//其他的处理  
		}  
	}  
}
```

### LT 模式
```cpp
#include <sys/epoll.h>
#include <iostream>
#include <cstdlib>
#include <unistd.h>

#include "Sock.hpp"

#define SIZE 128
#define NUM 64

static void Usage(std::string proc)
{
    std::cerr << "Usage: " << proc << " port" << std::endl;
}

// ./epoll_server port
int main(int argc, char* argv[])
{
    if (argc != 2)
    {
        Usage(argv[0]);
        exit(1);
    }
    // 1. 建立tcp 监听socket
    uint16_t port = (uint16_t)atoi(argv[1]);
    int listen_sock = Sock::Socket();
    Sock::Bind(listen_sock, port);
    Sock::Listen(listen_sock);

    // 2. 创建epoll模型，获得epfd(文件描述符)
    int epfd = epoll_create(SIZE);

    // 3. 先将listen_sock和它所关心的事件，添加到内核
    struct epoll_event ev;
    ev.events = EPOLLIN | EPOLLET;
    ev.data.fd = listen_sock;

    epoll_ctl(epfd, EPOLL_CTL_ADD, listen_sock, &ev);

    // 4. 事件循环
    volatile bool quit = false;
    struct epoll_event revs[NUM];
    while (!quit)
    {
        int timeout = -1;
        //这里传入的数组，仅仅是尝试从内核中拿回来已经就绪的事件
        int n = epoll_wait(epfd, revs, NUM, timeout); // TODO
        switch (n)
        {
        case 0:
            std::cout << "time out ..." << std::endl;
            break;
        case -1:
            std::cerr << "epoll error ..." << std::endl;
            break;
        default: //有时间就绪
            std::cout << "有事件就绪啦!" << std::endl;
            // 5. 处理就绪事件
            for (int i = 0; i < n; i++)
            {
                int sock = revs[i].data.fd; //暂时方案
                std::cout << "文件描述符: " << sock << " 上面有事件就绪啦" << std::endl;
                if (revs[i].events & EPOLLIN)
                {
                    std::cout << "文件描述符: " << sock << " 读事件就绪" << std::endl;
                    if (sock == listen_sock)
                    {
                        std::cout << "文件描述符: " << sock << " 链接数据就绪" << std::endl;

                        // 5.1 处理链接事件
                        int fd = Sock::Accept(listen_sock);
                        if (fd >= 0)
                        {
                            std::cout << "获取新链接成功啦： " << fd << std::endl;
                            //能不能立即读取呢？？不能！
                            struct epoll_event _ev;
                            _ev.events = EPOLLIN; // EPOLLIN | EPOLLOUT | EPOLLERR
                            _ev.data.fd = fd;
                            epoll_ctl(epfd, EPOLL_CTL_ADD, fd, &_ev); //新的fd托管给了epoll！
                            std::cout << "已经将" << fd << " 托管给epoll啦" << std::endl;
                        }
                        else
                        {
                            // Do Nothing!
                        }
                    }
                    else
                    {
                        // 5.2 正常的读取处理
                        std::cout << "文件描述符: " << sock << "正常数据就绪" << std::endl;
                        char buffer[1024];
                        ssize_t s = recv(sock, buffer, sizeof(buffer) - 1, 0);
                        if (s > 0)
                        {
                            buffer[s] = 0;
                            std::cout << "client [" << sock << "]# " << buffer << std::endl;

                            // //将我们的关心事件更改成为EPOLLOUT
                            // struct epoll_event _ev;
                            // _ev.events = EPOLLOUT;
                            // _ev.data.fd = sock;
                            // epoll_ctl(epfd, EPOLL_CTL_MOD, sock, &_ev);
                        }
                        else if (s == 0)
                        {
                            //对端关闭链接
                            std::cout << "client quit " << sock << std::endl;
                            close(sock);
                            epoll_ctl(epfd, EPOLL_CTL_DEL, sock, nullptr);
                            std::cout << "sock: " << sock << "delete from epoll success" << std::endl;
                        }
                        else
                        {
                            //读取失败
                            std::cout << "recv error" << std::endl;
                            close(sock);
                            epoll_ctl(epfd, EPOLL_CTL_DEL, sock, nullptr);
                            std::cout << "sock: " << sock << "delete from epoll success" << std::endl;
                        }
                    }
                }
                else if (revs[i].events & EPOLLOUT)
                {
                    //处理写事件
                }
                else
                {
                    // TODO
                }
            }
            break;
        }
    }

    close(epfd);
    close(listen_sock);
    return 0;
}
```

### ET 模式
```cpp
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <errno.h>
#include <sys/socket.h>
#include <netdb.h>
#include <fcntl.h>
#include <sys/epoll.h>
#include <string.h>

#define MAXEVENTS 64

//函数:
//功能:创建和绑定一个TCP socket
//参数:端口
//返回值:创建的socket
static int
create_and_bind(char* port)
{
    struct addrinfo hints;
    struct addrinfo* result, * rp;
    int s, sfd;

    memset(&hints, 0, sizeof(struct addrinfo));
    hints.ai_family = AF_UNSPEC;     /* Return IPv4 and IPv6 choices */
    hints.ai_socktype = SOCK_STREAM; /* We want a TCP socket */
    hints.ai_flags = AI_PASSIVE;     /* All interfaces */

    s = getaddrinfo(NULL, port, &hints, &result);
    if (s != 0)
    {
        fprintf(stderr, "getaddrinfo: %s\n", gai_strerror(s));
        return -1;
    }

    for (rp = result; rp != NULL; rp = rp->ai_next)
    {
        sfd = socket(rp->ai_family, rp->ai_socktype, rp->ai_protocol);
        if (sfd == -1)
            continue;

        s = bind(sfd, rp->ai_addr, rp->ai_addrlen);
        if (s == 0)
        {
            /* We managed to bind successfully! */
            break;
        }

        close(sfd);
    }

    if (rp == NULL)
    {
        fprintf(stderr, "Could not bind\n");
        return -1;
    }

    freeaddrinfo(result);

    return sfd;
}

//函数
//功能:设置socket为非阻塞的
static int
make_socket_non_blocking(int sfd)
{
    int flags, s;

    //得到文件状态标志
    flags = fcntl(sfd, F_GETFL, 0);
    if (flags == -1)
    {
        perror("fcntl");
        return -1;
    }

    //设置文件状态标志
    flags |= O_NONBLOCK;
    s = fcntl(sfd, F_SETFL, flags);
    if (s == -1)
    {
        perror("fcntl");
        return -1;
    }

    return 0;
}

//端口由参数argv[1]指定
int main(int argc, char* argv[])
{
    int sfd, s;
    int efd;
    struct epoll_event event;
    struct epoll_event* events;

    if (argc != 2)
    {
        fprintf(stderr, "Usage: %s [port]\n", argv[0]);
        exit(EXIT_FAILURE);
    }

    sfd = create_and_bind(argv[1]);
    if (sfd == -1)
        abort();

    s = make_socket_non_blocking(sfd);
    if (s == -1)
        abort();

    s = listen(sfd, SOMAXCONN);
    if (s == -1)
    {
        perror("listen");
        abort();
    }

    //除了参数size被忽略外,此函数和epoll_create完全相同
    efd = epoll_create1(0);
    if (efd == -1)
    {
        perror("epoll_create");
        abort();
    }

    event.data.fd = sfd;
    event.events = EPOLLIN | EPOLLET; //读入,边缘触发方式
    s = epoll_ctl(efd, EPOLL_CTL_ADD, sfd, &event);
    if (s == -1)
    {
        perror("epoll_ctl");
        abort();
    }

    /* Buffer where events are returned */
    events = calloc(MAXEVENTS, sizeof event);

    /* The event loop */
    while (1)
    {
        int n, i;

        n = epoll_wait(efd, events, MAXEVENTS, -1);
        for (i = 0; i < n; i++)
        {
            if ((events[i].events & EPOLLERR) ||
                (events[i].events & EPOLLHUP) ||
                (!(events[i].events & EPOLLIN)))
            {
                /* An error has occured on this fd, or the socket is not
                   ready for reading (why were we notified then?) */
                fprintf(stderr, "epoll error\n");
                close(events[i].data.fd);
                continue;
            }

            else if (sfd == events[i].data.fd)
            {
                /* We have a notification on the listening socket, which
                   means one or more incoming connections. */
                while (1)
                {
                    struct sockaddr in_addr;
                    socklen_t in_len;
                    int infd;
                    char hbuf[NI_MAXHOST], sbuf[NI_MAXSERV];

                    in_len = sizeof in_addr;
                    infd = accept(sfd, &in_addr, &in_len);
                    if (infd == -1)
                    {
                        if ((errno == EAGAIN) ||
                            (errno == EWOULDBLOCK))
                        {
                            /* We have processed all incoming
                               connections. */
                            break;
                        }
                        else
                        {
                            perror("accept");
                            break;
                        }
                    }

                    //将地址转化为主机名或者服务名
                    s = getnameinfo(&in_addr, in_len,
                        hbuf, sizeof hbuf,
                        sbuf, sizeof sbuf,
                        NI_NUMERICHOST | NI_NUMERICSERV); // flag参数:以数字名返回
                    //主机地址和服务地址

                    if (s == 0)
                    {
                        printf("Accepted connection on descriptor %d "
                            "(host=%s, port=%s)\n",
                            infd, hbuf, sbuf);
                    }

                    /* Make the incoming socket non-blocking and add it to the
                       list of fds to monitor. */
                    s = make_socket_non_blocking(infd);
                    if (s == -1)
                        abort();

                    event.data.fd = infd;
                    event.events = EPOLLIN | EPOLLET;
                    s = epoll_ctl(efd, EPOLL_CTL_ADD, infd, &event);
                    if (s == -1)
                    {
                        perror("epoll_ctl");
                        abort();
                    }
                }
                continue;
            }
            else
            {
                /* We have data on the fd waiting to be read. Read and
                   display it. We must read whatever data is available
                   completely, as we are running in edge-triggered mode
                   and won't get a notification again for the same
                   data. */
                int done = 0;

                while (1)
                {
                    ssize_t count;
                    char buf[512];

                    count = read(events[i].data.fd, buf, sizeof(buf));
                    if (count == -1)
                    {
                        /* If errno == EAGAIN, that means we have read all
                           data. So go back to the main loop. */
                        if (errno != EAGAIN)
                        {
                            perror("read");
                            done = 1;
                        }
                        break;
                    }
                    else if (count == 0)
                    {
                        /* End of file. The remote has closed the
                           connection. */
                        done = 1;
                        break;
                    }

                    /* Write the buffer to standard output */
                    s = write(1, buf, count);
                    if (s == -1)
                    {
                        perror("write");
                        abort();
                    }
                }

                if (done)
                {
                    printf("Closed connection on descriptor %d\n",
                        events[i].data.fd);

                    /* Closing the descriptor will make epoll remove it
                       from the set of descriptors which are monitored. */
                    close(events[i].data.fd);
                }
            }
        }
    }

    free(events);
    close(sfd);
    return EXIT_SUCCESS;
}
```


# 引用文章
[epoll详解-chaohona-ChinaUnix博客](http://blog.chinaunix.net/uid-24517549-id-4051156.html)
[166-网络编程：epoll_liufeng2023的博客-CSDN博客_epoll编程](https://blog.csdn.net/Edward_LF/article/details/124641084)