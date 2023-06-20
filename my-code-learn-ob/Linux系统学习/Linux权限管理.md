# Linux权限
inux下有两种用户：超级用户（root）、普通用户。

>**超级用户**：可以再linux系统下做任何事情，不受限制
>**普通用户**：在linux下做有限的事情。
>**超级用户**的命令提示符是  `$`  ，普通用户的命令提示符是 `#` 

命令：`su [用户名]`
功能：切换用户。
例如，要从root用户切换到普通用户user，则使用 `su user`。 



# 文件访问者分类
>文件和文件目录的所有者：`u` ---User（中国平民 法律问题）
>文件和文件目录的所有者所在的组的用户：`g`  ---Group（不多说）
>其它用户：`o`  ---Others （外国人）


![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315175300.png)


权限的**拥有者**和**所属组**
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315175449.png)




# 文件类型和访问权限(事物属性)
## 文件类型
>==d==：文件夹
>==-==：普通文件
>==l==：软链接（类似Windows的快捷方式）
>==b==：块设备文件（例如硬盘、光驱等）
>==p==：管道文件
>==c==：字符设备文件（例如屏幕等串口设备）
>==s==：套接口文件
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315175506.png)


## 基本权限
>读  `r`：Read对文件而言，具有读取文件内容的权限；对目录来说，具有浏览该目录信息的权限
>
>写  `w` ：Write对文件而言，具有修改文件内容的权限；对目录来说具有删除移动目录内文件的权限
>
>执行 `x` ：execute对文件而言，具有执行文件的权限；对目录来说，具有进入目录的权限
>
> `-`   表示不具有该项权限

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315175746.png)


# 文件访问设置的方法
## chmod
**功能**：设置文件的访问权限

**格式**：`chmod [参数] 权限 文件名`

常用选项：

> R -> 递归修改目录文件的权限
> 说明：只有文件的拥有者和root才可以改变文件的权限


### chmod命令权限值的格式
1.用户表示符+/-=权限字符

>==**用户符号**==：  
>==u==：拥有者
>==g==：拥有者同组用
>==o==：其它用户
>==a==：所有用户
>==+==:向权限范围增加权限代号所表示的权限
>==-==:向权限范围取消权限代号所表示的权限
>==**=**==:向权限范围赋予权限代号所表示的权限

```linux
# chmod u+w /home/abc.txt

# chmod o-x /home/abc.txt
```


2.三位8进制数字

```c
# chmod 664 /home/abc.txt

# chmod 640 /home/abc.txt
```

![[Linux文件权限值的八进制表示方法]]


### chown
**功能：** 修改文件的拥有者。

**格式：`chown [参数] 用户名 文件名`

常用选项：`-R`  递归修改文件或目录的==拥有者==

```linux
# chown user1 f1

# chown -R user1 filegroup1
```



### chgrp
**功能：** 修改文件或目录的所属组

**格式：** `chgrp [参数] 用户组名 文件名`

常用选项：`-R` 递归修改文件或目录的==所属组==


```linux
# chown grp1 f1

# chown -R grp2 filegroup1
```


#### umask 权限掩码
**功能：**
新建文件夹默认权限=`0666`

新建目录默认权限=`0777`

但实际上你所创建的文件和目录，看到的权限往往不是上面这个值。原因就是创建文件或目录的时候还要受到==umask==的影响。假设默认权限是==mask==，则实际创建的出来的文件权限是: `mask & ~umask`

**格式：** umask 权限值

说明：将现有的存取权限减去权限掩码后，即可产生建立文件时预设权限。超级用户默认掩码值为==0022==，普通用户默认为==0002==。

```linux
# umask 755

# umask //查看

# umask 044//设置
```


# 粘滞位

只要==用户==具有目录的==写权限==, 用户就可以**删除目录中的文件**, 而==不论这个用户是否有这个文件的写权限==.

这好像不太科学啊, 我张三创建的一个文件, 凭什么被你李四可以删掉?

为解决这个问题，就有了==**粘滞位**== 


**粘滞位的设置方法：** `chmod [用户] +t`  这里的用户一般设置为 `o` ， 也就是 ==其他人==。

**注意事项：** 设置粘滞位后只有 ==文件的拥有者== 可以删除，此外 ==root== 用户也可以删除，因为==root用户==是上帝，可以修改一切

若我们的需求：
>other 可以在lesson文件下创建文件，并写入
>但不想任何人删掉自己的文件

结果如下：
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315175933.png)


![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315175941.png)


# 创建用户
下面只用案例来进行演示:  创建的用户为 fmy

创建用户:
```shell
[root@localhost ~]# adduser fmy
```

初始化密码:
```shell
[root@localhost ~]# passwd fmy
```

注意新创建的用户是需要被赋权的, 否则无法使用sudo


## 为用户赋权
个人用户的权限只可以在本home下有完整权限，其他目录要看别人授权. 而经常需要root用户的权限，这时候sudo可以化身为root来操作.

sudo命令的授权管理是在sudoers文件里的。可以看看sudoers文件在哪
```shell
[root@localhost ~]# whereis sudoers
sudoers: /etc/sudoers /etc/sudoers.d /usr/libexec/sudoers.so /usr/share/man/man5/sudoers.5.gz
```
/etc/sudoers 就是我们要找的文件


注意此文件只有 读权限 ,所有要先修改文件权限
```shell
[root@localhost ~]# ls -l /etc/sudoers
-r--r----- 1 root root 4251 9月  25 15:08 /etc/sudoers
```
为 /etc/sudoers 添加 w (写权限)
```shell
[root@localhost ~]# chmod -v u+w /etc/sudoers
mode of "/etc/sudoers" changed from 0440 (r--r-----) to 0640 (rw-r-----)
```

使用[[vim文本编辑器|vim]]对文件进修改
```shell
## Allow root to run any commands anywher  
root    ALL=(ALL)       ALL  
fmy     ALL=(ALL)       ALL  #这个是新增的用户
```

此时基本完成了新用户的赋权, 保存退出后, 记得把/etc/sudoers文件的 w 权限收回
```shell
[root@localhost ~]# chmod -v u-w /etc/sudoers
mode of "/etc/sudoers" changed from 0640 (rw-r-----) to 0440 (r--r-----)
```