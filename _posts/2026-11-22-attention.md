---
title: "Attention Is All You Need"
subtitle: "让序列中的词直接看见彼此。"
byline: "Ashish Vaswani 等 · 2017"
topic: "自然语言处理"
source: "https://arxiv.org/abs/1706.03762"
reason: "从一张架构图开始，看看 Transformer 怎样在没有循环结构的情况下建立词与词之间的联系。"
takeaway: "WMT14 英德翻译上，大模型取得 28.4 BLEU；卷积模型集成为 26.36。"
caveat: "只凭两组翻译任务，很难判断极长文本上的收益。"
gpu: "需 GPU 训练"
openness: "有公开实现"
---

## 团队与影响

8 位共同贡献作者，署名包括 Google Brain、Google Research 和多伦多大学。Google Brain 始于 2011 年，曾推动神经网络研究进入 Google 产品；合作者 Aidan Gomez 后来共同创办了 Cohere。[机构史](https://deepmind.google/about/) · [Cohere 创办团队](https://cohere.com/about)

2026-11-23 查询：OpenAlex 的 arXiv 条目记录 **152,463 次引用**。官方 Tensor2Tensor 是包含多种模型的训练库，Apache-2.0 许可，已归档，**17,473 stars**。[引文条目](https://openalex.org/W2626778328) · [代码仓库](https://github.com/tensorflow/tensor2tensor)

## 问题、前作与核心直觉

传统循环模型按词依次训练，序列越长越难并行。卷积方法可以并行，但远处的词常需经过多层才能交换信息。作者让每个词直接给其他位置分配权重，挑出有用的信息；再加入位置信号，保留词序。**创新在整套翻译架构**：用多组注意力分别学习关系，训练时可以同时处理多个位置。[原文 §1–3](https://arxiv.org/pdf/1706.03762#page=2)

<figure><a href="https://arxiv.org/pdf/1706.03762#page=3"><img loading="lazy" src="/paper-am/assets/evidence/attention-figure-1.webp" alt="Transformer 的编码器、解码器与位置编码"></a><figcaption>Vaswani 等，<a href="https://arxiv.org/pdf/1706.03762#page=3">原文图 1 · PDF 第 3 页</a>。左侧读入源句，右侧生成译文。沿中间的连线看译文如何读取源句。</figcaption></figure>

## 数据、训练与证据

WMT 2014 英德、英法数据提供成对的原句和人工译文。作者在 8 张 NVIDIA P100 上训练，基础版约 12 小时，大模型约 3.5 天。BLEU 衡量译文与参考译文的短语重合程度。下表英法大模型一项为 41.8，同版 §6.1 正文写作 41.0；本站的结果对比采用表文一致的英德一列。[原文 §5–6](https://arxiv.org/pdf/1706.03762#page=7)

<figure><a href="https://arxiv.org/pdf/1706.03762#page=8"><img loading="lazy" src="/paper-am/assets/evidence/attention-table-2.webp" alt="不同翻译模型的英德、英法 BLEU 和估算训练成本"></a><figcaption>Vaswani 等，<a href="https://arxiv.org/pdf/1706.03762#page=8">原文表 2 · PDF 第 8 页</a>。比较 EN-DE 列的 ConvS2S Ensemble 和 Transformer (big)。成本列是估算值。</figcaption></figure>

## 公开评审与本站判断

**原始评审**肯定翻译对照和训练并行性；有评审复现时须从代码补超参数，另一位希望单独报告长句表现。[NeurIPS 公开评审](https://proceedings.neurips.cc/paper_files/paper/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Reviews.html)

**独立评议（ICLR 风格）**：倾向接收。最需要检验的假设是词间路径缩短就能更好地处理长距离依赖。每个词与每个词配对，序列翻倍时配对数约增至四倍。希望在相同算力下按句长比较质量和显存。

**后续方法**：BERT 明确沿用其编码器，用遮住部分词、再预测这些词的任务预训练，让模型同时利用左右文。[BERT §3](https://aclanthology.org/N19-1423.pdf)

## 原有晨读手记
## 图 1 的两条线索

先沿编码器读一遍，找出自注意力接收的输入。再沿解码器读一遍，区分掩码自注意力和读取编码器输出的注意力。两次经过同一个词「注意力」，可用的信息却不同。

## 想追的问题

如果把句子里两个词的位置互换，模型从哪里得到顺序变化的信息？带着这个问题回去读位置编码那一节。
