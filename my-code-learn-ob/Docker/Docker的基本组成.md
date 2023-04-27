
**Docker主要由三大部分组成: ==镜像(image)== , ==容器(container)== ,  ==仓库(repository)== **

# 镜像(image)
**Docker 镜像**(Image)就是一个**只读**的模板。镜像可以用来创建 Docker 容器，一个镜像可以创建很多容器。

它也相当于是一个root文件系统。比如官方镜像 centos:7 就包含了完整的一套 centos:7 最小系统的 root 文件系统。

相当于容器的“源代码”，**docker镜像文件类似于Java的类模板，而docker容器实例类似于java中new出来的实例对象**。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230427162543.png)



# 容器(container)
==**从面向对象角度**==
Docker 利用容器（Container）独立运行的一个或一组应用，应用程序或服务运行在容器里面，容器就类似于一个虚拟化的运行环境，**容器是用镜像创建的运行实例**。就像是Java中的类和实例对象一样，镜像是静态的定义，容器是镜像运行时的实体。容器为镜像提供了一个标准的和隔离的运行环境，它可以被启动、开始、停止、删除。每个容器都是相互隔离的、保证安全的平台
 
==**从镜像容器角度**==
**可以把容器看做是一个简易版的 Linux 环境**（包括root用户权限、进程空间、用户空间和网络空间等）和运行在其中的应用程序。



# 仓库(repository)
仓库（Repository）是**集中存放镜像文件的场所**。
 
类似于
>Maven仓库，存放各种jar包的地方；
>github仓库，存放各种git项目的地方；
>Docker公司提供的官方registry被称为Docker Hub，存放各种镜像模板的地方。
 
仓库分为公开仓库（Public）和私有仓库（Private）两种形式。
最大的公开仓库是 Docker Hub(https://hub.docker.com/)，
存放了数量庞大的镜像供用户下载。国内的公开仓库包括阿里云 、网易云等


# 小总结
需要正确的理解仓库/镜像/容器这几个概念:
>Docker 本身是一个容器运行载体或称之为管理引擎。我们把应用程序和配置依赖打包好形成一个可交付的运行环境，这个打包好的运行环境就是image镜像文件。只有通过这个镜像文件才能生成Docker容器实例(类似Java中new出来一个对象)。
 
image文件可以看作是容器的模板。Docker 根据 image 文件生成容器的实例。同一个 image 文件，可以生成多个同时运行的容器实例。


==镜像文件==
*  image 文件生成的容器实例，本身也是一个文件，称为镜像文件。

==容器实例==
*  一个容器运行一种服务，当我们需要的时候，就可以通过docker客户端创建一个对应的运行实例，也就是我们的容器

==仓库==
* 就是放一堆镜像的地方，我们可以把镜像发布到仓库中，需要的时候再从仓库中拉下来就可以了。


# Docker平台架构图解

## Docker平台架构图解(入门版)
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230427163021.png)

Docker是一个Client-Server结构的系统，Docker守护进程运行在主机上， 然后通过Socket连接从客户端访问，守护进程从客户端接受命令并管理运行在主机上的容器。 **容器，是一个运行时环境，就是我们前面说到的集装箱**。可以对比mysql演示对比讲解
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230427163050.png)


## Docker平台架构图解(架构版)
Docker是一个C/S模式的架构，后端是一个松耦合架构，众多模块各司其职。Docker运行的基本流程为:

1. 用户是使用Docker Client与 Docker Daemon建立通信，并发送请求给后者。
2. Docker Daemon作为Docker架构中的主体部分，首先提供Docker Server的功能使其可以接受Docker Client的请求。
3. Docker Engine执行Docker内部的一系列工作，每一项工作都是以一个Job的形式的存在。
4. Job的运行过程中，当需要容器镜像时，则从Docker Registry中下载镜像，并通过镜像管理驱动Graph driver将下载镜像以Graph的形式存储。
5. 当需要为Docker创建网络环境时，通过网络管理驱动Network driver创建并配置Docker容器网络环境。
6. 当需要限制Docker容器运行资源或执行用户指令等操作时，则通过Exec driver 来完成。
7. Libcontainer是一项独立的容器管理包，Network driver以及Exec driver都是通过Libcontainer来实现具体对容器进行的操作。
 ![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230427164052.png)
