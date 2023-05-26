# Spring中事务的实现
Spring 中的事务操作分为两类:
1.编程式事务（手动写代码操作事务)。
2.声明式事务（利用注解自动开启和提交事务)。

在开始讲解它们之前，咱们先来回顾事务在MySQL中是如何使用的?

## MySQL的事务使用
[[事务#事务常见操作方式]]

# 统一配置文件
==文件路径:==
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230526193524.png)


==resource/application.yml==
```yml
# 配置数据库的连接字符串  
spring:  
  datasource:  
    #    协议://ip:端口/具体的一个数据库?query string  
    url: jdbc:mysql://127.0.0.1:3306/mycnblog?characterEncoding=utf8&useSSL=false&allowPublicKeyRetrieval=true  
    username: root  
    password: "back7671773"  
    #    驱动  
    driver-class-name: com.mysql.cj.jdbc.Driver  
  
# 设置 Mybatis 的 xml 保存路径  
mybatis:  
  mapper-locations: classpath:mapper/*Mapper.xml  
  configuration:  
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl  
  
# 配置打印 MyBatis 执行的 SQLlogging:  
  level:  
    com:  
      example:  
        spring_transaction: debug
```


==entity/UserInfo.java==
```java
@Data  
public class UserInfo {  
    private Integer id;  
    private String username;  
    private String password;  
    private String photo;  
    private String createtime;  
    private String updatetime;  
    private Integer state;  
}
```

==demo/mapper/UserMapper.java==
这里的 demo 是你的项目名
```java
@Mapper  
public interface UserMapper {  
    int add(UserInfo userInfo);  
}
```

==/resource/Service/UserService.java==
```xml
<?xml version="1.0" encoding="UTF-8"?>  
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">  
<mapper namespace="com.example.spring_transaction.mapper.UserMapper">  
    <insert id="add">  
        insert into userinfo(username , password , createtime , updatetime)  
		values(#{username} , #{password} , #{createtime} , #{updatetime})  
	</insert>  
</mapper>
```


==demo/mapper/UserMapper.java==
这里的 demo 是你的项目名
```java
@Service  
public class UserService {  
    @Autowired  
    private UserMapper userMapper;  
  
    public Integer add(UserInfo userInfo){  
        int result = userMapper.add(userInfo);  
        System.out.println("用户添加 " + result);        
		return result;  
    }  
}
```


# Spring 实现事务
## Spring 编程式事务(手动)
Spring手动操作事务和上面MySQL操作事务类似，它也是有3个重要操作步骤:
- 开启事务（获取事务)。
- 提交事务。
- 回滚事务。

SpringBoot 内置了两个对象，`DataSourceTransactionManager` 用来获取事务（开启事务)、提交或回滚事务的，而`TransactionDefinition` 是事务的属性，在获取事务的时候需要将
`TransactionDefinition`传递进去从而获得一个事务`TransactionStatus`，实现代码如下:


==demo/mapper/UserController.java==
```java
@RestController  
@RequestMapping("/user")  
public class UserController {  
  
    @Autowired  
    private UserService userService;  
    @Resource  
    private DataSourceTransactionManager transactionManager;  
    @Resource  
    private TransactionDefinition transactionDefinition;  
  
    @RequestMapping("/add")  
    public int add(UserInfo userInfo) {  
        // 非空效验  
        if (userInfo == null || !StringUtils.hasLength(userInfo.getUsername())  
                || !StringUtils.hasLength(userInfo.getPassword())) {  
            return 0;  
        }  
        // 1.开始事务  
        TransactionStatus transactionStatus = transactionManager.getTransaction(transactionDefinition);  
  
        // 手动设置创建时间和修改时间的默认值  
        userInfo.setCreatetime(LocalDateTime.now().toString());  
        userInfo.setUpdatetime(LocalDateTime.now().toString());  
  
        int result = userService.add(userInfo);  
        System.out.println("添加：" + result);  
  
        // 回滚事务  
        transactionManager.rollback(transactionStatus);  


        // // 提交事务  
        //transactionManager.commit(transactionStatus);
  
        return result;  
    }  
}
```

在浏览器中访问该地址进行测试：[localhost:8080/user/add?username=lisi&password=123](http://localhost:8080/user/add?username=lisi&password=123)

在MySQL中会进行数据回滚，所以我们看不到数据是否插入过， 但是我们开源通过我们的输出来进行判断
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230526224843.png)


从上述代码可以看出，以上代码虽然可以实现事务，但操作也很繁琐，有没有更简单的实现方法呢？请看下面声明式事务


## Spring 声明式事务(自动)
声明式事务的实现很简单，只需要在需要的方法上添加 `@Transactional` 注解就可以实现了，**无需手动开启事务和提交事务，进入方法时自动开启事务，方法执行完会自动提交事务，如果中途发生了没有处理的异常会自动回滚事务**，具体实现代码如下:

在UserController.java添加 insert方法来实现声明式事务
```java
@RestController  
@RequestMapping("/user")  
public class UserController {  
    @Autowired  
    private UserService userService;  
    @Resource  
    private DataSourceTransactionManager transactionManager;  
    @Resource  
    private TransactionDefinition transactionDefinition;  
    

    @RequestMapping("/insert")  
    public Integer insert(UserInfo userInfo){  
        if(userInfo == null || !StringUtils.hasLength(userInfo.getUsername()) ||  
            !StringUtils.hasLength(userInfo.getPassword())){  
            return 0;  
        }  
  
        int result = userService.add(userInfo);  
        return result;  
    }  
}
```

这里是执行结果和上面的是一样的

### @Transactional 注解
#### @Transactional 作用范围
-  可以添加在类上或方法上
	- 修饰方法时：需要注意只能应用到 public 方法上，否则不生效。推荐此种用法。
	- 修饰类时：表明该注解对该类中所有的 public 方法都生效。



#### @Transactional 参数说明
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230526230357.png)


#### 注意事项
- 在方法执行前自动开启事务，在方法执行完(没有任何异常)自动提交事务，但是如果在方法执行期间**出现异常**,那么将**自动回滚事务**。
```java
@RestController  
@RequestMapping("/user")  
public class UserController {  
  
    @Autowired  
    private UserService userService;  
    @Resource  
    private DataSourceTransactionManager transactionManager;  
    @Resource  
    private TransactionDefinition transactionDefinition;  
  
    @Transactional  
    @RequestMapping("/insert")  
    public Integer insert(UserInfo userInfo){  
        if(userInfo == null || !StringUtils.hasLength(userInfo.getUsername()) ||  
                !StringUtils.hasLength(userInfo.getPassword())){  
            return 0;  
        }  
  
        int result = userService.add(userInfo);  
        int i = 10 / 0;  //这里会报 by zero 异常
        return result;  
    }
}
```


- 但是如果我们使用**异常体系来处理了这个异常**, 我们插入的**数据是不会回滚**的
```java
@RestController  
@RequestMapping("/user")  
public class UserController {  
  
    @Autowired  
    private UserService userService;  
    @Resource  
    private DataSourceTransactionManager transactionManager;  
    @Resource  
    private TransactionDefinition transactionDefinition;  
   
    @Transactional  
    @RequestMapping("/insert")  
    public Integer insert(UserInfo userInfo){  
        if(userInfo == null || !StringUtils.hasLength(userInfo.getUsername()) ||  
            !StringUtils.hasLength(userInfo.getPassword())){  
            return 0;  
        }  
  
        int result = userService.add(userInfo);  
        try{  
            int i = 10 / 0;  
        }catch (Exception e){  
            System.out.println(e.getMessage());  
        }  
        return result;  
    }  
}
```


***上述的解决方案由两种***:
1. 将异常抛出
```java
@Transactional  
@RequestMapping("/insert")  
public Integer insert(UserInfo userInfo){  
	if(userInfo == null || !StringUtils.hasLength(userInfo.getUsername()) ||  
		!StringUtils.hasLength(userInfo.getPassword())){  
		return 0;  
	}  

	int result = userService.add(userInfo);  
	try{  
		int i = 10 / 0;  
	}catch (Exception e){  
		throw e; // 将异常抛出  
	}  
	return result;  
}
```

2. 使用代码手动回滚事务
```java
@Transactional  
@RequestMapping("/insert")  
public Integer insert(UserInfo userInfo){  
	if(userInfo == null || !StringUtils.hasLength(userInfo.getUsername()) ||  
		!StringUtils.hasLength(userInfo.getPassword())){  
		return 0;  
	}  

	int result = userService.add(userInfo);  
	try{  
		int i = 10 / 0;  
	}catch (Exception e){  
		// 使用代码手动回滚事务
        TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
	}  
	return result;  
}
```


### @Transactional 工作原理
`@Transactional` 是基于AOP实现的，AOP又是使用动态代理实现的。如果目标对象实现了接口，默认情况下会采用JDK的动态代理，如果目标对象没有实现了接口,会使用CGLIB动态代理。

`@Transactional` 在开始执行业务之前，通过代理先开启事务，在执行成功之后再提交事务。如果中途遇到的异常，则回滚事务。

#### @Transactional 实现思路预览︰
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230526231904.png)



#### @Transactional 具体执行细节如下图所示
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230526231943.png)


# 事务的隔离级别
















