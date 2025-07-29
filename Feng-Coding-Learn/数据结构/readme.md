---
Modified-date: 2025-07-29 22:08
---

#### **第一部分：基础内功 (The Foundation)**

- **第1章：绪论 (Introduction)**
    
    - 1.1 什么是数据结构？—— 不只是把数据放起来
        
    - 1.2 什么是算法？—— 解决问题的“套路”
        
    - 1.3 基本概念：数据、数据元素、逻辑结构与物理结构
        
    - 1.4 算法的好坏如何衡量？—— **时间复杂度**与**空间复杂度**分析 (Big O Notation)
        
        - O(1), O(logn), O(n), O(nlogn), O(n2) ... 这些魔法符号是什么意思？
            

#### **第二部分：线性结构 (Linear Structures)**

- **第2章：数组与链表 (Arrays & Linked Lists)**
    
    - 2.1 **数组 (Array)**：最基础的连续内存空间
        
    - 2.2 **链表 (Linked List)**：手拉手的朋友们，内存不再受限
        
        - 单向链表 (Singly Linked List)
            
        - 双向链表 (Doubly Linked List)
            
        - 循环链表 (Circular Linked List)
            
    - 2.3 数组 vs. 链表：什么时候用谁？世纪对决！
        
- **第3章：栈与队列 (Stacks & Queues)**
    
    - 3.1 **栈 (Stack)**：后进先出 (LIFO)，像羽毛球筒
        
        - 栈的实现与应用 (函数调用、括号匹配)
            
    - 3.2 **队列 (Queue)**：先进先出 (FIFO)，像排队买奶茶
        
        - 队列的实现与应用 (任务调度、广度优先搜索)
            

#### **第三部分：非线性结构 (Non-Linear Structures)**

- **第4章：树 (Trees)**
    
    - 4.1 树的基本概念：家族族谱一样的结构 (根、节点、父子、深度、高度)
        
    - 4.2 **二叉树 (Binary Tree)**：每个节点最多两个“娃”
        
        - 二叉树的种类：满二叉树、完全二叉树
            
        - 二叉树的遍历：前序、中序、后序、层序 (面试高频考点！)
            
    - 4.3 **二叉搜索树 (Binary Search Tree)**：左小右大，查找利器
        
    - 4.4 **平衡二叉树 (Balanced BST)**：防止“长歪”的二叉搜索树 (了解AVL树、红黑树的概念)
        
    - 4.5 **堆 (Heap)**：特殊的完全二叉树 (最大堆、最小堆)
        
        - 堆的应用：优先队列 (Priority Queue) 与堆排序
            
- **第5章：哈希表 (Hash Table)**
    
    - 5.1 神奇的“键值对”：通过Key直接访问Value的奥秘
        
    - 5.2 哈希函数 (Hash Function)：如何计算存储位置？
        
    - 5.3 冲突处理 (Collision Resolution)：当“地址”被占用时怎么办？ (链地址法、开放地址法)
        
- **第6章：图 (Graphs)**
    
    - 6.1 万物皆可互联：最复杂的数据结构 (顶点、边、有向图、无向图、权重)
        
    - 6.2 图的表示方法：邻接矩阵与邻接表
        
    - 6.3 图的遍历：
        
        - 深度优先搜索 (DFS - Depth-First Search)
            
        - 广度优先搜索 (BFS - Breadth-First Search)
            
    - 6.4 经典算法入门：
        
        - 最小生成树 (Minimum Spanning Tree): Prim & Kruskal 算法
            
        - 最短路径 (Shortest Path): Dijkstra 算法
            

#### **第四部分：排序与高级主题 (Sorting & Advanced Topics)**

- **第7章：常用排序算法 (Sorting Algorithms)**
    
    - 7.1 基础排序 (O(n2)): 冒泡排序、插入排序、选择排序
        
    - 7.2 高级排序 (O(nlogn)): 归并排序、快速排序、堆排序
        
    - 7.3 特殊排序 (线性时间): 桶排序、计数排序、基数排序
        
- **第8章：进阶选修 (Optional Advanced)**
    
    - 8.1 **Trie树 (前缀树)**：高效的字符串查找
        
    - 8.2 **并查集 (Disjoint Set Union)**：判断“亲戚”关系
        
    - 8.3 **B-树 / B+树**：数据库和文件系统的基石