
# 日志有什么用？
日志是程序的重要组成部分，想象一下，如果程序报错了，不让你打开控制台看日志，那么你能找到报错的原因吗?
>答案是否定的，写程序不是买彩票，不能完全靠猜，因此日志对于我们来说,最**主要的用途就是排除和定位问题**。

除了**发现和定位问题**之外，我们还可以通过日志实现以下功能:
- 记录用户登录日志，方便分析用户是正常登录还是恶意破解用户。
- 记录系统的操作日志，方便数据恢复和定位操作人。
- 记录程序的执行时间，方便为以后优化程序提供数据支持。以上这些都是日志提供的非常实用的功能。

# 日志怎么用?
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230521165938.png)

以上内容就是 Spring Boot输出的控制台日志信息。通过上述日志信息我们能发现以下3个问题:
- Spring Boot内置了日志框架(不然也输出不了日志)。
- 默认情况下，输出的日志并非是开发者定义和打印的，那开发者怎么在程序中自定义打印日志呢？
- 日志默认是打印在控制台上的，而控制台的日志是不能被保存的，那么怎么把日志永久的保存下来呢?

# 自定义日志打印
开发者自定义打印日志的实现步骤：
- 在程序中得到日志对象。
- 使用日志对象的相关语法输出要打印的内容。


## 在程序中得到日志对象
在程序中获取日志对象需要使用日志工厂`LoggerFactory`，如下代码所示
```java
// 1.得到日志对象
private static Logger logger = LoggerFactory.getLogger(UserController.class);
```
>日志工厂需要将每个类的类型传递进去，这样我们才知道日志的归属类，才能更方便、更直观的定位到问题类。

注意: **Logger对象是属于`org.slf4j`包下的**，不要导入错包。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230521170822.png)

因为Spring Boot中内置了日志框架Slf4j，所以咱们可以直接在程序中调用slf4j来输出日志。

### 常见的日志框架说明
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230521171732.png)

开发者使用 日志门面 ， 而 SLF4J 会选择自动选择日志的实现框架
>在日志框架中, 每个日志框架的调用方式都有所不同, 如果把这些工作交给开发者,那就太麻烦了, 所以 SLF4J 应运而生 , 开发者只需要调用 SLF4J 即可

## 使日志对象打印日志
日志对象的打印方法有很多种，我们可以先使 info() 方法来输出日志，如下代码所示：
```java
@Controller  
@ResponseBody  
@RequestMapping("/user")  
public class UserController {  
  
    private static Logger logger = LoggerFactory.getLogger(UserController.class);  
  
    @RequestMapping("/hi")  
    public String sayHi(){  
        logger.info("--------------要输出日志的内容----------------");  
        return "Hi";  
    }  
}
```
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230521175704.png)


## 日志格式说明
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230521175721.png)


## 更简单的打印日志
使用注解 `@Slf4j`
```java
@Controller  
@ResponseBody  
@RequestMapping("/user")  
@Slf4j  
public class UserController {  
  
    @RequestMapping("/hi")  
    public String sayHi() {  
        // 写日志  
        log.trace("我是 trace");  
        log.debug("我是 debug");  
        log.info("我是 info");  
        log.warn("我是 warn");  
        log.error("我是 error");  
        System.out.println("我是 System.");  
        return "Hi,Spring Boot.";  
    }  
}
```


# 日志级别

## 日志级别的作用？
- 日志级别可以帮你筛选出重要的信息，比如设置日志级别为error，那么就可以只看程序的报错日志了，对于普通的调试日志和业务日志就可以忽略了，从而节省开发者信息筛选的时间。

- 日志级别可以控制不同环境下，一个程序是否需要打印日志，如开发环境我们需要很详细的信息，而生产环境为了保证性能和安全性就会输入尽量少的日志，而通过日志的级别就可以实现此需求。


## 日志级别的分类和使用
日志的级别分为:
- `trace`:微量，少许的意思，级别最低;
- `debug`:需要调试时候的关键信息打印;
- `info`:普通的打印信息（默认日志级别);
- `warn`:警告，不影响使用，但需要注意的问题;
- `error`:错误信息，级别较高的错误日志信息;
- `fatal`:致命的，因为代码异常导致程序退出执行的事件。

日志级别的顺序：
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230521180012.png)

越往上接收到的消息就越少，如设置了warn 就只能收到warn、error、fatal级别的日志了。

>日志级别规则:当程序中设置了日志级别之后，那么程序只会打印和设置级别相同和大于当前日志级别的日志，小于当前级别的日志不会输出。

`System. out. println` 对比 日志框架两个致命的缺点:
1. 打印信息不全（没有打印日志的时间、没有打印日志的来源)
2. 不能实现日志打印的隐藏和显示
3. System. out.println打印的目志不能被持久化。

## 日志级别设置
日志级别配置只需要在配置文件中设置“`logging.level`”配置项即可，如下所示：(这里使用的配置文件时 yml)
```yml
logging:
	level:
		root: error
```

### 根据不同目录设置不同的日志级别
日志级别的设置非常灵活:  针对不同的目录设置不同的日志级别
```yml
logging:
	level:
		root: error
		com:
			example:
				demo:
					controller: trace
					service: info
```


# 日志持久化
以上的日志都是输出在控制台上的，然而在生产环境上咱们需要将日志保存下来，以便出现问题之后追溯问题，把日志保存下来的过程就叫做持久化。

想要将日志进行持久化，只需要在配置文件中指定日志的存储目录或者是指定日志保存文件名之后，Spring Boot就会将控制台的日志写到相应的目录或文件下了。

**配置日志文件的保存路径:**
```yml
# 设置日志文件的目录
logging:
	file:
		path: s:/tmep
```

配置日志文件的文件名：
```yml
# 设置日志文件的文件名
logging:
	file:
		name: s:/tmep/spring-1204.log
```

# 更简单的日志输出一lombok
每次都使用LoggerFactory.getLogger(xxx.class)很繁琐，且每个类都添加一遍，也很麻烦，这里讲一种更好用的日志输出方式，使用lombok 来更简单的输出。
1. 添加lombok框架支持。
2. 使用`@Slf4j` 注解输出日志。

[[Lombok|Lombok使用说明]]

```java
@RestController
@RequestMapping("/p")
@Slf4j
public class PersonController {
	@RequestMapping("/log")
	public void loggerTest() {
		//log是Slf4j自带的对象
		log.error("------------------- error -----------------");
	}
}
```
>注意∶使用`@Slf4j`注解，在程序中使用log对象即可输入日志，并且只能使用`log`对象才能输出,这是 lombok提供的对象名。


# 总结
日志是程序中的重要组成部分，使用日志可以快速的发现和定位问题，Spring Boot 内容了日志框架,默认情况下使用的是 info日志级别将日志输出到控制台的，我们可以通过lombok提供的`@SIf4j`注解和 log 对象快速的打印自定义日志，日志包含6个级别:
- `trace`:微量，少许的意思，级别最低;
- `debug`:需要调试时候的关键信息打印;
- `info`:普通的打印信息;
- `warn`:警告，不影响使用，但需要注意的问题;
- `error`:错误信息，级别较高的错误日志信息;
- `fatal`:致命的，因为代码异常导致程序退出执行的事件。

日志级别依次提升，而日志界别越高，收到的日志信息也就越少，我们可以通过配置日志的保存名称或保存目录来将日志永久地保存下来。



















































