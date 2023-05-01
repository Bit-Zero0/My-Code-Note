# 是什么

**一句话:有点类似我们Redis里面的rdb和aof文件**

==**也就是将docker容器内的数据保存进宿主机的磁盘中**==


运行一个带有容器卷存储功能的容器实例
```shell
 docker run -it --privileged=true -v /宿主机绝对路径目录:/容器内目录      镜像名
```

**坑：容器卷记得加入**: `--privileged=true`

为什么需要加 `--privileged=true` 这个参数
>Docker挂载主机目录访问如果出现cannot open directory .: Permission denied
>解决办法：在挂载目录后多加一个`--privileged=true`参数即可
>
>如果是CentOS7安全模块会比之前系统版本加强，不安全的会先禁止，所以目录挂载的情况被默认为不安全的行为
>在SELinux里面挂载目录被禁止掉了额，如果要开启，我们一般使用--privileged=true命令，扩大容器的权限解决挂载目录没有权限的问题，也即使用该参数，container内的root拥有真正的root权限，否则，container内的root只是外部的一个普通用户权限。



# 作用
将运用与运行的环境打包镜像，run后形成容器实例运行 ，但是我们对数据的要求希望是**持久化的**
 
Docker容器产生的数据，如果不备份，那么当容器实例删除后，容器内的数据自然也就没有了。
为了能保存数据在docker中我们使用卷。
 
==**特点：**==
1. 数据卷可在容器之间共享或重用数据
2. 卷中的更改可以直接实时生效，爽

1. 数据卷中的更改不会包含在镜像的更新中
2. 数据卷的生命周期一直持续到没有容器使用它为止



# 数据卷案例

## 宿主vs容器之间映射添加容器卷
公式:
```shell
docker run -it --privileged=true -v /宿主机目录:/容器内目录 ubuntu /bin/bash
```



![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230501155357.png)


### 查看数据卷是否挂载成功
使用 [[Docker常见命令#查看容器内部细节|docker inspect 容器ID]] 命令中的 Mounts数据项 查看数据卷是否挂载成功 

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230501155620.png)


### 容器和宿主机之间的数据共享
#### docker修改，主机同步获得 
这问题上图已经验证
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230501155357.png)


#### 主机修改，docker同步获得
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230501160705.png)



#### docker容器stop，主机修改，docker容器重启看数据是否同步
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230501161149.png)



## 读写规则映射添加说明
### 读写
```shell
 docker run -it --privileged=true -v /宿主机绝对路径目录:/容器内目录:rw   镜像名
```
上面的案例默认都是读写的


### 只读
容器实例内部被限制，只能读取不能写
```shell
docker run -it --privileged=true -v /宿主机绝对路径目录:/容器内目录:ro 镜像名
```
`ro == read only`

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230501191540.png)

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230501192454.png)




## 卷的继承和共享
```shell
docker run -it  --privileged=true --volumes-from 父类  --name u2 ubuntu
```

使用`ubuntu2`来继承`ubuntu1`的数据卷
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230501212030.png)

那 `ubuntu1` 容器被删除会怎么样
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230501212515.png)







