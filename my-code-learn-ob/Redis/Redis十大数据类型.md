redis常见数据类型操作命令查询：[官网英文](https://redis.io/commands/)   [中文](http: //www.redis.cn/commands.html)

==**提前声明**==：**这里说的数据类型是value的数据类型，key的类型都是字符串**

redis十大数据类型：
>redis字符串(**String**)
>redis列表(**List**)
>redis哈希表(**Hash**)
>redis集合(**Set**)
>redis有序集合(**ZSet**)
>redis地理空间(**GEO**)
>redis基数统计(**HyperLogLog**)
>redis位图(**bitmap**)
>redis位域(**bitfield**)
>redis流(**Stream**)

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230408204802.png)

# Redis常用键(key)
|指令 |效果 |
|:-:|:-:|
| `key *`| 查看当前库的所有Key |
| `exists key`| 判断某个key是否存在|
| `type key`| 查看你的key是什么类型|
|`del key` | 删除指定的key数据|
|`unlink key` |非阻塞删除，仅仅将keys从keyspace元数据中删除，真正的删除会在后续异步中操作。 |
| `ttl key`| 查看还有多少秒过期，-1表示永不过期，-2表示已过期|
| `expire key 秒钟`| 为给定的key设置过期时间 |
| `move key dbindex [0-15]` | 将当前数据库的key移动到给定的数据库db 当中 |
|`select dbindex` |切换数据库【0-15】，默认为0 |
|`dbsize` |查看当前数据库key的数量 |
|`flushdb ` |清空当前库 |
|`flushall` |通杀全部库 |

## key *
查看当前库的所有Key
```shell
127.0.0.1:6379> keys *
(empty array)
127.0.0.1:6379>
127.0.0.1:6379> set k1 v1
OK
127.0.0.1:6379>
127.0.0.1:6379> keys *
1) "k1"
127.0.0.1:6379>
127.0.0.1:6379> set k2 v2
OK
127.0.0.1:6379>
127.0.0.1:6379> keys *
1) "k2"
2) "k1"
``` 

## exists key
判断某个key是否存在, 会返回存在key 。 判断多个key时 ，返回key存在的个数。
```shell
127.0.0.1:6379> set k1 v1
OK
127.0.0.1:6379>
127.0.0.1:6379> set k2 v2
OK
127.0.0.1:6379>
127.0.0.1:6379> EXISTS k1
(integer) 1
127.0.0.1:6379>
127.0.0.1:6379> EXISTS k1 k2
(integer) 2
127.0.0.1:6379> EXISTS k3
(integer) 0
127.0.0.1:6379>
127.0.0.1:6379> EXISTS k1 k2 k3  #k3不存在 ，所以返回2
(integer) 2
```

## type key
查看你的key是什么类型
```shell
127.0.0.1:6379> set k2 v2
OK
127.0.0.1:6379>
127.0.0.1:6379> TYPE k2
string
```

## del key
删除指定的key数据
```shell
127.0.0.1:6379> set k2 v2
OK
127.0.0.1:6379>
127.0.0.1:6379> DEL k2  #删除存在的key成功会1。删除不存在的返回0
(integer) 1
127.0.0.1:6379>
127.0.0.1:6379> DEL k3 # 该key不存在
(integer) 0
```


## unlink key
非阻塞删除，仅仅将keys从keyspace元数据中删除，真正的删除会在后续异步中操作。

del key 是原子的删除，只有删除成功了才会返回删除结果，如果是删除大key用del会将后面的操作都阻塞，而unlink key 不会阻塞，它会在后台异步删除数据。


## ttl key
查看还有多少秒过期，-1表示永不过期，-2表示已过期
```shell
127.0.0.1:6379> TTL k1 #使用默认的set创建时，都是永久的
(integer) -1
```

## expire key 秒钟
为给定的key设置过期时间
```shell
127.0.0.1:6379> TTL k1
(integer) -1
127.0.0.1:6379> EXPIRE k1 10  #设置k1的过期时间
(integer) 1
127.0.0.1:6379> TTL k1
(integer) 8
127.0.0.1:6379> TTL k1
(integer) 6
127.0.0.1:6379> TTL k1
(integer) 4
127.0.0.1:6379> TTL k1 #-2表示已过期
(integer) -2
```

## select dbindex
切换数据库【0-15】，默认为0
```shell
127.0.0.1:6379> select 2 #选择使用2号库，只要不是0号库，端口号后都会有数字标记
OK
```

## ## move key dbindex[0-15]
将当前数据库的key移动到给定的数据库DB当中
```shell
127.0.0.1:6379> keys *
1) "k1"
2) "k2"
3) "k3"
127.0.0.1:6379>
127.0.0.1:6379> move k2 2 #将k2移动到2号库
(integer) 1
127.0.0.1:6379> select 2 #选择使用2号库，只要不是0号库，端口号后都会有数字标记
OK
127.0.0.1:6379[2]> keys * 
1) "k2"
```

## dbsize
查看当前数据库key的数量
```shell
127.0.0.1:6379> dbsize
(integer) 2
```


## 11.flushdb
清空当前库

## 12.flushall(慎用)
通杀全部库



# String 
[官网介绍::string](https://redis.io/docs/data-types/strings/)
string是redis最基本的类型，一个key对应一个value。

string类型是二进制安全的，意思是redis的string可以包含任何数据，比如jpg图片或者序列化的对象 。

string类型是Redis最基本的数据类型，一个redis中字符串value最多可以是512M、

## 常用指令
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230408213131.png)


![](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230408212833.png)

### get 与 set的返回值 
```shell
127.0.0.1:6379> set k2 v2 nx
OK
127.0.0.1:6379>
127.0.0.1:6379> set k1 v1 nx #key存在会失败
(nil)
127.0.0.1:6379> set k2 v2uu xx #key存在会使用新值覆盖旧值
OK
127.0.0.1:6379>
127.0.0.1:6379> set k1 k1yy xx get #先获取key对应的原始值，然后再设新值
"v1"
127.0.0.1:6379> get k1
"k1yy"
```

### 设置与查看过期时间
```shell
127.0.0.1:6379> set k1 v1 ex 30 #设置过期时间为30秒
OK
127.0.0.1:6379> ttl k1
(integer) 27
127.0.0.1:6379> set k1 v1 ex 30 #为key设置新值时，它会将原来的过期时间默认覆盖掉除非设置新的过期时间
OK
127.0.0.1:6379> ttl k1
(integer) 28
127.0.0.1:6379> set k1 v23
OK
127.0.0.1:6379> ttl k1
(integer) -1

127.0.0.1:6379> set k1 v1 ex 30
OK
127.0.0.1:6379> ttl k1
(integer) 28
127.0.0.1:6379> set k1 k23 keepttl #保留最开始设置的过期时间，它不会被新值所覆盖
OK
127.0.0.1:6379> ttl k1
(integer) 7
```

### 同时设置/获取多个键值
```shell
127.0.0.1:6379> mset k4 v4 k5 v5 k1 v1
OK
127.0.0.1:6379> msetnx k4 v4 k5 v5 k1 v1 #只有一个失败，全失败
(integer) 0

127.0.0.1:6379> msetnx k6 v6 k7 v7 #设置的所有key不存在，才会成功
(integer) 1
127.0.0.1:6379> mget k1 k3 k5 k7
1) "v1"
2) "v3"
3) "v5"
4) "v7"

```

### 获取指定区间范围内的值
getrange/setrange
范围的值是使用下标计算。
```shell
127.0.0.1:6379> set k1 abcd123
OK
127.0.0.1:6379> getrange k1 0 3
"abcd"
127.0.0.1:6379>
127.0.0.1:6379> getrange k1 0 -1 # 结束下标为-1表示获取的字符串最后一位
"abcd123"

127.0.0.1:6379> getrange k1 0 3
"abcd"
127.0.0.1:6379>
127.0.0.1:6379> setrange k1 0 hhhh
(integer) 7
127.0.0.1:6379>
127.0.0.1:6379> GETRANGE k1 0 -1 # 表示从0位开始替换
"hhhh123"
```

### 数值增减
一定要是数据才能进行加减

递增数字：`INCR key`

增加指定的整数：`INCRBY key increment`

递减数值：`DECR key`

减少指定的整数：`DECRBY key decrement`
```shell
127.0.0.1:6379> incr k1
(error) ERR value is not an integer or out of range
127.0.0.1:6379> set k1 10
OK
127.0.0.1:6379> incr k1
(integer) 11
127.0.0.1:6379> incr k1
(integer) 12

127.0.0.1:6379> incrby k1 5
(integer) 17
127.0.0.1:6379> incrby k1 5
(integer) 22

127.0.0.1:6379> decr k1
(integer) 21
127.0.0.1:6379> decr k1
(integer) 20

127.0.0.1:6379> decrby k1 5
(integer) 15
127.0.0.1:6379> decrby k1 5
(integer) 10
```

### 获取字符串长度和内容追加
获取字符串长度：`strlen key`

字符串内容追加：`append key value`
```shell
127.0.0.1:6379> set k1 abc
OK
127.0.0.1:6379> strlen k1
(integer) 3

127.0.0.1:6379> append k1 def
(integer) 6
127.0.0.1:6379> get k1
"abcdef"
```

### 分布式锁
`setnx key value`

`setex(set with expire)键秒值/setnx(set if not exist)`
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230408220026.png)



### getset(先get再set)
getset：将给定key的值设为value，并返回key的旧值(old value)。

简单一句话：先get然后立即set
```shell
127.0.0.1:6379> getset k1 hello
"abcdef"
127.0.0.1:6379> get k1
"hello"
```


## String应用场景
**比如抖音无限点赞某个视频或者商品，点一下加一次**
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230408220313.png)




**是否喜欢的文章**
>阅读数：只要点击了rest地址，直接可以使用incr key 命令增加一个数字1，完成记录数字
>![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230408220348.png)


# List
Redis列表是简单的字符串列表，按照插入顺序排序。你可以添加一个元素到列表的头部（左边）或者尾部（右边）

它的底层实际是个双端链表，最多可以包含` 2^32 - 1` 个元素 (4294967295, 每个列表超过40亿个元素)


**单key多value**

简单说明：==**一个双端链表的结构**==，容量是2的32次方减1个元素大概40多亿，主要功能有push/pop等，一般用在栈、队列、消息队列等场景。left、right都可以插入添加；

如果键不存在，创建新的链表；

如果键已存在，新增内容；

如果值全移除，对应的键也就消失了

*它的底层实际上就是个双向链表，对两端的作性能很高，通过索引下标的操作中间的节点性能会较差*
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230408220844.png)

## 常用指令
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230408220421.png)

### lpush/rpush/lrange 
注：**没有rrange**
```shell
127.0.0.1:6379> lpush list1 1 2 3 4 5
(integer) 5
127.0.0.1:6379>
127.0.0.1:6379> rpush list2 11 22 33 44 55
(integer) 5
127.0.0.1:6379>
127.0.0.1:6379> lrange list1 0 -1
1) "5"
2) "4"
3) "3"
4) "2"
5) "1"
127.0.0.1:6379>
127.0.0.1:6379> lrange list2 0 -1
1) "11"
2) "22"
3) "33"
4) "44"
5) "55"
127.0.0.1:6379> rrang list1 0 -1\
(error) ERR unknown command 'rrang', with args beginning with: 'list1' '0' '-1\'
```

### lpop/rpop
```shell
127.0.0.1:6379> lpop list1
"5"
127.0.0.1:6379> lpop list1 2
1) "4"
2) "3"
127.0.0.1:6379> rpop list2 2
1) "55"
2) "44"

127.0.0.1:6379> lrange list1 0 -1
1) "2"
2) "1"
127.0.0.1:6379> lrange list2 0 -1
1) "11"
2) "22"
3) "33"
```

### lindex
按照索引下标获得元素（从上到下）
```shell
127.0.0.1:6379> lindex list1 0
"2"
127.0.0.1:6379>
127.0.0.1:6379>
127.0.0.1:6379> lindex list2 0
"11"
127.0.0.1:6379> lindex list1 3 # 没有的值会返回nil
(nil)

```

### llen
获取List列表中元素的个数
```shell
127.0.0.1:6379> llen list1
(integer) 2
127.0.0.1:6379> llen list2
(integer) 3
```

### lrem key 数字N 给定值v1
**解释：删除N个值等于v1的元素**

从left往right删除2个值等于v1的元素，返回的值为实际删除的数量

LREM list3 0 值，表示删除全部给定的值, ==**零个就是全部值**==
```shell
127.0.0.1:6379> lpush list3 v1 v1 v2 v2 v2 v3 v3 v4 v5 v1
(integer) 10
127.0.0.1:6379> lrange list3 0 -1
 1) "v1"
 2) "v5"
 3) "v4"
 4) "v3"
 5) "v3"
 6) "v2"
 7) "v2"
 8) "v2"
 9) "v1"
10) "v1"

127.0.0.1:6379> lrem list3 0 v1
(integer) 3
127.0.0.1:6379> lrange list3 0 -1
1) "v5"
2) "v4"
3) "v3"
4) "v3"
5) "v2"
6) "v2"
7) "v2"
```

### ltrim key 开始index 结束index
截取指定范围的值后在赋值给key

```shell
127.0.0.1:6379> lrange list3 0 -1
1) "v5"
2) "v4"
3) "v3"
4) "v3"
5) "v2"
6) "v2"
7) "v2"
127.0.0.1:6379> ltrim list3 0 2
OK
127.0.0.1:6379> lrange list3 0 -1
1) "v5"
2) "v4"
3) "v3"
```

### rpoplpush 源列表 目的列表
移除列表的最后一个元素，并将该元素添加到另一个列表并返回
```shell
127.0.0.1:6379> lrange list1 0 -1
1) "2"
2) "1"
127.0.0.1:6379> lrange list2 0 -1
1) "11"
2) "22"
3) "33"

127.0.0.1:6379> rpoplpush list1 list2
"1"
127.0.0.1:6379> lrange list2 0 -1
1) "1"
2) "11"
3) "22"
4) "33"
```

### lset key index value
让指定数组集合的小标位置值替换成新值
```shell
127.0.0.1:6379> lrange list2 0 -1
1) "1"
2) "11"
3) "22"
4) "33"
127.0.0.1:6379> lset list2 0 66
OK
127.0.0.1:6379> lrange list2 0 -1
1) "66"
2) "11"
3) "22"
4) "33"
```

### linsert key before/after 已有值 插入的新值
```shell
127.0.0.1:6379> lrange list1 0 -1
1) "5"
2) "4"
3) "3"
4) "2"
5) "1"

127.0.0.1:6379> linsert list1 before 1 Rust
(integer) 6
127.0.0.1:6379> lrange list1 0 -1
1) "5"
2) "4"
3) "3"
4) "2"
5) "Rust"
6) "1"

127.0.0.1:6379> linsert list1 before 4 C++
(integer) 7
127.0.0.1:6379> lrange list1 0 -1
1) "5"
2) "C++"
3) "4"
4) "3"
5) "2"
6) "Rust"
7) "1"

127.0.0.1:6379> linsert list1 after  C++ Java
(integer) 8
127.0.0.1:6379> lrange list1 0 -1
1) "5"
2) "C++"
3) "Java"
4) "4"
5) "3"
6) "2"
7) "Rust"
8) "1"

```
## 应用场景
**微信公众号订阅的消息**

1. 大V作者李永乐老师和CSDN发布了文章分别是 11 和 22

2. 我关注了他们两个，只要他们发布了新文章，就会安装进我的List
 `  lpush likearticle:阳哥id    11 22`

3 查看阳哥自己的号订阅的全部文章，类似分页，下面0~10就是一次显示10条
`  lrange likearticle:阳哥id 0 9`

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230408224956.png)


# Hash
Redis hash 是一个 string 类型的 field（字段） 和 value（值） 的映射表，hash 特别适合用于存储对象。

Redis 中每个 hash 可以存储 2^32 - 1 键值对（40多亿）


# Set
Redis 的 Set 是 String 类型的无序集合。集合成员是唯一的，这就意味着集合中不能出现重复的数据，集合对象的编码可以是 intset 或者 hashtable。

Redis 中Set集合是通过哈希表实现的，所以添加，删除，查找的复杂度都是 O(1)。

集合中最大的成员数为 2^32 - 1 (4294967295, 每个集合可存储40多亿个成员)


# Zset
Redis zset 和 set 一样也是string类型元素的集合,且不允许重复的成员。

不同的是每个元素都会关联一个double类型的分数，redis正是通过分数来为集合中的成员进行从小到大的排序。

zset的成员是唯一的,但分数(score)却可以重复。

zset集合是通过哈希表实现的，所以添加，删除，查找的复杂度都是 O(1)。 集合中最大的成员数为 2^32 - 1


# GEO
Redis GEO 主要用于存储地理位置信息，并对存储的信息进行操作，包括

添加地理位置的坐标。

获取地理位置的坐标。

计算两个位置之间的距离。

根据用户给定的经纬度坐标来获取指定范围内的地理位置集合


# HyperLogLog
HyperLogLog 是用来做基数统计的算法，HyperLogLog 的优点是，在输入元素的数量或者体积非常非常大时，计算基数所需的空间总是固定且是很小的。

在 Redis 里面，每个 HyperLogLog 键只需要花费 12 KB 内存，就可以计算接近 2^64 个不同元素的基 数。这和计算基数时，元素越多耗费内存就越多的集合形成鲜明对比。

但是，因为 HyperLogLog 只会根据输入元素来计算基数，而不会储存输入元素本身，所以 HyperLogLog 不能像集合那样，返回输入的各个元素。


# Bitmap
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230408205154.png)

由0和1状态表现的二进制位的bit数组


# Bitfield
通过bitfield命令可以一次性操作多个比特位域(指的是连续的多个比特位)，它会执行一系列操作并返回一个响应数组，这个数组中的元素对应参数列表中的相应操作的执行结果。

说白了就是通过bitfield命令我们可以一次性对多个比特位域进行操作。


# Stream
Redis Stream 是 Redis 5.0 版本新增加的数据结构。

Redis Stream 主要用于消息队列（MQ，Message Queue），Redis 本身是有一个 Redis 发布订阅 (pub/sub) 来实现消息队列的功能，但它有个缺点就是消息无法持久化，如果出现网络断开、Redis 宕机等，消息就会被丢弃。

简单来说发布订阅 (pub/sub) 可以分发消息，但无法记录历史消息。

而 Redis Stream 提供了消息的持久化和主备复制功能，可以让任何客户端访问任何时刻的数据，并且能记住每一个客户端的访问位置，还能保证消息不丢失