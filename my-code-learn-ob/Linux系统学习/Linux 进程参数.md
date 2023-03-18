# 进程参数概念
其实main函数是可以有参数的，可以通过获取参数列表
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317211306.png)


如现在在执行是传参 `-a  -b  -c`
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317211310.png)


此时就类似与指令后面的参数列表
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317211315.png)


# 作用
使用这些参数时，就可以达到切换不同功能的目的

如：添加了两个参数 `-a  -h`
```cpp
int main(int argc , char* argv[])
{
  if(argc != 2) {
        printf("Usage: %s -[a|h]\n", argv[0]);
        return 1;
    }
    //为什么？？
    if(strcmp(argv[1], "-h") == 0){
        printf("hello bit!\n");
    }
    else if(strcmp(argv[1], "-a") == 0){
        printf("hello all\n");
    }
    else{
        printf("hello world!\n");
    }
    return 0;
}
```

![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317211336.png)



在==**argv**==的占位如下：
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230317211346.png)


