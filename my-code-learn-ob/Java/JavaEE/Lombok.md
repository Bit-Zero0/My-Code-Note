Lombok是一个Java库，它可以简化Java代码的编写。它提供了一些注解和工具类，使开发人员能够更容易地生成getter、setter、构造函数等常用方法，从而减少了样板代码的编写。Lombok不需要额外的安装或配置，只需在项目中引入相应的依赖即可使用。

## 添加 lombok 依赖
```xml
<dependency>
	<groupId>org.projectlombok</groupId>
	<artifactId>lombok</artifactId>
	<version>1.18.20</version>
	<optional>true</optional>
</dependency>
```

## lombok原理解释
Java程序运行原理:
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230521182214.png)

Lombok 的作用如下图所示：
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230521182248.png)
也就是说,在使用lombok注解后, 在进行编译时, 会把相应的 lombok代码转化为java代码, 最后成为 字节码文件 

## lombok 更多注解说明
### 基本注解
|注解| 作用|
|:-:|:--|
|`@Getter`| 自动添加 getter 方法|
|`@Setter`| 自动添加 setter 方法|
|`@ToString`| 自动添加 toString 方法|
|`@EqualsAndHashCode`| 自动添加 equals 和 hashCode 方法|
|`@NoArgsConstructor`| 自动添加无参构造方法|
|`@AllArgsConstructor`| 自动添加全属性构造方法，顺序按照属性的定义顺序|
|`@NonNull`| 属性不能为 null | 
|`@RequiredArgsConstructor`| 自动添加必需属性的构造方法，`final + @NonNull` 的属性为必需|

### 组合注解
|注解| 作用|
|:-:|:--|
|`@Data`|@Getter + @Setter + @ToString + @EqualsAndHashCode + @RequiredArgsConstructor + @NoArgsConstructor|


### 日志注解
|注解| 作用|
|:-:|:--|
|`@Slf4j`| 添加一个名为 log 的日志，使用slf4j|



