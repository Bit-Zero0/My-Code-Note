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
也就是说使用MyBatis 可以像操作对象一样来操作数据库中的表，可以实现对象和数据库表之间的转换.

接下来我们来看MyBatis 的使用吧。

# 在项目中引入MyBatis
## 新项目引入MyBatis
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
    password: 12345 #有些MySQL版本需要加 ""
    driver-class-name: com.mysql.cj.jdbc.Driver

#mybatis 中的 Mapper.xml的保存路径  
mybatis:  
  mapper-locations: classpath:mybatis/*Mapper
```

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230521215135.png)

## 老项目引入MyBatis
如果是在老项目中新增功能，添加框架支持：
```xml
<!-- 添加 MyBatis 框架 -->
<dependency>
	<groupId>org.mybatis.spring.boot</groupId>
	<artifactId>mybatis-spring-boot-starter</artifactId>
	<version>2.1.4</version>
</dependency>

<!-- 添加 MySQL 驱动 -->
<dependency>
	<groupId>mysql</groupId>
	<artifactId>mysql-connector-java</artifactId>
	<version>5.1.38</version>
	<scope>runtime</scope>
</dependency>
```
添加了 MyBatis 之后，为什么还需要添加 MySQL 驱动呢？
MyBatis 就像一个平台（类似京东），而数据库相当于商家有很多种，不止有 MySQL，还有 SQLServer、DB2 等等.....因此这两个都是需要添加的。

**之后的工作就和上面一样, 需要配置数据库连接信息**




## 创建数据库和表
使用MySQL创建练习的数据库与数据表
```sql
-- 创建数据库
drop database if exists mycnblog;
create database mycnblog DEFAULT CHARACTER SET utf8mb4;

-- 使用数据数据
use mycnblog;

-- 创建表[用户表]
drop table if exists userinfo;
create table userinfo(
	id int primary key auto_increment,
	username varchar(100) not null,
	password varchar(32) not null,
	photo varchar(500) default '',
	createtime datetime default now(),
	updatetime datetime default now(),
	`state` int default 1
) default charset 'utf8mb4';

-- 创建文章表
drop table if exists articleinfo;
create table articleinfo(
	id int primary key auto_increment,
	title varchar(100) not null,
	content text not null,
	createtime datetime default now(),
	updatetime datetime default now(),
	uid int not null,
	rcount int not null default 1,
	`state` int default 1
)default charset 'utf8mb4';

-- 创建视频表
drop table if exists videoinfo;
create table videoinfo(
	vid int primary key,
	`title` varchar(250),
	`url` varchar(1000),
	createtime datetime default now(),
	updatetime datetime default now(),
	uid int
)default charset 'utf8mb4';


-- 添加一个用户信息
INSERT INTO `mycnblog`.`userinfo` (`id`, `username`, `password`, `photo`,`createtime`, `updatetime`, `state`) VALUES
(1, 'admin', 'admin', '', '2021-12-06 17:10:48', '2021-12-06 17:10:48', 1);

-- 文章添加测试数据
insert into articleinfo(title,content,uid)
values('Java','Java正文',1);

-- 添加视频
insert into videoinfo(vid,title,url,uid) values(1,'java title','http://ww
w.baidu.com',1);
```


## 配置连接字符串和MyBatis
此步骤需要进行两项设置，数据库连接字符串设置和MyBatis 的XML文件配置。

### 配置连接字符串
如果是application.yml添加如下内容:
```yml
spring:  
  datasource:  
    url: jdbc:mysql://localhost:3306/myblog?characterEncoding=utf8&useSSL=false  
    username: root  
    password: 12345   #有些MySQL版本需要加 ""
    driver-class-name: com.mysql.cj.jdbc.Driver
```
**注意事项:**
>如果使用mysql-connector-java是5.x之前的使用的是“`com.mysql.jdbc.Driver`”，如果是大于5.x使用的是“`com.mysql.cj.jdbc.Driver`”。


### 配置MyBatis中的XML路径
MyBatis 的 XML 中保存是查询数据库的具体操作 SQL，配置如下：
```yml
# 配置 mybatis xml 的文件路径，在 resources/mapper 创建所有表的 xml 文件
mybatis:
	mapper-locations: classpath:mapper/**Mapper.xml
```


## 添加业务代码
下面按照后端开发的工程思路，也就是下面的流程来实现 MyBatis 查询所有用户的功能：
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230522104113.png)

先看我的文件目录结构:
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230522122436.png)


### 添加实体类
**添加用户实体类到 entity路径下** 
>注意所有字段名和表中字段名相同
```java
@Data  
public class Userinfo {  
    private Integer id;  
    private String username;  
    private String password;  
    private String photo;  
    private LocalDateTime createtime;  
    private LocalDateTime updatetime;  
    private Integer state;  
}
```

### 添加UserMapper.xml
在resource目录下创建mybatis目录, 在mybatis目录中创建 UserMapper.xml 文件, 用来给UserMapper.java 实现具体SQL语句
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230522123117.png)


数据持久成的实现，**mybatis 的固定 xml 格式**：
```xml
<?xml version="1.0" encoding="UTF-8"?>  
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">  
<mapper namespace="com.example.demo.mapper.UserMapper">  
  
</mapper>
```


UserMapper.xml 中**添加查询所有用户**的具体实现 SQL：
```xml
<?xml version="1.0" encoding="UTF-8"?>  
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">  
<mapper namespace="com.example.spring_mybatis_demo.mapper.UserMapper">  
  
    <select id="getAll" resultType="com.example.spring_mybatis_demo.entity.Userinfo">  
        select * from userinfo  
    </select>  
  
</mapper>
```

以下是对以上标签的说明：
- `<mapper>`标签：需要指定 namespace 属性，表示命名空间，值为 mapper 接口的全限定
名，包括全包名.类名。

- `<select>`查询标签：是用来执行数据库的查询操作的：
	- `id`：是和 Interface（接口）中定义的方法名称一样的，表示对接口的具体实现方法。
	- `resultType`：是返回的数据类型，也就是开头我们定义的实体类。

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230522111254.png)


### 添加 Service
**添加 UserSerive 到 Service 路径下**
实现代码如下：
```java
@Service  
public class UserService {  
  
    @Autowired  
    private UserMapper userMapper;  
  
    public List<Userinfo> getAll(){  
        return userMapper.getAll();  
    }  
}
```


### 添加Controller
控制器层的实现代码如下:
```java
@RestController  
@RequestMapping("/user")  
public class UserController {  
    @Autowired  
    private UserService userService;  
  
    @RequestMapping("/getall")  
    public List<Userinfo> getAll(){  
        return userService.getAll();  
    }  
}
```
以上代码写完，整个 MyBatis 的查询功能就实现完了，接下来使用 浏览器 或 postman 来测试一下。

这里使用浏览器 : 访问该地址[localhost:8080/user/getall](http://localhost:8080/user/getall)
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230522122109.png)


### 添加mapper接口
**添加mapper接口到 mapper 路径下**
数据持久层的接口定义：
```java
@Mapper  
public interface UserMapper {  
    public List<Userinfo> getAll();  
}
```

## 根据 id 查询
==添加UserMapper.java接口==
```java
@Mapper  
public interface UserMapper {  
    public Userinfo getUserById(@Param("userId") Integer id);  
}
```

==在 UserMapper.xml中实现接口==
```java
<?xml version="1.0" encoding="UTF-8"?>  
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">  
<mapper namespace="com.example.spring_mybatis_demo.mapper.UserMapper">  
  
    <select id="getUserById" resultType="com.example.spring_mybatis_demo.entity.Userinfo">  
        select * from userinfo where id=${userid}  
    </select>  
  
</mapper>
```


==UserService.java 代码==
```java
@Service  
public class UserService {  
  
    @Autowired  
    private UserMapper userMapper;  
  
    public Userinfo getUserById(Integer id){  
        return userMapper.getUserById(id);  
    }
}
```


==UserController.java 代码==
```java
@RestController  
@RequestMapping("/user")  
public class UserController {  
    @Autowired  
    private UserService userService;  
  
    @RequestMapping("/getuserbyid")  
    public Userinfo getUserById(Integer id) {  
        return userService.getUserById(id);  
    }
}
```

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230522125835.png)

执行结果:
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230522125431.png)



# 增 删 改 操作
接下来，我们来实现一下用户的增加、删除和修改的操作，对应使用 MyBatis 的标签如下：
- `<insert>`标签：插入语句
- `<update>`标签：修改语句
- `<delete>`标签：删除语句

接下的内容使用了 **单元测试**

**找到 test 文件夹, 在自己项目名下创建 mapper/UserMapperTest.java** , 命名规则为需要测试的文件加上 `Test.java`
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230522145701.png)

>UserMapperTest.java 表示我要测试 UserMapper.java这个文件


## 增加操作
==添加UserMapper.java接口==
```java
@Mapper  
public interface UserMapper {  
    int add(Userinfo userinfo);  
}
```

==在 UserMapper.xml中实现接口==
```java
<?xml version="1.0" encoding="UTF-8"?>  
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">  
<mapper namespace="com.example.spring_mybatis_demo.mapper.UserMapper">  
  
    <insert id="add">  
	    insert into userinfo(username , password , createtime , updatetime)  
	    values(#{username} , #{password} , #{createtime} , #{updatetime})
    </insert>
  
</mapper>
```


==在UserMapperTest.java中进行测试==
```java
@SpringBootTest  
public class UserMapperTest {  
    @Autowired  
    private UserMapper userMapper;  
    
    @Test  
    void add(){  
        Userinfo userinfo = new Userinfo();  
        userinfo.setUsername("张三");  
        userinfo.setPassword("123456");  
        userinfo.setCreatetime(LocalDateTime.now());  
        userinfo.setUpdatetime(LocalDateTime.now());  

		// 调用 mybatis 添加方法执行添加操作
        int result = userMapper.add(userinfo);   //返回受影响的行数
  
        System.out.println("添加：" + result);  
  
        Assertions.assertEquals(1, result);  
    }
}
```

执行结果: 
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230522150715.png)

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230522150802.png)

>**默认情况下返回的是受影响的行数**


### 特殊的添加: 返回自增id
==添加UserMapper.java接口==
```java
@Mapper  
public interface UserMapper {  
    int addGetId(Userinfo userinfo); 
}
```

==在 UserMapper.xml中实现接口==
```java
<?xml version="1.0" encoding="UTF-8"?>  
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">  
<mapper namespace="com.example.spring_mybatis_demo.mapper.UserMapper">  
  
    <insert id="addGetId" useGeneratedKeys="true" keyProperty="id">  
	    insert into userinfo(username,password,createtime,updatetime)  
	    values(#{username},#{password},#{createtime},#{updatetime})
    </insert>
  
</mapper>
```

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230522160326.png)



==在UserMapperTest.java中进行测试==
```java
@SpringBootTest  
public class UserMapperTest {  
    @Autowired  
    private UserMapper userMapper;  
  
    @Test  
    void addGetId() {   
        Userinfo userinfo = new Userinfo();  
        userinfo.setUsername("小六");  
        userinfo.setPassword("123456");  
        userinfo.setCreatetime(LocalDateTime.now());  
        userinfo.setUpdatetime(LocalDateTime.now());  
        // 调用 mybatis 添加方法执行添加操作  
        int result = userMapper.addGetId(userinfo);  //返回受影响的行数
        System.out.println("添加：" + result);  
  
        int uid = userinfo.getId();  //得到自增的id(MyBatis自动赋值)
        System.out.println("用户Id:" + uid);  
  
        Assertions.assertEquals(1, result);  
    }
}
```


## 修改操作
==添加UserMapper.java接口==
```java
@Mapper  
public interface UserMapper {  
    int upUserName(Userinfo userinfo); 
}
```


==在 UserMapper.xml中实现接口==
```java
<?xml version="1.0" encoding="UTF-8"?>  
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">  
<mapper namespace="com.example.spring_mybatis_demo.mapper.UserMapper">  

    <update id="upUserName">  
	    update userinfo set username=#{username} where id=#{id}  
	</update>
  
</mapper>
```


==在UserMapperTest.java中进行测试==
```java
@SpringBootTest  
public class UserMapperTest {  
    @Autowired  
    private UserMapper userMapper;  
  
    @Test  
    void upUserName() {  
        Userinfo userinfo = new Userinfo();  
        userinfo.setId(3); // 前提是 有id 为3的数据
        userinfo.setUsername("老六");  
  
        int result = userMapper.upUserName(userinfo);  
  
        System.out.println("修改：" + result + " 行");  
        Assertions.assertEquals(1, result);  
    }
}
```


## 删除操作
==添加UserMapper.java接口==
```java
@Mapper  
public interface UserMapper {  
    int delById(@Param("id") Integer id);
}
```


==在 UserMapper.xml中实现接口==
```java
<?xml version="1.0" encoding="UTF-8"?>  
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">  
<mapper namespace="com.example.spring_mybatis_demo.mapper.UserMapper">  

    <delete id="delById">  
	    delete from userinfo where id=#{id}  
	</delete>
  
</mapper>
```


==在UserMapperTest.java中进行测试==
```java
@SpringBootTest  
public class UserMapperTest {  
    @Autowired  
    private UserMapper userMapper;  
  
    @Test  
    void delById() {  
        Integer id = 2;  
        int result = userMapper.delById(id);  
        System.out.println("删除：" + result + " 行");  
        Assertions.assertEquals(1, result);  
    }
}
```


# 查询操作
## 单表查询
下面我们来实现一下根据用户 id 查询用户信息的功能。
![[MyBatis#根据 id 查询]]


### 参数占位符 `#{}` 和 `${}`
`#{}`：预编译处理。
`${}`：字符直接替换。

> **`#{}` 预编译处理**：MyBatis 在处理`#{}`时，会将 SQL 中的 `#{}` 替换为`?`号，使用 `PreparedStatement`的 `set` 方法来赋值。
>
>**`${}` 直接替换**：是MyBatis 在处理 `${}` 时，就是把 `${}` 替换成变量的值。(存在SQL注入问题)

![[SQL 注入]]


#### `#{}` 占位符的优缺点：
***优点***
1.  可以方便地引用 Java 对象的属性值，避免了 SQL 语句中直接使用 Java 对象的方式，提高了代码的可读性和可维护性。
2.  可以灵活地处理 Java 对象的属性类型，支持基本类型、String 类型、自定义类型等。
3.  可以减少 SQL 注入攻击的风险，因为 MyBatis 会自动转义特殊字符。

***缺点***
不能直接引用数据库中的列名，需要通过实体类的属性名映射到数据库的列名。如果实体类属性名和数据库列名不一致，需要进行映射操作，增加了开发难度和工作量。




#### `${}` 占位符的优缺点：
***优点：***
1.  可以方便地引用基本类型或 String 类型的值，不需要进行映射操作，简化了代码。
2.  可以快速编写 SQL 语句，提高开发效率。

***缺点：***
1. 存在SQL注入问题
2. 不能直接引用 Java 对象的属性值，需要通过实体类的属性名映射到数据库的列名。如果实体类属性名和数据库列名不一致，需要进行映射操作，增加了开发难度和工作量。



### 需要使用 `${}` 的场景
```xml
<select id="getAllBySort"  resultType="com.example.spring_mybatis_demo.entity.Userinfo">
	select * from userinfo order by id ${sort}
</select>
```
使用 `${sort}` 可以实现排序查询，而使用 `#{sort}` 就不能实现排序查询了，因为当使用 `#{sort}` 查询时，如果传递的值为 String 则会加单引号，就会导致 sql 错误。


### like 查询
like 使用 `#{}` 报错
```xml
<select id="findUserByName2" resultType="com.example.spring_mybatis_demo.entity.Userinfo">
	select * from userinfo where username like '%#{username}%';
</select>
```

相当于： `select * from userinfo where username like '%'username'%';`
这个是不能直接使用 `${}`，可以考虑使用 mysql 的内置函数 `concat()` 来处理，实现代码如下：

```xml
<select id="findUserByName3" resultType="com.example.demo.model.User">
	select * from userinfo where username like concat('%',#{username},'%');
</select>
```



## 多表查询
如果是增、删、改返回搜影响的行数，那么在 mapper.xml 中是可以不设置返回的类型的

然而即使是最简单查询用户的名称也要设置返回的类型，否则会出现如下错误。

**查询不设置返回类型的错误示例演示**

Controller 代码
```java
@RestController  
@RequestMapping("/user")  
public class UserController {  
    @Autowired  
    private UserService userService;  
  
    @RequestMapping("/getname")  
    public String getNameById(Integer id){  
        return userService.getUserById(id);  
    }
}
```


mapper.xml 实现代码
```xml
<select id="getUserById" >  
    select * from userinfo where id=${userId}  
</select>
```

访问接口执行结果如下：
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230522175843.png)

显示运行了一个查询但没有找到结果映射，也就是说对于 `<select>` 查询标签来说至少需要两个属性：
- id 属性：用于标识实现接口中的那个方法；
- 结果映射属性：结果映射有两种实现标签：`<resultMap>` 和 `<resultType>`。

### 返回类型: resultType
绝大数查询场景可以使用 resultType 进行返回，如下代码所示：

```xml
<select id="getNameById" resultType="java.lang.String">
	select username from userinfo where id=#{id}
</select>
```
这段代码就表示 返回 String 类型

>它的优点是使用方便，直接定义到某个实体类即可。



### 返回字典映射：resultMap
resultMap 使用场景：
- 字段名称和程序中的属性名不同的情况，可使用 resultMap 配置映射；
- 一对一 和 一对多 关系可以使用 resultMap 映射并查询数据


**字段名和属性名不同的情况**
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230522180634.png)


==程序中的属性如下==：
```java
@Data  
public class Userinfo {  
    private Integer id;  
    private String username;  
    private String pwd;  //与数据中的字段名不同
    private String photo;  
    private LocalDateTime createtime;  
    private LocalDateTime updatetime;  
    private Integer state;  
}
```

==mapper.xml 代码如下：==
```xml
<select id="getUserById" resultType="com.example.spring_mybatis_demo.entity.Userinfo">  
    select * from userinfo where id=${userId}  
</select>
```
查询结果
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230522181127.png)

>因为我们 userinfo 中的密码字段("pwd")与数据库中的密码字段("password")是不同的, 所以无法查询到此属性


这个时候就可以使用 resultMap 了，resultMap 的使用如下:

```xml
<?xml version="1.0" encoding="UTF-8"?>  
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">  
<mapper namespace="com.example.spring_mybatis_demo.mapper.UserMapper">  

    <resultMap id="baseMap" type="com.example.spring_mybatis_demo.entity.Userinfo">  
        <id column="id" property="id"></id>  
        <result column="username" property="username"></result>  
        <result column="password" property="password"></result>  
        <result column="photo" property="photo"></result>  
        <result column="createtime" property="createtime"></result>  
        <result column="updatetime" property="updatetime"></result>  
        <result column="state" property="state"></result>  
    </resultMap>
    
</mapper>
```

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230522182953.png)


```xml
<?xml version="1.0" encoding="UTF-8"?>  
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">  
<mapper namespace="com.example.spring_mybatis_demo.mapper.UserMapper">  

    <resultMap id="baseMap" type="com.example.spring_mybatis_demo.entity.Userinfo">  
        <id column="id" property="id"></id>  
        <result column="username" property="username"></result>  
        <result column="password" property="password"></result>  
        <result column="photo" property="photo"></result>  
        <result column="createtime" property="createtime"></result>  
        <result column="updatetime" property="updatetime"></result>  
        <result column="state" property="state"></result>  
    </resultMap>
    
	<select id="getUserById" resultMap="baseMap">  
	    select * from userinfo where id=${userId}  
	</select>
    
</mapper>
```
查询的结果pwd字段就有值了，如下图所示：
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230522183344.png)

### 多表联询
在多表查询时，如果使用 resultType 标签，在一个类中包含了另一个对象是查询不出来被包含的对象的，比如以下实体类

```java
@Data  
public class Articleinfo {  
    private int id;  
    private String title;  
    private String content;  
    private String createtime;  
    private String updatetime;  
    private int uid;  
    private int rcount;  
    private int state;  
}
```

```java
@Data  
public class Userinfo {  
    private Integer id;  
    private String username;  
    private String password;  
    private String photo;  
    private LocalDateTime createtime;  
    private LocalDateTime updatetime;  
    private Integer state;  
}
```

>**一对一映射**要使用 `<association>` 标签
>**一对多映射**需要使用 `<collection>` 标签
>
>==**但是这两个标签在企业中是不会使用的  ,而是使用 xxxVO类来解决的**==


***创建一个类: 本类作用就是扩展我们需要查询的数据***\
这个类可以随时添加我们需要得到的数据 , 所以比 `<association>` 和 `<collection>` 标签要好很多
```java
public class ArticleinfoVO extends Articleinfo {  
    public String username;  
  
    @Override  
    public String toString() {  
        return "ArticleinfoVO{" +  
                "username='" + username + '\'' +  
                '}' + super.toString();  
    }  
}
```


#### 一对一关系
**一篇文章只对应一个作者**

==添加UserMapper.java接口==
```java
@Mapper
public interface ArticleMapper {
    ArticleinfoVO getById(@Param("id") Integer id);
}
```


==在 UserMapper.xml中实现接口==
```java
<?xml version="1.0" encoding="UTF-8"?>  
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">  
<mapper namespace="com.example.spring_mybatis_demo.mapper.ArticleMapper">  
  
    <select id="getById" resultType="com.example.spring_mybatis_demo.entity.vo.ArticleinfoVO">  
        select a.*,u.username from articleinfo a  
	    left join userinfo u on u.id=a.uid        
	    where a.id=#{id}    
	</select>  
</mapper>
```
>注意 test 中的 photo，是传入对象中的属性，不是数据库字段。


==在UserMapperTest.java中进行测试==
```java
@SpringBootTest  
public class ArticleMapperTest {  
  
    @Autowired  
    private ArticleMapper articleMapper;  
  
    @Test  
    void getById() {  
        ArticleinfoVO articleinfoVO = articleMapper.getById(1);  
        System.out.println(articleinfoVO);  
    }  
}
```

#### 一对多关系
**一个用户多篇文章** , 一对多关系其实更加简单
==添加UserMapper.java接口==
```java
@Mapper  
public interface ArticleMapper {  
    List<ArticleinfoVO> getById(@Param("id") Integer id);  
}
```


==在 UserMapper.xml中实现接口==
```xml
<?xml version="1.0" encoding="UTF-8"?>  
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">  
<mapper namespace="com.example.spring_mybatis_demo.mapper.ArticleMapper">  
  
    <select id="getById" resultType="com.example.spring_mybatis_demo.entity.vo.ArticleinfoVO">  
        select * from articleinfo where uid=#{id}  
    </select>  
</mapper>
```
>注意 test 中的 photo，是传入对象中的属性，不是数据库字段。


==在UserMapperTest.java中进行测试==
```java
@SpringBootTest  
public class ArticleMapperTest {  
  
    @Autowired  
    private ArticleMapper articleMapper;  
  
    @Test  
    void getById() {  
        List<ArticleinfoVO> articleinfoVO = articleMapper.getById(1);  
        System.out.println(articleinfoVO);  
    }  
}
```




# 复杂情况: 动态 SQL使用
动态 sql 是Mybatis的强大特性之一，能够完成不同条件下不同的 sql 拼接。

可以参考官方文档：[Mybatis动态sql](https://mybatis.org/mybatis-3/zh/dynamic-sql.html)

## `<if>` 标签
在注册用户的时候，可能会有这样一个问题

ps: 网上乱找的图
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230522184656.png)

注册分为两种字段：必填字段和非必填字段，那如果在添加用户的时候有不确定的字段传入，程序应该如何实现呢？
>这个时候就需要使用动态标签 `<if>` 来判断了

**添加一个 方法, 如果有照片,就上传,没有照片就不上传**
==添加UserMapper.java接口==
```java
@Mapper  
public interface UserMapper {  
    int add2(Userinfo userinfo);
}
```


==在 UserMapper.xml中实现接口==
```java
<?xml version="1.0" encoding="UTF-8"?>  
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">  
<mapper namespace="com.example.spring_mybatis_demo.mapper.UserMapper">  

    <insert id="add2">  
	    insert into userinfo(username, password  
	    <if test="photo !=  null">  
	        ,photo  
	    </if>  
	    )  
	    values(#{username} , #{password}    
	    <if test="photo!=null">  
	        ,#{photo}  
	    </if>  
	    )  
	</insert>
  
</mapper>
```
>注意 test 中的 photo，是传入对象中的属性，不是数据库字段。


==在UserMapperTest.java中进行测试==
```java
@SpringBootTest  
public class UserMapperTest {  
    @Autowired  
    private UserMapper userMapper;  
  
    @Test  
    void add2() {  
        Userinfo userinfo = new Userinfo();  
        userinfo.setUsername("王五");  
        userinfo.setPhoto(null);  
        userinfo.setPassword("123");  
        int result = userMapper.add2(userinfo);  
        System.out.println("添加：" + result);  
    }
}
```

## `<trim>`标签
之前的插入用户功能，只是有一个 photo 字段可能是选填项，如果所有字段都是非必填项，就考虑使用
`<trim>`标签结合`<if>`标签，对多个字段都采取动态生成的方式。

**`<trim>`标签中有如下属性：**
- `prefix`：表示整个语句块，以prefix的值作为前缀
- `suffix`：表示整个语句块，以suffix的值作为后缀
- `prefixOverrides`：表示整个语句块要去除掉的前缀
- `suffixOverrides`：表示整个语句块要去除掉的后缀

==添加UserMapper.java接口==
```java
@Mapper  
public interface UserMapper {  
    int add3(Userinfo userinfo);
}
```


==在 UserMapper.xml中实现接口==
```java
<?xml version="1.0" encoding="UTF-8"?>  
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">  
<mapper namespace="com.example.spring_mybatis_demo.mapper.UserMapper">  

	<insert id="add3">  
	    insert into userinfo  
	    <trim prefix="(" suffix=")" suffixOverrides=",">  
	        <if test="username!=null">  
	            username,  
	        </if>  
	        <if test="password!=null">  
	            password,  
	        </if>  
	        <if test="photo!=null">  
	            photo,  
	        </if>  
	    </trim>  
	    values  
	    <trim prefix="(" suffix=")" suffixOverrides=",">  
	        <if test="username!=null">  
	            #{username},  
	        </if>  
	        <if test="password!=null">  
	            #{password},  
	        </if>  
	        <if test="photo!=null">  
	            #{photo},  
	        </if>  
	    </trim>  
	</insert>

</mapper>
```


==在UserMapperTest.java中进行测试==
```java
@SpringBootTest  
public class UserMapperTest {  
    @Autowired  
    private UserMapper userMapper;  
  
    @Test  
	void add3() {  
	    Userinfo userinfo = new Userinfo();  
	    userinfo.setUsername("老六");  
	    userinfo.setPassword("123");  
	    userinfo.setPhoto("default.png");  
	    int result = userMapper.add3(userinfo);  
	    System.out.println("添加：" + result);  
	}
}
```


在以上 sql 动态解析时，会将第一个 `<trim>` 部分做如下处理：
- 基于 ﻿prefix﻿ 配置，开始部分加上 ﻿`(`﻿
- 基于 ﻿suffix﻿ 配置，结束部分加上 ﻿`)﻿`
- 多个 `<if>`组织的语句都以 ﻿`,`﻿ 结尾，在最后拼接好的字符串还会以 ﻿`,`﻿ 结尾，会基于 ﻿suffixOverrides﻿ 配置去掉最后一个 ﻿`,﻿`
- 注意 ﻿`<if test=“username != null”>`﻿ 中的 username 是传入对象的属性

## `<where>` 标签
传入的用户对象，根据属性做 where 条件查询，用户对象中属性不为 null 的，都为查询条件。

>如userinfo.username 为 "`a`"，则查询条件为 where username="a"：

***实现查询用户名和密码***
==添加UserMapper.java接口==
```java
@Mapper  
public interface UserMapper {  
    List<Userinfo> getListByParam(String username , String password);
}
```


==在 UserMapper.xml中实现接口==
```java
<?xml version="1.0" encoding="UTF-8"?>  
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">  
<mapper namespace="com.example.spring_mybatis_demo.mapper.UserMapper">  

	<select id="getListByParam" resultType="com.example.spring_mybatis_demo.entity.Userinfo">  
	    select * from userinfo  
	    <where>  
	        <if test="username!=null">  
	            username=#{username}  
	        </if>  
	        <if test="password!=null">  
	            and password=#{password}  
	        </if>  
	    </where>  
	</select>

</mapper>
```
其实这里也就使用 `<trim>` 标签搞定
```xml
<select id="getListByParam" resultType="com.example.spring_mybatis_demo.entity.Userinfo">
	select * from userinfo
	<trim prefix="where" prefixOverrides="and">
		<if test="username!=null">
			username=#{username}
		</if>
		<if test="password!=null">
			and password=#{password}
		</if>
	</trim>
</select>
```


==在UserMapperTest.java中进行测试==
```java
@SpringBootTest  
public class UserMapperTest {  
    @Autowired  
    private UserMapper userMapper;  
  
    @Test  
    void getListByParam() {  
        List<Userinfo> list = userMapper.getListByParam(null, "123");  
        System.out.println(list);  
    }
}
```



## `<set>`标签
根据传入的用户对象属性来更新用户数据，可以使用`<set>`标签来指定动态内容。

***更新userinfo数据表 数据***
==添加UserMapper.java接口==
```java
@Mapper  
public interface UserMapper {  
    int update2(Userinfo userinfo);
}
```


==在 UserMapper.xml中实现接口==
```xml
<?xml version="1.0" encoding="UTF-8"?>  
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">  
<mapper namespace="com.example.spring_mybatis_demo.mapper.UserMapper">  
  
    <update id="update2">  
        update userinfo  
        <set>  
            <if test="username!=null">  
                username=#{username}  
            </if>  
            <if test="password!=null">  
                password=#{password}  
            </if>  
            <if test="photo!=null">  
                photo=#{photo}  
            </if>  
        </set>  
        where id=#{id}  
    </update>
</mapper>
```


==在UserMapperTest.java中进行测试==
```java
@SpringBootTest  
public class UserMapperTest {  
    @Autowired  
    private UserMapper userMapper;  
  
    @Test  
    void update2() {  
        Userinfo user = new Userinfo();  
        user.setId(7);  
        user.setUsername(null);  
        user.setPassword(null);  
        user.setPhoto("default.png");  
        int result = userMapper.update2(user);  
        System.out.println("修改：" + result);  
    }
}
```

以上`<set>`标签也可以使用 `﻿<trim prefix="set" suffixOverrides=",">`﻿ 替换。

## `<foreach>` 标签
对集合进行遍历时可以使用该标签。`<foreach>`标签有如下属性：
- collection：绑定方法参数中的集合，如 List，Set，Map或数组对象
- item：遍历时的每一个对象
- open：语句块开头的字符串
- close：语句块结束的字符串
- separator：每次遍历之间间隔的字符串

***根据多个用户的 id 来删除文章数据***。
==添加UserMapper.java接口==
```java
@Mapper  
public interface UserMapper {  
    int dels(List<Integer> ids);
}
```


==在 UserMapper.xml中实现接口==
```xml
<?xml version="1.0" encoding="UTF-8"?>  
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">  
<mapper namespace="com.example.spring_mybatis_demo.mapper.UserMapper">  
  
    <delete id="dels">  
        delete from userinfo where id in  
        <foreach collection="ids" open="(" close=")" item="id" separator=",">  
            #{id}  
        </foreach>  
    </delete>  
    
</mapper>
```


==在UserMapperTest.java中进行测试==
```java
@SpringBootTest  
public class UserMapperTest {  
    @Autowired  
    private UserMapper userMapper;  
  
    @Test  
    void dels() {  
        List<Integer> ids = new ArrayList<>();  
        ids.add(3);  
        ids.add(4);  
        int result = userMapper.dels(ids);  
        System.out.println("删除：" + result);  
    }
}
```








