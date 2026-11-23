---
title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks"
subtitle: "生成答案之前，先去哪里找依据？"
byline: "Patrick Lewis 等 · 2020"
topic: "自然语言处理"
source: "https://arxiv.org/abs/2005.11401"
reason: "想弄清 RAG，可以先把一次回答拆开看：检索器找到了哪些段落，生成器又怎样利用它们？"
---

## 从一个具体问题读起

在一道开放域问答题里，检索器从维基百科索引中取回候选段落。论文比较了两种用法：整段生成共享同一个潜在来源，或者允许不同词依赖不同段落。

## 值得回看的地方

如果最后答案错了，单看输出很难知道是证据没找到，还是生成器没用好证据。读实验时，我会把这两种情形分别记下来。
