
# Linux文件权限值的八进制表示方法
Linux文件权限的修改是能通过八进制来进行修改的，因为 r w x​ 这三个文件权限如果用二进制来表示 ， 那就是对于二进制的 111​

> x 对应 001​  
> w 对应 010​  
> r 对应 100​

具体看一下表单

## 字符表示方法
![](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315173419.png)​

## 八进制数值表示方法
​​![](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315173551.png)​

​

如使用三位八进制数 ,则代表修改 u ,g ,o 三个权限用户的权限值

如:

```shell
# chmod 664 /home/abc.txt
```

这里的 664​ 中的 第一个数字6​ 就是修改 u​ 的权限为 八进制的 6​ ,对于二进制110​ ,修改后的权限为 rw​ .  
这里的 664​ 中的 第二个数字6​ 就是修改 g​ 的权限为 八进制的 6​ ,对于二进制110​ ,修改后的权限为 rw​ .  
这里的 664​ 中的 第三个数字4​ 就是修改 o​ 的权限为 八进制的 4​ ,对于二进制010​ ,修改后的权限为 w​ .

​​![](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315174215.png)​​

​​![](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230315174236.png)​​

