Centos 7默认gcc版本为4.8，有时需要更高版本的

使用 `gcc -v` 指令查看当前 gcc版本
```shell
gcc -v
```

安装scl
```shell
$ sudo yum install centos-release-scl scl-utils-build
```

安装新版本gcc，这里也可以把7换成8或者9，我用的是7，也可以都安装
```shell
$ sudo yum install -y devtoolset-7-gcc devtoolset-7-gcc-c++
```

**启动： 细节，命令行启动只能在本会话有效**
```shell
$ scl enable devtoolset-7 bash
$ gcc -v
```

可选：如果想每次登陆的时候，都是较新的gcc，需要把上面的命令添加到你的`~/.bash_profile`中
```shell
#根据自己的gcc版本添加下面的命令，每次启动的时候，都会执行这个scl命令
scl enable devtoolset-7 bash
#or
scl enable devtoolset-8 bash
#or
scl enable devtoolset-9 bash
```