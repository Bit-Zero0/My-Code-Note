# Redis发布订阅介绍
## 是什么
**定义：** 是一种消息通信模式：发送者(PUBLISH)发送消息，订阅者(SUBSCRIBE)接收消息，可以实现进程间的消息传递

**官网：**[https://redis.io/docs/manual/pubsub/](https://redis.io/docs/manual/pubsub/)

**一句话：** Redis可以实现消息中间件MQ的功能，通过发布订阅实现消息的引导和分流。但是目前不推荐使用该功能，专业的事情交给专业的中间件处理，redis就做好分布式缓存功能

## 能干嘛
Redis客户端可以订阅任意数量的频道，类似我们微信关注多个公众号
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415200943.png)


当有新消息通过publish命令发送给频道 channel1 时，订阅客户端都会收到消息
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415201002.png)

## 小总结
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415201104.png)


# Redis发布订阅常用命令
## 常用命令：
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415201259.png)

### SUBSCRIBE channel [channel ...]
订阅给定的一个或多个频道的信息

**推荐先执行订阅然后在发布，订阅成功之前发布的消息是收不到的**

订阅的客户端每次可以收到一个3个参数的消息
1.  消息种类
2.  始发频道的名称
3.  实际的消息内容
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415201357.png)


### PSUBSCRIBE pattern [pattern ...]
按照模式批量订阅，订阅一个或多个符合给定模式(支持`*`号`?`号之类的)的频道


### PUBSUB subcommand [argument [argument ...]]
查看订阅与发布系统


### PUBSUB CHANNELS
​ 由活跃频道组成的列表
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415201859.png)



### PUBSUB NUMSUB [channel [channel ...]]
​ 某个频道有几个订阅者
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415201921.png)


### PUBSUB NUMPAT
​ 只统计使用PSUBSCRIBE命令执行的返回客户端订阅的唯一**模式的数量**
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415201936.png)

### UNSUBSCRIBE [channel [channel ...]]
退订给定的频道



### PUNSUBSCRIBE [pattern [pattern ...]]
退订所有给定模式的频道


# 案例演示
1. 开启3个客户端，演示客户端A、B订阅消息，客户端C发布消息
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415204339.png)

2. 演示批量订阅和发布
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415204358.png)

3.  取消订阅
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230415204417.png)


# 小总结
**可以实现消息中间件MQ的功能，通过发布订阅实现消息的引导和分流。但是不推荐使用该功能，专业的事情交给专业的中间件处理，redis就做好分布式缓存功能**

PUB/SUB缺点
1.  发布的消息在Redis系统中不能持久化，因此，必须先执行订阅，在等待消息发布。如果先发布了消息，那么该消息由于没有订阅者，消息将被直接丢弃
2.  消息只管发送，对于发布者而言消息是即发即失，不管接受，也没有ACK机制，无法保证消息的消费成功
3.  以上的缺点导致Redis的Pub/Sub模式就像个小玩具，在生产环境中几乎无用武之地，为此Redis5.0版本新增了Stream数据结构，不但支持多播，还支持数据持久化，相比Pub/Sub更加的强大