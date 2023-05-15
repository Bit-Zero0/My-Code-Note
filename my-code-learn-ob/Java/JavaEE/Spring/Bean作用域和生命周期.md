从前面的课程我们可以看出 Spring 是用来读取和存储 Bean，因此在 Spring 中 Bean 是最核心的操作资源，所以接下来我们深入学习一下 Bean 对象。

# 通过一个案例来看 Bean 作用域的问题
假设现在有一个公共的 Bean，提供给 A 用户和 B 用户使用，然而在使用的途中 A 用户却“悄悄”地修
改了公共 Bean 的数据，导致 B 用户在使用时发生了预期之外的逻辑错误。
>我们预期的结果是，公共 Bean 可以在各自的类中被修改，但不能影响到其他类。


## 被修改的 Bean 案例
公共 Bean：
```java
@Component  
public class Users {  
    @Bean  
    public User user1() {  
        User user = new User();  
        user.setId(1);  
        user.setName("Redis"); // 名称是 Redis  
        return user;  
    }  
}
```

A 用户使用时，进行了修改操作：
```java
public class BeanScopeController {  
    @Autowired  
    private User user1;  
  
    public User getUser1(){  
        User user = user1;  
        System.out.println("Bean 原name 为: " + user.getName());  
        user.setName("Mysql");  // 进行修改操作 
        return user;  
    }  
}
```


B 用户再去使用公共 Bean 的时候：
```java
@Controller  
public class BeanScopeController2 {  
    @Autowired  
    private User user1;  
  
    public User getUser1(){  
        User user = user1;  
        return user;  
    }  
}
```


打印 A 用户和 B 用户公共 Bean 的值
```java
public class App {  
    public static void main(String[] args) {  
        ApplicationContext context = new ClassPathXmlApplicationContext("spring-config.xml");  
  
        BeanScopeController beanScopeController = context.getBean(BeanScopeController.class);  
        System.out.println("A 对象修改之后 Name：" + beanScopeController.getUser1().toString());  
  
        BeanScopeController2 beanScopeController2 = context.getBean(BeanScopeController2.class);  
        System.out.println("B 对象读取到的 Name：" + beanScopeController2.getUser1().toString());  
    }  
}
```

运行结果:
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230515161421.png)


***原因分析***
操作以上问题的原因是因为 **Bean 默认情况下是单例状态（singleton），也就是所有人的使用的都是同一个对象**，之前我们学单例模式的时候都知道，使用单例可以很大程度上提高性能，所以在 Spring 中 Bean 的作用域默认也是 singleton 单例模式。


# 作用域的定义
限定程序中变量的可用范围叫做作用域，或者说在源代码中定义变量的某个区域就叫做作用域。而 **Bean 的作用域是指 Bean 在 Spring 整个框架中的某种行为模式，比如 singleton 单例作用域，就表示 Bean 在整个 Spring 中只有一份，它是全局共享的，那么当其他人修改了这个值之后，那么另一个人读取到的就是被修改的值**。


## Bean 的 6 种作用域
Spring 容器在初始化一个 Bean 的实例时，同时会指定该实例的作用域。Spring有 6 种作用域，最后
四种是基于 Spring MVC 生效的：
1. singleton：单例作用域
2. prototype：原型作用域（多例作用域）
3. request：请求作用域
4. session：回话作用域
5. application：全局作用域
6. websocket：HTTP WebSocket 作用域

>注意后 4 种状态是 Spring MVC 中的值，在普通的 Spring 项目中只有前两种。


| 取值              | 含义                                    | 创建对象的时机  |
| ----------------- | --------------------------------------- | --------------- |
| `singleton`（默认） | 在IOC容器中，这个bean的对象始终为单实例 | IOC容器初始化时 |
| `prototype`         | 这个bean在IOC容器中有多个实例           | 获取bean时      |

如果是在SpringMVC环境下还会有另外几个作用域（但不常用）：
| 取值    | 含义                 |
| ------- | -------------------- |
| `request` | 在一个请求范围内有效, 每次HTTP请求，都会创建一个 Bean对象。【适用于Spring MVC/Spring Web】 |
| `session` | 在一个会话范围内有效, 每次Session会话共享一个Bean。【Spring MVC) |
| `application` | 全局作用域 ,一个http servlet context中共享一个bean.【Spring MVC】 |
| `WebSocket` |WebSocket的每次会话中，保存了 个Map结构的头信息，将用来包裹客户端消息头。第一次初始化后，直到WebSocket结束都是同一个Bean。|

### singleton
- 官方说明：(Default) Scopes a single bean definition to a single object instance for each Spring IoC container.
- 描述：该作用域下的Bean在IoC容器中只存在一个实例：获取Bean（即通过applicationContext.getBean等方法获取）及装配Bean（即通过@Autowired注入）都是同一个对象。
- 场景：通常**无状态**的Bean使用该作用域。无状态表示Bean对象的属性状态不需要更新
- 备注：**Spring默认选择该作用域**



### prototype
- 官方说明：Scopes a single bean definition to any number of object instances.
- 描述：每次对该作用域下的Bean的请求都会创建新的实例：获取Bean（即通过applicationContext.getBean等方法获取）及装配Bean（即通过@Autowired注入）都是新的对象实例。
- 场景：通常有状态的Bean使用该作用域


### request
- 官方说明：Scopes a single bean definition to the lifecycle of a single HTTP request. That is,each HTTP request has its own instance of a bean created off the back of a single bean definition. Only valid in the context of a web-aware Spring ApplicationContext.
- 描述：每次http请求会创建新的Bean实例，类似于prototype
- 场景：一次http的请求和响应的共享Bean
- 备注：限定SpringMVC中使用


### session
- 官方 说明：Scopes a single bean definition to the lifecycle of an HTTP Session. Only valid in the context of a web-aware Spring ApplicationContext.
- 描述：在 个http session中，定义 个Bean实例
- 场景： 户回话的共享Bean, 如：记录一个用户的登陆信息
- 备注：限定SpringMVC中使


### application（了解）
- 官方说明：Scopes a single bean definition to the lifecycle of a ServletContext. Only valid in the context of a web-aware Spring ApplicationContext.
- 描述：在一个http servlet Context中，定义一个Bean实例
- 场景：Web应用的上下文信息， 如：记录一个应用的共享信息
- 备注：限定SpringMVC中使用


### websocket（了解）
- 官网说明：Scopes a single bean definition to the lifecycle of a WebSocket. Only valid in the context of a web-aware Spring ApplicationContext.
- 描述：在 个HTTP WebSocket的生命周期中，定义 个Bean实例
- 场景：WebSocket的每次会话中，保存了 个Map结构的头信息，将用来包裹客户端消息头。第一次初始化后，直到WebSocket结束都是同一个Bean。
- 备注：限定Spring WebSocket中使用


## 单例作用域(singleton) VS 全局作用域(application)
- singleton 是 Spring Core 的作用域；application 是 Spring Web 中的作用域；
- singleton 作 于 IoC 的容器，而 application 作用于 Servlet 容器。



## 设置作用域
用 `@Scope` 标签就可以用来声明 Bean 的作用域 两种设置方式：
1. `@Scope(ConfigurableBeanFactory.SCORE_PROTOTYPE)`
2. `@Scope("prototype")`

如设置 Bean 的作用域
```java
@Component  
public class Users {  
    @Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)  
    @Bean("u1")  
    public User user1() {  
        User user = new User();  
        user.setId(1);  
        user.setName("Redis"); // 名称是 Redis
        return user;  
    }  
}
```

`@Scope` 标签既可以修饰方法也可以修饰类，@Scope 有两种设置方式：
1. 直接设置值：`@Scope("prototype")`
2. 使用枚举设置：`@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE`


# Spring执行流程和Bean的生命周期

Bean 执行流程（Spring 执行流程）：启动 Spring 容器 -> 实例化 Bean（分配内存空间，从 到有） -> Bean 注册到 Spring 中（存操作） -> 将 Bean 装配到需要的类中（取操作)。

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230515165342.png)


## Bean生命周期
所谓的生命周期指的是一个对象从诞生到销毁的整个生命过程，我们把这个过程就叫做一个对象的生命周期。

Bean 的 命周期分为以下 5 部分：
1. 实例化 Bean （为 Bean 分配内存空间）
2. 设置属性 （Bean 注 和装配）
3. Bean 初始化
	- 实现了各种 Aware 通知的方法，如**BeanNameAware**、BeanFactoryAware、ApplicationContextAware 的接口方法；
	- 执行 BeanPostProcessor 初始化前置方法；
	- 执行 **@PostConstruct** 初始化方法，依赖注入操作之后被执 ；
	- 执行 指定的 init-method 法（如果有指定的话）；
	- 执行 BeanPostProcessor 初始化后置 法。
4. 使用 Bean
5. 销毁 Bean

销毁容器的各种方法，如 @PreDestroy、DisposableBean 接口法、destroy-method。

**执行流程如下图所示：**
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230515170109.png)


### 实例化和初始化的区别
**实例化和属性设置是Java级别的系统“事件”，其操作过程不可人工干预和修改;  而初始化是给开发者提供的, 可以在实例化之后，类加载完成之前进行自定义“事件”处理。**


### Bean 生命周期 小故事
1. 实例化（对应JVM中的“加载”）【从无到有，将字节码转换成内存中的对象，只是分配了内存】==ex:买了一套毛坯房==
2. 设置属性（Bean_注入和装配)  ==ex:购买装修材料（引入外部资源)==
3. 初始化      ==ex:房子装修==
	- 各种通知     ==ex:打电话给各个装修的师傅来施工（水工、电工、瓦工...)==
	- 初始化的前置工作    ==ex:师傅达到现场，先勘察环境，制定装修方案【前置工作】==
	- 进行初始化工作【使用注解`@PostConstruct`初始化、使用(xml)init-method 初始化】==ex:两类师傅进行装修，一类技术好的，另一类技术一般==
	- 初始化的后置工作     ==ex:装修之后的清理工作==
4.使用 Bean     ==ex:房子可以入住使用了==
5.销毁Bean      ==ex:卖掉这套房==

## 生命周期演示
```java
//@Component
public class BeanLifeComponent implements BeanNameAware {

    @Override
    public void setBeanName(String s) {
        System.out.println("执行了通知");
    }

    @PostConstruct
    public void postConstruct() {
        System.out.println("执行了 @PostConstruct");
    }

    public void init() {
        System.out.println("执行了 init-method 方法");
    }

    @PreDestroy
    public void preDestroy() {
        System.out.println("执行销毁方法");
    }
}
```

**xml 配置**
```xml
<?xml version="1.0" encoding="UTF-8"?>  
<beans xmlns="http://www.springframework.org/schema/beans"  
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
       xmlns:content="http://www.springframework.org/schema/context"  
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd">  
       
    <bean id="beanLifeComponent" class="Demo.BeanLifeComponent" init-method="init"></bean>  

</beans>
```


调用类
```java
public class App {  
    public static void main(String[] args) {    
        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("spring-config.xml");  
  
        BeanLifeComponent beanLifeComponent = context.getBean("beanLifeComponent" ,BeanLifeComponent.class);  
        System.out.println("使用 Bean");  
        
        // 销毁 Bean        
        context.destroy();  
    }  
}
```



## 为什么要先设置属性在进行初始化呢？
现在我们定义 A B C 三个类 
> A类需要注入B类 , 并调用B类的sayHi方法 , B类需要注入C类 


**C类**
```java
@Component  
public class CComponent {  
    @PostConstruct  
    public void postConstruct(){  
        System.out.println("执行了 C 对象的PostConstruct 方法");  
    }  
}
```


**B类**
B类需要注入C类Bean
```java
@Component  
public class BComponent {  
    @Autowired  
    private CComponent cComponent;  
  
    @PostConstruct  
    public void postConstruct(){  
        System.out.println("执行了 B 对象的 PostConstruct 方法");  
    }  
  
    public void sayHi(){  
        System.out.println("Hi BComponent");  
    }  
}
```


**A类**
```java
@Component  
public class AComponent {  
    @Autowired  
    private BComponent bComponent;  
  
    @PostConstruct  
    public void postConstruct(){  
        bComponent.sayHi();  
        System.out.println("执行了 A 对象的PostConstruct 方法");  
    }  
}
```


生命周期测试代码
```java
@Component  
public class BeanLifeComponent implements BeanNameAware {  
  
    @Override  
    public void setBeanName(String s) {  
        System.out.println("执行了通知");  
    }  
  
    @PostConstruct  
    public void postConstruct() {  
        System.out.println("执行了 @PostConstruct");  
    }  
  
    public void init() {  
        System.out.println("执行了 init-method 方法");  
    }  
  
    @PreDestroy  
    public void preDestroy() {  
        System.out.println("执行销毁方法");  
    }  
}
```


执行类
```java
public class App {  
    public static void main(String[] args) {  
        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("spring-config.xml");  
  
        AComponent aComponent = context.getBean("AComponent", AComponent.class);  
  
        context.destroy();  
    }  
}
```

***运行结果***
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230515214641.png)

因为 A 需要先注入B的对象 ,所以需要 B对象 先初始化 , 但B类也需要C类注入才能初始化 , 所以最先初始化的是C ,C类初始化后, 注入到 B 中 , 最后执行A 中的代码.
