---
Modified-date: 2024-06-09 15:49
---



# 最近更新的文件

```dataview
table
tags as "标签", Modified-date as "最后修改时间"
from "数字电路" or "C and C++" or "计算机组成原理" or "汇编"
where date(today) - file.mday < dur(3 days)
sort file.mtime desc
limit 6
```


# 正在写的笔记

```dataview
table
tags  , modified-date
from "数字电路" or "C and C++" or "计算机组成原理" or "汇编"
where contains(Status , "writing")
sort file.mtime desc
```

# 完成的笔记
```dataview
table
tags , Finish-date , modified-date
from "数字电路" or "C and C++" or "计算机组成原理" or "汇编"
where contains(Status , "done")
sort file.mtime desc 
```







````col
Column 1-1
Column 1-2

```col-md
- column 2-1
    1. Item 1
    1. Item 2
    1. Item 3
- column 2-2
- column 2-3

>  [!INFO] Callouts
> - column 3-1
> - column 3-2
>> [!ERROR] Error description
>>  Nested callout
```

```js
  let msg = "Hello, world!";
  let url = window.location.href;
```
````





