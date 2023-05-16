# Spring Boot概述
## 1.什么是Spring Boot?
Spring 的诞生是为了简化Java程序的开发的，而Spring Boot的诞生是为了简化Spring程序开发的。

Spring Boot翻译一下就是Spring 脚手架，什么是脚手架呢?
>- 盖房子的这个架子就是脚手架，脚手架的作用是砌筑砖墙，浇筑混凝土、方便墙面抹灰，装饰和粉刷的，简单来说，就是使用脚手架可以更快速的盖房子。
>- 而Spring Boot就是Spring 框架的脚手架，它就是为了快速开发Spring框架而诞生的。:


## Spring Boot的优点
- 快速集成框架，Spring Boot 提供了启动添加依赖的功能，用于秒级集成各种框架。
- 内置运行容器，无需配置Tomcat等 Web 容器，直接运行和部署程序。
- 快速部署项目，无需外部容器即可启动并运行项目。
- 可以完全抛弃繁琐的XML，使用注解和配置的方式进行开发。
- 支持更多的监控的指标，可以更好的了解项目的运行情况。


# Spring Boot 项目创建
我本人使用的是 idea2021.3.3专业版 , 自带了Spring Boot项目的创建 ,  所以创建Spring boot项目并不困难. 但这里还是简单介绍一下社区版如何安装Spring Boot.

## idea 社区版安装 Spring boot
最好使用 2021.3.2 的idea社区版 , 最新版本或超过2021.3.2版本的, 安装插件后有可能会收费.

1. 进入 markplace 搜索 Spring Boot Helper , 然后进行安装
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230516091915.png)

2. 安装好之后，它的名字就变成了Spring Initializr and Assistant
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230516092158.png)


之后的创建就和idea专业版一样了

## idea专业版创建Spring Boot项目
1. 配置 Spring Boot 
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230516092712.png)

2. 点击finish完成创建
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230516093150.png)

**目前Spring Boot的大版本已经更新到 3.0.X ,但 Spring Boot3 要求的最低Java版本是JDK17 , 而我们目前学习的是Spring boot2 , 所以使用 Java8 即可. 在选择Spring Boot版本是也选择 2.X.X**


## 网页版创建
不使用ldea也可以创建Spring Boot 项目，我们可以使用Spring官方提供的网页版来创建Spring Boot项目。

网页版创建项目先访问: https://start.spring.io
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230516094441.png)

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230516094447.png)

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230516094450.png)

然后再使用 Idea 打开之后，Spring Boot 项目就算创建成功了

# Spring Boot目录介绍
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230516102357.png)



# 运行项目
```java
@SpringBootApplication  
public class SpringBootDemoApplication {  
  
    public static void main(String[] args) {  
        SpringApplication.run(SpringBootDemoApplication.class, args);  
    }  
  
}
```
点击启动类的main方法就可以运行Spring Boot项目了

# 输出Hello world
我们学习JavaEE就是用来实现 Web项目或接口的，而之前是Spring其实是一个普通Java项目，没办法直接和浏览器进行互动，所以接下来我们要用Spring Boot来实现和浏览器及用户的交互。I
```java
@RestController  
@RequestMapping("/user")  
public class UserController {  
  
    @RequestMapping("/sayhi")  
    public String sayHi(){  
        return "Hi , Spring Boot";  
    }  
}
```

重新启动项目，访问[http://localhost:8080/user/sayhi](http://localhost:8080/user/sayhi)或[http://127.0.0.1:8080/user/sayhi](http://127.0.0.1:8080/user/sayhi) 最终效果如下:
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230516103106.png)



# 注意事项
我们尝试将controller移动到其他包下，比如以下几种方式:
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230516105839.png)

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230516105845.png)

运行我们的项目，发现程序报错了，如下图所示：
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230516110318.png)

**这说明Spring Boot项目没有将对象注入到容器中。**l

## 正确路径
当我们把要注入到容器类和启动类放到同级目录下时
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230516110425.png)

这时候Spring Boot项目才能正常的将bean注入到容器中。

## 小结：约定大于配置
以上情况反应了Spring Boot 项目的另一个特点:约定大于配置。

对比 Spring 的项目我们也可以看到这一特点，比如在Spring 中也是要配置Bean 的扫描路径的，而Spring Boot 则不需要，Spring 配置如下:
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230516110849.png)


# 总结
Spring Boot是为了快速开发Spring 而诞中● Spring Boot具备∶:
- 快速集成框架，Spring Boot提供了启动添加依赖的功能，用于秒级集成各种框架。
- 内置运行容器，无需配置Tomcat 等 Web容器，直接运行和部署程序。
- 快速部署项目，无需外部容器即可启动并运行项目。
- 可以完全抛弃繁琐的XML，使用注解和配置的方式进行开发。·支持更多的监控的指标，可以更好的了解项目的运行情况等特点。

Spring Boot可使用 idea 或网页创建，它的**设计思想是==约定大于配置==**，类上标注`@SpringBootApplication`就可以启动Spring Boot 项目了。





























