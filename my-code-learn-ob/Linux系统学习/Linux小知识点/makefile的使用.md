 # Makefile的意义
makefile是将我们项目管理工具，没有makefile的话，我们的项目的关系可以会很错综复杂，而makefile则能有效管理我们的项目。
类似于在VS2019中创建项目，当我们创建项目时，我们文件的关系VS2019就可以帮我们关联好了，VS2019是一个集成开发环境，而makefile是我们在Linux系统中，实现的文件关联的工具。


# makefile的使用
在我们需要进行文件管理的路径，创建文件 `makefile`
之后我们可以在makefile这个文件中创建我们项目文件之间的关系。

如：我们需要创建 四个文件 ：`main.c`   ， `tool.c` ， `tool1.c`   ,   `tool.h`

其中 `main.c`  为主文件， 
`tool.c`,   `tool1.c`  中会打印一句话  
`tool.h`  是包含 `tool.c`  和  `tool1.c` 声明的头文件

文件结构如下：
![[Pasted image 20220504162936.png]]
makefile的书写

```linux
  1 mytool: main.o tool.o tool1.o                                                 
  2     gcc main.o tool.o tool1.o  -o mytool                                            
  3                                                                
  4 main.o:main.c                                                  
  5     gcc main.c -c -Wall -std=c99 -g -o main.o                               
  6                                                                
  7 tool.o: tool.c                                                 
  8     gcc tool.c -c -Wall -std=c99 -g -o tool.o
  9
 10 tool1.o:tool1.c                                                
 11     gcc tool1.c -c -Wall -std=c99 -g -o tool1.o                              
 12                                                                
 13                                                                
 14 .PHONY:clean                                                   
 15 clean:                                                         
 16     rm -fr *.o mytool
 ```

^a2eb42

第一行表示：文件的总依赖关系，我们要生成的==可执行文件== `mytool`  依赖于 `main.o`   `tool.o`   `tool1.o`  这三个[[gcc与g++的使用#连接（生成可执行文件或库文件）|链接]]文件

第四行表示`main.o` 文件的依赖关系 ，`main.o`  来自于 `main.c`  。 在第五行中，main.c 被 gcc编译器使用 **==-c==** 命令 ，也就是[[gcc与g++的使用#汇编（生成机器可识别代码）|汇编]]后生成的 `.o`  [[gcc与g++的使用#连接（生成可执行文件或库文件）|链接]]文件 ， 而==[[gcc与g++的使用#^0d29e4 | -Wall]]==表示显示所有警告信息，[[gdb调试#^c2a696 | -g 的作用就是将文件转化为debug]]模式，这样方便文件出错后的调试。

七到十一行 与 四到五行是一模一样的，只是换了文件名而已。

第十四行 `.PHONY`  是修饰对应的符号 `clean` ，是一个伪目标的概念，表示总是可以执行的，十五行到十六行就是 `clean` 这个符号的实现， 使用 `make clean` 后就会 删除 以`.o` 为后缀名文件与mytool这个可执行文件。

注意：使用`make`命令构建项目以后，如果依赖文件没有改动，是无法在使用`make`命令的,会提示项目已经构建过了。


这是我们的文件
![[Pasted image 20220504170651.png]]

第一次使用`make`指令后
![[Pasted image 20220504170835.png]]


第二次使用`make`指令，提示我们的版本已经是最新的，意思就是我们的源文件没有任何改动。如果源文件有改动，则又可以使用 `make`指令
![[Pasted image 20220504170931.png]]


当需要删除我们生成的这些 ==**`.o` 文件**== 或 **==可执行文件==** 时， 我们可以使用我们在`makefile`文件中写的 `clean` 指令。

被红框的文件就是我们需要删除的文件。
![[Pasted image 20220504171446.png]]

使用 `make clean`指令
![[Pasted image 20220504171653.png]]
![[Pasted image 20220504171714.png]]


## makefile文件的改善
在makefile中是有些特定的命令来给我们使用的，这些特定的指令有助于我们代码的简洁性和复用性

这是根据[[makefile的使用#^a2eb42 | 上面的makefile]]来更改的。
```linux
  1 OB = main.o tool.o tool1.o                                     
  2 CC=gcc                                                         
  3 CFLAGS+=-c -Wall -std=c99 -g                                   
  4                                                                
  5 mytool: $(OB)                                                  
  6     $(CC) $^  -o $@                                            
  7                                                                
  8 main.o:main.c                                                  
  9     $(CC) $^ $(CFLAGS) -o $@                               
 10                                                                
 11 tool.o: tool.c                                                 
 12     $(CC) $^ $(CFLAGS) -o $@
 13
 14 tool1.o:tool1.c                                                
 15     $(CC) $^ $(CFLAGS) -o $@                              
 16                                                                
 17                                                                
 18 .PHONY:clean                                                   
 19 clean:                                                         
 20     $(RM) -r *.o mytool
```

`$`后边跟变量，表示使用，如：`$(OB)` , `$(CC)` , `$^`  ,`$@`   .

第一行的 **==OB==** 是我们可以自定义的，类似 **==宏==** ， **==OB==** 此时就代表了  `main.o`   `tool.o`   `tool1.o`这个三个文件。

第二行的 ==**CC**== 代表使用 ==**gcc**== 进行编译。

第三行的 **==CFLAGS==** 表示语言编译器的参数，`+=` ==变量追加值== 也就是在之前的变量上==追加我们定义的参数==`-c -Wall -std=c99 -g` 。

在第五行，就会将==**OB**==的参数进行替换，替换为 `main.o`   `tool.o`   `tool1.o`。

第六行的 **`$^`**  ==表示所有依赖目标的集合, 会去除重复的依赖目标== ，就是将依赖项==**OB**==复制下来；**`$@`** ==表示目标集合==，就是我们要生成的目标文件，整个第六行 `$(CC) $^  -o $@` 就相当于 `gcc main.o tool.o tool1.o -o mytool` 。

第二十行的 `$(RM)` 表示 `rm -f` 

![[Pasted image 20220504180459.png]]

使用make命令运行后
![[Pasted image 20220504175038.png]]

得到的文件也是一样的
![[Pasted image 20220504175108.png]]


## makefile再改善
因为第8行到第15行的内容除了文件名不同，其他代码都是一样的， 所以可以再简化一些。
```linux
  1 OB = main.o tool.o tool1.o                                     
  2 CC=gcc                                                         
  3 CFLAGS+=-c -Wall -std=c99 -g                                   
  4                                                                
  5 mytool: $(OB)                                                  
  6     $(CC) $^  -o $@                                            
  7                                                                
  8 %.o:%.c                                                        
  9     $(CC) $^ $(CFLAGS) -o $@                                   
 10                                                                
 11 .PHONY:clean                                                   
 12 clean:                                                         
 13     $(RM) -r *.o mytool                                        
```
因为只有文件名不同，所以我们可以使用通配符 `%` 来匹配，只要依赖文件的后缀名相同，则就会使用第8行到第9行的数据进行匹配。

![[Pasted image 20220504181438.png]]

## makefile中的一些隐含规则
### 1) 自动推倒命名：

> 编译C时，`*.o` 的目标会自动推导为 `*.c`

### 2) 隐含变量

[RM] rm -f  
[AR] ar  
[CC] cc  
[CXX] g++  
[ARFLAGS] AR命令的参数  
[CFLAGS] 语言编译器的参数  
[CXXFLAGS] C++语言编译器的参数

### 3) 自动变量

> [$@] 目标集合  
> [$%] 当目标是函数库文件时, 表示其中的目标文件名  
> [$<] 第一个依赖目标. 如果依赖目标是多个, 逐个表示依赖目标  
> [$?] 比目标新的依赖目标的集合  
> [$^] 所有依赖目标的集合, 会去除重复的依赖目标  
> [$+] 所有依赖目标的集合, 不会去除重复的依赖目标  
> [$*] 这个是GNU make特有的, 其它的make不一定支持