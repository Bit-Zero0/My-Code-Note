# MyBatis是什么?
MyBatis是一款优秀的持久层框架，它支持自定义SQL、存储过程以及高级映射。MyBatis 去除了几乎所有的JDBC代码以及设置参数和获取结果集的工作。MyBatis可以通过简单的XML或注解来配置和映射原始类型、接口和Java POJO (Plain Old Java Objects，普通老式Java对象)为数据库中的记录。

简单来说MyBatis是更简单完成程序和数据库交互的工具，也就是更简单的操作和读取数据库工具。

# 为啥要学MyBatis?
对于后端开发来说，程序是由以下两个重要的部分组成的：
1. 后端程序
2. 数据库
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230521212405.png)
而这两个重要的组成部分要通讯，就要依靠数据库连接工具，那数据库连接工具有哪些?比如之前我们学习的JDBC，还有今天我们将要介绍的MyBatis，那已经有了JDBC了，为什么还要学习MyBatis?
这是因为JDBC的操作太繁琐了，我们回顾一下[[Java的JDBC编程|JDBC]]的操作流程∶
1. 创建数据库连接池 DataSource
2. 通过DataSource获取数据库连接 Connection
3. 编写要执行带?占位符的SQL语句
4. 通过 Connection及SQL创建操作命令对象Statement
5. 替换占位符:指定要替换的数据库字段类型，占位符索引及要替换的值
6. 使用Statement 执行 SQL语句
7. 查询操作:返回结果集 ResultSet，更新操作:返回更新的数量
8. 处理结果集
9. 释放资源

上面的整个操作在实际的生产环境中非常的繁琐, 从上述代码和操作流程可以看出，对于JDBC来说，整个操作非常的繁琐，我们不但要拼接每一个参数，而且还要按照模板代码的方式，一步步的操作数据库，并且在每次操作完，还要手动关闭连接等，而所有的这些操作步骤都需要在每个方法中重复书写.
而我们学习MyBatis的真正原因, 它可以帮助我们更方便 , 更快速的操作数据库.


# MyBatis查询流程
开始搭建MyBatis之前，我们先来看一下MyBatis在整个框架中的定位，框架交互流程图:
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230521224952.png)
MyBatis也是一个ORM框架，ORM (Object Relational Mapping) ，即对象关系映射。在面向对象编程语言中，将关系型数据库中的数据与对象建立起映射关系，进而自动的完成数据与对象的互相转换:
1. 将输入数据(即传入对象)+SQL映射成原生SQL
2. 将结果集映射为返回对象，即输出对象

**ORM把数据库映射为对象**:
- 数据库表(table) -->类(class)
- 记录(record，行数据)-->对象(object)
- 字段(field)-->对象的属性(attribute)

一般的ORM 框架，会将数据库模型的每张表都映射为一个Java类。
也就是说使用MyBatis 可以像操作对象一样来操作数据库中的表，可以实现对象和数据库表之间的转换，接下来我们来看MyBatis 的使用吧。

# 在项目中引入MyBatis
1. ***新项目中添加 MyBatis框架***
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230521211903.png)

2. ***配置数据库连接信息***
在 `application.properties` 或 `application.yml`中配置连接信息

application.properties
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/myblog?characterEncoding=utf8&useSSL=false  
spring.datasource.username=root  
spring.datasource.password=""  
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# mybatis 中的 Mapper.xml的保存路径  
mybatis.mapper-locations=classpath:mybatis/*Mapper.xml
```

application.yml
```yml
spring:  
  datasource:  
    url: jdbc:mysql://localhost:3306/myblog?characterEncoding=utf8&useSSL=false  
    username: root  
    password: ""  
    driver-class-name: com.mysql.cj.jdbc.Driver

#mybatis 中的 Mapper.xml的保存路径  
mybatis:  
  mapper-locations: classpath:mybatis/*Mapper
```

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230521215135.png)





















