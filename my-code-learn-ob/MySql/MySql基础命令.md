# 数据存储逻辑
![[Pasted image 20221114182118.png]]
行 有一个术语 ：**一条数据**。


# SQL分类
## DDL【data definition language】数据定义语言，
用来维护存储数据的结构代表指令: `create`，`drop`，`alter`

## DML【data manipulation language】数据操纵语言
用来对数据进行操作代表指令: `insert` , `delete` , `update`。
	- DML中又单独分了一个==**DQL，数据查询语言**==，代表指令: `select`

## DCL【Data contro1 Language】数据控制语言
主要负责权限管理和事务代表指令: `grant` , `revoke`，`commit`


# 基础使用命令
## 创建数据库
```sql
create database 库名
```

## 使用数据库
```sql
use 库名
```

## 创建数据表
```sql
create table 表名(
	字段名 数据类型
)
```

## SHOW DATABASES 
返回可用数据库的一个列表。包含在这个列表中的可能是MySQL内部使用的数据库
![[Pasted image 20221114180734.png]]


## SHOW TABLES
返回当前选择的数据库内可用表的列表。
![[Pasted image 20221114181201.png]]



==SHOW也可以用来显示表列 ， 但是也可以用DESC命令来代替== 
`SHOw COLUMNS FROM 表名`    或 ` desc 表名`
![[Pasted image 20221114181329.png]]



## SHOW CREATE DATABASE 和 SHOW CREATE TABLE
分别用来显示创建特定数据库或表的MySQL语句；



# 库的操作
## 创建数据库
```sql
CREATE DATABASE[IF NOT EXISTS] db_name [create_specification [，create_specification]...J;

create_specification:
	[DEFAULT] CHARACTER SET charset_name
	[DEFAULT] COLLATE co11ation_name
```

==说明:==
- 大写的表示关键字 ;(注意:mysql本身不区分大小写，所以关键字也可以使用小写)
- `[]`是可选项
- **CHARACTER SET**:指定数据库采用的字符集. 
- **COLLATE**:指定数据库字符集的校验规则


## 创建数据库案例
创建名为db1的数据库
```sql
create database db1;
```
>说明:当我们创建数据库没有指定字符集和校验规则时，**系统使用默认字符集: utf8**，**校验规则是: utf8_general_ci**

创建一个使用utf8字符集的db2数据库
```sql
create database db2 charset=utf8;
```

创建一个使用utf字符集，并带校对规则的db3数据库。
```sql
create database db3 charset=utf8 collate utf8_general_ci;
```


## 字符集和校验规则
### 查看系统默认字符集以及校验规则
分别有两条SQL语句：
```sql
show variables like 'character-set_database';

show variables like 'collation_database';
```

### 查看数据库支持的字符集
```sql
show charset;
```


### 校验规则对数据库的影响
#### 不区分大小写
创建一个数据库， 校验规则使用 `utf_general_ci`  , 使用该校验规则时，数据库**不区分大小写**。
```sql
create database test1 co11ate utf8_general_ci;

use test1;

create table person(name varchar(20));

insert into person values ('a');
insert into person values('A');
insert into person values('b');
insert into person values('B');
```

结果排序：
```sql
mysql> use test1;
mysql> select * from person order by name; 
+------+
| name | 
+------+ 
| a    | 
| A    | 
| b    | 
| B    | 
+------+
```

查询结果：
```sql
mysql> select * from person where name='a'; 
+------+
| name | 
+------+ 
| a    | 
| A    | 
+------+
2 rows in set (0.01 sec)
```




#### 区分大小写
创建一个数据库，校验规则使用`utf8_ bin`使用该校验规则时，数据库**区分大小写**。
```sql
create database test2 co11ate utf8_bin;

use test2

create table person(name varchar(20));

insert into person values('a');
insert into person values('A');
insert into person values('b');
insert into person values('B');
```

结果排序：
```sql
mysql> use test2;
mysql> select * from person order by name; 
+------+
| name | 
+------+ 
| A    | 
| B    | 
| a    | 
| b    | 
+------+
```


查询结果：
```sql
mysql> use test2;
mysql> select * from person where name='a'; 
+------+
| name | 
+------+ 
| a    | 
+------+
2 rows in set (0.01 sec)
```

## 操纵数据库
### 查看数据库
```sql
show databases;
```


### 显示创建语句
```sql
show create database 库名;
```
![[Pasted image 20221114190457.png]]
说明：
- MySQL 建议我们关键字使用大写，但是不是必须的。
- 数据库名字的反引号``,是为了防止使用的数据库名刚好是关键字
- `/*!40100 default.... */` 这个不是注释，表示当前mysql版本大于4.01版本，就执行这句话


### 修改数据库
语法：
```sql
ALTER DATABASE db_name
[alter_spacification [,alter_spacification]...] 

alter_spacification:
	[DEFAULT] CHARACTER SET charset_name 
	[DEFAULT] COLLATE collation_name
```
说明：
- 对数据库的修改主要指的是修改数据库的字符集，校验规则


实例：将 mytest 数据库字符集改成 **gbk**
```sql
mysql> alter database mytest charset=gbk; 
Query OK, 1 row affected (0.00 sec)

mysql> show create database mytest;
+----------+----------------------------------------------------------------+
| Database | Create Database                                                |
+----------+----------------------------------------------------------------+ 
| mytest | CREATE DATABASE `mytest` /*!40100 DEFAULT CHARACTER SET gbk */   | 
+----------+----------------------------------------------------------------+
```


### 数据库删除
```sql
DROP DATABASE [IF EXISTS] 库名;
```
执行删除之后的结果:
- 数据库内部看不到对应的数据库
-  对应的数据库文件夹被删除，级联删除，里面的数据表全部被删

==**注意：不要随意删除数据库**==



## 查看连接情况
查看有那些用户连接到了我们的MySQL。
```sql
show processlist;
```

```sql
mysql> show processlist;
+----+------+-----------+------+---------+------+-------+------------------+
| Id | User | Host      | db   | Command | Time | State | Info             |
+----+------+-----------+------+---------+------+-------+------------------+
|  2 | root | localhost | test | Sleep   | 1386 |       | NULL             |
+----+------+-----------+------+---------+------+-------+------------------+
|  3 | root | localhost | NULL | Query   |    0 | NULL | show processlist  | 
+----+------+-----------+------+---------+------+-------+------------------+
```
可以告诉我们当前有哪些用户连接到我们的MySQL，如果查出某个用户不是你正常登陆的，很有可能你的数据库被人入侵了。以后大家发现自己数据库比较慢时，可以用这个指令来查看数据库连接情况。

# 表的操作

## 创建表
语法：
```sql
CREATE TABLE table_name (
	field1 datatype,
	field2 datatype,
	field3 datatype
) character set 字符集 collate 校验规则 engine 存储引擎;
```
说明：
- ﬁeld 表示列名 
- ==datatype== 表示列的类型
- ==character set 字符集==，如果没有指定字符集，则以所在数据库的字符集为准 
- ==collate 校验规则==，如果没有指定校验规则，则以所在数据库的校验规则为准
- ==engine 存储引擎==: 如果没有指定存储引擎，则默认 **Innodb**


## 创建表实例
```sql
create  table  users ( 
	id int,
	name varchar(20) comment '用户名',
	password char(32) comment '密码是32位的md5值', 
	birthday date comment '生日'
) character set utf8 engine MyISAM;
```
说明:
- 不同的存储引擎，创建表的文件不一样。
	- users表存储引擎是MyISAM，在数据目中有三个不同的文件，分别是:
		-  **users.frm**:表结构
		- **users.MYD**:表数据
		- **users.MYI**:表索引
![[Pasted image 20221114192424.png]]
备注：创建一个engine是innodb的数据库，观察存储目录


## 查看表结构
语法：
```sql
desc 表名;
```

示例：
![[Pasted image 20221114192806.png]]


## 修改表
在项目实际开发中，经常修改某个表的结构，比如字段名字，字段大小，字段类型，表的字符集类型，表的存储引擎等等。我们还有需求，添加字段，删除字段等等。这时我们就需要修改表。
```sql
#添加一个字段
ALTER TABLE  tablename ADD (column datatype [DEFAULT expr][,column datatype]...); 

#修改字段
ALTER TABLE tablename MODIFY (column datatype [DEFAULT expr][,column datatype]...);

#删除字段
ALTER TABLE  tablename DROP (column);
```
### 案例
- ==在users表添加二条记录==
```sql
mysql> insert into users values(1,'a','b','1982-01-04'),(2,'b','c','1984-01-04');
```

- ==在users表添加一个字段，用于保存图片路径==
```sql
mysql> alter table users add assets varchar(100) comment '图片路径' after birthday;
```

```sql
mysql> desc users;
+----------+--------------+------+-----+---------+-------+ 
| Field   | Type         | Null | Key | Default | Extra | 
+----------+--------------+------+-----+---------+-------+
| id       | int(11)      | YES  |     | NULL    |       | 
| name     | varchar(20)  | YES  |     | NULL    |       | 
| password | char(32)     | YES  |     | NULL    |       | 
| birthday | date         | YES  |     | NULL    |       | 
| assets   | varchar(100) | YES  |     | NULL    |       | 
+----------+--------------+------+-----+---------+-------+
```
插入新字段后，对原来表中的数据没有影响：
```sql
mysql> select * from users;
+------+------+----------+------------+-------+ 
| id   | name | password | birthday   |assets |
+------+------+----------+------------+-------+
|    1 | a    | b        | 1982-01-04 | NULL  |<= 原来的数据仍然存在 
|    2 | b    | c        | 1984-01-04 | NULL  |
+------+------+----------+------------+-------+
```


- ==修改name，将其长度改成60==
```sql
mysql> alter table users modify name varchar(60);
```
![[Pasted image 20221114212830.png]]

- ==删除password列==
>注意：删除字段一定要小心，删除字段及其对应的列数据都没了
![[Pasted image 20221114212927.png]]


- ==修改表名为employee==
```sql
mysql> alter table users rename to employee;
```
to：可以省掉
```sql
mysql> select * from employee;
+------+------+------------+-------+ 
| id   | name | birthday   | assets|
+------+------+------------+-------+ 
|    1 | a    | 1982-01-04  | NULL | 
|    2 | b    | 1984-01-04  | NULL | 
+------+------+------------+-------+
```

- ==将name列修改为xingming==
```sql
mysql> alter table employee change name xingming varchar(60); --新字段需要完整定义
```

```sql
mysql> desc employee;
+----------+--------------+------+-----+---------+-------+ 
| Field   | Type         | Null | Key | Default | Extra | 
+----------+--------------+------+-----+---------+-------+
| id       | int(11)      | YES  |     | NULL    |       | 
| xingming | varchar(60)  | YES  |     | NULL    |       | 
| birthday | date         | YES  |     | NULL    |       | 
| assets   | varchar(100) | YES  |     | NULL    |       | 
+----------+--------------+------+-----+---------+-------+
```


## 删除表
语法：
```sql
DROP [TEMPORARY] TABLE [IF EXISTS] tbl_name [, tbl_name] ...
```

示例：
```sql
drop table t1;
```