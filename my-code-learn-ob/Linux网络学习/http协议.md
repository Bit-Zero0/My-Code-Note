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

## Connection 字段
**http1.1新加入的字段**
`Connection` 字段最常用于客户端要求服务器使用「 HTTP 长连接」机制，以便其他请求复用。
![[Pasted image 20221027220242.png]]

HTTP 长连接的特点是，只要任意一端没有明确提出断开连接，则保持 TCP 连接状态。
![[Pasted image 20221027220336.png]]
HTTP/1.1 版本的默认连接都是长连接，但为了兼容老版本的 HTTP，需要指定 `Connection` 首部字段的值为 `Keep-Alive`。

```
Connection: Keep-Alive
```

开启了 HTTP `Keep-Alive` 机制后， 连接就不会中断，而是保持连接。当客户端发送另一个请求时，它会使用同一个连接，一直持续到客户端或服务器端提出断开连接。


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



# HTTP/1.0 和 HTTP/1.1
HTTP 协议是基于 **TCP/IP**，并且使用了「**请求 - 应答**」的通信模式，所以性能的关键就在这**两点**里。

## 长连接
早期 HTTP/1.0 性能上的一个很大的问题，那就是每发起一个请求，都要新建一次 **TCP 连接**（三次握手），而且是串行请求，做了无谓的 TCP 连接建立和断开，增加了通信开销。

为了解决上述 TCP 连接问题，**HTTP/1.1** 提出了**长连接**的通信方式，也叫持久连接。这种方式的好处在于减少了 TCP 连接的重复建立和断开所造成的额外开销，减轻了服务器端的负载。

持久连接的特点是，只要任意一端没有明确提出断开连接，则保持 TCP 连接状态。
![[Pasted image 20221028125206.png]]
当然，如果某个 HTTP 长连接超过一定时间没有任何数据交互，服务端就会主动断开这个连接。

为支持长链接，HTTP/1.1添加了 `Connection` 字段,[[http协议#Connection 字段]]


# Session 和 Cookie
## 用户信息
**Http** 是一个==**无状态协议**==, 就是说这一次请求和上一次请求是没有任何关系的，互不认识的，没有关联的。这种无状态 的的好处是快速。坏处是需要进行用户状态保持的场景时[比如，登陆状态下进行页面跳转，或者用户信息多页面共享等场景]，必须使用一些方式或者手段比如：**session**和**cookie**

## cookie
如上所述，`Http`是一个无状态的协议，但是访问有些资源的时候往往需要经过认证的账户才能访问，而且要一直保持在线状态，所以，`cookie`是一种在浏览器端解决的方案，将登陆认证之后的用户信息保存在本地浏览器中，后面每次发起http请求，都自动携带上该信息，就能达到认证用户，保持用户在线的作用，具体如下图:
![[Pasted image 20221028130300.png]]
设置cookie的方法在Http的Response报头中可以携带set-Cookie字段来完成。

## session
而将用户敏感信息放到本地浏览器中，能解决一定的问题，但是又引进了新的安全问题，一旦**cookie丢失，用户信息泄露，也很容易造成跨站攻击**，所以有了另一种解决方法，将用户敏感信息保存至服务器，而服务器本身采用md5算法或相关算法==生成**唯一值**== (session id)，将**该值保存值客户端浏览器，随后，客户端的后续请求，浏览器都会自动携带该id，进而再在服务器端认证，进而达到状态保持的效果**.
![[Pasted image 20221028130727.png]]

## cookie vs session
两者有什么区别呢？
- Cookie以文本文件格式存储在浏览器中，而session存储在服务端
- 因为每次发起 Http 请求，都要携带有效Cookie信息，所以Cookie一般都有大小限制，以防止增加网络压力,一般不超过4k
- 可以轻松访问cookie值但是我们无法轻松访问会话值，因此session方案更安全


## 本地禁止cookie
经过上面的学习，  我们能看出来，要使用session，其实还是需要使用cookie机制来保存session id的，那么万一在 客户端cookie机制被禁掉了，那session貌似也就无法使用了？其实替代方法是有的
- 经常被使用的一种技术叫做URL重写，就是把session id直接附加在URL路径的后面。
- 还有一种技术叫做表单隐藏字段。就是服务器会自动修改表单，添加一个隐藏字段，以便在表单提交时能够把session id传递回服务器


# HTTP 与 HTTPS
## HTTP 与 HTTPS 有哪些区别？
-   **HTTP** 是超文本传输协议，信息是**明文传输**，存在安全风险的问题。**HTTPS 则解决 HTTP 不安全的缺陷，在 TCP 和 HTTP 网络层之间加入了 ==SSL/TLS 安全协议==，使得报文能够加密传输**。
    
-   **HTTP 连接建立相对简单， TCP 三次握手之后便可进行 HTTP 的报文传输。而 HTTPS 在 TCP 三次握手之后，还需进行 SSL/TLS 的握手过程，才可进入加密报文传输**。
    
-   两者的默认端口不一样，**HTTP 默认端口号是 `80`**，**HTTPS 默认端口号是 `443`**。
    
-   HTTPS 协议需要向 CA（证书权威机构）申请数字证书，来保证服务器的身份是可信的。
    

## HTTPS 解决了 HTTP 的哪些问题？
HTTP 由于是明文传输，所以安全上存在以下三个风险：

-   **窃听风险**，比如通信链路上可以获取通信内容，用户号容易没。
-   **篡改风险**，比如强制植入垃圾广告，视觉污染，用户眼容易瞎。
-   **冒充风险**，比如冒充淘宝网站，用户钱容易没。

![[Pasted image 20221028131503.png]]
HTTP**S** 在 HTTP 与 TCP 层之间加入了 `SSL/TLS` 协议，可以很好的解决了上述的风险：
-   **信息加密**：交互信息无法被窃取，但你的号会因为「自身忘记」账号而没。
-   **校验机制**：无法篡改通信内容，篡改了就不能正常显示，但百度「竞价排名」依然可以搜索垃圾广告。
-   **身份证书**：证明淘宝是真的淘宝网，但你的钱还是会因为「剁手」而没。

可见，只要自身不做「恶」，SSL/TLS 协议是能保证通信是安全的。

> HTTPS 是如何解决上面的三个风险的？
-   **混合加密**的方式实现信息的**机密性**，解决了窃听的风险。
-   **摘要算法**的方式来实现**完整性**，它能够为数据生成独一无二的「指纹」，指纹用于校验数据的完整性，解决了篡改的风险。
-   将服务器公钥放入到**数字证书**中，解决了冒充的风险。

### 混合加密
通过**混合加密**的方式可以保证信息的**机密性**，解决了窃听的风险。
![[Pasted image 20221029133417.png]]
==HTTPS 采用的是**对称加密**和**非对称加密**结合的「混合加密」方式：==
-   在通信建立前采用**非对称加密**的方式交换「会话秘钥」，后续就不再使用非对称加密。
-   在通信过程中全部使用**对称加密**的「会话秘钥」的方式加密明文数据。


==采用「混合加密」的方式的原因：==
-   **对称加密**只使用一个密钥，运算速度快，密钥必须保密，无法做到安全的密钥交换。
-   **非对称加密**使用两个密钥：公钥和私钥，公钥可以任意分发而私钥保密，解决了密钥交换问题但速度慢。



### 摘要算法 + 数字签名

为了保证传输的内容不被篡改，我们需要对内容计算出一个「指纹」，然后同内容一起传输给对方。

对方收到后，先是对内容也计算出一个「指纹」，然后跟发送方发送的「指纹」做一个比较，如果「指纹」相同，说明内容没有被篡改，否则就可以判断出内容被篡改了。

那么，在计算机里会用**摘要算法（哈希函数）来计算出内容的哈希值**，也就是内容的「指纹」，这个**哈希值是唯一的，且无法通过哈希值推导出内容**。
![[Pasted image 20221029133739.png]]
通过哈希算法可以确保内容不会被篡改，**但是并不能保证「内容 + 哈希值」不会被==中间人==替换，因==为这里缺少对客户端收到的消息是否来源于服务端的证明**==。

>举个例子，
>你想向老师请假，一般来说是要求由家长写一份请假理由并签名，老师才能允许你请假。
>但是你有模仿你爸爸字迹的能力，你用你爸爸的字迹写了一份请假理由然后签上你爸爸的名字，老师一看到这个请假条，查看字迹和签名，就误以为是你爸爸写的，就会允许你请假。
>那作为老师，要如何避免这种情况发生呢？现实生活中的，可以通过电话或视频来确认是否是由父母发出的请假，但是计算机里可没有这种操作。

那为了避免这种情况，计算机里会用**非对称加密算法**来解决，共有两个密钥：
-   一个是公钥，这个是可以公开给所有人的；
-   一个是私钥，这个必须由本人管理，不可泄露。

这两个密钥可以**双向加解密**的，比如可以用公钥加密内容，然后用私钥解密，也可以用私钥加密内容，公钥解密内容。

流程的不同，意味着目的也不相同：
-   **公钥加密，私钥解密**。这个目的是为了**保证内容传输的安全**，因为被公钥加密的内容，其他人是无法解密的，只有持有私钥的人，才能解密出实际的内容；
-   **私钥加密，公钥解密**。这个目的是为了**保证消息不会被冒充**，因为私钥是不可泄露的，如果公钥能正常解密出私钥加密的内容，就能证明这个消息是来源于持有私钥身份的人发送的。

**一般我们不会用非对称加密来加密实际的传输内容，因为非对称加密的计算比较耗费性能的**。

所以非对称加密的用途主要在于**通过「私钥加密，公钥解密」的方式，来确认消息的身份**，我们常说的**数字签名算法**，就是用的是这种方式，不过私钥加密内容不是内容本身，而是**对内容的哈希值加密**。
![[Pasted image 20221029134301.png]]
私钥是由服务端保管，然后服务端会向客户端颁发对应的公钥。如果客户端收到的信息，能被公钥解密，就说明该消息是由服务器发送的。

>引入了数字签名算法后，你就无法模仿你爸爸的字迹来请假了，你爸爸手上持有着私钥，你老师持有着公钥。
>这样只有用你爸爸手上的私钥才对请假条进行「签名」，老师通过公钥看能不能解出这个「签名」，如果能解出并且确认内容的完整性，就能证明是由你爸爸发起的请假条，这样老师才允许你请假，否则老师就不认。

### 数字证书
前面我们知道：

-   可以通过哈希算法来保证消息的完整性；
-   可以通过数字签名来保证消息的来源可靠性（能确认消息是由持有私钥的一方发送的）；

但是这还远远不够，**还缺少身份验证的环节**，万一公钥是被伪造的呢？

还是拿请假的例子
>虽然你爸爸持有私钥，老师通过是否能用公钥解密来确认这个请假条是不是来源你父亲的。
>但是我们还可以自己伪造出一对公私钥啊！
>你找了个夜晚，偷偷把老师桌面上和你爸爸配对的公钥，换成了你的公钥，那么下次你在请假的时候，你继续模仿你爸爸的字迹写了个请假条，然后用你的私钥做个了「数字签名」。
>但是老师并不知道自己的公钥被你替换过了，所以他还是按照往常一样用公钥解密，由于这个公钥和你的私钥是配对的，老师当然能用这个被替换的公钥解密出来，并且确认了内容的完整性，于是老师就会以为是你父亲写的请假条，又允许你请假了。好家伙，为了一个请假，真的是斗智斗勇。
>后面你的老师和父亲发现了你伪造公私钥的事情后，决定重新商量一个对策来应对你这个臭家伙。
>正所谓魔高一丈，道高一尺。
>既然伪造公私钥那么随意，所以你爸把他的公钥注册到**警察局**，警察局用他们自己的私钥对你父亲的公钥做了个数字签名，然后把你爸爸的「个人信息 + 公钥 + 数字签名」打包成一个**数字证书，也就是说这个数字证书包含你爸爸的公钥。**
>这样，你爸爸如果因为家里确实有事要向老师帮你请假的时候，不仅会用自己的私钥对内容进行签名，还会把数字证书给到老师。
>老师拿到了数字证书后，**首先会去警察局验证这个数字证书是否合法**，因为数字证书里有警察局的数字签名，警察局要验证证书合法性的时候，用自己的公钥解密，如果能解密成功，就说明这个数字证书是在警察局注册过的，就认为该数字证书是合法的，然后就会把数字证书里头的公钥（你爸爸的）给到老师。
>**由于通过警察局验证了数字证书是合法的，那么就能证明这个公钥就是你父亲的**，于是老师就可以安心的用这个公钥解密出清教条，如果能解密出，就证明是你爸爸写的请假条。
>正是通过了一个权威的机构来证明你爸爸的身份，所以你的伪造公私钥这个小伎俩就没用了。

在计算机里，这个权威的机构就是==**CA （数字证书认证机构）**== ，将服务器公钥放在数字证书（由数字证书认证机构颁发）中，只要证书是可信的，公钥就是可信的。

数字证书的工作流程，我也画了一张图，方便大家理解：
![[Pasted image 20221029134808.png]]
通过数字证书的方式保证服务器公钥的身份，解决冒充的风险。

#### 客户端校验数字证书的流程是怎样的？
接下来，详细说一下实际中数字证书签发和验证流程。

如下图图所示，为数字证书签发和验证流程：
![[Pasted image 20221029135325.png]]
==CA 签发证书的过程，如上图左边部分：==
-   首先 CA 会把持有者的公钥、用途、颁发者、有效时间等信息打成一个包，然后对这些信息进行 Hash 计算，得到一个 Hash 值；
-   然后 CA 会使用自己的私钥将该 Hash 值加密，生成 **Certificate Signature**，也就是 CA 对证书做了签名；
-   最后将 **Certificate Signature** 添加在文件证书上，形成数字证书；


==客户端校验服务端的数字证书的过程，如上图右边部分：==
-   首先客户端会使用同样的 Hash 算法获取该证书的 Hash 值 H1；
-   通常浏览器和操作系统中集成了 CA 的公钥信息，浏览器收到证书后可以使用 CA 的公钥解密 Certificate Signature 内容，得到一个 Hash 值 H2 ；
-   最后比较 H1 和 H2，如果值相同，则为可信赖的证书，否则则认为证书不可信。


但事实上，证书的验证过程中**还存在一个证书信任链的问题**，因为我们向 CA 申请的证书一般不是根证书签发的，而是由中间证书签发的，比如百度的证书，从下图你可以看到，证书的层级有三级：
![[Pasted image 20221029135541.png]]
对于这种三级层级关系的证书的验证过程如下：
-   客户端收到 **baidu.com** 的证书后，发现这个证书的签发者不是**根证书**，就无法根据本地已有的**根证书中的公钥**去验证 **baidu.com 证书**是否可信。于是，客户端根据 **baidu.com** 证书中的签发者，找到该证书的颁发机构是 “**GlobalSign Organization Validation CA - SHA256 - G2**”，然后向 CA 请求该中间证书。
-   请求到证书后发现 “**GlobalSign Organization Validation CA - SHA256 - G2**” 证书是由 “**GlobalSign Root CA**” 签发的，由于 “**GlobalSign Root CA**” 没有再上级签发机构，说明它是根证书，也就是自签证书。应用软件会检查此证书有否已预载于根证书清单上，如果有，则可以利用根证书中的公钥去验证 “**GlobalSign Organization Validation CA - SHA256 - G2**” 证书，如果发现验证通过，就认为该中间证书是可信的。
-   “**GlobalSign Organization Validation CA - SHA256 - G2**” 证书被信任后，可以使用 “**GlobalSign Organization Validation CA - SHA256 - G2**” 证书中的公钥去验证 **baidu.com** 证书的可信性，如果验证通过，就可以信任 **baidu.com** 证书。

在这三个步骤中，最开始客户端只信任根证书 GlobalSign Root CA 证书的，然后 “GlobalSign Root CA” 证书信任 “GlobalSign Organization Validation CA - SHA256 - G2” 证书，而 “GlobalSign Organization Validation CA - SHA256 - G2” 证书又信任 baidu.com 证书，于是客户端也信任 baidu.com 证书。

总括来说，由于用户信任 GlobalSign，所以由 GlobalSign 所担保的 baidu.com 可以被信任，另外由于用户信任操作系统或浏览器的软件商，所以由软件商预载了根证书的 GlobalSign 都可被信任。
![[Pasted image 20221029140100.png]]

操作系统里一般都会内置一些根证书，比如我的 Windows 电脑里内置的根证书有这么多：
![[Pasted image 20221029140209.png]]

这样的一层层地验证就构成了一条信任链路，整个证书信任链验证流程如下图所示：
![[Pasted image 20221029140235.png]]


最后一个问题，为什么需要证书链这么麻烦的流程？Root CA 为什么不直接颁发证书，而是要搞那么多中间层级呢？
**这是为了确保根证书的绝对安全性，将根证书隔离地越严格越好，不然根证书如果失守了，那么整个信任链都会有问题。**

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