---
Type: Note
tags:
  - 数据结构
  - CPP
Status: writing
Start-date: 2025-08-07 21:51
Finish-date: 
Modified-date: 2025-08-08 14:25
Publish: false
---


# AVL树深度解析：从平衡法则到旋转艺术

> [!SUMMARY] 前言
> 
> 在上一个时代，二叉搜索树（BST）以其 O(logn) 的平均查找效率，成为了数据检索领域的明星。然而，这位明星却有着一个不为人知的“性格缺陷”——它的性能极度依赖于“出场顺序”（数据的插入顺序）。在面对有序数据时，它的表现会灾难性地退化。
> 
> 本文是AVL树的深度解析文章。我们将首先直面BST的性能困境，理解为何“平衡”如此重要。然后，我们将详细介绍AVL树是如何定义“平衡”的——即其核心的**平衡因子**法则。最后，我们将深入学习如何通过精妙的“外科手术”——**旋转**，来治愈失衡，让AVL树永葆青春。

## 一、 AVL树的诞生：为何需要平衡？

让我们先来看一个直观的对比，理解“平衡”对于一棵搜索树意味着什么。

场景一：理想情况

我们向一棵空树中插入序列 [4, 2, 6, 1, 3, 5, 7]，会得到一棵形态优美、近乎完美的平衡二叉树：

```
      (4)
      / \
    (2) (6)
    / \   / \
  (1) (3) (5) (7)
```

这棵树的高度为2，查找任何一个元素，最多只需要比较3次。其查找效率是卓越的 O(logn)。

场景二：最坏情况

我们向一棵空树中插入一个有序序列 [1, 2, 3, 4, 5, 6, 7]，会得到一棵严重倾斜的“退化”树：

```
(1)
 \
  (2)
   \
    (3)
     \
      (4)
       \
        (5)
         \
          (6)
           \
            (7)
```

这棵所谓的“树”，其形态和性能已经与一个**链表**无异。它的高度为6，查找元素7需要比较7次。其查找效率已退化为糟糕的 O(n)。

这个性能上的巨大鸿沟是不可接受的。我们需要一种机制，让树在每次插入或删除后，都能**自动进行调整**，阻止其“变长”，时刻保持“矮胖”的平衡体型。于是，AVL树应运而生。

## 二、 AVL树的核心法则

AVL树通过强制遵守一个额外的、严格的平衡条件，来保证其高效性能。

法则一：它首先是一棵二叉搜索树（BST）

这保证了其基础的、可用于快速查找的序关系：左子节点 < 根节点 < 右子节点。

**法则二：它必须满足“AVL平衡条件”**

> 对于树中的**任意一个节点**，其**左子树**和**右子树**的**高度差**的绝对值**不能超过 1**。

为了精确地描述和检查这个条件，我们引入两个重要的概念：

#### 1. 高度 (Height)

- 一个**叶子节点**的高度为 **0**。
    
- 一个**空树 (nullptr)** 的高度规定为 **-1**。
    
- 一个非叶子节点的高度 = `1 + max(其左子树的高度, 其右子树的高度)`。
    

> [!TIP] 为何空树高度是-1？
> 
> 这个规定是一种数学上的技巧。考虑一个只有一个节点（即叶子节点）的树，它的左右子树都是空。按照公式计算，它的高度 = 1 + max(-1, -1) = 0，这与叶子节点高度为0的定义完美契合，使得公式无需处理特殊情况。

#### 2. 平衡因子 (Balance Factor, BF)

每个节点的平衡因子被定义为：平衡因子 = 左子树高度 - 右子树高度。

根据AVL的平衡条件，树中所有节点的平衡因子只能是以下三种值之一：

- **BF = 1**：左子树比右子树高 1，我们称之为“左倾”（Left-heavy）。
    
- **BF = 0**：左右子树等高，完美平衡。
    
- **BF = -1**：右子树比左子树高 1，我们称之为“右倾”（Right-heavy）。
    

**当一个节点的平衡因子的绝对值变为2（即BF = +2 或 -2）时，我们就称该节点“失衡 (Unbalanced)”，AVL树的平衡被破坏，必须立即进行调整**。

让我们看一个实际的例子：

```
      (A) BF=1, H=2
      / \
(B) BF=1, H=1     (C) BF=0, H=0
    /
(D) BF=0, H=0
```

- **节点D, C**: 是叶子节点，高度 `H=0`。它们的左右子树都是空（H=-1），所以 `BF = -1 - (-1) = 0`。
    
- **节点B**: 左子树是D（H=0），右子树为空（H=-1）。`H(B) = 1 + max(0, -1) = 1`。`BF(B) = 0 - (-1) = 1`。
    
- **节点A**: 左子树是B（H=1），右子树是C（H=0）。`H(A) = 1 + max(1, 0) = 2`。`BF(A) = 1 - 0 = 1`。
    

这棵树中所有节点的平衡因子都在 `{-1, 0, 1}` 的集合内，所以它是一棵合法的AVL树。

## 三、 恢复平衡的魔法：基础旋转操作

当一个节点失衡时，AVL树会通过**旋转**操作来恢复平衡。旋转是一种局部的、能保持BST性质的节点重排操作。

#### 1. 左旋 (Left Rotation)

- **时机**：当一个节点 `z` 的**右子树过高**，导致其平衡因子变为 `-2` 时使用。
    
- **目标**：将右子树“提上来”，成为新的根，从而降低右侧的高度，增加左侧的高度。
    
- **过程图解**：
    
    ```
         z                               y
        / \                             / \
       T1  y          ----->           z   T3
          / \                         / \
         T2  T3                      T1  T2
    ```
    
- **代码实现**：
```cpp
    /**
     * @brief 对节点 z 进行左旋
     * @param z 失衡的节点
     * @return 旋转后该子树的新根节点 y
     */
    AVLNode* leftRotate(AVLNode* z) {
        AVLNode* y = z->right;
        AVLNode* T2 = y->left;
    
        // 开始旋转
        y->left = z;
        z->right = T2;
    
        // 关键：更新受影响节点的高度
        // 必须先更新子节点 z 的高度，再更新新根 y 的高度
        z->height = 1 + std::max(getHeight(z->left), getHeight(z->right));
        y->height = 1 + std::max(getHeight(y->left), getHeight(y->right));
    
        // 返回旋转后子树的新根
        return y;
    }
```
    

#### 2. 右旋 (Right Rotation)

- **时机**：当一个节点 `z` 的**左子树过高**，导致其平衡因子变为 `+2` 时使用。

- **目标**：将左子树“提上来”，成为新的根。

- **过程图解**：
```cpp
           z                               y
          / \                             / \
         y   T3        ----->            T1  z
        / \                                 / \
       T1  T2                              T2  T3
```
    
- **代码实现**：
    ```cpp
    /**
     * @brief 对节点 z 进行右旋
     * @param z 失衡的节点
     * @return 旋转后该子树的新根节点 y
     */
    AVLNode* rightRotate(AVLNode* z) {
        AVLNode* y = z->left;
        AVLNode* T3 = y->right;
    
        // 开始旋转
        y->right = z;
        z->left = T3;
    
        // 更新高度
        z->height = 1 + std::max(getHeight(z->left), getHeight(z->right));
        y->height = 1 + std::max(getHeight(y->left), getHeight(y->right));
    
        return y;
    }
    ```

## 四、 四种失衡情况与应对策略

掌握了基础旋转后，我们就可以来解决所有四种失衡情况了。假设失衡的节点是 `z`。


#### 情况一：左-左 (LL) 失衡

- **成因**：新节点插入到了失衡节点 `z` 的**左孩子 `y`** 的**左子树**中。

- **特征**：`BF(z) = +2`, `BF(y) = +1`。

- **图示**：
    ```
          z (+2)
         /
        y (+1)
       /
      x (新)
    ```
    
- **解决方案**：对失衡节点 `z` 进行一次**右旋**。
    
- **代码逻辑**（在`insert`函数递归返回的路径上）：

    ```cpp
    // 检查平衡因子
    int balance = getBalanceFactor(node);
    
    // LL Case: 平衡因子 > 1，且其左孩子的平衡因子 >= 0
    if (balance > 1 && getBalanceFactor(node->left) >= 0) {
        return rightRotate(node);
    }
    ```

> [!NOTE] 提示
> 
> 这里的条件是 getBalanceFactor(node->left) >= 0 而不是 == 1，因为在删除等操作后，或插入导致子节点平衡因子变为0时，也属于LL情况。




#### 情况二：右-右 (RR) 失衡

- **成因**：新节点插入到了失衡节点 `z` 的**右孩子 `y`** 的**右子树**中。

- **特征**：`BF(z) = -2`, `BF(y) = -1`。

- **图示**：
    ```
      z (-2)
       \
        y (-1)
         \
          x (新)
    ```
    
- **解决方案**：对失衡节点 `z` 进行一次**左旋**。
    
- **代码逻辑**：
```cpp
// ...
// RR Case: 平衡因子 < -1，且其右孩子的平衡因子 <= 0
if (balance < -1 && getBalanceFactor(node->right) <= 0) {
	return leftRotate(node);
}
```
    

---

#### 情况三：左-右 (LR) 失衡

- **成因**：新节点插入到了失衡节点 `z` 的**左孩子 `y`** 的**右子树**中。这是一个“拐弯”的情况。

- **特征**：`BF(z) = +2`, `BF(y) = -1`。

- **图示**：
```
	 z (+2)
	/
   y (-1)
	\
	 x (新)
```

- **解决方案**：需要**两次旋转**。
    1. **先对 `y` 进行一次左旋**，将树的形态调整为 LL 型。
    2. **再对 `z` 进行一次右旋**，完成最终的平衡。

- **代码逻辑**：
```cpp
// ...
// LR Case: 平衡因子 > 1，且其左孩子的平衡因子 < 0
if (balance > 1 && getBalanceFactor(node->left) < 0) {
	node->left = leftRotate(node->left); // 步骤1
	return rightRotate(node);            // 步骤2
}
```




#### 情况四：右-左 (RL) 失衡

- **成因**：新节点插入到了失衡节点 `z` 的**右孩子 `y`** 的**左子树**中。这是另一个“拐弯”的情况。

- **特征**：`BF(z) = -2`, `BF(y) = +1`。

- **图示**：
    ```
      z (-2)
       \
        y (+1)
       /
      x (新)
    ```
    
- **解决方案**：同样需要**两次旋转**。
    1. **先对 `y` 进行一次右旋**，将树的形态调整为 RR 型。

    2. **再对 `z` 进行一次左旋**，完成最终的平衡。

- **代码逻辑**：
```cpp
// ...
// RL Case: 平衡因子 < -1，且其右孩子的平衡因子 > 0
if (balance < -1 && getBalanceFactor(node->right) > 0) {
	node->right = rightRotate(node->right); // 步骤1
	return leftRotate(node);                // 步骤2
}
```
    

## 完整实现代码

```cpp
#include <iostream>
#include <algorithm> // for std::max
#include <string>
#include <vector>

/**
 * @brief AVL树的节点定义
 */
struct AVLNode {
    int val;          // 节点存储的值
    AVLNode *left;    // 左孩子指针
    AVLNode *right;   // 右孩子指针
    int height;       // 当前节点的高度

    // 构造函数
    AVLNode(int value) : val(value), left(nullptr), right(nullptr), height(0) {}
};

/**
 * @brief AVL树类封装
 */
class AVLTree {
public:
    /**
     * @brief 构造函数，初始化一棵空树
     */
    AVLTree() : root(nullptr) {}

    /**
     * @brief 析构函数，释放所有节点内存
     */
    ~AVLTree() {
        destroyTree(root);
    }

    /**
     * @brief 公共接口：向树中插入一个值
     */
    void insert(int val) {
        root = insertHelper(root, val);
    }

    /**
     * @brief 公共接口：从树中删除一个值
     */
    void remove(int val) {
        root = removeHelper(root, val);
    }

    /**
     * @brief 公共接口：打印树的结构（中序遍历形式）
     */
    void printInOrder() {
        std::cout << "In-order Traversal: ";
        inOrderHelper(root);
        std::cout << std::endl;
    }

private:
    AVLNode* root; // 树的根节点

    // --- 核心辅助函数 ---

    /**
     * @brief 安全地获取一个节点的高度
     * @param node 目标节点
     * @return 节点的高度，如果节点为空则返回-1
     */
    int getHeight(AVLNode* node) {
        return (node == nullptr) ? -1 : node->height;
    }
    
    /**
     * @brief 更新一个节点的高度
     * @param node 目标节点
     */
    void updateHeight(AVLNode* node) {
        if (node != nullptr) {
            node->height = 1 + std::max(getHeight(node->left), getHeight(node->right));
        }
    }

    /**
     * @brief 计算节点的平衡因子
     * @param node 目标节点
     * @return 平衡因子（左子树高度 - 右子树高度）
     */
    int getBalanceFactor(AVLNode* node) {
        return (node == nullptr) ? 0 : getHeight(node->left) - getHeight(node->right);
    }

    // --- 旋转操作 ---

    /**
     * @brief 对节点 z 进行右旋 (处理LL失衡)
     * @param z 失衡的节点
     * @return 旋转后该子树的新根节点 y
     */
    AVLNode* rightRotate(AVLNode* z) {
        AVLNode* y = z->left;
        AVLNode* T3 = y->right;

        // 执行旋转
        y->right = z;
        z->left = T3;

        // **重要**: 更新受影响节点的高度，必须先更新子节点(z)，再更新新根(y)
        updateHeight(z);
        updateHeight(y);
        
        return y; // 返回旋转后子树的新根
    }

    /**
     * @brief 对节点 z 进行左旋 (处理RR失衡)
     * @param z 失衡的节点
     * @return 旋转后该子树的新根节点 y
     */
    AVLNode* leftRotate(AVLNode* z) {
        AVLNode* y = z->right;
        AVLNode* T2 = y->left;

        // 执行旋转
        y->left = z;
        z->right = T2;

        // 更新高度
        updateHeight(z);
        updateHeight(y);
        
        return y; // 返回旋转后子树的新根
    }
    
    /**
     * @brief 重新平衡节点
     * @param node 可能失衡的节点
     * @return 平衡后的子树根节点
     */
    AVLNode* rebalance(AVLNode* node) {
        // 更新高度
        updateHeight(node);
        
        // 计算平衡因子
        int balance = getBalanceFactor(node);

        // -- 判断并执行相应的旋转 --
        // Case 1: 左侧过重 (LL or LR)
        if (balance > 1) { 
            // 如果左子树是左倾或平衡，说明是 LL 型
            if (getBalanceFactor(node->left) >= 0) {
                return rightRotate(node);
            } 
            // 如果左子树是右倾，说明是 LR 型
            else {
                node->left = leftRotate(node->left); // 先对左孩子左旋
                return rightRotate(node);            // 再对自身右旋
            }
        }
        // Case 2: 右侧过重 (RR or RL)
        if (balance < -1) { 
            // 如果右子树是右倾或平衡，说明是 RR 型
            if (getBalanceFactor(node->right) <= 0) {
                return leftRotate(node);
            } 
            // 如果右子树是左倾，说明是 RL 型
            else {
                node->right = rightRotate(node->right); // 先对右孩子右旋
                return leftRotate(node);                // 再对自身左旋
            }
        }

        // 如果未失衡，直接返回原节点
        return node;
    }

    // --- 插入与删除的递归实现 ---

    /**
     * @brief 递归辅助函数：插入新值
     * @param node 当前递归到的节点
     * @param val 要插入的值
     * @return 经过插入和平衡调整后，该子树的新根节点
     */
    AVLNode* insertHelper(AVLNode* node, int val) {
        // 1. 执行标准的 BST 插入
        if (node == nullptr) {
            return new AVLNode(val);
        }
        if (val < node->val) {
            node->left = insertHelper(node->left, val);
        } else if (val > node->val) {
            node->right = insertHelper(node->right, val);
        } else {
            return node; // 不允许插入重复值
        }

        // 2. 从插入点向上回溯，重新平衡路径上的节点
        return rebalance(node);
    }
    
    /**
     * @brief 查找子树中的最小节点 (用于删除)
     */
    AVLNode* findMin(AVLNode* node) {
        while (node != nullptr && node->left != nullptr) {
            node = node->left;
        }
        return node;
    }

    /**
     * @brief 递归辅助函数：删除值为 val 的节点
     * @param node 当前递归到的节点
     * @param val 要删除的值
     * @return 经过删除和平衡调整后，该子树的新根节点
     */
    AVLNode* removeHelper(AVLNode* node, int val) {
        // 1. 执行标准的 BST 删除
        if (node == nullptr) {
            return nullptr; // 没有找到要删除的节点
        }
        if (val < node->val) {
            node->left = removeHelper(node->left, val);
        } else if (val > node->val) {
            node->right = removeHelper(node->right, val);
        } else {
            // 找到了要删除的节点
            // Case 1: 节点是叶子节点或只有一个孩子
            if (node->left == nullptr || node->right == nullptr) {
                AVLNode* temp = (node->left != nullptr) ? node->left : node->right;
                if (temp == nullptr) { // 叶子节点
                    temp = node;
                    node = nullptr;
                } else { // 一个孩子
                    *node = *temp; // 拷贝孩子节点的内容
                }
                delete temp;
            } 
            // Case 2: 节点有两个孩子
            else {
                // 找到右子树的最小节点（中序后继）
                AVLNode* successor = findMin(node->right);
                // 用后继节点的值替换当前节点的值
                node->val = successor->val;
                // 从右子树中递归地删除那个后继节点
                node->right = removeHelper(node->right, successor->val);
            }
        }
        
        // 如果树在删除后变为空（删除了唯一的节点）
        if (node == nullptr) {
            return nullptr;
        }

        // 2. 从删除点向上回溯，重新平衡路径上的节点
        return rebalance(node);
    }
    
    // --- 其他辅助函数 ---

    /**
     * @brief 递归释放树的所有节点（后序遍历）
     */
    void destroyTree(AVLNode* node) {
        if (node != nullptr) {
            destroyTree(node->left);
            destroyTree(node->right);
            delete node;
        }
    }

    /**
     * @brief 递归打印树（中序遍历）
     */
    void inOrderHelper(AVLNode* node) {
        if (node != nullptr) {
            inOrderHelper(node->left);
            std::cout << node->val << "(BF=" << getBalanceFactor(node) << ") ";
            inOrderHelper(node->right);
        }
    }
};


// --- 主函数：测试 ---
int main() {
    AVLTree tree;

    std::cout << "Inserting elements: 10, 20, 30, 40, 50, 25" << std::endl;
    tree.insert(10);
    tree.insert(20);
    tree.insert(30); // RR Case at node 10
    tree.insert(40); // RR Case at node 20
    tree.insert(50); // RR Case at node 30, then at root 20
    tree.insert(25); // RL Case at node 30

    tree.printInOrder();

    std::cout << "\nRemoving element: 40" << std::endl;
    tree.remove(40);
    tree.printInOrder();
    
    std::cout << "\nRemoving element: 30" << std::endl;
    tree.remove(30);
    tree.printInOrder();

    return 0;
}
```




## 五、 总结与展望

我们现在已经掌握了AVL树进行自我修复的全部“手术”技巧：

- **两个基础动作**：左旋和右旋。
    
- **四个应对处方**：LL、RR、LR、RL，它们分别由单次或两次基础旋转组合而成。
    

至此，AVL树的核心理论已经全部展现在你的面前。它通过在每次修改操作后，从被修改的节点向上回溯，检查路径上每个节点的平衡因子，一旦发现失衡，立即调用对应的旋转处方进行修复。正是这套严密的“诊断-治疗”机制，保证了AVL树永不“退化”，使其所有关键操作的性能都能稳定在高效的 O(logn)。

接下来，你可以尝试将这些碎片化的代码逻辑，整合到一个完整的AVL树类中，亲手实现它的 `insert` 和 `delete` 方法。这将是一次极具价值的编码实践。同时，你也可以开始了解另一种著名的自平衡树——**红黑树**，去探索它与AVL树在平衡策略和性能权衡上的不同之处。


