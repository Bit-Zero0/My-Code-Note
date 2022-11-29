# Servlet 是什么
Servlet 是一种实现动态页面的技术. 是一组 Tomcat 提供给程序猿的 API, 帮助程序猿简单高效的开发一 
个 web app.


**回顾  动态页面 vs 静态页面**
- 静态页面也就是内容始终固定的页面. 即使  **用户不同/时间不同/输入的参数不同, 页面内容也不会发生变化** . (除非网站的开发人员修改源代码, 否则页面内容始终不变).
- 对应的, **动态页面指的就是  用户不同/时间不同/输入的参数不同, 页面内容会发生变化**.

构建动态页面的技术有很多, 每种语言都有一些相关的库/框架来做这件事.
**Servlet** 就是 Tomcat 这个 HTTP 服务器提供给 Java 的一组 API, 来完成构建动态页面这个任务.

## Servlet 主要做的工作
- 允许程序猿注册一个类, 在 Tomcat 收到某个特定的 HTTP 请求的时候, 执行这个类中的一些代码. 
- 帮助程序猿解析 HTTP 请求, 把 HTTP 请求从一个字符串解析成一个 HttpRequest 对象.
- 帮助程序猿构造 HTTP 响应. 程序猿只要给指定的 HttpResponse 对象填写一些属性字段, Servlet就会自动的安装 HTTP 协议的方式构造出一个 HTTP 响应字符串, 并通过 Socket 写回给客户端.
>当然, Servlet 还支持一些其他的辅助功能, 此处暂时先不介绍.

简而言之, Servlet 是一组 Tomcat 提供的 API, 让程序猿自己写的代码能很好的和 Tomcat 配合起来, 从而更简单的实现一个 web app.
而不必关注 Socket, HTTP协议格式, 多线程并发等技术细节, 降低了 web app 的开发门槛, 提高了开发效率.


# 第一个 Servlet 程序
## 1. 创建项目
使用 IDEA 创建一个 Maven 项目. 
1) 菜单 -> 文件 -> 新建项目 -> Maven
![[Pasted image 20221126161924.png]]

2) 选择项目要存放的目录
![[Pasted image 20221126162107.png]]


## 2. 引入依赖
Maven 项目创建完毕后, 会自动生成一个 pom.xml 文件. 
我们需要在 pom.xml 中引入 Servlet API 依赖的 jar 包.
1) 在中央仓库 https://mvnrepository.com/ 中搜索 "servlet", 一般第一个结果就是.
![[Pasted image 20221126162230.png]]

2) 选择版本. 一般我们使用 3.1.0 版本
![[Pasted image 20221126162321.png]]
>Servlet 的版本要和 Tomcat 匹配.
>如果我们使用 Tomcat 8.5, 那么就需要使用 Servlet 3.1.0
>可以在 http://tomcat.apache.org/whichversion.html 查询版本对应关系.
>![[Pasted image 20221126162442.png]]


3) 把中央仓库中提供的 xml 复制到项目的 pom.xml 中
![[Pasted image 20221126162512.png]]

修改后的 pom.xml 形如:(每人的不一定都一样)
```xml
<?xml version="1.0" encoding="UTF-8"?>  
<project xmlns="http://maven.apache.org/POM/4.0.0"  
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">  
    <modelVersion>4.0.0</modelVersion>  
  
    <groupId>org.example</groupId>  
    <artifactId>ServletHelloWorld</artifactId>  
    <version>1.0-SNAPSHOT</version>  
  
    <properties>        
	    <maven.compiler.source>8</maven.compiler.source>  
        <maven.compiler.target>8</maven.compiler.target>  
    </properties>  
    
    <dependencies>        
	    <dependency>            
		    <groupId>javax.servlet</groupId>  
            <artifactId>javax.servlet-api</artifactId>  
            <version>3.1.0</version>  
            <scope>provided</scope>  
        </dependency>    
    </dependencies>
</project>
```

`<dependencies>`标签内部放置项目依赖的 jar 包. maven 会自动下载依赖到本地.


>==关于 groupId, artifactId, version==
>这几个东西暂时我们不关注. 啥时候需要关注呢? 如果我们要把这个写的代码发布到中央仓库上, 那么就需要设定好这几个 ID 了.
>- **groupId**: 表示组织名称 
>- **artifactId**: 表示项目名称 
>- **version**: 表示版本号
中央仓库就是按照这三个字段来确定唯一一个包的.

![[Pasted image 20221126163010.png]]
红色方框圈出来的部分, 就是这个 jar 包的 groupId, artifactId, version

## 3. 创建目录
当项目创建好了之后, IDEA 会帮我们自动创建出一些目录. 形如
![[Pasted image 20221126163122.png]]
这些目录中:
- src 表示源代码所在的目录
- main/java 表示源代码的根目录. 后续创建 .java 文件就放到这个目录中. 
- main/resources 表示项目的一些资源文件所在的目录. 此处暂时不关注. 
- test/java 表示测试代码的根目录. 此处暂时不关注.


这些目录还不够, 我们还需要创建一些新的目录/文件. 

**1) 创建 webapp 目录**
在 main 目录下, 和 java 目录并列, 创建一个 webapp 目录 (注意, 不是 webapps).
![[Pasted image 20221126163238.png]]


**2) 创建 web.xml**
然后在 webapp 目录内部创建一个 **WEB-INF** 目录, 并创建一个 **web.xml** 文件
![[Pasted image 20221126163350.png]]
>注意单词拼写.

**3) 编写 web.xml**
往 web.xml 中拷贝以下代码. 具体细节内容我们暂时不关注.

```xml
<!DOCTYPE web-app PUBLIC
"-//Sun Microsystems, Inc.//DTD Web Application 2.3//EN" 
"http://java.sun.com/dtd/web-app_2_3.dtd" >

<web-app>
	<display-name>Archetype Created Web Application</display-name> 
</web-app>
```

>webapp 目录就是未来部署到 Tomcat 中的一个重要的目录. 当前我们可以往 webapp 中放一些静态资源, 比如 html , css 等.
>在这个目录中还有一个重要的文件 web.xml. Tomcat 找到这个文件才能正确处理 webapp 中的动态资源.



## 4. 编写代码
在 java 目录中创建一个类 HelloServlet, 代码如下:
```java
import javax.servlet.ServletException;  
import javax.servlet.annotation.WebServlet;  
import javax.servlet.http.HttpServlet;  
import javax.servlet.http.HttpServletRequest;  
import javax.servlet.http.HttpServletResponse;  
import java.io.IOException;  
  
@WebServlet("/hello")
public class HelloServlet extends HttpServlet {  
    @Override  
    protected void doGet(HttpServletRequest req , HttpServletResponse resp)throws ServletException, IOException {  
        System.out.println("hello");  
        resp.getWriter().write("hello");  
    }  
}
```
- 创建一个类   `HelloServlet` , 继承自   `HttpServlet`
- 在这个类上方加上   `@WebServlet("/hello")` 注解, 表示 Tomcat 收到的请求中, 路径为的请求才会调用 `HelloServlet` 这个类的代码.  (这个路径未包含 Context Path)
- 重写`doGet`方法. `doGet`的参数有两个, 分别表示**收到的 HTTP 请求**  和**要构造的 HTTP 响应**. 这个方法会在 Tomcat 收到 GET 请求时触发
- `HttpServletRequest` 表示 HTTP 请求. Tomcat 按照 HTTP 请求的格式把 字符串 格式的请求转成了一个 `HttpServletRequest` 对象. 后续想获取请求中的信息(方法, url, header, body 等) 都是通过这个对象来获取.
- `HttpServletResponse` 表示 HTTP 响应. 代码中把响应对象构造好(构造响应的状态码, header,body 等)
- `resp.getWriter()` 会获取到一个**流对象**, 通过这个流对象就可以写入一些数据, 写入的数据会被构造成一个 HTTP 响应的 body 部分, Tomcat 会把整个响应转成字符串, 通过 socket 写回给浏览器.


>这个代码虽然只有寥寥几行, 但是包含的信息量是巨大的.
1) 我们的代码不是通过 main 方法作为入口了. main 方法已经被包含在 Tomcat 里, 我们写的代码会被Tomcat 在合适的时机调用起来.
	- 此时我们写的代码并不是一个完整的程序, 而是 Tomcat 这个程序的一小部分逻辑.

2) 我们随便写个类都能被 Tomcat 调用嘛? 满足啥样条件才能被调用呢? 
主要满足三个条件:
     a) 创建的类需要继承自 `HttpServlet`
     b) 这个类需要使用 `@WebServlet` 注解关联上一个 HTTP 的路径
     c) 这个类需要实现 doXXX 方法.
当这三个条件都满足之后, Tomcat 就可以找到这个类, 并且在合适的时机进行调用.

## 5. 打包程序
使用 maven 进行打包. 打开 maven 窗口 (一般在 IDEA 右侧就可以看到 Maven 窗口, 如果看不到的话, 
可以通过  **菜单 -> View -> Tool Window -> Maven 打开**)

然后展开 Lifecycle , 双击 package 即可进行打包.
![[Pasted image 20221126165144.png]]

如果比较顺利的话, 能够看到 SUCCESS 这样的字样.
![[Pasted image 20221126165156.png]]

如果代码/配置/环境存在问题, 可能会提示 BUILD FAILED, 可以根据具体提示的错误信息具体解决.
打包成功后, 可以看到在 target 目录下, 生成了一个 `jar` 包.
![[Pasted image 20221126165249.png]]
这样的 `jar` 包并不是我们需要的, Tomcat 需要识别的是另外一种 `war` 包格式. 
另外这个 jar 包的名字太复杂了, 我们也希望这个名字能更简单一点.

>==war 包和 jar 包的区别==
>- jar 包是普通的 java 程序打包的结果. 里面会包含一些 .class 文件.
>- war 包是 java web 的程序, 里面除了会包含 .class 文件之外, 还会包含 HTML, CSS, JavaScript, 图片, 以及其他的 jar 包. 打成 war 包格式才能被 Tomcat 识别.


>`ServletHelloWorld-1.0-SNAPSHOT.jar`    的由来 
>这个名字来源于
>![[Pasted image 20221126165449.png]]
>相当于把 artifactId 和 version 拼接起来了.


在 **pom.xml** 中新增一个 `packing` 标签, 表示打包的方式是打一个 `war` 包.
```xml
<packaging>war</packaging>
```

在 **pom.xml** 中再新增一个 `build` 标签, 内置一个 `finalName` 标签, 表示打出的 `war` 包的名字是 `HelloServlet`
```xml
<build>
    <finalName>ServletHelloWorld</finalName> 
</build>
```


完整的 **pom.xml** 形如
```xml
<?xml version="1.0" encoding="UTF-8"?>  
<project xmlns="http://maven.apache.org/POM/4.0.0"  
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">  
    <modelVersion>4.0.0</modelVersion>  
  
    <groupId>org.example</groupId>  
    <artifactId>ServletHelloWorld</artifactId>  
    <version>1.0-SNAPSHOT</version>  
  
    <properties>        
	    <maven.compiler.source>8</maven.compiler.source>  
        <maven.compiler.target>8</maven.compiler.target>  
    </properties>  
    <dependencies>        
	    <dependency>            
		    <groupId>javax.servlet</groupId>  
            <artifactId>javax.servlet-api</artifactId>  
            <version>3.1.0</version>  
            <scope>provided</scope>  
        </dependency>    
    </dependencies>        
    
    <packaging>war</packaging>  
    <build>        
	    <finalName>ServletHelloWorld</finalName>  
    </build>
</project>
```

重新使用 maven 打包, 可以看到生成的新的 `war` 包的结果.
![[Pasted image 20221126170035.png]]


## 6. 部署程序
把 war 包拷贝到 Tomcat 的 webapps 目录下.

启动 Tomcat , Tomcat 就会自动把 war 包解压缩.
![[Pasted image 20221126170345.png]]

![[Pasted image 20221126170413.png]]
看到这个日志说明 Tomcat 已经正确识别了 ServletHelloWorld 这个 webapp.



## 7. 验证程序
此时通过浏览器访问   http://127.0.0.1:8080/ServletHelloWorld/hello 

就可以看到结果了.
![[Pasted image 20221126170433.png]]

**注意**: URL 中的 PATH 分成两个部分, 其中  ` HelloServlet` 为 Context Path,`hello` 为Servlet Path
![[Pasted image 20221126170549.png]]


# 更方便的部署方式
手动拷贝 war 包到 Tomcat 的过程比较麻烦. 我们还有更方便的办法. 

此处我们使用 IDEA 中的 **Smart Tomcat 插件**完成这个工作.


## 安装 Smart Tomcat 插件
**1) 菜单 -> 文件 -> Settings**
![[Pasted image 20221126183224.png]]

**2) 选择 Plugins, 选择 Marketplace, 搜索 "tomcat", 点击 "Install".**
![[Pasted image 20221126183325.png]]
>注意: 安装过程必须要联网.


**3) 安装完毕之后, 会提示 "重启 IDEA"**
![[Pasted image 20221126183358.png]]


## 配置 Smart Tomcat 插件
**1) 点击右上角的 "Add Configuration"**
![[Pasted image 20221126183848.png]]


**2) 选择左侧的 "Smart Tomcat"**
![[Pasted image 20221126184114.png]]


**3) 在   Name 这一栏填写一个名字(可以随便写)**
在 Tomcat Server 这一栏选择 Tomcat 所在的目录. 其他的选项不必做出修改.
![[Pasted image 20221126184227.png]]

>其中   Context Path 默认填写的值是项目名称.
>![[Pasted image 20221126184521.png]]
>这会影响到后面咱们的访问页面.


**4) 点击 OK 之后, 右上角变成了**
![[Pasted image 20221126184600.png]]

点击绿色的三角号, IDEA 就会自动进行编译, 部署, 启动 Tomcat 的过程.
![[Pasted image 20221126184623.png]]
此时 Tomcat 日志就会输出在 IDEA 的控制台中, 可以看到现在就**不再乱码**了.


**5) 访问页面.**
在浏览器中使用 http://127.0.0.1:8080/ServletHelloWorld/hello 访问页面.
![[Pasted image 20221126184824.png]]

注意路径的对应关系.
![[Pasted image 20221126184841.png]]


>使用 Smart Tomcat 部署的时候, 我们发现 Tomcat 的 webapps 内部并没有被拷贝一个 war 包, 也没有看到解压缩的内容.
>Smart Tomcat 相当于是在 Tomcat 启动的时候直接引用了项目中的 webapp 和 target 目录.
>![[Pasted image 20221126184934.png]]


# 访问出错怎么办?
## 出现 404
404 表示用户访问的资源不存在. 大概率是 URL 的路径写的不正确. 

**错误实例1**: 少写了 Context Path
通过 `/hello` 访问服务器
![[Pasted image 20221126185052.png]]



**错误实例2**: 少写了 Servlet Path 
通过   /ServletHelloWorld 访问服务器
![[Pasted image 20221126185148.png]]


**错误实例3**: Servlet Path 写的和 URL 不匹配 
修改 @WebServlet 注解的路径
![[Pasted image 20221126185218.png]]

重启 Tomcat 服务器.
>URL 中的路径写作 "`/hello`" , 而代码中写作的 Servlet Path 为 "`/helloServlet`", 两者不匹配.


**错误实例4**: web.xml 写错了 
清除 web.xml 中的内容
![[Pasted image 20221126185331.png]]

重启 Tomcat 服务器.
通过浏览器访问 URL, 可以看到:
![[Pasted image 20221126185402.png]]


>在 Tomcat 启动的时候也有相关的错误提示
>![[Pasted image 20221126185418.png]]


## 出现 405
405 表示对应的 HTTP 请求方法没有实现. 

错误实例: 没有实现 doGet 方法.
```java
@WebServlet("/hello")
public class HelloServlet extends HttpServlet { 
}
```

重启 Tomcat 服务器. 
在浏览器中访问, 可以看到:
![[Pasted image 20221126185616.png]]

在浏览器地址栏直接输入 URL , 会发送一个 HTTP **GET** 请求.
此时就会根据   `/ServletHelloWorld/hello` 这个路径找到   `HelloServlet` 这个类. 并且尝试调用`HelloServlet` 的 `doGet` 方法.
但是如果没有实现 `doGet` 方法, 就会出现上述现象.


## 出现 500
往往是 Servlet 代码中抛出异常导致的. 

**错误实例:**
修改代码
```java
@WebServlet("/hello")
public class HelloServlet extends HttpServlet { 
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String s = null;
        resp.getWriter().write(s.length()); 
    }
}
```

重启 Tomcat 服务器. 
重新访问页面, 可以看到:
![[Pasted image 20221126185815.png]]

在页面上已经有具体的异常调用栈.
>异常信息里已经提示了出现异常的代码是 `HelloServlet.java` 的第 13 行.
```java
resp.getWriter().write(s.length());
```
仔细检查这里的代码就可以看到空指针异常.


## 出现 "空白页面"
错误实例:
修改代码, 去掉 `resp.getWritter().write()` 操作.
```java
@WebServlet("/hello")
public class HelloServlet extends HttpServlet { 
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        System.out.println("hello"); 
    }
}
```
重启服务器,
访问服务器, 可以看到一个空白页面:
![[Pasted image 20221126190028.png]]

抓包可以看到, 响应 body 中的内容就是 "空数据"
![[Pasted image 20221126190041.png]]


## 出现 "无法访问此网站"
一般是 Tomcat 启动就失败了. 
错误实例: Servlet Path 写错了.
![[Pasted image 20221126190101.png]]
>应该写作 "`/hello`", Tomcat 在启动的时候已经提示了相关的错误.
>Tomcat 启动的日志里面报错信息可能比较多, 需要耐心观察, 找到关键的提示.

![[Pasted image 20221126190150.png]]

看到的现象:
![[Pasted image 20221126190209.png]]

## 小结
初学 Servlet, 遇到的这类问题会非常多. 我们不光要学习 Servlet 代码的基本写法, 也要学习**排查错误的 
思路**.
>程序猿调试 BUG 如同医生诊病.
>一个有经验的程序猿和一个新手程序猿相比, 最大的优势往往不是代码写的多好, 而是调试效率有多高. 同一个问题可能新手花了几天都无法解决的, 但是有经验的程序猿可能几分钟就搞定了.

熟悉 HTTP 协议能够让我们调试问题事半功倍.
- 4xx 的状态码表示路径不存在, 往往需要检查 URL 是否正确, 和代码中设定的 Context Path 以及 Servlet Path 是否一致.
- 5xx 的状态码表示服务器出现错误, 往往需要观察页面提示的内容和 Tomcat 自身的日志, 观察是否存在报错.
- 出现连接失败往往意味着 Tomcat 没有正确启动, 也需要观察 Tomcat 的自身日志是否有错误提示. 
- 空白页面这种情况则需要我们使用抓包工具来分析 HTTP 请求响应的具体交互过程.

>观察日志是调试程序的重要途径. Tomcat 的日志往往很多, 需要同学们耐心阅读, 经常阅读, 熟练了就能更快速的找到问题了.


# Servlet 运行原理
在 Servlet 的代码中我们并没有写 main 方法, 那么对应的 doGet 代码是如何被调用的呢? 响应又是如何 
返回给浏览器的?

## Tomcat 的定位
我们自己的实现是在 Tomcat 基础上运行的。
![[Pasted image 20221127151649.png]]

当浏览器给服务器发送请求的时候, Tomcat 作为 HTTP 服务器, 就可以**接收到这个请求**. 
HTTP 协议作为一个应用层协议, 需要底层协议栈来支持工作. 如下图所示:
![[Pasted image 20221127184912.png]]
>Tomcat其实是一个应用程序.运行在用户态的普通进程(Tomcat其实也是一个Java进程)
>用户写的代码(根据请求计算相应)，通过Servlet和Tomcat进行交互
>Tomcat进一步的和浏览器之间的网络传输,仍然是走的咱们之前学过的网络原理中的那一套(封装和分用)


更详细的交互过程可以参考下图:
![[Pasted image 20221127185055.png]]
**1) 接收请求**:
- 用户在浏览器输入一个 URL, 此时浏览器就会构造一个 HTTP 请求.
- 这个 HTTP 请求会经过网络协议栈逐层进行  **封装**  成二进制的 bit 流, 最终通过物理层的硬件设备转换成光信号/电信号传输出去.
- 这些承载信息的光信号/电信号通过互联网上的一系列网络设备, 最终到达目标主机(这个过程也需要网络层和数据链路层参与).
- 服务器主机收到这些光信号/电信号, 又会通过网络协议栈逐层进行  **分用**, 层层解析, 最终还原成HTTP 请求. 并交给 Tomcat 进程进行处理(根据端口号确定进程)
- Tomcat 通过 Socket 读取到这个请求(一个字符串), 并按照 HTTP 请求的格式来解析这个请求, **根据请求中的 Context Path 确定一个 webapp, 再通过 Servlet Path 确定一个具体的  类**. 再根据当前请求的方法 (`GET`/`POST`/...), 决定调用这个类的 `doGet` 或者 `doPost` 等方法. 此时我们的代码中的`doGet / doPost` 方法的第一个参数 `HttpServletRequest` 就包含了这个 HTTP 请求的详细信息.


**2) 根据请求计算响应:**
- 在我们的 `doGet / doPost` 方法中, 就执行到了我们自己的代码. 我们自己的代码会根据请求中的一些信息, 来给 `HttpServletResponse` 对象设置一些属性. 例如**状态码**, **header**, **body** 等.



**3) 返回响应:**
- 我们的 `doGet / doPost` 执行完毕后, Tomcat 就会自动把 `HttpServletResponse` 这个我们刚设置好的对象转换成一个符合 HTTP 协议的字符串, 通过 Socket 把这个响应发送出去.
- 此时响应数据在服务器的主机上通过网络协议栈层层  **封装**, 最终又得到一个二进制的 bit 流, 通过物理层硬件设备转换成光信号/电信号传输出去.
- 这些承载信息的光信号/电信号通过互联网上的一系列网络设备, 最终到达浏览器所在的主机(这个过程也需要网络层和数据链路层参与).
- 浏览器主机收到这些光信号/电信号, 又会通过网络协议栈逐层进行  **分用**, 层层解析, 最终还原成HTTP 响应, 并交给浏览器处理.
- 浏览器也通过 Socket 读到这个响应(一个字符串), 按照 HTTP 响应的格式来解析这个响应. 并且把body 中的数据按照一定的格式显示在浏览器的界面上.


>==浏览器和服务器之间交互数据,这个过程中是否会涉及到TCP三次握手，确认应答...，是否会涉及到IP的分包组包.…是否会涉及到以太网的MTU 呢...==
>都是会的！


## Tomcat 的伪代码
下面的代码通过 "伪代码" 的形式描述了 Tomcat 初始化/处理请求  两部分核心逻辑.
>所谓 "伪代码", 并不是一些语法严谨, 功能完备的代码, 只是通过这种形式来大概表达某种逻辑.

### 1. Tomcat 初始化流程
```java
class Tomcat {
	// 用来存储所有的 Servlet 对象
	private List<Servlet> instanceList = new ArrayList<>(); 
	public void start() {
        // 根据约定，读取 WEB-INF/web.xml 配置文件; 
        // 并解析被 @WebServlet 注解修饰的类
        
        // 假定这个数组里就包含了我们解析到的所有被 @WebServlet 注解修饰的类. 
        Class<Servlet>[] allServletClasses = ...;
        
        // 这里要做的的是实例化出所有的 Servlet 对象出来; 
        for (Class<Servlet> cls : allServletClasses) { 
            // 这里是利用 java 中的反射特性做的
            // 实际上还得涉及一个类的加载问题，因为我们的类字节码文件，是按照约定的 
            // 方式（全部在 WEB-INF/classes 文件夹下）存放的，所以 tomcat 内部是 
            // 实现了一个自定义的类加载器(ClassLoader)用来负责这部分工作。
        
			Servlet ins = cls.newInstance(); 
            instanceList.add(ins);
        }
        
        // 调用每个 Servlet 对象的 init() 方法，这个方法在对象的生命中只会被调用这一次; 
        for (Servlet ins : instanceList) {
            ins.init(); 
        }
        
        // 利用我们之前学过的知识，启动一个 HTTP 服务器 
        // 并用线程池的方式分别处理每一个 Request
        ServerSocket serverSocket = new ServerSocket(8080);
        // 实际上 tomcat 不是用的固定线程池，这里只是为了说明情况
        ExecuteService pool = Executors.newFixedThreadPool(100); 
        
        while (true) {
            Socket socket = ServerSocket.accept();
            // 每个请求都是用一个线程独立支持，这里体现了我们 Servlet 是运行在多线程环境下的 
            pool.execute(new Runnable() {
               doHttpRequest(socket); 
            });
        }
        
        // 调用每个 Servlet 对象的 destroy() 方法，这个方法在对象的生命中只会被调用这一次; 
        for (Servlet ins : instanceList) {
            ins.destroy(); 
        }
    }
    
    public static void main(String[] args) { 
        new Tomcat().start();
    } 
}
```

**1) 让Tomcat先从指定的目录中找到所有要加载的 Servlet类**
![[Pasted image 20221127190222.png]]

**2) 根据刚才类加载的结果,给这些类创建Servlet 实例**
![[Pasted image 20221127190315.png]]


**3) 实例创建好之后,就可以调用当前Servlet 实例的init方法了**
![[Pasted image 20221127190437.png]]


**4) 创建TCPsocket,监听8080端口,等待有客户端来连接**
![[Pasted image 20221127190544.png]]

**5) 如果循环退出了，Tomcat 也要结束了.就会依次循环调用每个Servlet的destroy方法**
![[Pasted image 20221127190737.png]]

**小结**
- Tomcat 的代码中 内置了 main 方法. 当我们启动 Tomcat 的时候, 就是从 Tomcat 的 main 方法开始执行的.
- 被 `@WebServlet`注解修饰的类会在 Tomcat 启动的时候就被获取到, 并集中管理.
- Tomcat 通过  **反射**  这样的语法机制来创建被   `@WebServlet` 注解修饰的类的实例.
- 这些实例被创建完了之后, 会点调用其中的 init 方法进行初始化. (这个方法是 HttpServlet 自带的, 我们自己写的类可以重写 init)
- 这些实例被销毁之前, 会调用其中的 destory 方法进行收尾工作. (这个方法是 HttpServlet 自带的, 我们自己写的类可以重写 destory)
- Tomcat 内部也是通过 Socket API 进行网络通信.
- Tomcat 为了能同时相应多个 HTTP 请求, 采取了多线程的方式实现. 因此 Servlet 是运行在  **多线程环境**  下的.



### 2. Tomcat 处理请求流程
```java
class Tomcat {
    void doHttpRequest(Socket socket) {
        // 参照我们之前学习的 HTTP 服务器类似的原理，进行 HTTP 协议的请求解析，和响应构建 
        HttpServletRequest req = HttpServletRequest.parse(socket);
        HttpServletRequest resp = HttpServletRequest.build(socket);
        
        // 判断 URL 对应的文件是否可以直接在我们的根路径上找到对应的文件，如果找到，就是静态内容
        // 直接使用我们学习过的 IO 进行内容输出 
        if (file.exists()) {
            // 返回静态内容 
            return;
        }
        // 走到这里的逻辑都是动态内容了
        
        // 根据我们在配置中说的，按照 URL -> servlet-name -> Servlet 对象的链条 
        // 最终找到要处理本次请求的 Servlet 对象
        Servlet ins = findInstance(req.getURL()); 
        
        // 调用 Servlet 对象的 service 方法
        // 这里就会最终调用到我们自己写的 HttpServlet 的子类里的方法了 
        try {
			ins.service(req, resp);
        } catch (Exception e) {
            // 返回 500 页面，表示服务器内部错误 
        }
    } 
}
```


小结
 - Tomcat 从 Socket 中读到的 HTTP 请求是一个字符串, 然后会按照 HTTP 协议的格式解析成一个 `HttpServletRequest` 对象.
- Tomcat 会根据 URL 中的 path 判定这个请求是请求一个静态资源还是动态资源. 如果是静态资源, 直接找到对应的文件把文件的内容通过 Socket 返回. 如果是动态资源, 才会执行到 Servlet 的相关逻辑.
- Tomcat 会根据 URL 中的 **Context Path** 和 **Servlet Path** 确定要调用哪个 Servlet 实例的 service方法.
- 通过 service 方法, 就会进一步调用到我们之前写的 **doGet** 或者 **doPost**
![[Pasted image 20221127191153.png]]

### 3. Servlet 的 service 方法的实现
```java
class Servlet {
    public void service(HttpServletRequest req, HttpServletResponse resp) { 
        String method = req.getMethod();
        if (method.equals("GET")) { 
            doGet(req, resp);
        } else if (method.equals("POST")) { 
            doPost(req, resp);
        } else if (method.equals("PUT")) { 
            doPut(req, resp);
        } else if (method.equals("DELETE")) { 
            doDelete(req, resp);
        }
        ...... 
    }
}
```
小结
- Servlet 的 service 方法内部会根据当前请求的方法, 决定调用其中的某个 doXXX 方法.
- 在调用 doXXX 方法的时候, 就会触发  多态  机制, 从而执行到我们自己写的子类中的 doXXX 方法.

>理解此处的  多态
>- 我们前面自己写的 HelloServlet 类, 继承自 HttpServlet 类. 而 HttpServlet 又继承自 Servlet. 相当于 HelloServlet 就是 Servlet 的子类.
>- 接下来, 在 Tomcat 启动阶段, Tomcat 已经根据注解的描述, 创建了 HelloServlet 的实例, 然后把这个实例放到了 Servlet 数组中.
>- 后面我们根据请求的 URL 从数组中获取到了该 HelloServlet 实例, 但是我们是通过   `Servlet ins` 这样的父类引用来获取到 HelloServlet 实例的.
>- 最后, 我们通过   `ins.doGet()` 这样的代码调用 doGet 的时候, 正是 "父类引用指向子类对象", 此时就会触发多态机制, 从而调用到我们之前在 HelloServlet 中所实现的 doGet 方法
等价代码:
```java
Servlet ins = new HelloServlet(); 
ins.doGet(req, resp);
```

### 总结
在讨论到上面这整套流程过程中，涉及到了关于Servlet的关键方法,主要有三个.
- `init`:初始化阶段，对象创建好了之后,就会执行到.用户可以重写这个方法,来执行一些初始化逻辑.
- `service`:在处理请求阶段来调用.每次来个请求都要调用一次service
- `destroy`:退出主循环, tomcat结束之前会调用,用来释放资源


# Servlet API 详解
这里主要掌握 Servlet 提供的三个类：**HttpServlet** ，**HttpServeltRequest** ， **HttpServletResponse**

## HttpServlet
我们写 Servlet 代码的时候, 首先第一步就是先创建类, 继承自 **HttpServlet**, 并重写其中的某些方法. 

### 核心方法
![[Pasted image 20221127192246.png]]
我们实际开发的时候主要重写` doXXX` 方法, 很少会重写 `init / destory / service` .
>这些方法的调用时机, 就称为 "Servlet 生命周期". (也就是描述了一个 Servlet 实例从生到死的过程).
![[Pasted image 20221127192325.png]]
**注意**: HttpServlet 的实例只是在程序启动时创建一次. 而不是每次收到 HTTP 请求都重新创建实例.

###  代码示例: 处理 GET 请求
创建 MethodServlet.java, 创建 doGet 方法
```java
@WebServlet("/method")
public class MethodServlet extends HttpServlet { 
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
throws ServletException, IOException {
        resp.getWriter().write("GET response"); 
    }
}
```

创建 testMethod.html, 放到 webapp 目录中, 形如
![[Pasted image 20221127194450.png]]
一个 Servlet 程序中可以同时部署静态文件. 静态文件就放到 webapp 目录中即可.

```java
<button onclick="sendGet()">发送 GET 请求</button>

    <script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script>
        $.ajax({
            type: 'get',
            url: 'method',
            success: function (body) {
                console.log(body);
            }
        })

        function ajax(args) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                // 0: 请求未初始化
                // 1: 服务器连接已建立
                // 2: 请求已接收
                // 3: 请求处理中
                // 4: 请求已完成，且响应已就绪
                if (xhr.readyState == 4) {
                    args.callback(xhr.responseText, xhr.status)
                }
            }
            xhr.open(args.method, args.url);
            if (args.contentType) {
                xhr.setRequestHeader('Content-type', args.contentType);
            }
            if (args.body) {
                xhr.send(args.body);
            } else {
                xhr.send();
            }
        }
    </script>
```

重新部署程序, 使用 URL `http://127.0.0.1:8080/ServletHelloWorld/testMethod.html`访问页面.
![[Pasted image 20221127194647.png]]

点击 "发送 GET 请求" 按钮, 即可在控制台看到响应内容.
![[Pasted image 20221127194702.png]]

通过 Fiddler 抓包, 可以看到
- 当浏览器中输入 URL 之后, 浏览器先给服务器发送了一个 HTTP GET 请求
![[Pasted image 20221127194750.png]]
- 当点击 "发送 GET 请求" 按钮, 浏览器又通过 ajax 给服务器发送了一个 HTTP GET 请求
![[Pasted image 20221127194757.png]]

>注意这个 ajax 请求的 URL 路径. 代码中写的 URL` url: 'method'`, 为一个相对路径, 最终真实发送的请求的 URL 路径为   `/ServletHelloWorld/method`


### 关于乱码问题
如果我们在响应代码中写入中文, 例如
```java
resp.getWriter().write("GET 响应");
```

此时在浏览器访问的时候, 会看到 "乱码" 的情况.
![[Pasted image 20221127194954.png]]

>==关于 "乱码":==
>中文的编码方式有很多种. 其中最常见的就是 utf-8 .
>如果没有显式的指定编码方式, 则浏览器不能正确识别编码, 就会出现乱码的情况.


可以在代码中, 通过 `resp.setContentType("text/html; charset=utf-8");` 显式的指定编码方式.
![[Pasted image 20221127195103.png]]

此时通过抓包可以看到, 当加上了 `resp.setContentType("text/html; charset=utf-8");` 代码之后, 响应中多了 Content-Type 字段, 内部指定了编码方式. 浏览器看到这个字段就能够正确解析中文了.
![[Pasted image 20221127195134.png]]


### 代码示例: 处理 POST 请求
处理Post请求，一般使用以下三个
1. form
2. ajax
3. postman


下面主要使用ajax

在 **MethodServlet.java** 中, 新增 doPost 方法.
```java
@Override
protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws 
ServletException, IOException {
    resp.setContentType("text/html; charset=utf-8"); 
    resp.getWriter().write("POST 响应");
}
```

在 **testMethod.html** 中, 新增一个按钮, 和对应的点击事件处理函数
```java
<button onclick="sendPost()">发送 POST 请求</button> 
<script>
    function sendPost() { 
        ajax({
            method: 'POST', 
            url: 'method',
            callback: function (body, status) { 
                console.log(body);
            } 
        }) 
    }
</script>
```

重新部署程序，使用URL` http://127.0.0.1:8080/ServletHelloWor1d/testMethod.html`访问页面.
![[Pasted image 20221127202308.png]]
点击 "发送 POST 请求" 按钮, 可以在控制台中看到结果
![[Pasted image 20221127202319.png]]

通过类似的方式还可以验证 doPut, doDelete 等方法. 此处不再一一演示.


## HttpServletRequest
当 Tomcat 通过 Socket API 读取 HTTP 请求(字符串), 并且按照 HTTP 协议的格式把字符串解析成 `HttpServletRequest` 对象.

### 核心方法

|方法|描述|
|:-:| :--|
|`String getProtocol()`|返回请求协议的名称和版本。|
|`String getMethod()`|返回请求的 HTTP 方法的名称，例如，GET、POST 或 PUT。|
|`String getRequestURI()`|从协议名称直到 HTTP 请求的第一行的查询字符串中，返回该请求的 URL 的一部分。|
|`String getContextPath()`| 返回指示请求上下文的请求 URI 部分。|
|`String getQueryString()`|返回包含在路径后的请求 URL 中的查询字符串。 |
|`Enumeration getParameterNames()`|返回一个 String 对象的枚举，包含在该请求中包含的参数的名称。 |
|`String getParameter(String name)`|以字符串形式返回请求参数的值，或者如果参数不存在则返回 null。 |
|`String[] getParameterValues(String name)`|返回一个字符串对象的数组，包含所有给定的请求参数的值，如果参数不存在则返回 null。 |
|`Enumeration getHeaderNames()`|返回一个枚举，包含在该请求中包含的所有的头名。|
|`String getHeader(String name)`|以字符串形式返回指定的请求头的值。 |
|`String getCharacterEncoding()`|返回请求主体中使用的字符编码的名称。 |
|`String getContentType()`|返回请求主体的 MIME 类型，如果不知道类型则返回 null。|
|`int getContentLength()` |以字节为单位返回请求主体的长度，并提供输入流，或者如果长度未知则返回 -1。|
|`InputStream getInputStream()`| 用于读取请求的 body 内容. 返回一个 InputStream 对象.|
通过这些方法可以获取到一个请求中的各个方面的信息.
>注意: 请求对象是服务器收到的内容, 不应该修改. 因此上面的方法也都只是 "读" 方法, 而不是 "写" 方法.


![[Pasted image 20221127212102.png]]

![[Pasted image 20221127212110.png]]

![[Pasted image 20221127212119.png]]

![[Pasted image 20221127212127.png]]

### 代码示例: 打印请求信息 
创建 ShowRequest 类
```java
@WebServlet("/showRequest")
public class ShowRequest extends HttpServlet { 
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
throws ServletException, IOException {
        resp.setContentType("text/html; charset=utf-8");
        StringBuilder respBody = new StringBuilder();
        respBody.append(req.getProtocol());
        respBody.append("<br>");
        respBody.append(req.getMethod());
        respBody.append("<br>");
        respBody.append(req.getRequestURI());
        respBody.append("<br>");
        respBody.append(req.getContextPath());
        respBody.append("<br>");
        respBody.append(req.getQueryString());
        respBody.append("<br>");
        
        respBody.append("<h3>headers:</h3>");
        Enumeration<String> headerNames = req.getHeaderNames(); 
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            respBody.append(headerName + " ");
            respBody.append(req.getHeader(headerName));
            respBody.append("<br>"); 
        }
        resp.getWriter().write(respBody.toString()); 
    }
}
```

部署程序.
在浏览器通过 URL`http://127.0.0.1:8080/ServletHelloWorld/showRequest` 访问, 可以看到
![[Pasted image 20221127205448.png]]


### 代码示例: 获取 GET 请求中的参数
GET 请求中的参数一般都是通过 query string 传递给服务器的. 形如
`https://v.bitedu.vip/personInf/student?userId=1111&classId=100`
此时浏览器通过 query string 给服务器传递了两个参数, userId 和 classId, 值分别是 1111 和 100 
在服务器端就可以通过   `getParameter` 来获取到参数的值.


创建   GetParameter 类
```java
@WebServlet("/getParameter")
public class GetParameter extends HttpServlet { 
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
throws ServletException, IOException {
        resp.setContentType("text/html; charset=utf-8");
         
        String userId = req.getParameter("userId");
        String classId = req.getParameter("classId");
        resp.getWriter().write("userId: " + userId + ", " + "classId: " + classId);
    } 
}
```

重新部署程序, 在浏览器中通过 `http://127.0.0.1:8080/ServletHelloWorld/getParameter` 访问,可以看到
![[Pasted image 20221127210414.png]]

当没有 query string的时候, getParameter 获取的值为 null.

如果通过 `http://127.0.0.1:8080/ServletHelloWorld/getParameter?userId=123&classId=45` 访问, 可以看到。

此时说明服务器已经获取到客户端传递过来的参数.
>`getParameter` 的返回值类型为 String. 必要的时候需要手动把 String 转成 int.



### 代码示例:获取 POST 请求中的参数
POST 请求的参数一般通过 body 传递给服务器. body 中的数据格式有很多种. 如果是采用 form 表单的形式, 仍然可以通过   `getParameter` 获取参数的值.

Postq请求body格式目前主流的三种方法
1. 创建类   PostParameter
	- 如果请求是这种格式,服务器如何获取参数呢? 获取参数的方式和GET 一样,也是getParameter!!!
	- 使用form表单
	- 使用postman
2. form-data
	- 后面会讲
1. JSON
	- 手动处理比较麻烦，这里使用第三方库来直接处理json格式数据
	- 使用的是Jackson库(Spring官方推荐的库)


#### 方法一：创建类   PostParameter
创建类   PostParameter
```java
@WebServlet("/postParameter")
public class PostParameter extends HttpServlet { 
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) 
throws ServletException, IOException {
        resp.setContentType("text/html; charset=utf-8"); 
        
        String userId = req.getParameter("userId");
        String classId = req.getParameter("classId");
        resp.getWriter().write("userId: " + userId + ", " + "classId: " + classId);
    } 
}
```

创建 testPost.html, 放到 webapp 目录中
```html
<form action="postParameter" method="POST"> 
    <input type="text" name="userId">
    <input type="text" name="classId"> 
    <input type="submit" value="提交"> 
</form>
```


重新部署程序, 通过 URL `http://127.0.0.1:8080/ServletHelloWorld/testPost.html` 访问, 可以看到 HTML
![[Pasted image 20221127214005.png]]
在输入框中输入内容, 点击提交
![[Pasted image 20221127214019.png]]
可以看到跳转到了新的页面, 并显示出了刚刚传入的数据.
![[Pasted image 20221127214031.png]]

此时通过抓包可以看到, form 表单构造的 body 数据的格式为:
```
POST http://127.0.0.1:8080/ServletHelloWorld/postParameter HTTP/1.1 
Host: 127.0.0.1:8080
Connection: keep-alive 
Content-Length: 22 
Cache-Control: max-age=0
sec-ch-ua: " Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"
sec-ch-ua-mobile: ?0 
Upgrade-Insecure-Requests: 1 
Origin: http://127.0.0.1:8080
Content-Type: application/x-www-form-urlencoded
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36
Accept:
text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Referer: http://127.0.0.1:8080/ServletHelloWorld/testPost.html 
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8 

userId=123&classId=456
```
>Content-Type: application/x-www-form-urlencoded, 对应的 body 数据格式就形如
>userId=123&classId=456

#### 方法二：JSON
先把jackson库引入到项目中,这里使用的是**2.13.4.2**版本
将下面代码复制到**pox.xml** 文件中的`<dependencies>`标签中
```xml
<dependency>  
    <groupId>com.fasterxml.jackson.core</groupId>  
    <artifactId>jackson-databind</artifactId>  
    <version>2.13.4.2</version>  
</dependency>
```

创建 PostParameterJson 类
```java
import com.fasterxml.jackson.databind.ObjectMapper;  
  
import javax.servlet.ServletException;  
import javax.servlet.annotation.WebServlet;  
import javax.servlet.http.HttpServlet;  
import javax.servlet.http.HttpServletRequest;  
import javax.servlet.http.HttpServletResponse;  
import java.io.IOException;  
  
class User{  
    public int userId;  
    public int classId;  
}  
  
@WebServlet("/postJson")  
public class PostJsonServlet extends HttpServlet {  
    private ObjectMapper objectMapper = new ObjectMapper();  
  
    @Override  
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {  
        User user = objectMapper.readValue(req.getInputStream(), User.class);  
        resp.getWriter().write("userId: " + user.userId + ", classId: " + user.classId);  
    }  
}
```


创建 testPostJson.html
```html
<input type="text" id="userId">  
<input type="text" id="classId">  
<input type="button" value="提交" id="submit">  
  
<script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js"></script>  
<script>  
    let userIdInput = document.querySelector("#userId");  
    let classIdInput = document.querySelector("#classId");  
    let button = document.querySelector("#submit");  
    button.onclick=function (){  
        $.ajax({  
            type:'post',  
            url:'postJson',  
            contentType:'applicaion/json',  
            data:JSON.stringify({  
                userId:userIdInput.value,  
                classId:classIdInput.value  
            }),  
            success:function (body){  
                console.log(body);  
            }  
        })  
    }  
</script>
```
![[Pasted image 20221127221001.png]]


![[Pasted image 20221127221059.png]]

**结果：**
在浏览器中通过`http://127.0.0.1:8080/ServletHelloWorld/testPostJson.html`访问, 可以看到
![[Pasted image 20221127220647.png]]

在控制台中可以看到
![[Pasted image 20221127220723.png]]


>注意：
>JsonData 这个类用来表示解析之后生成的 JSON 对象. 这个类的属性的名字和类型要和 JSON 字符串的 key 相对应.
>- Jackson 库的核心类为 `ObjectMapper`. 其中的 `readValue` 方法把一个 JSON 字符串转成 Java 对象. 其中的 writeValueAsString 方法把一个 Java 对象转成 JSON 格式字符串.
>- `readValue` 的第二个参数为 JsonData 的  类对象. 通过这个类对象, 在 readValue 的内部就可以借助**反射机制**来构造出 JsonData 对象, 并且根据 JSON 中key 的名字, 把对应的 value 赋值给JsonData 的对应字段.


## HttpServletResponse
Servlet 中的 doXXX 方法的目的就是根据请求计算得到相应, 然后把响应的数据设置到HttpServletResponse 对象中.

然后 Tomcat 就会把这个  HttpServletResponse 对象按照 HTTP 协议的格式, 转成一个字符串, 并通过 
Socket 写回给浏览器.

|方法|描述|
|:-:|:--|
|`void setStatus(int sc)`|为该响应设置状态码。|
|`void setHeader(String name, String value)`| 设置一个带有给定的名称和值的 header. 如果 name 已经存在, 则覆盖旧的值.|
|`void addHeader(String name, String value)`|添加一个带有给定的名称和值的 header. 如果 name 已经存在, 不覆盖旧的值, 并列添加新的键值对 |
|`void setContentType(String type)` |设置被发送到客户端的响应的内容类型。  |
|`void setCharacterEncoding(String charset)` |设置被发送到客户端的响应的字符编码（MIME 字符集）例如，UTF-8。 |
|`void sendRedirect(String location)`|使用指定的重定向位置 URL 发送临时重定向响应到客户端。 |
| `PrintWriter getWriter()`|用于往 body 中写入文本格式数据.|
|`OutputStream getOutputStream()`|用于往 body 中写入二进制格式数据|
![[Pasted image 20221127222323.png]]

>**注意**: 响应对象是服务器要返回给浏览器的内容, 这里的重要信息都是程序猿设置的. 因此上面的方法都是 "写" 方法.
>**注意:** 对于状态码/响应头的设置要放到 getWriter / getOutputStream 之前. 否则可能设置失效.

###  代码示例: 设置状态码
实现一个程序, 用户在浏览器通过参数指定要返回响应的状态码.

创建 StatusServlet 类
```java
@WebServlet("/statusServlet")
public class StatusServlet extends HttpServlet { 
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String statusString = req.getParameter("status"); 
        
        if (statusString != null) {
            resp.setStatus(Integer.parseInt(statusString)); 
        }
        
        resp.getWriter().write("status: " + statusString); 
    }
}
```

部署程序, 在浏览器中通过 URL `http://127.0.0.1:8080/ServletHelloWorld/statusServlet?status=200`访问, 可以看到
![[Pasted image 20221127222817.png]]

抓包结果:
```
HTTP/1.1 200 
Content-Length: 11
Date: Mon, 21 Jun 2021 08:05:37 GMT 
Keep-Alive: timeout=20
Connection: keep-alive 

status: 200
```
变换不同的 status 的值, 就可以看到不同的响应结果.

### 代码示例: 自动刷新
实现一个程序, 让浏览器每秒钟自动刷新一次. 并显示当前的时间戳.

创建 AutoRefreshServlet 类
```java
@WebServlet("/autoRefreshServlet")
public class AutoRefreshServlet extends HttpServlet { 
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
throws ServletException, IOException {
        resp.setHeader("Refresh", "1");
        resp.getWriter().write("timeStamp: " + System.currentTimeMillis());
    }
}
```
通过 HTTP 响应报头中的 `Refresh`字段, 可以控制浏览器自动刷新的时机.


部署程序, 通过 URL `http://127.0.0.1:8080/ServletHelloWorld/autoRefreshServlet` 访问, 可以看到浏览器每秒钟自动刷新一次.
![[Pasted image 20221127223315.png]]

抓包结果
```java
HTTP/1.1 200 
Refresh: 1
Content-Length: 24
Date: Mon, 21 Jun 2021 08:14:29 GMT 
Keep-Alive: timeout=20
Connection: keep-alive 

timeStamp: 1624263269995
```


### 代码示例: 重定向
实现一个程序, 返回一个重定向 HTTP 响应, 自动跳转到另外一个页面.

创建 RedirectServlet 类
```java
@WebServlet("/redirectServlet") 
public class RedirectServlet extends HttpServlet {  
    @Override  
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {  
        // 在这里返回一个 302 重定向响应, 让浏览器, 自动跳转到 搜狗 主页  
        //resp.setStatus(302);  
        //resp.setHeader("Location", "https://www.sogou.com");  
        
        // Servlet 提供了一个更简便的实现重定向的写法. sendedirect方法  
        resp.sendRedirect("https://www.sogou.com");  
    }  
}
```
部署程序, 通过 URL `http://127.0.0.1:8080/ServletHelloWorld/redirectServlet` 访问, 可以看 
到, 页面自动跳转到  搜狗主页  了.

抓包结果
![[Pasted image 20221127223527.png]]
```
HTTP/1.1 302
Location: http://www.sogou.com 
Content-Length: 0
Date: Mon, 21 Jun 2021 08:17:26 GMT 
Keep-Alive: timeout=20
Connection: keep-alive
```


## 代码示例: 服务器版表白墙
结合上述 API, 我们可以把之前实现的表白墙程序修改成服务器版本. 这样即使页面关闭, 表白墙的内容也不会丢失.

1. 告诉服务器,当前留言了一条啥样的数据
![[Pasted image 20221129130743.png]]


2. 从服务器获取到,当前都有哪些留言数据
![[Pasted image 20221129130941.png]]
 
### 必知点
![[Pasted image 20221129131404.png]]

- ObjectMapper 的 readValue 方法也能直接从一个 InputStream 对象读取数据. 
- ObjectMapper 的 writeValueAsString 方法也能把一个对象数组直接转成 JSON 格式的字符串.

#### 对象和JSON字符串之间的转换
**Java**
`objectMapper.readValue`把 json字符串转成对象
`objectMapper.writeValueAsString` 把对象转成json字符串

**JS**
`JSON.parse`把 json字符串转成对象
`JSON.stringify`把对象转成json字符串

### 项目代码
- 新建一个项目：message_wall

- pox.xml 文件配置
```xml
<?xml version="1.0" encoding="UTF-8"?>  
<project xmlns="http://maven.apache.org/POM/4.0.0"  
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">  
    <modelVersion>4.0.0</modelVersion>  
  
    <groupId>org.example</groupId>  
    <artifactId>message_wall</artifactId>  
    <version>1.0-SNAPSHOT</version>  
  
    <properties>        
	    <maven.compiler.source>8</maven.compiler.source>  
        <maven.compiler.target>8</maven.compiler.target>  
    </properties>  
    <dependencies>        
	    <dependency>            
		    <groupId>javax.servlet</groupId>  
            <artifactId>javax.servlet-api</artifactId>  
            <version>3.1.0</version>  
            <scope>provided</scope>  
        </dependency>        
        
        <dependency>            
	        <groupId>com.fasterxml.jackson.core</groupId>  
            <artifactId>jackson-databind</artifactId>  
            <version>2.13.0</version>  
        </dependency>  
        
        <dependency>            
	        <groupId>mysql</groupId>  
            <artifactId>mysql-connector-java</artifactId>  
            <version>8.0.28</version>  
        </dependency>    
    </dependencies>  
</project>
```

**表白墙：love_wall.html**
在文件中加入ajax代码来与服务器进行交互。
```html
<!DOCTYPE html>  
<html lang="en">  
  
<head>  
    <meta charset="UTF-8">  
    <meta http-equiv="X-UA-Compatible" content="IE=edge">  
    <meta name="viewport" content="width=device-width, initial-scale=1.0">  
    <title>表白墙</title>  
</head>  
  
<body>  
<style>  
    * {  
        margin: 0;  
        padding: 0;  
        box-sizing: border-box;  
    }  
  
    .container {  
        width: 100%;  
    }  
  
    h3 {  
        text-align: center;  
        padding: 30px 0;  
        font-size: 24px;  
    }  
  
    p {  
        text-align: center;  
        color: #999;  
        padding: 10px 0;  
    }  
  
    .row {  
        width: 400px;  
        height: 50px;  
        margin: 0 auto;  
  
        display: flex;  
        justify-content: center;  
        align-items: center;  
    }  
  
    .row span {  
        width: 60px;  
        font-size: 20px;  
    }  
  
    .row input {  
        width: 300px;  
        height: 40px;  
        line-height: 40px;  
        font-size: 20px;  
        text-indent: 0.5em;  
        /* 去掉输入框的轮廓线 */        outline: none;  
    }  
  
    .row #submit {  
        width: 300px;  
        height: 40px;  
        font-size: 20px;  
        line-height: 40px;  
        margin: 0 auto;  
  
        color: white;  
        background-color: orange;  
        /* 去掉边框 */        border: none;  
  
        border-radius: 10px;  
    }  
  
    .row #submit:active {  
        background-color: gray;  
    }  
</style>  
<div class="container">  
    <h3>表白墙</h3>  
    <p>输入后点击提交, 会将信息显示在表格中</p>  
    <div class="row">  
        <span>谁: </span>  
        <input type="text">  
    </div>    <div class="row">  
        <span>对谁: </span>  
        <input type="text">  
    </div>    <div class="row">  
        <span>说: </span>  
        <input type="text">  
    </div>    <div class="row">  
        <button id="submit">提交</button>  
    </div></div>  
  
<script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js"></script>  
<script>  
    // 加入ajax的代码，此处加入导入逻辑有两个部分  
    // 点击按钮提交的时候，ajax要构造数据发给服务器  
    // 页面加载时，从服务器获取消息列表， 并在界面上直接显示  
    function getMessages() {  
        $.ajax({  
            type: "get",  
            url: "message",  
            success: function (body) {  
                // 当前body以及是一个js对象的数组了，ajax会根据响应的content type来自动进行解析  
                // 如果服务器返回的content-type 已经是 application/json 了， ajax就会把body自动转成js的对象  
                // 如果客户端没有自动转换，也可以通过 JSON.parse() 这个函数来手动转换  
  
                let container = document.querySelector('.container');  
                for (let message of body) {  
                    let div = document.createElement('div');  
                    div.innerHTML = message.from + ' 对 ' + message.to + ' 说 ' + message.message;  
                    div.className = 'row';  
                    container.appendChild(div);  
                }  
            }  
        });  
    }  
  
    getMessages();  
    // 当用户点击 submit, 就会获取到 input 中的内容, 从而把内容构造成一个 div, 插入到页面末尾.  
    let submitBtn = document.querySelector('#submit');  
    submitBtn.onclick = function () {  
        // 1. 获取到 3 个 input 中的内容.  
        let inputs = document.querySelectorAll('input');  
        let from = inputs[0].value;  
        let to = inputs[1].value;  
        let msg = inputs[2].value;  
        if (from == '' || to == '' || msg == '') {  
            // 用户还没填写完, 暂时先不提交数据.  
            return;  
        }  
        // 2. 生成一个新的 div, 内容就是 input 里的内容. 把这个新的 div 加到页面中.  
        let div = document.createElement('div');  
        div.innerHTML = from + ' 对 ' + to + ' 说: ' + msg;  
        div.className = 'row';  
        let container = document.querySelector('.container');  
        container.appendChild(div);  
        // 3. 清空之前输入框的内容.  
        for (let i = 0; i < inputs.length; i++) {  
            inputs[i].value = '';  
        }  
  
        //4. 把当前获取到的输入框的内容，构造成一个HTTP Post请求，通过ajax发个服务器  
        let body = {  
            from: from,  
            to: to,  
            message: msg  
        };  
  
        $.ajax({  
            type: "post",  
            url: "message",  
            contentType: "application/json; charset=utf8",  
            data: JSON.stringify(body),  
            success: function (body) {  
                alert("消息提交成功");  
            },  
            error: function () {  
                alert("消息提交失败");  
            }  
        });  
    }  
  
  
</script>  
</body>  
  
</html>
```


**创建 MessageServlet 类**
其中包含了 Message类， Message类就是每一条数据的格式
```java
import com.fasterxml.jackson.databind.ObjectMapper;  
  
import javax.servlet.ServletException;  
import javax.servlet.annotation.WebServlet;  
import javax.servlet.http.HttpServlet;  
import javax.servlet.http.HttpServletRequest;  
import javax.servlet.http.HttpServletResponse;  
import java.io.IOException;  
import java.sql.Connection;  
import java.sql.PreparedStatement;  
import java.sql.ResultSet;  
import java.sql.SQLException;  
import java.util.ArrayList;  
import java.util.List;  
  
  
class Message {  
    public String from;  
    public String to;  
    public String message;  
}  
  
@WebServlet("/message")  
public class MessageServlet extends HttpServlet {  
    private ObjectMapper objectMapper = new ObjectMapper();  
  
    // 改成数据库, 就不需要这个变量了  
    // private List<Message> messages = new ArrayList<>();  
  
    @Override  
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {  
        // 处理提交消息请求  
        Message message = objectMapper.readValue(req.getInputStream(), Message.class);  
        // 最简单的保存方法就是保存到内存中.  
        // messages.add(message);        // 通过 ContentType 来告知页面, 返回的数据是 json 格式.  
        // 有了这样的声明, 此时 jquery ajax 就会自动的帮我们把字符串转成 js 对象.  
        // 如果没有, jquery ajax 就只是当成字符串来处理的~~  
        save(message);  
        resp.setContentType("application/json; charset=utf8");  
        resp.getWriter().write("{ \"ok\": true }");  
    }  
  
    @Override  
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {  
        // 获取到消息列表. 只要把消息列表中的内容整个的都返回给客户端即可  
        // 此处需要使用 ObjectMapper 把 Java 对象, 转成 JSON 格式字符串~  
        List<Message> messages = load();  
        String jsonString = objectMapper.writeValueAsString(messages);  
        System.out.println("jsonString: " + jsonString);  
        resp.setContentType("application/json; charset=utf8");  
        resp.getWriter().write(jsonString);  
    }  
  
    private void save(Message message) {  
        // 把一条消息保存到数据库中  
        Connection connection = null;  
        PreparedStatement statement = null;  
        try {  
            // 1. 和数据库建立连接  
            connection = DBUtil.getConnection();  
            // 2. 构造 SQL            
            String sql = "insert into message values(?, ?, ?)";  
            statement = connection.prepareStatement(sql);  
            statement.setString(1, message.from);  
            statement.setString(2, message.to);  
            statement.setString(3, message.message);  
            // 3. 执行 SQL            statement.executeUpdate();  
        } catch (SQLException e) {  
            e.printStackTrace();  
        } finally {  
            DBUtil.close(connection, statement, null);  
        }  
    }  
  
    private List<Message> load() {  
        // 从数据库中获取到所有的消息  
        List<Message> messages = new ArrayList<>();  
        Connection connection = null;  
        PreparedStatement statement = null;  
        ResultSet resultSet = null;  
        try {  
            connection = DBUtil.getConnection();  
            String sql = "select * from message";  
            statement = connection.prepareStatement(sql);  
            resultSet = statement.executeQuery();  
            while (resultSet.next()) {  
                Message message = new Message();  
                message.from = resultSet.getString("from");  
                message.to = resultSet.getString("to");  
                message.message =  resultSet.getString("message");  
                messages.add(message);  
            }  
        } catch (SQLException throwables) {  
            throwables.printStackTrace();  
        } finally {  
            DBUtil.close(connection, statement, resultSet);  
        }  
        return messages;  
    }  
}
```


**DBUtil类**
这里我在mysql中创建了一个message_wall库,在库中创建了message表
```sql
create database message_wall;

use message_wall;

create table message(`from` varchar(100) , `to` varchar(100) , to text);
```
from 和 to是sql中的关键字.当关键字作为表名/列名的时候,需要加上反引号 


```java
import com.mysql.cj.jdbc.MysqlDataSource;  
  
import javax.sql.DataSource;  
import java.sql.Connection;  
import java.sql.PreparedStatement;  
import java.sql.ResultSet;  
import java.sql.SQLException;  
  
public class DBUtil {  
    private static final String URL = "jdbc:mysql://127.0.0.1:3306/message_wall?characterEncoding=utf8&useSSL=false";  
    private static final String USERNAME = "root";  
    private static final String PASSWORD = "back7671773";  
  
    private volatile static DataSource dataSource = null;  
  
    private static DataSource getDataSource() {   // getConnection 是在多线程环境下执行的，所以有线程安全问题，所以在这里使用了双判定
        if (dataSource == null) {  
            synchronized (DBUtil.class) {  
                if (dataSource == null) {  
                    dataSource = new MysqlDataSource();  
                    ((MysqlDataSource)dataSource).setUrl(URL);  
                    ((MysqlDataSource)dataSource).setUser(USERNAME);  
                    ((MysqlDataSource)dataSource).setPassword(PASSWORD);  
                }  
            }  
        }  
        return dataSource;  
    }  
  
    public static Connection getConnection() throws SQLException {  
        return getDataSource().getConnection();  
    }  
  
    public static void close(Connection connection, PreparedStatement statement, ResultSet resultSet) {  
        if (resultSet != null) {  
            try {  
                resultSet.close();  
            } catch (SQLException e) {  
                e.printStackTrace();  
            }  
        }  
        if (statement != null) {  
            try {  
                statement.close();  
            } catch (SQLException e) {  
                e.printStackTrace();  
            }  
        }  
        if (connection != null) {  
            try {  
                connection.close();  
            } catch (SQLException e) {  
                e.printStackTrace();  
            }  
        }  
    }  
}
```


## 小结
开发 一个表白墙网站的基本步骤
1. 约定前后端交互的接口
2. 开发服务器代码
	1) 先编写 Servlet能够处理前端发来的请求
	2) 编写数据库代码 ， 来存储/获取关键数据
3. 开发客户端代码
	1) 基于ajax能够构造请求以及解析响应
	2) 能够响应用户的操作(点击按钮之后,触发给服务器发送请求的行为)


其实也就是MVC (Model , View , Controller)

Controller(控制器,处理请求之后的关键逻辑)
Model(操作数据存取的逻辑)
View(给用户展示的界面)

![[Pasted image 20221129132402.png]]





# Cookie 和 Session

## 回顾 Cookie
HTTP 协议自身是属于 "无状态" 协议.
>=="无状态" 的含义指的是==:
>默认情况下 HTTP 协议的客户端和服务器之间的这次通信, 和下次通信之间没有直接的联系.

但是实际开发中, 我们很多时候是需要知道请求之间的关联关系的.
>例如登陆网站成功后, 第二次访问的时候服务器就能知道该请求是否是已经登陆过了.
![[Pasted image 20221129134254.png]]

图中的 "令牌" 通常就存储在 Cookie 字段中.
回忆之前的例子:
1. 到了医院先挂号. 挂号时候需要提供身份证, 同时得到了一张 "就诊卡", 这个就诊卡就相当于患者的 "令牌".
2. 后续去各个科室进行检查, 诊断, 开药等操作, 都不必再出示身份证了, 只要凭就诊卡即可识别 出当前患者的身份.
3. 看完病了之后, 不想要就诊卡了, 就可以注销这个卡. 此时患者的身份和就诊卡的关联就销毁了. (类似于网站的注销操作)
4. 又来看病, 可以办一张新的就诊卡, 此时就得到了一个新的 "令牌"此时在服务器这边就需要记录令牌信息, 以及令牌对应的用户信息, 这个就是 Session 机制所做的工作.

此时在服务器这边就需要记录令牌信息, 以及令牌对应的用户信息, 这个就是 Session 机制所做的工作.


## 理解会话机制 (Session)
服务器同一时刻收到的请求是很多的. 服务器需要清楚的区分每个请求是从属于哪个用户, 就需要在 服务器这边记录每个用户令牌以及用户的信息的对应关系.
>在上面的例子中, 就诊卡就是一张 "令牌". 要想让这个令牌能够生效, 就需要医院这边通过系统记录每个就诊卡和患者信息之间的关联关系.

会话的本质就是一个 "哈希表", 存储了一些键值对结构. key 就是令牌的 ID(token/sessionId), value 就是用户信息(用户信息可以根据需求灵活设计).
>sessionId 是由服务器生成的一个 "唯一性字符串", 从 session 机制的角度来看, 这个唯一性字符串称为 "sessionId". 但是站在整个登录流程中看待, 也可以把这个唯一性字符串称为 "token".
>
>sessionId 和 token 就可以理解成是同一个东西的不同叫法(不同视角的叫法).

![[Pasted image 20221129134607.png]]

- 当用户登陆的时候, 服务器在 Session 中新增一个新记录, 并把 sessionId / token 返回给客户端. (例如通过 HTTP 响应中的 Set-Cookie 字段返回).
- 客户端后续再给服务器发送请求的时候, 需要在请求中带上 sessionId/ token. (例如通过 HTTP 请求中的 Cookie 字段带上).
- 服务器收到请求之后, 根据请求中的 sessionId / token 在 Session 信息中获取到对应的用户信息, 再进行后续操作.

>Servlet 的 Session 默认是保存在内存中的. 如果重启服务器则 Session 数据就会丢失.

### Cookie 和 Session 的区别
- Cookie 是客户端的机制. Session 是服务器端的机制.
- Cookie 和 Session 经常会在一起配合使用. 但是不是必须配合.
	- 完全可以用 Cookie 来保存一些数据在客户端. 这些数据不一定是用户身份信息, 也不一定是 token / sessionId
	- Session 中的 token / sessionId 也不需要非得通过 Cookie / Set-Cookie 传递.


## 核心方法
### HttpServletRequest 类中的相关方法

|方法|描述|
|:-:|:--|
|`HttpSession getSession()`|在服务器中获取会话. 参数如果为 true, 则当不存在会话时新建会话; 参数如果为 false, 则当不存在会话时返回 null|
|`Cookie[] getCookies()`|返回一个数组, 包含客户端发送该请求的所有的 Cookie 对象. 会自动把 Cookie 中的格式解析成键值对.|

#### 调用getSession的时候具体要做的事情
`getSession`方法，既能用于获取到服务器上的会话,也能用于创建会话.具体行为，取决于参数.
- 如果参数为**true**:
	- 会话不存在,则创建
	- 会话存在,则获取
- 如果参数为**false**:
	- 会话不存在,则返回null
	- 会话存在,则获取

**1. 创建会话**
首先先获取到请求中cookie里面的sessionld字段(相当于会话的身份标识)判定这个sessionld是否在当前服务器上存在, 如果不存在,则进入创建会话逻辑

创建会话,会创建一个HttpSession对象,并且生成一个sessionld (是一个很长的数字，通常是用十六进制来表示,能够保证唯一性)
接下来就会把这个sessionld 作为 key,把这个HttpSession对象，作为 value,把这个键值对,给保存到服务器内存的一个"哈希表”这样的结构中
>实际的实现不一定真是Hash表,但是一定是类似的能够存储键值对的结构并且这个数据是在内存中的!!

再然后,服务器就会返回一个HTTP响应，把 sessionld通过Set-Cookie 字段返回给浏览器.
浏览器就可以保存这个sessionld 到Cookie中了.

**2.获取会话**
先获取到请求中的cookie里面的sessionld字段(也就是会话的身份标识)
判定这个sessionld是否在当前服务器上存在(也就是在这个哈希表中是否有)
如果有,就直接查询出这个HttpSession对象，并且通过返回值返回回去

#### 调用getCookie的时候具体要做的事情
![[Pasted image 20221129141415.png]]


### HttpServletResponse 类中的相关方法
|方法|描述|
|:-:|:--|
|`void addCookie(Cookie cookie)`|把指定的 cookie 添加到响应中.|
响应中就可以根据addCookie这个方法,来添加一个Cookie信息到响应报文中.
这里添加进来的键值对,就会作为HTTP响应中的Set-Cookie字段来表示

### HttpSession 类中的相关方法
一个 HttpSession 对象里面包含多个键值对. 我们可以往 HttpSession 中存任何我们需要的信息.
|方法|描述|
|:-:|:--|
|`Object getAttribute(String name)`|该方法返回在该 session 会话中具有指定名称的对象，如果没有指定名称的对象，则返回 null.|
|`void setAttribute(String name, Object value)`|该方法使用指定的名称绑定一个对象到该 session 会话|
|`boolean isNew()`|判定当前是否是新创建出的会话|

### Cookie 类中的相关方法
每个 Cookie 对象就是一个键值对.
|方法|描述|
|:-:|:--|
|`String getName()`|该方法返回 cookie 的名称。名称在创建后不能改变。(这个值是 Set-Cooke 字段设置给浏览器的)|
|`String getValue()`|该方法获取与 cookie 关联的值|
|`void setValue(String newValue)`|该方法设置与 cookie 关联的值。|
- HTTP 的 Cooke 字段中存储的实际上是多组键值对. 每个键值对在 Servlet 中都对应了一个 Cookie对象. 
- 通过`HttpServletRequest.getCookies()`获取到**请求中**的一系列 Cookie 键值对. 
- 通过`HttpServletResponse.addCookie()`可以向**响应中**添加新的 Cookie 键值对.



## 代码示例: 网页登陆
**实现逻辑**
![[Pasted image 20221129141747.png]]

**登录交互**
![[Pasted image 20221129141852.png]]

**LoginServlet类**
```java
import javax.servlet.ServletException;  
import javax.servlet.annotation.WebServlet;  
import javax.servlet.http.HttpServlet;  
import javax.servlet.http.HttpServletRequest;  
import javax.servlet.http.HttpServletResponse;  
import javax.servlet.http.HttpSession;  
import java.io.IOException;  
  
@WebServlet("/login")  
public class LoginServlet extends HttpServlet {  
    @Override  
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {  
        // 处理用户请求  
        String username = req.getParameter("username");  
        String password = req.getParameter("password");  
        
        // 判定用户名或者密码是否正确~~  
        // 正常来说这个判定操作是要放到数据库中进行存取的.  
        // 此处为了简单, 就直接在代码里写死了. 假设有效的用户名和密码是 "fmy", "123"        
        if ("fmy".equals(username) && "123".equals(password)) {  
            // 登录成功!  
            // 创建会话, 并保存必要的身份信息.  
            HttpSession httpSession = req.getSession(true);  
            // 往会话中存储键值对. 必要的身份信息  
            httpSession.setAttribute("username", username);  
            // 初始情况下, 把登录次数设为 0            
            httpSession.setAttribute("count", 0);  //这里会将 0 自动装箱为Integer
            resp.sendRedirect("index");  
        } else {  
            // 登录失败!  
            resp.getWriter().write("login failed!");  
        }  
    }  
}
```


**IndexServlet类**
```java
import javax.servlet.ServletException;  
import javax.servlet.annotation.WebServlet;  
import javax.servlet.http.HttpServlet;  
import javax.servlet.http.HttpServletRequest;  
import javax.servlet.http.HttpServletResponse;  
import javax.servlet.http.HttpSession;  
import java.io.IOException;  
  
@WebServlet("/index")  
public class IndexServlet extends HttpServlet {  
    @Override  
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {  
        // 返回一个主页. (主页就是一个简单的 html 片段)  
        // 此处需要得到用户名是啥, 从 HttpSession 中就能拿到.  
        // 此处 getSession 的参数必须是 false. 前面在登录过程中, 已经创建过会话了. 此处是要直接获取到之前的会话.  
        HttpSession session = req.getSession(false);  
        String username = (String) session.getAttribute("username");  
        // 还从会话中取出 count.        
        Integer count = (Integer) session.getAttribute("count");  
        count += 1;  
        
        // 把自增之后的值写回到会话中.  
        session.setAttribute("count", count);  
  
        resp.setContentType("text/html;charset=utf8");  
        resp.getWriter().write("<h3>欢迎你! " + username + " 这是第 " + count + " 次访问主页 </h3>");  
    }  
}
```


**login.html**
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <form action="login" method="post">
        <input type="text" name="username">
        <input type="password" name="password">
        <input type="submit" value="登录">
    </form>

</body>

</html>
```
**action**的值就是构造请求的路径.
如果值是`/login`表示这是一个绝对路径
直接把`/login` 作为请求中的路径了~~
正确的做法,应该是在这里使用相对路径没有`/`，光是一个`login` 
路径这个写法,哪里要加`/`    哪里不加`/`一定要多加注意

在 `http://localhost:8080/ServletHelloWorld/login.html` 中输入 **fmy** 和 **123**
![[Pasted image 20221129145506.png]]

![[Pasted image 20221129145520.png]]


![[Pasted image 20221129150247.png]]




# 上传文件
上传文件也是日常开发中的一类常见需求. 在 Servlet 中也进行了支持.

## 核心方法
### HttpServletRequest 类方法
|方法|描述|
|:-:|:--|
|`Part getPart(String name)`|获取请求中给定 name 的文件|
|`Collection<Part> getParts()`|获取所有的文件|
上传文件的时候,在前端需要用到form表单
form表单中需要使用特殊的类型  `form-data`

此时提交文件的时候,浏览器就会把文件内容以`form-data`的格式构造到HTTP请求中.服务器就可以通过`getPart()`来获取了


### Part 类方法
|方法|描述|
|:-:|:--|
|`String getSubmittedFileName()`|获取提交的文件名|
|`String getContentType()`| 获取提交的文件类型|
|`long getSize()`|获取文件的大小|
|`void write(String path)`|把提交的文件数据写入磁盘文件|

一个HTTP请求,可以一次性的提交多个文件的

每个文件都称为一个Part 
每个Part 都有一个name(身份标识)
服务器代码中就可以根据name找到对应的Part
基于这个Part就可以进一步的获取到文件信息,并进行下一阶段操作


### 代码案例
实现程序, 通过网页提交一个图片到服务器上.

**1. 创建 upload.html, 放到 webapp 目录中.**
```html
<form action="upload" method="post" enctype="multipart/form-data">
	   <input type="file" name="MyImage">
	   <input type="submit" value="提交图片">
</form>
```
- 上传文件一般通过 POST 请求的表单实现. 
- 在 form 中要加上   `multipart/form-data` 字段.


上传文件的时候,在前端需要用到form表单
form表单中需要使用特殊的类型  `form-data`

此时提交文件的时候,浏览器就会把文件内容以`form-data`的格式构造到HTTP请求中.服务器就可以通过`getPart()`来获取了


**2. 创建 UploadServlet 类**
```java
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.IOException;

@MultipartConfig
@WebServlet("/upload")
public class UploadServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Part part = req.getPart("MyImage");
        System.out.println(part.getSubmittedFileName());
        System.out.println(part.getContentType());
        System.out.println(part.getSize());
        part.write("S:\images/123.png");// 写到该目录中，可对文件进行修改，现在的文件名就是aaa.jpg
        resp.setContentType("text/html; charset=utf8");
        resp.getWriter().write("上传成功!");
    }
}
```

- 需要给UploadServlet加上`@Multipartconfig`注解.否则服务器代码无法使用`getPart()`方法
- `getPart()`的参数需要和form中input标签的name属性对应.
- 客户端一次可以提交多个文件.(使用多个input标签).此时服务器可以通过`getParts` 获取所有的Part对象.


![[Pasted image 20221129153506.png]]


部署程序, 在浏览器中通过 URL `http://localhost:8080/ServletHelloWorld/upload.html` 访问
![[Pasted image 20221129154213.png]]

![[Pasted image 20221129154318.png]]

此时可以看到服务器端的打印日志
```
df69b2b0f6d22f69a4698b7e7762e77.png
image/png
2521596
```

同时在 s 盘中生成了 123.png
![[Pasted image 20221129154557.png]]

抓包时可以发现
![[Pasted image 20221129154756.png]]