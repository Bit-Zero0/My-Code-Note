
# centos
## 静态库 与 静态链接
```shell
sudo yum install glibs-static
```

```shell
sudo yum install libstdc++-static
```



## telnet安装
centos、ubuntu安装telnet命令的方法.
```shell
yum list telnet*              列出telnet相关的安装包
yum install telnet-server          安装telnet服务
yum install telnet.*           安装telnet客户端
```

## centos stream9 安装gcc

```shell
sudo yum -y install gcc gcc-c++ kernel-devel
```

## centos 7 升级gcc
[[gcc与g++的使用#gcc升级]]