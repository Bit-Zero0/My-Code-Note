# 配置文件作用
整个项目中所有重要的数据都是在配置文件中配置的，比如:
- 数据库的连接信息(包含用户名和密码的设置);
- 项目的启动端口;
- 第三方系统的调用秘钥等信息;
- 用于发现和定位问题的普通日志和异常日志等。

想象一下如果没有配置信息，那么Spring Boot项目就**不能连接和操作数据库**，甚至是**不能保存可以用于排查问题的关键日志**，所以配置文件的作用是非常重要的。


# 配置文件格式简述
配置文件有两种格式分别：**properies** 和**yml**（yaml）。

**properties** 是Java 中的常用的一种配置文件格式，key=value。key 是唯一的，文件扩展名为properties。
**yml**（YAML Ain't Markup Language）也看做是yaml，是一种做配置文件的数据格式，基本的语法`key:[空格]值`。yml 文件文件扩展名是yaml 或yml（常用）。

## yml 格式特点：
### YAML 基本语法规则：
- 大小写敏感
- 使用缩进表示层级关系
- 缩进只可以使用空格，不允许使用Tab 键
- 缩进的空格数目不重要，相同层级的元素左侧对齐即可
- `#`字符表示注释，只支持单行注释。`#`放在注释行的第一个字符

YML 缩进必须使用空格，而且区分大小写，建议编写YML 文件只用小写和空格。


### YAML 支持三种数据结构
- 对象：键值对的集合，又称为映射（mapping）/ 哈希（hashes） / 字典（dictionary）
- 数组：一组按次序排列的值，又称为序列（sequence） / 列表（list）
- 标量（scalars）：单个的、不可再分的值，例如数字、字符串、`true|false` 等

需要掌握数据结构完整内容，可从[https://yaml.org/type/index.html](https://yaml.org/type/index.html) 获取详细介绍。

>- Spring Boot 建议使用一种格式的配置文件，如果properties 和yml 都存在。properties 文件优先。推荐使用yml文件。
>- application 配置文件的名称和位置都可以修改。约定名称为application，位置为resources 目录。

# properties 配置文件说明
properties 配置文件是最早期的配置文件格式，也是创建 Spring Boot 项目默认的配置文件.

## properties基本语法
properties 是以键值的形式配置的，key 和 value 之间是以“=”连接的
```properties
# 配置项目端口号
server.port=8084
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/testdb?characterEncoding=utf8
spring.datasource.username=root
spring.datasource.password=root
```

>PS：小技巧：配置文件中使用“`#`”来添加注释信息。


## 读取配置文件
如果在项目中，想要主动的读取配置文件中的内容，可以使用 @Value 注解来实现。
`@Value` 注解使用“`${}`”的格式读取，如下代码所示：

application.properties 文件内容
```properties
server.port=8084
```

```java
@Component  
public class ReadProperties {  
    @Value("${server.port}")  
    private String port;  
  
    @PostConstruct  
    public void postConstruct(){  
        System.out.println("Read propertiess "+ port);  
    }  
}
```

执行结果:
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230516141228.png)

>@Component 在 Spring Boot启动时候会注入到框架中，注入到框架中时会执行@PostConstruct初始化方法，这个时候就能读取到配置信息了。


## properties缺点分析
properties 配置是以 key-value 的形式配置的，如下图所示：
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230516141453.png)

从上述配置key看出，properties 配置文件中会有很多的冗余的信息， 如这些：
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230516141514.png)


想要解决这个问题，就可以使 yml 配置文件的格式化了。


# yml文件配置
yml是YAML是缩写，它的全称Yet Another Markup Language翻译成中文就是“另一种标记语言”。

**YML 优点分析**
- yml是一个可读性高，写法简单、易于理解，它的语法和JSON语言类似。
- yml支持更多的数据类型，它可以简单表达清单（数组)、散列表，标量等数据形态。它使用空白符号缩进和大量依赖外观的特色，特别适合用来表达或编辑数据结构、各种配置文件等。
- **yml支持更多的编程语言**，它不止是Java中可以使用在 Golang、PHP、Python、Ruby、JavaScript、Perl中。



## yml基本语法
yml是树形结构的配置文件，它的**基础语法是“key: value”，注意key和 value之间使用英文冒汗加空格的方式组成的,其中的空格不可省略**。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230516141807.png)

其中第一项的配置为正确的， key也是高亮显示的，而第二项没有空格是错误的使用方式，第二项的key也没有高亮显示。


***使用 yml 连接数据库***
```yml
spring:  
  datasource:  
    url: jdbc:mysql://127.0.0.1:3306/dbname?characterEncoding=utf8  
    username: root  
    password: root
```

**yml和properties连接数据库配置对比**

properties
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230516142239.png)

yml
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230516142249.png)


由此可见 yml配置要比 properties 要简洁很多.

## yml 使用进阶

### yml配置不同的数据类型及null
```yml
# 字符串
string.value: Hello

# 布尔值，true或false
boolean.value: true
boolean.value1: false

# 整数
int.value: 10
int.value1: 0b1010_0111_0100_1010_1110 # 二进制

# 浮点数
float.value: 3.14159
float.value1: 314159e-5 # 科学计数法

# Null，~代表null
null.value: ~
```


### yml配置读取
yml配置内容
```yml
Hello: 你好
```

yml 读取配置的方式和 properties 相同，使用 `@Value` 注解即可，实现代码如下
```java
@Component  
public class Read {  
    @Value("${Hello}")  
    private String hello;  
  
    @PostConstruct  
    public void postConstruct(){  
        System.out.println("Read yml "+ hello);  
    }  
}
```

执行结果
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230516143154.png)



### value 值加单双引号
字符串默认不用加上单引号或者双引号，如果加英文的单双引号可以表示特殊的含义。
尝试在 application.yml 中配置如下信息：
```yml
string:  
  str1: Hello \n Spring  
  str2: 'Hello \n Spring'  
  str3: "Hello \n Spring"
```


```java
@Component  
public class Read {  
    @Value("${string.str1}")  
    private String str1;  
  
    @Value("${string.str2}")  
    private String str2;  
  
    @Value("${string.str3}")  
    private String str3;  
  
    @PostConstruct  
    public void postConstruct(){  
        System.out.println("string.str1" + str1);  
        System.out.println("string.str2" + str2);  
        System.out.println("string.str3" + str3);  
    }  
}
```

执行结果:
![](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230516143941.png)

从上述结果可以看出:
- 字符串默认不用加上单引号或者双引号。
- 单引号会转义特殊字符，特殊字符最终只是一个普通的字符串数据。
- 双引号不会转义字符串里面的特殊字符；特殊字符会作为本身想表示的意思。


### 配置对象
我们还可以在 yml 中配置对象，如下配置：
```yml
student:  
  id: 1  
  name: bit-zero  
  age: 18    
```

或者行内式写法(与上面的写法作用一样)
```yml
student: {id: 1,name: bit-zero,age: 18}
```


这个时候就不能用 `@Value` 来读取配置中的对象了，此时要使用另一个注解`@ConfigurationProperties` 来读取

具体实现如下
```java
@Component  
@ConfigurationProperties("student")  
@Data  
public class StudentComponent {  
    private int id ;  
    private String name;  
    private int age;  
}
```

注意：以上代码中的 getter 和 setter 方法不能省略。只不过我们上面使用了lombok


调用类实现:
```java
@Component  
public class Read {  
    @Autowired  
    private StudentComponent studentComponent;  
  
    @PostConstruct  
    public void postConstruct(){  
        System.out.println(studentComponent);  
    }  
}
```

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230516151414.png)



### 配置集合
配置文件也可以配置 list 集合
```yml
dbtypes:
	name:
		- mysql
		- sqlserver
		- db2
```

或者行内式写法
```yml
dbtypes: {name: [mysql,sqlserver,db2]}
```


集合的读取和对象一样，也是使用 `@ConfigurationProperties` 来读取的
```java
@Component
@ConfigurationProperties("dbtypes")
@Data
public class ListConfig {
	private List<String> name;
}
```

调用类实现:
```java
@Component
public class ReadYml2 {
	@Autowired
	private ListConfig listConfig;
	
	@PostConstruct
	public void postConstruct() {
		System.out.println(listConfig.getName());
	}
}
```

[更多Spring boot系统配置项](https://docs.spring.io/spring-boot/docs/current/reference/html/application-properties.html#appendix.application-properties)

# properties VS yml
- properties是以key=value 的形式配置的键值类型的配置文件，而yml使用的是类似json格式的树形配置方式进行配置的,yml 层级之间使用换行缩进的方式配置，key和value之间使用“:”英文冒号加空格的方式设置，并且空格不可省略。
- properties为早期并且默认的配置文件格式，但其配置存在一定的冗余数据，使用yml可以很好的解决数据冗余的问题。
- yml通用性更好，支持更多语言，如Java、Go、Python等，如果是云服务器开发，可以使用一份配置文件作为Java和Go 的共同配置文件。
- yml支持更多的数据类型。


# 设置不同环境的配置文件
1. 创建不同环境的配置文件：
>application-dev.yml     这是代表开发环境
>application-prod.yml    这是代码生产环境

2. 在 application.yml 中设置运行环境
>spring.profiles.active=dev