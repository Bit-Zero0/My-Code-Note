---

excalidraw-plugin: parsed
tags: [excalidraw]

---
==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠== You can decompress Drawing data with the command palette: 'Decompress current Excalidraw file'. For more info check in plugin settings under 'Saving'


# Excalidraw Data
## Text Elements
```c
#include <stdio.h>
int main()
{
	printf("hello world\n");
	return 0
}
``` ^IQtnwjMl

#include <stdio.h>
int main()
{
	printf("hello world\n");




	return 0
} ^y8zi8Ba9

class Solution {
public:
    int minOperations(vector<int>& nums, int x) {
        int sum = 0;
        for(auto i : nums)
            sum += i;
       
        int target = sum - x;
        if( target < 0) return -1; // 当整个数组的值之和小于x时返回-1

        sum = 0;
        int len = -1;
        for( int left = 0 , right = 0; right< nums.size(); right++)
        {
            sum += nums[right];
            while(sum > target)
                sum -= nums[left++];
            if(sum == target)
                len = max(len , right- left +1);
        }
        if(len == -1)
            return -1;
        
        return  nums.size() - len;
    }
}; ^rdkJjX5h

## Tags
%%
## Drawing
```compressed-json
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
```
%%