# idea快捷键

## 快速生成  JavaBean和构造函数
### 创建 JavaBean
**右键菜单中的 `generate` -> `Getter and Setter`**

```java
class Student
{
	String name;
    int age;
}
```

右键找到 `generate` 选项
![[image-20220614151254275 1.png]]

`generate` 选项中的 `Getter and Setter` 
![[image-20220614151517645.png]]




然后选择我们的需要生成的 JavaBean
![[image-20220614151729123.png]]

生成成功

```java
class student
{
    private int age;
    private String  name;

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```


### 快速创建构造函数
 **右键菜单中的 `generate`  -> `constructor` 

和创建JavaBean很类似，但是使用的是 `constructor` 。

如：创建student类的构造器
```java
class student  
{  
    private int age;  
    private String  name;  
}
```
![[Pasted image 20220614181317.png]]
点击Generate后，选择Constructor。
![[Pasted image 20220614181404.png]]
选择我们要参与构造的成员变量
![[Pasted image 20220614181606.png]]

使用成功
![[Pasted image 20220614181649.png]]



## 快速创建静态方法

`alt+enter`

如：需要创建 `getStudent` 的静态方法

```java
public class test1 {
    public static void main(String[] args) {
        int i = getStudent();
    }
}
```

将光标指定到当前行， 使用 `alt+enter` 快捷键,就会出现以下菜单，选择第一个选项
![[image-20220614152439849.png]]

我们需要的静态方法就创建出来了。
![[image-20220614152546217.png]]




## 快速使用条件判断

 使用`ctrl + alt + t`

如：对 以下代码`i  j  x` 使用添加 `while` 循环

```java
public class test1 {
    public static void main(String[] args) 
    {
        int i= 1;
        int j = 2;
        int x = 3;
    }
}
```

先选中我们要进行条件判断的代码，使用`ctrl + alt + t` 后就会弹出列表
![[image-20220614175847473.png]]

选择while选项后
![[image-20220614175921823.png]]