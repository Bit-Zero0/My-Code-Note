# 宏观原理

# 项目环境与技术栈

# 正排索引 和 倒排索引


# 准备数据源
从官网下载boost库数据源

我们的Linux服务器使用 [[linux常用命令#rz|rz指令]] 接受数据源 , 使用 tar -zxf 指令解包

在项目目录下创建目录data/input, input是专门存放我们需要处理的数据源的目录.
使用`cp -rf`指令拷贝数据源到input目录 `cp -rf boost_1_85_0/doc/html/* data/input/`

# 项目
# 编写数据去标签与数据清洗模块
编写Parser模块:


## centOS7 安装 boost库

`sudo yum install -y boost-devel`


## cppjieba
如何使用：注意细节，我们需要自己执行： `cd cppjieba; cp -rf deps/limonp include/cppjieba/`, 不然会编译报错

`ln -s cppjieba/dict dict`
`ln -s cppjieba/include inc`