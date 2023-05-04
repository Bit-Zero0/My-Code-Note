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

## move key dbindex[0-15]
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

## String常用指令
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

## List常用指令
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

KV模式不变，但V是一个键值对 **Map<String, Map<Object, Object>>**

## Hset常用指令
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230409100102.png)

### hset/hget/hmset/hmget/hgetall/hdel
```shell
127.0.0.1:6379> hset user1 id 66 name zhang3 age 25
(integer) 3
127.0.0.1:6379> hget user1 name  #hget只能单个获取
"zhang3"
127.0.0.1:6379> hget user1 age
"25"


127.0.0.1:6379> hmset user2 id 100 name li4 age 33 # 目前版本的hmset和hset的功能是一致的，hmset已弃用
OK
127.0.0.1:6379>
127.0.0.1:6379>
127.0.0.1:6379> hmget user2 id name age # hmget可以获得多个键值对
1) "100"
2) "li4"
3) "33"

127.0.0.1:6379> hgetall user1 #hgetall 可以key获取全部键值对 
1) "id"
2) "66"
3) "name"
4) "zhang3"
5) "age"
6) "25"

127.0.0.1:6379> hdel user1 id age #hdel可以通过key删除多个键值对
(integer) 2
127.0.0.1:6379> hgetall user1
1) "name"
2) "zhang3"
```

### hlen
获取某个key内的全部数量
```shell
127.0.0.1:6379> hgetall user2
1) "id"
2) "100"
3) "name"
4) "li4"
5) "age"
6) "33"
127.0.0.1:6379> hlen user2
(integer) 3
```


### hexists key 
查找在key里面的某个值的key
```shell
127.0.0.1:6379> hexists user2 age
(integer) 1
127.0.0.1:6379> hexists user2 name
(integer) 1
127.0.0.1:6379> hexists user2 family
(integer) 0  # user2 中不存在family这个key，所以返回0

```


###   hkeys/hvals
`hkeys key` 查询出所有key对应的子key值
`hvals key` 查询出所有key对应的子key的value值

```shell
127.0.0.1:6379> hkeys user2
1) "id"
2) "name"
3) "age"

127.0.0.1:6379> hvals user2
1) "100"
2) "li4"
3) "33"
```


### hincrby/hincrbyfloat
```shell
127.0.0.1:6379> hgetall user2
1) "id"
2) "100"
3) "name"
4) "li4"
5) "age"
6) "33"

127.0.0.1:6379> hincrby user2 age 2
(integer) 35
127.0.0.1:6379> hincrby user2 age 5
(integer) 40

127.0.0.1:6379> hincrbyfloat user2 age 1.5
"41.5"
127.0.0.1:6379> hincrbyfloat user2 age 0.5
"42"
```


### hsetnx
不存在赋值，存在了无效
```shell
127.0.0.1:6379> hsetnx user1 email 123@123.com
(integer) 1
127.0.0.1:6379> hsetnx user1 email 422@124.com
(integer) 0
127.0.0.1:6379> hget user1 email
"123@123.com"
```

## hset应用场景
**JD购物车早期设计目前不再采用，当前小中厂可用**
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230409100358.png)
新增商品 → hset shopcar:uid1024 334488 1

新增商品 → hset shopcar:uid1024 334477 1

增加商品数量 → hincrby shopcar:uid1024 334477 1

商品总数 → hlen shopcar:uid1024

全部选择 → hgetall shopcar:uid1024




# Set
Redis 的 Set 是 String 类型的无序集合。集合成员是唯一的，这就意味着集合中不能出现重复的数据，集合对象的编码可以是 intset 或者 hashtable。

Redis 中Set集合是通过哈希表实现的，所以添加，删除，查找的复杂度都是 O(1)。

集合中最大的成员数为 2^32 - 1 (4294967295, 每个集合可存储40多亿个成员)

**单值多value，且无重复**

## Set常用指令
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230409100622.png)


### SADD key member [member ...]
添加元素，可以多次向同一个key中设置不同值，不会覆盖之前的值
```shell
127.0.0.1:6379> sadd set1 1 1 1 1 2 3 4 4 5 5 6  #Set集合会自动去重，实际上只存入了6个不同值
(integer) 6
```

### SMEMBERS key
遍历集合中的所有元素
```shell
127.0.0.1:6379> smembers set1
1) "1"
2) "2"
3) "3"
4) "4"
5) "5"
6) "6"
```

### SISMEMBER key member
判断元素是否在集合中
```shell
127.0.0.1:6379> sismember set1 2
(integer) 1
127.0.0.1:6379> sismember set1 6
(integer) 1
127.0.0.1:6379> sismember set1 9
(integer) 0
```


### SREM key member [member ...]
删除集合中的元素
```shell
127.0.0.1:6379> srem set1 4
(integer) 1
127.0.0.1:6379> srem set1 1
(integer) 1
127.0.0.1:6379> smembers set1
1) "2"
2) "3"
3) "5"
4) "6"
```


### scard
获取集合里面的元素个数
```shell
127.0.0.1:6379> scard set1
(integer) 4
127.0.0.1:6379> smembers set1
1) "2"
2) "3"
3) "5"
4) "6"
```

### SRANDMEMBER key [数字]
从集合中**随机展现设置的数字个数元素**，元素不删除
```shell
127.0.0.1:6379> srandmember set1 2
1) "3"
2) "5"
127.0.0.1:6379> srandmember set1 3
1) "3"
2) "2"
3) "5"
127.0.0.1:6379> srandmember set1 1
1) "2"
```

### SPOP key [数字]
从集合中随机**弹出**一个元素，弹出的元素会被删除
```shell
127.0.0.1:6379> smembers set1
1) "1"
2) "2"
3) "3"
4) "4"
5) "5"
6) "6"
7) "7"
8) "8"
9) "9"

127.0.0.1:6379> spop set1 1
1) "2"
127.0.0.1:6379> spop set1 3
1) "5"
2) "9"
3) "3"

127.0.0.1:6379> smembers set1
1) "1"
2) "4"
3) "6"
4) "7"
5) "8"

```


### smove key1 key2
将key1里已存在的某个值赋给key2
```shell
127.0.0.1:6379> sadd set1 1 2 3 4
(integer) 4
127.0.0.1:6379> sadd set2 a b c d
(integer) 4
127.0.0.1:6379> smove set1 set2 1
(integer) 1

127.0.0.1:6379> smembers set1
1) "2"
2) "3"
3) "4"
127.0.0.1:6379> smembers set2
1) "d"
2) "b"
3) "a"
4) "c"
5) "1"
```


### 集合运算-集合的差集运算A-B
**属于A但是不属于B的元素构成的集合**

`SDIFF key [key ...]`，可以计算多个元素的差集
```shell
127.0.0.1:6379> sadd set1 1 2 3 a b c
(integer) 6
127.0.0.1:6379> sadd set2 2 3 4  b c d
(integer) 6
127.0.0.1:6379> sdiff set1 set2 #属于set1但是不属于set2的元素构成的集合
1) "1"
2) "a"

127.0.0.1:6379> sdiff set2 set1 #属于set2但是不属于set1的元素构成的集合
1) "4"
2) "d"

127.0.0.1:6379> sadd set3 b x 1 3
(integer) 4
127.0.0.1:6379> sdiff set1 set2 set3
1) "a"
```

### 集合运算-集合的并集运算A∪B
属于A或者属于B的元素构成的集合

`SUNION key [key ...]`
```shell
127.0.0.1:6379> smembers set1
1) "2"
2) "3"
3) "1"
4) "a"
5) "b"
6) "c"
127.0.0.1:6379> smembers set2
1) "4"
2) "2"
3) "3"
4) "b"
5) "d"
6) "c"

127.0.0.1:6379> sunion set1 set2
1) "4"
2) "2"
3) "3"
4) "1"
5) "d"
6) "a"
7) "b"
8) "c"
```

### 集合运算-集合的交集运算A∩B
属于A同时也属于B的共同拥有的元素构成的集合

`SINTER key [key ...]`
```shell
127.0.0.1:6379> smembers set1
1) "2"
2) "3"
3) "1"
4) "a"
5) "b"
6) "c"
127.0.0.1:6379> smembers set2
1) "4"
2) "2"
3) "3"
4) "b"
5) "d"
6) "c"

127.0.0.1:6379> sinter set1 set2
1) "2"
2) "3"
3) "b"
4) "c"
```

**SINTERCARD numkeys key 【key ...】【LIMIT limit】**
numkeys 的具体值由输入的key个数决定

SINTERCARD 为redis7新命令，它不返回结果集，而是返回结果的基数。返回由所有给定集合的交集产生的集合的基数

基数的词语解释: 用于表示事物个数的数
```shell
127.0.0.1:6379> smembers set1
1) "2"
2) "3"
3) "1"
4) "a"
5) "b"
6) "c"
127.0.0.1:6379> smembers set2
1) "4"
2) "2"
3) "3"
4) "b"
5) "d"
6) "c"

127.0.0.1:6379> sinter set1 set2 # sinter返回输入集合key交集的具体值
1) "2"
2) "3"
3) "b"
4) "c"

127.0.0.1:6379> sintercard 2 set1 set2 # sintercard返回输入集合key交集的基数，4个
(integer) 4
```

## 应用场景
### 微信抽奖小程序
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230409105045.png)

|1 用户ID，立即参与按钮          |                            sadd key 用户ID|
|:-:|:-:|
|2 显示已经有多少人参与了，上图23208人参加|  SCARD key
|3 抽奖(从set中任意选取N个中奖人)   |SRANDMEMBER key 2       随机抽奖2个人，元素不删除  SPOP  key 3                         随机抽奖3个人，元素会删除|

### 微信朋友圈点赞查看同赞朋友
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230409105344.png)

|1 新增点赞         |              sadd pub:msgID  点赞用户ID1  点赞用户ID2|
|:-:|:-:|
|2 取消点赞         |              srem pub:msgID  点赞用户ID|
|3 展现所有点赞过的用户 | SMEMBERS  pub:msgID|
|4 点赞用户数统计，就是常见的点赞红色数字 |         scard  pub:msgID|
|5 判断某个朋友是否对楼主点赞过|       SISMEMBER pub:msgID 用户ID|

### QQ内推可能认识的人
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230409105445.png)



# Zset
Redis zset 和 set 一样也是string类型元素的集合,且不允许重复的成员。

不同的是每个元素都会关联一个double类型的分数，redis正是通过分数来为集合中的成员进行从小到大的排序。

**zset的成员是唯一的,但分数(score)却可以重复。**

zset集合是通过哈希表实现的，所以添加，删除，查找的复杂度都是 O(1)。 集合中最大的成员数为 2^32 - 1

在set基础上，每个val值前加一个score分数值。之前set是k1 v1 v2 v3，现在zset是 k1 score1 v1 score2 v2


## Zset常用指令
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230409120850.png)

### ZADD key score member [score member ...]
添加元素
```shell
127.0.0.1:6379> zadd zset1 60 v1 70 v2 80 v3 90 v4 100 v5
(integer) 5
```

### ZRANGE key start stop [WITHSCORES]
按照元素分数从小到大的顺序返回索引从start到stop之间的所有元素
```shell
127.0.0.1:6379> zrange zset1 0 -1 
1) "v1"
2) "v2"
3) "v3"
4) "v4"
5) "v5"

127.0.0.1:6379> zrange zset1 0 -1 withscores # 带分数遍历指定下标元素
 1) "v1"
 2) "60"
 3) "v2"
 4) "70"
 5) "v3"
 6) "80"
 7) "v4"
 8) "90"
 9) "v5"
10) "100"
```

### zrevrange key start stop [WITHSCORES]
反转集合，按照元素分数从大到小的顺序返回索引从start到stop之间的所有元素
```shell
127.0.0.1:6379> zrevrange zset1 0 -1 withscores
 1) "v5"
 2) "100"
 3) "v4"
 4) "90"
 5) "v3"
 6) "80"
 7) "v2"
 8) "70"
 9) "v1"
10) "60"

127.0.0.1:6379> zrevrange zset1 0 -1
1) "v5"
2) "v4"
3) "v3"
4) "v2"
5) "v1"
```

### ZRANGEBYSCORE key min max 【WITHSCORES】【LIMIT offset count】
获取指定分数范围的元素，可以在min和max前面加个(，表示不包含

limit作用是返回限制，limit开始下标步，一共多少步
```shell
127.0.0.1:6379> zrangebyscore zset1 60 90 withscores
1) "v1"
2) "60"
3) "v2"
4) "70"
5) "v3"
6) "80"
7) "v4"
8) "90"

127.0.0.1:6379> zrangebyscore zset1 (60 90 withscores # score 大于60，小于等于90
1) "v2"
2) "70"
3) "v3"
4) "80"
5) "v4"
6) "90"
127.0.0.1:6379> zrangebyscore zset1 60 (90
1) "v1"
2) "v2"
3) "v3"


127.0.0.1:6379> zrangebyscore zset1 60 90 limit 0 1
1) "v1"
127.0.0.1:6379> zrangebyscore zset1 60 90 limit 0 2
1) "v1"
2) "v2"
```


### ZSCORE key member
获取元素的分数
```shell
127.0.0.1:6379> zscore zset1 v1
"60"
127.0.0.1:6379> zscore zset1 v4
"90"
```


### ZCARD key
获取集合中元素的数量
```shell
127.0.0.1:6379> zcard zset1
(integer) 5
```

### zrem key member [member ...]
某个score对应的value值，作用是删除元素
```shell
127.0.0.1:6379> zrem zset1 v1
(integer) 1
127.0.0.1:6379> zrange zset1 0 -1
1) "v2"
2) "v3"
3) "v4"
4) "v5"

```


### ZINCRBY key increment member
增加某个元素的分数
```shell
127.0.0.1:6379> zincrby zset1 5 v4
"95"
127.0.0.1:6379> zincrby zset1 5 v2
"75"

127.0.0.1:6379> zrange zset1 0 -1 withscores
1) "v2"
2) "75"
3) "v3"
4) "80"
5) "v4"
6) "95"
7) "v5"
8) "100"
```

### ZCOUNT key min max
获得指定分数内的元素个数
```shell
127.0.0.1:6379> zcount zset1 60 90
(integer) 2
127.0.0.1:6379> zcount zset1 60 (100
(integer) 3
```


### ZMPOP numkeys key [key ...] MIN|MAX [COUNT count]
从键名列表中的**第一个非空排序集中弹出一个或多个元素**，他们是成员分数对
```shell
127.0.0.1:6379> zrange zset1 0 -1 withscores
1) "v2"
2) "75"
3) "v3"
4) "80"
5) "v4"
6) "95"
7) "v5"
8) "100"
127.0.0.1:6379> zmpop 1 zset1 min count 1
1) "zset1"
2) 1) 1) "v2"
      2) "75"
127.0.0.1:6379> zrange zset1 0 -1 withscores
1) "v3"
2) "80"
3) "v4"
4) "95"
5) "v5"
6) "100"
127.0.0.1:6379> zadd zset2 11 v1 22 v2 33 v3
(integer) 3

127.0.0.1:6379> zmpop 2 zset1 zset2 max count 1 # zmpop后面的数值由key的个数决定
1) "zset1"
2) 1) 1) "v5"
      2) "100"

127.0.0.1:6379> zrange zset1 0 -1 withscores
1) "v3"
2) "80"
3) "v4"
4) "95"
127.0.0.1:6379> zrange zset2 0 -1 withscores
1) "v1"
2) "11"
3) "v2"
4) "22"
5) "v3"
6) "33"

127.0.0.1:6379> zmpop 2 zset1 zset2 max count 2 # 从第一个非空的元素中弹出最小的值，而不是弹出所有key里面最小的那个值
1) "zset1"
2) 1) 1) "v4"
      2) "95"
   2) 1) "v3"
      2) "80"

```

### zrank key member [withscore]
作用是通过子value获得下标值
```shell
127.0.0.1:6379> zadd zset1 11 v1 22 v2 33 v3 44 v4
(integer) 4

127.0.0.1:6379> zrange zset1  0 -1
1) "v1"
2) "v2"
3) "v3"
4) "v4"

127.0.0.1:6379> zrank zset1 v3
(integer) 2
127.0.0.1:6379> zrank zset1 v1
(integer) 0
127.0.0.1:6379> zrank zset1 v4
(integer) 3

```

### zrevrank key member [withscore]
作用是通过子value逆序获得下标值
```shell
127.0.0.1:6379> zrevrank zset1 v1
(integer) 3
127.0.0.1:6379> zrevrank zset1 v4
(integer) 0
127.0.0.1:6379> zrevrank zset1 v2
(integer) 2
```


## Zset应用场景
**根据商品销售对商品进行排序显示**
思路：定义商品销售排行榜(sorted set集合)，key为goods:sellsort，分数为商品销售数量。

|商品编号1001的销量是9，商品编号1002的销量是15 | zadd goods:sellsort 9 1001 15 1002|
|:-:|:-:|
|有一个客户又买了2件商品1001，商品编号1001销量加2|  zincrby goods:sellsort 2 1001|
|求商品销量前10名|   ZRANGE goods:sellsort 0 9 withscores|

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230409124521.png)



# GEO
Redis GEO 主要用于存储地理位置信息，并对存储的信息进行操作，包括

添加地理位置的坐标。

获取地理位置的坐标。

计算两个位置之间的距离。

根据用户给定的经纬度坐标来获取指定范围内的地理位置集合


移动互联网时代LBS应用越来越多，交友软件中附近的小姐姐、外卖软件中附近的美食店铺、高德地图附近的核酸检查点等等，那这种附近各种形形色色的XXX地址位置选择是如何实现的? 地球上的地理位置是使用二维的经纬度表示，经度范围(-180,180]，纬度范围(-90，90]，只要我们确定一个点的经纬度就可以取得他在地球的位置。 例如滴滴打车，最直观的操作就是实时记录更新各个车的位置， 然后当我们要找车时，在数据库中查找距离我们(坐标x0,y0)附近r公里范围内部的车辆 使用如下SQL即可:

```sql
select taxi from position where x0-r< X < x0 + r and y0-r< y < y0+r
```
但是这样会有什么问题呢? 
>1. 查询性能问题，如果并发高，数据量大这种查询是要搞垮数据库的 
>2. 这个查询的是一个矩形访问，而不是以我为中心r公里为半径的圆形访问。 
>3. 精准度的问题，我们知道地球不是平面坐标系，而是一个圆球，这种矩形计算在长距离计算时会有很大误差

## 原理
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230409215550.png)

## 中文乱码问题
geo类型实际上是zset，可以使用zset相关的命令对其进行遍历，如果遍历出现中文乱码可以使用如下命令：`redis-cli --raw`


## GEO常用指令
### `GEOADD key longitude latitude member [longitude latitude member]`
多个经度(longitude)、纬度(latitude)、位置名称(member)添加到指定的key中

命令：`GEOADD city 116.403963 39.915119 "天安门" 116.403414 39.924091 "故宫" 116.024067 40.362639 "长城"`

geo类型实际上是zset，可以使用zset相关的命令对其进行遍历，如果遍历出现中文乱码可以使用如下命令：`redis-cli --raw`
```shell
GEOADD city 116.403963 39.915119 "天安门" 116.403414 39.924091 "故宫" 116.024067 40.362639 "长城"
3
```

### GEOPOS key member [member]
从键里面返回所有指定名称(member )元素的位置（经度和纬度），不存在返回nil

GEOPOS city 天安门 故宫 长城

```shell
127.0.0.1:6379> geopos city "天安门"
116.40396326780319214
39.91511970338637383

127.0.0.1:6379> geopos city "天安门" "故宫" "长城"
116.40396326780319214
39.91511970338637383
116.40341609716415405
39.92409008156928252
116.02406591176986694
40.36263993239462167
```

### GEODIST key member1 member2 [M|KM|FT|MI]
返回两个给定位置之间的距离

> m-米
> km-千米
> ft-英寸
> mi-英里

```shell
127.0.0.1:6379> geodist city "天安门" "故宫"  # 默认单位为 m
998.8332
127.0.0.1:6379> geodist city "天安门" "长城" km
59.3390
127.0.0.1:6379> geodist city "天安门" "故宫" km
0.9988
```


### `GEORADIUS key longitude latitude radius M|KM|FT|MI [WITHCOORD] [WITHDIST] [WITHHASH] [COUNT count [ANY]`
**以给定的经纬度为中心，返回与中心的距离不超过给定最大距离的所有元素位置**

>`WITHDIST`: 在返回位置元素的同时， 将位置元素与中心之间的距离也一并返回。 距离的单位和用户给定的范围单位保持一致。 
>`WITHCOORD`: 将位置元素的经度和维度也一并返回。 
>`WITHHASH`:以 52 位有符号整数的形式， 返回位置元素经过原始 geohash 编码的有序集合分值。 这个选项主要用于底层应用或者调试，实际中的作用并不大 .
>`COUNT` 限定返回的记录数。

当前位置(116.418017 39.914402),阳哥在北京王府井
```shell
127.0.0.1:6379> georadius city 116.418017 39.914402 10 km withcoord withhash count 10 desc
故宫
4069885568908290
116.40341609716415405
39.92409008156928252
天安门
4069885555089531
116.40396326780319214
39.91511970338637383
127.0.0.1:6379>
127.0.0.1:6379>
127.0.0.1:6379> georadius city 116.418017 39.914402 10 km withdist withcoord withhash count 10 desc
故宫
1.6470
4069885568908290
116.40341609716415405
39.92409008156928252
天安门
1.2016
4069885555089531
116.40396326780319214
39.91511970338637383
```

### GEORADIUSBYMEMBER
**找出位于指定范围内的元素，中心点是由给定的位置元素决定**

跟GEORADIUS类似
```shell
127.0.0.1:6379> georadiusbymember city "天安门" 10 km withdist withcoord  withhash count 10 desc
故宫
0.9988
4069885568908290
116.40341609716415405
39.92409008156928252
天安门
0.0000
4069885555089531
116.40396326780319214
39.91511970338637383
```


### GEOHASH
返回一个或多个位置元素的GEOhash表示

geohash 算法生成的base32编码值，3维变2维变1维
```shell
127.0.0.1:6379> geohash city "天安门"
wx4g0f6f2v0
127.0.0.1:6379> geohash city "天安门"  "长城" "故宫"
wx4g0f6f2v0
wx4t85y1kt0
wx4g0gfqsj0
```


# HyperLogLog
HyperLogLog 是用来做基数统计的算法，HyperLogLog 的优点是，在输入元素的数量或者体积非常非常大时，计算基数所需的空间总是固定且是很小的。

在 Redis 里面，每个 HyperLogLog 键只需要花费 12 KB 内存，就可以计算接近 2^64 个不同元素的基 数。这和计算基数时，元素越多耗费内存就越多的集合形成鲜明对比。

但是，因为 HyperLogLog 只会根据输入元素来计算基数，而不会储存输入元素本身，所以 HyperLogLog 不能像集合那样，返回输入的各个元素。

## 需求：
用户搜索网站关键词的数量

统计用户每天搜索不同词条个数

统计某个网站的UV、统计某个文章的UV

什么是UV？
>Unique Visitor，独立访客，一般理解为客户端IP，**需要去重考虑**

### 是什么
去重复统计功能的基数估计算法-就是HyperLogLog

>- Redis在2.8.9版本添加了HyperLogLog 结构。
>- Redis HyperLogLog是用来做基数统计的算法，HyperLogLog 的优点是，在输入元素的数量或者体积非常非常大时，计算基数所需的空间总是固定的、并且是很小的。
>- 在Redis里面，每个 HyperLogLog键只需要花费12KB内存，就可以计算接近2^64个不同元素的基数。这和计算基数时，元素越多耗费
>- 内存就越多的集合形成鲜明对比。
>- 但是，因为HyperLogLog只会根据输入元素来计算基数，而不会储存输入元素本身，所以HyperLogLog不能像集合那样，返回输入的各个元素。

**基数**：是一种数据集，去重复后的真实个数
```
(全集)={2,4,6,8,77,39,4,8,10}
去掉重复的内容
基数={2,4,6,8,77,39,10} = 7
```

基数统计：用于统计一个集合中不重复的元素个数，就是对集合去重复后剩余元素的计算。

一句话：**去重脱水后的真实数据**

## HyperLogLog基本指令
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230409222613.png)

```shell
127.0.0.1:6379> pfadd h1 1 3 3  4 5 6 7 # 返回 1 表示成功
1
127.0.0.1:6379> pfadd h2 1 3 12  4 5 8 9 66
1
127.0.0.1:6379> pfcount h1 # 去重后6个元素有效
6
127.0.0.1:6379> pfcount h2
8
127.0.0.1:6379> pfmerge disResult h1 h2 # 合并
OK
127.0.0.1:6379> pfcount disResult
12

```



# Bitmap
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230408205154.png)

由0和1状态表现的二进制位的bit数组

**位图本质是数组**，它是基于String数据类型的按位的操作。该数组由多个二进制位组成，每个二进制位都对应一个偏移量（我们称之为一个索引）。

Bitmap支持的最大位数是2^32位，它可以极大的节约存储空间，使用512M内存就可以存储多达42.9亿的字节信息(2^32=4294967296)

一般用于什么地方
>用户是否登陆过Y、N，比如京东每日签到送京豆
>电影、广告是否被点击播放过
>钉钉打卡上下班，签到统计

## Bitmap基本命令
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230409125701.png)

### setbit key offset value
setbit 键偏移位 只能零或者1

**Bitmap的偏移量从零开始计算的**
```shell
127.0.0.1:6379> setbit k1 1 1
(integer) 0
127.0.0.1:6379> setbit k1 7 1
(integer) 0
127.0.0.1:6379> get k1
"A"
```
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230409130141.png)

### getbit key offset
获取键偏移位的值
```shell
127.0.0.1:6379> getbit k1 0
(integer) 0
127.0.0.1:6379> getbit k1 1
(integer) 1
127.0.0.1:6379> getbit k1 7
(integer) 1
```


### strlen key
统计字节数占用多少
```shell
127.0.0.1:6379> strlen k1
(integer) 1

127.0.0.1:6379> setbit k1 8 1
(integer) 0
127.0.0.1:6379> strlen k1
(integer) 2
127.0.0.1:6379> setbit k1 16 1
(integer) 0
127.0.0.1:6379> strlen k1
(integer) 3
```

### bitcount key [start end [byte|bit]]
全部键里面包含有1的有多少个
```shell
127.0.0.1:6379> bitcount k1
(integer) 4
```


### bitop operation(AND|OR|XOR|NOT) destkey key [key ...]
案例：连续2天都签到的用户数量

假如某个网站或者系统，它的用户有1000W，我们可以使用redis的HASH结构和bitmap结构做个用户id和位置的映射
```shell
127.0.0.1:6379> hset uid:map 0 uid:login1 
(integer) 1
127.0.0.1:6379> hset uid:map 1 uid:login2
(integer) 1

127.0.0.1:6379> hgetall uid:map #比如使用bitmap中的比特位来映射这两个hset对象
1) "0"
2) "uid:login1"
3) "1"
4) "uid:login2"

127.0.0.1:6379> setbit 20230409 0 1 # 代表uid:login1签到过
(integer) 0
127.0.0.1:6379> setbit 20230409 1 1 # 代表uid:login2签到过
(integer) 0
127.0.0.1:6379> setbit 20230409 3 1
(integer) 0

# 四月九号签到的用户
127.0.0.1:6379> getbit 20230409 0 
(integer) 1
127.0.0.1:6379> getbit 20230409 1
(integer) 1
127.0.0.1:6379> getbit 20230409 3
(integer) 1

# 四月十号签到的用户
127.0.0.1:6379> setbit 20230410 1 1
(integer) 0
127.0.0.1:6379> setbit 20230410 3 1
(integer) 0

# 统计在四月九号和四月十号连续登录的用户 使用操作符 and
127.0.0.1:6379> bitop and con 20230409 20230410
(integer) 1
127.0.0.1:6379> bitcount con # 统计到的数据会放在con中
(integer) 2   # 在九号和十号两天中，只有两个用户符合要求
```

## 应用场景

### —年365天，全年天天登陆占用多少字节
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230409203520.png)


### 按照年
按年去存储一个用户的签到情况，365 天只需要 365 / 8 ≈ 46 Byte，1000W 用户量一年也只需要 44 MB 就足够了。

假如是亿级的系统，

每天使用1个1亿位的Bitmap约占12MB的内存（10^8/8/1024/1024），10天的Bitmap的内存开销约为440MB，内存压力不算太高。


此外，在实际使用时，最好对Bitmap设置过期时间，让Redis自动删除不再需要的签到记录以节省内存开销。


# Bitfield
通过bitfield命令可以一次性操作多个比特位域(指的是连续的多个比特位)，它会执行一系列操作并返回一个响应数组，这个数组中的元素对应参数列表中的相应操作的执行结果。

说白了就是通过bitfield命令我们可以一次性对多个比特位域进行操作。

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230409223541.png)

位域修改、溢出控制

## 一句话
将一个redis字符串看作是**一个由二进制位组成的数组**并能对变长位宽和任意没有字节对齐的指定整型位域进行寻址和修改

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230409223621.png)

## Bitfield常用指令
Ascii码表：[https://ascii.org.cn](https://ascii.org.cn/)

### BITFIELD key [GET type offset]
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230409223725.png)

### BITFIELD key set type offstet value
```shell
127.0.0.1:6379> set fieldkey hello
OK
127.0.0.1:6379> bitfield fieldkey get i8 0
104
127.0.0.1:6379> bitfield fieldkey get i8 8
101
127.0.0.1:6379> bitfield fieldkey set i8 8 120 #从第9个位开始，将接下来8个位用有符号数120(字母x)替换
101

127.0.0.1:6379> get fieldkey
hxllo
```
**如果偏移量后面的值发生溢出（大于127），redis对此也有对应的溢出控制，默认情况下，INCRBY使用WRAP参数**

### 溢出控制 OVERFLOW [WRAP|SAT|FAIL]
WRAP:使用回绕(wrap around)方法处理有符号整数和无符号整数溢出情况
```shell
127.0.0.1:6379> set test a
OK

127.0.0.1:6379> bitfield test get i8 0 # 对应ascll码 97
97

127.0.0.1:6379> bitfield test set i8 0 138 # i8表示有符号8位二进制，范围(-128 ,127)
97

127.0.0.1:6379> bitfield test get i8 0 # 默认overflow为wrap，即循环溢出
-118
```

**SAT:使用饱和计算(saturation arithmetic)方法处理溢出，下溢计算的结果为最小的整数值，而上溢计算的结果为最大的整数值**
```shell
127.0.0.1:6379> bitfield test get i8 0
-118

127.0.0.1:6379> bitfield test overflow sat set i8 0 138
-118

127.0.0.1:6379> bitfield test get i8 0
127

```


**fail:命令将拒绝执行那些会导致上溢或者下溢情况出现的计算，并向用户返回空值表示计算未被执行**
```shell
127.0.0.1:6379> bitfield test get i8 0
-118

127.0.0.1:6379> bitfield test overflow sat set i8 0 138
-118

127.0.0.1:6379> bitfield test get i8 0
127

127.0.0.1:6379> bitfield test overflow fail set i8 0 888
nil
```

# Stream
Redis Stream 是 Redis 5.0 版本新增加的数据结构。

Redis Stream 主要用于消息队列（MQ，Message Queue），Redis 本身是有一个 Redis 发布订阅 (pub/sub) 来实现消息队列的功能，但它有个缺点就是消息无法持久化，如果出现网络断开、Redis 宕机等，消息就会被丢弃。

简单来说发布订阅 (pub/sub) 可以分发消息，但无法记录历史消息。

而 Redis Stream 提供了消息的持久化和主备复制功能，可以让任何客户端访问任何时刻的数据，并且能记住每一个客户端的访问位置，还能保证消息不丢失

## Stream类型是什么
Redis5.0 之前的痛点，Redis消息队列的2种方案：

1.  List实现消息队列，List实现方式其实就是点对点的模式
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230409204012.png)

2.  Pub/Sub
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230409204026.png)
Redis5.0版本新增了一个更强大的数据结构---Stream

一句话：Stream流就是Redis版的MQ消息中间件+阻塞队列


## 能干嘛
实现消息队列，它支持消息的持久化、支持自动生成全局唯一ID、支持ack确认消息的模式、支持消费组模式等，让消息队列更加的稳定和可靠


## 底层结构和原理说明
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230409204217.png)
一个消息链表，将所有加入的消息都串起来，每个消息都有一个唯一ID的和对应的内容

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230409204248.png)

## Stream常用指令
### 队列相关指令
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230409204348.png)

### 消费组相关指令
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230409204409.png)
`XINFO GROUPS` 打印消费组的详细信息

`XINFO STREAM` 打印stream的详细信息

##### 四个特殊符号
|`- +`|  最小和最大可能出现的Id|
|:-:|:-:|
|`$`    |`$`表示只消费新的消息，当前流中最大的Id，可用于将要到来的信息|
|`>`  | 用于XREADGROUP命令，表示迄今还没有发送给组中使用者的信息，会更新消费者组的最后Id|
|`*`  |  用于XADD命令，让系统自动生成Id|

## 队列相关指令详解
### XADD
添加消息到队列末尾，消息ID必须要比上一个ID大，默认用**星号**表示自动生成ID；`*` 用于XADD命令中，让系统自动生成ID；

XADD用于向Stream队列中添加消息，如果指定的Stream队列不存在，则该命令执行时会新建一个Stream队列
```shell
127.0.0.1:6379> xadd mystream * id 11 cname zhang3
"1681044642176-0"  # 这就是生成的ID
127.0.0.1:6379> xadd mystream * id 12 cname li4
"1681044653467-0"
127.0.0.1:6379> xadd mystream * id 13 cname wang5
"1681044663773-0"
```
生成的消息ID，有两部分组成，毫秒时间戳-该毫秒内产生的第一条消息

`*` 表示服务器自动生成MessageID(类似MySQL里面主键auto_increment)，后面顺序跟着一堆业务key/value

**信息条目指的是序列号，在相同的毫秒下序列号从0开始递增，序列号是64位长度，理论上在同一毫秒内生成的数据量无法到达这个级别，因此不用担心序列号会不够用。milisecondsTime指的是Redis节点服务器的本地时间，如果存在当前的毫秒时间截比以前已经存在的数据的时间戳小的话(本地时间钟后跳)，那么系统将会采用以前相同的毫秒创建新的ID，也即redis 在增加信息条目时会检查当前 id 与上一条目的 id，自动纠正错误的情况，一定要保证后面的 id 比前面大，一个流中信息条目的ID必须是单调增的，这是流的基础。**

客户端显示传入规则:  
Redis对于ID有强制要求，格式必须是**时间戳-自增Id**这样的方式，且后续ID不能小于前一个ID

Stream的消息内容，也就是图中的Messaget它的结构类似Hash结构，以kev-value的形式存在


### XRANGE key start end [COUNT count]
用于获取消息列表（可以指定范围），忽略删除的消息

start 表示开始值，-代表最小值

end 表示结束值，+代表最大值

count 表示最多获取多少个值
```shell
127.0.0.1:6379> xrange mystream - +
1) 1) "1681044642176-0"
   2) 1) "id"
      2) "11"
      3) "cname"
      4) "zhang3"
2) 1) "1681044653467-0"
   2) 1) "id"
      2) "12"
      3) "cname"
      4) "li4"
3) 1) "1681044663773-0"
   2) 1) "id"
      2) "13"
      3) "cname"
      4) "wang5"
127.0.0.1:6379>
127.0.0.1:6379>
127.0.0.1:6379> xrange mystream - + count 1 # 要求只输出一条
1) 1) "1681044642176-0"
   2) 1) "id"
      2) "11"
      3) "cname"
      4) "zhang3"
```

### XREVRANGE key end start [COUNT count]
根据ID降序输出
```shell
127.0.0.1:6379> xrevrange mystream + - # 注意这里的+ -也是相反的，否则无法输出
1) 1) "1681044663773-0"
   2) 1) "id"
      2) "13"
      3) "cname"
      4) "wang5"
2) 1) "1681044653467-0"
   2) 1) "id"
      2) "12"
      3) "cname"
      4) "li4"
3) 1) "1681044642176-0"
   2) 1) "id"
      2) "11"
      3) "cname"
      4) "zhang3"
```

### XDEL key id [id ...]
```shell
127.0.0.1:6379> xrange mystream - +
1) 1) "1681044642176-0"
   2) 1) "id"
      2) "11"
      3) "cname"
      4) "zhang3"
2) 1) "1681044653467-0"
   2) 1) "id"
      2) "12"
      3) "cname"
      4) "li4"
3) 1) "1681044663773-0"
   2) 1) "id"
      2) "13"
      3) "cname"
      4) "wang5"

127.0.0.1:6379> xdel mystream 1681044653467-0 # 使用流专用的ID进行删除
(integer) 1

127.0.0.1:6379> xrange mystream - +
1) 1) "1681044642176-0"
   2) 1) "id"
      2) "11"
      3) "cname"
      4) "zhang3"
2) 1) "1681044663773-0"
   2) 1) "id"
      2) "13"
      3) "cname"
      4) "wang5"

```



### XLEN key
```shell
127.0.0.1:6379> xrange mystream - +
1) 1) "1681044642176-0"
   2) 1) "id"
      2) "11"
      3) "cname"
      4) "zhang3"
2) 1) "1681044663773-0"
   2) 1) "id"
      2) "13"
      3) "cname"
      4) "wang5"

127.0.0.1:6379> xlen mystream
(integer) 2
```


### XTRIM key MAXLEN|MINID
用于对Stream的长度进行截取，如超长会进行截取

MAXLEN 允许的最大长度，对流进行修剪限制长度

MINID 允许的最小id，从某个id值开始比该id值小的将会被抛弃
```shell
127.0.0.1:6379> xrange mystream - +
1) 1) "1681044642176-0"
   2) 1) "id"
      2) "11"
      3) "cname"
      4) "zhang3"
2) 1) "1681044663773-0"
   2) 1) "id"
      2) "13"
      3) "cname"
      4) "wang5"
3) 1) "1681045362551-0"
   2) 1) "id"
      2) "12"
      3) "cname"
      4) "li4"
4) 1) "1681045391497-0"
   2) 1) "id"
      2) "15"
      3) "cname"
      4) "zhao6"

127.0.0.1:6379> xtrim mystream maxlen 2 # 截取两条最大的数据，根据id排序
(integer) 2

127.0.0.1:6379> xrange mystream - +
1) 1) "1681045362551-0"
   2) 1) "id"
      2) "12"
      3) "cname"
      4) "li4"
2) 1) "1681045391497-0"
   2) 1) "id"
      2) "15"
      3) "cname"
      4) "zhao6"

127.0.0.1:6379> xtrim mystream minid 1681045391497-0 # 截取舍弃比指定id小的数据
(integer) 1
127.0.0.1:6379> xrange mystream - +
1) 1) "1681045391497-0"
   2) 1) "id"
      2) "15"
      3) "cname"
      4) "zhao6"
```

### `XREAD [COUNT count]  [BLOCK milliseconds] STREAMS key [key ...] id [id ...]`
可以读取多个key

**用于获取消息(阻塞/非阻塞)**

​ 只会返回大于指定ID的消息，COUNT最多读取多少条消息；BLOCK是否以阻塞的方式读取消息，默认不阻塞，如果milliseconds设置为0，表示永远阻塞

#### 非阻塞
-   `$`表特殊ID，表示以当前Stream已经存储的最大的ID作为最后一个ID，当前Stream中不存在大于当前最大ID的消息，因此此时返回nil
-   `0-0`代表从最小的ID开始获取Stream中的消息，当不指定count，将会返回Stream中的所有消息，注意也可以使用0 (00/000也都是可以的)
```shell
127.0.0.1:6379> xrange mystream - +
1) 1) "1681045723532-0"
   2) 1) "id"
      2) "11"
      3) "name"
      4) "zhang3"
2) 1) "1681045730976-0"
   2) 1) "id"
      2) "12"
      3) "name"
      4) "li4"
3) 1) "1681045739571-0"
   2) 1) "id"
      2) "13"
      3) "name"
      4) "wang5"
4) 1) "1681045743910-0"
   2) 1) "id"
      2) "13"
      3) "name"
      4) "zhao6"
127.0.0.1:6379>
127.0.0.1:6379>
127.0.0.1:6379> xread count 2 streams mystream $
(nil)
127.0.0.1:6379> xread count 2 streams mystream 0-0
1) 1) "mystream"
   2) 1) 1) "1681045723532-0"
         2) 1) "id"
            2) "11"
            3) "name"
            4) "zhang3"
      2) 1) "1681045730976-0"
         2) 1) "id"
            2) "12"
            3) "name"
            4) "li4"
```

#### 阻塞
先使用该指令，使用后该进程会阻塞等待。
```shell
127.0.0.1:6379> xread count 1 block 0 streams mystream $ 
# 阻塞队列，一直在当前最大id值的位置阻塞，有消息进入时会马上消费
```

在新开一个客户端，输入以下指令
```shell
127.0.0.1:6379> xadd mystream * id 66 name hhh
"1681046163502-0
```


```shell
# 此时阻塞的这个客户端就会收到我们在另一个客户端输入的消息
127.0.0.1:6379> xread count 1 block 0 streams mystream $
1) 1) "mystream"
   2) 1) 1) "1681046163502-0"
         2) 1) "id"
            2) "66"
            3) "name"
            4) "hhh"
(3.63s) # 总阻塞等待耗时3.63s
```

**小总结（类似java里面的阻塞队列）**
Stream的基础方法，使用XADD存入消息和XREAD循环阻塞读取消息的方式可以实现简易版的消息队列
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230409212229.png)



## 消费组相关指令详解
### XGROUP CREATE key group id|$
用于创建消费组
`xgroup create mystream groupA $`
`xgroup create mystream groupB 0`

`$`表示从Stream尾部开始消费

`0`表示从Stream头部开始消费

创建消费组的时候必须指定ID，ID为`0`表示从头开始消费，为`$`表示只消费新消息
```shell
127.0.0.1:6379> xgroup create mystream groupA $
OK
127.0.0.1:6379> xgroup create mystream groupB 0
OK
```

### `XREADGROUP GROUP group [COUNT count] [BLOCK milliseconds] STREAMS key id`
"`>`"，表示从第一条尚未被消费的消息开始读取


stream中的消息—旦被消费组里的一个消费者读取了，就不能再被该消费组内的其他消费者读取了，即同一个消费组里的消费者不能消费同—条消息。刚才的XREADGROUP命令再执行—次，此时读到的就是空值
```shell
127.0.0.1:6379> xreadgroup group groupB consumer1 streams mystream >
1) 1) "mystream"
   2) 1) 1) "1681045723532-0"
         2) 1) "id"
            2) "11"
            3) "name"
            4) "zhang3"
      2) 1) "1681045730976-0"
         2) 1) "id"
            2) "12"
            3) "name"
            4) "li4"
      3) 1) "1681045739571-0"
         2) 1) "id"
            2) "13"
            3) "name"
            4) "wang5"
      4) 1) "1681045743910-0"
         2) 1) "id"
            2) "13"
            3) "name"
            4) "zhao6"
      5) 1) "1681046163502-0"
         2) 1) "id"
            2) "66"
            3) "name"
            4) "hhh"
127.0.0.1:6379> xreadgroup group groupB consumer2 streams mystream >
(nil)
```

消费组groupA内的消费者consumer1从mystream消息队列中读取所有消息

但是，**不同消费组**的消费者可以消费同一条消息
```shell
127.0.0.1:6379> xreadgroup group groupB consumer1 streams mystream >
(nil)

127.0.0.1:6379> XGROUP create mystream groupC 0
OK
127.0.0.1:6379> xreadgroup group groupC consumer1 streams mystream >
1) 1) "mystream"
   2) 1) 1) "1681045723532-0"
         2) 1) "id"
            2) "11"
            3) "name"
            4) "zhang3"
      2) 1) "1681045730976-0"
         2) 1) "id"
            2) "12"
            3) "name"
            4) "li4"
      3) 1) "1681045739571-0"
         2) 1) "id"
            2) "13"
            3) "name"
            4) "wang5"
      4) 1) "1681045743910-0"
         2) 1) "id"
            2) "13"
            3) "name"
            4) "zhao6"
      5) 1) "1681046163502-0"
         2) 1) "id"
            2) "66"
            3) "name"
            4) "hhh"

```

***消费组的目的？***
让组内的多个消费者共同分担读取消息，所以，我们通常会让每个消费者读取部分消息，从而实现消息读取负载在多个消费者间是均衡分部的
```shell
127.0.0.1:6379> XGROUP create mystream groupD 0
OK
127.0.0.1:6379> XREADGROUP GROUP groupD consumer1 COUNT 1 STREAMS mystream >
1) 1) "mystream"
   2) 1) 1) "1681045723532-0"
         2) 1) "id"
            2) "11"
            3) "name"
            4) "zhang3"
127.0.0.1:6379> XREADGROUP GROUP groupD consumer2 COUNT 1 STREAMS mystream >
1) 1) "mystream"
   2) 1) 1) "1681045730976-0"
         2) 1) "id"
            2) "12"
            3) "name"
            4) "li4"
127.0.0.1:6379> XREADGROUP GROUP groupD consumer3 COUNT 1 STREAMS mystream >
1) 1) "mystream"
   2) 1) 1) "1681045739571-0"
         2) 1) "id"
            2) "13"
            3) "name"
            4) "wang5"
```

### 重点问题
基于 Stream 实现的消息队列，如何保证消费者在发生故障或宕机再次重启后，仍然可以读取未处理完的消息?

Streams 会自动使用内部队列(也称为 PENDING List)留存消费组里每个消费者读取的消息保底措施，直到消费者使用 XACK命令通知 Streams"消息已经处理完成”。 消费确认增加了消息的可靠性，一般在业务处理完成之后，需要执行 XACK 命令确认消息已经被消费完成
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230409213809.png)

### XPENDING
查询每个消费组内所有消费组**已读取、但尚未确认**的消息
```shell
127.0.0.1:6379> xpending mystream groupA
1) (integer) 0
2) (nil)
3) (nil)
4) (nil)
127.0.0.1:6379> xpending mystream groupB
1) (integer) 5    # 总共有五条
2) "1681045723532-0"
3) "1681046163502-0"
4) 1) 1) "consumer1"
      2) "5"  # 表示一次读了5条
127.0.0.1:6379> xpending mystream groupC
1) (integer) 5
2) "1681045723532-0"
3) "1681046163502-0"
4) 1) 1) "consumer1"
      2) "5"
127.0.0.1:6379> xpending mystream groupD
1) (integer) 3   #总共有五条
2) "1681045723532-0"
3) "1681045739571-0"
4) 1) 1) "consumer1"
      2) "1"     # 表示一次读了1条
   2) 1) "consumer2"
      2) "1"
   3) 1) "consumer3"
      2) "1"
```

查看某个消费组具体读取了那些数据
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230409214346.png)

### XACK key group id [id...]
向消息队列确认消息处理已完成
```shell
127.0.0.1:6379> xpending mystream groupD - + 1 consumer2 # 参看已读为确认的消息
1) 1) "1681045730976-0"
   2) "consumer2"
   3) (integer) 607717
   4) (integer) 1

127.0.0.1:6379> xack mystream groupD 1681045730976-0 #对消息进行确认
(integer) 1

127.0.0.1:6379> xpending mystream groupD - + 1 consumer2 # 已读为确认就会减少一条
(empty array)
```

### `XINFO 用于打印Stream\Consumer\Group的详细信息`
```shell
127.0.0.1:6379> xrange mystream - +
1) 1) "1681045723532-0"
   2) 1) "id"
      2) "11"
      3) "name"
      4) "zhang3"
2) 1) "1681045730976-0"
   2) 1) "id"
      2) "12"
      3) "name"
      4) "li4"
3) 1) "1681045739571-0"
   2) 1) "id"
      2) "13"
      3) "name"
      4) "wang5"
4) 1) "1681045743910-0"
   2) 1) "id"
      2) "13"
      3) "name"
      4) "zhao6"
5) 1) "1681046163502-0"
   2) 1) "id"
      2) "66"
      3) "name"
      4) "hhh"

127.0.0.1:6379> XINFO STREAM mystream
 1) "length"
 2) (integer) 5        # 此stream的长度是5
 3) "radix-tree-keys"
 4) (integer) 1
 5) "radix-tree-nodes"
 6) (integer) 2
 7) "last-generated-id"
 8) "1681046163502-0"
 9) "max-deleted-entry-id"
10) "0-0"
11) "entries-added"
12) (integer) 5
13) "recorded-first-entry-id"
14) "1681045723532-0"
15) "groups"
16) (integer) 4
17) "first-entry"
18) 1) "1681045723532-0"    # 第一个进入的消息
    2) 1) "id"
       2) "11"
       3) "name"
       4) "zhang3"
19) "last-entry"
20) 1) "1681046163502-0"  # 最后一个进入的消息
    2) 1) "id"
       2) "66"
       3) "name"
       4) "hhh"

```

## 使用建议
Stream还是不能100%等价于Kafka、RabbitMQ来使用的，生产案例少，慎用







