经过前面的学习我们已经知道了，Spring 就是一个包含了众多工具方法的 IoC 容器。既然是容器那么它就具备两个最基本的功能：
- 将对象存储到容器（Spring）中；
- 从容器中将对象取出来。

在 Java 语言中对象也叫做 Bean，所以后面咱们再遇到对象就以 Bean 著称。

# 在Intelij IDEA中修改maven为国内镜像（阿里）
在Intelij IDEA中修改maven为国内镜像（阿里）
国内镜像：阿里

打开IntelliJ IDEA->Settings ->Build, Execution, Deployment -> Build Tools > Maven

或者直接搜索maven
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230514212949.png)
一般情况下在`C:\Users\xx.m2`\这个目录下面没有settings.xml文件，我们可以新建一个，settings.xml文件下的内容是：直接粘贴复制保存在上图所示的目录下面就可以了. 需要注意的是，需要点击上图所示右下角的override。
```xml
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0
                          https://maven.apache.org/xsd/settings-1.0.0.xsd">
      
      <mirrors>
      <mirror>  
          <id>alimaven</id>  
          <name>aliyun maven</name>  
          <url>http://maven.aliyun.com/nexus/content/groups/public/</url>  
          <mirrorOf>central</mirrorOf>          
      </mirror>  
      </mirrors>
</settings>
```

# 创建Spring项目
接下来使用 Maven 方式来创建一个 Spring 项目，创建 Spring 项目和 Servlet 类似，总共分为以下 3步：
1. 创建一个普通 Maven 项目。
2. 添加 Spring 框架支持（spring-context、spring-beans）。
3. 添加启动类。

## 创建一个Maven项目
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230514210857.png)

下一步
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230514211041.png)

## 添加Spring框架支持
在项目的 pom.xml 文件中添加 Spring框架的项目依赖 , xml配置如下
```xml
<dependencies>
	<dependency>
		<groupId>org.springframework</groupId>
		<artifactId>spring-context</artifactId>
		<version>5.2.3.RELEASE</version>
	</dependency>
	
	<dependency>
		<groupId>org.springframework</groupId>
		<artifactId>spring-beans</artifactId>
		<version>5.2.3.RELEASE</version>
	</dependency>
</dependencies>
```
从上述配置中可以看出，添加的框架有 spring-context：spring 上下文，还有 spring-beans：管理对象的模块。

## 添加启动类
最后在创建好的项目 java 文件夹下创建一个启动类，包含 main 方法即可：
```java
public class App {  
    public static void main(String[] args) {  
          
    }  
}
```

# 存储Bean对象
存储 Bean 分为以下 2 步：
1. 存储 Bean 之前，先得有 Bean 才行，因此先要创建一个 Bean。
2. 将创建的 Bean 注册到 Spring 容器中。

具体实现如下

## 创建 Bean
所谓的 Bean 就是 Java 语言中的一个普通对象
```java
public class User {  
    public String sayHi(String name){  
        return name + "hello";   
	}  
}
```

## 将 Bean 注册到容器
在创建好的项目中添加 Spring 配置文件 spring-config.xml，将此文件放到 resources 的根目录下

如下图所示：
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230514213658.png)

**如果resources目录下没有 xml 文件的话, 可以创建一个, 命名是无所谓的, 但还是最好遵守规范, 能让人一目了然是什么作用的文件**.

Spring 配置文件的固定格式为以下内容（以下内容无需记忆，只需要保存到自己可以找到的地方就可以了，因为它是固定不变的）：
```xml
<?xml version="1.0" encoding="UTF-8"?>  
<beans xmlns="http://www.springframework.org/schema/beans"  
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">  
  
</beans>
```

接下来，再将 User 对象注册到 Spring 中就可以，具体操作是在 `<beans>` 中添加如下配置：
```java
<beans>
	<bean id="user" class="User"></bean>
</beans>
```
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230516083633.png)



完整代码如下:
```xml
<?xml version="1.0" encoding="UTF-8"?>  
<beans xmlns="http://www.springframework.org/schema/beans"  
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">  
       
    <bean id="user" class="User"></bean>  

</beans>
```

# 获取并使用 Bean 对象
获取并使用 Bean 对象，分为以下 3 步：
1. 得到 Spring 上下文对象，因为对象都交给 Spring 管理了，所以获取对象要从 Spring 中获取，那么就得先得到 Spring 的上下文。
2. 通过 Spring 上下文，获取某一个指定的 Bean 对象。
3. 使用 Bean 对象。

>如果取多个 Bean 的话重复以上第 2、3 步骤。

## 创建 Spring 上下文
Spring 上下文对象可使用 ApplicationContext，实现代码如下：
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230514214609.png)

>注意: ![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230516084142.png)


除了 ApplicationContext 之外，我们还可以使用 BeanFactory 来作为 Spring 的上下文，如下代码所示, (此方法不建议使用, 因为是准备弃用的方法了)
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230514214833.png)



ApplicationContext 和 BeanFactory 效果是一样的，ApplicationContext 属于 BeanFactory 的子类，它们的区别如下 

### ApplicationContext VS BeanFactory (常见面试题)
- 继承关系和功能方面来说：Spring 容器有两个顶级的接口：BeanFactory 和ApplicationContext。其中 **BeanFactory 提供了基础的访问容器的能力，而 ApplicationContext属于 BeanFactory 的子类，它除了继承了 BeanFactory 的所有功能之外，它还拥有独特的特性，还添加了对国际化支持、资源访问支持、以及事件传播等方面的支持**。
- 从性能方面来说：ApplicationContext 是一次性加载并初始化所有的 Bean 对象，而BeanFactory 是需要那个才去加载那个，因此更加轻量。

>PS：而 ClassPathXmlApplicationContext 属于 ApplicationContext 的子类，拥有ApplicationContext 的所有功能，是通过 xml 的配置来获取所有的 Bean 容器的

## 获取指定的 Bean 对象
```java
public class App {  
    public static void main(String[] args) {  
        //得到Spring的上下文对象, 创建的时候需要配置 Spring 配置信息  
        ApplicationContext context = new ClassPathXmlApplicationContext("spring-config.xml");  
  
        // 加载 User 这个 bean        
        User user = (User)context.getBean("user");  
    }  
}
```

***注意事项***
Bean 的id要一一对应 , 如下图所示
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230514221927.png)


### getBean方法 的更多用法
`getBean()` 方法有很多种重载方法，我们也可以使用其他方式来获取 Bean 对象，比如以下这三种：

***根据名称获取Bean***
```java
User user = (User)context.getBean("user");
```


***根据类型获取 Bean：***
```java
User user = context.getBean(User.class);
```
这种方法可以, 不用指定别名, 但是有缺点, 但一个类有多个Bean时 , 使用类型获取对象会报错.

如:
```xml
<?xml version="1.0" encoding="UTF-8"?>  
<beans xmlns="http://www.springframework.org/schema/beans"  
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">  
    <bean id="user1" class="User"></bean>  
    <bean id="user2" class="User"></bean>  
</beans>
```

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230514222823.png)
以上场景就会导致程序报错，如下图所示:
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230514222923.png)


***名称 + 类型获取 Bean：***
```java
User user = context.getBean("user" , User.class);
```


## 使用Bean
```java
public class App {  
    public static void main(String[] args) {  
        //得到Spring的上下文对象  
        ApplicationContext context = new ClassPathXmlApplicationContext("spring-config.xml");  
  
        // 加载 User 这个 bean        
        User user = context.getBean("user" , User.class);  
        
        //调用相应的方法  
        System.out.println(user.sayHi("bit-zero"));  
    }  
}
```

# 总结
1. 操作容器之前，先要有容器，所以先要得到容器。
2. 存对象
	- 创建 Bean（普通类）。
	- 将 Bean 注册（配置）到 spring-confing.xml 中。
3. 取对象
	- 得到 Spring 上下 ，并读取到 Spring 的配置 件。
	- 获取某 个 Bean 对象。
	- 使 Bean 对象。

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230514223443.png)














