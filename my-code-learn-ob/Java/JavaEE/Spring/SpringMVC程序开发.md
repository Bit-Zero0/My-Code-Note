
# 什么是Spring MVC? 
Spring MVC 是非常著名的Web 应用框架，现在的大多数Web 项目都采用Spring MVC。它与Spring 有着紧密的关系。是Spring 框架中的模块，专注Web 应用，能够使用Spring 提供的强大功能，IoC , Aop 等等。

Spring MVC 框架是底层是基于Servlet 技术。遵循Servlet 规范，Web 组件Servlet，Filter，Listener 在SpringMVC中都能使用。同时Spring MVC 也是基于MVC 架构模式的，职责分离，每个组件只负责自己的功能，组件解耦。学习Spring MVC 首先具备Servlet 的知识，关注MVC 架构的M、V、C 在Spring MVC 框架中的实现。掌握了这些就能熟练的开发Web 应用。

Spring Boot 的自动配置、按约定编程极大简化，提高了Web 应用的开发效率

从上述定义我们可以得出两个关键信息：
>1. Spring MVC 是一个 Web 框架。
>2. Spring MVC 是基于 [[Servlet|Servlet API]] 构建的。


## MVC定义
MVC 是 `Model` ,  `View` ,  `Controller` 的缩写，它是软件工程中的一种软件架构模式，它把软件系统分为模型、视图和控制器三个基本部分

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230520211429.png)

**Model（模型）** :是应用程序中用于处理应用程序数据逻辑的部分。通常模型对象负责在数据库中存取数据。
**View（视图）**:是应用程序中处理数据显示的部分。通常视图是依据模型数据创建的。
**Controller（控制器）**: 是应用程序中处理用户交互的部分。通常控制器负责从视图读取数据，控制用户输入，并向模型发送数据。


# 为什么要学 Spring MVC？
现在**绝大部分的Java项目都是基于Spring (或Spring Boot)的，而Spring 的核心就是SpringMVC**。也就是说Spring MVC 是Spring 框架的核心模块，而 Spring Boot是 Spring的脚手架，因此我们可以推断出，现在市面上绝大部分的Java项目约等于Spring MVC项目，这是我们要学SpringMVC的原因。





# Spring MVC主要学些什么?
学习Spring MVC 我们只需要掌握以下3个功能:
1. **连接的功能**:将用户（浏览器）和Java程序连接起来，也就是访问一个地址能够调用到我们的Spring程序。
2. **获取参数的功能**:用户访问的时候会带一些参数，在程序中要想办法获取到参数
3. **输出数据的功能**∶执行了业务逻辑之后，要把程序执行的结果返回给用户。

>对于Spring MVC 来说，掌握了以上3个功能就相当于掌握了Spring MVC



# Spring MVC创建和连接
Spring MNC项目创建和Spring Boot创建项目相同(Spring MVC使用Spring Boot的方式创建) ,在创建的时候选择Spring Web 就相当于创建了Spring MVC的项目。

在**Spring MVC 中使用`@RequestMapping` 来实现URL路由映射**，也就是浏览器连接程序的作用。接下来要实现的功能是访问地址: [http://localhost:8080/user/hi](http://localhost:8080/user/hi) 能打印“hello，spring mvc”信息。

## 创建MVC项目
在创建Spring Boot 项目时，我们勾选的**Spring Web**框架其实就是Spring MVC框架，如下图所示:
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230520212426.png)

>简单来说，咱们之所以要学习Spring MVC是因为它是一切项目的基础，我们以后创建的所有Spring、Spring Boot 项目基本都是基于Spring MVC的。

接下来，创建一个 UserController 类，实现用户到 Spring 程序的互联互通，具体实现代码如下：
```java
@Controller // 让 spring 框架启动时，加载
@ResponseBody // 返回非页面数据
@RequestMapping("/user") // 路由器规则注册
public class UserController {
	// 路由器规则注册
	@RequestMapping("/hi")
		public String sayHi(){
		return "Hi. Spring MVC";
	}
}
```
接下来要实现的功能是访问地址: [http://localhost:8080/user/hi](http://localhost:8080/user/hi) 能打印“`Hi,Spring MVC`.”信息。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230520213623.png)

### @RequestMapping 注解介绍
`@RequestMapping`是Spring Web应用程序中最常被用到的注解之一,它是用来注册接口的路由映射的。

>路由映射:所谓的路由映射指的是，当用户访问一个url时，将用户的请求对应到程序中某个类的某个方法的过程就叫路由映射。

`@RequestMapping` 即可修饰类，也可以修饰方法，当修饰类和方法时，访问的地址是类 + 方法。

`@RequestMapping` 也可以直接修饰方法，代码实现如下：
```java
@Controller  
@ResponseBody   // 定义返回的数据格式为非视图（text/html）
public class UserController {  
    @RequestMapping("/hi")  
    public String sayHi(){  
        return "Hi. Spring MVC";  
    }  
}
```

访问地址: [localhost:8080/hi](http://localhost:8080/hi)

### @RequestMapping 是post 还是 get 请求 ?
使用 PostMan 测试一下，默认情况下使用注解 @RequestMapping 是否可以接收 GET 或 POST 请求？

还是这段代码
```java
@Controller // 让 spring 框架启动时，加载
@ResponseBody // 返回非页面数据
@RequestMapping("/user") // 路由器规则注册
public class UserController {
	// 路由器规则注册
	@RequestMapping("/hi")
		public String sayHi(){
		return "Hi. Spring MVC";
	}
}
```

使用 postman 进行 GET 和 POST请求
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230520214846.png)

**发现 GET 和 POST方法都能请求到**

>**注意**: 使用浏览器访问默认是Get方法


#### 指定 GET/POST 方法类型

##### GET请求的3种写法
```java
// 写法1
@RequestMapping("/index")

// 写法2
@RequestMapping(value = "/index",method = RequestMethod.GET)

// 写法3
@GetMapping("/index")   //最常用
```


##### POST请求的2种写法
```java
// 写法1
@RequestMapping(value = "/index",method = RequestMethod.POST)

// 写法2
@PostMapping("/index") //最常用
```

## 获取参数
### 传参时注意事项
在Spring Boot中传参一定要传包装类型,而非基础类型.
>原因:当需要一个基础类型，但又忘记传递的时候，使用基础类型会报错（程序500)，而保证类型不会报错，只是值为 `null`。


### 传递单个参数
在 Spring MVC 中可以直接用方法中的参数来实现传参，比如以下代码：
```java
@Controller  
@ResponseBody  
@RequestMapping("/user")  
public class UserController {  
    @RequestMapping("/m1")  
    public Object method1(String name){  
        System.out.println("参数 name" + name);  
        return "name:" + name;  
    }  
}
```

使用浏览器访问[localhost:8080/user/m1?name=zhangsan](http://localhost:8080/user/m1?name=zhangsan)
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230520220607.png)

程序运行结果:
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230520220741.png)

**注意事项**: 在浏览器中传入的参数名 , 必须和代码中的接收参数名相同
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230520221938.png)

>==**注意**==:**参数名不同则无法接收**



### 表单参数传递/传递多个参数(非对象)
```java
@Controller  
@ResponseBody  
@RequestMapping("/user")  
public class UserController {  
    @RequestMapping("/m2")  
    public Object method2(String name , String pwd){  
        System.out.println("name: "+ name);  
        System.out.println("pwd: "+ pwd);  
        return "name: " + name +" / "  
                +"pwd: " + pwd;  
    }
}
```

使用浏览器或postman访问网址:[localhost:8080/user/m2?name=lisi&pwd=123](http://localhost:8080/user/m2?name=lisi&pwd=123)
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230520223903.png)

>==**注意**==: 当有多个参数时，前后端进行参数匹配时，是以参数的名称进行匹配的，因此参数的位置是不影响后端获取参数的结果。
>![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230520224226.png)


### 传递对象
Spring MVC 可以自动实现参数对象的赋值，比如 Person 对象：
```java
@Data  //使用了 lombok
public class Person {  
    private int id ;  
    private  String name;  
    private  String password;  
}
```

传递对象代码实现：
```java
@Controller  
@ResponseBody  
@RequestMapping("/user")  
public class UserController {  
    @RequestMapping("/m3")  
    public Object method3 (Person p){  
        System.out.println("对象中的 name: " + p.getName());  
        System.out.println("对象中的 password: " + p.getPassword());  
        return "name: " + p.getName()  
                + "password: " + p.getPassword();  
    }
}
```
使用浏览器或postman访问网址: [localhost:8080/user/m2?name=zhangsan&password=123](http://localhost:8080/user/m2?name=zhangsan&password=123)
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230520222937.png)

控制台的输出:
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230520223012.png)

>注意: Spring Boot 帮我们做了简化, 我们要接受对象中的属性时 , **无需使用 `对象.属性` , 而是直接传入对象中的属性名即可**


### 后端参数重命名 （后端参数映射）
某些特殊的情况下，前端传递的参数key和我们后端接收的key可以不一致,比如前端传递了一个time 给后端，而后端又是有createtime 字段来接收的，这样就会出现参数接收不到的情况，如果出现这种情况，我们就可以使用 `@RequestParam` 来重命名前后端的参数值。

```java
@Controller  
@ResponseBody  
@RequestMapping("/user")  
public class UserController {  
    @RequestMapping("/m4")  
    public Object method4(@RequestParam("time") String createTime){  
        System.out.println("时间"+ createTime);  
        return createTime;  
    }
}
```

使用浏览器或postman访问: [localhost:8080/user/m4?time=2023.05.20](http://localhost:8080/user/m4?time=2023.05.20)

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230520224818.png)


#### 设置参数必传 @RequestParam
上面的例子，如果我们是前端传递一个 非time 的参数，就会出现程序报错的情况
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230520225210.png)

这是因为后端已经声明了前端必须传递一个time 的参数，但是前端没有给后端传递，我们查看`@RequestParam`注解的实现细节就可以发现端倪，注解实现如下:
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230520225511.png)

#### 非必传参数设置
如果我们的实际业务前端的参数是一个非必传的参数，我们可以通过设置`@RequestParam` 中的`required=false`来避免不传递时报错，具体实现如下;
```java
@Controller  
@ResponseBody  
@RequestMapping("/user")  
public class UserController {  
    @RequestMapping("/m4")  
    public Object method4(@RequestParam(value="time" ,required = false) String createTime){  
        System.out.println("时间"+ createTime);  
        return createTime;  
    }
}
```

此时就不会报错，但也无法接收到参数了
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230520225816.png)

控制台结果：
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230520225904.png)


### @RequestBody 接受JSON对象
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230520230810.png)
在postman中输入
```json
{"id":1,"name":"张三","password":"666"}
```

后端接收代码:
```java
@Controller  
@ResponseBody  
@RequestMapping("/user")  
public class UserController { 
    @PostMapping("/m5")  
    public Object method5(@RequestBody Person person){  
        System.out.println("Person" + person);  
        return person;  
    }
}
```
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230520231116.png)

如果没有 `@RequestBody`, 则无法接收到JSON对象信息

>注意事项: Spring Boot 接收的 普通对象 和 JSON对象 是不一样的
>![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230521115557.png)


### 获取URL中参数@PathVariable
后端实现代码:
```java
@Controller  
@ResponseBody  
@RequestMapping("/user")  
public class UserController {  
    @GetMapping("/m6/{name}/{pwd}")  
    public Object method6(@PathVariable String name ,@PathVariable String pwd){  
        System.out.println("name: "+ name);  
        System.out.println("pwd: "+ pwd);  
        return "name:"+name +"   "+ "pwd:"+pwd;  
    }
}
```

使用浏览器访问
>因为这里使用了`@GetMapping`注解 , 所以使用浏览器访问, 浏览器默认是get方式进行访问的

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230521120740.png)

***优缺点***
使用`@PathVariable`获取URL中参数的优点在于代码简洁易读、安全性高、灵活性好，可以自动解析和映射参数，使API文档更加友好和易于理解。
缺点在于不支持所有情况，无法自动去除前缀和后缀，容易出现类型不匹配问题，需要手动处理空值和非法输入。



### 上传文件@RequestPart
后端代码
```java
@Controller  
@ResponseBody  
@RequestMapping("/user")  
public class UserController {  
    @RequestMapping("/upfile")  
    public String upfile(@RequestPart("myfile") MultipartFile file) throws IOException {  
        String path = "s:/github.png";  
        // 保存文件  
        file.transferTo(new File(path));  
        return path;  
    }
}
```

使用 postman 上传文件
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230521123119.png)

>注意: key 需要和 `@RequestPart` 注解中的 value 值对应


上面的这种方法在实际生产中是绝对不会使用的, 因为不可能将用户的上传文件全部命名为 `github.png` , 更何况用户上传的文件绝不只是一种格式,需要需要对上面的代码进行修改.

修改后的代码需要满足两个条件:
- 文件名是不同的
- 保留用户传来的文件后缀
```java
@Controller  
@ResponseBody  
@RequestMapping("/user")  
public class UserController {  
    @RequestMapping("/myupfile")  
    public String myUpFile(@RequestPart("myfile") MultipartFile file) throws IOException {  
        // 根目录  
        String path = "s:/temp/";  
        // 根目录 + 【唯一的文件名】  
        path += UUID.randomUUID().toString().replace("-", "");  
        // 根目录 + 唯一的明文件 + 【文件的后缀】  ex:.png        
        path += file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));  
        
        file.transferTo(new File(path));  
        return path;  
    }
}
```

使用postman上传文件
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230521124306.png)

看看该路径下是否存在该文件
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230521124219.png)


***获取项目目录的几种方式:***
```java
ResourceUtils.getFile(ResourceUtils.CLASSPATH_URL_PREFIX).getPath();

new ClassPathResource("").getFile().getAbsolutePath();

ClassUtils.getDefaultClassLoader().getResource("").getPath();

ResourceUtils.getFile("classpath:static/").getPath();
```


### 获取Cookie/Session/Header
#### 获取Request 和 Response 对象
```java
@Controller  
@ResponseBody  
@RequestMapping("/user")  
public class UserController {  
    @RequestMapping("/m7")  
    public String method7(HttpServletRequest request , HttpServletResponse response)  
    {  
        String name = request.getParameter("name");   
        return name + " 你好";  
    }
```

#### 获取 header/cookie
```java
@Controller  
@ResponseBody  
@RequestMapping("/user")  
public class UserController {  
    @RequestMapping("/param10")  
    public String param10(HttpServletResponse response, HttpServletRequest request) {  
        String name = request.getParameter("name");  
        // 获取所有 cookie 信息  
        Cookie[] cookies = request.getCookies();  
        String userAgent = request.getHeader("User-Agent");  
        return name + "："+userAgent;  
    }
```

##### 获取Cookie
**获取所有Cookie**
```java
@Controller  
@ResponseBody  
@RequestMapping("/user")  
@Slf4j  
public class UserController {  
    @RequestMapping("/getck")  
    public String getCookie(HttpServletRequest request){  
        Cookie[] cookies = request.getCookies();   //servlet写法,获取全部cookie
        for(Cookie item: cookies){  
            log.error(item.getName() + ":" + item.getValue());  
        }  
        return "get cookie";  
    }
}
```


**获取单个Cookie**
```java
@Controller  
@ResponseBody  
@RequestMapping("/user")    
public class UserController {  
    @RequestMapping("/getck2")  
    public String getCookie2(@CookieValue("zhangsan") String val){  
        return "Cookie Value:"+ val;  
    }
}
```

##### 获取Header
```java
@Controller  
@ResponseBody  
@RequestMapping("/user")  
public class UserController {  
    @RequestMapping("/getheader")  
    public String getUA(@RequestHeader("User-Agent") String userAgent) {  
        return userAgent;  
    }
}
```


### Session的存储与获取
Session 存储和 Servlet 类似，是使用 HttpServletRequest 中获取的，如下代码所示：
```java
@Controller  
@ResponseBody  
@RequestMapping("/user")  
public class UserController {  
    @RequestMapping("/setsess")  
    public String setSession(HttpServletRequest request) {  
        //// 获取 HttpSession 对象，参数设置为 true 表示如果没有 session 对象就创建一个session  
        HttpSession session = request.getSession(true);  
        if(session!=null){  
            session.setAttribute("username","java");  
        }  
        return "session 存储成功";  
    }
}
```

读取 Session 可以使用 HttpServletRequest，如下代码所示
```java
@Controller  
@ResponseBody  
@RequestMapping("/user")   
public class UserController {  
    @RequestMapping("/sess")  
    public String sess(HttpServletRequest request) {  
        // 如果 session 不存在，不会自动创建  
        HttpSession session = request.getSession(false);  
        String username = "暂无";  
        if(session!=null && session.getAttribute("username")!=null){  
            username = (String) session.getAttribute("username");  
        }  
        return "username："+username;  
    }
}
```

***获取 Session 更简洁的方式：***
```java
@Controller  
@ResponseBody  
@RequestMapping("/user")  
@Slf4j  
public class UserController {  
    @RequestMapping("/sess2")  
    public String sess2(@SessionAttribute(value = "username",required = false)  
                                String username) {  
        return "username："+username;  
    }
```


## 返回数据
通过上面的学习我们知道，默认请求下无论是Spring MVC或者是Spring Boot返回的是视图(xxx.html)，而现在都是前后端分离的，后端只需要返给给前端数据即可，这个时候我们就需要使用`@ResponseBody`注解了。|

### 返回静态页面
创建前端页面
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230521161108.png)

```html
<!DOCTYPE html>  
<html lang="en">  
<head>  
    <meta charset="UTF-8">  
    <title>Title</title>  
</head>  
<body>  
    <h1>Hello , Spring MVC</h1>  
</body>  
</html>
```

创建控制器 controller
```java
@Controller  
@RequestMapping("/p")  
public class PersonController {  
    @RequestMapping("/index")  
    public Object index(){  
        // 执行业务...  
        // 返回view -> index.html  
        return "/index.html";  
    }  
}
```

执行结果:
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230521161509.png)


### 返回 text/html
```java
@Controller  
@RequestMapping("/p")  
public class PersonController {  
    @ResponseBody  
    @RequestMapping("/m8")  
    public String method8() {  
        return "<h1>Hello,HTML~</h1>";  
    }
}
```


### 返回JSON对象
```java
@Controller  
@ResponseBody  
@RequestMapping("/user")  
public class UserController { 
	@RequestMapping("/m8")
    public HashMap<String, String> method8(){  
        HashMap<String , String> map = new HashMap<>();  
        map.put("Spring" , "Spring Value");  
        map.put("MySQL" , "MySQL Value");  
        map.put("Redis" , "Redis Value");  
        return map;  
    }
```
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230521162718.png)

>Spring Boot 会将任何 Java 对象序列化为 JSON 格式，并将其返回给页面。但是，在默认情况下，Spring Boot 只支持一些基本类型和集合类型的序列化，例如：
>-   String、Integer、Long、Boolean、Float、Double、BigDecimal、String、Character 等基本类型；
>-   java.util.List、java.util.Set、java.util.Map 等集合类型。
>
>如果需要将自定义的 Java 类型也序列化为 JSON 格式，可以使用 Jackson 库进行序列化。Jackson 是一个流行的 JSON 序列化/反序列化库，它可以将 Java 对象转换为 JSON 格式，也可以将 JSON 格式转换为 Java 对象。


### 请求转发和请求重定向
**请求转发**是将客户端的请求转发给另一个服务器处理，并将处理结果返回给客户端。在请求转发过程中，所有与原始请求相关的信息都会被保留并传递给下一个服务器。

**请求重定向**是将客户端的请求从一个 URL 重定向到另一个 URL,并且会修改原始请求的 URL,客户端无法感知到中间服务器的存在。

因此，如果需要在多个服务器之间传递请求信息，则应该使用请求转发；如果只需要将请求重定向到另一个 URL,则可以使用请求重定向。

#### forward VS redirect
return 不但可以返回一个视图，还可以实现跳转，跳转的方式有两种: 
- forward: 请求转发;
- redirect: 请求重定向。

**请求转发和重定向的使用对比:**
index.html资源文件目录如下:
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230521161108.png)

后端代码：
```java
@Controller  
@RequestMapping("/user")  
public class UserController {  
	//请求重定向
    @RequestMapping("/index")  
    public String index(){  
        return "redirect:/index.html";  
    }  
    
    // 请求转发  
    @RequestMapping("/index2")  
    public String index2(){  
        return "forward:/index.html";  
    }
}
```

访问 index : [http://localhost:8080/user/index](http://localhost:8080/user/index)
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230521164734.png)

访问 index2:[http://localhost:8080/user/index2](http://localhost:8080/user/index2)
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230521164408.png)


***forward和redirect具体区别如下***:
1. 请求重定向（redirect)将请求重新定位到资源﹔请求转发(forward)服务器端转发。
2. 请求重定向地址发生变化，请求转发地址不发生变化。
3. 请求重定向与直接访问新地址效果一样，不存在原来的外部资源不能访问;请求转发服务器端转发有可能造成原外部资源不能访问。


### @RequestBody 说明
`@ResponseBody`返回的值如果是字符会转换成**text/html**，如果**返回的是对象**会转换成**application/json**返回给前端。

`@ResponseBody`可以用来修饰方法或者是修饰类，修饰类表示类中的所有方法都会返回html或者json，而不是视图。


### 组合注解：@RestController
@RestController = @Controller + @ResponseBody


### 查看更多注解
[官方API](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-requestmapping.html)