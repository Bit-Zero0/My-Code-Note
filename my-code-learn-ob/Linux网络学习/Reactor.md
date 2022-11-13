该内容其实可以当作一个小型项目了。

==**Reactor 反应堆模式**: 通过多路转接方案，被动的采用事件派发的方式，去反向的调用对应的回调函数==

主要是设计一个 ==epoll ET模式==版本的计算器，但本次项目中只实现了 `+` 号，想要更改数据的处理其实可以把 **Service.hpp 和 util.hpp文件中Deserialize函数** 的数据处理逻辑修改即可。

# 设计思路
1. 我们需要给每一个**fd**，都要有**自己专属的输入输出缓冲区**!
2. 虽然已经对等和拷贝在接口层面已经进行了分离，但是在代码逻辑上，依旧是耦合在一起的。
	- 通过**回调**的方式来**解耦**
3. epoll最大的优势在**就绪事件通知机制**!
	- 使用==派发器==来**处理就绪时间派发逻辑** , 也就是sock就绪的读写回调。

![[Pasted image 20221113153322.png]]

这个小项目总共有六个文件，主文件是 **epoll_server.cpp** , 也就是最顶层的文件，其余文件分别是: **Reactor.hpp** ,  **Serivce.hpp** , **Accepter.hpp** . **Sock.hpp** , **Util.hpp**

**Reactor.hpp** : 主要 含有**Event类** 和 **Reactor类** ，集成事件派发器 ， 以及IO事件的开关。

**Serivce.hpp** :IO事件的读取。

**Accepter.hpp** :链接管理器，负责将新到来的连接，链接到Reactor中。

**Util.hpp**:是一个工具文件，用来设置sock的非阻塞，数据的分包和反序列化.

**Sock.hpp**:有一个Sock类，用来封装套接字。


# epoll_server.cpp
主文件，负责所有模块的调度。
```cpp
#include "Reactor.hpp"
#include "Sock.hpp"
#include "Accepter.hpp"
#include "Util.hpp"

static void Usage(std::string proc)
{
    std::cout << "Usage: " << proc << " port" << std::endl;
}

int main(int argc, char* argv[])
{
    if (argc != 2)
    {
        Usage(argv[0]);
        exit(1);
    }

    // 1. 创建socket，监听
    int listen_sock = Sock::Socket();
    SetNonBlock(listen_sock);
    Sock::Bind(listen_sock, (uint16_t)atoi(argv[1]));
    Sock::Listen(listen_sock);

    // 2. 创建Reactor对象
    // Reactor 反应堆模式: 通过多路转接方案，被动的采用事件派发的方式，去反向的调用对应的回调函数
    Reactor* R = new Reactor();
    R->InitReactor();

    // 3. 给Reactor反应堆中加柴火
    // 3.1 有柴火
    Event* evp = new Event;
    evp->sock = listen_sock;
    evp->R = R;

    // Accepter: 链接管理器
    evp->RegisterCallback(Accepter, nullptr, nullptr);
    // 3.2 将准备好的柴火放入反应堆Reactor中
    R->InsertEvent(evp, EPOLLIN | EPOLLET);

    // 4. 开始进行事件派发！
    int timeout = 1000;
    while (true)
    {
        R->Dispatcher(timeout);
    }
}
```


# Reactor.hpp
主要 含有Event类 和 Reactor类 ，集成事件派发器 ， 以及IO事件的开关。
```cpp
#pragma once

#include <iostream>
#include <sys/epoll.h>
#include <string>
#include <unordered_map>
#include <unistd.h>

// 一般处理IO的时候，我们只有三种接口需要处理
// 处理读取
// 处理写入
// 处理异常
#define SIZE 128
#define NUM 64

class Reactor;
class Event;

typedef int (*callback_t)(Event* ev);

class Event
{
public:
    int sock;              //对应的文件描述符
    std::string inbuffer;  //对应的sock,对应的输入缓冲区
    std::string outbuffer; //对应的sock,对应的输出缓冲区

    callback_t recver;  // 处理读取
    callback_t sender;  // 处理写入
    callback_t errorer; // 处理异常

    Reactor* R; // Event回指Reactor的指针

    Event()
    {
        sock = -1;
        recver = nullptr;
        sender = nullptr;
        errorer = nullptr;
        R = nullptr;
    }

    void RegisterCallback(callback_t _recver, callback_t _sender, callback_t _errorer)
    {
        recver = _recver;
        sender = _sender;
        errorer = _errorer;
    }

    ~Event()
    {
    }
};

// 不需要关心任何sock的类型(listen，读，写)
// 如何进行使用该类，对Event进行管理
// Reactor : Event = 1 : n;
class Reactor
{
private:
    int epfd;
    std::unordered_map<int, Event*> events; //我的Epoll类管理的所有的Event的集合

public:
    Reactor()
        : epfd(-1)
    {
    }

    void InitReactor()
    {
        epfd = epoll_create(SIZE);
        if (epfd < 0)
        {
            std::cerr << "epoll_create error" << std::endl;
            exit(2);
        }
        std::cout << "InitReactor success" << std::endl;
    }

    bool InsertEvent(Event* evp, uint32_t evs)
    {
        // 1. 将sock中的sock插入到epoll中
        struct epoll_event ev;
        ev.events = evs;
        ev.data.fd = evp->sock;
        if (epoll_ctl(epfd, EPOLL_CTL_ADD, evp->sock, &ev) < 0)
        {
            std::cerr << "epoll_ctl add event failed" << std::endl;
            return false;
        }
        // 2. 将ev本身插入到unordered_map中
        events.insert({ evp->sock, evp });
    }

    void DeleteEvent(Event* evp)
    {
        int sock = evp->sock;
        auto iter = events.find(sock);
        if (iter != events.end())
        {
            // 1. 将sock中的sock从epoll中删除它
            epoll_ctl(epfd, EPOLL_CTL_DEL, sock, nullptr);
            // 2. 将特定的ev从 unordered_map中 移除
            events.erase(iter);
            // 3. close
            close(sock);
            // 4. 删除event节点
            delete evp;
        }
    }

    //关于修改,使能读写
    bool EnableRW(int sock, bool enbread, bool enbwrite)
    {
        struct epoll_event ev;
        ev.events = EPOLLET | (enbread ? EPOLLIN : 0) | (enbwrite ? EPOLLOUT : 0);
        ev.data.fd = sock;

        if (epoll_ctl(epfd, EPOLL_CTL_MOD, sock, &ev) < 0)
        {
            std::cerr << "epoll_ctl mod event failed" << std::endl;
            return false;
        }
    }
    
    //判断该sock在events是否存在
    bool IsSockOk(int sock)
    {
        auto iter = events.find(sock);
        return iter != events.end();
    }

    //就绪事件的派发器逻辑
    void Dispatcher(int timeout)
    {
        struct epoll_event revs[NUM];
        int n = epoll_wait(epfd, revs, NUM, timeout);
        for (int i = 0; i < n; i++)
        {
            int sock = revs[i].data.fd;
            uint32_t revents = revs[i].events;

            //代表差错处理, 将所有的错误问题全部转化成为让IO函数去解决
            if (revents & EPOLLERR)
                revents |= (EPOLLIN | EPOLLOUT);
            if (revents & EPOLLHUP)
                revents |= (EPOLLIN | EPOLLOUT);

            if (revents & EPOLLIN)
            {
                //直接调用回调方法，执行对应的读取
                if (IsSockOk(sock) && events[sock]->recver)
                    events[sock]->recver(events[sock]);
            }

            if (revents & EPOLLOUT)
            {
                //直接调用回调方法，执行对应的读取
                if (IsSockOk(sock) && events[sock]->sender)
                    events[sock]->sender(events[sock]);
            }
        }
    }
    ~Reactor() {}
};
```

# Service.hpp
主要进行IO事件的读取
```cpp
#pragma once

#include "Reactor.hpp"
#include "Util.hpp"
#include <cerrno>
#include <vector>

#define ONCE_SIZE 128
// 1: 本轮读取全部完成
//-1: 读取出错
// 0: 对端关闭链接
static int RecverCore(int sock, std::string& inbuffer)
{
    while (true)
    {
        char buffer[ONCE_SIZE];
        ssize_t s = recv(sock, buffer, ONCE_SIZE - 1, 0);
        if (s > 0)
        {
            buffer[s] = '\0';
            inbuffer += buffer;
        }
        else if (s < 0)
        {
            if (errno == EINTR) // IO被信号打断，概率特别低
                continue;

            if (errno == EAGAIN || errno == EWOULDBLOCK) //读完，底层没数据了
                return 1;

            return -1; // 真的出错了
        }
        else // s == 0
            return 0;
    }
}

int Recver(Event* evp)
{
    std::cout << "Recver been called " << std::endl;

    // 1. 真正的读取
    int result = RecverCore(evp->sock, evp->inbuffer);
    if (result <= 0)
    {
        //差错处理
        if (evp->errorer)
            evp->errorer(evp);

        return -1;
    }

    //  2. 分包-- 一个或者多个报文 -- 解决粘包问题
    std::vector<std::string> tokens;
    std::string sep = "X";
    SplitSegment(evp->inbuffer, &tokens, sep);
    // 3. 反序列化 -- 针对一个报文 -- 提取有效参与计算或者存储的信息
    for (auto& seg : tokens)
    {
        std::string data1, data2;

        //就是和业务强相关啦,可根据实际业务要求进行修改
        if (Deserialize(seg, &data1, &data2))
        {
            // 4. 业务逻辑 -- 得到结果
            int x = atoi(data1.c_str());
            int y = atoi(data2.c_str());
            int z = x + y;

            // 5. 构建响应 -- 添加到evp->outbuffer!!
            // 2+3X -> 2+3=5X
            std::string res = data1;
            res += "+";
            res += data2;
            res += "=";
            res += std::to_string(z);
            res += sep;

            evp->outbuffer += res; //发送数据
        }
    }
    // 6. 尝试直接间接进行发送 -- 后续说明
    // 必须条件成熟了(写事件就绪)，你才能发送呢？？
    // 一般只要将报文处理完毕，才需要发送
    // 写事件一般基本都是就绪的，但是用户不一定是就绪的！
    // 对于写事件，我们通常是   按   需    设置！！
    if (!(evp->outbuffer).empty())
    {
        // 写打开的时候，默认就是就绪的！即便是发送缓冲区已经满了
        // epoll 只要用户重新设者了OUT事件，EPOLLOUT至少会在触发一次！
        evp->R->EnableRW(evp->sock, true, true);
    }
    return 0;
}

// 1: 全部将数据发送完成
// 0: 数据没有发完，但是不能再发了
//-1: 发送失败
bool SenderCore(int sock, std::string& outbuffer)
{
    while (true)
    {
        int total = 0;
        const char* start = outbuffer.c_str();
        int size = outbuffer.size();
        ssize_t curr = send(sock, start + total, size - total, 0);
        if (curr > 0)
        {
            total += curr;
            if (total == size) //全部将数据发送完成
            {
                outbuffer.clear();
                return 1;
            }
        }
        else
        {
            if (errno == EINTR)
                continue;

            //数据没有发完，但是不能再发了！
            if (errno == EAGAIN || errno == EWOULDBLOCK)
            {
                outbuffer.erase(0, total);
                return 0;
            }

            return -1;
        }
    }
}

int Sender(Event* evp)
{
    std::cout << "Sender been called" << std::endl;

    int result = SenderCore(evp->sock, evp->outbuffer);
    if (result == 1)
    {
        evp->R->EnableRW(evp->sock, true, false); //按需设置
    }
    else if (result == 0)
    {
        evp->R->EnableRW(evp->sock, true, true); //按需设置
    }
    else
    {
        if (evp->errorer)
            evp->errorer(evp);
    }
}

int Errorer(Event* evp)
{
    std::cout << "Errorer been called" << std::endl;
    evp->R->DeleteEvent(evp);
}
```
# Accpter.hpp
链接管理器，负责将新到来的连接，链接到Reactor中。
```cpp
#pragma once

#include "Reactor.hpp"
#include "Sock.hpp"
#include "Service.hpp"
#include "Util.hpp"

int Accepter(Event* evp)
{
    std::cout << "有新的链接到来了,就绪的sock是: " << evp->sock << std::endl;
    while (true)
    {
        int sock = Sock::Accept(evp->sock);
        if (sock < 0)
        {
            std::cout << "Accept Done!" << std::endl;
            break;
        }
        std::cout << "Accept success: " << sock << std::endl;
        SetNonBlock(sock);
        Event* other_ev = new Event();
        other_ev->sock = sock;
        other_ev->R = evp->R;

        //为什么要让所有的Event指向自己所属的Reactor??
        // recver, sender, errorer,就是我们代码中的较顶层，只负责真正的读取！
        other_ev->RegisterCallback(Recver, Sender, Errorer);
        evp->R->InsertEvent(other_ev, EPOLLIN | EPOLLET);
    }
}
```
# Util.hpp
是一个工具文件，用来设置sock的非阻塞，数据的分包和反序列化.
```cpp
#pragma once

#include <iostream>
#include <fcntl.h>
#include <unistd.h>
#include <string>
#include <vector>

//设置一个sock成为非阻塞
void SetNonBlock(int sock)
{
    int f1 = fcntl(sock, F_GETFL);
    if (f1 < 0)
    {
        std::cerr << "fcntl failed" << std::endl;
        return;
    }
    fcntl(sock, F_SETFL, f1 | O_NONBLOCK);
}

//分包
void SplitSegment(std::string& inbuffer, std::vector<std::string>* tokens, std::string sep)
{
    while (true)
    {
        std::cout << "inbuffer: " << inbuffer << std::endl;
        auto pos = inbuffer.find(sep);
        if (pos == std::string::npos)
        {
            break;
        }
        std::string sub = inbuffer.substr(0, pos);
        tokens->push_back(sub);
        inbuffer.erase(0, pos + sep.size());
    }
}

//反序列化
bool Deserialize(std::string& seg, std::string* out1, std::string* out2) //就是和业务强相关啦
{
    std::string op = "+";
    auto pos = seg.find(op);

    if (pos == std::string::npos)
        return false;

    *out1 = seg.substr(0, pos);
    *out2 = seg.substr(pos + op.size());
    return true;
}
```

# Sock.hpp
有一个Sock类，用来封装套接字。
```cpp
#pragma once
#include <iostream>
#include <string>
#include <cstring>
#include <cstdlib>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>

using namespace std;
class Sock
{
public:
    static int Socket()
    {
        int sock = socket(AF_INET, SOCK_STREAM, 0);
        if (sock < 0)
        {
            cerr << "socket error" << endl;
            exit(2);
        }
        int opt = 1;
        setsockopt(sock, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt)); //这里使用了setsockset
        return sock;
    }

    static void Bind(int sock, uint16_t port)
    {
        struct sockaddr_in local;
        memset(&local, 0, sizeof(local));
        local.sin_family = AF_INET;
        local.sin_port = htons(port);
        local.sin_addr.s_addr = INADDR_ANY;

        if (bind(sock, (struct sockaddr*)&local, sizeof(local)) < 0)
        {
            cerr << "bind error!" << endl;
            exit(3);
        }
    }

    static void Listen(int sock)
    {

        if (listen(sock, 5) < 0)
        {
            cerr << "listen error !" << endl;
            exit(4);
        }
    }

    static int Accept(int sock)
    {
        struct sockaddr_in peer;
        socklen_t len = sizeof(peer);
        int fd = accept(sock, (struct sockaddr*)&peer, &len);
        if (fd >= 0)
        {
            return fd;
        }
        return -1;
    }

    static void Connect(int sock, std::string ip, uint16_t port)
    {
        struct sockaddr_in server;
        memset(&server, 0, sizeof(server));
        server.sin_family = AF_INET;
        server.sin_port = htons(port);
        server.sin_addr.s_addr = inet_addr(ip.c_str());

        if (connect(sock, (struct sockaddr*)&server, sizeof(server)) == 0)
        {
            cout << "Connect Success!" << endl;
        }

        else
        {
            cout << "Connect Failed!" << endl;
            exit(5);
        }
    }
};
```