# 是什么
定义： **由于数据量过大，单个Master复制集难以承担**，因此需要对多个复制集进行集群，形成水平扩展每个复制集只负责存储整个数据集 的一部分，这就是Redis的集群，其作用是提供在多个Redis节点间共享数据的程序集。

官网：[https://redis.io/docs/reference/cluster-spec/](https://redis.io/docs/reference/cluster-spec/)

一图：![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230418090556.png)
一句话：Redis集群是一个提供在多个Redis节点间共享数据的程序集，Redis集群可以支持多个master



# 能干嘛
-   Redis集群支持多个master，每个master又可以挂载多个slave
    1.  读写分离
    2.  支持数据的高可用
    3.  支持海量数据的读写存储操作
-   由于Cluster自带Sentinel的故障转移机制，内置了高可用的支持，**无需再去使用哨兵功能**
-   客户端与Redis的节点连接，不再需要连接集群中所有的节点，只需要任意连接集群中的一个可用节点即可
-   **槽位slot**负责分配到各个物理服务节点，由对应的集群来负责维护节点、插槽和数据之间的关系


# 槽位slot

## 官网出处：
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230418211714.png)
翻译：
集群的密钥空间被分成16384个槽，有效地设置了16384个主节点的集群大小上限（但是，建议的最大节点大小约为1000个节点)。
集群中的每个主节点处理16384个哈希槽的一个子集。当没有集群重新配置正在进行时(即哈希槽从一个节点移动到另一个节点)，集群是稳定的。当集群稳定时，单个哈希槽将由单个节点提供服务(但是，服务节点可以有一个或多个副本，在网络分裂或故障的情况下替换它，并且可以用于扩展读取陈l旧数据是可接受的操作)。

## redis集群的槽位slot
Redis集群的数据分片

Redis集群没有使用一致性hash 而是引入了哈希槽的概念。

Redis集群有16384个哈希槽每个key通过CRC16算法校验后对16384取模来决定放置哪个槽，集群的每个节点负责一部分hash槽，举个例子，比如当前集群有3个节点，那么：
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230418211832.png)

### redis集群的分片
|分片是什么 |使用Redis集群时我们会将存储的数据分散到多台redis机器上，这称为分片。简言之，集群中的每个Redis实例都被认为是整个数据的一个分片。|
|:-:|:-|
|如何找到给定key的分片| 为了找到给定key的分片，我们对key进行CRC16(key)算法处理并通过对总分片数量取模。然后，**使用确定性哈希函数**，这意味着给定的key,**将多次始终映射到同一个分片**，我们可以推断将来读取特定key的位置。|


### 分片和槽位的优势
**最大优势，方便扩缩容和数据分派查找**

这种结构很容易添加或者删除节点，比如如果我想添加个节点D，我需要从节点A，B，C中得部分槽位到D上。如果我想一出节点A，需要将A中的槽移动到B和C节点上，然后将没有任何槽的节点从集群中移除即可。由于一个结点将哈希槽移动到另一个节点不会停止服务，所以无论添加删除或者改变某个节点的哈希槽的数量都不会造成集群不可用的状态。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230418212202.png)


# slot槽位映射方案

## slot槽位映射，一般业界有三种解决方案
- 哈希取余分区(一般小厂使用)
- 一致性算法分区(一般中厂使用)
- 哈希槽分区 (大厂使用)

## 哈希取余分区(小厂)
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230418212240.png)
2亿条记录就是2亿个k,v，我们单机不行必须要分布式多机，假设有3台机器构成一个集群，用户每次读写操作都是根据公式：`hash(key) % N个机器台数`，计算出哈希值，用来决定数据映射到哪一个节点上。

==**优点**==：简单粗暴，直接有效，只需要预估好数据规划好节点，例如3台、8台、10台，就能保证一段时间的数据 支撑。使用Hash算法让固定的一部分请求落到同一台服务器上，这样每台服务器固定处理一部分请求 (并维护这些请求的信息)， 起到负载均衡+分而治之的作用。

==**缺点**==：原来规划好的节点，进行扩容或者缩容就比较麻烦了额，不管扩缩，每次数据变动导致节点有变动，映射关系需要重新进行计算，在服务器个数固定不变时没有问题，如果需要弹性扩容或故障停机的情况下，原来的取模公式就会发生变化: `Hash(key)/3`会 变成`Hash(key) /?`。此时地址经过取余运算的结果将发生很大变化，根据公式获取的服务器也会变得不可控。 某个redis机器宕机了，由于台数数量变化，会导致hash取余全部数据重新洗牌。


## 一致性哈希算法分区(中厂)
###  是什么？
一致性Hash算法背景是在1997年由麻省理工学院提出的，设计目标是**为了解决分布式缓存数据变动和映射问题**，某个机器宕机了，分母数量改变了，自然取余数不行了
    
### 能干嘛？
提出一致性Hash解决方案。目的是当服务器个数发生变动时，尽量减少影响客户端到服务器的映射关系
    
### 3大步骤  
#### 算法构建一致性哈希环
 一致性哈希算法必然有个hash函数并按照算法产生hash值，这个算法的所有可能哈希值会构成一个全量集，这个集合可以成为一个hash空间`0,2^32-1`，这个是一个线性空间，但是在算法中，我们通过适当的逻辑控制将它首尾相连(O= 2^32),这样让它**逻辑上**形成了一个环形空间。 
 它也是按照使用取模的方法，**前面笔记介绍的节点取模法是对节点（服务器）的数量进行取模。而一致性Hash算法是对2^32取模，简单来说，一致性Hash算法将整个哈希值空间组织成一个虚拟的圆环**，如假设某哈希函数H的值空间为0-2^32-1(即哈希值是一个32位无符号整形），整个哈希环如下图:整个空间**按顺时针方向组织**，圆环的正上方的点代表0，O点右侧的第一个点代表1，以此类推，2、3、4、……直到2^32-1，也就是说0点左侧的第一个点代表2^32-1，0和2个32-1在零点中方向重合，我们把这个由2^32个点组成的圆环称为Hash环。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230418213023.png)


#### 服务器IP节点映射
将集群中各个IP节点映射到环上的某一个位置。 将各个服务器使用Hash进行一个哈希，具体可以选择服务器的IP或主机名作为关键字进行哈希，这样每台机器就能确定其在哈希环上的位置。假如4个节点NodeA、B、C、D，经过IP地址的**哈希函数**计算(hash(ip))，使用IP地址哈希后在环空间的位置如下:
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230418213133.png)


#### key落到服务器的落键规则
当我们需要存储一个kv键值对时，首先计算key的hash值，hash(key)，将这个key使用相同的函数Hash计算出哈希值并确定此数据在环上的位置，**从此位置沿环==顺时针==“行走”**，第一台遇到的服务器就是其应该定位到的服务器，并将该键值对存储在该节点上。
如我们有Object A、 Object B、 Object C. object D四个数据对象，经过哈希计算后，在环空间上的位置如下:根据一致性Hash算法，数据A会被定为到Node A上，B被定为到Node B上，C被定为到Node C上，D被定为到Node D上。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230418213214.png)


#### 一致性哈希算法分区的优缺点
##### 优点
**一致性哈希算法的容错性** ：假设Node C宕机，可以看到此时对象A、B、D不会受到影响。一般的，在一致性Hash算法中，如果一台服务器不可用，则受影响的数据仅仅是此服务器到其环空间中前一台服务悉 **（即沿着==逆时针方向==行走遇到的第一台服务器）之间数据**，其它不会受到影响。简单说，就是C挂了，受到影响的只是B、C之间的数据**且这些数据会转移到D进行存储**。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230418213652.png)


**一致性哈希算法的扩展性**：数据量增加了，需要增加一台节点NodeX，X的位置在A和B之间，那收到影响的也就是A到X之间的数据，重新把A到X的数据录入到X上即可，不会导致hash取余全部数据重新洗牌。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230418213659.png)

##### 缺点
**一致性哈希算法的数据倾斜问题**： 一致性Hash算法在服务**节点太少时**，容易因为节点分布不均匀而造成**数据倾斜**（被缓存的对象大部分集中缓存在某一台服务器上)问题，例如系统中只有两台服务器:
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230418213834.png)

#### 小总结
为了在节点数目发生改变时尽可能少的迁移数据

将所有的存储节点排列在收尾相接的Hash环上，每个key在计算Hash后会顺时针找到临近的存储节点存放。而当有节点加入或退出时仅影响该节点在Hash环上顺时针相邻的后续节点。

**优点**：加入和删除节点只影响哈希环中顺时针方向的相邻的节点，对其他节点无影响。

**缺点** ：数据的分布和节点的位置有关，因为这些节点不是均匀的分布在哈希环上的，所以数据在进行存储时达不到均匀分布的效果。


## 哈希槽分区(大厂)
### 是什么？ 
`HASH_SLOT = CRC16(key) mod 16384`   

### 为什么出现
哈希槽实质就是一个数组，数组[0, 2^14 - 1]形成hash slot空间

### 能干什么
解决均匀分配的问题，**在数据和节点之间又加入了一层，把这层称为哈希槽(slot)，用于管理数据和节点之间的关系**，现在就相当于节点上放的是槽，槽里面放的是数据。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230418214153.png)
槽解决的是粒度问题，相当于把粒度变大了，这样便于数据移动。哈希解决的是映射问题，使用key的哈希值来计算所在的槽，便于数据分配


### 多少个hash
一个集群只能有16384个槽，编号`0-16383(0-2^14-1)`。这些槽会分配给集群中的所有主节点，分配策略没有要求。

集群会记录节点和槽的对应关系，解决了节点和槽的关系后，接下来就需要对key求哈希值，然后对16384取模，余数是几key就落入对应的槽里。`HASH_SLOT = CRC16(key) mod 16384`。以槽为单位移动数据，因为槽的数目是固定的，处理起来比较容易，这样数据移动问题就解决了。


### 哈希槽计算
Redis集群中内置了16384个哈希槽，redis 会根据节点数量大致均等的将哈希槽映射到不同的节点。当需要在Redis集群中放置一个key-valuel时，redis先对key使用crc16算法算出一个结果然后用结果对16384求余数 `CRC16(key) % 16384`，这样每个key都会对应一个编号在0-16383之间的哈希槽，也就是映射到某个节点上。如下代码，key之A、B在Node2， key之C落在Node3上

#### 经典面试题：为什么Redis集群的最大槽数是个？
Redis集群并没有使用一致性hash而是引入了哈希槽的概念。Redis 集群有16384个哈希糟，每个key通过CRC16校验后对16384取模来决定放置哪个槽，集群的每个节点负责一部分hash槽。但为什么哈希槽的数量是16384 (2^14）个呢？

CRC16算法产生的hash值有16bit，该算法可以产生2^16=65536个值。 换句话说值是分布在0～65535之间，有更大的65536不用为什么只用16384就够?

作者在做mod运算的时候，为什么不mod65536，而选择mod16384? 

作者回答：[redis/redis#2576)](https://github.com/redis/redis/issues/2576)]
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230418214655.png)
**说明1**：
正常的心跳数据包带有节点的完整配置，可以用幂等方式用旧的节点替换旧节点，以便更新旧的配置。 这意味着它们包含原始节点的插槽配置，该节点使用2k的空间和16k的插槽，但是会使用8k的空间（使用65k的插槽）。同时，由于其他设计折衷，Redis集群不太可能扩展到1000个以上的主节点。 因此16k处于正确的范围内，以确保每个主机具有足够的插槽，最多可容纳1000个矩阵，但数量足够少，可以轻松地将插槽配置作为原始位图传播。请注意，在小型群集中，位图将难以压缩，因为当N较小时，位图将设置的slot / N位占设置位的很大百分比。

**说明2**：
**(1)如果槽位为65536，发送心跳信息的消息头达8k**，发送的心跳包过于庞大。 在消息头中最占空间的是`myslots[CLUSTER_SLOTS/8]`。当槽位为65536时，这块的大小是:65536÷8÷1024=8kb
在消息头中最占空间的是`myslots[CLUSTER_SLOTS/8]`。当槽位为16384时，这块的大小是:**16384/8/1024=2kb**
因为每秒钟，redis节点需要发送一定数量的ping消息作为心跳包，如果槽位为65536，这个ping消息的消息头太大了，浪费带宽。 

**(2)Redis的集群主节点数量基本不可能超过1000个**。 集群节点越多，心跳包的消息体内携带的数据越多。如果节点过1000个，也会导致网络拥堵。因此redis作者不建议redis cluster节点数量超过1000个。那么，对于节点数在1000以内的redis cluster集群，16384个槽位够用了。没有必要拓展到65536个。 

**(3)槽位越小，节点少的情况下，压缩比高，容易传输** ，Redis主节点的配置信息中它所负责的哈希槽是通过一张bitmap的形式来保存的，在传输过程中会对bitmap进行压缩，但是如果bitmap的填充率`slots /N`很高的话(N表示节点数)， bitmap的压缩率就很低。如果节点数很少，而哈希槽数量很多的话，bitmap的压缩率就很低。

#### 计算结论
Redis集群中内置了16384个哈希槽，redis会根据节点数量大致均等的将哈希槽映射到不同的节点。当需要在Redis集群中放置一个key-value时， redis先对key使用crc16算法算出一个结果然后用结果对16384求余数 `CRC16(key) % 16384`， 这样每个key都会对应一个编号在0-16383之间的哈希槽，也就是映射到某个节点上。如下代码，key之A、B在Node2， key之C落在Node3上

# Redis集群不保证强一致性
redis集群**不保证强一致性**，这意味着在特定的条件下，Redis集群可能会丢掉一些被系统收到的写入请求命令
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230418215500.png)



#  Redis集群配置
主要演示三主三从的集群配置

## 找3台真实虚拟机，各自新建
使用指令在myredis目录中创建cludter目录
```shell
mkdir -p /myredis/cluster
```

### 新建6个独立的Redis实例服务
IP： 192.168.0.100 + 端口6381/6382

```shell
​vim /myredis/cluster/redisCluster6381.conf
```

redisCluster6381.conf 文件中的配置
```
bind 0.0.0.0
daemonize yes
protected-mode no
port 6381
logfile "/myredis/cluster/cluster6381.log"
pidfile /myredis/cluster6381.pid
dir /myredis/cluster
dbfilename dump6381.rdb
appendonly yes
appendfilename "appendonly6381.aof"
requirepass 123456
masterauth 123456

cluster-enabled yes
cluster-config-file nodes-6381.conf
cluster-node-timeout 5000
```

​ `vim /myredis/cluster/redisCluster6382.conf`


IP：192.168.0.100 + 端口6383/6384
​ `vim /myredis/cluster/redisCluster6383.conf`
​ `vim /myredis/cluster/redisCluster6384.conf`


IP：192.168.0.100 + 端口6385/6386\
​ `vim /myredis/cluster/redisCluster6385.conf`
​ `vim /myredis/cluster/redisCluster6386.conf`

启动6台主机实例

```shell
​redis-server /myredis/cluster/redisCluster6381.conf

# 一直启动到6386、

redis-server /myredis/cluster/redisCluster6381.conf
```



### 通过redis-cli 命令为6台机器构建集群关系

**构建主从关系命令**
```
// 一定要注意，此处要修改自己的IP为真实IP
redis-cli -a 123456 --cluster create --cluster-replicas 1 192.168.111.175:6381 192.168.111.175:6382 192:168.111.172:6383 192.168.111.172:6384 192.168.111.174:6385 192.168.111.174:6386
```

`--cluster- replicas 1` 表示为每个master创建一个slave节点
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230418220440.png)

**一切OK的话，3主3从搞定**
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230418220535.png)



### 6381作为切入点，查看并检验集群状态
**连接进6381作为切入点，==查看节点状态==**
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230418220715.png)


#### cluster nodes
参看集群每个节点的信息
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230418220744.png)


#### cluster info
查看集群信息
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230418220818.png)


# 集群读写
## 对6381新增连个key，看看效果如何
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230418221059.png)


## 为什么报错
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230418221132.png)


## 如何解决
防止路由失效 , 加参数 `-c` 并新增两个key：
`redis-cli -a 123456 -p 6381 -c`
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230418221214.png)
问题解决

## 服务加上`-c`后查看集群信息
信息无变化
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230418221252.png)


## cluster keyslot 键名称
查看某个key该属于对应的槽位值
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230418221344.png)


# 主从容错切换迁移
## 容错切换迁移
- 主6381和从机切换，先停止主机6381
    6381主机停了，对应的真实从机上位
    6381作为1号主机分配的从机以实际情况为准，具体是几号机器就是几号机器


-   再次查看集群信息，本次 6381主 6384从
	![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230418221645.png)


- 停止主机6381，再次查看集群信息
	![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230418221725.png)   6384成功上位


-   随后，6381原来的主机回来了，是否会上位？
    恢复前：
    ![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230418221802.png)
	恢复后：
	![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230418221817.png)
	**6381不会上位成为master并以从节点形式回归**


**==集群不保证数据一致性100%OK，是会有数据丢失的情况==**


# 集群常用操作命令和CRC16算法分析
## 通识占位符
不在同一个slot槽位下的多键操作支持不好，通识占位符登场
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230418223811.png)

不在同一个slot槽位下的键值无法使用`mset`、`mget`等多键操作

可以通过`{}`来定义同一个组的概念，使key中{}内相同内容的键值对放到一个slot槽位去，对照下图类似 `k`
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230418223854.png)


## CRC源码浅谈
Redis集群有16384个哈希槽，每个key通过CRC16校验后对16384取模来决定放置哪个槽。集群的每个节点负责一部分hash槽
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230418223939.png)
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230418223945.png)


## cluster countkeysinslot 槽位数组编码
`1`，该槽位被占用
`0`，该槽位没占用

## CLUSTER KEYSLOT 键名称
该键应该存在哪个槽位上

