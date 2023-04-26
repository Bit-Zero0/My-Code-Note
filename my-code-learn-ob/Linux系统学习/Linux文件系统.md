# 磁盘的结构
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317193316.png)

> 访问文件数据的顺序
>盘面(磁头) ——> 磁道 ——> 扇区

## LBA
可不可以将盘片想象成为线性的结构
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317194122.png)

LBA就是就是**抽象扇区**的**下标**，通过LBA就能找到对应的扇区，实际关系可以参考[[Linux程序地址空间|虚拟地址和物理地址]]的关系。


# Linux特有的EXT系列的文件系统

若磁盘有1T的空间，我们要怎么管理文件？
其实可以设想一下我们国家的管理。
>国家的管理
>国->省->市->县->乡->镇->村

所以==一个硬盘可以分为好几个区[大小可以不相同]，在每个区中又可以进行细分，循环往复==。但是和现实不同的是，**每一个分区的管理形式基本都是一样的** 。
>如电脑上的 C D E这些盘。

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317194558.png)

1. 分区 ： 将大磁盘 ，分为小空间
2. 格式化：在分区中写入文件系统

## 理解文件系统
我们使用[[linux常用命令#ls|ls -l]]的时候看到的除了看到文件名，还看到了文件元数据。
```shell
[root@VM-8-10-centos ~]# ls -l
total 8
-rw-r--r-- 1 root root 65 Apr 15 20:03 cmd.txt
-rw-r--r-- 1 root root  4 Apr 26 12:36 emm.txt
```

每行包含7列：
>模式
>硬链接数
>文件所有者
>组
>大小
>最后修改时间
>文件名

那文件在磁盘中是怎么存储的?

[[linux常用命令#ls|ls -l]]读取存储在磁盘上的文件信息，然后显示出来
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230426123749.png)

其实这个信息除了通过这种方式来读取，还有一个[[linux常用命令#stat|stat]]命令能够看到更多的文件信息
```shell
[root@VM-8-10-centos ~]# stat emm.txt
  File: ‘emm.txt’
  Size: 4               Blocks: 8          IO Block: 4096   regular file
Device: fd01h/64769d    Inode: 393824      Links: 1
Access: (0644/-rw-r--r--)  Uid: (    0/    root)   Gid: (    0/    root)
Access: 2023-04-26 12:36:30.258889155 +0800
Modify: 2023-04-26 12:36:30.178888546 +0800
Change: 2023-04-26 12:36:30.178888546 +0800
 Birth: -
```
上面的执行结果有几个信息需要解释清楚,就需要了解 ==**inode**== 了

## inode
为了能解释清楚inode我们先简单了解一下文件系统
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230426125254.png)
Linux ext2文件系统，上图为磁盘文件系统图（内核内存映像肯定有所不同），磁盘是典型的块设备，硬盘分区被划分为一个个的block。
一个block的大小是由格式化的时候确定的，并且不可以更改。例如`mke2fs`的`-b`选项可以设定block大小为1024、2048或4096字节。而上图中**启动块（Boot Block）的大小是确定的**


**Linux中文件名在系统层面没有意义!  是给用户使用的!**
Linux中真真标识一个文件，使通过文件的**inode编号**!!   **一个文件一个inode** ! 
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230426124952.png)

如： 我们在磁盘中的其中一个分区，我们可以看到在分区中的文件管理系统。

- ==Boot Block==:  启动块，不一定每个分区都有。
- ==Block Group==：ext2文件系统会根据分区的大小划分为数个Block Group。而每个Block Group都有着相同的结构组成。政府管理各区的例子
- ==Super Block(超级块)==：**存放文件系统本身的结构信息**。记录的信息主要有：bolck 和 inode的总量，未使用的block和inode的数量，一个block和inode的大小，最近一次挂载的时间，最近一次写入数据的时间，最近一次检验磁盘的时间等其他文件系统的相关信息。Super Block的信息被破坏，可以说整个文件系统结构就被破坏了
- ==Group Descriptor Table(GDT)==：块组描述符，描述块组属性信息，有兴趣的同学可以在了解一下，如上图，我们的 GDT 就是 0；
- ==Block Bitmap(块位图)==：**Block Bitmap中记录着Data Block中哪个数据块已经被占用，哪个数据块没有被占用**。
- ==inode Bitmap(inode位图)==：**每个bit表示一个inode是否空闲可用**。
- ==inode Table==: **存放文件属性** 如 文件大小，所有者，最近修改时间等。
- ==Data blocks(数据区)==：**存放文件内容**。


而我们主要学习的是**Block Bitmap** ,**inode Bitmap** , **inode Table** , **Data blocks**


将属性和数据分开存放的想法看起来很简单，但实际上是如何工作的呢？我们通过touch一个新文件来看看如何工作。
```shell
[root@localhost linux]# touch abc
[root@localhost linux]# ls -i abc
263466 abc
```
为了说明问题，我们将上图简化：
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230426125645.png)
创建一个新文件主要有一下4个操作：
1. 存储属性
	内核先找到一个空闲的i节点（这里是263466）。内核把文件信息记录到其中。

2. 存储数据
	该文件需要存储在三个磁盘块，内核找到了三个空闲块：300,500，800。将内核缓冲区的第一块数据复制到300，下一块复制到500，以此类推。

3. 记录分配情况
	文件内容按顺序300,500,800存放。内核在inode上的磁盘分布区记录了上述块列表。

4. 添加文件名到目录
	新的文件名abc。linux如何在当前的目录中记录这个文件？内核将入口（263466，abc）添加到目录文件。文件名和inode之间的对应关系将文件名和文件的内容及属性连接起来。

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230426132215.png)
注意: 一个data block的大小是由格式化的时候确定的，并且不可以更改。例如`mke2fs`的`-b`选项可以设定block大小为1024、2048或4096字节。(图中为4096byte)

每一个 inode都可以理解为一个结构体
```c
struct inode{
	//文件的所有属性
	int inode_number 数据
	int blocks[32] //对应的文件内容的data blocks的下标
	int ref //表示当前这个inode被多少链接指向了
}
```
当我们得到文件的inode时，怎么找到它的文件内容呢？ ==就靠inode结构体中的**blocks[]**== 。

## inode 的大小是多少
**inode的大小是 256byte**.

 我使用的是 centos7.6 系统 , 可以使用该指令查看
```shell
sudo dumpe2fs /dev/vda1
```

如果找不到 `vda1` 文件 , 可以使用 `lsblk`指令 查看分区
```shell
[root@VM-8-10-centos dev]# lsblk
NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
sr0     11:0    1 203.6M  0 rom  
vda    253:0    0    50G  0 disk 
└─vda1 253:1    0    50G  0 part /
```


其中的信息会包含 `Inode size` , 这就是 inode的大小.
```
Inode size:               256
```

## inode bitmap 和 block bitmap的作用
OS 怎么知道 inode Table中的那些inode没有被使用呢？ ==就靠**inode bitmap**==

inode bitmap其实就是一个inode位图
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317195527.png)

**从右向左看**，
比特位的位置含义：inode编号。
比特位的内容含义：特定iode''是否"被占用。
> `1` 则表示被占用了，`0`则表示没有。

而block bitmap也是使用了相同的原理 , 用来记录 data block的使用情况.


# 目录是文件吗？

目录有inode？  ==**有！**==
目录有数据吗？  ==**有！**==
目录的数据块里放了什么？  ==**文件名和inode的映射关系！**==

你所创建的所有文件，全部一定在一个特定的目录下! ! !


图中指令在文件系统的步骤是什么？
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317195605.png)

在创建`lesson409`时，我们就会得到它的 inode 了
 > 步骤
 > cat myfile.c --> 先查看lesson409 --> data block --> 241234(inode) : 文件名 -->241234(inode)-->inode table--> inode-->`block[]`-->打印文件内容；


# 误删文件怎么办？
当我们删除文件时，其实只是将 `inode bitmap` 中相应的 inode 由1至0, 文件属性和内容是还在的，但是如果有新文件占用这个inode时，之前的内容就会被覆盖。

所以什么都别做，找人，如果你在新建文件，可能会使误删文件的inode被占用，导致无法恢复。


# 文件名 与 inode
新的文件名abc。linux如何在当前的目录中记录这个文件？
>内核将入口（263466，abc）添加到目录文件。文件名和inode之间的对应关系将文件名和文件的内容及属性连接起来。

我们看到，真正找到磁盘上文件的并不是文件名，而是inode。 其实在linux中可以让多个文件名对应于同一个inode。 
```shell
[root@VM-8-10-centos ~]# touch abc 
[root@VM-8-10-centos ~]# ln abc def
[root@VM-8-10-centos ~]# ls -1i
393825 abc
393825 def
```
>- abc和def的链接状态完全相同，他们被称为指向文件的硬链接。内核记录了这个连接数，inode 263466 的硬连接数为2。
>- 我们在删除文件时干了两件事情：
>	1. 在目录中将对应的记录删除
>	2. 将硬连接数-1，如果为0，则将对应的磁盘释放。

其中的 ln 指令就是硬连接.


# 硬链接 and 软链接

## 软硬链接的原理
### 硬链接(hard link)：
文件A是文件B的硬链接，则A的目录项中的inode节点号与B的目录项中的inode节点号相同，即一个inode节点对应两个不同的文件名，两个文件名指向同一个文件，A和B对文件系统来说是完全平等的。
如果删除了其中一个，对另外一个没有影响。每增加一个文件名，inode节点上的链接数增加一，每删除一个对应的文件名，inode节点上的链接数减一，直到为0，inode节点和对应的数据块被回收。注：文件和文件名是不同的东西，rm A删除的只是A这个文件名，而A对应的数据块（文件）只有在inode节点链接数减少为0的时候才会被系统回收。

### 软链接(soft link)：
A是B的软链接（A和B都是文件名），A的目录项中的inode节点号与B的目录项中的inode节点号不相同，A和B指向的是两个不同的inode，继而指向两块不同的数据块。
但是A的数据块中存放的只是B的路径名（可以根据这个找到B的目录项）。A和B之间是“主从”关系，如果B被删除了，A仍然存在（因为两个是不同的文件），但指向的是一个无效的链接。


## 软链接
==软连接==和==windows中的中快捷方式==很像。

### 使用方式
使用 [[linux常用命令#ln| ln -s]] 指令即可创建软链接

如上级目录`lesson`的一个可执行文件 `myproc` 链接到`lesson409`目录
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317195727.png)


进入`lesson409`目录
输入指令 `ln -s ../myproc myexe` , 链接名为 `myexe` .
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317195735.png)
此时就可以在`lesson409`目录中运行被链接的文件了


## 硬链接
硬链接本质是根本就**不是一个独立的文件**，==**而是一个文件名和inode编号的映射关系**==，因为**自己没有独立的inode** !
创建硬链接，本质是在特定的目录下，填写一对文件名和inode的映射关系！

在我们进行 [[linux常用命令#ls|ls指令]]时，被红框选中的那栏就是文件对应的硬链接数量。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317195804.png)

而硬链接数其实采用的就是 引用计数的方式，在 inode结构体中有个 `int ref` 来进行引用计数。


### 使用方式
使用[[linux常用命令#ln|ln指令]]，但是不带参数。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317195833.png)

创建成功
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317195837.png)



### 目录的硬链接数
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317195919.png)

当我们创建一个目录时，会发现此目录的硬链接数是2。

>**为什么？**
>当我们进入test目录，使用 `ls -al` 指令，会发现
>![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317200009.png)
> `.`  的inode是和test目录的inode是相同的，所以硬链接数是2。

> 如果再test目录中在添加一个 t1目录呢，test目录的硬连接数是多少？
> ![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317200111.png)

> 发现 test目录的硬链接变为了 3，怎么回事？
> 进入t1目录看看
> ![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317200116.png)

> 发现 `..` 的 inode 和test目录的inode是一致的，所以test的硬链接数是3
> 


## 链接的删除

虽然链接可以使用 rm指令删除，但还是推荐使用unlink指令







