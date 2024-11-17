---
Type: Note
tags:
  - 前端
  - 基础
  - JS
Status: writing
Start-date: 2024-11-17 18:26
Finish-date: 2024-11-17
Modified-date: 2024-11-17 18:35
Publish: false
---

## JavaScript与Java有什么关系？

说到JavaScript，很多小伙伴可能会想："这不就是Java的'脚本版'吗？" 
实际上，==JavaScript和Java的关系，就像雷锋和雷峰塔一样==，除了名字有点像以外，它们是完全不同的两种编程语言！

JavaScript是由**网景公司**开发的一种脚本语言，最初的名字叫 LiveScript。为了蹭当时非常火热的 Java 的热度，就改名叫了 JavaScript。

> [!tip] 小贴士
> JavaScript 的正式名称其实是 ECMAScript，简称 ES。现在最新的版本是 ES6+。

## JavaScript引入方式

在HTML中，我们有三种方式来引入JavaScript代码：

### 1. 外部JavaScript

最推荐的方式是将JS代码写在单独的.js文件中，然后通过`<script>`标签引入：

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>外部JavaScript</title>
    <!-- 使用src属性引入外部js文件 -->
    <script src="my-script.js"></script>
</head>
<body>
</body>
</html>
```

### 2. 内部JavaScript

直接在HTML文件中使用`<script>`标签编写JS代码：

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>内部JavaScript</title>
    <script>
        // 这里写JavaScript代码
        alert("你好，JavaScript！");
    </script>
</head>
<body>
</body>
</html>
```

### 3. 行内JavaScript

在HTML标签中直接编写JS代码（==不推荐使用==）：

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>行内JavaScript</title>
</head>
<body>
    <!-- 使用onclick等事件属性直接编写JS代码 -->
    <button onclick="alert('按钮被点击了！')">点我试试</button>
</body>
</html>
```

## 一个简单的JavaScript程序

让我们来写一个简单的程序，体验一下JavaScript的魅力：

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>我的第一个JavaScript程序</title>
    <script>
        // 当页面加载完成后执行
        window.onload = function() {
            // 获取按钮元素
            let btn = document.getElementById("changeBtn");
            // 获取文本元素
            let text = document.getElementById("displayText");
            
            // 为按钮添加点击事件
            btn.onclick = function() {
                // 修改文本内容
                text.innerHTML = "JavaScript真有趣！";
                // 修改文本颜色
                text.style.color = "red";
            }
        }
    </script>
</head>
<body>
    <h1 id="displayText">你好，这是一个示例文本</h1>
    <button id="changeBtn">点击我改变文字</button>
</body>
</html>
```

**代码解析：**
1. 我们在页面中放置了一个标题文本和一个按钮
2. 通过`window.onload`确保在页面加载完成后才执行JS代码
3. 使用`document.getElementById()`获取页面元素
4. 为按钮添加点击事件，当点击时修改文本内容和样式

> [!note] 运行效果
> 当你点击按钮时，上方的文本会变成红色，并显示"JavaScript真有趣！"

> [!tip] 小贴士
> - ==JavaScript代码是从上到下顺序执行的==
> - **推荐将`<script>`标签放在`</body>`之前**，这样可以确保HTML元素都加载完成
> - 现代开发中，建议使用外部JavaScript文件，这样可以提高代码的可维护性和复用性