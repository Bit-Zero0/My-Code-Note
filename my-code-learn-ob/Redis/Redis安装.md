Redis 只建议安装在Linux系统中

并gcc环境升级到最好在 7 以上

# 下载 Redis
[Download | Redis](https://redis.io/download/)

下载后会得到一个 `.tar.gz` 的压缩包
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230405205233.png)

上传在Linux系统的 `/opt` 文件夹路径下 , 使用 `tar -zxvf` 指令解压缩
```shell
tar -zxvf redis-版本.tar.gz
```

# 安装 Redis
解压后会生成一个文件夹**redis-7.0.10** , 进入该**redis-7.0.10**目录中 , 使用 `make &&  make install` 指令
```shell
cd redis-7.0.10

make && make install  
```

## 修改配置文件
安装完后回到`/opt/redis7.0.9/` , 创建redis的备份文件到**myredis**文件夹中
```shell
mkdir /myredis                #在根目录下创建myredis

cp redis.conf /myredis/redis7.conf     #将默认的复制过去
```

修改myredis目录下redis7.conf配置文件做初始化设置
`vim /myredis/redis7.conf `           
redis.conf配置文件，改完后确保生效，记得重启，记得重启
	- 默认`daemonize no` 改为 `daemonize yes`
	- 默认`protected-mode yes` 改为 `protected-mode no`
	- 默认`bind 127.0.0.1` 改为 **直接注释**掉(默认bind 127.0.0.1只能本机访问)或改成本机IP地址，否则影响远程IP连接
	- **添加redis密码 改为 requirepass 你自己设置的密码**


# 运行Redis
在/usr/local/bin目录下运行redis-server，启用 /myredis目录下的redis7.conf
```shell
redis-server myredis/redis7.conf
```

## 连接服务
```sehll
redis-cli -a 设置的密码 -p 6379
```

进入后,使用指令 `ping` , redis回复 `PONG` , 则表示连接成功
```shell
127.0.0.1:6379> ping
PONG  # redis 回复PONG 表示连接成功
```


# 关闭 redis
若在 redis-cli中 可直接只用`shutdown`指令进行关闭
```shell
127.0.0.1:6379> shutdown
not connected>
not connected>
not connected> quit
```

## 单实例关闭
```shell
redis-cli -a 123456 shutdown
```

## 多实例关闭
多实例关闭,指定端口号关闭：
```shell
 redis-cli -p 6379 shutdown
```


# 去除redis登录小tip
**tip** 登录redis 有一个warning警告
```shell
[root@VM-8-6-centos redis-7.0.10]# redis-cli -a 密码 -p 6379
Warning: Using a password with '-a' or '-u' option on the command line interface may not be safe.
```

如果想要去除的话
```
redis-cli -a 密码 2>/dev/null
```