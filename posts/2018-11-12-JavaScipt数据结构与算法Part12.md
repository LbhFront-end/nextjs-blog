---
title: '为什么我要放弃javaScript数据结构与算法（第十二章）—— 算法复杂度'
date: '2018-11-12 17:13:41'
slug: 'Learn-JS-Data-Structure-And-Algorithm-P12'
tags: 'javaScript数据结构与算法'
categories:
  - 'javaScript相关'
---

花了一个星期，终于看到这本书的最后一章了。这章将要学习著名的大 O 表示法。

## 第十二章 算法复杂度

### 大 O 表示法

它用于描述算法的性能和复杂程度

分析算法时，时常遇到以下几类函数

| 符号 | 名称 |
| ------------------ '| ------------ |'
| _O(1)_ | 常数的 |
| _O(log(n))_ | 对数的 |
| _O((log(n)c))_ | 对数多项式的 |
| _O(n)_ | 线性的 |
| _O(n<sup>2</sup>)_ | 二次的 |
| _O(n<sup>c</sup>)_ | 多项式的 |
| _O(c<sup>n</sup>)_ | 指数的 |

### 理解大 O 表示法

如何衡量算法的效率？通常是用资源，例如 CPU（时间）占用、内存占用、硬盘占用和网络占用。当讨论大 O 表示法时，一般考虑的是 CPU（时间）占用。

让我们试着用一些例子来理解大 O 表示法的规则

### _O(1)_

```javascript
function increment(num) {
  return ++num;
}
```

假设运行 increment（1）函数，执行时间等于 _X_。如果再用不同的参数运行一次 increment 函数，执行事件依然是 _X_。和参数无关，increment 函数的性能都一样。因此，我们说上述函数的复杂程度是*O(1)*（常数）

### _O(n)_

```javascript
function sequentialSearch(array, item) {
  for (var i = 0; i < array.length; i++) {
    if (item === array[i]) {
      return i;
    }
  }
  return -1;
}
```

如果将含有 10 个元素的数组（[1, ..., 10]）传递给该函数，例如搜索 1 这个元素，那么第一次判断时就能找到想要搜索的元素。在这里我们假设每执行一次（item === array[i]）开销为 1.

现在，假如要搜索元素 11. 那么函数会执行 10 次（遍历数组中所有的值，并且找不到要搜索的元素，因此结果返回-1），那么开销就是 10。以此类推，sequentialSearch 函数执行的总开销取决了数组元素的个数（数组的大小）。可以得到 sequentialSearch 函数的时间复杂度为*O(n)*，n 是（输入）数组的大小。

回到之前的例子，修改一下算法的实现。

```javascript
function sequentialSearch(array, item) {
  var cost = 0;
  for (var i = 0; i < array.length; i++) {
    if (item === array[i]) {
      return i;
    }
  }
  console.log('cost for sequentialSearch with inpy size ' + array.length + 'is' + cost);
  return -1;
}
```

用不同大小输入数组执行以上算法，可以看到不同的输出。

### _O(n<sup>2</sup>)_

用冒泡排序做例子

```javascript
function swap(array, index1, index2) {
  var aux = array[index1];
  array[index1] = array[index2];
  array[index2] = aux;
}

function bubbleSort(array) {
  var length = array.length,
    cost = 0;
  for (var i = 0; i < length; i++) {
    cost++;
    for (var j = 0; j < length; j++) {
      cost++;
      if (array[j] > array[j + 1]) {
        swap(array, j, j + 1);
      }
    }
  }
  console.log('cost for bubbleSort with input size' + length + 'is' + cost);
}
```

如果用大小为 10 的数组执行上面的函数，开销是 100（10<sup>2</sup>）。

> 时间复杂度*O(n)*的代码只有一层循环，而*O(n<sup>2</sup>)*有两层循环。如果算法有三层遍历数组的嵌套循环，它的时间复杂度很有可能是*O(n<sup>3</sup>)*

### 时间复杂度比较

下面比较了前述各个大 O 符号表示的时间复杂度

![时间复杂度比较](/images/posts/js数据结构与算法-算法复杂度-时间复杂度比较.png)

**数据结构**

下表是常用数据结构的时间复杂度

| 数据结构 | 一般情况 | | | 最差情况 | | |
| ------------ '| ----------- | ----------- | ----------- | ----------- | ----------- | ----------- |'
| | 插入 | 删除 | 搜索 | 插入 | 删除 | 搜索 |
| 数组-栈-队列 | _O(1)_ | _O(1)_ | _O(n)_ | _O(1)_ | _O(1)_ | _O(n)_ |
| 链表 | _O(1)_ | _O(1)_ | _O(n)_ | _O(1)_ | _O(1)_ | _O(n)_ |
| 双向链表 | _O(1)_ | _O(1)_ | _O(n)_ | _O(1)_ | _O(1)_ | _O(n)_ |
| 散列表 | _O(1)_ | _O(1)_ | _O(1)_ | _O(n)_ | _O(n)_ | _O(n)_ |
| 二分搜索树 | _O(log(n))_ | _O(log(n))_ | _O(log(n))_ | _O(n)_ | _O(n)_ | _O(n)_ |
| AVL 树 | _O(log(n))_ | _O(log(n))_ | _O(log(n))_ | _O(log(n))_ | _O(log(n))_ | _O(log(n))_ |

**图**

下表是图的时间复杂度

| 节点-边的管理方式 | 存储空间 | 增加顶点 | 增加边 | 删除顶点 | 删除边 | 轮询 |
| ----------------- '| ------------------ | ------------------ | ------ | ------------------ | ------ | ------ |'
| 邻接表 | _O(V+E)_ | _O(1)_ | _O(1)_ | _O(V+E)_ | _O(E)_ | _O(V)_ |
| 邻接矩阵 | _O(V<sup>2</sup>)_ | _O(V<sup>2</sup>)_ | _O(1)_ | _O(V<sup>2</sup>)_ | _O(1)_ | _O(1)_ |

**排序算法**

下表是排序算法的时间复杂度

| 算法（用于数组） | 最好情况 | 一般情况 | 最差情况 |
| ---------------- '| ------------------ | ------------------ | ------------------ |'
| 冒泡排序 | _O(n)_ | _O(n<sup>2</sup>)_ | _O(n<sup>2</sup>)_ |
| 选择排序 | _O(n<sup>2</sup>)_ | _O(n<sup>2</sup>)_ | _O(n<sup>2</sup>)_ |
| 插入排序 | _O(n)_ | _O(n<sup>2</sup>)_ | _O(n<sup>2</sup>)_ |
| 归并排序 | _O(nlog(n))_ | _O(nlog(n))_ | _O(nlog(n))_ |
| 快速排序 | _O(nlog(n))_ | _O(nlog(n))_ | _O(n<sup>2</sup>)_ |
| 堆排序 | _O(nlog(n))_ | _O(nlog(n))_ | _O(nlog(n))_ |
| 桶排序 | _O(n+k)_ | _O(n+k)_ | _O(n<sup>2</sup>)_ |
| 基数排序 | _O(nk)_ | _O(nk)_ | _O(nk)_ |

**搜索算法**

下表是搜索算法的时间复杂度

| 算法 | 数据结构 | 最差情况 |
| ------------------- '| ---------------------- | ----------- |'
| 顺序搜索 | 数组 | _O(n)_ |
| 二分搜索 | 已排序的数组 | _O(log(n))_ |
| 深度优先搜索（DPS） | 顶点数为 V，边数为 E 的图 | _O(V+E)_ |
| 广度优先搜索（BFS） | 顶点数为 V，边数为 E 的图 | _O(V+E)_ |

### NP 完全理论概述

一般来说，如果一个算法的复杂度为 _O(n<sup>k</sup>)_，其中 k 是常数，我们就认为这个算法是最高效的，这就是多项式算法。

对于给定的问题，如果存在多项式算法，则计为 P（polynomial, 多项式）。

还有一类 NP（nondeterministic polynomial, 非确定性多项式）算法。如果一个问题可以在多项式时间内验证是否正确，则计为 NP。

如果一个问题存在多项式算法，自然可以在多项式时间内验证其解。因此，所有 P 都是 NP。然而，P = NP 是否成立，仍然不得而知。

### 小结

我们学习了大 O 表示法，已经如何运算它计算算法的复杂度。也粗略介绍了 NP 的一些理论。

书籍链接： [学习 JavaScript 数据结构与算法](https://book.douban.com/subject/26639401/)
