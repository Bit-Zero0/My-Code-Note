---
Type: Note
tags: 
  - 算法
  - 基础
  - CPP
Status: writing
Start-date: 2024-09-09 22:13
Finish-date: 
Modified-date: 2024-10-16 21:52
Publish: false
---



> [!tip]+ 练习题目(建议:由上到下)
> [[724. 寻找数组的中心下标]]
> [[238. 除自身以外数组的乘积]]
> [[560. 和为 K 的子数组]]
> [[974. 和可被 K 整除的子数组]]
> [[525. 连续数组]]
> [[1314. 矩阵区域和]]

# 一维前缀和模版
1.   先预处理出来一个「前缀和」数组：
	- 用 `dp[i]` 表示： `[1, i]` 区间内所有元素的和，那么 `dp[i - 1]` 里面存的就是 `[1,i - 1] `区间内所有元素的和，那么：可得递推公式： `dp[i] = dp[i - 1] + arr[i]` ；
2. 使用前缀和数组，「快速」求出「某一个区间内」所有元素的和：
	- 当询问的区间是 `[l, r]` 时：区间内所有元素的和为： `dp[r] - dp[l - 1]` 。

[DP34 【模板】前缀和](https://www.nowcoder.com/practice/acead2f4c28c401889915da98ecdc6bf?tpId=230&tqId=2021480&ru=/exam/oj&qru=/ta/dynamic-programming/question-ranking&sourceUrl=%2Fexam%2Foj%3Fpage%3D1%26tab%3D%25E7%25AE%2597%25E6%25B3%2595%25E7%25AF%2587%26topicId%3D196)

## C++代码
```cpp
#include <iostream>
using namespace std;
#define N 101010
int arr[N];
long long sum[N] , dp[N];
int main() {
    int n  , q ; 
    cin >> n >> q;
    for(int i = 1; i <= n ; i++)
        cin >> arr[i];

    for(int i  = 1 ; i <= n ; i++)
        dp[i] = dp[i - 1] + arr[i];


    while(q--)
    {
        int l , r;
        cin >> l >> r;
        cout << dp[r] - dp[l - 1] << endl;
    }
    return 0;
}

```


## 二维前缀和
[【模板】二维前缀和](https://www.nowcoder.com/practice/99eb8040d116414ea3296467ce81cbbc?tpId=230&tqId=2023819&ru=/exam/oj&qru=/ta/dynamic-programming/question-ranking&sourceUrl=%2Fexam%2Foj%3Fpage%3D1%26tab%3D%25E7%25AE%2597%25E6%25B3%2595%25E7%25AF%2587%26topicId%3D196)

![[readme - 前缀和 2024-09-25 12.46.12.excalidraw]]
```cpp
#include <iostream>
using namespace std;

int main() {
    const int N = 1001;
    int arr[N][N];
    long long dp[N][N]; //dp数组

    int n , m , q;
    cin >> n >> m >> q;

    for(int i= 1 ; i<=n ; i++)
        for(int j = 1 ; j <= m ; j++)
            cin >> arr[i][j];

    //处理DP前缀和矩阵
    for(int i = 1 ; i <= n ; i++)
        for(int j = 1; j <= m ; j++)
            dp[i][j] = dp[i-1][j] + dp[i][j-1] + arr[i][j] - dp[i-1][j-1];



    int x1 , x2 , y1 , y2;
    while(q--)
    {
        cin >> x1  >> y1 >> x2 >> y2;
        cout << dp[x2][y2] - dp[x1-1][y2]  - dp[x2][y1-1] + dp[x1-1][y1-1] << endl;
    }
}
```

