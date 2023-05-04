# 面试题
阿里广告平台，海量数据里查询某一固定前缀的key

小红书，你如何生产上限制`keys */flushdb/flushall`等危险命令以防止误删误用?

美团，`MEMORY USAGE`命令你用过吗?

BigKeyi问题，多大算big?你如何发现?如何删除?如何处理?

BigKey你做过调优吗?惰性释放lazyfree了解过吗?

Morekey问题，生产上redis数据库有1000W记录，你如何遍历? `keys *`可以吗?



# MoreKey 案例

## 往redis中插入100W测试数据

使用shell命令创建一个文件,文件中包含100W个KV键值对 
```shell
for((i=1;i<=100*10000;i++)); do echo "set k$i v$i" >> /tmp/redisTest.txt ;done;
```

使用管道 --pipe 命令插入到redis中, ==请结合自己机器的地址密码等进行填写==
```
cat /tmp/redisTest.txt | redic-cli -h 127.0.0.1 -p 6379 -a 密码 --pipe
```


## 为什么要禁用 keys * / flushdb / flushall 等命令

先看看顺丰的真实生产案例
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230504165545.png)


**`keys *` 你试试100W花费多少秒遍历查询**
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230504213144.png)
耗时38.86秒 

而且使用 flushdb 命令，清空的时间其实非常短,原因在于 `keys *`  ,  `flushdb`  ,`flushall` 都是属于原子级命令. 

所以 `flushdb` ， `flushall`  ， `key *` 这个指令有致命的弊端，在实际环境中最好不要使用

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230504213453.png)


## 禁用keys * / flushdb等危险命令
**redis.conf 在SECURITY这一项中**
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230504213958.png)

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230504214002.png)

不用`keys *` 避免卡顿，那该用什么, 那就到了scan命令登场的时刻了.

## scan命令
https://redis.io/commands/scan/
https://redis.com.cn/commands/scan.html

—句话，类似mysql limit的但不完全相同

**Scan命令用于迭代数据库中的数据库键**

### 语法
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230504214409.png)

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230504214553.png)
SCAN 命令是一个基于游标的迭代器，每次被调用之后， 都会向用户返回一个新的游标， **用户在下次迭代时需要使用这个新游标作为 SCAN 命令的游标参数**， 以此来延续之前的迭代过程。

SCAN 返回一个包含**两个元素的数组**
- 第一个元素是用于进行下一次迭代的新游标， 
- 第二个元素则是一个数组， 这个数组中包含了所有被迭代的元素。**如果新游标返回零表示迭代已结束**。

SCAN的遍历顺序
**非常特别，它不是从第一维数组的第零位一直遍历到末尾，而是采用了高位进位加法来遍历。之所以使用这样特殊的方式进行遍历，是考虑到字典的扩容和缩容时避免槽位的遍历重复和遗漏**。


### 使用
```shell
127.0.0.1:6379> scan 0 match * count 1
1) "524288"
2) 1) "k459788"
127.0.0.1:6379>
127.0.0.1:6379> scan 524288  match * count 1
1) "786432"
2) 1) "k770069"
   2) "k647149"
127.0.0.1:6379> scan 786432  match *
1) "851968"
2)  1) "k426617"
    2) "k284263"
    3) "k456023"
    4) "k809737"
    5) "k321046"
    6) "k985518"
    7) "k199032"
    8) "k412043"
    9) "k541163"
   10) "k688024"
127.0.0.1:6379> get k1000
"v1000"
127.0.0.1:6379>
127.0.0.1:6379> get k541163
"v541163"
```


# BigKey

## 多大算Big
**参考 《阿里云Redis开发规范**》
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230504215155.png)

**string 和 二级结构**
list、hash、set和zset，个数超过5000就是bigkey




## BigKey 有哪些危害
- 内存不均，集群迁移困难
- 超时删除，大key删除作梗
- 网络流量阻塞


## BigKey 是如何产生的
社交类
>王心凌粉丝列表，典型案例粉丝逐步递增

汇总统计
>某个报表，月日年经年累月的积累


## BigKey 如何发现
### redis-cli --bigkeys
启动 redis-cli 时使用
```
redis-cli --bigkeys
```
**作用**
给出每种数据结构Top 1 bigkey，同时给出每种数据类型的键值个数+平均大小

**不足**
想查询大于10kb的所有key，--bigkeys参数就无能为力了，需要用到memory usage来计算每个键值的字节数

```
redis-cli --bigkeys -a 111111 

redis-cli -h 127.0.0.1 -p 6379 -a 111111 --bigkeys
```


`redis-cli -h 127.0.0.1 -p 7001 –-bigkeys -i 0.1`
`-i` 指令作用是 每隔 100 条 scan 指令就会休眠 0.1s，ops 就不会剧烈抬升，但是扫描的时间会变长
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230504220935.png)

### MEMORY USAGE 键
计算每个键值的字节数

https://redis.com.cn/commands/memory-usage.html

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230504221101.png)

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230504221306.png)

# 删除BigKey
参考《阿里云Redis开发规范》

https://redis.io/commands/scan/

**string** 
>一般用del，如果过于庞大 unlink

**hash**
>使用hscan每次获取少量field-value，再使用hdel删除每个field
>![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230504221813.png)


**list**
>使用ltrim渐进式逐步删除，直到全部删除完成
>![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230504221850.png)


**set**
>使用sscan每次获取部分元素，再使用srem命令删除每个元素
>![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230504221955.png)


**zset**
>使用zscan每次获取部分元素，再使ZREMRANGEBYRANK命令删除每个元素命令
>![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230504222105.png)
>![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230504222159.png)

# BigKey生产调优
==**redis.conf配置文件LAZY FREEING相关说明**==

**阻塞和非阻塞删除命令**
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230504222311.png)


**优化配置**
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230504222321.png)
