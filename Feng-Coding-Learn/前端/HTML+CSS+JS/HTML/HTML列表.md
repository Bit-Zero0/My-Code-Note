---
Type: Note
tags:
  - 前端
  - 基础
  - HTML
Status: writing
Start-date: 2024-11-02 17:39
Finish-date: 
Modified-date: 2024-11-18 22:10
Publish: false
---

# 列表简介

列表是网页中最常用的数据展示方式之一。HTML提供了三种列表类型：有序列表、无序列表和定义列表。

- **有序列表(ordered list)**: 列表项按特定顺序排列，通常用数字或字母标记
- **无序列表(unordered list)**: 列表项无特定顺序，通常用圆点等符号标记  
- **定义列表(definition list)**: 用于术语定义，包含术语和描述两部分

# 有序列表 `<ol>`

有序列表使用`<ol>`标签创建，每个列表项用`<li>`标签表示。默认使用数字作为标记。

```html
<ol>
    <li>第一项</li>
    <li>第二项</li>
    <li>第三项</li>
</ol>
```

> [!important]
> - `ol`标签只能包含`li`子标签
> - `ol`和`li`标签必须配对使用

## type属性

在HTML中，我们可以使用type属性来改变列表项符号。默认情况下，有序列表使用数字作为列表项符号。
```html
<ol type="属性值">
    <li>列表项</li>
    <li>列表项</li>
    <li>列表项</li>
</ol>
```

| type值 | 显示效果 |
|--------|----------|
| 1      | 1,2,3    |
| a      | a,b,c    |
| A      | A,B,C    |
| i      | i,ii,iii |
| I      | I,II,III |

# 无序列表 `<ul>` 

无序列表是最常用的列表类型，使用`<ul>`标签创建。

```html
<ul>
    <li>HTML</li>
    <li>CSS</li>
    <li>JavaScript</li>
</ul>
```

## 实际应用

无序列表在实际开发中应用广泛，常用于:

- 导航菜单
- 新闻列表
- 商品列表
- 评论列表

```html
<ul type="属性值">
    <li>列表项</li>
    <li>列表项</li>
    <li>列表项</li>
</ul>
```


![[Pasted image 20241105224744.png]]有序列表一样，对于无序列表的列表项符号，等学了CSS之后，我们可以放弃type属性，而使用list-style-type属性来取代。


```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>type属性</title>
</head>
<body>
    <ul type="circle">
        <li>HTML</li>
        <li>CSS</li>
        <li>JavaScript</li>
        <li>jQuery</li>
        <li>Vue.js</li>
    </ul>
</body>
</html>
```


## 深入无序列表
在真正的前端开发中，无序列表比有序列表更为实用。更准确点说，我们一般都是使用无序列表，几乎用不到有序列表。


> [!tip]+ 
> 可能很多人都会疑惑：这些效果是怎样用无序列表做出来的呢？网页外观嘛，当然都是用CSS来实现的啊！


对于无序列表来说，还有以下两点要注意。
- ul元素的子元素只能是li，不能是其他元素。
- ul元素内部的文本，只能在li元素内部添加，不能在li元素外部添加。


==错误示范==
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title></title>
</head>
<body>
    <ul>
        <div>前端最核心 3 个技术：</div>
        <li>HTML</li>
        <li>CSS</li>
        <li>JavaScript</li>
    </ul>
</body>
</html>
```

上面的代码是错误的，因为ul元素的子元素只能是li元素，不能是其他元素。


==正确做法==如下所示。
```html
<div>前端最核心3个技术：</div>
<ul>
    <li>HTML</li>
    <li>CSS</li>
    <li>JavaScript</li>
</ul>
```

> [!tip]
> 实际开发中，列表的外观样式主要通过CSS来实现，很少使用HTML的type属性

# 定义列表 `<dl>`
在HTML中，**定义列表**由两部分组成：名词和描述。

```html
<dl>
    <dt>名词</dt>
    <dd>描述</dd>
    ……
</dl>
```

dl即definition list（定义列表）​，dt即definition term（定义名词）​，而dd即definition description（定义描述）​。

在该语法中，`<dl>`标记和`</dl>`标记分别定义了定义列表的开始和结束；dt标签用于添加要解释的名词；而dd标签用于添加该名词的具体解释。
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>定义列表</title>
</head>
<body>
    <dl>
        <dt>HTML</dt>
        <dd>制作网页的标准语言，控制网页的结构</dd>
        <dt>CSS</dt>
        <dd>层叠样式表，控制网页的样式</dd>
        <dt>JavaScript</dt>
        <dd>脚本语言，控制网页的行为</dd>
    </dl>
</body>
</html>
```

![[定义列表例子图.png]]

定义列表在实际开发中，定义列表虽然用得比较少，但是在某些高级效果（如自定义表单）中也会用到。

定义列表虽然使用较少，但在特定场景(如术语解释、键值对展示等)非常实用。



