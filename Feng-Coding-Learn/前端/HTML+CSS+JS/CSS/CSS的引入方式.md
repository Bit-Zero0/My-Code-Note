---
Type: Note
tags:
  - 基础
  - 前端
  - CSS
Status: writing
Start-date: 2024-11-15 13:16
Finish-date: 
Modified-date: 2024-11-17 22:00
Publish: false
---

# 本文摘要
学习CSS的三种引入方式.

## 前提知识
[[readme-CSS]]
[[超链接#内部链接]]


# CSS引入方式
想要在一个页面引入CSS，共有以下三种方式。
- 外部样式表
- 内部样式表
- 行内样式表

## 外部样式表
外部样式表是最理想的CSS引入方式。

在实际开发中，为了提升网站的性能和可维护性，一般都是使用外部样式表。所谓的外部样式表，指的是把CSS代码和HTML代码单独放在不同的文件中，然后在HTML文档中**使用link标签来引用CSS样式表**。

当样式需要被应用到多个页面时，外部样式表是最理想的选择。使用外部样式表，你就可以通过更改一个CSS文件来改变整个网站的外观。

外部样式表在单独文件中定义，然后在HTML文件的`<head></head>`标签对中使用link标签来引用。

**语法**
```html
<link rel="stylesheet" type="text/css" href="文件路径" />
```
rel即relative的缩写，它的取值是固定的，即stylesheet，表示引入的是一个样式表文件（即CSS文件）​。
type属性取值也是固定的，即"text/css"，表示这是标准的CSS。
href属性表示CSS文件的路径。对于路径，相信小伙伴们已经很熟悉了。


**栗子** :  
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title></title>
    <link rel="stylesheet" type="text/css" href="css/index.css" />
</head>
<body>
</body>
</html>
```
如果你使用外部样式表，必须使用link标签来引入，**而 link标签是放在head标签内的**。

> [!tip]+ href 路径问题
> 关于 `css/index.css` 路径, 可以看看这篇[[超链接#内部链接|HTML超链接]]文章


## 内部样式表
内部样式表，指的是把HTML代码和CSS代码放到同一个HTML文件中。其中，CSS代码放在style标签内，并且style标签是放在head标签内部的。

**语法**
```html
<style type="text/css">
……
</style>
```
`type="text/css"` 是必须添加的，表示这是标准的CSS。


**栗子: 渲染div内字体为红色**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <title></title>
    <style type="text/css">
        div{color:red;}
    </style>
</head>
<body>
    <div>Feng，无止境的攀登!!!</div>
    <div>Feng，无止境的攀登!!!</div>
    <div>Feng，无止境的攀登!!!</div>
</body>
</html>
```


如果使用内部样式表，CSS样式必须在style标签内定义，而style标签是放在head标签内的。

## 行内样式表
行内样式表跟内部样式表类似，也是把HTML代码和CSS代码放到同一个HTML文件中。但是两者有着本质的区别：内部样式表的CSS是在“style标签”内定义的，而行内样式表的CSS是在“标签的style属性”中定义的。

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <title></title>
</head>
<body>
    <div style="color:red;">绿叶，给你初恋般的感觉。</div>
    <div style="color:red;">绿叶，给你初恋般的感觉。</div>
    <div style="color:red;">绿叶，给你初恋般的感觉。</div>
</body>
</html>
```

大家将这个例子和前面一个例子对比一下，就知道两段代码实现的效果是一样的。两段代码都是定义三个div元素的颜色为红色。如果使用内部样式表，样式只需要写一遍；但是如果使用行内样式，每个元素则必须单独写一遍。

> [!warning] 行内样式是在每一个元素内部定义的，冗余代码非常多，并且每次改动CSS的时候都必须到元素中一个个去改，这样会导致网站的可读性和可维护性非常差。为什么我一直强烈不推荐使用Dreamweaver那种鼠标点击的界面操作方式来开发页面？其实就是因为这种方式产生的页面代码中，所有的CSS样式都是使用行内样式的。


对于这三种样式表，在实际开发中，一般都是使用外部样式表。不过在本书中，为了讲解方便，我们采用的都是内部样式表。


> [!tip]+ @import 引入方式
> @import方式跟外部样式表很相似。不过在实际开发中，我们极少使用@import方式，而更倾向于使用link方式（外部样式）​。原因在于@import方式会先加载HTML后加载CSS，而link是先加载CSS后加载HTML。如果HTML在CSS之前加载，页面用户体验就会非常差。因此对于@import这种方式，我们不需要去了解。

