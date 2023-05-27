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
事务有4大特性(ACID)，原子性、持久性、一致性和隔离性，具体概念如下:
1. **原子性**(Atomicity):事务是一个不可分割的最小工作单元。事务中的所有操作要么全部完成，要么全部失败并回滚。如果其中一个操作失败，整个事务将被回滚到开始状态，以确保数据的一致性。
    
2. **持久性**(Durability):事务一旦提交，其对数据库的修改将永久保存。即使在发生系统故障或意外断电的情况下，修改也不会丢失。这是事务保证数据完整性和可靠性的关键特性。
    
3. **一致性**(Consistency):事务执行过程中，数据库中的数据保持一致状态。这意味着要么所有数据都符合预期的约束条件，要么所有数据都处于错误状态(如外键约束)。通过确保数据的一致性，事务有助于避免数据不一致的问题。
    
4. **隔离性**(Isolation):事务在执行过程中，不会与其他事务共享资源。这意味着一个事务的修改不会影响其他事务的结果。隔离性是实现并发控制的重要手段，可以防止脏读、不可重复读和幻读等多线程问题。
	- 事务隔离分为不同级别，包括读未提交(Readuncommitted)、读提交(read committed) 、可重复读(repeatable read)和串行化(Serializable)。

上面4个属性，可以简称为ACID。
>原子性(Atomicity，或称不可分割性)
>—致性(Consistency)
>隔离性(lsolation，又称独立性)
>持久性(Durability)。

而这 4 种特性中，只有**隔离性（隔离级别）是可以设置**的


***为什么要设置事务的隔离级别?***
>设置事务的隔离级别是用来保障多个并发事务执行更可控，更符合操作者预期的。


## Spring 中设置事务隔离级别
Spring 中事务隔离级别可以通过 `@Transactional` 中的 `isolation` 属性进行设置，具体操作如下图所示：
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230527123617.png)

***MySQL 事务隔离级别有 4 种***
-  **READ UNCOMMITTED**:读未提交，也叫未提交读，该隔离级别的事务可以看到其他事务中未提交的数据。该隔离级别因为可以读取到其他事务中未提交的数据，而未提交的数据可能会发生回滚，因此我们把该级别读取到的数据称之为脏数据，把这个问题称之为脏读。

- **READ COMMITTED**:读已提交，也叫提交读，该隔离级别的事务能读取到已经提交事务的数据，因此它不会有脏读问题。但由于在事务的执行中可以读取到其他事务提交的结果，所以在不同时间的相同SQL查询中，可能会得到不同的结果，这种现象叫做不可重复读。

- **REPEATABLE READ**:可重复读，是MySQL 的默认事务隔离级别，它能确保同一事务多次查询的结果一致。但也会有新的问题，比如此级别的事务正在执行时，另一个事务成功的插入了某条数据，但因为它每次查询的结果都是一样的，所以会导致查询不到这条数据，自己重复插入时又失败(因为唯一约束的原因)。明明在事务中查询不到这条信息，但自己就是插入不进去，这就叫幻读(Phantom Read)。

- **SERIALIZABLE**︰序列化，事务最高隔离级别，它会强制事务排序，使之不会发生冲突，从而解决了脏读、不可重复读和幻读问题，但因为执行效率低，所以真正使用的场景并不多。

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230527123834.png)

> - **脏读**：一个事务读取到了另一个事务修改的数据之后，后一个事务又进行了回滚操作，从而导致
第一个事务读取的数据是错误的。
>-  **不可重复读**：一个事务两次查询得到的结果不同，因为在两次查询中间，有另一个事务把数据修改了。
>-  **幻读**：一个事务两次查询中得到的结果集不同，因为在两次查询中另一个事务有新增了一部分数据。


在数据库中通过以下 SQL 查询全局事务隔离级别和当前连接的事务隔离级别：

MySQL 5.x
```sql
select @@global.tx_isolation,@@tx_isolation;
```

MySQL 8.x
```sql
select @@global.transaction_isolation,@@transaction_isolation;
```

SQL 的执行结果如下： 默认为可重复读
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230527124738.png)


### Spring 事务隔离级别有5种
Spring 中事务隔离级别包含以下5种:
1. `Isolation.DEFAULT`:以连接的数据库的事务隔离级别为主。
2. `Isolation.READ_UNCOMMITTED`:读未提交，可以读取到未提交的事务，存在脏读。
3. `lsolation.READ_COMMITTED`:读已提交，只能读取到已经提交的事务，解决了脏读，存在不可重复读。
4. `Isolation.REPEATABLE_READ`︰可重复读，解决了不可重复读，但存在幻读（MySQL默认级别)。
5. `Isolation.SERIALIZABLE`︰串行化，可以解决所有并发问题，但性能太低。

从上述介绍可以看出，相比于MySQL的事务隔离级别，Spring 的事务隔离级别只是多了一个`Isolation.DEFAULT`(以数据库的全局事务隔离级别为主)。


Spring 中事务隔离级别只需要设置 `@Transactional` 里的 isolation属性即可，具体实现代码如下:
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
  
    @Transactional(isolation = Isolation.SERIALIZABLE) //更改隔离级别为串行化  
    @RequestMapping("/insert")  
    public Integer insert(UserInfo userInfo){  
        // 业务代码实现 
    }
}
```


# Spring事务传播机制

## 事务传播机制是是什么？
Spring 事务传播机制定义了多个包含了事务的方法，相互调用时，事务是如何在这些方法间进行传递的。


## 为什么需要事务传播机制
事务传播机制是确保事务正确执行的重要机制。在应用程序中，通常需要在一个方法中调用另一个带有事务的方法，例如一个方法可能需要向数据库提交数据，而另一个方法可能需要从数据库读取数据。如果没有事务传播机制，那么当调用这两个方法时，可能会出现以下问题：
1. 如果当前方法没有事务，则调用另一个方法时会创建一个新的事务，这可能会导致两个方法使用不同的事务，从而导致数据不一致或丢失。
2. 如果当前方法有事务，则调用另一个方法时会将事务加入到第二个方法中，这可能会导致第一个方法的事务被回滚，从而影响数据的一致性。   

因此，通过使用事务传播机制，可以确保在调用带有事务的方法时，事务能够正确地传播和管理，从而保证数据的一致性和可靠性。


事务隔离级别解决的是多个事务同时调用一个数据库的问题，如下图所示:
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230527125828.png)

而事务传播机制解决的是一个事务在多个节点（方法）中传递的问题，如下图所示：
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230527125835.png)


## 事务传播机制有哪些？
Spring 事务传播机制的作用是在多个事务方法相互调用时，决定事务如何在这些方法间传播。²³

根据不同的作用，Spring 事务传播机制分为以下七种类型：
- **Propagation.REQUIRED**：如果当前没有事务，则自己新建一个事务，如果当前存在事务，则加入这个事务。这是 Spring 的默认传播类型。
- **Propagation.SUPPORTS**：如果当前存在事务，则加入当前事务，如果当前没有事务，就以非事务方法执行。
- **Propagation.MANDATORY**：如果当前存在事务，则加入当前事务，如果当前没有事务，就抛出异常.
- **Propagation.REQUIRES_NEW**：无论当前是否存在事务，都会新建一个新的事务，并暂停当前的事务（如果存在）。
- **Propagation.NOT_SUPPORTED**：无论当前是否存在事务，都会以非事务方法执行，并暂停当前的事务（如果存在）。
- **Propagation.NEVER**：如果当前存在事务，则抛出异常，如果当前没有事务，就以非事务方法执行。
- **Propagation.NESTED**：如果当前存在事务，则在嵌套事务内执行，如果当前没有事务，则新建一个事务。嵌套事务是指可以设置一个保存点，当嵌套事务回滚时，只回滚到这个保存点。

### Spring 事务传播机制分类
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230527134605.png)


1. `Propagation.REQUIRED`默认传播机制，如果调用链存在事务，则加入事务，如果不存在则创建事务。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230527131352.png)


2. `Propagation.SUPPORTS` 如果调用链存在事务，则加入事务;如果不存在则非事务方式运行。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230527131620.png)


3. `Propagation.MANDATORY`：如果当前存在事务，则加入当前事务，如果当前没有事务，就抛出异常.
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230527132245.png)



4. `Propagation.REQUIRES_NEW`：无论当前是否存在事务，都会新建一个新的事务，并暂停当前的事务（如果存在）。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230527132520.png)


5. `Propagation.NOT_SUPPORTED`：无论当前是否存在事务，都会以非事务方法执行，并暂停当前的事务（如果存在）。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230527132829.png)


6. `Propagation.NEVER`：如果当前存在事务，则抛出异常，如果当前没有事务，就以非事务方法执行。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230527133041.png)


7. `Propagation.NESTED`：如果当前存在事务，则在嵌套事务内执行，如果当前没有事务，则新建一个事务。嵌套事务是指可以设置一个保存点，当嵌套事务回滚时，只回滚到这个保存点。

这里需要注意两点：
- 和`REQUIRES_NEW`的区别
> REQUIRES_NEW是新建一个事务并且新开启的这个事务与原有事务无关，而NESTED则是当前存在事务时（我们把当前事务称之为父事务）会开启一个嵌套事务（称之为一个子事务）。  
> 在**NESTED情况下父事务回滚时，子事务也会回滚**，而在REQUIRES_NEW情况下，原有事务回滚，不会影响新开启的事务。  
- 和`REQUIRED`的区别
> REQUIRED情况下，调用方存在事务时，则被调用方和调用方使用同一事务，那么被调用方出现异常时，由于共用一个事务，所以无论调用方是否catch其异常，事务都会回滚.
> 而在NESTED情况下，被调用方发生异常时，调用方可以catch其异常，这样**只有子事务回滚，父事务不受影响**.

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230527134527.png)


## Spring 事务传播机制使用和各种场景演示
这里主要介绍: REQUIRED  和 NESTED , 其他的传播机制和 REQUIRED 差不多.


### 支持当前事务（REQUIRED）
以下代码实现中，先开启事务先成功插入一条用户数据，然后再执行日志报错，而在日志报错是发生了异常，观察 `propagation = Propagation.REQUIRED` 的执行结果。

==Service/LogService.java==
```java
@Service  
public class LogService {  
  
    @Transactional(propagation = Propagation.REQUIRED)  
    public int add(){  
        int num = 10/0;  
        return 1;  
    }  
}
```


==Service/UserService.java==
```java
@Service  
public class UserService {  
    @Autowired  
    private UserMapper userMapper;  
  
    @Transactional(propagation = Propagation.REQUIRED)  //添加事务传播机制
    public Integer add(UserInfo userInfo){  
        int result = userMapper.add(userInfo);  
        System.out.println("用户添加 " + result);  
        return result;  
    }  
}
```

==Controller/UserController.java==
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
    @Autowired  
    private LogService logService;  
  
    @Transactional  
    @RequestMapping("/insert")  
    public Integer insert(UserInfo userInfo){  
        //非空校验  
        if(userInfo == null || !StringUtils.hasLength(userInfo.getUsername()) ||  
                !StringUtils.hasLength(userInfo.getPassword())){  
            return 0;  
        }  
  
        //添加用户  
        int result = userService.add(userInfo);  
  
        if(result > 0){  
            //日志  
            logService.add();  
        }  
        return result;  
  
    }
}
```

访问网址: [localhost:8080/user/insert?username=lisi&password=123](http://localhost:8080/user/insert?username=lisi&password=123)

控制台执行结果:
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230527141759.png)


MySQL中 未执行代码前:
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230527142314.png)

MySQL中 执行代码后:
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230527142314.png)

***结论***
>先开启事务先成功插入一条用户数据，然后再执行日志报错，而在日志报错是发生了异常, `propagation = Propagation.REQUIRED`最终导致了数据回滚.


### NESTED 嵌套事务
更改下面文件的事务传播未 NESTED 

==Service/LogService.java==
```java
@Service  
public class LogService {  
  
    @Transactional(propagation = Propagation.NESTED)  
    public int add() {  
	    // 将异常在内部进行处理, 外部就无法感知到该异常了
        try {  
            int num = 10 / 0;  
        } catch (Exception e) {  
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();  
        }  
        return 1;  
    }  
}
```


==Service/UserService.java==
```java
@Service  
public class UserService {  
    @Autowired  
    private UserMapper userMapper;  
  
    @Transactional(propagation = Propagation.NESTED)  
    public Integer add(UserInfo userInfo){  
        int result = userMapper.add(userInfo);  
        System.out.println("用户添加 " + result);  
        return result;  
    }  
}
```

==Controller/UserController.java==
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
    @Autowired  
    private LogService logService;  
  
    @Transactional(propagation = Propagation.NESTED)  
    @RequestMapping("/insert")  
    public Integer insert(UserInfo userInfo){  
        //非空校验  
        if(userInfo == null || !StringUtils.hasLength(userInfo.getUsername()) ||  
                !StringUtils.hasLength(userInfo.getPassword())){  
            return 0;  
        }  
  
        //添加用户  
        int result = userService.add(userInfo);  
  
        if(result > 0){  
            //日志  
            logService.add();  
        }  
        return result;  
  
    }
}
```
访问网址: [localhost:8080/user/insert?username=lisi&password=123](http://localhost:8080/user/insert?username=lisi&password=123)

MySQL中数据 : **未执行代码前**
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230527142314.png)

MySQL中数据 : **执行代码后**
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230527143248.png)


***结论***
>先开启事务先成功插入一条用户数据，然后再执行日志报错，而在日志报错是发生了异常, `propagation = Propagation.NESTED`没有导致**父事务**的数据回滚. 因为回滚的是LogService.java文件中的**子事务**的数据内容, 并没有影响到父事务的数据.



### 嵌套事务和加入事务的区别
嵌套事务只所以能够实现部分事务的回滚，是因为事务中有一个保存点（savepoint）的概念，嵌套事务进入之后相当于新建了一个保存点，而滚回时只回滚到当前保存点，因此之前的事务是不受影响的.

这一点可以在 MySQL 的官方文档汇总找到相应的资料：[https://dev.mysql.com/doc/refman/5.7/en/savepoint.html](https://dev.mysql.com/doc/refman/5.7/en/savepoint.html)


***嵌套事务(NESTED)和加入事务(REQUIRED)的区别:***
- 整个事务如果全部执行成功，二者的结果是一样的。
- 如果事务执行到一半失败了，那么加入事务整个事务会全部回滚;而嵌套事务会局部回滚，不会影响上一个方法中执行的结果。



# 总结
Spring事务使用中，重点的内容有3个:
1. 在Spring项目中使用事务，用两种方法手动操作和声明式自动提交，其中后者使用的最多，在方法上添加`@Transactional`就可以实现了。
2. 设置事务的隔离级别`@Transactional(isolation = lsolation.SERIALIZABLE)`，Spring 中的事务隔离级别有5种。
3. 设置事务的传播机制`@Transactional(propagation = Propagation.REQUIRED)`，Spring 中的事务传播级别有7种。