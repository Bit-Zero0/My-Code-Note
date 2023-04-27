https://docs.docker.com/engine/install/centos/

我的系统是Centos7.6 
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230427164535.png)

# 前提条件
目前，CentOS 仅发行版本中的内核支持 Docker。Docker 运行在CentOS 7 (64-bit)上，
要求系统为64位、Linux系统内核版本为 3.8以上，这里选用Centos7.6

 
## 查看自己的内核
uname命令用于打印当前系统相关信息（内核版本号、硬件架构、主机名称和操作系统类型等）。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230427164743.png)



# centos安装Docker
## 确定你是CentOS7及以上版本
```shell
cat /etc/redhat-release
```


## 卸载旧版本
https://docs.docker.com/engine/install/centos/

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230427165151.png)


## yum安装gcc相关
[[gcc与g++的使用#gcc升级|gcc安装与升级]]


## 安装需要的软件包
```bash
yum install -y yum-utils
```


## 设置stable镜像仓库
官网要求
```shell
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
```

阿里云(推荐)
```shell
yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```


如果使用 阿里云镜像库无法成功下载,那就使用 官网提供的.


## 设置yum软件包索引
```shell
yum makecache fast
```

## 安装Docker CE
```shell
yum -y install docker-ce docker-ce-cli containerd.io
```

## 启动docker
```shell
systemctl start docker
```


# 测试
## 查看版本
```shell
docker version
```

```shell
[root@VM-8-10-centos ~]# docker version
Client: Docker Engine - Community
 Version:           23.0.5
 API version:       1.42
 Go version:        go1.19.8
 Git commit:        bc4487a
 Built:             Wed Apr 26 16:18:56 2023
 OS/Arch:           linux/amd64
 Context:           default

Server: Docker Engine - Community
 Engine:
  Version:          23.0.5
  API version:      1.42 (minimum version 1.12)
  Go version:       go1.19.8
  Git commit:       94d3ad6
  Built:            Wed Apr 26 16:16:35 2023
  OS/Arch:          linux/amd64
  Experimental:     false
 containerd:
  Version:          1.6.20
  GitCommit:        2806fc1057397dbaeefbea0e4e17bddfbd388f38
 runc:
  Version:          1.1.5
  GitCommit:        v1.1.5-0-gf19387a
 docker-init:
  Version:          0.19.0
  GitCommit:        de40ad0
```


## hello world
```shell
docker run hello-world
```

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230427170442.png)


# 卸载
```shell
systemctl stop docker

yum remove docker-ce docker-ce-cli containerd.io

rm -rf /var/lib/docker

rm -rf /var/lib/containerd
```