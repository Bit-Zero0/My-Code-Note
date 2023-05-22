经过前面的学习，我们已经可以实现基本的 Spring 读取和存储对象的操作了，但在操作的过程中我们发现读取和存储对象并没有想象中的那么“简单”，所以接下来我们要学习更加简单的操作 Bean 对象的方法。
在 Spring 中想要**更简单的存储和读取对象的核心是使用注解**，也就是我们接下来要学习 Spring 中的相关注解，来存储和读取 Bean 对象.


# Bean 命名规则
通过上述示例，我们可以看出，**通常我们 bean 使用的都是标准的大驼峰命名， 读取的时候首字
小写就可以获取到 bean 了**，如下图所示：
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230515111021.png)


**那我们定义类时 , 首字母和第二个字母都是大写呢? 此时我们在采用首字母小写就不能正常读取 Bean 了**
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230515111135.png)


## Spring bean的命名规则源码
我们可以看下关于Spring 存储 Bean时 , 生成的命名规则.

我们可以在 idea 中使用搜索关键字“`buildDefaultBeanName`”可以看到以下内容
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230515111757.png)


顺藤摸瓜，我们最后找到了 bean 对象的命名规则的方法：
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230515111822.png)


它使用的是 JDK Introspector 中的 `decapitalize` 方法，源码如下：
```java
public static String decapitalize(String name) {  
    if (name == null || name.length() == 0) {  
        return name;  
    }  
    if (name.length() > 1 && Character.isUpperCase(name.charAt(1)) &&  
                    Character.isUpperCase(name.charAt(0))){  
        return name;  
    }  
    char chars[] = name.toCharArray();  
    chars[0] = Character.toLowerCase(chars[0]);  
    return new String(chars);  
}
```
可以看到当前两个字母是大写时 , 就采用原来的就行 

>如: `RBTree`类 , 在获取Bean时 , 命名规则就是 使用 `RBTree`
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230515112154.png)




# 存储Bean对象
之前我们存储 Bean对象是 , 需要 spring-config.xml 中添加一行 bean注册内容.
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230515102635.png)
而现在我们只需要 个注解就可以替代之前要写配置的尴尬了，不过在开始存储对象之前，我们先要来点准备工作。

## 前置工作: 配置扫描路径(重要)
注意: 想要将对象成功的存储到Spring中 , 我们需要配置一下存储对象的扫描包路径, 只有**被配置的包下的所有类, 添加了注解才能够被正确的识别并保存到Spring中**.

在` spring-config.xml` 配置
```xml
<?xml version="1.0" encoding="UTF-8"?>  
<beans xmlns="http://www.springframework.org/schema/beans"  
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
       xmlns:content="http://www.springframework.org/schema/context"  
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd">  
<!--    这里的base-package就是我们要扫描的目录, 如果你要扫描整个程序 , 就配置为 "**"-->    <content:component-scan base-package="Demo"></content:component-scan>  
</beans>
```
我这里配置的扫描路径就是在Demo目录

这是我的文件路径
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230515104716.png)


此时在Demo目录下的代码中添加注解就能存储到Spring中.
也就是说，即使添加了注解，如果不是在配置的扫描包下的类对象，是不能被存储到 Spring 中的。

>**注意**: 配置为 `base-package="**"` 时, 会扫描整个项目, 耗时会非常长, 十分不推荐这样配置.


## 添加注解存储 Bean 对象
想要将对象存储在 Spring 中，有两种注解类型可以实现：
1. 类注解：`@Controller`、`@Service`、`@Repository`、`@Component`、`@Configuration` .
2. 方法注解：`@Bean`  .


### 为什么需要这么多类注解
既然功能是一样的，为什么需要这么多的类注解呢？
-  通过类注解可以了解当前类的用途（看到车牌云A就知道这是昆明的车一样);
- 功能有细微不同:这个在 Spring MVC/Spring Boot再详细展开。
>这和为什么每个省/市都有自己的车牌号是一样的？比如陕西的车牌号就是：陕X：XXXXXX，北京的车牌号：京X：XXXXXX，一样。甚至一个省不同的县区也是不同的，比如西安就是，陕A：XXXXX，咸阳：陕B：XXXXXX，宝鸡，陕C：XXXXXX，一样。这样做的好处除了可以节约号码之外，更重要的作用是可以直观的标识一辆车的归属地。


那么为什么需要怎么多的类注解也是相同的原因，就是让程序员看到类注解之后，就能直接了解当前类的用途，比如：
1. `@Controller`(控制器〉﹔归属于业务逻辑层，用来控制用户的行为，它用来检查用户参数的有效性。
2. `@Service`(服务) :归属于服务层，调用持久化类实现相应的功能。【不直接和数据库交互的，它类似于控制中心】
3. `@Repository`(仓库)  :归属于持久层，是直接和数据库进行交互的。通常每一个表都会对应一个@Repository 。
4. `@Configuration`(配置):归属于配置层，是用来配置当前项目的一些信息。
5. `@Component`(组件):归属于公共工具类，提供某些公共方法。

程序的工程分层，调用流程如下：
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230516085139.png)


### 类注解之间的关系
查看 `@controller / @Service / @Repository / @Configuration` 等注解的源码发现:
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230515110624.png)
其实这些注解里面都有一个注解 `@Component`，说明它们本身就是属于 `@Component` 的 “子类”。



### @Controller(控制器存储)
```java
@Controller  //将对象存储到Spring中
public class UserController {  
    public void sayHi(String name){  
        System.out.println("Hi: " + name);  
    }  
}
```

此时我们先使用之前读取对象的方式来读取上面的 UserController 对象，如下代码所示：
```java
public class App {  
    public static void main(String[] args) {  
        //得到Spring的上下文对象  
        ApplicationContext context = new ClassPathXmlApplicationContext("spring-config.xml");  
  
        // 加载 User 这个 bean        
        UserController userController = context.getBean("userController" , UserController.class );  
  
        //调用Bean的方法  
        userController.sayHi("bit-zero");  
    }  
}
```


### @Service (服务存储)
```java
@Service
public class UserService {  
    public void sayHi(String name){  
        System.out.println("Hi: " + name);  
    }  
}
```

读取 Bean 代码
```java
public class App {  
    public static void main(String[] args) {  
        //得到Spring的上下文对象  
        ApplicationContext context = new ClassPathXmlApplicationContext("spring-config.xml");  
  
        // 加载 User 这个 bean        UserService userService = context.getBean("userService" , UserService.class );  
  
        //调用Bean的方法  
        userService.sayHi("bit-zero");  
    }  
}
```


### @Repository / @Component
 在目前我们在学的是 Spring core , `@Repository / @Component`这些注解和上面注解的使用方法是一样的, 要使用的话,和上面的代码相同.


### @Bean (方法注解)
**在Spring框架中， 方法注解@Bean 必须要配合这类注解才能将对象正常的存储到Spring容器中**


类注解是添加到某个类上的，而方法注解是放到某个方法上的，如以下代码的实现：
```java
public class Users {  
    @Bean  
    public User user1(){  
        User user = new User();  
        user.setId(1);  
        user.setName("Bit-zero");  
        return user;  
    }  
}
```

然而，当我们写完以上代码，尝试获取 bean 对象中的 user1 时却发现，根本获取不到：
```java
public class App {  
    public static void main(String[] args) {  
        ApplicationContext context = new ClassPathXmlApplicationContext("spring-config.xml");  
        User user = (User)context.getBean("user1");  
  
        System.out.println(user);  
    }  
}
```
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230515141631.png)

**==原因==**: 需要配合类注解才能使用



#### 方法注解要配合类注解使用
==再次重申==: **在Spring框架中， 方法注解@Bean 必须要配合这类注解才能将对象正常的存储到Spring容器中**
```java
@Component  //这里可以是任意的 类注解
public class Users {  
    @Bean  
    public User user1(){  
        User user = new User();  
        user.setId(1);  
        user.setName("Bit-zero");  
        return user;  
    }  
}
```

此时再执行就没问题了


### 重命名 Bean
可以通过设置 name 属性给 Bean 对象进行重命名操作
```java
@Component  
public class Users {  
    @Bean(name={"u1"})  
    public User user1(){  
        User user = new User();  
        user.setId(1);  
        user.setName("Bit-zero");  
        return user;  
    }  
}
```

此时我们使用 u1 就可以获取到 User 对象
```java
public class App {  
    public static void main(String[] args) {  
        ApplicationContext context = new ClassPathXmlApplicationContext("spring-config.xml");  
  
        User user = (User)context.getBean("u1");  
  
        System.out.println(user);  
    }  
}
```


***注意***: 
>**当使用 `@Bean` 注解并重命名后，使用==原来的类名首字母小写无法能正确获取到对象==**


这个重命名的 name 其实是一个数组，一个 bean 可以有多个名字 .
```java
@Component  
public class Users {  
    @Bean({"u1" ,"us1"})   // 
    public User user1(){  
        User user = new User();  
        user.setId(1);  
        user.setName("Bit-zero");  
        return user;  
    }  
}
```
> `name=` 可以省略


# 获取Bean对象
获取 bean 对象也叫做**对象装配**，是把对象取出来放到某个类中，有时候也叫**对象注入**。

对象装配（对象注入）的实现方法以下 3 种：
1. 属性注入
2. 构造方法注入
3. Setter 注入

下面我们按照实际开发中的模式，将 Service 类注入到 Controller 类中。

## 属性注入
属性注入是使用 `@Autowired` 实现的，将 Service 类注入到 Controller 类中。

**Service 类的实现代码如下：**
```java
@Service  
public class UserService {  
    //根据 ID 获取用户数据  
    public User getUser(Integer id) {  
        User user = new User();  
        user.setId(id);  
        user.setName("bit-zero:" + id);  
        return user;  
    }  
}
```


**Controller 类的实现代码如下：**
```java
@Controller //将对象存储到Spring中  
public class UserController {  
  
    @Autowired  // 属性注入
    private UserService userService;  
  
    public User getUser(Integer id){  
        return userService.getUser(id);  
    }  
}
```


**获取 Controller 中的 getUser 方法：**
```java
public class App {  
    public static void main(String[] args) {  
        ApplicationContext context = new ClassPathXmlApplicationContext("spring-config.xml");  
  
        UserController userController = context.getBean("userController", UserController.class);  
  
        System.out.println(userController.getUser(1).toString());  
    }  
}
```


最终结果:
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230515144100.png)


核心实现是这句代码
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230515144223.png)

***优点*:**
- 方便
- 使用这种方法是主流

***缺点:***
- 不能注入不可变(final)对象
	- ![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230516085638.png)
- 只适用于IoC容器
- 更容易违背单一设计原则. (针对的对象是类)

## Setter注入
Setter 注入和属性的 Setter 方法实现类似，只不过**在设置 set 方法的时候需要加上 `@Autowired` 注解**
```java
@Controller  
public class UserController {  
    private UserService userService;  
  
    @Autowired // Setter注入  
    public void setUserService(UserService userService) {  
        this.userService = userService;  
    }  
  
    public User getUser(Integer id){  
        return userService.getUser(id);  
    }  
}
```

>==**注意事项**==: 如果只有一个构造方法 , 那么 `@Autowired` 注解可以省略

```java
@Controller  
public class UserController {  
    private UserService userService;  
  
    //@Autowired  //只有一个构造方法时, 此注解可以省略
    public void setUserService(UserService userService) {  
        this.userService = userService;  
    }  
  
    public User getUser(Integer id){  
        return userService.getUser(id);  
    }  
}
```

>但是如果类中有多个构造方法，那么需要添加上 `@Autowired` 来明确指定到底使用哪个构造方法，否则程序会报错

***优点***
- 更加符合单一设计原则(针对对象方法级别)

***缺点***
- 不能注入不可变对象
- 注入对象可被修改(set方法是普通的set方法, 可以被重复调用, 在被调用是就存在被修改的风险)


## 构造方法注入
构造方法注入是在类的构造方法中实现注入
```java
@Controller  
public class UserController {  
    private UserService userService;  
   
    @Autowired  
    public UserController(UserService userService){  
        this.userService = userService;  
    }  
  
    public User getUser(Integer id){  
        return userService.getUser(id);  
    }  
}
```

==**注意事项**: 如果只有一个构造方法，那么 `@Autowired` 注解可以省略==


但是如果类中有多个构造方法，那么需要添加上 `@Autowired` 来明确指定到底使用哪个构造方法，否则程序会报错，如下图所示：


***优点***
- 可以注入一个不可变对象.
- 注入的对象不会被修改
	- 加了 `final` 修饰符
	- 构造方法是随着类加载只执行一次(不像set注入有可能被多次修改的风险)
- 注入的对象会被完全初始化
- 通用性更好
- 官方推荐使用

***缺点***
- 没有属性注入实现简单



## 三种注入优缺点分析
- 属性注入的优点是简洁，使用方便；缺点是只能用于 IoC 容器，如果是非 IoC 容器不可用，并且只有在使用的时候才会出现 NPE（空指针异常）。
- **构造方法注入是 Spring 推荐的注入方式**，它的缺点是如果有多个注入会显得比较臃肿，但出现这种情况你应该考虑一下当前类是否符合程序的单一职责的设计模式了，它的优点是通用性，在使用之前一定能把保证注入的类不为空。
- Setter 方式是 Spring 前期版本推荐的注入方式，但通用性不如构造方法，所有 Spring 现版本已经推荐使用构造方法注入的方式来进行类注入了。


## @Resource：另一种注入关键字
在进行类注入时，除了可以使用 `@Autowired` 关键字之外，我们还可以使用 `@Resource` 进行注入
```java
@Controller  
public class UserController {  

    @Resource  //注入
    private UserService userService;  
  
    public User getUser(Integer id){  
        return userService.getUser(id);  
    }  
}
```

**`@Autowired` 和 `@Resource` 的区别**
>- 出身不同：@Autowired 来自于 Spring，而 @Resource 来自于 JDK 的注解；
>- 使用时设置的参数不同：相比于 @Autowired 来说，@Resource 支持更多的参数设置，例如 name 设置，根据名称获取 Bean。
>- @Autowired 可用于 Setter 注入、构造函数注入和属性注入，而 @Resource 只能用于 Setter 注入和属性注入，不能用于构造函数注入。


## 同一类型多个 @Bean 报错
当出现以下多个 Bean，返回同一对象类型时程序会报错
```java
@Component  
public class Users {  
    @Bean  
    public User user1() {  
        User user = new User();  
        user.setId(1);  
        user.setName("Redis");  
        return user;  
    }  
  
    @Bean  
    public User user2() {  
        User user = new User();  
        user.setId(2);  
        user.setName("MySQL");  
        return user;  
    }  
}
```

在另一个类中获取 User 对象
```java
@Controller  
public class UserController1 {  
    @Resource  //注入
    private User user;  
  
    public User getUser(){  
        return user;  
    }  
}
```

以上程序执行结果
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230515152715.png)
报错的原因是，非唯一的 Bean 对象。

### 同一类型多个 Bean 报错处理
解决同一个类型，多个 bean 的解决方案有以下两个：
- 使用 `@Resource(name="user1")` 定义。
- 使用 `@Qualifier` 注解定义名称。

#### 使用 @Resource(name="XXX")
```java
@Controller  
public class UserController1 {  
    @Resource(name="user1")  
    private User user;  
  
    public User getUser(){  
        return user;  
    }  
}
```
此时注入的就是 user1 这个对象了.


#### 使用 @Qualifier
```java
@Controller  
public class UserController1 {  
  
    @Autowired  
    @Qualifier(value = "user2")  
    private User user;  
  
    public User getUser(){  
        return user;  
    }  
}
```
此时注入的是 user2 这个对象了.



# 总结
1. 将对象存储到 Spring 中：
	-  使用类注解：@Controller、@Service、@Repository、@Configuration、@Component【它们之间的关系】
	- 使用方法注解：@Bean【注意事项：必须配合类注解一起使用】

2. Bean 的命名规则：首字母和第二个字母都非大写，首字母小写来获取 Bean，如果首字母和第二个字母都是大写，那么直接使用原 Bean 名来获取 Bean。

3. 从 Spring 中获取对象：
	- 属性注入
	- Setter 注入
	- 构造函数注入（推荐）

4. 注入的关键字有：
	-  @Autowired
	-  @Resource
 
5. `@Autowired` 和 `@Resource` 区别：出身不同； 使用时设置参数不同` @Resource` 支持更多的参数，比如 name。

6. 解决同一类型多个 Bean 的报错：
	-  使用 `@Resource(name="")`
	-  使用 `@Qualifier("")`

