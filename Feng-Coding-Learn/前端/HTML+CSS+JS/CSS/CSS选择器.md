---
Type: Note
tags:
  - 前端
  - 基础
Status: writing
Start-date: 2024-11-15 23:15
Finish-date: 
Modified-date: 2024-11-15 23:20
Publish: false
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































