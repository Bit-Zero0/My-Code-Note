# 在使用读取string字符串时，容易出现的问题
我们在C语言或C++中，使用scanf或cin读取字符串时，当我们读取到空格 `' ' ` 或换行符 `\n`  的时候，就会读取结束。

如一下代码：
```c
int main()
{
	string s;

	cin >> s; // 在输入时，输入“hello world”

	cout << s << endl;
	return 0;
}
```

结果：
![[Pasted image 20220425121805.png]]

## 原因：
这种情况是因为缓冲区在读取数据时，是以空格 `' ' ` 或换行符 `\n`  来判断是否输入完成，当遇到两种中的其中一个时，他就会立马刷新缓冲区 ，所以我们上面的代码输入了 `hello world`  , 而输出结果为 `hello` 。



## 解决方法
### 使用`getchar` 或 `cin.get()` 

这两种方法都是一个字符一个字符的读取，当字符遇到换行符 `\n` 时停止，说明一行读取介绍。

```c
int main()
{
	string s;
	char ch = getchar();

	while (ch != '\n')//
	{
		s += ch; //将读取到的字符放到 s 中。
		ch = getchar(); // 读取之后的字符
	}

	cout << s << endl;
	return 0;
}
```

```c
int main()
{
	string s;
	char ch = cin.get();

	while (ch != '\n')
	{
		s += ch;
		ch = cin.get();
	}

	cout << s << endl;
	return 0;
}
```

![[Pasted image 20220425124641.png]]



### `getline` 函数

^7b841f

`getline` 函数可以直接获取到一行，比上面的函数或方法要实用一些

在使用`getline` 时，要使用 ==标准流提取操作符== `cin`  作为第一个参数

>getline( istream& in ,  string s );

```c
int main()
{
	string s;
	
	getline(cin , s);

	cout << s << endl;
	return 0;
}
```
![[Pasted image 20220425124729.png]]