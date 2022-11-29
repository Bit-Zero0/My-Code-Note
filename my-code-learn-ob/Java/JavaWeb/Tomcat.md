Tomcat是一个免费的开源的Servlet容器，它是Apache基金会的Jakarta项目中的一个核心项目，由Apache，Sun（现在已属于Oracle）和其它一些公司及个人共同开发而成。由于有了Sun的参与和支持，最新的Servlet和JSP规范总能在Tomcat中得到体现

# 安装
到[官网](https://tomcat.apache.org/)进行下载，推荐使用 大版本为8的版本,jdk也建议使用8版本。
![[Pasted image 20221126154251.png]]
选择其中的 zip 压缩包, 下载后解压缩即可.
>解压缩的目录最好不要带 "中文" 或者  特殊符号.

# tomcat目录结构
针对 tomcat 目录解压缩之后, 可以看到如下结构
```
apache-tomcat-8.5.47\
    bin\        存放各种启动、停止脚本的。*.sh 是以后在 linux 上用的，*.bat 是在 windows上用的
        startup.bat     启动服务，双击即可使用 
    conf\       相关的配置文件，目前我们不用关心 
    lib\        运行 tomcat 需要的类库，我们不关心
    logs\       运行时的日志文件，我们有时需要查看日志，来发现定位一些问题 
    temp\       临时文件夹，不关心
    webapps\    存放我们要运行的 web application 的文件夹，对于我们最常用的一个文件夹 
    work\       Tomcat 内部进行预编译的文件夹，我们不关心

下面都是一些文档，有兴趣的同学可以自行阅读 
    BUIDING.txt
    CONTRIBUTING.md 
    LICENSE
    NOTICE
    README.md 
    RELEASE-NOTES 
    RUNNING.txt
```

其中我们最关注的目录就是 webapps 目录.  web applications 的简称, 意思是用来存放 web 应用的文件夹.
>==理解 "web 应用"==
>一个具有独立完整功能的 "网站", 我们就可以称为一个 "web 应用".
>例如  搜狗搜索  实现了独立完整的 "搜索引擎功能", 淘宝网  实现了独立完整的 "电商功能" . 
>一个 Tomcat 服务器上是可以同时部署多个这样的 web 应用的. 这些 web 应用以目录的形式被放到 webapps 目录中.

**进入 webapps 目录**
```
webapps\
    docs\
    examples\ 
    host-manager\ 
    manager\ 
    ROOT\
```
每个文件夹都对应着一个 web 应用, 可以在浏览器中分别访问每个 web 应用.

# 启动服务器
在 bin 目录中, 双击   startup.bat 即可启动 Tomcat 服务器 
看到形如以下内容的日志, 说明启动成功.
![[Pasted image 20221126154616.png]]
>注意: 在 Windows 上通过 cmd 方式启动 Tomcat 会出现乱码. **但是不影响 Tomcat 的使用**. 
>乱码的原因是 Tomcat 默认按照 UTF-8 的编码方式处理中文. 而 windows 的 cmd 默认是 GBK 编码.
>如果使用 Linux 或者 IDEA 中的终端来启动 Tomcat, 则没有乱码问题. **因此此处的乱码我们暂时不处理**.

在浏览器中输入   127.0.0.1:8080 即可看到 Tomcat 的默认欢迎页面.
![[Pasted image 20221126154838.png]]

**如果启动失败怎么办?**
- 最常见的启动失败原因是端口号被占用. 
- Tomcat 启动的时候默认会绑定 8080 和 8005 端口.
- 如果有其他进程已经绑定了这两个端口中的任意一个, 都会导致 Tomcat 不能启动.
- 在命令行中使用  ` netstat -ano | findstr 8080` 确定看 8080 是否被其他进程绑定, 把对方进程干掉, 再重新启动 Tomcat 一般就可以解决问题.
![[Pasted image 20221126154930.png]]
>形如这样的结果说明 8080 端口已经被占用. 占用的进程是 13348 这个进程. 
>然后就可以在任务管理器中找到这个进程, 并干掉这个进程.


# 部署静态页面
**理解 "静态"**
**静态页面**也就是内容始终固定的页面. 即使  **用户不同/时间不同/输入的参数不同 , 页面内容也不会发生变化**. (除非网站的开发人员修改源代码, 否则页面内容始终不变).

对应的, **动态页面**指的就是  **用户不同/时间不同/输入的参数不同, 页面内容会发生变化**.

举个栗子:
Tomcat 的主页   https://tomcat.apache.org/ 就是一个静态页面.
![[Pasted image 20221126155140.png]]

而 B 站的主页   https://www.bilibili.com/ 则是一个动态页面.
![[Pasted image 20221126155146.png]]

之前咱们写的 HTML, 都是写成固定的内容, 就可以理解成是 "静态页面"

## 部署单个 HTML
我们可以把自己写好的 HTML 部署到 Tomcat 中. 
1) 创建 hello.html
```html
<!doctype html> 
<html lang="en"> 
<head>
    <meta charset="UTF-8"> 
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge"> 
    <title>hello</title>
</head> 
<body>
    <div>hello</div> 
</body>
</html>
```

2) 把 hello.html 拷贝到 Tomcat 的 webapps/ROOT 目录中.
![[Pasted image 20221126160050.png]]

3) 在浏览器中通过 URL `http://127.0.0.1:8080/hello.html` 来访问
![[Pasted image 20221126160128.png]]

>注意: 127.0.0.1 为环回 IP, 表示当前主机. 此时我们无法通过这个 IP 访问到别人电脑上的页面.

## 部署带有 CSS / JavaScript / 图片  的 HTML
实际开发时我们的 HTML 不仅仅是单一文件, 还需要依赖一些其他的资源: CSS, JavaScript, 图片等. 
这些资源也要一起部署过去
我们这里就将我们写过的 [[WebAPI#代码案例: 猜数字|猜数字]] 和 [[WebAPI#代码案例: 表白墙|表白墙]]进行部署吧
将文件拷贝到Tomcat 的   `webapps/ROOT` 中.
![[Pasted image 20221126160826.png]]

此时就可以在浏览器中进行访问了
![[Pasted image 20221126161054.png]]


# 部署动态页面
通过[[Servlet]]进行构建动态页面