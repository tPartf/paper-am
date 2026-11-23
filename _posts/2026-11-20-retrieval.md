---
title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks"
subtitle: "生成答案之前，先去哪里找依据？"
byline: "Patrick Lewis 等 · 2020"
topic: "自然语言处理"
source: "https://arxiv.org/abs/2005.11401"
reason: "想弄清 RAG，可以先把一次回答拆开看：检索器找到了哪些段落，生成器又怎样利用它们？"
takeaway: "Natural Questions 完全匹配率：RAG-Sequence 44.5%，检索后抽取答案的 DPR 为 41.5%。"
caveat: "检索到相关段落，仍不能保证生成的每句话都有证据。"
gpu: "需 GPU 训练"
openness: "有公开实现"
---

## 团队与影响

12 位作者，来自 Facebook AI Research（FAIR）、伦敦大学学院和纽约大学。FAIR 于 2013 年底成立，Yann LeCun 参与创办；本文合作者 Mike Lewis 也是生成模型 BART 的第一作者。[FAIR 十周年回顾](https://ai.meta.com/blog/fair-10-year-anniversary-open-science-meta/) · [BART 原文](https://aclanthology.org/2020.acl-main.703/)

2026-11-23 查询：OpenAlex 的 arXiv 条目为 **10,595 次引用**。作者将实现移植并开放于 Hugging Face Transformers（通用模型库，Apache-2.0）；**169,405 stars 属于整座仓库**。[引文条目](https://openalex.org/W3027879771) · [开源库](https://github.com/huggingface/transformers) · [原文附录 C](https://arxiv.org/pdf/2005.11401#page=17)

## 问题、前作与核心直觉

完全凭模型参数回答，很难更新知识或指出出处。此前的 DPR 学习查找相关文本，抽取式问答只能从原文选片段。RAG 让检索器先找资料，再由 BART 生成答案，训练时一起学习哪些资料有助于答对。RAG-Sequence 整个答案使用同一个潜在来源，RAG-Token 允许不同词依赖不同来源。[原文 §1–2](https://arxiv.org/pdf/2005.11401#page=2)

<figure><a href="https://arxiv.org/pdf/2005.11401#page=2"><img loading="lazy" src="/paper-am/assets/evidence/rag-figure-1.webp" alt="查询经过检索器、文档索引和生成器"></a><figcaption>Lewis 等，<a href="https://arxiv.org/pdf/2005.11401#page=2">原文图 1 · PDF 第 2 页</a>。看中间两段：检索器取回多篇候选文本，生成器结合问题和候选文本作答。</figcaption></figure>

## 数据、训练与证据

问答数据包括 Natural Questions、TriviaQA、WebQuestions、CuratedTREC，另测 MS MARCO、Jeopardy 和事实核验集 FEVER。问答以参考答案监督，无需逐题标注应该检索哪个段落。知识库来自英文维基百科。作者用 Fairseq 训练、FAISS 做向量检索，训练用 8 张 32 GB V100，文档索引存放在 CPU 内存。[原文 §3、附录 C](https://arxiv.org/pdf/2005.11401#page=17)

<figure><a href="https://arxiv.org/pdf/2005.11401#page=6"><img loading="lazy" src="/paper-am/assets/evidence/rag-table-1.webp" alt="四个开放域问答集上的完全匹配率"></a><figcaption>Lewis 等，<a href="https://arxiv.org/pdf/2005.11401#page=6">原文表 1 · PDF 第 6 页</a>。NQ 列可以直接比较 44.5 和 41.5。TriviaQA 包含两种测试集，应分别比较。</figcaption></figure>

## 公开评审与本站判断

**NeurIPS 综合评审**认为组合既有模型的方式清晰，主要保留意见是新颖性；实验表现和实际用途支持接收。[公开综合评审](https://papers.nips.cc/paper_files/paper/2020/file/6b493230205f780e1bc26945df7481e5-MetaReview.html)

**独立评议（ICLR 风格）**：倾向接收。脆弱假设是检索器给出的少量候选材料含有足以作答的证据。建议分别测「证据没找到」和「证据找对却答错」，并检验错误或过期资料是否诱导生成器。

**后续方法**：Self-RAG 明确引用原作，让模型学习何时要检索，并用特殊标记检查证据和答案；这直接针对固定检索可能引入无关材料的问题。[Self-RAG §1](https://arxiv.org/html/2310.11511#S1)

## 原有晨读手记
## 从一个具体问题读起

在一道开放域问答题里，检索器从维基百科索引中取回候选段落。论文比较了两种用法：整段生成共享同一个潜在来源，或者允许不同词依赖不同段落。

## 值得回看的地方

如果最后答案错了，单看输出很难知道是证据没找到，还是生成器没用好证据。读实验时，我会把这两种情形分别记下来。
