**方法一：**
我们是通过yum安装的mysql，所以mysql的头文件和动静态库，我们都是拥有的。如果只有动静态库， 但是没有头文件可以看这篇文章[Linux Centos7 找不到mysql.h文件（转） - 混元真人 - 博客园 (cnblogs.com)](https://www.cnblogs.com/huojing/articles/16419671.html)

==本次主要使用的方式就是**方法一**==。

**方法二**：
可以去[官网]([MySQL :: MySQL Community Downloads](https://dev.mysql.com/downloads/))下载适合自己平台的MySQL接口库进行链接。
如果是 .tar.gz后缀结尾的压缩包，可以使用以下命令
```shell
tar -xzf 文件名
```
解压后，就可以得到相关库个头文件了，使用[[Linux文件系统#硬链接 and 软链接|软硬连接]]  连接到项目中即可。


# 库与头文件
## 头文件在哪？
使用 [[linux常用命令#find|find命令]]
```
find / -name mysql.h
```

结果：
如果找不到`mysql.h`，请看文章：[Linux Centos7 找不到mysql.h文件（转） - 混元真人 - 博客园 (cnblogs.com)](https://www.cnblogs.com/huojing/articles/16419671.html)
```sh
/usr/include/mysql/mysql.h
```
可以看到我们的头文件在此路径 `/usr/include/mysql`中


## 库在哪里？
使用 [[linux常用命令#find|find命令]] 
```sql
find / -name *mysqlclient*
```

结果：
```shell
/usr/lib64/mysql/libmysqlclient.so.21
/usr/lib64/mysql/libmysqlclient.so.18
/usr/lib64/mysql/libmysqlclient_r.so.18.1.0
/usr/lib64/mysql/libmysqlclient.so.18.1.0
/usr/lib64/mysql/libmysqlclient.a
/usr/lib64/mysql/libmysqlclient.so.21.2.31
/usr/lib64/mysql/libmysqlclient.so
/usr/lib64/mysql/libmysqlclient_r.so.18
```
可以看到我们的 库在 此路径 `/usr/lib64/mysql`中


# 尝试链接
**makefile 文件**
[[Linux动静态库]]
```makefile
mysql_test:test.cc
    g++ -o $@ $^ -std=c++11  -I/usr/include/mysql -L/usr/lib64/mysql -lmysqlclient

.PHONY:clean
clean:
    rm -f mysql_test
```
>`-L` 指明库文件搜索路径
>`-l` 指明要链接哪一个库
>`-I` 指明头文件搜索路径 


**尝试链接mysql client**
通过 `mysql_get_client_info()` 函数，来验证我们的引入是否成功
```sql
#include <iostream>
#include <mysql/mysql.h>

int main()
{
	std::cout <<"mysql client version :" << mysql_get_client_info() <<std::endl
	return 0;
}
```
连接成功:
![[Pasted image 20221124165022.png]]


# mysql接口介绍
## mysql_init()
要使用库，必须先进行初始化！
```c
MYSQL* mysql_init(MYSQL *mysql);
```
这个函数用来分配或者初始化一个MYSQL句柄，用于连接mysql服务端。如果你传入的参数是NULL指针，它将自动为你分配一个MYSQL对象。

如：`MYSQL* mfp = mysql_init(nullptr);`

**注意：不使用MySQL时，一定要使用 `mysql_close()` 关闭此指针，避免野指针现象。**

## mysql_real_connect()
初始化完毕之后，必须先链接数据库，在进行后续操作。（mysql网络部分是基于TCP/IP的）
```c
MYSQL *mysql_real_connect(MYSQL *mysql, 
						  const char *host,
	                      const char *user,
	                      const char *passwd,
	                      const char *db,
	                      unsigned int port,
	                      const char *unix_socket, 
	                      unsigned long clientflag);
```
- 第一个参数 `MYSQL`是 C api中一个非常重要的变量（`mysql_init()`的返回值），里面内存非常丰富，有`port`,`dbname`,`charset`等连接基本参数。它也包含了一个叫 `st_mysql_methods`的结构体变量，该变量里面保存着很多函数指针，这些函数指针将会在数据库连接成功以后的各种数据操作中被调用。
- mysql_real_connect函数中各参数，基本都是顾名思意。


## mysql_query()
用于下发mysql命令
```c
int mysql_query(MYSQL *mysql, const char *q);
```
- 第一个参数上面已经介绍过
- 第二个参数为要执行的sql语句,如“select * from table”。


## mysql_store_result()
获取执行结果

sql执行完以后，如果是查询语句，我们当然还要读取数据，如果**update**，**insert**等语句，那么就看下操作成功与否即可。

我们来看看如何获取查询结果： 如果`mysql_query()`返回成功，那么我们就通过`mysql_store_result()`这个函数来读取结果。
原型如下：
```c
MYSQL_RES *mysql_store_result(MYSQL *mysql);
```
该函数会调用MYSQL变量中的`st_mysql_methods`中的 `read_rows` **函数指针**来获取查询的结果。同时该函数会返回`MYSQL_RES` 这样一个变量，该变量主要用于保存查询的结果。
同时该函数**malloc**了一片内存空间来存储查询过来的数据，所以我们**一定要记得 `mysql_free_result(result)`**，不然是肯定会造成内存泄漏的。 执行完`mysql_store_result`以后，其实数据都已经在`MYSQL_RES` 变量中了


下面的api基本就是读取`MYSQL_RES` 中的数据。

## mysql_num_rows()
获取结果行数
```c
my_ulonglong mysql_num_rows(MYSQL_RES *res);
```


## mysql_num_ﬁelds()
获取结果列数
```c
unsigned int mysql_num_fields(MYSQL_RES *res);
```


## mysql_fetch_ﬁelds
获取列名
```c
MYSQL_FIELD *mysql_fetch_fields(MYSQL_RES *res);
```

如：
```cpp
int fields = mysql_num_fields(res);
MYSQL_FIELD *field = mysql_fetch_fields(res); 

for(int i = 0; i < fields; i++){
	cout<<field[i].name<<" "; 
}
cout<<endl;
```


## mysql_fetch_row()
获取结果内容
```c
MYSQL_ROW mysql_fetch_row(MYSQL_RES *result);
```
它会返回一个MYSQL_ROW变量，MYSQL_ROW其实就是`char **`. 就当成一个二维数组来用吧。

如：
```sql
for(int i = 0 ; i < rows ; i++)
{
	MYSQL_ROW line = mysql_fetch_row(result);
	for(int j = 0 ; j < cols; j++)
	{
		std::cout << line[j] << '\t';
	}
	std::cout << std::endl;
}
```

## mysql_close()
关闭mysql链接
```c
void mysql_close(MYSQL *sock);
```


## 其他接口
mysql C api还支持事务等常用操作，大家下来自行了解:
```c
my_bool STDCALL mysql_autocommit(MYSQL * mysql, my_bool auto_mode); 

my_bool STDCALL mysql_commit(MYSQL * mysql);

my_bool STDCALL mysql_rollback(MYSQL * mysql);
```



# 案例
```cpp
#include <iostream>
#include <mysql/mysql.h>
#include <string>
#include <cstdio>

const std::string host = "127.0.0.1";
const std::string user = "root";
const std::string password = "panda7671773";
const std::string db = "mydb";
const unsigned int  port = 3306;

int main()
{
    std::cout <<"mysql client version :" << mysql_get_client_info() <<std::endl;

    //0. 创建mysql句柄
    MYSQL* my = mysql_init(nullptr);

	//1. 链接数据库
    if(mysql_real_connect(my , host.c_str() , user.c_str(), password.c_str() ,db.c_str() , port , nullptr , 0 ) == nullptr )
    {
        std::cout << "connect failed" << std::endl;
        return 1;
    }

	//1.1: 需要设置链接的编码格式
    mysql_set_character_set(my , "utf8");
    std::cout << "connect success" << std::endl;

	//2. 访问 数据库.test id, name
    //std::string sql = "create table emm(id int  primary key , name varchar(20))";
    std::string sql = "select * from emm";

	//2.1 select 其实是最不好处理的！！select sql执行完，只是第一步，还需要对数据进一步解析！
    //std::string sql = "select name from emm  where id = 4";
    int code = mysql_query(my , sql.c_str()); //返回0表示成功
    if(code != 0)
    {
        std::cout << "execute: " << sql << " failed" << std::endl;
        return 2;
    }
    std::cout << "execut: "<< sql << "success" << std::endl;

	//2.2 解析数据 -- 获取行号和列号
    MYSQL_RES* result = mysql_store_result(my);
    int rows = mysql_num_rows(result);
    int cols = mysql_num_fields(result);
    std::cout << "行数: " << rows << ", 列数: " << cols << std::endl;

	//2.3 解析数据 -- 获取表中列名 -- 一般不用，仅仅是为了测试代码的完整性
    MYSQL_FIELD* fields = mysql_fetch_field(result);
    for(int i = 0 ; i < cols ; i++)
    {
        std::cout << fields[i].name << '\t';
    }
    std::cout << std::endl;

	//2.4 解析数据 -- 获取表中的数据 -- 重要
    for(int i = 0 ; i < rows ; i++)
    {
        MYSQL_ROW line = mysql_fetch_row(result);//获取完整的一行记录[可能包含了多列]
        for(int j = 0 ; j < cols; j++)
        {
            std::cout << line[j] << '\t';//将记录内部的多列字符串依次打印！
        }
        std::cout << std::endl;
    }

	//3. 关闭数据库
    mysql_free_result(result);
    mysql_close(my);
    return 0;
}
```

运行结果：
![[Pasted image 20221124172345.png]]


# 引用文章
[Linux Centos7 找不到mysql.h文件（转） - 混元真人 - 博客园 (cnblogs.com)](https://www.cnblogs.com/huojing/articles/16419671.html)