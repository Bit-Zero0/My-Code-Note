# 第一个程序
```js
<script>
    alert("你好!"); 
</script>
```
JavaScript 代码可以嵌入到 HTML 的 script 标签中.


# JavaScript 的书写形式

## 行内式
直接嵌入到 html 元素内部
```js
<input type="button" value="点我一下" onclick="alert('haha')">
```

>注意, JS 中字符串常量可以使用单引号表示, 也可以  使用双引号表示. 
>HTML 中推荐使用双引号, JS 中推荐使用单引号.

## 内嵌式
写到script标签中
```js
<script>
    alert("haha"); 
</script>
```

## 外部式
把js 写到一个单独的`.js`文件中.在html里面通过script来引入
```js
<script src="hello.js"></script>
```
>注意, 这种情况下 script 标签中间不能写代码. 必须空着(写了代码也不会执行). 
>适合代码多的情况.


# js注释
单行注释 `// 内容`  [建议使用] 
多行注释 `/* 内容 */`


# 输入输出 
## 输入: prompt 
弹出一个输入框
```js
// 弹出一个输入框 
prompt("请输入您的姓名:");
```
 
## 输出: alert
弹出一个警示对话框, 输出结果
```js
// 弹出一个输出框 
alert("hello");
```
 
## 输出: console.log
在控制台打印一个日志(供程序员看),在浏览器中使用F12即可进入控制台。
```js
// 向控制台输出日志
console.log("这是一条日志");
```
![[Pasted image 20221116131218.png]]

### 重要概念: 日志
日志是程序员调试程序的重要手段
>- 去医院看病, 医生会让患者做各种检查, 血常规, 尿常规, B超, CT等... 此时得到一堆检测结果. 这些结果普通人看不懂, 但是医生能看懂, 并且医生要通过这些信息来诊断病情.
>- 这些检测结果就是医生的 "日志"


- PS: 相比于医生来说, 程序猿多一个终极大招, "重启下试试".

### 重要概念: .
`console` 是一个 js 中的 "对象"
`.` 表示取对象中的某个属性或者方法. 可以直观理解成 "的" 
`console.log` 就可以理解成: 使用 "控制台" 对象 "的" log 方法.


# 语法概述
## 变量的使用
### 基本用法

创建变量(变量定义/变量声明/变量初始化),可以使用 **var**和**let**关键字来进行创建变量
[JS中var和let的区别](https://blog.csdn.net/weixin_43108539/article/details/108514200)
```js
var name = 'zhangsan'; 
var age = 20;
```
>var 是 JS 中的关键字, 表示这是一个变量.
>= 在 JS 中表示 "赋值", 相当于把数据放到内存的盒子中.  = 两侧建议有一个空格 
>每个语句最后带有一个 ; 结尾. JS 中可以省略 ; 但是建议还是加上.
>注意, 此处的 ; 为英文分号. JS 中所有的标点都是英文标点. 
>初始化的值如果是字符串, 那么就要使用单引号或者双引号引起来.初始化的值如果是数字, 那么直接赋值即可.

### 使用变量
```js
console.log(age); // 读取变量内容 
age = 30;         // 修改变量内容
```
>为啥动漫中的角色都是要先喊出技能名字再真正释放技能? 
>就是因为变量要先声明才能使用.


==**代码示例**==: 弹框提示用户输入信息, 再弹框显示.
```js
var name = prompt("请输入姓名:");
var age = prompt("请输入年龄:");
var score = prompt("请输入分数");
alert("您的姓名是: " + name);
alert("您的年龄是: " + age);
alert("您的分数是: " + score);
```

也可以把三个输出内容合并成一次弹框

```js
var name = prompt("请输入姓名:");
var age = prompt("请输入年龄:");
var score = prompt("请输入分数");
alert("您的姓名是: " + name + "\n" + "您的年龄是: " + age + "\n" + "您的分数是: " + 
score + "\n");
```
`+` 表示字符串拼接, 也就是把两个字符串首尾相接变成一个字符串. 
`\n` 表示换行

>==小语法糖==
>`prompt`前可以加一个 `+` ,可以把我们接收到的**数字字符串变量 转化为 数值型变量**。
> `var age = +prompt("请输入年龄:")`  此时的age接收到的就是数值型的数据了。 

## 理解动态类型
1) JS 的变量类型是程序运行过程中才确定的(运行到 = 语句才会确定类型)
```js
var a = 10;     // 数字 
var b = "hehe"; // 字符串
```
 
2) 随着程序运行, 变量的类型可能会发生改变.
```js
var a = 10;    // 数字 
a = "hehe";    // 字符串
```

这一点和 C Java 这种静态类型语言差异较大.
>C, C++, Java, Go 等语言是**静态类型语言**. 一个变量在创建的时候类型就确定了, 不能在运行时发生改变.
>如果尝试改变, 就会直接编译报错.

### 静态类型和动态类型的比较
在2022这样的视角来看待,静态类型阵营,完胜!!!
现在业界基本达成共识:认为静态类型比动态类型更好~
>- 静态类型,编译器就可以做更多的检查,让有些错误,提前被发现了.开发工具(IDE),也可以基于类型做更多的分析,提供更加丰富的支持～
>- 动态类型也有自己的好处.写一个函数,就可以同时支持多种不同的类型参数.(完全不需要"重载"/"泛型"这样的语法),但是虽然有这个优势,整体来说,还是弊大于利了.

# 基本数据类型
 JS 中内置的几种类型
- number: 数字. 不区分整数和小数. 
- boolean: true 真, false 假. 
- string: 字符串类型.
- undefined: 只有唯一的值 undefined. 表示未定义的值. 
- null: 只有唯一的值 null. 表示空值.
- NaN: 表示 Not a number , 不是一个数字;


## number 数字类型
JS 中不区分整数和浮点数, 统一都使用 "数字类型" 来表示. 

### 数字进制表示
计算机中都是使用二进制来表示数据, 而人平时都是使用十进制. 
因为二进制在使用过程中不太方便(01太多会看花眼).
所以在日常使用二进制数字时往往使用 八进制 和 十六进制 来表示二进制数字.
```js
var a = 07;      // 八进制整数, 以 0 开头
var b = 0xa;     // 十六进制整数, 以 0x 开头
var c = 0b10;    // 二进制整数, 以 0b 开头
```
注意:
- 一个八进制数字对应三个二进制数字
- 一个十六进制数字对应四个二进制数字. (两个十六进制数字就是一个字节)

各种进制之间的转换, 不需要手工计算, 直接使用计算器即可.


### 特殊的数字值
`Infinity`: 无穷大, 大于任何数字. 表示数字已经超过了 JS 能表示的范围. 
`-Infinity`: 负无穷大, 小于任何数字. 表示数字已经超过了 JS 能表示的范围. 
`NaN`: 表示当前的结果不是一个数字.
```js
var max = Number.MAX_VALUE; 
// 得到 Infinity
console.log(max * 2); 

// 得到 -Infinity 
console.log(-max * 2);

// 得到 NaN
console.log('hehe' - 10);
```

注意:
1. **负无穷大**  和  **无穷小**  不是一回事. 无穷小指无限趋近与 **0**,  值为   **1 / Infinity**
2. `'hehe' + 10` 得到的不是 `NaN`, 而是 `'hehe10'`, 会把**数字隐式转成字符串, 再进行字符串拼接**.
3. 可以使用 `isNaN()` 函数判定是不是一个非数字.
```js
console.log(isNaN(10));  // false 
console.log(isNaN('hehe' - 10));  // true
```


## string 字符串类型 
### 基本规则
字符串字面值需要使用引号引起来, 单引号双引号均可.
```js
var a = "haha";
var b = 'hehe';
var c = hehe;    // 运行出错
```

如果字符串中本来已经包含了引号咋办？可以使用单双引号进行搭配，此时也就可以不使用转义字符了。
```js
var msg = "My name is "zhangsan"";    // 出错
var msg = "My name is \"zhangsan\"";  // 正确, 使用转义字符. \" 来表示字符串内部的引号.
var msg = "My name is 'zhangsan'";    // 正确, 搭配使用单双引号 
var msg = 'My name is "zhangsan"';    // 正确, 搭配使用单双引号
```

### 求字符串长度
使用 String 的 `length` 属性即可 , ==单位为**字符**的数量==
```js
var a = 'hehe'; 
console.log(a.length); // 4

var b = '哈哈'; 
console.log(b.length); // 2
```


### 字符串拼接
使用 + 进行拼接
```js
var a = "my name is "; 
var b = "zhangsan"; 
console.log(a + b); // 'my name is zhangsan'
```

注意, 数字和字符串也可以进行拼接
```js
var c = "my score is "; 
var d = 100;
console.log(c + d);// 'my score is 100'
```

注意, 要认准相加的变量到底是字符串还是数字
```js
console.log(100 + 100);     // 200 
console.log('100' + 100);   // 100100
```

## boolean 布尔类型
表示 "真" 和 "假"
>boolean 原本是数学中的概念 (布尔代数).
>在计算机中 boolean 意义重大, 往往要搭配条件/循环完成逻辑判断.

Boolean 参与运算时当做 1 和 0 来看待.
```js
console.log(true + 1);  // 2
console.log(false + 1); // 1
```
>JS中的true就被当成1来处理了.这种"隐式类型转换"设定方式,认为其实并不科学!!

## undefined 未定义数据类型
==在实际开发中,不应该主动使用undefined，更不应该依赖undefined ==.

如果一个变量没有被初始化过, 结果就是 `undefined`, 是 `undefined` 类型
```js
var a; 
console.log(a)
```

`undefined` 和字符串进行相加, 结果进行字符串拼接
```js
console.log(a + "10");  // undefined10
```

`undefined` 和数字进行相加, 结果为 `NaN`
```js
console.log(a + 10); // NaN
```


## null 空值类型
null 表示当前的变量是一个 "空值".
```js
ar b = null;
console.log(b + 10);    // 10 
console.log(b + "10");  // null10
```
>==注意:==
>`null` 和 `undefined` 都表示取值非法的情况, 但是侧重点不同. 
>`null` 表示当前的值为空. (相当于有一个空的盒子) 
>`undefined` 表示当前的变量未定义. (相当于连盒子都没有)


# 运算符
JavaScript 中的运算符和 Java 用法基本相同. 此处不做详细介绍了.此次只介绍几个和 Java 和 C++不一样的运算符。

## 算术运算符
`/` 和C++与Java语言有一些不同 ,JS中,不区分整数和小数.都是number， 所以是能得到小数的。
```js
console.log(3 / 2); // 1.5
```

## 比较运算符
`==`  和 `!=` 只是比较两个变量的值,而不比较两个变量的类型.如果两个变量能够通过隐式类型转换,转成相同的值,此时就认为，也是相等的~~
 
`!==` 和 `===` 既要比较变量的值,也要比较类型.如果类型不相同,就直接认为不相等.

```js
let a  = 10 ; 
let b = '10';

console.log( a == b ); //true
console.log( a ===  b ); //false
```
![[Pasted image 20221116132551.png]]


## 逻辑运算符
JS中`&&`和`||` ， 和Java与C++是不同的。

### JS中的`||`符号：
运算方法：
     只要“||”前面为false,不管“||”后面是true还是false，都返回“||
     
     
     ”后面的值。
     只要“||”前面为true,不管“||”后面是true还是false，都返回“||”前面的值。
总结：**真前假后**

逻辑或` ||`  ：`var a = 表达式1 || 表达式2`

　　　　　　表达式1　　　　表达式2　　　　a取值
　　　　　　  1    　　　　　 0　　　　　　表达式1结果值
　　　　　　  1　　　　　　　 1　　　　　　表达式1结果值
　　　　　　  0　　　　　　　 1　　　　　　表达式2结果值
　　　　　　  0　　　　　　　 0　　　　　　表达式2结果值


### JS中的`&&`符号：
运算方法：

     只要“&&”前面是false，无论“&&”后面是true还是false，结果都将返“&&”前面的值;
     只要“&&”前面是true，无论“&&”后面是true还是false，结果都将返“&&”后面的值;
总结：**假前真后**

逻辑与 `&&`  ： `var a = 表达式1 && 表达式2`

　　　　　　表达式1　　　　表达式2　　　　a取值
　　　　　　  1    　　　　　 0　　　　　　表达式2结果值
　　　　　　  1　　　　　　　 1　　　　　　表达式2结果值
　　　　　　  0　　　　　　　 1　　　　　　表达式1结果值
　　　　　　  0　　　　　　　 0　　　　　　表达式1结果值



# 条件语句
内容和其他C++与java是一致的



# 数组
JS 的数组和 Java 和C++的差别是十分巨大的，
Java这里定义数组的时候, `int[]`类型~~
Java针对数组初始化,使用的`{}` , 而JS使用`[]`

## 创建数组
使用 `new` 关键字创建
```js
// Array 的 A 要大写 
var arr = new Array();
```

使用字面量方式创建 [常用]
```js
var arr = [];
var arr2 = [1, 2, 'haha', false]; // 数组中保存的内容称为 "元素"
```

>**注意: JS 的数组不要求元素是相同类型**.
>这一点和 C, C++, Java 等静态类型的语言差别很大. 但是 Python, PHP 等动态类型语言也是如此.


## 获取数组元素
使用下标的方式访问数组元素(从 0 开始)
```js
var arr = ['小猪佩奇', '小猪乔治', '小羊苏西'];
console.log(arr);
console.log(arr[0]);
console.log(arr[1]);
console.log(arr[2]); 
arr[2] = '小猫凯迪'; 
console.log(arr);
```


注意: 不要给数组名直接赋值, 此时数组中的所有元素都没了.

相当于本来 arr 是一个数组, 重新赋值后变成字符串了.
```js
var arr = ['小猪佩奇', '小猪乔治', '小羊苏西']; 
arr = '小猫凯迪';
```


## 新增数组元素 

### 通过修改 length 新增
相当于在末尾新增元素. 新增的元素默认值为 undefined
```js
var arr = [9, 5, 2, 7];
arr.length = 6;
console.log(arr);
console.log(arr[4], arr[5]);
```
![[Pasted image 20221116154812.png]]


### 通过下标新增
如果下标超出范围赋值元素, 则会给指定位置插入新元素
```js
var arr = []; 
arr[2] = 10; 
console.log(arr);
```
![[Pasted image 20221116154852.png]]

此时这个数组的 `[0]` 和 `[1]` 都是 `undefined`





### 使用 push 进行追加元素
代码示例: 给定一个数组, 把数组中的奇数放到一个 newArr 中.
```js
var arr = [9, 5, 2, 7, 3, 6, 8]; 
var newArr = [];
for (var i = 0; i < arr.length; i++) { 
    if (arr[i] % 2 != 0) {
        newArr.push(arr[i]); 
    }
}
console.log(newArr);
```


## 删除数组中的元素
使用 `splice` 方法删除元素
```js
var arr = [9, 5, 2, 7];
// 第一个参数表示从下表为 2 的位置开始删除. 第二个参数表示要删除的元素个数是 1 个 
arr.splice(2, 1);
console.log(arr);  // [9, 5, 7]
```
splice 还可以用来修改元素，具体详情看[Array.prototype.splice() - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)

>- 目前咱们已经用到了数组中的一些属性和方法.
>- `arr.length` , length 使用的时候不带括号, 此时 length 就是一个普通的变量(称为成员变量, 也叫属 
性)
>- `arr.push()` ,  `arr.splice()` 使用的时候带括号, 并且可以传参数, 此时是一个函数 (也叫做方法)


## 不正经的JS数组
JS 中的数组,不是一个正经数组!!
除了能接数组的活,还能接map的活(表示**键值对**) => 这里说数组是一个map，更准确的说,是一个"对象".
在JS里,是可以在运行时，给对象新增属性的.

按照之前的理解, Java 中要求数组下标,是`0 ->length -1`范围.如果超出范围,就会抛出一个**异常**
JS并非如此 ，当我们访问一个超出范围的下标的时候,得到的结果是`undefined`,并不会出现异常~~
![[Pasted image 20221116163618.png]]


==**玩法一：**==
那 `arr[-1] = 10` 呢？
```js
var arr[4] =[1 , 2 , 3 , 4];
arr[-1] = 10;
console.log(arr);
```
![[Pasted image 20221116163859.png]]
此时`-1`与其说是一个下标，不如说是一个"**属性**" ,而且并**不会影响到数组的长度** ,所以现在该数组的长度还是4.


==**玩法二：**==
`arr['hello'] = 10;`
```js
var arr[4] =[1 , 2 , 3 , 4];
arr['hello'] = 10;
console.log(arr);
console.log(arr['hello']);
```
`arr['hello']`就是在给`arr`这个对象,**新增了一个属性.属性的名字是hello，属性的值是10**.



# 引用文章
[JS中var和let的区别_Mastersheaven的博客-CSDN博客_js let var](https://blog.csdn.net/weixin_43108539/article/details/108514200)