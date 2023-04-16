
# 安装
本个专题注意使用 CentOs7.6来学习 mysql。

主要看这两篇博客即可
[CentOS 7.6下yum安装MySQL 8.0版本图文教程 - 腾讯云开发者社区-腾讯云 (tencent.com)](https://cloud.tencent.com/developer/article/2076339)

[Centos7.6安装Mysql_搬砖工李日兴的技术博客_51CTO博客](https://blog.51cto.com/lirixing/4914033)


## public key 报错
使用yum -y install mysql-community-server安装mysql时候提示：
```
The GPG keys listed for the “MySQL 5.7 Community Server” repository are already installed but they are not correct for this package.
Check that the correct key URLs are configured for this repository.

Failing package is: mysql-community-libs-compat-5.7.37-1.el7.x86_64
GPG Keys are configured as: file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql
```

原因是Mysql的GPG升级了，需要重新获取  
使用以下命令即可
```
rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2022
```

## 获取初始密码
```shell
grep 'temporary password' /var/log/mysqld.log | awk '{print $NF}'
```


# 问题解决
[解决GPG key retrieval failed: [Errno 14] curl#37 问题_Kun_Zhou_的博客-CSDN博客](https://blog.csdn.net/qq_35009393/article/details/124784443)

[【已解决】【Mysql8.0】ERROR 1820 (HY000): You must reset your password using ALTER USER statement_wingrez的博客-CSDN博客](https://blog.csdn.net/wingrez/article/details/99825144)

## 更改密码
[MySQL 8.0 设置简单密码报错ERROR 1819 (HY000): Your password does not satisfy the current policy requirements_数据库技术_Linux公社-Linux系统门户网站 (linuxidc.com)](https://www.linuxidc.com/Linux/2019-08/160317.htm)


# 文件配置
**/etc/my.cnf**  的配置
```
[mysqld]
# 设置3306端口
port=3306


# 允许最大连接数
max_connections=10000
# 允许连接失败的次数。这是为了防止有人从该主机试图攻击数据库系统
max_connect_errors=10

# 服务端使用的字符集默认为UTF8
character-set-server=utf8
# 创建新表时将使用的默认存储引擎
default-storage-engine=INNODB

[mysql]
# 设置mysql客户端默认字符集
default-character-set=utf8

[client]
default-character-set=utf8
```