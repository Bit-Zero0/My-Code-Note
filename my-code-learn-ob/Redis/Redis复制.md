# Redis复制介绍
## 是什么
官网地址：[https://redis.io/docs/management/replication/](https://redis.io/docs/management/replication/)

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415204740.png)
一句话：就是主从复制，master以写为主，slave以读为主，当master数据变化的时候，自动将新的数据异步同步到其他的slave数据库

## 能干嘛
-   读写分离
-   容灾恢复
-   数据备份
-   水平扩容支撑高并发


## 怎么玩
-   配从(库)不配主(库)
    
-   权限细节，重要
    master如果配置了`requirepass`参数，需要密码登录 ，那么slave就要配置masterauth来设置校验密码，否则的话master会拒绝slave的访问请求
	![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415204903.png)

-   基本操作命令
    **info replication** ：可以查看复制结点的主从关系和配置信息
    **replicaof 主库IP 主库端口** ：一般写入进==**Redis.conf**==配置文件内，重启后依然生效
    **slaveof 主库IP 主库端口** ：
    
    ​ 每次与master断开之后，都需要重新连接，除非你配置进了redis.conf文件；在运行期间修改slave节点的信息，如果该数据库已经是某个主数据库的从数据库，那么会停止和原主数据库的同步关系 **转而和新的主数据库同步，重新拜码头**
    
    **slaveof no one** ：使当前数据库停止与其他数据库的同步，转成主数据库，自立为王

# 案例演示-配置文件

## 架构说明
一个Master两个Slave，三台虚拟机，每台都安装redis
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415205148.png)
拷贝多个redis.conf文件


## 小口诀
三台虚拟机需要能相互ping通且需要注意防火墙配置

三大命令：
1.  主从复制
    replicaof 主库IP 主库端口，配从(库)不配主(库)
    
2.  改换门庭
    slaveof 新主库IP 新主库端口
    
3.  自立为王
    slaveof no one

## 修改配置文件细节操作
==**redis6379.conf**==为例，步骤如下：

1.  开启daemonize yes
    ![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415205458.png)

    
2.  注释掉bind 127.0.0.1
    
3.  protected-mode no
	![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415205334.png)


4.  指定端口
	![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415205523.png)


5.  指定当前工作目录，dir
	![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415205406.png)

    
6.  pid文件名字，pidfile
	![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415205422.png)
7.  log文件名字，logfile
    **如果日志文件和启动文件同级，这里可以配置为./6379.log，否则这里一定要写绝对路径，是个巨坑！！！**
    ![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415205655.png)

8.  requiredpass
    ![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415205731.png)

    
9.  dump.rdb名字
	![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415205801.png)

    
10.  aof文件，appendfilename（非必选）
    ![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415205816.png)

11.  从机访问主机的通行密码，必须配置从机访问主机的通行密码`masterauth`，必须配置
    ![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415205858.png)**从机需要配置，主机不用**

## 常用3招

### 一主二仆
#### 方案1：配置文件固定写死主从关系
-   配置文件执行：replicaof 主库IP 主库端口
-   配从(库)不配(主)库：配置从机
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415210302.png)

先master后两台slave依次启动
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415210315.png)

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415210327.png)

-   **==主从关系查看==**
    主机日志
    ![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415210357.png)
    
    **从机日志**
    ![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415210414.png)
    
	**命令：info replication命令查看**
	![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415210457.png)

#### 主从问题演示
1. Q：从机可以执行写命令吗？
>A：**不可以，从机只能读**


2.  Q：从机切入点问题 ,slave是从头开始复制还是从切入点开始复制?
>A：master启动，写到k3 slave1跟着master同时启动，跟着写到k3 slave2写到k3后才启动.
>
>**那之前的是否也可以复制?** 
>首次一锅端，后续跟随，master写，slave跟


3. Q：主机shutdown后，从机会上位吗？
>A：**从机不动，原地待命，从机数据可以正常使用，等待主机重启归来**
>![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415210920.png)


4. Q：主机shutdown后，重启后主从关系还在吗？从机还能否顺利复制？
>A：主从关系依然存在，从机依旧是从机，可以顺利复制
>![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415211008.png)


5.  Q：某台从机down后，master继续，从机重启后它能跟上大部队吗？
 >A：可以，类似于从机切入点问题
    

#### 方案2：命令操作手动主从关系指令
1.  从机停机去掉配置文件中的配置项，3台目前都是主机状态，各不从属
	![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415211057.png)


2. 3台master
	![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415211122.png)


3. 预设的从机上执行命令
	salveof 主库IP 主库端口
	![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415211144.png)
1.  用命令使用的话，2台从机重启后，关系还在吗？
    不会存在了
    ![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415211407.png)

#### 配置 VS 命令的区别
- **配置**，持久稳定永久生效；
- **命令**，当成生效

### 薪火相传
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230416184132.png)

-   上一个slave可以是下一个slave的master，slave同样可以接收其他slaves的连接和同步请求，那么该slave作为了链条中下一个的master,可以有效减轻主master的写压力
-   中途变更转向:会清除之前的数据，重新建立主从关系并拷贝最新的
-   `slaveof 新主库IP 新主库端口`


### 反客为主
`slaveof no one` 使当前数据库停止与其他数据库的同步关系


# 复制原理和工作流程
## slave启动，同步初请
-   slave启动成功链接到master后会发送一个sync命令
-   slave首次全新连接master，一次完全同步(全量复制)将被自动执行，slave自身原有数据会被master数据覆盖清除


## 首次连接，全量复制
-   master节点收到sync命令后会开始在后台保存快照(即RDB持久化，**主从复制时会触发RD**B)，同时收集所有接收到的用于修改数据集的命令并缓存起来，master节点执行RDB持久化完后，master将RDB快照文件和所有缓存的命令发送到所有slave，以完成一次完全同步
-   而slave服务在接收到数据库文件数据后，将其存盘并加载到内存中，从而完成复制初始化


## 心跳持续，保持通信
-   `repl-ping-replica-period 10`
 ![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415211841.png)
## 进入平稳，增量复制
-   master继续将新的所有收集到的修改命令自动依次传送给slave，完成同步


## 从机下线，重连续传
-   master会检查backlog里面的offset，master和slave都会保存一个复制的offset还有一个masterId，offset是保存在backlog中的。**master只会把已经缓存的offset后面的数据复制给slave，类似断点续传**


# 复制的缺点
-   复制延时，信号衰减
    由于所有的写操作都是先在Master上操作，然后同步更新到Slave上，所以从Master同步到Slave机器有一定的延迟，当系统很繁忙的时候，延迟问题会更加严重，Slave机器数量的增加也会使这个问题更加严重。
    ![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415211954.png)

-   master挂了怎么办？
>默认情况下，**不会在slave节点中自动选一个master.**(请注意：是不会)
> 
> **那每次都要人工干预？** 
	无人值守变成刚需, 这是我们不能接受的，所以需要[[Redis哨兵]]