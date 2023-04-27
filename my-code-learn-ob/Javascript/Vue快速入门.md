# 第一个Vue程序

```vue
<body id="body">
  {{ message }}
  <h2 id="app" class="app">
    {{ message }}
    <span> {{ message }} </span>
  </h2>
  <!-- 开发环境版本，包含了有帮助的命令行警告 -->
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  <script>
    var app = new Vue({
      // el:"#app",
      // el:".app",
      // el:"div",
      el:"#body", //el挂载点 
      data:{   //数据对象
        message:"emm"
      }
    })
  </script>
</body>
```

## vue的在线环境导入

```vue
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
```

## el:挂载点

-   el是用来设置Vue实例挂载（管理)的元素
-   Vue会管理el选项**命中的元素**及其内部的**后代元素**
-   可以使用其他的选择器,但是建议使用**ID选择器**
-   可以使用其他的双标签,不能使用**HTML**和**BODY**

## data:数据对象

-   Vue中用到的数据定义在**data**中
-   data中可以写**复杂类型**的数据
-   渲染复杂类型数据时,遵守js的**语法**即可

# Vue 本地应用

主要学习以下六个指令

-   `v-text`
-   `v-html`
-   `v-on`
-   `v-show`
-   `v-if`
-   `v-bind`
-   `v-for`
-   `v-model`

## 内容绑定,事件绑定

### v-text

设置标签的文本值(textContent)

```html
<div id="app">
      <h2 v-text="message+’!’"></h2>
      <h2>深圳{{ message + "! "}}</h2>
</div>
```

```js
var app = new Vue({
    el:"#app",
    data:{
        message:"哇哈哈哈哈"
    }
})
```

#### 案例

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>v-text指令</title>
</head>

<body>
    <div id="app">
        <h2 v-text="message+'!'">深圳</h2>
        <h2 v-text="info+'!'">深圳</h2>
        <h2>{{ message +'!'}}深圳</h2>
    </div>
    <!-- 开发环境版本，包含了有帮助的命令行警告 -->
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <script>
        var app = new Vue({
            el:"#app",
            data:{
                message:"哇哈哈哈哈!!!",
                info:"好几拳"
            }
        })
    </script>
</body>

</html>
```

效果:  
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230426225642.png)


-   v-text指令的作用是:设置标签的内容(textContent)
-   默认写法会替换全部内容,使用**差值表达式**`{{}}`可以替换指定内容
-   内部支持写**表达式**

### v-html

-   v-html指令的作用是:设置元素的**innerHTML**.
-   内容中有html结构会被解析为标签
-   **v-text**指令无论内容是什么,只会解析为**文本**
-   **解析文本使用v-text,需要解析html结构使用v-html**

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>v-html指令</title>
</head>

<body>
    <div id="app">
        <p v-html="content"></p>
    </div>
    <!-- 开发环境版本，包含了有帮助的命令行警告 -->
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <script>
        var app = new Vue({
            el: "#app",
            data: {
                content: "<a href='https://baidu.com'>百度一下</a>"
            }
        })
    </script>
</body>

</html>
```

### v-on

为元素绑定事件

-   v-on指令的作用是:为元素绑定**事件**
-   事件名不需要写**on**
-   指令可以简写为 **@**
-   绑定的方法定义在**methods属性**中
-   方法内部通过`this`关键字可以访问定义在**data**中数据

```html
 <div id="app">
      <input type="button" value="事件绑定" v-on:click=“doIt">
      <input type="button" value="事件绑定" v-on:monseenter=“doIt">
      <input type="button" value="事件绑定" v-on:dblclick=“doIt">
      <input type="button" value="事件绑定" @dblclick=“doIt">
 </div>
```

```js
 var app = new Vue({
    el:"#app",
    methods:{ // 方法属性
      doIt:function(){
        // 逻辑
      }
    }
})
```

#### 案例

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>v-on补充</title>
</head>

<body>
    <div id="app">
        <input type="button" value="点击" @click="doIt(666,'老铁')">
        <input type="text" @keyup.enter="sayHi">  
    </div>
    <!-- 1.开发环境版本，包含了有帮助的命令行警告 -->
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <script>
        var app = new Vue({
            el:"#app",
            methods: {
                doIt:function(p1,p2){
                    console.log("做it");
                    console.log(p1);
                    console.log(p2);
                },
                sayHi:function(){
                    alert("吃了没");
                }
            },
        })
    </script>
</body>

</html>
```

效果  
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230426225657.png)


## 显示切换,属性绑定

### v-show

根据表达值的真假,切换元素的显示和隐藏

-   `v-show`指令的作用是:根据真假切换元素的显示状态
-   原理是**修改元素的display**,实现显示隐藏
-   指令后面的内容,最终都会解析为**布尔值**
-   值为**true**元素显示,值为**false**元素隐藏
-   数据改变之后,对应元素的显示状态会同步更新

#### 案例:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>v-show指令</title>
  </head>
  <body>
    <div id="app">
      <input type="button" value="切换显示状态" @click="changeIsShow">
      <input type="button" value="累加年龄" @click="addAge">
      <img v-show="isShow" src="./img/monkey.gif" alt="">
      <img v-show="age>=18" src="./img/monkey.gif" alt="">
    </div>
    <!-- 1.开发环境版本，包含了有帮助的命令行警告 -->
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <script>
      const app = new Vue({
        el:"#app",
        data:{
          isShow:false,
          age:17
        },
        methods: {
          changeIsShow:function(){
            this.isShow = !this.isShow;
          },
          addAge:function(){
            this.age++;
          }
        },
      })
    </script>
  </body>
</html>

```

### v-if

根据表达值的真假,切换元素的显示和隐藏

-   v-if指令的作用是:根据表达式的真假切换元素的显示状态
-   本质是通过操纵**dom**元素来切换显示状态
-   表达式的值为**true**,元素存在于dom树中,为**false**,从dom树中移除
-   **频繁的切换使用v-show,反之使用v-if,前者的切换消耗小**

#### 案例

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>v-if指令</title>
</head>

<body>
    <div id="app">
        <input type="button" value="切换显示" @click="toggleIsShow">
        <p v-if="isShow">emmm</p>
        <p v-show="isShow">emmm - v-show修饰</p>
        <h2 v-if="temperature>=35">热死啦</h2>
    </div>
    <!-- 开发环境版本，包含了有帮助的命令行警告 -->
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <script>
        var app = new Vue({
            el: "#app",
            data: {
                isShow: false,
                temperature: 65
            },
            methods: {
                toggleIsShow: function () {
                    this.isShow = !this.isShow;
                }
            },
        })
    </script>
</body>

</html>
```

显示时  
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230426225808.png)


隐藏时:  
v-if的会直接删除dom元素,使用v-show就只会将display设置为none.  
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230426225820.png)


### v-bind

设置元素的属性

-   v-bind指令的作用是:为元素绑定属性
-   完整写法是v-bind:属性名
-   简写的话可以直接省略v-bind,只保留 `:属性名`
-   需要动态的增删class建议使用对象的方式

#### 案例

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>v-bind指令</title>
    <style>
        .active{
            border: 1px solid red;
        }
    </style>
</head>

<body>
    <div id="app">
        <img v-bind:src="imgSrc" alt="">
        <br>
        <img :src="imgSrc" alt="" :title="imgTitle+'!!!'" :class="isActive?'active':''" @click="toggleActive">
        <br>
        <img :src="imgSrc" alt="" :title="imgTitle+'!!!'" :class="{active:isActive}" @click="toggleActive">
    </div>
    <!-- 开发环境版本，包含了有帮助的命令行警告 -->
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <script>
        var app = new Vue({
            el:"#app",
            data:{
                imgSrc:"http://www.itheima.com/images/logo.png",
                imgTitle:"黑马程序员",
                isActive:false
            },
            methods: {
                toggleActive:function(){
                    this.isActive = !this.isActive;
                }
            },
        })
    </script>
</body>

</html>
```

## 列表循环,表单元素绑定

### v-for

根据数据生成列表结构

-   v-for指令的作用是:根据数据生成列表结构
-   数组经常和v-for结合使用
-   语法是 **( item,index ) in数据**
-   item和index可以结合其他指令一起使用
-   数组长度的更新会同步到页面上,是响应式的

#### 案例

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>v-for指令</title>
</head>

<body>
    <div id="app">
        <input type="button" value="添加数据" @click="add">
        <input type="button" value="移除数据" @click="remove">

        <ul>
            <li v-for="(it,index) in arr">
                {{ index+1 }}黑马程序员校区:{{ it }}
            </li>
        </ul>
        <h2 v-for="item in vegetables" v-bind:title="item.name">
            {{ item.name }}
        </h2>
    </div>
    <!-- 1.开发环境版本，包含了有帮助的命令行警告 -->
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <script>
        var app = new Vue({
            el:"#app",
            data:{
                arr:["北京","上海","广州","深圳"],
                vegetables:[
                    {name:"西兰花炒蛋"},
                    {name:"蛋炒西蓝花"}
                ]
            },
            methods: {
                add:function(){
                    this.vegetables.push({ name:"花菜炒蛋" });
                },
                remove:function(){
                    this.vegetables.shift();
                }
            },
        })
    </script>
</body>

</html>
```

### v-on 补充

传递自定义参数,事件修饰符

-   事件绑定的方法写成函数调用的形式，可以传入自定义参数
-   定义方法时需要定义形参来接收传入的实参
-   事件的后面跟上.修饰符可以对事件进行限制
-   `.enter`可以限制触发的按键为回车
-   事件修饰符有多种

#### 案例

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>v-on补充</title>
</head>

<body>
    <div id="app">
        <input type="button" value="点击" @click="doIt(666,'老铁')">

        <!--使用键盘输入回车调用-->
        <input type="text" @keyup.enter="sayHi">
    </div>
    <!-- 1.开发环境版本，包含了有帮助的命令行警告 -->
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <script>
        var app = new Vue({
            el: "#app",
            methods: {
                doIt: function (p1, p2) {
                    console.log("做it");
                    console.log(p1);
                    console.log(p2);
                },
                sayHi: function () {
                    alert("吃了没");
                }
            },
        })
    </script>
</body>

</html>
```

### v-model

获取和设置表单元素的值(**双向数据绑定**)

-   v-model指令的作用是便捷的设置和获取表单元素的值
-   绑定的数据会和表单元素**值**相关联
-   绑定的数据`←→`表单元素的值

#### 案例

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>v-model指令</title>
</head>

<body>
    <div id="app">
        <input type="button" value="修改message" @click="setM">
        <input type="text" v-model="message" @keyup.enter="getM">
        <h2>{{ message }}</h2>
    </div>
    <!-- 开发环境版本，包含了有帮助的命令行警告 -->
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <script>
        var app = new Vue({
            el:"#app",
            data:{
                message:"黑马程序员"
            },
            methods: {
                getM:function(){
                    alert(this.message);
                },
                setM:function(){
                    this.message ="酷丁鱼";
                }
            },
        })
    </script>
</body>

</html>
```