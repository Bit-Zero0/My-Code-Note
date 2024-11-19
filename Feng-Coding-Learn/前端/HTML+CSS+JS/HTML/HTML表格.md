---
Type: Note
tags:
  - 前端
  - 基础
  - HTML
Status: done
Start-date: 2024-11-06 13:12
Finish-date: 2024-11-19
Modified-date: 2024-11-19 22:07
Publish: false
---

表格常用于网页布局. 但是这并不说明表格就一无是处了。表格在实际开发中是用得非常多的，因为使用表格可以更清晰地排列数据。其中，很多网页都用到表格


# 基本结构
HTML表格由三个==**核心组件**==构成：
- ==**table**== - 定义表格
- ==**tr**== (table row) - 定义表格行
- ==**td**== (table data cell) - 定义表格单元格

> [!note]+ 表格基础结构
> - 每个`<table>`必须包含至少一个`<tr>`
> - 每个`<tr>`必须包含至少一个`<td>`或`<th>`
> - 表格的行数由`<tr>`的数量决定
> - 表格的列数由每行中`<td>`的数量决定

```html
<table>
    <tr>
        <td>单元格 1</td>
        <td>单元格 2</td>
    </tr>
    <tr>
        <td>单元格 3</td>
        <td>单元格 4</td>
    </tr>
</table>
```

`<table>`和`</table>` 表示整个表格的开始和结束，`<tr>`和`</tr>`表示行的开始和结束，而`<td>`和`</td>`表示单元格的开始和结束。

> [!tip]+ 在表格中，有多少组<tr></tr>，就表示有多少行

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>表格基本结构</title>
    <!--这里使用CSS为表格加上边框-->
    <style type="text/css">
        table,tr,td{border:1px solid silver;}
    </style>
</head>
<body>
    <table>
        <tr>
            <td>HTML</td>
            <td>CSS</td>
        </tr>
        <tr>
            <td>JavaScript</td>
            <td>jQuery</td>
        </tr>
    </table>
</body>
</html>
```

默认情况下，表格是没有边框的。在这个例子中，我们使用CSS加入边框是想让大家更清楚地看到一个表格的结构。对于表格的边框、颜色、大小等，我们在CSS中会学到，这里不需要理解那一句CSS代码。

在HTML的学习中，我们只需要知道表格需要用什么标签就行了。记住，HTML只关注结构，CSS才关注样式。


# 表格的完整结构
一个语义完整的表格应包含以下组件：

1. ==**caption**== - 表格标题
2. ==**thead**== - 表格头部
3. ==**tbody**== - 表格主体
4. ==**tfoot**== - 表格底部
5. ==**th**== - 表头单元格

> [!important]+ 表格语义化的重要性
> 使用语义化的表格结构可以:
> - 提高页面的可访问性
> - 便于搜索引擎理解内容
> - 使代码更易于维护
> - 方便应用CSS样式


## 表格标题：caption
在HTML中，表格一般都会有一个标题，我们可以使用caption标签来实现。
```html
<table>
    <caption>表格标题</caption>
    <tr>
        <td>单元格 1</td>
        <td>单元格 2</td>
    </tr>
    <tr>
        <td>单元格 3</td>
        <td>单元格 4</td>
    </tr>
</table>
```
一个表格只能有一个标题，也就是只能有一个caption标签。
>在默认情况下，标题都是位于整个表格内的第一行。


```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>表格标题</title>
    <!--这里使用CSS为表格加上边框-->
    <style type="text/css">
        table,tr,td{border:1px solid silver;}
    </style>
</head>
<body>
    <table>
        <caption>考试成绩表</caption>
        <tr>
            <td>小明</td>
            <td>80</td>
            <td>80</td>
            <td>80</td>
        </tr>
        <tr>
            <td>小红</td>
            <td>90</td>
            <td>90</td>
            <td>90</td>
        </tr>
        <tr>
            <td>小杰</td>
            <td>100</td>
            <td>100</td>
            <td>100</td>
        </tr>
    </table>
</body>
</html>
```


## 表头单元格：th
在HTML中，单元格其实有两种：表头单元格，使用th标签；表行单元格，使用td标签。

- th，指的是table header cell（表头单元格）​。
- td，指的是table data cell（表行单元格）​。

```html
<table>
    <caption>表格标题</caption>
    <tr>
        <th>表头单元格 1</th>
        <th>表头单元格 2</th>
    </tr>
    <tr>
        <td>表行单元格 1</td>
        <td>表行单元格 2</td>
    </tr>
    <tr>
        <td>表行单元格 3</td>
        <td>表行单元格 4</td>
    </tr>
</table>
```

> [!info]+ th和td在本质上都是单元格，但是并不代表两者可以互换，它们之间具有以下两种区别。
> 显示上：浏览器会以“粗体”和“居中”来显示th标签中的内容，但是td标签不会。
> 语义上：th标签用于表头，而td标签用于表行。
> 
> 当然，对于表头单元格，我们可能会使用td来代替th，但是不建议这样做。因为在“[[HTML语义化]]”这一节我们已经明确说过了：学习HTML的目的就是，在需要的地方使用恰当的标签（也就是语义化）​。


```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>表头单元格</title>
    <!--这里使用CSS为表格加上边框-->
    <style type="text/css">
        table,tr,td{border:1px solid silver;}
    </style>
</head>
<body>
    <table>
        <caption>考试成绩表</caption>
        <tr>
            <th>姓名</th>
            <th>语文</th>
            <th>英语</th>
            <th>数学</th>
        </tr>
        <tr>
            <td>小明</td>
            <td>80</td>
            <td>80</td>
            <td>80</td>
        </tr>
        <tr>
            <td>小红</td>
            <td>90</td>
            <td>90</td>
            <td>90</td>
        </tr>
        <tr>
            <td>小杰</td>
            <td>100</td>
            <td>100</td>
            <td>100</td>
        </tr>
    </table>
</body>
</html>
```

# 表格的常用属性
补充一些重要的表格属性：

- ==border== - 设置表格边框
- ==cellpadding== - 设置单元格内边距
- ==cellspacing== - 设置单元格间距
- ==width== - 设置表格宽度
- ==height== - 设置表格高度

> [!warning]+ 最佳实践
> 虽然HTML提供了很多表格属性，但建议使用CSS来控制表格样式，这样可以：
> - 实现更好的样式分离
> - 提供更灵活的样式控制
> - 便于维护和修改


# 表格的语义化

一个完整的表格包含：table、caption、tr、th、td。为了更深入地对表格进行语义化，HTML引入了thead、tbody和tfoot这三个标签。
```html
<table>
    <caption>表格标题</caption>
    <!--表头--><thead>
        <tr>
            <th>表头单元格 1</th>
            <th>表头单元格 2</th>
        </tr>
    </thead>
    <!--表身--><tbody>
        <tr>
            <td>表行单元格 1</td>
            <td>表行单元格 2</td>
        </tr>
        <tr>
            <td>表行单元格 3</td>
            <td>表行单元格 4</td>
        </tr>
    </tbody>
    <!--表脚--><tfoot>
        <tr>
            <td>标准单元格 5</td>
            <td>标准单元格 6</td>
        </tr>
    </tfoot>
</table>
```
thead、tbody和tfoot把表格划分为三部分：表头、表身、表脚。有了这三个标签，表格语义更加良好，结构更清晰，也更具有可读性和可维护性。


```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>表格语义化</title>
    <!--这里使用CSS为表格加上边框-->
    <style type="text/css">
        table,tr,td{border:1px solid silver;}
    </style>
</head>
<body>
    <table>
        <caption>考试成绩表</caption>
        <thead>
            <tr>
                <th>姓名</th>
                <th>语文</th>
                <th>英语</th>
                <th>数学</th>
            <tr>
        </thead>
        <tbody>
            <tr>
                <td>小明</td>
                <td>80</td>
                <td>80</td>
                <td>80</td>
            </tr>
            <tr>
                <td>小红</td>
                <td>90</td>
                <td>90</td>
                <td>90</td>
            </tr>
            <tr>
                <td>小杰</td>
                <td>100</td>
                <td>100</td>
                <td>100</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td>平均</td>
                <td>90</td>
                <td>90</td>
                <td>90</td>
            </tr>
        </tfoot>
    </table>
</body>
</html>
```

表脚（tfoot）往往用于统计数据。对于thead、tbody和tfoot这三个标签，不一定全部都用上，例如tfoot就很少用。一般情况下，我们都是根据实际需要来使用这三个标签。

# 合并行：rowspan
在设计表格时，有时我们需要将“横向的N个单元格”或者“纵向的N个单元格”合并成一个单元格（类似Word中的表格合并）​.

语法
```html
<td rowspan = "跨越的行数"></td>
```



```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>rowspan属性</title>
    <style type="text/css">
        table,tr,td{border:1px solid silver;}
    </style>
</head>
<body>
    <table>
        <tr>
            <td>姓名:</td>
            <td>小明</td>
        </tr>
        <tr>
            <td rowspan="2">喜欢水果:</td>
            <td>苹果</td>
        </tr>
        <tr>
            <td>香蕉</td>
        </tr>
    </table>
</body>
</html>
```

![[表格合并行.png]]

所谓的合并行，其实就是将表格相邻的N个行合并。在这个例子中，rowspan="2"实际上是让加上rowspan属性的这个td标签跨越两行。




# 合并列：colspan
在HTML中，我们可以使用colspan属性来合并列。所谓的合并列，指的是将“横向的N个单元格”合并。

```html
<td colspan = "跨越的列数"></td>
```


```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>colspan属性</title>
    <style type="text/css">
        table,tr,td{border:1px solid silver;}
    </style>
</head>
<body>
    <table>
        <tr>
            <td colspan="2">前端开发技术</td>
        </tr>
        <tr>
            <td>HTML</td>
            <td>CSS</td>
        </tr>
        <tr>
            <td>JavaScript</td>
            <td>jQuery</td>
        </tr>
    </table>
</body>
</html>
```
![[表格合并列.png]]


# 总结

## 核心知识点回顾

1. ==**表格的基本组成**==
   - `<table>` - 定义表格
   - `<tr>` - 定义行
   - `<td>` - 定义单元格

2. ==**语义化结构**==
   - `<caption>` - 表格标题
   - `<thead>` - 表格头部
   - `<tbody>` - 表格主体
   - `<tfoot>` - 表格底部
   - `<th>` - 表头单元格

3. ==**单元格合并**==
   - `rowspan` - 跨行合并
   - `colspan` - 跨列合并

## 最佳实践建议

> [!tip]+ 开发建议
> 1. 使用CSS而不是HTML属性来控制表格样式
> 2. 始终使用语义化标签（如 `<th>` 替代表头的 `<td>`）
> 3. 考虑响应式设计，确保表格在移动设备上可用
> 4. 保持表格结构的简单和清晰









