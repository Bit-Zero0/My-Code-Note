# C语言的输入与输出
语言中我们用到的最频繁的输入输出方式就是`scanf()`与`printf()`。
**`scanf()`:从标准输入设备（键盘）读取数据，并将值存放在变量中。**
**`printf()`:将指定的文字/字符串输出到标准输出设备（屏幕）。**
注意宽度输出和精度输出控制。C语言借助了相应的缓冲区来进行输入与输出。如下图所示
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230408225639.png)


对==**输入输出缓冲区**==的理解：
1.可以**屏蔽掉低级I/O**的实现，低级I/O的实现依赖操作系统本身内核的实现，所以如果能够屏蔽这部分的差异，可以**很容易写出可移植的程序**。
2.可以**使用这部分的内容实现“行”读取的行为**，对于计算机而言是没有“行”这个概念，有了这部分，就可以定义“行”的概念，然后解析缓冲区的内容，返回一个“行”。


# C++IO流
C++系统实现了一个庞大的类库，其中ios为基类，其他类都是直接或间接派生自ios类
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230408225739.png)

## C++标准IO流
C++标准库提供了4个全局流对象cin、cout、cerr、clog，使用**cout进行标准输出，即数据从内存流向控制台(显示器)**。使用**cin进行标准输入即数据通过键盘输入到程序中**，同时C++标准库还提供了**cerr用来进行标准错误的输出**，以及**clog进行日志的输出**，从上图可以看出，cout、cerr、clog是ostream类的三个不同的对象，因此这三个对象现在基本没有区别，只是应用场景不同。
在使用时候必须要包含文件并引入std标准命名空间。

**注意：**
>1.	cin为缓冲流。**键盘输入的数据保存在缓冲区中，当要提取时，是从缓冲区中拿**。如果一次输入过多，会留在那儿慢慢用，**如果输入错了，必须在回车之前修改，如果回车键按下就无法挽回了。只有把输入缓冲区中的数据取完后，才要求输入新的数据**。
>2.	**输入的数据类型必须与要提取的数据类型一致**，否则出错。出错只是在流的状态字state中对应位置位（置1），程序继续。
>3.	空格和回车都可以作为数据之间的分格符，所以多个数据可以在一行输入，也可以分行输入。**但如果是字符型和字符串，则空格（ASCII码为32）无法用cin输入，字符串中也不能有空格**。回车符也无法读入。
>4.	cin和cout可以直接输入和输出内置类型数据，原因：**标准库已经将所有内置类型的输入和输出全部重载了**:
>![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230408230026.png)
>![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230408230032.png)
>5. 对于自定义类型，如果要支持cin和cout的标准输入输出，需要对`<<`和`>>`进行重载。

## C++文件IO流
C++根据文件内容的数据格式分为**二进制文件**和**文本文件**。采用文件流对象操作文件的一般步骤：
1. 定义一个文件流对象
	- ifstream ifile(只输入用)
	- ofstream ofile(只输出用)
	- fstream iofile(既输入又输出用)
1. 使用文件流对象的成员函数打开一个磁盘文件，使得文件流对象和磁盘文件之间建立联系
2. 使用提取和插入运算符对文件进行读写操作，或使用成员函数进行读写
3. 关闭文件



# 写入文本文件

文本文件一般以行的形式组织数据。

**包含头文件：**`#include <fstream>`

**类** ofstream（output file stream）

**`ofstream`** **打开文件的模式（方式）：**

对于ofstream，不管用哪种模式打开文件，如果文件不存在，都会创建文件。

|ios::out |            缺省值：会截断文件内容。|
|:-:|:-:|
|ios::trunc |         截断文件内容。（truncate）|
|ios::app |       不截断文件内容，只在文件未尾追加文件。（append）|

## 示例
```cpp
#include <iostream>
#include <fstream>  // ofstream类需要包含的头文件。
using  namespace std;

int main()
{
	// 文件名一般用全路径，书写的方法如下：
	//  1）"D:\data\txt\test.txt"       // 错误。
	//  2）R"(D:\data\txt\test.txt)"   // 原始字面量，C++11标准。
	//  3）"D:\\data\\txt\\test.txt"   // 转义字符。
	//  4）"D:/tata/txt/test.txt"        // 把斜线反着写。
	//  5）"/data/txt/test.txt"          //  Linux系统采用的方法。
	string filename = R"(D:\data\txt\test.txt)";
	//char    filename[] = R"(D:\data\txt\test.txt)";

	// 创建文件输出流对象，打开文件，如果文件不存在，则创建它。
	// ios::out     		缺省值：会截断文件内容。
	// ios::trunc  		截断文件内容。（truncate）
	// ios::app   			不截断文件内容，只在文件未尾追加文件。（append）
	//ofstream fout(filename);
	//ofstream fout(filename, ios::out);
	//ofstream fout(filename, ios::trunc);
	//ofstream fout(filename, ios::app);
	
	ofstream fout;
	fout.open(filename,ios::app);

	// 判断打开文件是否成功。
	// 失败的原因主要有：1）目录不存在；2）磁盘空间已满；3）没有权限，Linux平台下很常见。
	if (fout.is_open() == false)
	{
		cout << "打开文件" << filename << "失败。\n";  return 0;
	}

	// 向文件中写入数据。
	fout << "西施|19|极漂亮\n";
	fout << "冰冰|22|漂亮\n";
	fout << "幂幂|25|一般\n";

	fout.close();	   // 关闭文件，fout对象失效前会自动调用close()。

	cout << "操作文件完成。\n";
}

```


# 读取文本文件

包含头文件：`#include <fstream>`

类：ifstream

**`ifstream`**  **打开文件的模式（方式）：**

对于ifstream，如果文件不存在，则打开文件失败。

|ios::in|       缺省值。|
|:-:|:-:|

## 示例：
```cpp
#include <iostream>
#include <fstream>  // ifstream类需要包含的头文件。
#include <string>     // getline()函数需要包含的头文件。
using  namespace std;

int main()
{
	// 文件名一般用全路径，书写的方法如下：
	//  1）"D:\data\txt\test.txt"       // 错误。
	//  2）R"(D:\data\txt\test.txt)"   // 原始字面量，C++11标准。
	//  3）"D:\\data\\txt\\test.txt"   // 转义字符。
	//  4）"D:/tata/txt/test.txt"        // 把斜线反着写。
	//  5）"/data/txt/test.txt"          //  Linux系统采用的方法。
	string filename = R"(D:\data\txt\test.txt)";
	//char    filename[] = R"(D:\data\txt\test.txt)";

	// 创建文件输入流对象，打开文件，如果文件不存在，则打开文件失败。。
	// ios::in     			缺省值。
	//ifstream fin(filename);
	//ifstream fin(filename, ios::in);
	
	ifstream fin;
	fin.open(filename,ios::in);

	// 判断打开文件是否成功。
	// 失败的原因主要有：1）目录不存在；2）文件不存在；3）没有权限，Linux平台下很常见。
	if (fin.is_open() == false)
	{
		cout << "打开文件" << filename << "失败。\n";  return 0;
	}

	//// 第一种方法。
	//string buffer;  // 用于存放从文件中读取的内容。
	//// 文本文件一般以行的方式组织数据。
	//while (getline(fin, buffer))
	//{
	//	cout << buffer << endl;
	//}

	//// 第二种方法。
	//char buffer[16];   // 存放从文件中读取的内容。
	//// 注意：如果采用ifstream.getline()，一定要保证缓冲区足够大。
	//while (fin.getline(buffer, 15))
	//{
	//	cout << buffer << endl;
	//}

	// 第三种方法。
	string buffer;
	while (fin >> buffer)
	{
		cout << buffer << endl;
	}

	fin.close();	   // 关闭文件，fin对象失效前会自动调用close()。

	cout << "操作文件完成。\n";
}

```


# 写入二进制文件
二进制文件以数据块的形式组织数据，把内存中的数据直接写入文件。

包含头文件：`#include <fstream>`

类：`ofstream(output file stream)`

ofstream打开文件的模式（方式）：
对于ofstream，不管用哪种模式打开文件，如果文件不存在，都会创建文件。
|ios::out|     		缺省值：会截断文件内容。|
|:-:|:-:|
|ios::trunc|  		截断文件内容。（truncate）|
|ios::app|   		不截断文件内容，只在文件未尾追加文件。（append）|
|ios::binary|   	以二进制方式打开文件。|

操作文本文件和二进制文件的一些细节：
>1）在windows平台下，文本文件的换行标志是"`\r\n`"。
>2）在linux平台下，文本文件的换行标志是"`\n`"。
>3）在windows平台下，如果以文本方式打开文件，写入数据的时候，系统会将"`\n`"转换成"`\r\n`"；读取数据的时候，系统会将"`\r\n`"转换成"`\n`"。 如果以二进制方式打开文件，写和读都不会进行转换。
>4）在Linux平台下，以文本或二进制方式打开文件，系统不会做任何转换。
>5）以文本方式读取文件的时候，遇到换行符停止，读入的内容中没有换行符；以二制方式读取文件的时候，遇到换行符不会停止，读入的内容中会包含换行符（换行符被视为数据）。
>6）在实际开发中，从兼容和语义考虑，一般：
>	- a）以文本模式打开文本文件，用行的方法操作它；
>	- b）以二进制模式打开二进制文件，用数据块的方法操作它；
>	- c）以二进制模式打开文本文件和二进制文件，用数据块的方法操作它，这种情况表示不关心数据的内容。（例如复制文件和传输文件）
>	- d）不要以文本模式打开二进制文件，也不要用行的方法操作二进制文件，可能会破坏二进制数据文件的格式，也没有必要。（因为二进制文件中的某字节的取值可能是换行符，但它的意义并不是换行，可能是整数n个字节中的某个字节）


## 示例：
```cpp
#include <iostream>
#include <fstream>  // ofstream类需要包含的头文件。
using  namespace std;

int main()
{
	// 文件名一般用全路径，书写的方法如下：
	//  1）"D:\data\bin\test.dat"       // 错误。
	//  2）R"(D:\data\bin\test.dat)"   // 原始字面量，C++11标准。
	//  3）"D:\\data\\bin\\test.dat"   // 转义字符。
	//  4）"D:/tata/bin/test.dat"        // 把斜线反着写。
	//  5）"/data/bin/test.dat"          //  Linux系统采用的方法。
	string filename = R"(D:\data\bin\test.dat)";
	//char    filename[] = R"(D:\data\bin\test.dat)";

	// 创建文件输出流对象，打开文件，如果文件不存在，则创建它。
	// ios::out     		缺省值：会截断文件内容。
	// ios::trunc  		截断文件内容。（truncate）
	// ios::app   			不截断文件内容，只在文件未尾追加文件。（append）
	// ios::binary   		以二进制方式打开文件。
	//ofstream fout(filename, ios::binary);
	//ofstream fout(filename, ios::out | ios::binary);
	//ofstream fout(filename, ios::trunc | ios::binary);
	//ofstream fout(filename, ios::app | ios::binary);

	ofstream fout;
	fout.open(filename, ios::app | ios::binary);

	// 判断打开文件是否成功。
	// 失败的原因主要有：1）目录不存在；2）磁盘空间已满；3）没有权限，Linux平台下很常见。
	if (fout.is_open() == false)
	{
		cout << "打开文件" << filename << "失败。\n";  return 0;
	}

	// 向文件中写入数据。
	struct st_girl {               // 超女结构体。
		char name[31];         // 姓名。
		int    no;                    // 编号。   
		char memo[301];      // 备注。
		double weight;         // 体重。
	}girl;
	girl = { "西施",3,"中国历史第一美女。" ,45.8 };
	fout.write((const char *)& girl, sizeof(st_girl));   // 写入第一块数据。
	girl = { "冰冰",8,"也是个大美女哦。",55.2};
	fout.write((const char*)&girl, sizeof(st_girl));     // 写入第二块数据。

	fout.close();	   // 关闭文件，fout对象失效前会自动调用close()。

	cout << "操作文件完成。\n";
}

```


# 读取二进制文件
包含头文件：`#include <fstream>`

类：`ifstream`

**ifstream****打开文件的模式（方式）：**

对于ifstream，如果文件不存在，则打开文件失败。

|ios::in|                缺省值。|
|:-:|:-:|
|ios::binary|        以二进制方式打开文件。|

## 示例：
```cpp
#include <iostream>
#include <fstream>  // ifstream类需要包含的头文件。
using  namespace std;

int main()
{
	// 文件名一般用全路径，书写的方法如下：
	//  1）"D:\data\bin\test.dat"       // 错误。
	//  2）R"(D:\data\bin\test.dat)"   // 原始字面量，C++11标准。
	//  3）"D:\\data\\bin\\test.dat"   // 转义字符。
	//  4）"D:/tata/bin/test.dat"        // 把斜线反着写。
	//  5）"/data/bin/test.dat"          //  Linux系统采用的方法。
	string filename = R"(D:\data\bin\test.dat)";
	//char    filename[] = R"(D:\data\bin\test.dat)";

	// 创建文件输入流对象，打开文件，如果文件不存在，则打开文件失败。。
	// ios::in     			缺省值。
	// ios::binary   		以二进制方式打开文件。
	//ifstream fin(filename , ios::binary);
	//ifstream fin(filename , ios::in | ios::binary);

	ifstream fin;
	fin.open(filename, ios::in | ios::binary);

	// 判断打开文件是否成功。
	// 失败的原因主要有：1）目录不存在；2）文件不存在；3）没有权限，Linux平台下很常见。
	if (fin.is_open() == false)
	{
		cout << "打开文件" << filename << "失败。\n";  return 0;
	}

	// 二进制文件以数据块（数据类型）的形式组织数据。
	struct st_girl {               // 超女结构体。
		char name[31];         // 姓名。
		int    no;                    // 编号。   
		char memo[301];      // 备注。
		double weight;         // 体重。
	}girl;
	while (fin.read((char*)&girl, sizeof(girl)))
	{
		cout << "name=" << girl.name << "，no=" << girl.no << 
			"，memo=" << girl.memo << "，weight=" << girl.weight << endl;
	}

	fin.close();	   // 关闭文件，fin对象失效前会自动调用close()。

	cout << "操作文件完成。\n";
}

```

# 随机存取
## fstream类
fstream类既可以读文本/二进制文件，也可以写文本/二进制文件。

fstream类的缺省模式是`ios::in | ios::out`，如果文件不存在，则创建文件；**但是，不会清空文件原有的内容。**

普遍的做法是：
>1）如果只想写入数据，用`ofstream`；如果只想读取数据，用`ifstream`；如果想写和读数据，用fstream，这种情况不多见。不同的类体现不同的语义。
>2）在Linux平台下，文件的写和读有严格的权限控制。（需要的权限越少越好）



## 二、文件的位置指针

对文件进行读/写操作时，文件的位置指针指向当前文件读/写的位置。

很多资料用“文件读指针的位置”和“文件写指针的位置”，容易误导人。不管用哪个类操作文件，文件的位置指针只有一个。

### 1）获取文件位置指针
**ofstream**类的成员函数是`tellp()`；**ifstream**类的成员函数是`tellg()`；**fstream类两个都有**，效果相同。

```cpp
std::streampos tellp();
std::streampos tellg();
```

### 2）移动文件位置指针
**ofstream类**的函数是`seekp()`；**ifstream类**的函数是`seekg()`；**fstream类两个都有**，效果相同。

方法一：
```cpp
std::istream & seekg(std::streampos _Pos); 
fin.seekg(128);   // 把文件指针移到第128字节。
fin.seekp(128);   // 把文件指针移到第128字节。
fin.seekg(ios::beg) // 把文件指针移动文件的开始。
fin.seekp(ios::end) // 把文件指针移动文件的结尾。
```

方法二：
`std::istream & seekg(std::streamoff _Off,std::ios::seekdir _Way);`

在ios中定义的枚举类型：
```cpp
enum seek_dir {beg, cur, end};  // beg-文件的起始位置；cur-文件的当前位置；end-文件的结尾位置。
fin.seekg(30, ios::beg);    // 从文件开始的位置往后移30字节。
fin.seekg(-5, ios::cur);     // 从当前位置往前移5字节。
fin.seekg( 8, ios::cur);     // 从当前位置往后移8字节。
fin.seekg(-10, ios::end);   // 从文件结尾的位置往前移10字节。
```


## 随机存取
随机存取是指直接移动文件的位置指针，在指定位置读取/写入数据。

### 示例：
```cpp
#include <iostream>
#include <fstream>  // fstream类需要包含的头文件。
using  namespace std;

int main()
{
	string filename = R"(D:\data\txt\test.txt)";
	
	fstream fs;
	fs.open(filename, ios::in | ios::out);

	if (fs.is_open() == false)
	{
		cout << "打开文件" << filename << "失败。\n";  return 0;
	}
	
	fs.seekg(26);    // 把文件位置指针移动到第26字节处。

	fs << "我是一只傻傻的小菜鸟。\n"; 

	/*string buffer; 
	while (fs >> buffer)
	{
		cout << buffer << endl;
	}*/

	fs.close();	   // 关闭文件，fs对象失效前会自动调用close()。

	cout << "操作文件完成。\n";
}

```

## 打开文件的模式（方式）
一、写文件
如果文件不存在，各种模式都会创建文件。
|ios::out|             1）会截断文件；2）可以用seekp()移动文件指针。|
|:-:|:-:|
|ios:trunc   |        1）会截断文件；2）可以用seekp()移动文件指针。|
|ios::app    |        1）不会截断文件；2）文件指针始终在文件未尾，不能用seekp()移动文件指针。|
|ios::ate      |       打开文件时文件指针指向文件末尾，但是，可以在文件中的任何地方写数据。|
|ios::in         |       打开文件进行读操作，即读取文件中的数据。|
|ios::binary   |     打开文件为二进制文件，否则为文本文件。|

注：ate是at end的缩写，trunc是truncate（截断）的缩写，app是append（追加）的缩写。



# 缓冲区及流状态
## 一、文件缓冲区
文件缓冲区（缓存）是系统预留的内存空间，用于存放输入或输出的数据。

根据输出和输入流，分为输出缓冲区和输入缓冲区。

注意，在C++中，每打开一个文件，系统就会为它分配缓冲区。不同的流，缓冲区是独立的。

程序员不用关心输入缓冲区，只关心输出缓冲区就行了。
在缺省模式下，输出缓冲区中的数据满了才把数据写入磁盘，但是，这种模式不一定能满足业务的需求。

### 输出缓冲区的操作：
#### 1）`flush()`成员函数
刷新缓冲区，把缓冲区中的内容写入磁盘文件。

#### 2）`endl`
换行，然后刷新缓冲区。

#### 3）`unitbuf`
`fout << unitbuf;`
设置fout输出流，在每次操作之后自动刷新缓冲区。

#### 4）`nounitbuf`
`fout << nounitbuf;`
设置fout输出流，让fout回到缺省的缓冲方式。

## 二、流状态
**流状态有三个：`eofbit`、`badbit`和`failbit`，取值：==1==---设置；或==0==---清除。**

**当三个流状成都为0时，表示一切顺利，`good()`成员函数返回true。**

### 1）eofbit
当输入流操作到达文件未尾时，将设置eofbit。
`eof()`成员函数检查流是否设置了eofbit。

### 2）badbit
无法诊断的失败破坏流时，将设置badbit。（例如：对输入流进行写入；磁盘没有剩余空间）。
`bad()`成员函数检查流是否设置了badbit。

### 3）failbit
当输入流操作未能读取预期的字符时，将设置failbit（非致命错误，可挽回，一般是软件错误，例如：想读取一个整数，但内容是一个字符串；文件到了未尾）I/O失败也可能设置failbit。
`fail()`成员函数检查流是否设置了failbit。

### 4）clear()成员函数清理流状态。

### 5）setstate()成员函数重置流状态。

### 示例一
```cpp
#include <iostream>
#include <fstream>          // ofstream类需要包含的头文件。
#include <unistd.h>
using  namespace std;

int main()
{
  ofstream fout("/oracle/tmp/bbb.txt");   // 打开文件。
  fout << unitbuf; //设置fout输出流，在每次操作之后自动刷新缓冲区。

  for (int ii = 0; ii < 1000; ii++)  // 循环1000次。
  {
    fout << "ii=" << ii << "，我是一只傻傻傻傻傻傻傻傻傻傻傻傻傻傻的鸟。\n";
    //fout.flush();      // 刷新缓冲区。
    usleep(100000);    // 睡眠十分之一秒。
  }

  fout.close();  // 关闭文件。
}

```



### 示例二
```cpp
#include <iostream>
#include <fstream>  // ifstream类需要包含的头文件。
#include <string>     // getline()函数需要包含的头文件。
using  namespace std;

int main()
{
	ifstream fin(R"(D:\data\txt\test.txt)", ios::in);

	if (fin.is_open() == false) {
		cout << "打开文件" << R"(D:\data\txt\test.txt)" << "失败。\n";
		return 0;
	}

	string buffer;
	/*while (fin >> buffer) {
		cout << buffer << endl;
	}*/
	while (true) {
		fin >> buffer;
		cout << "eof()=" << fin.eof() << ",good() = " << fin.good() << ", bad() = " << fin.bad() << ", fail() = " << fin.fail() << endl;
		if (fin.eof() == true) break;
		
		cout << buffer << endl;
	}

	fin.close();	   // 关闭文件，fin对象失效前会自动调用close()。
}

```