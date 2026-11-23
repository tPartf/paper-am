# Paper AM · 论文晨读

一个面向 GitHub Pages 的中文晨读模板。首页刊登日期最新的笔记，档案可以按标题、作者、关键词和主题查找。点「阅读笔记」看完整记录，点「论文原文」访问作者的文章。

## 发布网站

1. 在 GitHub 建一个公开仓库，勾选添加 README。
2. 解压模板，把 `index.html`、`assets`、`_config.yml`、`_layouts` 和 `_posts` 一起上传到仓库根目录。保留各文件夹的层级。
3. 进入 **Settings → Pages**，选择 **Deploy from a branch**，选择上传文件所在的分支和 **/(root)**，保存。部署完成后点 **Visit site**。
4. 四篇笔记是排版示例，日期是晨读记录的示例日期。你可以编辑或移除示例，换成自己的选文。站点依据笔记文件名里的日期排序。

## 每天写笔记

网页右上角的「写笔记」是一个 Markdown 文件生成器。填写标题、日期、原文链接和推荐理由，点「下载笔记」。把得到的文件上传到仓库的 `_posts` 并提交，GitHub Pages 就会更新网页。当天收录几篇论文，就分别添加几份文件。表单内容暂存在当前页面，离开前先下载。

也可以在 GitHub 网页端直接新建或编辑 Markdown。新文件名用 `YYYY-MM-DD-短标题.md`，复制一篇已有笔记并修改开头两行 `---` 之间的字段和下方正文。这里的 `title` 是论文标题，`subtitle` 是一句话导读，`reason` 会出现在首页；`topic` 用于筛选。阅读笔记正文支持标准 Markdown。默认时区为 Asia/Shanghai。

发布后的每篇笔记都可以复制浏览器地址分享。放在仓库子路径也能使用。根目录的 index.html 是 GitHub Pages 的入口，模板中的 entries.js 会在部署时由 Jekyll 生成。若要直接在电脑上体验，请打开随模板单独提供的单文件预览。

发布设置见 [GitHub Pages 官方文档](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。
