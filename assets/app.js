(function folioApp(){
"use strict";
const main = document.querySelector("main");
const notes = (window.paperNotes || []).slice().sort((a,b)=>b.date.localeCompare(a.date));
const cover = window.folioCover || "assets/cover.webp";
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"})[c]);
const noteUrl = n => "#note/" + encodeURIComponent(n.id);
const sourceUrl = s => {try {const u=new URL(s); return ["http:","https:"].includes(u.protocol) ? u.href : "";}catch{return "";}};
const topicOf = n => n.topic || "阅读笔记";
const fmtDate = d => d.replaceAll("-",".");
const sourceLink = n => sourceUrl(n.source) ? `<a class="source" href="${esc(sourceUrl(n.source))}" target="_blank" rel="noopener noreferrer">论文原文 <span aria-hidden="true">↗</span></a>` : "";
const guideGroups = [
  [
    "作者与研究背景",
    [
      [
        "team",
        "团队与机构",
        "作者人数、代表人物、机构成立时间及可核实的影响力。附机构或作者主页。"
      ],
      [
        "impact",
        "引用与开源",
        "注明核查日期、引用数据库、官方仓库、许可证与 stars 的统计范围。"
      ],
      [
        "intro",
        "引言",
        "作者要解决什么实际问题？"
      ],
      [
        "prior",
        "相关工作",
        "选最接近的一两条路线，用一句话说明它们留下了什么问题。"
      ]
    ]
  ],
  [
    "方法与实验证据",
    [
      [
        "idea",
        "目标与核心直觉",
        "用日常语言讲清输入、做法、输出。"
      ],
      [
        "contribution",
        "贡献与创新",
        "与最接近的工作相比新增了什么？哪项比较支持它？"
      ],
      [
        "experiment",
        "GPU、数据与工具",
        "区分训练、评估和已有模型的成本；列出数据集、标注情况、工具和平台。"
      ]
    ]
  ],
  [
    "评价与后续工作",
    [
      [
        "outside",
        "公开评价",
        "附原始评审、作者回应或大会记录；找不到时说明检索范围。"
      ],
      [
        "review",
        "ICLR 风格独立评议",
        "给出判断、最脆弱的假设、方法局限，以及最能改变结论的补充实验。"
      ],
      [
        "lineage",
        "后续方法",
        "列直接引用此文、并沿用其思路的论文，说明具体沿用了什么。"
      ],
      [
        "terms",
        "术语",
        "首次出现的仓库、工具或方法名，用一句话解释。"
      ],
      [
        "figures",
        "原图与表格",
        "用 Markdown 放入原图或截图：![图 1 的内容](图片网址)。下一行写作者、图表号、页码、读法和原文链接。可放多幅。"
      ]
    ]
  ]
];
const gpuOptions = ["需 GPU 训练","仅 GPU 评估","无需 GPU","未披露"];
const codeOptions = ["有公开实现","部分开放","未核实","不适用"];
function flagSelect(name,label,options,all){
  return `<label>${label}<select name="${name}"><option value="">${all}</option>${options.map(v=>`<option>${esc(v)}</option>`).join("")}</select></label>`;
}
function formatChecklist(){
  return guideGroups.map(([group,sections])=>`<details class="guide-section"><summary>${esc(group)}</summary>${sections.map(([key,title,prompt])=>`<label>${esc(title)}<textarea name="${key}" rows="2" placeholder="${esc(prompt)}"></textarea></label>`).join("")}</details>`).join("");
}
function guideSummary(n){
  if(!n.takeaway&&!n.caveat)return "";
  return `<dl class="screen-summary">${n.takeaway?`<div><dt>关键证据</dt><dd>${esc(n.takeaway)}</dd></div>`:""}${n.caveat?`<div><dt>阅读边界</dt><dd>${esc(n.caveat)}</dd></div>`:""}</dl>`;
}
function row(n){
  return `<li><a class="entry" href="${noteUrl(n)}"><time datetime="${esc(n.date)}"><span>${esc(n.date.slice(0,4))}</span><b>${esc(n.date.slice(5).replace("-","/"))}</b></time><div class="entry-text"><h3 lang="en">${esc(n.title)}</h3><p>${esc(n.subtitle || n.reason || "")}</p>${guideSummary(n)}</div><span class="topic">${esc(topicOf(n))}</span><span class="circle-arrow" aria-hidden="true">↗</span></a></li>`;
}
function home(){
  const n = notes[0];
  if(!n){main.innerHTML=`<section class="interior"><h1>论文晨读</h1><p>第一篇笔记将从这里开始。</p><a class="button" href="#write">写第一篇笔记</a></section>`; return;}
  main.innerHTML = `<section class="feature"><div class="feature-copy"><div class="issue"><span class="ink-dot"></span>本期选读 <span class="issue-rule"></span><time datetime="${esc(n.date)}">${fmtDate(n.date)}</time></div><h1 lang="en">${esc(n.title)}</h1>${n.subtitle?`<p class="feature-dek">${esc(n.subtitle)}</p>`:""}<p class="reason">${esc(n.reason || n.byline || "")}</p>${guideSummary(n)}<div class="actions"><a class="button" href="${noteUrl(n)}">阅读笔记 <span aria-hidden="true">→</span></a>${sourceLink(n)}</div></div><div class="cover"><img src="${cover}" alt="" width="1100" height="825"></div></section>
  <section class="recent"><div class="section-head"><h2>近期待读</h2><a class="all" href="#archive">全部 ${notes.length} 篇 <span aria-hidden="true">↗</span></a></div>${notes.length>1?`<ul class="entries">${notes.slice(1,Math.max(4,notes.filter(p=>p.date===n.date).length)).map(row).join("")}</ul>`:`<p>下一篇发布后，本期笔记会收进这里。</p>`}</section>`;
}
function archive(){
  main.innerHTML=`<section class="interior"><div class="page-head"><h1>全部笔记</h1><span class="count">共 ${notes.length} 篇</span></div><div class="filters"><label class="search-label">搜索笔记<input type="search" id="query" placeholder="搜索标题、作者或关键词"></label><label>主题<select id="topic"><option value="">全部主题</option>${[...new Set(notes.map(topicOf))].map(t=>`<option>${esc(t)}</option>`).join("")}</select></label>${flagSelect("gpu","GPU 使用",gpuOptions,"全部")}${flagSelect("openness","代码开放情况",codeOptions,"全部")}</div><p class="filter-count" aria-live="polite"></p><ul class="entries"></ul></section>`;
  const q=main.querySelector("#query"), topic=main.querySelector("#topic");
  function filter(){
    const term=q.value.trim().toLocaleLowerCase();
    const gpu=main.querySelector("[name=gpu]").value, openness=main.querySelector("[name=openness]").value;
    const matches=notes.filter(n=>(!gpu||gpu===n.gpu)&&(!openness||openness===n.openness)&&(!topic.value || topicOf(n)===topic.value) && [n.title,n.byline,n.subtitle,n.reason,n.takeaway,n.caveat,topicOf(n)].join(" ").toLocaleLowerCase().includes(term));
    main.querySelector(".entries").innerHTML=matches.map(row).join("");
    main.querySelector(".filter-count").textContent=matches.length===0 ? "没有找到笔记，换个关键词或主题试试。" : (term || topic.value || gpu || openness ? `找到 ${matches.length} 篇笔记` : "");
  }
  q.addEventListener("input",filter);main.querySelector(".filters").addEventListener("change",filter);filter();
}
function editNoteLink(n){
  if(typeof n.editPath !== "string" || !/^_posts\/[^/]+\.md$/i.test(n.editPath)) return "";
  const editUrl = "https://github.com/tPartf/paper-am/edit/gh-pages/" + n.editPath.split("/").map(encodeURIComponent).join("/");
  return `<div class="prose"><p><a class="source" href="${esc(editUrl)}" target="_blank" rel="noopener noreferrer">写我的评论 · GitHub ↗</a></p><p>有仓库写入权限的话，可在正文末尾添加 <code>## 我的评论</code>，写下想法后提交到 <code>gh-pages</code>。提交后评论会公开显示。</p></div>`;
}
function article(n){
  if(!n){main.innerHTML=`<section class="interior"><h1>这篇笔记还未收录</h1><a class="all" href="#archive">浏览全部笔记</a></section>`; return;}
  document.title=`${n.title} · 论文晨读`;
  main.innerHTML=`<article class="note"><a class="back" href="#archive">← 全部笔记</a><div class="meta"><time>${fmtDate(n.date)}</time><span class="topic">${esc(topicOf(n))}</span></div><h1 lang="en">${esc(n.title)}</h1><p class="dek">${esc(n.subtitle || "")}</p><div class="citation"><span>${esc(n.byline || "")}</span>${sourceLink(n)}</div>${n.reason?`<aside class="pull"><h2>为什么选它</h2><p>${esc(n.reason)}</p></aside>`:""}${guideSummary(n)}${editNoteLink(n)}<div class="prose">${n.body || ""}</div><a class="back lower" href="#archive">← 回到全部笔记</a></article>`;
}
function write(){
  const now=new Date();const date=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
  main.innerHTML=`<section class="author"><h1>写一篇晨读笔记</h1><p class="form-intro">每篇论文单独填写。先写推荐理由、证据和局限，再按需展开详细笔记。</p><form><label>论文标题<input name="title" required placeholder="How to Read a Paper"></label><div class="form-pair"><label>晨读日期<input name="date" type="date" value="${date}" required></label><label>主题<input name="topic" placeholder="阅读方法"></label></div><label>原文链接<input name="source" type="url" required placeholder="https://…" pattern="https?://.+"></label><label>作者与年份<input name="byline" placeholder="S. Keshav · 2007"></label><label>一句话导读<input name="subtitle" placeholder="今天想带着什么问题读？"></label><label>为什么选它<textarea name="reason" rows="2" required></textarea></label><label>关键证据<input name="takeaway" placeholder="哪个结果最能支持推荐？写清比较对象和指标。"></label><label>阅读边界<input name="caveat" placeholder="最限制结论的条件是什么？"></label><div class="form-pair">${flagSelect("gpu","GPU 使用",gpuOptions,"请选择")}${flagSelect("openness","代码开放情况",codeOptions,"请选择")}</div>${formatChecklist()}<label>读后笔记<textarea name="body" rows="5" placeholder="记下一个发现，或一个还想追问的问题。支持 Markdown。"></textarea></label><button class="button" type="submit">去 GitHub 发布 <span aria-hidden="true">↗</span></button><p class="status" role="status"></p><div class="handoff" hidden><a class="editor-link source" target="_blank" rel="noopener noreferrer">打开 GitHub 编辑器 ↗</a><details><summary>查看或复制待发布正文</summary><label>Markdown 正文<textarea class="ready-text" readonly rows="7"></textarea></label></details><button class="copy-note" type="button">复制正文</button></div></form></section>`;
  const form=main.querySelector("form");

  const next = form.querySelector(".handoff");
  const status = form.querySelector(".status");
  const fullText = form.querySelector(".ready-text");
  const editor = form.querySelector(".editor-link");
  const copy = form.querySelector(".copy-note");
  form.addEventListener("input", () => { next.hidden = true; status.textContent = ""; });
  copy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(fullText.value);
      status.textContent = "正文已复制，可以粘贴到 GitHub 编辑器。";
    } catch {
      next.querySelector("details").open = true;
      fullText.focus();
      fullText.select();
      status.textContent = "已选中正文，请使用设备的复制命令。";
    }
  });
  form.addEventListener("submit", event => {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(form));
    for (const key of ["title", "reason"]) {
      if (!fields[key].trim()) {
        form.elements[key].focus();
        status.textContent = key === "title" ? "请填写论文标题。" : "请写下推荐理由。";
        return;
      }
    }
    const header = ["title","subtitle","byline","topic","source","reason","takeaway","caveat","gpu","openness"]
      .map(key => `${key}: ${JSON.stringify(fields[key].trim())}`).join("\n");
    const sections = guideGroups.flatMap(([, items]) => items.filter(([key]) => fields[key].trim()).map(([key,title]) => `## ${title}\n\n${fields[key].trim()}`));
    if(fields.body.trim()) sections.push(fields.body.trim());
    const markdown = `---\n${header}\n---\n\n${sections.join("\n\n")}\n`;
    const words = fields.title.trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu,"-").replace(/^-|-$/g,"");
    const slug = [...words].slice(0,48).join("") || "note";
    const editorUrl = new URL("https://github.com/tPartf/paper-am/new/gh-pages");
    editorUrl.searchParams.set("filename", `_posts/${fields.date}-${slug}.md`);
    const prefilled = new URL(editorUrl);
    prefilled.searchParams.set("value", markdown);
    fullText.value = markdown;
    next.hidden = false;
    // Long encoded URLs may exceed a browser or GitHub's request-line limit.
    const fits = prefilled.href.length <= 6000;
    editor.href = fits ? prefilled.href : editorUrl.href;
    if (fits) {
      status.textContent = "请在 GitHub 核对内容后点 Commit changes。若新标签未打开，可用下方链接重试。";
      window.open(editor.href,"_blank","noopener,noreferrer");
    } else {
      status.textContent = "这篇笔记较长。请复制下方正文，打开 GitHub 编辑器，粘贴后点 Commit changes。";
      copy.focus();
    }
  });


}
function render(focus=false){
  const hash=location.hash.slice(1)||"home";
  if(hash==="main"){main.focus();return;}
  document.title="论文晨读 · Paper AM";
  const page=hash.startsWith("note/")?"note":hash;
  for(const a of document.querySelectorAll("[data-nav]")){
    if(a.dataset.nav===(page==="note"?"archive":page))a.setAttribute("aria-current","page");else a.removeAttribute("aria-current");
  }
  if(page==="archive")archive();else if(page==="write")write();else if(page==="note"){
    let id;try{id=decodeURIComponent(hash.slice(5));}catch{id="";}
    article(notes.find(n=>n.id===id));
  }else home();
  if(focus){main.focus({preventScroll:true});window.scrollTo(0,0);}
}
window.addEventListener("hashchange",()=>render(true));
document.querySelector(".skip").addEventListener("click",e=>{e.preventDefault();main.focus();});
render();
})();
