
# 帮助启动类命令
## 启动docker
```shell
systemctl start docker
```

## 停止docker
```shell
systemctl stop docker
```

## 重启docker 
```shell
systemctl restart docker
```

## 查看docker状态
```shell
systemctl status docker
```

## 开启启动
```shell
systemctl enable docker
```

## 查看docker概要信息
```shell
docker info
```

## 查看docker总体帮助文档
```shell
docker --help
```

## 查看docker命令帮助文档
```shell
docker 具体命令--help
```


# 镜像命令
## docker images
列出本地主机上的镜像

**OPTIONS:**
> `-a` : :列出本地所有的镜像（含历史映像层)
> `-q` : 只显示镜像ID。


## docker search 镜像名
搜索是否存在该镜像

### 官网搜索
可以使用官网进行搜索: https://hub.docker.com

### 命令
案例:
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230427173112.png)

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230427173159.png)


OPTIONS说明:
> `--limit` : 只列出n个镜像，默认25个

`docker search --limit 5 redis`
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230427173420.png)



## docker pull 镜像名
从仓库

`docker pull 镜像名字[:TAG]`
>**没有TAG就是最新版 == docker pull 镜像名字:latest**

`docker pull ubuntu`
```shell
[root@VM-8-10-centos ~]# docker pull ubuntu
Using default tag: latest
latest: Pulling from library/ubuntu
2ab09b027e7f: Pull complete
Digest: sha256:67211c14fa74f070d27cc59d69a7fa9aeff8e28ea118ef3babc295a0428a6d21
Status: Downloaded newer image for ubuntu:latest
docker.io/library/ubuntu:latest

[root@VM-8-10-centos ~]# docker images
REPOSITORY    TAG       IMAGE ID       CREATED         SIZE
redis         latest    eca1379fe8b5   9 days ago      117MB
ubuntu        latest    08d22c0ceb15   7 weeks ago     77.8MB # 拉取成功
hello-world   latest    feb5d9fea6a5   19 months ago   13.3kB

```


## docker system df 
查看镜像/容器/数据卷所占的空间 
```shell
[root@VM-8-10-centos ~]# docker system df
TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          3         1         194.9MB   194.9MB (99%)
Containers      4         0         0B        0B
Local Volumes   0         0         0B        0B
Build Cache     0         0         0B        0B
```


## docker rmi 镜像名ID
删除镜像

### 删除单个
```shell
docker rmi -f 镜像ID
```

```shell
[root@VM-8-10-centos ~]# docker rmi redis
Untagged: redis:latest
Untagged: redis@sha256:f50031a49f41e493087fb95f96fdb3523bb25dcf6a3f0b07c588ad3cdbe1d0aa
Deleted: sha256:eca1379fe8b541831fd5ce4a252c263db0cef4efbfd428a94225dc020aaeb1af
Deleted: sha256:21acda8c08f1a6109e2fb61ed010d368ee6581cf30128cdaab0e6b91dabffc22
Deleted: sha256:aafc83c9f9299ba7a3af08ab0b1f822340278803714695fd2a96351fe89b37ea
Deleted: sha256:644ab96acc6e4232dc7be6f1855b27f5f3534b17b9e9c19ae2557991b99487db
Deleted: sha256:6e75f4867056adfca8dfafbb0e94a525064797e4f0a106bca817b5afce47af73
Deleted: sha256:84e4c46eefa83bc327e4e356365ec03a3ee1f691d181235e5b69e36663f7dd57
Deleted: sha256:ed7b0ef3bf5bbec74379c3ae3d5339e666a314223e863c70644f7522a7527461
```


### 删除多个
```shell
docker rmi -f 镜像1:TAG 
```


### 删除全部
```shell
docker rmi -f ${docker images -qa}
```



# 容器命令
有镜像才能创建容器，这是根本前提(下载一个CentOS或者ubuntu镜像演示)
```shell
docker pull ubuntu
```
本次演示用ubuntu演示


## 新建+启动容器
`docker run [OPTIONS] IMAGE[COMMAND][ARG...]`


OPTIONS:
>`--name="容器新名字"`       为容器指定一个名称；
>`-d`: 后台运行容器并返回容器ID，也即**启动守护式容器(后台运行)**；
 >
>`-i`：**以交互模式运行容器，通常与 -t 同时使用**；
>`-t`：**为容器重新分配一个伪输入终端，通常与 -i 同时使用**；
>也即**启动交互式容器(前台有伪终端，等待交互)**；
 >
>`-P`: 随机端口映射，大写P
>`-p`: 指定端口映射，小写p

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230427175740.png)



```shell
docker run -it /bin/bash
```

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230427180210.png)

使用镜像`ubuntu:latest`以交互模式启动一个容器,在容器内执行`/bin/bash`命令。
`docker run -it ubuntu /bin/bash`



参数说明：
>`-i`: 交互式操作。
>`-t`: 终端。
>ubuntu : ubuntu 镜像。
>`/bin/bash`：放在镜像名后的是命令，这里我们希望有个交互式 Shell，因此用的是 `/bin/bash`。
>要退出终端，直接输入` exit`:

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230427180420.png)

## 列出当前正在运行的容器
`docker ps[OPTIONS]`

**OPTIONS**
>`-a` :列出当前所有**正在运行**的容器+**历史上运行过**的
>`-l` :显示最近创建的容器。
>`-n`：显示最近n个创建的容器。
>`-q` :**静默模式，只显示容器编号**。


1. 启动ubuntu容器,并定义名字为 yhh 
```shell
docker run -it --name=yhh  ubuntu  /bin/bash
```

2. 新开一个窗口 , 使用 `docker ps` 命令
```shell
[root@VM-8-10-centos ~]# docker ps
CONTAINER ID   IMAGE     COMMAND       CREATED         STATUS         PORTS     NAMES
71ffd7a576d2   ubuntu    "/bin/bash"   6 seconds ago   Up 6 seconds             yhh
```
可以看到这个正在运行的容器的信息, NAMES就是我们给ubuntu的命名.

## 退出容器
有两种退出方式 `exit` , `ctrl+p+q`

### exit
run进去容器，exit退出，容器停止
```shell
[root@VM-8-10-centos ~]# docker run -it --name=yhh  ubuntu  /bin/bash
root@71ffd7a576d2:/#
root@71ffd7a576d2:/#
root@71ffd7a576d2:/#
root@71ffd7a576d2:/#
root@71ffd7a576d2:/# exit
exit
[root@VM-8-10-centos ~]#
```

### ctrl+p+q
run进去容器，`ctrl+p+q`退出,容器不停止
```bash
[root@VM-8-10-centos ~]# docker run -it   ubuntu  /bin/bash
root@25b43422dcc5:/#         #这里使用了 ctrl+p+q
[root@VM-8-10-centos ~]#
```

使用[[Docker常见命令#列出当前正在运行的容器|docker ps]]指令查看, 可以看到正在运行,没有退出.
```shell
[root@VM-8-10-centos ~]# docker ps
CONTAINER ID   IMAGE     COMMAND       CREATED          STATUS          PORTS     NAMES
25b43422dcc5   ubuntu    "/bin/bash"   12 seconds ago   Up 11 seconds             objective_ptolemy
```


## 启动已停止运行的容器
`docker start 容器ID或者容器名`


上面的例子我们退出了 名叫yhh的ubuntu容器,现在使用该条指令可以恢复
```shell
docker start yhh
```

使用[[Docker常见命令#列出当前正在运行的容器|docker ps]]指令查看, 看看yhh这个容器是否恢复
```shell
[root@VM-8-10-centos ~]# docker ps
CONTAINER ID   IMAGE     COMMAND       CREATED          STATUS         PORTS     NAMES
25b43422dcc5   ubuntu    "/bin/bash"   4 minutes ago    Up 4 minutes             objective_ptolemy
71ffd7a576d2   ubuntu    "/bin/bash"   14 minutes ago   Up 8 seconds             yhh
```
已经恢复!!!


## 重启容器
`docker restart 容器ID或者容器名`


## 停止容器
`docker stop 容器ID或者容器名`


## 强制停止容器
`docker kill 容器ID或容器名`


## 删除已停止容器
`docker rm 容器ID`


**一次性删除多个容器实例**
```shell
docker rm -f $(docker ps -a -q)

docker ps -a -q | xargs docker rm
```



# 容器中相对重要的内容

## 启动守护式容器(后台服务器)
在大部分的场景下，我们希望 docker 的服务是在后台运行的，
我们可以过 -d 指定容器的后台运行模式。

### docker run -d 容器名
使用镜像 redis:latest以后台模式启动一个容器
```shell
docker run -d redis
```
问题：然后`docker ps -a` 进行查看, 会**发现容器已经退出**
很重要的要说明的一点: **==Docker容器后台运行,就必须有一个前台进程==**.
容器运行的命令如果不是那些**一直挂起的命令**（比如运行top，tail），就是会自动退出的。
 
这个是docker的机制问题,比如你的web容器,我们以nginx为例，
>- 正常情况下,我们配置启动服务只需要启动响应的service即可。例如service nginx start
>- 但是,这样做,nginx为后台进程模式运行,就导致docker前台没有运行的应用,这样的容器后台启动后,会立即自杀因为他觉得他没事可做了.
>- 所以，最佳的解决方案是,**将你要运行的程序以前台进程的形式运行，常见就是命令行模式，表示我还有交互操作，别中断** .  **先使用 `docker -it` , 后使用`ctrl+p+q`** 


## 前后台启动演示
### 前台交互式启动
```shell
docker run -it redis:6.0.8
```
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230427184935.png)


### 后台守护式启动
```shell
docker run -d redis:6.0.8
```

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230427185234.png)



## 查看容器日志
`docker logs 容器ID`


## 查看容器内运行的进程
`docker top 容器ID` 


## 查看容器内部细节
`docker inspect 容器ID`


## 进入正在运行的容器并以命令行交互

### exec
`docker exec -it 容器ID bashShell`

重新进入容器
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230428162238.png)



**查看 `exec` 的指令集**
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230427190129.png)



### attach
使用 `attach` 命令进入 ubuntu
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230428161817.png)


### exec 和 attach的区别
`attach` 直接进入容器启动命令的终端，不会启动新的进程用exit退出，会导致容器的停止。

`exec` 是在容器中打开新的终端，并且可以启动新的进程用exit退出，不会导致容器的停止。

**推荐大家使用 `docker exec` 命令，因为退出容器终端，不会导致容器的停止**。


### 进入Redis实例
```shell
[root@VM-8-10-centos ~]# docker run -d  redis
fa45e09c6ed621df7b213536b622f695853a1e1588e6dcd9e0cc400d664dde54
[root@VM-8-10-centos ~]#
[root@VM-8-10-centos ~]# docker ps
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS          PORTS      NAMES
fa45e09c6ed6   redis     "docker-entrypoint.s…"   4 seconds ago    Up 3 seconds    6379/tcp   beautiful_ishizaka
d04a503c06b9   ubuntu    "/bin/bash"              13 minutes ago   Up 13 minutes              festive_ellis
[root@VM-8-10-centos ~]#
[root@VM-8-10-centos ~]# docker exec -it fa45e09c6ed6 redis-cli
127.0.0.1:6379>
127.0.0.1:6379>
127.0.0.1:6379> ping
PONG
127.0.0.1:6379>
```


## 从文件内拷贝文件到主机
容器 -->  主机

```
docker cp  容器ID:容器内路径 目的主机路径
```


```shell
[root@VM-8-10-centos ~]# docker ps
CONTAINER ID   IMAGE     COMMAND       CREATED          STATUS          PORTS     NAMES
d04a503c06b9   ubuntu    "/bin/bash"   17 minutes ago   Up 17 minutes             festive_ellis

[root@VM-8-10-centos ~]# docker exec -it d04a503c06b9 /bin/bash
root@d04a503c06b9:/#
root@d04a503c06b9:/#
root@d04a503c06b9:/# mkdir TEST
root@d04a503c06b9:/# cd TEST/
root@d04a503c06b9:/TEST#
root@d04a503c06b9:/TEST#
root@d04a503c06b9:/TEST# echo "hello Docker" > test.txt
root@d04a503c06b9:/TEST# ll
total 12
drwxr-xr-x 2 root root 4096 Apr 28 08:32 ./
drwxr-xr-x 1 root root 4096 Apr 28 08:32 ../
-rw-r--r-- 1 root root   13 Apr 28 08:32 test.txt
root@d04a503c06b9:/TEST# exit
exit

[root@VM-8-10-centos ~]#
[root@VM-8-10-centos ~]#
[root@VM-8-10-centos ~]# docker cp d04a503c06b9:/TEST/test.txt ./
Successfully copied 2.05kB to /root/./
[root@VM-8-10-centos ~]#
[root@VM-8-10-centos ~]#
[root@VM-8-10-centos ~]# ll
total 12
-rw-r--r-- 2 root root  0 Apr 26 12:56 abc
-rw-r--r-- 1 root root 65 Apr 15 20:03 cmd.txt
-rw-r--r-- 2 root root  0 Apr 26 12:56 def
-rw-r--r-- 1 root root  4 Apr 26 12:36 emm.txt
-rw-r--r-- 1 root root 13 Apr 28 16:32 test.txt
[root@VM-8-10-centos ~]# cat test.txt
hello Docker
```



## 导出和导入容器

### export
export 导出容器的内容留作为一个tar归档文件

```
docker export 容器ID > 文件名.tar
```

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230428164143.png)



### import
import 从tar包中的内容创建一个新的文件系统再导入为镜像

```
cat 文件名.tar | docker import - 镜像用户/镜像名:镜像版本号
```

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230428165141.png)









