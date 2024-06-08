---
Modified-date: 2024-06-04 10:52
---



# 最近更新的文件

```dataview
table
tags as "标签", Modified-date as "最后修改时间"
from "数字电路" or "C and C++" or "计算机组成原理"
where date(today) - file.mday < dur(3 days)
sort file.mtime desc
limit 6
```



```dataview
table
tags , Finish-date
from "数字电路" or "C and C++" or "计算机组成原理"
where contains(Status , "done")
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





