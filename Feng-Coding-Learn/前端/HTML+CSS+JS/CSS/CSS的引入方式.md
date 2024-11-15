---
Type: Note
tags: 
Status: writing
Start-date: 2024-11-15 13:16
Finish-date: 
Modified-date: 
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






