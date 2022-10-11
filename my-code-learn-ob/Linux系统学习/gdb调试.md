# 注意事项：
>程序的发布方式有两种，`debug`模式和 `release` 模式
>
==Linux gcc/g++==出来的二进制程序，**默认是 `release` 模式**
>
==**要使用gdb调试，必须在源代码生成二进制程序的时候, 加上` -g`  选项**==

记住要使用gdb调试，必须在源代码生成二进制程序的时候, 加上` -g`  选项
![[Pasted image 20220503184437.png]] ^c2a696



# gdb中的常用调试命令
退出gdb可以使用 `ctrl+d` 或 `quit`
>`list／l 行号`：显示binFile源代码，接着上次的位置往下列，每次列10行。
>
`list／l 函数名`：列出某个函数的源代码。
>
`r或run`：运行程序。
>
`n 或 next`：单条执行。
>
`s或step`：进入函数调用
>
`break(b) 行号`：在某一行设置断点
>
`break 函数名`：在某个函数开头设置断点
>
`info break `：查看断点信息。
>
`fifinish`：执行到当前函数返回，然后挺下来等待命令
>
`print(p)`：打印表达式的值，通过表达式可以修改变量的值或者调用函数
>
`p 变量`：打印变量值。
>
`set var`：修改变量的值
>
`continue(或c)`：从当前位置开始连续而非单步执行程序
>
`run(或r)`：从开始连续而非单步执行程序
>
`delete breakpoints`：删除所有断点
>
`delete breakpoints n`：删除序号为n的断点
>
`disable breakpoints`：禁用断点
>
`enable breakpoints`：启用断点
>
`info(或i) breakpoints`：参看当前设置了哪些断点
>
`display 变量名`：跟踪查看一个变量，每次停下来都显示它的值
>
`undisplay`：取消对先前设置的那些变量的跟踪
>
`until X行号`：跳至X行
>
`breaktrace(或bt)`：查看各级函数调用及参数
>
`info（i) locals`：查看当前栈帧局部变量的值
>
`quit`：退出gdb