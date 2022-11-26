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


  



