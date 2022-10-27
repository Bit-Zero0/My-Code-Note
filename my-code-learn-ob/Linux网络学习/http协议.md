# HTTP 是什么？

HTTP 是超文本传输协议，也就是**H**yperText **T**ransfer **P**rotocol。

> 能否详细解释「超文本传输协议」？

HTTP的名字「超文本协议传输」，它可以拆成三个部分：

-   超文本
-   传输
-   协议

![[Pasted image 20221027162013.png]]

注意：==**HTTP协议是应用层协议**==

# 认识URL
平时我们见到的 "==网址==" 其实就是==**URL**==.
![[Pasted image 20221027162442.png]]


服务器后台，是用Linux做的。
==**IP + Port**==唯一的确定一个进程。
但是我们无法唯一的确认一个资源 !公冈IP地址是唯一确认一台主机的，而我们所谓的网络"资源"都一定是存在于网络中的一台Linux机L器上! Linux或者传统的操作系统，保存资源的方式，都是以文件的方式保存的。单Linux 系统，标识一个唯一资源的方式，通过路径!

```
http://www.chaleague.com/data/#/gsmes
```
其中`www.chaleague.com/data`就是IP加linux路径。


## urlencode和urldecode
像 `/` `?` `:` 等这样的字符, 已经被url当做特殊意义理解了. 因此这些字符不能随意出现. 
>比如, 某个参数中需要带有这些特殊字符, 就必须先对特殊字符进行转义.

转义的规则如下:
- 将需要转码的字符转为16进制，然后从右到左，取4位(不足4位直接处理)，每2位做一位，前面加上`%`，编码成`%XY`格式

列如：我们在浏览器中搜索 C++
![[Pasted image 20221027163248.png]]
`+` 被转义成了 `%2B` ，导航栏显示的 `c%2B%2B` 翻译后其实就是 `c++ ` , 这个过程就是==**urlencode**==

==**urldecode**==就是**urlencode的逆过程**;

[urlencode转化工具](http://tool.chinaz.com/Tools/urlencode.aspx)

# HTTP协议格式
![[Pasted image 20221027165018.png]]
**无论是请求还是响应，基本上http都是按照行(`\n`)为单位进行构建请求或者响应的!**


## request请求头解析
Method：表示我们请求的方法：get ， post ， head 等；

URL：我们请求的网址；

Version：http协议的版本，目前最常用的是 `http1.1` 和 `http1.0`(快淘汰了);

## response请求头
Version：http协议的版本，目前最常用的是 `http1.1` 和 `http1.0`(快淘汰了);

状态码 和 状态码描述：反馈响应结果，描述是否正确，错误的原因是什么。


## 实际的http报文
==**Request**==从请求行到空行是**http协议的报头**，**请求正文**是该数据的**有效载荷**(如果有的话)
==**Response**==从状态行到空行都是**http协议的报头**，**响应正文**是该数据的**有效载荷**

==**HTTP请求**==
![[Pasted image 20221027165134.png]]
- 首行: [方法] + [url] + [版本]
- Header: 请求的属性, 冒号分割的键值对;每组属性之间使用\n分隔;遇到空行表示Header部分结束
- Body: 空行后面的内容都是Body. Body允许为空字符串. 如果Body存在, 则在Header中会有一个Content-Length属性来标识Body的长度;


==**HTTP响应**==
![[Pasted image 20221027171900.png]]
- 首行: [版本号] + [状态码] + [状态码解释]
- Header: 请求的属性, 冒号分割的键值对;每组属性之间使用\n分隔;遇到空行表示Header部分结束 
- Body: 空行后面的内容都是Body. Body允许为空字符串. 如果Body存在, 则在Header中会有一个Content-Length属性来标识Body的长度; 如果服务器返回了一个html页面, 那么html页面内容就是在body中.


## HTTP的方法
其中最常用的就是==**GET**==方法和==**POST**==方法.
![[Pasted image 20221027172103.png]]



## HTTP 常见的状态码有哪些？
![[Pasted image 20221027172416.png]]
`1xx` 类状态码属于**提示信息**，是协议处理中的一种中间状态，实际用到的比较少。

`2xx` 类状态码表示服务器**成功**处理了客户端的请求，也是我们最愿意看到的状态。
-   「**200 OK**」是最常见的成功状态码，表示一切正常。如果是非 `HEAD` 请求，服务器返回的响应头都会有 body 数据。

-   「**204 No Content**」也是常见的成功状态码，与 200 OK 基本相同，但响应头没有 body 数据。
   
-   「**206 Partial Content**」是应用于 HTTP 分块下载或断点续传，表示响应返回的 body 数据并不是资源的全部，而是其中的一部分，也是服务器处理成功的状态。
   

`3xx` 类状态码表示客户端请求的资源发生了变动，需要客户端用新的 URL 重新发送请求获取资源，也就是**重定向**。
-   「**301 Moved Permanently**」表示**永久重定向**，说明请求的资源已经不存在了，需改用新的 URL 再次访问。
  
-   「**302 Found**」表示**临时重定向**，说明请求的资源还在，但暂时需要用另一个 URL 来访问。
301 和 302 都会在响应头里使用字段 `Location`，指明后续要跳转的 URL，浏览器会自动重定向新的 URL。

-   「**304 Not Modified**」不具有跳转的含义，表示资源未修改，重定向已存在的缓冲文件，也称缓存重定向，也就是告诉客户端可以继续使用缓存资源，用于缓存控制。


`4xx` 类状态码表示客户端发送的**报文有误**，服务器无法处理，也就是错误码的含义。
-   「**400 Bad Request**」表示客户端请求的报文有错误，但只是个笼统的错误。
    
-   「**403 Forbidden**」表示服务器禁止访问资源，并不是客户端的请求出错。
    
-   「**404 Not Found**」表示请求的资源在服务器上不存在或未找到，所以无法提供给客户端。


`5xx` 类状态码表示客户端请求报文正确，但是**服务器处理时内部发生了错误**，属于服务器端的错误码。
-   「**500 Internal Server Error**」与 400 类型，是个笼统通用的错误码，服务器发生了什么错误，我们并不知道。
    
-   「**501 Not Implemented**」表示客户端请求的功能还不支持，类似“即将开业，敬请期待”的意思。
    
-   「**502 Bad Gateway**」通常是服务器作为网关或代理时返回的错误码，表示服务器自身工作正常，访问后端服务器发生了错误。
    
-   「**503 Service Unavailable**」表示服务器当前很忙，暂时无法响应客户端，类似“网络服务正忙，请稍后重试”的意思。

# HTTP常见字段有哪些?

## HTTP常见Header
- ==Content-Type==: 数据类型(text/html等) 
- ==Content-Length==: Body的长度
- ==Host==: 客户端告知服务器, 所请求的资源是在哪个主机的哪个端口上; 
- ==User-Agent==: 声明用户的操作系统和浏览器版本信息;
- ==referer==: 当前页面是从哪个页面跳转过来的;
- ==location==: 搭配3xx状态码使用, 告诉客户端接下来要去哪里访问; 
- ==Cookie==: 用于在客户端存储少量信息. 通常用于实现会话(session)的功能;

## Content-Length 字段
服务器在返回数据时，会有 `Content-Length` 字段，表明本次回应的数据长度。
![[Pasted image 20221027171130.png]]
```
Content-Length: 1000
```
如上面则是告诉浏览器，本次服务器回应的数据正文长度是 1000 个字节，后面的字节就属于下一个回应了。

==不存在Content-Length的时候，就是没有正文的时候==。


## Content-Type 字段
`Content-Type` 字段用于服务器回应时，告诉客户端，本次数据是什么格式。
![[Pasted image 20221027171316.png]]
```
Content-Type: text/html; charset=utf-8
```

上面的类型表明，发送的是网页，而且编码是**UTF-8**。

客户端请求的时候，可以使用 `Accept` 字段声明自己可以接受哪些数据格式。

```
Accept: */*
```

上面代码中，客户端声明自己可以接受任何格式的数据。

## Host 字段
客户端发送请求时，用来指定服务器的域名。
![[Pasted image 20221027172657.png]]
```
Host: www.A.com
```
有了 `Host` 字段，就可以将请求发往「同一台」服务器上的不同网站。

# http请求的`/` 是什么
如图：
![[Pasted image 20221027173327.png]]
http请求的`/`并不是根目录，而叫做**web根目录**
`/`︰我们一般要请求的一定是一个**具体的资源: html，图片等**


# GET 与 POST

## GET 和 POST 有什么区别？

根据 RFC 规范，==**GET== 的语义是==从服务器获取指定的资源**==，这个资源可以是静态的文本、页面、图片视频等。

GET **请求的参数位置一般是写在 URL 中**，**URL 规定只能支持 ASCII**，所以 GET 请求的参数只允许 ASCII 字符 ，而且**浏览器会对 URL 的长度有限制**（HTTP协议本身对 URL长度并没有做任何规定，是浏览器规定的）。

比如，你打开一个网页，浏览器就会发送 GET 请求给服务器，服务器就会返回网页的所有文字及资源。
![[Pasted image 20221027173908.png]]



==**POST== 的语义是==根据请求负荷（报文body）对指定的资源做出处理==**，具体的处理方式视资源类型而不同。

POST **请求携带数据的位置一般是写在报文 body 中**， **body 中的数据可以是任意格式的数据**，只要客户端与服务端协商好即可，而且**浏览器不会对 body 大小做限制**。

比如，你在我网页中进行留言，敲入了留言后点击「提交」，浏览器就会执行一次 POST 请求，把你的留言文字放进了报文 body 里，然后拼接好 POST 请求头，通过 TCP 协议发送给服务器。
![POST 请求](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/HTTP/13-Post%E8%AF%B7%E6%B1%82.png)

## GET 和 POST 方法都是安全和幂等的吗？

先说明下**安全**和**幂等**的概念：
-   在 HTTP 协议里，所谓的 **「安全」是指请求方法不会「破坏」服务器上的资源**。
-   所谓的 **「幂等」**，意思是**多次执行相同的操作，结果都是「相同」的**。

如果从 RFC 规范定义的语义来看：
-   **GET 方法就是安全且幂等的**，因为它是「只读」操作，无论操作多少次，服务器上的数据都是安全的，且每次的结果都是相同的。所以，**可以对 GET 请求的数据做缓存，这个缓存可以做到浏览器本身上（彻底避免浏览器发请求），也可以做到代理上（如nginx），而且在浏览器中 GET 请求可以保存为书签**。
-   **POST** 因为是「新增或提交数据」的操作，会修改服务器上的资源，所以是**不安全**的，且多次提交数据就会创建多个资源，所以**不是幂等**的。所以，**浏览器一般不会缓存 POST 请求，也不能把 POST 请求保存为书签**。

做个简要的小结。
==GET== 的语义是请求获取指定的资源。GET 方法是安全、幂等、可被缓存的。

==POST== 的语义是根据请求负荷（报文主体）对指定的资源做出处理，具体的处理方式视资源类型而不同。POST 不安全，不幂等，（大部分实现）不可缓存。

注意， 上面是从 RFC 规范定义的语义来分析的。
但是实际过程中，开发者不一定会按照 RFC 规范定义的语义来实现 ==GET==和 ==POST== 方法。比如：

-   可以用 ==GET== 方法实现新增或删除数据的请求，这样实现的 ==GET== 方法自然就不是**安全**和**幂等**。
-   可以用 ==POST== 方法实现查询数据的请求，这样实现的 ==POST== 方法自然就是安全和幂等。

曾经有个笑话，有人写了个博客，删除博客用的是==GET==请求，他觉得没人访问就连鉴权都没做。然后Google服务器爬虫爬了一遍，他所有博文就没了。。。

如果「安全」放入概念是指信息是否会被泄漏的话，虽然 **==POST== 用 body 传输数据**，而 **==GET== 用 URL 传输**，这样数据会在浏览器地址拦容易看到，但是并不能说 GET 不如 POST 安全的。

因为 HTTP 传输的内容都是明文的，**虽然在浏览器地址拦看不到 ==POST== 提交的 body 数据，但是只要抓个包就都能看到了**。

所以，要避免传输过程中数据被窃取，就要使用 HTTPS 协议，这样所有 HTTP 的数据都会被加密传输。

> GET 请求可以带 body 吗？
RFC 规范并没有规定 ==GET== 请求不能带 body 的。理论上，任何请求都可以带 body 的。只是因为 RFC 规范定义的 GET 请求是获取资源，所以根据这个语义不需要用到 body。

另外，URL 中的查询参数也不是 ==GET== 所独有的，==POST== 请求的 URL 中也可以有参数的。

# HTTP协议实现

## HTTP实现(简陋版)
此版本有很多细节没有实现。
如Content-Length，和读取问题等

使用 `recv` 函数读取http协议的报文时是有问题的，tcp给我们的数据有可能是连续的 ，而recv读取的报文大小的固定的，所以读取的时候有可能会出现的少读或读到下一个报文的数据，所以不建议使用。（下面代码不出错是因为，每次读取时只有一条报文）
```cpp
#include "Sock.hpp"
#include <pthread.h>

void Usage(std::string proc)
{
    std::cout << "Usage: " << proc << " port" << std::endl;
}

void* HandlerHttpRequest(void* args)
{
    int sock = *(int*)args;
    delete (int*)args;
    pthread_detach(pthread_self());

#define SIZE 1024*10

    char buffer[SIZE];
    memset(buffer , 0 ,sizeof(buffer));

    ssize_t s = recv(sock, buffer, sizeof(buffer), 0); // 这种读法是不正确的，只不过在现在没有被暴露出来罢了
    if(s > 0)
    {
        buffer[s] = 0;
        std::cout << buffer;//查看http的请求格式! for test

        std::string http_response = "http/1.0 200 OK\n";
        http_response += "Content-Type: text/plain\n";//text/plain,正文是普通的文本
        http_response += "\n"; //传说中的空行
        http_response += "hello bit , hello fmy";

        send(sock , http_response.c_str() , http_response.size() , 0);
    }

    close(sock);
    return nullptr;

}

int main(int argc , char* argv[])
{
    if( argc != 2 )
    {
        Usage(argv[0]);
        exit(1);
    }

    uint16_t port = atoi(argv[1]);
    int listen_sock = Sock::Socket();
    Sock::Bind(listen_sock , port);
    Sock::Listen(listen_sock);

    while(true)
    {
        int sock = Sock::Accept(listen_sock);
        if(sock > 0)
        {
            pthread_t tid;
            int* pram = new int(sock);
            pthread_create(&tid , nullptr , HandlerHttpRequest , pram);
        }
    }
}
```
![[Pasted image 20221026225322.png]]



## HTTP实现代码(带资源版)
将客户端在网址中连接时，在网站中显示我们编写的html文件，此资源文件放在wwwroot文件夹下
```cpp
#include "Sock.hpp"
#include <pthread.h>
#include <fstream>
#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>

#define WWWROOT "./wwwroot/"  //用于寻找资源
#define HOME_PAGE "index.html-abc"

void Usage(std::string proc)
{
    std::cout << "Usage: " << proc << " port" << std::endl;
}

void *HandlerHttpRequest(void *args)
{
    int sock = *(int *)args;
    delete (int *)args;
    pthread_detach(pthread_self());

#define SIZE 1024 * 10

    char buffer[SIZE];
    memset(buffer, 0, sizeof(buffer));

    ssize_t s = recv(sock, buffer, sizeof(buffer), 0); // 这种读法是不正确的，只不过在现在没有被暴露出来罢了
    if (s > 0)
    {
        buffer[s] = 0;
        std::cout << buffer; //查看http的请求格式! for test
        
        std::string html_file = WWWROOT;
        html_file += HOME_PAGE;

        std::ifstream in(html_file); 
        if (!in.is_open())//资源文件不存在
        {
            std::string http_response = "http/1.0 404 NOT FOUND\n";
            http_response += "Content-Type: text/html ; charset=utf-8\n"; // text/html,正文是html文件格式，编码为UTF-8
            http_response += "\n";                       //传说中的空行
            http_response += "<html><p>你访问的资源不存在</p></html>";

            send(sock, http_response.c_str(), http_response.size(), 0);

            in.close();
        }
        else//资源文件存在，
        {
            struct stat st;
            stat(html_file.c_str(), &st);

            std::string http_response = "http/1.0 200 OK\n";
            http_response += "Content-Type: text/html; charset=uft-8\n";
            http_response += "Content-Length: ";
            http_response += std::to_string(st.st_size);
            http_response += "\n";
            http_response += "\n";

			//将资源内容添加到到HTTP的正文中的
            std::string content;
            std::string line;
            while (std::getline(in, line))
            {
                content += line;
            }
            http_response += content;

            in.close();
            send(sock, http_response.c_str(), http_response.size(), 0);
        }
    }

    close(sock);
    return nullptr;
}

int main(int argc, char *argv[])
{
    if (argc != 2)
    {
        Usage(argv[0]);
        exit(1);
    }

    uint16_t port = atoi(argv[1]);
    int listen_sock = Sock::Socket();
    Sock::Bind(listen_sock, port);
    Sock::Listen(listen_sock);

    while (true)
    {
        int sock = Sock::Accept(listen_sock);
        if (sock > 0)
        {
            pthread_t tid;
            int *pram = new int(sock);
            pthread_create(&tid, nullptr, HandlerHttpRequest, pram);
        }
    }
}
```

==**wwwroot/index.html**==
在wwwroot文件夹下的资源文件index.html
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
    <h5>hello 我是首页!</h5>

    <h5>hello 我是表单!</h5>

    <form action="/a/b/handler_from" method="POST">//method可以是 GET 也 可以是POST，
        姓名: <input type="text" name="name"><br />
        密码: <input type="password" name="passwd"><br />
        <input type="submit" value="登陆">
    </form>
</body>

</html>
```

在资源文件中使用 GET 方法进行推送数据时，我们的输入信息会在输入框中，所以GET是不安全的。
![[Pasted image 20221027183205.png]]
POST方法比较私密(私密 != 安全) ，使用抓包工具，还是能获取到POST提交的信息。


注意：我们404状态码，是客户端的问题，因为客户不可能想要什么，服务端就有什么。该文件或资源是在服务端中没有的
![[Pasted image 20221027183458.png]]


## HTTP代码实现(重定向版)
==**301**== 和 ==**302**== 状态码都会在响应头里使用字段 `Location`，指明后续要跳转的 URL，浏览器会自动重定向新的 URL

```cpp
#include "Sock.hpp"
#include <pthread.h>
#include <fstream>
#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>

#define WWWROOT "./wwwroot/"
#define HOME_PAGE "index.html"

void Usage(std::string proc)
{
    std::cout << "Usage: " << proc << " port" << std::endl;
}

void *HandlerHttpRequest(void *args)
{
    int sock = *(int *)args;
    delete (int *)args;
    pthread_detach(pthread_self());

#define SIZE 1024 * 10

    char buffer[SIZE];
    memset(buffer, 0, sizeof(buffer));

    ssize_t s = recv(sock, buffer, sizeof(buffer), 0); // 这种读法是不正确的，只不过在现在没有被暴露出来罢了
    if (s > 0)
    {
        buffer[s] = 0;
        std::cout << buffer; //查看http的请求格式! for test

        // std::string response = "http/1.1 301 Permanently moved\n"; //永久重定向
        std::string response = "http/1,1 302 Found\n";//临时重定向
        response += "Location: https://www.qq.com\n"; //必须含有Location
        response += "\n";

        send(sock, response.c_str(), response.size(), 0);

        close(sock);
        return nullptr;
    }
}

int main(int argc, char *argv[])
{
    if (argc != 2)
    {
        Usage(argv[0]);
        exit(1);
    }

    uint16_t port = atoi(argv[1]);
    int listen_sock = Sock::Socket();
    Sock::Bind(listen_sock, port);
    Sock::Listen(listen_sock);

    while (true)
    {
        int sock = Sock::Accept(listen_sock);
        if (sock > 0)
        {
            pthread_t tid;
            int *pram = new int(sock);
            pthread_create(&tid, nullptr, HandlerHttpRequest, pram);
        }
    }
}
```
![[Pasted image 20221027210230.png]]
![[Pasted image 20221027210052.png]]

![[Pasted image 20221027205736.png]]