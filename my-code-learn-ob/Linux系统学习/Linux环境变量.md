# 环境变量的作用：
命令，程序，工具... 本质上都是==可执行文件==。

如：Linux中的命令。
![[Pasted image 20220521150532.png]]
![[Pasted image 20220521150551.png]]


当我们要运行我们写的可执行文件时，需要带上 `./` 来指定当前目录，那为什么系统的指令就可以不用呢？
原因就在于：==**环境变量**==


# 基本概念
* 环境变量(environment variables)一般是指在操作系统中用来指定操作系统运行环境的一些参数。
* 如：我们在编写C/C++代码的时候，在链接的时候，从来不知道我们的所链接的动态静态库在哪里，但是照样可以链接成功，生成可执行程序，原因就是有相关环境变量帮助编译器进行查找。
* 环境变量通常具有==某些特殊用途==，还有在系统当中通常具有==**全局特性**==。

![[Pasted image 20220521212704.png]]

# 常见环境变量
PATH : 指定命令的搜索路径。
HOME : 指定用户的主工作目录(即用户登陆到Linux系统中时,默认的目录)。
SHELL : 当前Shell,它的值通常是/bin/bash。

查看是需要使用 **`$`** 符号， 有点类似于 ==解引用操作==。

不适用`$` ,就像只打印出指针，而不打印出指针指向的内容。
![[Pasted image 20220521151749.png]]
使用`$`后
![[Pasted image 20220521151851.png]]
而每个环境变量是以 **`:`**  作为==分隔符==的。


# 添加环境变量
如果我们不想再执行我们自己写的可执行文件时，使用路径。就需要将我们的路径配置到环境变量中。

## 使用export命令
### 错误做法：
如我们的文件的路径为：`/home/whb/102/phase-102/code/lesson10`

直接使用 `export PATH=/home/whb/102/phase-102/code/lesson10`
![[Pasted image 20220521152433.png]]
此做法会覆盖了所有的环境变量。其他的所有环境变量就无法运行了。
![[Pasted image 20220521152704.png]]

解决方法：重启服务器。

### 正确做法：
使用 `export PATH=$PATH:/home/whb/102/phase-102/code/lesson10`

![[Pasted image 20220521153059.png]]

此时不需要指定路径也可以运行了。
![[Pasted image 20220521153149.png]]

## set指令[本地变量]
本地变量就是在当前session(会话)有用的变量。
![[Pasted image 20220521154712.png]]

当然也可以使用set来查看本地变量。
使用 **`set | grep 变量名`**  来查询
![[Pasted image 20220521183550.png]]
如：这里的 myval在 env中是查不到的。


### 将本地变量转化为环境变量
使用export导出，即可。
![[Pasted image 20220521184057.png]]

## unset指令[清除环境变量]
使用 `unset` 来清除环境变量。
![[Pasted image 20220521185006.png]]


# 通过系统调用获取或设置环境变量
![[Linux 进程参数]]


 ## 命令行第三个参数
  
  在上面的基础上，我们在添加一个参数 `char* env[]` 
```cpp
#include <stdio.h>
#include <string.h>
int main(int argc , char* argv[] , char* env[])
{
	for(int i = 0 ;env[i] ; i++)
	{
		printf("%d -> %s\n" , i , env[i]);
	}
	return 0;
}
```
`env[]` 的参数时自己填写的，无需我们填写。
![[Pasted image 20220521200924.png]]
一样的打印出了我们的环境变量。

## 通过第三方变量environ 获取

environ 其实是一个 ==**二级指针**==。
![[Pasted image 20220521201915.png]]
```cpp
int main()
{
	extern char** environ;
	for( int i = 0 ; environ[i] ; i++)
	{
		printf("%s\n" , environ[i]);
	}
	return 0;
}
```
![[Pasted image 20220521201834.png]]

## 使用 `getenv()`   [最常用]
需要导入头文件 `stdlib.h`

```cpp
int main()
{
	printf("%s\n",getenv("PATH"));
	printf("%s\n",getenv("HOME"));
	printf("%s\n",getenv("SHELL"));
	return 0;
}
```
![[Pasted image 20220521202733.png]]



# 环境变量通常是具有全局属性的
>环境变量通常具有全局属性，可以被子进程继承下去

设定了一个==**本地变量**== `my_env_string`, 然后再myproc进程中使用`getenv()` 函数验证能读取==**本地变量**== ， 

```cpp
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
int main(int argc , char* argv[] , char* env[])
{
    printf("my_env_string: %s\n", getenv("my_env_string"));
    printf("I am a process pid: %d, ppid: %d\n", getpid(), getppid());
	return 0;
}
```
![[Pasted image 20220521204148.png]]

看看ppid为何方神圣？
![[Pasted image 20220521204613.png]]
命令行上启动的进程，==父进程都是**bash**==!

现在我们将 本地变量 `my_env_string` 改为环境变量。
![[Pasted image 20220521205017.png]]

现在查看一下子进程是否继承父进程`bash`的 环境变量
![[Pasted image 20220521205123.png]]
成功了。