# WebAPI 背景知识

## 什么是 WebAPI
前面学习的 JS 分成三个大的部分
- ECMAScript: 基础语法部分 
- DOM API: 操作页面结构 
- BOM API: 操作浏览器

**WebAPI** 就包含了 **DOM + BOM**.

这个是 W3C 组织规定的. (和制定 ECMAScript 标准的大佬们不是一伙人).
- 前面学的 JS 基础语法主要学的是 ECMAScript, 这让我们建立基本的编程思维. 相当于练武需要先扎马步.
- 但是真正来写一个更加复杂的有交互式的页面, 还需要 WebAPI 的支持. 相当于各种招式.

## 什么是 API
API 是一个更广义的概念. 而 WebAPI 是一个更具体的概念, 特指 **DOM+BOM** 
所谓的 API 本质上就是一些现成的函数/对象, 让程序猿拿来就用, 方便开发.
>相当于一个工具箱. 只不过程序猿用的工具箱数目繁多, 功能复杂.


## API 参考文档
https://developer.mozilla.org/zh-CN/docs/Web/API
>可以在搜索引擎中按照 "MDN + API 关键字" 的方式搜索, 也能快速找到需要的 API 文档.


# DOM 基本概念
 
## 什么是 DOM
DOM 全称为 Document Object Model.

W3C 标准给我们提供了一系列的函数, 让我们可以操作:
- 网页内容 
- 网页结构 
- 网页样式


# DOM 树
一个页面的结构是一个树形结构, 称为 DOM 树.
>树形结构在数据结构阶段会介绍. 就可以简单理解成类似于 "家谱" 这种结构

**页面结构形如**:
![[Pasted image 20221124214802.png]]

**DOM 树结构形如:**
![[Pasted image 20221124214830.png]]


重要概念:
- 文档: 一个页面就是一个  文档, 使用 document 表示. 
- 元素: 页面中所有的标签都称为  元素. 使用 element 表示.
- 节点: 网页中所有的内容都可以称为  节点(标签节点, 注释节点, 文本节点, 属性节点等). 使用 node表示.

这些文档等概念在 JS 代码中就对应一个个的对象.
>所以才叫 "文档对象模型" .


# 获取元素
这部分工作类似于 CSS 选择器的功能.

## querySelector
>这个是 HTML5 新增的, IE9 及以上版本才能使用.

前面的几种方式获取元素的时候都比较麻烦. 而使用 querySelector 能够完全复用前面学过的 CSS 选择 
器知识, 达到更快捷更精准的方式获取到元素对象.

```js
var element = document.querySelector(selectors);
```

- selectors 包含一个或多个要匹配的选择器的 DOM字符串 [DOMString](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String) 。  该字符串必须是有效的CSS选择器字符串；如果不是，则引发 `SYNTAX_ERR` 异常
- 表示文档中与指定的一组CSS选择器匹配的第一个元素的 html元素Element[Element](https://developer.mozilla.org/zh-CN/docs/Web/API/Element) 对象
- 如果您需要与指定选择器匹配的所有元素的列表，则应该使用 [querySelectorAll](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/querySelectorAll)
- 可以在任何元素上调用，不仅仅是 document。 调用这个方法的元素将作为本次查找的根元素

>正因为参数是选择器, 所以一定要通过特殊符号指定是哪种选择器. 
>例如 `.box` 是类选择器, `#star` 是 id 选择器  等.

```js
<div class="box">abc</div> 
<div id="id">def</div>
<h3><span><input type="text"></span></h3> 

<script>
    var elem1 = document.querySelector('.box'); 
    console.log(elem1);
    var elem2 = document.querySelector('#id'); 
    console.log(elem2);
    var elem3 = document.querySelector('h3 span input'); 
    console.log(elem3);
</script>
```

## querySelectorAll
使用 `querySelectorAll`的用法和 `querySelector`类似,不过是一个数组, 存放所有的我们指定的元素。
```js
<div class="box">abc</div> 
<div id="id">def</div>
<script>
    var elems = document.querySelectorAll('div'); 
	console.log(elems);
</script>
```

# 事件初识
## 基本概念
JS 要构建动态页面, 就需要感知到用户的行为.

用户对于页面的一些操作(点击, 选择, 修改等) 操作都会在浏览器中产生一个个事件, 被 JS 获取到, 从而进行更复杂的交互操作.
>浏览器就是一个哨兵, 在侦查敌情(用户行为). 一旦用户有反应(触发具体动作), 哨兵就会点燃烽火 
>台的狼烟(事件), 后方就可以根据狼烟来决定下一步的对敌策略.

## 事件三要素
1. 事件源: 哪个元素触发的
2. 事件类型: 是点击, 选中, 还是修改?
3. 事件处理程序: 进一步如何处理. 往往是一个回调函数.

## 简单示例
```js
<button id="btn">点我一下</button> 
<script>
    var btn = document.getElementById('btn'); 
    btn.onclick = function () {
        alert("hello world"); 
    }
</script>
```
- btn 按钮就是事件源. 
- 点击就是事件类型
- function 这个匿名函数就是事件处理程序
- 其中   `btn.onclick = function()` 这个操作称为  注册事件/绑定事件
注意: 这个匿名函数相当于一个回调函数, 这个函数不需要程序猿主动来调用, 而是交给浏览器, 由浏览器自动在合适的时机(触发点击操作时) 进行调用.

# 操作元素
获取/修改元素内容 
##  innerText
`Element.innerText` 属性表示一个节点及其后代的“渲染”文本内容
```js
// 读操作
var renderedText = HTMLElement.innerText; 

// 写操作
HTMLElement.innerText = string;
```
>不识别 html 标签. 是非标准的(IE发起的). 读取结果不保留html源码中的  换行  和  空格.

```js
<div>
    <span>hello world</span> 
    <span>hello world</span> 
</div>
<script>
    var div = document.querySelector('div'); 
    // 读取 div 内部内容
    console.log(div.innerText);
    // 修改 div 内部内容, 界面上就会同步修改
    div.innerText = 'hello js <span>hello js</span>'; 
</script>
```
可以看到, 通过 innerText 无法获取到 div 内部的 html 结构, 只能得到文本内容. 
修改页面的时候也会把 span 标签当成文本进行设置.


## innerHTML
`Element.innerHTML` 属性设置或获取HTML语法表示的元素的后代.
```js
// 读操作
var content = element.innerHTML; 
// 写操作
element.innerHTML = htmlString; 
```
1. 先获取到事件源的元素 
2. 注册事件
>识别 html 标签. W3C 标准的. 读取结果保留html源码中的 换行 和 空格.

```js
<div>
    <span>hello world</span> 
    <span>hello world</span> 
</div>

<script>
    var div = document.querySelector('div'); 
    // 读取页面内容
    console.log(div.innerHTML); 
    // 修改页面内容
    div.innerHTML = '<span>hello js</span>' 
</script>
```
可以看到 innerHTML 不光能获取到页面的 html 结构, 同时也能修改结构. 并且获取到的内容保留的空 
格和换行.
>innerHTML 用的场景比 innerText 更多.

# 获取/修改元素属性
可以通过 Element 对象的属性来直接修改, 就能影响到页面显示效果.
```js
<img src="rose.jpg" alt="这是一朵花" title="玫瑰花"> 
<script>
    var img = document.querySelector('img'); 
    console.dir(img);
</script>
```
此时可以看到img这个`Element`对象中有很多属性
![[Pasted image 20221124224329.png]]

我们可以在代码中直接通过这些属性来获取属性的值.
```js
<img src="rose.jpg" alt="这是一朵花" title="玫瑰花"> 
<script>
    var img = document.querySelector('img'); 
    // console.dir(img);
    console.log(img.src);
    console.log(img.title);
    console.log(img.alt); 
</script>
```
![[Pasted image 20221124224358.png]]

还可以直接修改属性
```js
<img src="rose.jpg" alt="这是一朵花" title="玫瑰花"> 
<script>
    var img = document.querySelector('img'); 
    img.onclick = function () {
        if (img.src.lastIndexOf('rose.jpg') !== -1) { 
            img.src = './rose2.png';
        } else {
            img.src = './rose.jpg'; 
        }
    }
</script>
```
>此时点击图片就可以切换图片显示状态. (需要提前把两个图片准备好)


## 获取/修改表单元素属性
表单(主要是指 input 标签)的以下属性都可以通过 DOM 来修改
- value: input 的值. 
- disabled: 禁用 
- checked: 复选框会使用 
- selected: 下拉框会使用
- type: input 的类型(文本, 密码, 按钮, 文件等) 

**代码示例:** 切换按钮的文本.
>假设这是个播放按钮, 在 "播放" - "暂停" 之间切换.
```js
<input type="button" value="播放"> 
<script>
    var btn = document.querySelector('input'); 
    btn.onclick = function () {
        if (btn.value === '播放') { 
            btn.value = '暂停'; 
        } else {
            btn.value = '播放'; 
        }
    }
</script>
```

**代码示例**: 点击计数
>使用一个输入框输入初始值(整数). 每次点击按钮, 值 + 1
```js
<input type="text" id="text" value="0">
<input type="button" id="btn" value='点我+1'> 

<script>
    var text = document.querySelector('#text'); 
    var btn = document.querySelector('#btn');
    btn.onclick = function () { 
        var num = +text.value; 
        console.log(num);
        num++;
        text.value = num; 
    }
</script>
```
- input 具有一个重要的属性 value, 这个 value 决定了表单元素的内容
- 如果是输入框, value 表示输入框的内容, 修改这个值会影响到界面显式; 在界面上修改这个值也会影响到代码中的属性
- 如果是按钮, value 表示按钮的内容. 可以通过这个来实现按钮中文本的替换


**代码示例**: 全选/取消全选按钮
![[Pasted image 20221124225406.png]]
1. 点击全选按钮, 则选中所有选项
2. 只要某个选项取消, 则自动取消全选按钮的勾选状态.

```js
<input type="checkbox" id="all">我全都要    <br> 
<input type="checkbox" class="girl">貂蝉    <br> 
<input type="checkbox" class="girl">小乔    <br> 
<input type="checkbox" class="girl">安琪拉    <br> 
<input type="checkbox" class="girl">妲己    <br>

<script>
    // 1. 获取到元素
    var all = document.querySelector('#all');
    var girls = document.querySelectorAll('.girl');
     
    // 2. 给 all 注册点击事件, 选中/取消所有选项
    all.onclick = function () {
        for (var i = 0; i < girls.length; i++) { 
            girls[i].checked = all.checked;
        } 
    }
    
    // 3. 给 girl 注册点击事件
    for (var i = 0; i < girls.length; i++) { 
        girls[i].onclick = function () {
            // 检测当前是不是所有的 girl 都被选中了. 
            all.checked = checkGirls(girls); 
        }
    }
    
    // 4. 实现 checkGirls
    function checkGirls(girls) {
        for (var i = 0; i < girls.length; i++) { 
            if (!girls[i].checked) {
                // 只要一个 girl 没被选中, 就认为结果是 false(找到了反例) 
                return false;
            } 
        }
        // 所有 girl 中都没找到反例, 结果就是全选中 
        return true;
    }
</script>
```

# 获取/修改样式属性
CSS 中指定给元素的属性, 都可以通过 JS 来修改.

## 行内样式操作
```js
element.style.[属性名] = [属性值]; 
element.style.cssText = [属性名+属性值];
```
"行内样式", 通过 style 直接在标签上指定的样式. 优先级很高. 
适用于改的样式少的情况

**代码示例**: 点击文字则放大字体.
>style 中的属性都是使用  驼峰命名  的方式和  CSS 属性对应的.
>例如: `font-size` =>`fontSize`, `background-color` => `backgroundColor`  等 
>这种方式修改只影响到特定样式, 其他内联样式的值不变.
```js
<div style="font-size: 20px; font-weight: 700;"> 
    哈哈
</div> 
<script>
    var div = document.querySelector('div'); 
    div.onclick = function () {
        var curFontSize = parseInt(this.style.fontSize); 
        curFontSize += 10;
        this.style.fontSize = curFontSize + "px"; 
    }
</script>
```

## 类名样式操作
```js
element.className = [CSS 类名];
```
修改元素的 CSS 类名. 适用于要修改的样式很多的情况.
>由于  class   是 JS 的保留字, 所以名字叫做  className

**代码示例**: 开启夜间模式
![[Pasted image 20221124230056.png]]

![[Pasted image 20221124230106.png]]

- 点击页面切换到夜间模式(背景变成黑色) 
- 再次点击恢复日间模式(背景变成白色)

```html
<div class="container light"> 
    这是一大段话. <br>
   这是一大段话. <br> 
   这是一大段话. <br> 
   这是一大段话. <br> 
</div>
```

```css
* {
    margin: 0; 
    padding: 0; 
}

html, 
body {
    width: 100%; 
    height: 100%; 
}

.container {
    width: 100%; 
    height: 100%;
}

.light {
    background-color: #f3f3f3; 
    color: #333;
}

.dark {
    background-color: #333; 
    color: #f3f3f3;
}
```

```js
var div = document.querySelector('div'); 
div.onclick = function () {
    console.log(div.className);
    if (div.className.indexOf('light') != -1) {  //indexOF方法返回-1表示找不到
        div.className = 'container dark';
    } else {
        div.className = 'container light'; 
    }
}
```


# 操作节点
 
## 新增节点
分成两个步骤
1. 创建元素节点
2. 把元素节点插入到 dom 树中.
>第一步相当于生了个娃, 第二步相当于给娃上户口.
 
### 创建元素节点
使用 createElement 方法来创建一个元素. options 参数暂不关注.