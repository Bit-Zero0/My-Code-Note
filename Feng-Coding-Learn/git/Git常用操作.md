---
Type: Note
tags:
  - 工具
  - git
Status: writing
Start-date: 2025-04-12 19:40
Finish-date: 
Modified-date: 2025-04-21 23:01
Publish: false
---


## 一. 基础操作

###  1.1 查看状态与修改
```bash
git init # 初始化仓库

git status # 查看状态

git diff # 查看工作区与暂存区的差异

git checkout <分支名> # 切换分支
```


### 1.2 撤销操作
```bash
# 撤销工作区的修改（危险！不可恢复）
git checkout -- filename

# 撤销暂存区的修改（把文件移回工作区）
git reset HEAD filename

# 修改最后一次提交（适合漏改文件或写错提交信息）
git commit --amend
```


### 1.3 创建与切换分支
```bash
git branch          # 查看本地分支
git branch new-feature  # 创建新分支
git checkout new-feature  # 切换分支
# 或简化版：
git checkout -b new-feature
```


### 1.4 合并分支
```bash
git checkout main
git merge new-feature  # 将 new-feature 合并到当前分支（main）
```

## 二. git 强制拉取

先清空自身缓冲区
```bash
git stash 
```

强制拉取
```bash
git pull --rebase
```


## 三. 建立标签

```bash
git tag v1.0.0         # 创建轻量标签
git tag -a v1.0.0 -m "正式版"  # 含注解的标签
git push origin --tags  # 推送标签到远程
```


### 3.1 在已有仓库中拉取远程分支
#### 方法一：直接拉取并切换分支
```bash
git fetch origin  # 获取远程最新信息
git checkout <分支名>  # 自动匹配远程分支
```

#### 方法二：明确拉取并创建本地分支
```bash
git fetch origin <远程分支名>:<本地分支名>
git checkout <本地分支名>
```

示例:
```bash
git fetch origin feature/login:my-feature
git checkout my-feature
```

#### 方法三：跟踪远程分支
```bash
git checkout --track origin/<分支名>
```


### 3.2 拉取远程分支的最新更改
如果已切换到本地分支并需要同步远程更新：
```bash
git pull origin <分支名>
```

**简化操作**​：如果已设置跟踪分支，直接运行 `git pull`


## 五. 合并分支
- ​**检查当前分支状态**​：
```bash
git status
```
- 如果有未提交的更改，先提交或暂存（`git commit` 或 `git stash`）。


- 切换到 `main` 分支
```bash
git checkout main
```


- 更新本地`main`分支
从远程仓库拉取最新代码（避免合并冲突）
```bash
git pull origin main
```
- **如果无冲突**​：Git 会自动创建合并提交，你可以直接进入下一步。
- ​**如果有冲突**​：
    1. 手动解决冲突文件（Git 会提示冲突位置）。
- **完成合并提交**
```bash
git commit -m "Merge branch '0.0.2beta' into main"
```


- 推送合并后的 `main` 分支到远程仓库
```bash
git push origin main
```

## 重写历史
```bash
# 交互式变基（修改最近3次提交）
git rebase -i HEAD~3
```
使用场景：合并多个小提交、修改提交信息、删除错误提交