---
Type: Note
tags:
  - 前端
  - 基础
  - siyuan
Status: done
Start-date: 2024-10-31 17:25
Finish-date: 2024-11-16
Modified-date: 2024-11-17 22:04
Publish: false
---
# HTML基本标签
HTML(HyperText Markup Language)是网页的基础结构语言,掌握基本标签的使用是学习前端开发的第一步。本文将详细介绍HTML中最基础也是最重要的标签结构和用法。


![[HTML前导图.png]]

一个文档声明：`<!DOCTYPE html>` , 是一个文档声明，表示这是一个HTML页面。

一个**html**标签对：`<html></html>` , HTML标签的作用是告诉浏览器，这个页面是从`<html>`开始，然后到`</html>` 结束的。
在实际开发中，我们可能会经常看到这样一行代码：
```html
<html xmlns="http://www.w3.org/1999/xhtml">
```
这句代码的作用是告诉浏览器，当前页面使用的是W3C的XHTML标准。这里我们了解即可，不用深究。一般情况下，我们不需要加上xmlns="`http://www.w3.org/1999/xhtml`"这一句。

一个**head**标签对：`<head></head>` , 是网页的“头部”​，用于定义一些特殊的内容，如页面标题、定时刷新、外部文件等。

一个**body**标签对：`<body></body>` , 是网页的“身体”​。对于一个网页来说，大部分代码都是在这个标签对内部编写的.



下面我们使用vscode新建一个HTML文件，然后在里面输入以下代码：
```html
<!DOCTYPE html>
<html>
<head>
    <title>这是网页的标题</title>
</head>
<body>
    <p>这是网页的内容</p>
</body>
</html>
```
在浏览器中的运行结果.
![[HTML前导图2.png]]

代码解析:
title标签是head标签的内部标签，其中`<title></title>`标签内定义的内容是页面的标题。这个标题不是文章的标题，而是在浏览器栏目中显示的那个标题。
`<p></p>`是段落标签，用于定义一段文字。对于这些标题的具体用法，我们在后面章节会详细介绍，这里只需要简单了解就可以了。

**HTML标签**: `<html></html>`
   - 是文档的==**根元素**==
   - ==lang属性用于声明网页的语言==
   - 常用语言代码:
     - `zh-CN`: 中文简体
     - `en`: 英文
     - `zh-TW`: 中文繁体
> [!tip]+ lang属性的重要性
> - 帮助搜索引擎理解网页内容
> - 辅助工具(如屏幕阅读器)使用
> - 有助于浏览器翻译功能


**文档声明**: ==`<!DOCTYPE html>`== 
   - 告诉浏览器这是一个HTML5文档
   - 必须放在文档最开始的位置
   - 不区分大小写

**head标签**: `<head></head>`
   - 包含文档的元数据
   - ==必须包含的元素: charset和title==
   - 不会在页面中显示
> [!info]+ 在HTML中，一般来说，只有6个标签能放在head标签内
> - title标签
> - meta标签
> - link标签
> - style标签
> - script标签
> - base标签



**body标签**: `<body></body>`
   - 包含所有可见的内容
   - 如文本、图像、链接等




> [!important]+ HTML文档规范
> - ==文档必须以 <!DOCTYPE html> 声明开始==
> - **标签名推荐使用小写**
> - **属性值必须使用双引号包裹**
> - **标签必须正确嵌套和关闭**
> - ==建议设置 lang 属性指定文档语言


> [!note]+ 开发建议
> - 使用适当的缩进提高代码可读性
> - 为代码块添加注释说明
> - 保持标签结构清晰

## title 标签
在HTML中，title标签唯一的作用就是定义网页的标题。
```html
<!DOCTYPE html>
<html>
<head>
    <title>www.bitzero.eu.org</title>
</head>
<body>
    <p>www.bitzero.eu.org，漫漫编程旅。</p>
</body>
</html>
```



## meta标签
在HTML中，meta标签一般用于定义页面的特殊信息，例如页面关键字、页面描述等。这些信息不是提供给人看的，而是提供给搜索引擎蜘蛛（如百度蜘蛛、谷歌蜘蛛）看的。

>简单来说，meta标签就是用来告诉“搜索蜘蛛”这个页面是干嘛的。


### name属性

![[meta标签name属性图.png]]

```html
<!DOCTYPE html>
<html>
<head>
    <!--网页关键字-->
    <meta name="keywords" content="www.bitzero.eu.org ,前端开发,后端开发"/>
    <!--网页描述-->
    <meta name="description" content="bitzero.eu.org是一个基于Obsidian的学习网站"/>
    <!--本页作者-->
    <meta name="author" content="FengZero">
    <!--版权声明-->
    <meta name="copyright" content="本站所有教程均为原创，版权所有，禁止转载。否则必将追究法律责任。"/>
</head>
<body>
</body>
</html>
```



### http-equiv属性
在HTML中，meta标签的http-equiv属性只有两个重要作用：**定义网页所使用的编码**；**定义网页自动刷新跳转**。


#### 定义网页所用编码
```html
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
```
这段代码告诉浏览器：该页面所使用的编码是utf-8。不过在HTML5标准中，上面这句代码可以简写为：`<meta charset="utf-8"/>` , 如果**你发现页面打开后是乱码**，很可能就是没有加上这一句代码。==在实际开发中，为了确保不出现乱码，我们必须要在每一个页面中加上这句代码。==


#### 定义网页自动刷新跳转
```html
<meta http-equiv="refresh" content="6;url=http://www.baidu.com"/>
```
这段代码表示当前页面在6秒后会自动跳转到`http://www.baidu.com`这个页面。

**栗子**:
作用:  我们在在VsCode中输入这段代码, 然后在浏览器中打开，过了6秒钟，页面就会跳转到百度首页。
```html
<!DOCTYPE html>
<html >
<head>
    <meta http-equiv="refresh" content="6;url=http://www.baidu.com"/>
</head>
<body>
    <p>这个页面在6秒之后自动跳转到百度首页</p>
</body>
</html>
```


## style标签
在HTML中，style标签用于定义元素的CSS样式，在HTML中不需要深入研究style标签，在CSS中我们再详细介绍。
```html
<!DOCTYPE html>
<html >
<head>
    <style type="text/css">
        /*这里写CSS样式*/
    </style>
</head>
<body>
</body>
</html>
```


## script标签
在HTML中，script标签用于定义页面的JavaScript代码，也可以引入外部JavaScript文件。在JavaScript部分中我们会详细介绍，这里不需要深究。

```html
<!DOCTYPE html>
<html >
<head>
    <script>
        /*这里写JavaScript代码*/
    </script>
</head>
<body>
</body>
</html>
```


## link标签
在HTML中，link标签用于引入外部样式文件（CSS文件）​。这也是属于CSS部分的内容，这里不需要深究。
```html
<!DOCTYPE html>
<html >
<head>
    <link type="text/css" rel="stylesheet" href="css/index.css">
</head>
<body>
</body>
```

> [!warning]+ 注意
> 这里的href属性中的 css/index.css 是CSS文件夹中的一个文件 , 这里不用理会 , 这里在之后学CSS时会讲到.

## base标签
这个标签一点意义都没有，可以直接忽略。知道有这么一个标签就行了，看到了直接忽略处理。


## body标签
在HTML中，head标签表示页面的“头部”​，而body标签表示页面的“身体”​。

在后面的章节中，我们学习的所有标签都是位于body标签内部的，这一点小伙伴们要清楚喔。

之前我们接触过了body标签，下面再来看一个简单例子。
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>body标签</title>
</head>
<body>
    <h3>静夜思</h3>
    <p>床前明月光，疑是地上霜。</p>
    <p>举头望明月，低头思故乡。</p>
</body>
</html>
```


> [!info]+ 代码解析
> `<meta charset="utf-8" />`是为了防止页面出现乱码，以后在每一个HTML页面中我们都要为其添加上。此外，`<meta charset="utf-8" />`这一句必须放在title标签以及其他meta标签前面，这一点大家要记住了。h3标签是一个“第3级标题标签”​，一般用于显示“标题内容”​，在“4.2 标题标签”这一节中再给大家详细介绍。

# HTML注释
在实际开发中，我们需要在一些关键的HTML代码旁边标明一下这段代码的含义，这个时候就要用到“HTML注释”了。

在HTML中，对一些关键代码进行注释，好处有非常多，比如方便理解、方便查找以及方便同一个项目组的小伙伴快速理解你的代码，以便快速修改。

```html
<!--注释的内容-->
```

“`<!---->`”又叫做注释标签。​“`<!--`”表示注释的开始，​“`-->`”表示注释的结束。

栗子
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>HTML注释</title>
</head>
<body>
    <h3>静夜思</h3>            <!--标题标签-->
    <p>床前明月光，疑是地上霜。    </p> <!--文本标签-->
    <p>举头望明月，低头思故乡。    </p> <!--文本标签-->
</body>
</html>
```