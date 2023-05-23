# 什么是Spring AOP？
AOP (Aspect Oriented Programming)∶ 面向切面编程，它是一种思想，**它是对某一类事情的集中处理**。

而AOP是一种思想，而Spring AOP是一个框架，提供了一种对AOP思想的实现，它们的关系和loC与DI类似。|

## 为什么要用AOP?
我们之前的处理方式是每个Controller都要写一遍用户登录验证，然而当你的功能越来越多，那么你要写的登录验证也越来越多，而这些方法又是相同的，这么多的方法就会代码修改和维护的成本。那有没有简单的处理方案呢?答案是有的，**对于这种功能统一，且使用的地方较多的功能，就可以考虑AOP来统一处理了**。

除了统一的用户登录判断之外，AOP还可以实现:
- 统一日志记录
- 统一方法执行时间统计
- 统一的返回格式设置
- 统一的异常处理
- 事务的开启和提交等

也就是说**使用AOP可以扩充多个对象的某个能力**，所以AOP可以说是OOP(Object Oriented Programming，面向对象编程)的补充和完善。

>- 保持原有代码不变，能够给原有的业务逻辑增加二维的功能。AOP 增加的功能是开发人员自己编写的，底层是动态代理实现功能的增强。对于扩展功能十分有利.
>- Spring的事务功能就是在AOP 基础上实现的， 业务方法在执行前【开启事务】，在执行业务方法，最后【提交或回滚失败】。


# AOP组成

## 切面 (Aspect)
切面（Aspect)由切点(Pointcut)和通知（Advice)组成，它既包含了横切逻辑的定义，也包括了连接点的定义。

>- 切面是包含了:通知、切点和切面的类，开发自己编写功能增强代码的地方，这些代码会通过动态代理加入到原有的业务方法中。
>- `@Aspect` 注解表示当前类是切面类。切面类是一个普通类。

## 连接点 (Join Point)
应用执行过程中能够插入切面的一个点，这个点可以是方法调用时，抛出异常时，甚至修改字段时。切面代码可以利用这些点插入到应用的正常流程之中，并添加新的行为。

>连接切面和目标对象。或是一个方法名称，一个包名，类名。在这个特定的位置执行切面中的功能代码。


## 切点 (Pointcut)
Pointcut 的作用就是提供一组规则(使用AspectJ pointcut expression language来描述）来匹配Join Point，给满足规则的Join Point添加Advice. 

>其实就是筛选出的连接点。一个类中的所有方法都可以是JoinPoint, 具体的那个方法要增加功能，这个方法就是Pointcut。


## 通知 (Advice)
切面也是有目标的——它必须完成的工作。在 AOP术语中，**切面的工作被称之为==通知==**。

通知︰定义了切面是什么，何时使用，其描述了切面要完成的工作，还解决何时执行这个工作的问题。

Spring切面类中，可以在方法上使用以下注解，会设置方法为通知方法，在满足条件后会通知本方法进行调用︰
- **前置通知**使用`@Before`:在切点方法之前执行
- **后置通知**使用`@After`:在切点方法之后执行
- **返回之后通知**使用`@AfterReturning`：切点方法返回后执行。
- **抛异常后通知**使用`@AfterThrowing`：切点方法抛异常执行
- **环绕通知**使用`@Around`：属于环绕增强，能控制切点执行前，执行后。功能最强的注解

>这  5 个注解 `@Before`，`@After`，`@AfterReturning`，`@AfterThrowing`，`@Around`  来自aspectj 框架。


AOP 整个组成部分的概念如下图所示，以多个页面都要访问用户登录权限为例：

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230523085938.png)



# Spring AOP 实现步骤
Spring AOP的实现步骤如下:
1. 添加Spring AOP框架支持。
2. 定义切面(创建切面类)
3. 定义切点(配置拦截规则)
4. 定义通知。


## 添加AOP框架支持
在 pom.xml中添加如下配置:
```xml
<!-- https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-aop -->
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```


## 定义切面和切点(创建切面类)
切点指的是具体要处理的某一类问题，比如用户登录权限验证就是一个具体的问题，记录所有方法的执行日志就是一个具体的问题，切点定义的是某一类问题。

Spring AOP切点的定义如下, 在切点中定义要拦截的规则
```java
@Component  
@Aspect// 表明此类为一个切面  
public class UserAspect {  
    //切点（配置拦截规则）  
    @Pointcut("execution(* com.example.spring_aop_demo.Controller.*.*(..))")  
    public void pointcut(){  
    }  
      
}
```
其中 pointcut方法为空方法，它不需要有方法体，此方法名就是起到一个“标识”的作用，标识下面的通知方法具体指的是哪个切点(因为切点可能有很多个)。

### 切点表达式说明
AspectJ支持三种通配符
`*` ︰匹配任意字符，只匹配一个元素（包，类，或方法，方法参数)
`..`︰匹配任意字符，可以匹配多个元素，在表示类时，必须和`*`联合使用。
`+` : 表示按照类型匹配指定类的所有类，必须跟在类名后面，如`com.cad.Car+` ,表示继承该类的所有子类包括本身

切点表达式由切点函数组成，其中 `execution()`是最常用的切点函数，用来匹配方法，语法为:
```java
execution(<修饰符><返回类型><包.类.方法(参数)><异常>)
```

修饰符和异常可以省略，具体含义如下：
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230523091936.png)


***表达式示例***
`execution(* com.cad.demo.User.*(..))` ：匹配 User 类里 的所有方法。

`execution(* com.cad.demo.User+.*(..))`：匹配该类的子类包括该类的所有方法。

`execution(* com.cad.*.*(..))` ：匹配 com.cad 包下的所有类的所有方法。

`execution(* com.cad..*.*(..))`：匹配 com.cad 包下、 子孙包下所有类的所有方法。

`execution(* addUser(String, int))`：匹配 addUser 方法，且第一个参数类型是 String，第二个参数类型是 int。


## 定义相关通知
通知定义的是被拦截的方法具体要执行的业务，比如用户登录权限验证方法就是具体要执行的业务。Spring AOP 中，可以在方法上使用以下注解，会设置方法为通知方法，在满足条件后会通知本方法进行调用:
- **前置通知**使用`@Before`:通知方法会在目标方法调用之前执行。
- **后置通知**使用`@After`:通知方法会在目标方法返回或者抛出异常后调用。
- **返回之后通知**使用`@AfterReturning`:通知方法会在目标方法返回后调用。
- **抛异常后通知**使用`@AfterThrowing`:通知方法会在目标方法抛出异常后调用。
- **环绕通知**使用`@Around`:通知包裹了被通知的方法，在被通知的方法通知之前和调用之后执行自定义的行为。

>==目标方法也就是 **切点**==


具体实现如下:
定义 Controller/UserController.java
```java
@RestController  
@RequestMapping("/user")  
public class UserController {  
    @RequestMapping("/hi")  
    public String sayHi(String name){  
        System.out.println("执行了 sayHi 方法");  
        return "Hi " + name;  
    }  
  
    @RequestMapping("/hello")  
    public String sayHello(){  
        System.out.println("执行了 sayHello 方法");  
        return "Hello , world";  
    }  
}
```


```java
@Component  
@Aspect// 表明此类为一个切面  
public class UserAspect {  
    //切点（配置拦截规则）  
    @Pointcut("execution(* com.example.spring_aop_demo.Controller.*.*(..))")  
    public void pointcut(){  
    }  
  
    //前置通知  
    @Before("pointcut()")  
    public void  beforeAdvice(){  
        System.out.println("执行前置通知");  
    }  
  
    //后置通知  
    @After("pointcut()")  
    public void afterAdvice() {  
        System.out.println("执行了后置通知~");  
    }  
  
    // return 之前通知  
    @AfterReturning("pointcut()")  
    public void doAfterReturning(){  
        System.out.println("执行 返回之后通知");  
    }  
    // 抛出异常之前通知  
    @AfterThrowing("pointcut()")  
    public void doAfterThrowing(){  
        System.out.println("执行 抛出异常之前 通知");  
    }  
  
    //环绕通知  
    @Around("pointcut()")  
    public Object aroundAdice(ProceedingJoinPoint joinPoint) throws Throwable {  
        System.out.println("进入环绕通知");  
        Object obj = null;  
  
        obj = joinPoint.proceed();  
        System.out.println("退出环绕通知");  
        return obj;  
    }  
}
```

使用浏览器访问: [localhost:8080/user/hi?name=bit-zero](http://localhost:8080/user/hi?name=bit-zero)

控制台执行结果:
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230523094937.png)


**复习:** 
>- **前置通知**使用`@Before`:在切点方法之前执行
>- **后置通知**使用`@After`:在切点方法之后执行
>- **返回之后通知**使用`@AfterReturning`：切点方法返回后执行。
>- **抛异常后通知**使用`@AfterThrowing`：切点方法抛异常执行
>- **环绕通知**使用`@Around`：属于环绕增强，能控制切点执行前，执行后。功能最强的注解


# Spring AOP 实现原理
Spring AOP是构建在**动态代理**基础上，因此**Spring对AOP的支持局限于方法级别的拦截**。

Spring AOP支持JDK Proxy和CGLIB方式实现动态代理。默认情况下，实现了接口的类，使用AOP会基于JDK生成代理类，没有实现接口的类，会基于CGLIB生成代理类
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230523100433.png)

## 织入(Weaving):代理的生成时机
织入是把切面应用到目标对象并创建新的代理对象的过程，切面在指定的连接点被织入到目标对象中。

在目标对象的生命周期里有多个点可以进行织入∶
- **编译期**: 切面在目标类编译时被织入。这种方式需要特殊的编译器。AspectJ的织入编译器就是以这种方式织入切面的。
- **类加载期**: 切面在目标类加载到JVM时被织入。这种方式需要特殊的类加载器(ClassLoader) ,它可以在目标类被引入应用之前增强该目标类的字节码。AspectJ5的加载时织入(load-time weaving. LTW)就支持以这种方式织入切面。
- **运行期**: 切面在应用运行的某一时刻被织入。一般情况下，在织入切面时，AOP容器会为目标对象动态创建一个代理对象。SpringAOP就是以这种方式织入切面的。



## 动态代理
此种实现在设计模式上称为动态代理模式，在实现的技术手段上，都是在class 代码运行期，动态的织入字节码。

我们学习Spring 框架中的AOP，主要基于两种方式: **JDK 及CGLIB的方式**。
这两种方式的代理目标都是被代理类中的方法，在运行期，动态的织入字节码生成代理类。
- CGLIB是Java中的动态代理框架，主要作用就是根据目标类和方法，动态生成代理类。
- Java中的动态代理框架，几乎都是依赖字节码框架（如ASM，Javassist等)实现的。
- 字节码框架是直接操作class字节码的框架。可以加载已有的class字节码文件信息，修改部分信息，或动态生成一个class。

## JDK动态代理实现
JDK实现时，先通过实现 `InvocationHandler` 接口创建方法调用处理器，再通过`Proxy`来创建代理类。

以下是代码实现:
```java
import org.example.demo.service.AliPayService;  
import org.example.demo.service.PayService;  
import java.lang.reflect.InvocationHandler;  
import java.lang.reflect.Method;  
import java.lang.reflect.Proxy;

public class PayServiceJDKInvocationHandler implements InvocationHandler {  
    //目标对象即就是被代理对象  
    private Object target;  
  
    public PayServiceJDKInvocationHandler(Object target) {  
        this.target = target;  
    }  
  
    //proxy代理对象  
    @Override  
    public Object invoke(Object proxy, Method method, Object[] args) throw  
    s Throwable  
  
    {  
		//1.安全检查  
        System.out.println("安全检查");  
		//2.记录日志  
        System.out.println("记录日志");  
		//3.时间统计开始  
        System.out.println("记录开始时间");  
		//通过反射调用被代理类的方法  
        Object retVal = method.invoke(target, args);  
		//4.时间统计结束  
        System.out.println("记录结束时间");  
        return retVal;  
    }  
  
    public static void main(String[] args) {  
        PayService target = new AliPayService();  
		//方法调用处理器  
        InvocationHandler handler =  
                new PayServiceJDKInvocationHandler(target);  
		//创建一个代理类：通过被代理类、被代理实现的接口、方法调用处理器来创建  
        PayService proxy = (PayService) Proxy.newProxyInstance(  
                target.getClass().getClassLoader(),  
                new Class[]{PayService.class},  
                handler  
        );  
        proxy.pay;  
    }  
}
```

## CGLIB 动态代理实现
```java
import org.springframework.cglib.proxy.Enhancer;
import org.springframework.cglib.proxy.MethodInterceptor;
import org.springframework.cglib.proxy.MethodProxy;
import org.example.demo.service.AliPayService;
import org.example.demo.service.PayService;
import java.lang.reflect.Method;

public class PayServiceCGLIBInterceptor implements MethodInterceptor {  
    //被代理对象  
    private Object target;  
    public PayServiceCGLIBInterceptor(Object target){  
        this.target = target;  
    }  
    @Override  
    public Object intercept(Object o, Method method, Object[] args, Method  
            Proxy methodProxy) throws Throwable {  
		//1.安全检查  
        System.out.println("安全检查");  
		//2.记录日志  
        System.out.println("记录日志");  
		//3.时间统计开始  
        System.out.println("记录开始时间");  
		//通过cglib的代理方法调用  
        Object retVal = methodProxy.invoke(target, args);  
		//4.时间统计结束  
        System.out.println("记录结束时间");  
        return retVal;  
    }  
    
    public static void main(String[] args) {  
        PayService target= new AliPayService();  
        PayService proxy= (PayService) Enhancer.create(target.getClass(),n  
                ew PayServiceCGLIBInterceptor(target));  
        proxy.pay();  
    }  
}
```


## JDK 和 CGLIB 实现的区别
1. JDK动态代理: 反射 (速度快 , 反射实现代理)
	- 要求: 被代理类一定要实现接口
2. CGLIB 实现，通过实现代理类的子类来实现动态代理。它不能代理被final修饰类。



# SpringBoot 统一功能处理
其实也就是 AOP的实战环节 

本次主要实现三个功能:
1. 统一户登录权限验证
2. 统一数据格式返回
3. 统一异常处理


## 当前项目配置统一前缀
当前项目路径
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230523181729.png)


==在application.properties中配置==
```properties
server.servlet.context-path=/hhh
```
`server.servlet.context-path` 是 Spring Boot 中用于配置 Web 应用程序上下文路径(Context Path)的属性。在这种情况下，将 `server.servlet.context-path` 设置为 `/hhh`,意味着应用程序的上下文路径为 `http://localhost:8080/hhh`。

==在Config/AppConfig.java中配置==
```java
public class AppConfig  implements WebMvcConfigurer {
	@Override  
	public void configurePathMatch(PathMatchConfigurer configurer) {  
	    configurer.addPathPrefix("/emm" , c->true);  
	}
}
```
这段代码是使用 Spring AOP 配置一个 `PathMatchConfigurer` 接口的实现类，用于**拦截所有以 "`/emm`" 开头的请求**。具体来说，当请求的路径以 "`/emm`" 开头时，会执行 `c->true` 表达式所代表的方法，返回 true 表示匹配成功，否则返回 false 表示匹配失败。

这个配置可以用来实现一些常见的功能，比如：
-   统一管理某个资源的访问路径，例如将所有请求都路由到同一个处理逻辑；
-   对某些特定的请求进行拦截和处理，例如对以 "/api" 开头的请求进行鉴权等操作。



## 用户登录权限验证
说到统一的用户登录验证，我们想到的第一个实现方案是 Spring AOP 前置通知或环绕通知来实现，具体实现代码如下:
```java
@Aspect  
@Component  
public class UserAspect {  
    // 定义切点方法 controller 包下、子孙包下所有类的所有方法  
    @Pointcut("execution(* com.example.demo.controller..*.*(..))")  
    public void pointcut() {  
    }  
  
    // 前置方法  
    @Before("pointcut()")  
    public void doBefore() {  
    }  
  
    // 环绕方法  
    @Around("pointcut()")  
    public Object doAround(ProceedingJoinPoint joinPoint) {  
        Object obj = null;  
        System.out.println("Around 方法开始执行");  
        try {  
			// 执行拦截方法  
            obj = joinPoint.proceed();  
        } catch (Throwable throwable) {  
            throwable.printStackTrace();  
        }  
        System.out.println("Around 方法结束执行");  
        return obj;  
    }  
}
```

如果要在以上 Spring AOP的切面中实现用户登录权限效验的功能，有以下两个问题:
1. 没办法获取到HttpSession对象。
2. 我们要对一部分方法进行拦截，而另一部分方法不拦截，如注册方法和登录方法是不拦截的，这样的话排除方法的规则很难定义，甚至没办法定义。

所以我们需要学习 Spring 拦截器

### Spring 拦截器
对于以上问题Spring 中提供了具体的实现拦截器:`HandlerInterceptor`，拦截器的实现分为以下两个步骤∶
1. 创建自定义拦截器，实现 `HandlerInterceptor`接口的 `preHandle` (执行具体方法之前的预处理)方法。
2. 将自定义拦截器加入 `WebMvcConfigurer` 的 `addInterceptors`方法中。具体实现如下。

#### 自定义拦截器
- 实现 HandlerInterceptor 接口
- 重写 preHeadler 方法 , 在方法中编写自己的业务代码

==编写 Config/LoginInterceptor==
```java
public class LoginInterceptor implements HandlerInterceptor {  
    /**  
     * 此方法返回一个 boolean，如果为 true 表示验证成功，可以继续执行后续流程  
     * 如果是 false 表示验证失败，后面的流程不能执行了  
     */  
    @Override  
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {  
        HttpSession session = request.getSession(false);  
  
        // 用户登录业务判断  
        if(session != null && session.getAttribute("userinfo")!= null){  
            return true; // 说明用户已经登录  
        }  
  
        // 可以调整到登录页面 or 返回一个 401/403 没有权限码  
        response.sendRedirect("/login.html");  
//        response.setStatus(403);  
        return false;  
    }  
}
```


#### 将自定义拦截器加入到系统配置
将上一步中的自定义拦截器加入到系统配置信息中，具体实现代码如下︰
```java
public class AppConfig  implements WebMvcConfigurer {  
  
    @Override  
    public void addInterceptors(InterceptorRegistry registry) {  
        registry.addInterceptor(new LoginInterceptor())  
                .addPathPatterns("/**") //拦截所有请求  
                .excludePathPatterns("/user/login") //排除的url地址(不拦截的url地址)  
                .excludePathPatterns("/**/*.html");  
    }

	@Override  
	public void configurePathMatch(PathMatchConfigurer configurer) {  
	    configurer.addPathPrefix("/emm" , c->true);  
	}
}
```
其中:
- `addPathPatterns`:表示需要拦截的URL，“`**`”表示拦截任意方法（也就是所有方法)。 
- `excludePathPatterns`:表示需要排除的URL。

说明:以上拦截规则可以拦截此项目中的使用URL，包括静态文件(图片文件、JS和CSS等文件)。


***排除所有静态资源***
```java
@Override
public void addInterceptors(InterceptorRegistry registry) {
	registry.addInterceptor(new LoginInterceptor())
		.addPathPatterns("/**") // 拦截所有接口
		.excludePathPatterns("/**/*.js")
		.excludePathPatterns("/**/*.css")
		.excludePathPatterns("/**/*.jpg")
		.excludePathPatterns("/login.html")
		.excludePathPatterns("/**/login"); // 排除接口

	@Override  
	public void configurePathMatch(PathMatchConfigurer configurer) {  
		configurer.addPathPrefix("/emm" , c->true);  
	}
}
```

## 异常统一封装
- 创建一个类,在类上标识 `@ControllerAdvice`
- 添加方法 `@ExceptionHandler` 来订阅异常

```java
@ControllerAdvice  
@ResponseBody  
public class MyExHandler {  
  
    @ExceptionHandler(NullPointerException.class)  
    public HashMap<String , Object> nullException(NullPointerException e){  
        HashMap<String, Object> result = new HashMap<>();  
        result.put("code", "-1");  
        result.put("msg", "空指针异常：" + e.getMessage()); // 错误码的描述信息  
        result.put("data", null);  
        return result;  
    }  
  
    @ExceptionHandler(Exception.class)  
    public HashMap<String, Object> exception(Exception e) {  
        HashMap<String, Object> result = new HashMap<>();  
        result.put("code", "-1");  
        result.put("msg", "异常：" + e.getMessage()); // 错误码的描述信息  
        result.put("data", null);  
        return result;  
    }  
}
```

创建Controller/UserController.java 进行测试
```java
@RestController  
@RequestMapping("/user")  
public class UserController { 

    @RequestMapping("/login")  
    public String login() {  
        Object obj = null;  
        obj.hashCode();  //会报 空指针异常
        System.out.println("执行了 login~");  
        return "login~";  
    }  
  
    @RequestMapping("/reg")  
    public String reg() {  
        int num = 10 / 0;  //会报 除0异常
        System.out.println("执行了 reg~");  
        return "reg~";  
    }  
  
}
```
[localhost:8080/hhh/user/reg](http://localhost:8080/hhh/user/reg)
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230523145247.png)

![](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230523145434.png)


### @ControllerAdvice 注解
`@ControllerAdvice` 注解是 Spring MVC 框架中的一个注解，用于**定义全局的异常处理==类==**。通过使用该注解，我们可以将一些通用的异常处理逻辑统一放在一个类中，以便于在多个控制器或者其他组件中进行调用和使用。

具体来说，`@ControllerAdvice` 注解可以实现以下功能：
-   捕获并处理全局异常：通过定义一个全局异常处理类，我们可以在多个控制器或者其他组件中统一处理异常，而不必在每个地方都进行异常处理。
-   自定义异常处理逻辑：通过在异常处理类中添加自定义异常处理逻辑，我们可以更加灵活地处理不同类型的异常。
-   拦截请求并处理：除了处理异常之外，`@ControllerAdvice` 还可以拦截请求并进行相应的处理，例如权限验证、日志记录等。


### @ExceptionHandler 注解
`@ExceptionHandler` 注解是 Spring MVC 框架中的一个注解，用于**定义异常处理==方法==**。通过使用该注解，我们可以将一些特定的异常处理逻辑统一放在一个方法中，以便于在多个控制器或者其他组件中进行调用和使用。


### @ControllerAdvice  和 @ExceptionHandler 的区别
1.  作用范围不同：
	- `@ControllerAdvice`:全局异常处理类，可以处理所有控制器中的异常。
	- `@ExceptionHandler`:特定类型的异常处理方法，只能处理指定类型的异常。

2.  处理方式不同：
	- `@ControllerAdvice`:可以通过定义一个全局异常处理类来统一处理所有控制器中的异常。该类中可以定义多个异常处理方法，每个方法可以处理不同类型的异常。
	- `@ExceptionHandler`:可以通过在方法上添加 `@ExceptionHandler` 注解来定义特定类型的异常处理方法。该方法可以处理指定类型的异常，并且可以自定义异常处理逻辑。


## 统一数据返回格式
- 创建一个类, 并添加 `@ControllerAdvice`
- 实现`ResponseBodyAdvice`接口，并重写`supports`和`beforeBodyWrite`(统一对象就是此方法中实现的)

```java
@ControllerAdvice  
public class ResponseAdvice implements ResponseBodyAdvice {  
  
    @Resource  
    private ObjectMapper objectMapper;  
    /**  
     * 此方法返回 true 则执行下面 beforeBodyWrite 方法  
     * 反之则不执行  
     */  
    @Override  
    public boolean supports(MethodParameter returnType, Class converterType) {  
        return true;  
    }  
  
    @Override  
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType, Class selectedConverterType, ServerHttpRequest request, ServerHttpResponse response) {  
        HashMap<String , Object> result = new HashMap<>();  
        result.put("code" , 200);  
        result.put("msg", "");  
        result.put("data", body);  
        // 需要特殊处理，因为 String 在转换的时候会报错
        if(body instanceof String){  
            try {  
                return objectMapper.writeValueAsString(result);  
            } catch (JsonProcessingException e) {  
                e.printStackTrace();  
            }  
        }  
        return result;  
    }  
}
```

创建Controller/UserController.java 进行测试
```java
@RestController  
@RequestMapping("/user")  
public class UserController {  
  
    @RequestMapping("/getnum")  
    public Integer getNumber() {  
        return new Random().nextInt(10);  
    }  
  
   //@RequestMapping("/getuser")  
   //public String getUser() {  
   //    System.out.println("执行了 get User~");  
   //    return "get user";  
   //}  
}
```
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230523180047.png)

### ResponseBodyAdvice 接口
在Spring Boot中，ResponseBodyAdvice接口是一个回调接口，用于在Controller处理完请求后，将响应体进行修改或过滤。它的作用是在Controller方法返回的响应体前加入一些自定义的逻辑，例如：
-   对响应体进行加密、解密操作；
-   对响应体进行压缩、解压缩操作；
-   对响应体进行转换、过滤操作；
-   对响应体进行日志记录、统计操作等。

通过实现ResponseBodyAdvice接口，我们可以在Controller方法返回的响应体前加入自定义的逻辑，从而实现更加灵活的功能扩展。

#### supports 方法
该方法用于判断当前实现类是否支持指定类型的响应体。如果支持，则返回true;否则返回false。该方法的参数包括：响应体的类型、HttpMessageConverter的类型等。

#### beforeBodyWrite 方法
在Spring Boot中，`ResponseBodyAdvice`接口中的 `beforeBodyWrite` 方法是在**Controller方法返回的响应体被写入到HTTP客户端之前被调用的方法。它的作用是在响应体被写入HTTP客户端之前，对响应体进行一些自定义的处理**。

在`beforeBodyWrite` 方法中，可以通过HttpServletResponse对象获取到HTTP客户端发送的请求信息，例如请求头、请求参数等。我们可以利用这些信息来进行一些自定义的处理

需要注意的是，`beforeBodyWrite`方法只有在Controller方法返回的响应体被写入HTTP客户端之前被调用，因此它的执行顺序是在其他ResultHandler之后，但在ViewResolver之前。




## 拦截器实现原理
正常情况下的调用顺序:
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230523135543.png)


然而 有了拦截器之后，会在调 Controller 之前进 相应的业务处理，执 的流程如下图所示：
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230523135610.png)

### 实现原理源码分析
所有的 Controller 执行都会通过一个调度器 DispatcherServlet 来实现，这一点可以从 Spring Boot 控制台的打印信息看出，如下图所示：
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230523135946.png)

而所有方法都会执 DispatcherServlet 中的 `doDispatch` 调度方法，doDispatch 源码如下：
```java
protected void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {  
    HttpServletRequest processedRequest = request;  
    HandlerExecutionChain mappedHandler = null;  
    boolean multipartRequestParsed = false;  
    WebAsyncManager asyncManager = WebAsyncUtils.getAsyncManager(request);  
  
    try {  
        try {  
            ModelAndView mv = null;  
            Object dispatchException = null;  
  
            try {  
                processedRequest = this.checkMultipart(request);  
                multipartRequestParsed = processedRequest != request;  
                mappedHandler = this.getHandler(processedRequest);  
                if (mappedHandler == null) {  
                    this.noHandlerFound(processedRequest, response);  
                    return;                }  
  
                HandlerAdapter ha = this.getHandlerAdapter(mappedHandler.getHandler());  
                String method = request.getMethod();  
                boolean isGet = HttpMethod.GET.matches(method);  
                if (isGet || HttpMethod.HEAD.matches(method)) {  
                    long lastModified = ha.getLastModified(request, mappedHandler.getHandler());  
                    if ((new ServletWebRequest(request, response)).checkNotModified(lastModified) && isGet) {  
                        return;  
                    }  
                }  
                
				// 调用预处理【重点】
                if (!mappedHandler.applyPreHandle(processedRequest, response)) {  
                    return;  
                }  
                
				// 执行 Controller 中的业务
                mv = ha.handle(processedRequest, response, mappedHandler.getHandler());  
                if (asyncManager.isConcurrentHandlingStarted()) {  
                    return;  
                }  
  
                this.applyDefaultViewName(processedRequest, mv);  
                mappedHandler.applyPostHandle(processedRequest, response, mv);  
            } catch (Exception var20) {  
                dispatchException = var20;  
            } catch (Throwable var21) {  
                dispatchException = new NestedServletException("Handler dispatch failed", var21);  
            }  
  
            this.processDispatchResult(processedRequest, response, mappedHandler, mv, (Exception)dispatchException);  
        } catch (Exception var22) {  
            this.triggerAfterCompletion(processedRequest, response, mappedHandler, var22);  
        } catch (Throwable var23) {  
            this.triggerAfterCompletion(processedRequest, response, mappedHandler, new NestedServletException("Handler processing failed", var23));  
        }  
  
    } finally {  
        if (asyncManager.isConcurrentHandlingStarted()) {  
            if (mappedHandler != null) {  
                mappedHandler.applyAfterConcurrentHandlingStarted(processedRequest, response);  
            }  
        } else if (multipartRequestParsed) {  
            this.cleanupMultipart(processedRequest);  
        }  
  
    }  
}
```

从上述源码可以看出在开始执行 Controller 之前，会先调用 预处理 方法 applyPreHandle
applyPreHandle 法的实现源码如下：
```java
boolean applyPreHandle(HttpServletRequest request, HttpServletResponse response) throws Exception {  
    for(int i = 0; i < this.interceptorList.size(); this.interceptorIndex = i++) {  
	    // 获取项目中使用的拦截器 HandlerInterceptor
        HandlerInterceptor interceptor = (HandlerInterceptor)this.interceptorList.get(i);  
        if (!interceptor.preHandle(request, response, this.handler)) {  
            this.triggerAfterCompletion(request, response, (Exception)null);  
            return false;        
        }  
    }  
  
    return true;  
}
```
从上述源码可以看出，在 applyPreHandle 中会获取所有的拦截器 HandlerInterceptor 并执行拦截器中的 preHandle 方法，这样就会咱们前面定义的拦截器对应上了，如下图所示：
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230523140440.png)
此时用户登录权限的验证方法就会执行，这就是拦截器的实现原理。






























