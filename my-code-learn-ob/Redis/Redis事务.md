# redis事务介绍

## 是什么

官网：[https://redis.io/docs/manual/transactions/](https://redis.io/docs/manual/transactions/)

可以一次执行多个命令，本质是一组命令的集合，一个事务中的所有命令都会序列化，按顺序地串行化执行而不会被其他命令插入，不许加塞}

## 能干嘛
一个队列中，一次性、顺序性、排他性的执行一系列命令

## Redis事务 VS 数据库事务
|1.单独的隔离操作 | Redis的事务仅仅是保证事务里的操作会被连续独占的执行，redis命令执行是单线程架构，在执行完事务内所有指令前是不可能再去同时执行其他客户端的请求的|
|:-:| :-:|
|2.没有隔离级别的概念 | 因为事务提交前任何指令都不会被实际执行，也就不存在”事务内的查询要看到事务里的更新，在事务外查询不能看到”这种问题了|
|3.不保证原子性|Redis的事务不保证原子性，也就是不保证所有指令同时成功或同时失败，只有决定是否开始执行全部指令的能力，没有执行到一半进行回滚的能力|
|4.排它性|Redis会保证一个事务内的命令依次执行，而不会被其它命令插入|


# 怎么用
官网 ：[https://redis.io/docs/manual/transactions/](https://redis.io/docs/manual/transactions/)

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415170442.png)

## 常用命令
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415170502.png)



### case1：正常执行 `MULTI` `EXEC`
```shell
127.0.0.1:6379> multi  #开启事务 
OK
127.0.0.1:6379(TX)> set k1 v1
QUEUED
127.0.0.1:6379(TX)> set k2 v2
QUEUED
127.0.0.1:6379(TX)> set k3 v3 # 将操作的数据按顺序加入队列中
QUEUED
127.0.0.1:6379(TX)> exec # 按序执行事务 
1) OK
2) OK
3) OK
127.0.0.1:6379>
127.0.0.1:6379> get k3
"v3"
```

### case2：放弃事务 MULTI DISCARD
```shell
127.0.0.1:6379> set count 2
OK

127.0.0.1:6379> multi
OK
127.0.0.1:6379(TX)> set k1 v1
QUEUED
127.0.0.1:6379(TX)> set k2 v2
QUEUED
127.0.0.1:6379(TX)> incr count
QUEUED
127.0.0.1:6379(TX)> discard # 放弃事务,整个事务里面的队列都不会执行
OK

127.0.0.1:6379> get count
"2"
```


### case3：全体连坐
官网说明：
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415182722.png)

一个语法出错，全体连坐。如果任何一个命令语法有错，Redis会直接返回错误，所有的命令都不会执行
```shell
127.0.0.1:6379> multi
OK
127.0.0.1:6379(TX)> set k1 v1111
QUEUED
127.0.0.1:6379(TX)> set k2 v2222
QUEUED
127.0.0.1:6379(TX)> set k3 # 在事务执行之前就出现的错误
(error) ERR wrong number of arguments for 'set' command
127.0.0.1:6379(TX)> exec # 执行事务被中断,执行失败
(error) EXECABORT Transaction discarded because of previous errors.
127.0.0.1:6379> get k1
"v1"
```

### case4：冤头债主
**官网说明：**
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415183053.png)

**补充：**
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415183107.png)

==注意和传统数据库事务的区别，不一定要么全部成功要么全部失败==


### case5：watch监控
 **Redis使用Watch来提供乐观锁定，类似于CAS(Check-and-Set)**
    1.  悲观锁：悲观锁(Pessimistic Lock)，顾名思义，就是很悲观，每次去拿数据的时候都认为别人会修改，所以每次在拿数据的时候都会上锁，这样别人想拿这个数据就会block直到它拿到锁
    2.  乐观锁：乐观锁(Optimistic Lock)，顾名思义，就是很乐观，每次去拿数据的时候都认为别人不会修改，$\textcolor{red}{所以不会上锁}$，但是在更新的时候会判断一下在此期间别人有没有去更新这个数据。
        乐观锁策略：提交版本必须大于记录当前版本才能执行更新乐观锁策略：提交版本必须大于记录当前版本才能执行更新
    3.  CAS
		![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415183219.png)

#### `watch key [key ...]`
1. 初始化k1和balance两个key，先监控在开启multi，保证两个key变动在同一个事务内
```shell
127.0.0.1:6379> set k1 abc
OK
127.0.0.1:6379> set balance 100
OK
127.0.0.1:6379> watch balance
OK
127.0.0.1:6379> multi
OK
127.0.0.1:6379(TX)> set k1 abc2
QUEUED
127.0.0.1:6379(TX)> set balance 110
QUEUED
127.0.0.1:6379(TX)> exec
1) OK
2) OK
127.0.0.1:6379> get balance
"110"
```

2. 有加塞篡改：watch命令是一种乐观锁的实现，Redis在修改的时候会检测数据是否被更改，如果被更改了，则执行失败
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415194126.png)

图中3和4不管哪个先执行，最终的结果都是整个事务执行失败
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415194240.png)

#### unwatch
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415194852.png)


#### 小结
一旦执行了exec之前加的监控锁都会被取消掉

当客户端连接丢失的时候(比如退出链接)，所有东西都会被取消监视


### 小总结
**开启**：以`multi`开始一个事务

**入队**：将多个命令入队到事务中，接到这些命令并不会立即执行，而是放到等待执行的事务队列里面

**执行**：有`exec`命令触发事务






