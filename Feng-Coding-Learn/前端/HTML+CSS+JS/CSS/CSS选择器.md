---
Type: Note
tags:
  - 前端
  - 基础
Status: writing
Start-date: 2024-11-15 23:15
Finish-date: 
Publish: false
Modified-date: 2024-11-16 16:29
---
# 元素的id和class
id和class是元素最基本的两个属性。一般情况下，id和class都是用来选择元素，以便进行CSS操作或者JavaScript操作的.

## id属性
==**id属性具有唯一性，也就是说在一个页面中相同的id只能出现一次**==。如果出现了多个相同的id，那么CSS或者JavaScript就无法识别这个id对应的是哪一个元素。

**栗子: id 属性错误案列**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <title></title>
</head>
<body>
    <div id="content">存在即合理</div>
    <p id="content">存在即合理</p>
</body>
</html>
```

上面这段代码是不正确的，因为在同一个页面中，不允许出现两个相同id的元素。不过，在不同页面中，可以出现两个id相同的元素。


## class属性
class，顾名思义，就是“类”​。其思想跟C++、Java等编程语言的“类”相似。我们可以为同一个页面的相同元素或者不同元素设置相同的class，然后使得具有相同class的元素具有相同的CSS样式。

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <title></title>
</head>
<body>
    <div class="content">存在即合理</div>
    <p class="content">存在即合理</p>
</body>
</html>
```

上面这段代码是正确的，因为在同一个页面中，允许出现两个相同class的元素。这样可以使得我们对具有相同class的多个元素定义相同的CSS样式。

> [!question]+ id 和 class 属性的理解
> 对于id和class，我们可以这样理解：id就像你的身份证号，而class就像你的名字。身份证号是全国唯一的，但是两个人的名字就有可能是一样的。


# 选择器是什么



目前这是一个Obsidian的md文件, 我需要写一篇博客, 标题为 CSS选择器
我将给你目录, 请为我生成适合初学者阅读的内容, 要求语气生动有趣, 包含可运行的代码示例.
- 元素id和class
    - id属性
    - class属性
- 选择器是什么
- class 选择器
	- 元素选择器
	- id选择器
	- class选择器
	- 后代选择器
	- 群组选择器



# CSS选择器 - 给你的网页添加魔法🎨

大家好!今天我们来聊一聊CSS中非常重要的概念 - 选择器。如果把HTML比作房子的框架,那CSS就是装修工人,而选择器就是工人手中的工具,帮助我们精确地找到想要装修的位置。

## 元素id和class - 给元素贴上标签📝

在开始学习选择器之前,我们先要了解两个重要的HTML属性:id和class。

### id属性 - 独一无二的身份证

就像每个人都有自己的身份证号码一样,HTML元素也可以拥有唯一的id标识。

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>ID选择器示例</title>
    <style>
        #unique-box {
            background-color: #f0f0f0;
            padding: 20px;
            border: 2px solid #333;
            margin: 10px;
        }
    </style>
</head>
<body>
    <div id="unique-box">这是一个独特的盒子</div>
</body>
</html>
```

注意:
- id在整个页面中必须是唯一的
- 一个元素只能有一个id
- id名称不能以数字开头

### class属性 - 元素的群组标签 🏷️

class就像是给元素贴上的标签,拥有相同class的元素会具有相同的特征。

```html
<div class="box red-bg">红色盒子1</div>
<div class="box red-bg">红色盒子2</div>
<p class="red-bg">红色段落</p>
```

一个元素可以同时拥有多个class,用空格分隔:
```html
<div class="box red-bg rounded">这个盒子既是红色的,又是圆角的</div>
```

## 选择器是什么? 🤔

CSS选择器就是帮助我们找到想要装饰的HTML元素的方式。就像使用遥控器选择要控制的电器一样简单!

## 常用的选择器类型

### 元素选择器
直接使用HTML标签名称作为选择器:

```html
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <title>元素选择器示例</title>
    <style>
        /* 所有段落都变成天蓝色,并添加可爱的字体 */
        p {
            color: skyblue;
            font-family: "Comic Sans MS", cursive;
            padding: 10px;
            background: #f0f0f0;
            border-radius: 5px;
        }
        
        /* 所有标题都居中并带有渐变色 */
        h1 {
            text-align: center;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            color: white;
            padding: 15px;
        }
    </style>
</head>
<body>
    <h1>欢迎来到我的彩色世界!</h1>
    <p>这是第一个段落 🌈</p>
    <p>这是第二个段落 ⭐</p>
    <p>这是第三个段落 🎨</p>
</body>
</html>
```

### id选择器

id选择器使用`#`符号来选择特定id的元素。就像每个人都有自己独一无二的名字一样,页面中的每个id也必须是唯一的哦！

> 💡 小贴士: id的名字要见名知意,比如给导航栏起名叫`nav`就很合适~

来看个简单的例子:

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>ID选择器示例</title>
    <style>
        /* 使用id选择器来设置样式 */
        #my-box {
            width: 200px;
            height: 200px;
            background-color: pink;
            border: 2px solid red;
        }

        #special-text {
            color: blue;
            font-size: 20px;
        }
    </style>
</head>
<body>
    <div id="my-box">
        这是一个粉色的盒子
    </div>
    <p>这里有个<span id="special-text">蓝色的文字</span></p>
</body>
</html>
```

通过这个例子我们可以看到:
1. 使用`#`号来定义id选择器
2. 可以给不同的元素设置不同的id
3. 每个id只能使用一次

记住:
- id在一个页面中不能重复使用
- id选择器比标签选择器的优先级更高
- 建议id名称用英文,不要用数字开头

快把代码复制到编辑器中试试看吧! 😊

### class选择器

class选择器使用`.`符号来选择具有相同class的元素。和id不同的是,class可以重复使用,就像班级里可以有很多同学都是班干部一样！

> 💡 小贴士: class是最常用的选择器,多个class可以用空格分开哦~

来看个简单的例子:

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>Class选择器示例</title>
    <style>
        /* 使用class选择器来设置样式 */
        .red-box {
            background-color: red;
            width: 100px;
            height: 100px;
        }

        .blue-text {
            color: blue;
            font-size: 16px;
        }

        /* 一个元素可以同时使用多个class */
        .border {
            border: 2px solid black;
        }
    </style>
</head>
<body>
    <!-- 使用单个class -->
    <div class="red-box">
        这是红色盒子
    </div>

    <!-- 使用多个class -->
    <div class="red-box border">
        这是带边框的红色盒子
    </div>

    <p class="blue-text">这是蓝色的文字</p>
    <p class="blue-text border">这是带边框的蓝色文字</p>
</body>
</html>
```

通过这个例子我们可以看到:
1. 使用`.`号来定义class选择器
2. 同一个class可以用在多个元素上
3. 一个元素可以同时拥有多个class

记住:
- class可以重复使用在多个元素上
- 多个class用空格隔开
- class名称要简单明了,比如`.red-box`就说明这是个红色的盒子

快来试试看吧！你可以尝试添加更多的class组合~ 🎨

### 后代选择器

后代选择器通过空格来选择某个元素内部的所有指定元素,就像我们说"王家的孩子"时,会选中王家所有的孩子一样！

> 💡 小贴士: 后代选择器会选择元素内部所有层级的指定元素哦~

来看个简单的例子:

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>后代选择器示例</title>
    <style>
        /* 选择container里面的所有段落 */
        .container p {
            color: red;
            font-size: 16px;
        }

        /* 选择box里面的所有span */
        .box span {
            background-color: yellow;
        }
    </style>
</head>
<body>
    <div class="container">
        <p>这是容器内的第一个段落</p>
        <div>
            <p>这是容器内的第二个段落</p>
        </div>
        <p>这是容器内的第三个段落</p>
    </div>

    <div class="box">
        <span>这是黄色背景的文字</span>
        <p>
            这是普通段落,包含<span>黄色背景</span>的文字
        </p>
    </div>
</body>
</html>
```

通过这个例子我们可以看到:
1. 后代选择器使用空格连接
2. 可以选择元素内部任意层级的元素
3. 不管嵌套多深,只要是指定元素内部的目标元素都会被选中

记住:
- 后代选择器会选择所有层级的符合条件的元素
- 选择器之间用空格分开
- 常用于处理具有包含关系的元素样式

### 群组选择器

群组选择器使用`,`逗号来同时选择多个不同的元素。就像老师说"小明、小红、小华都是班干部"一样,可以一次性选中多个目标！

> 💡 小贴士: 群组选择器可以让我们少写很多重复的CSS代码哦~

来看个简单的例子:

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>群组选择器示例</title>
    <style>
        /* 同时选择多个元素 */
        h1, h2, .special {
            color: red;
            font-size: 20px;
        }

        /* 同时选择多个class */
        .box1, .box2 {
            background-color: yellow;
            width: 100px;
            height: 100px;
        }
    </style>
</head>
<body>
    <h1>这是一级标题</h1>
    <h2>这是二级标题</h2>
    <p class="special">这是特殊段落</p>

    <div class="box1">黄色盒子1</div>
    <div class="box2">黄色盒子2</div>
</body>
</html>
```

通过这个例子我们可以看到:
1. 用逗号分隔不同的选择器
2. 可以混合使用标签选择器和class选择器
3. 所有被选中的元素都会应用相同的样式

记住:
- 逗号表示"和"的关系
- 可以组合任意类型的选择器
- 能减少重复的CSS代码

快来试试这个简单又实用的选择器吧！💪

## 实战小例子 🌟

让我们来看一个综合运用这些选择器的例子:

```html
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <title>CSS选择器示例</title>
    <style>
        /* 使用各种选择器来装饰页面 */
        #main-title {
            color: #333;
            font-size: 24px;
        }

        .container {
            width: 80%;
            margin: 0 auto;
        }

        .box {
            background-color: #f0f0f0;
            padding: 15px;
            border-radius: 5px;
        }

        .text {
            line-height: 1.6;
        }

        .text.important {
            color: red;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 id="main-title">欢迎来到我的网站</h1>
        <div class="box">
            <p class="text important">这是重要内容</p>
            <p class="text">这是普通内容</p>
        </div>
    </div>
</body>
</html>
```

## 小结 📝

CSS选择器就像是一把把钥匙🔑,帮助我们打开通向漂亮网页的大门。掌握了这些基本的选择器,你就能:
- 精确定位想要修饰的元素
- 批量设置相同样式
- 创建层次分明的样式结构

记住,选择器的使用没有固定模式,关键是要根据具体需求灵活运用。多加练习,你一定能成为CSS选择器的达人! 💪

















