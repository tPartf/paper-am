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
function row(n){
  return `<li><a class="entry" href="${noteUrl(n)}"><time datetime="${esc(n.date)}"><span>${esc(n.date.slice(0,4))}</span><b>${esc(n.date.slice(5).replace("-","/"))}</b></time><div class="entry-text"><h3 lang="en">${esc(n.title)}</h3><p>${esc(n.subtitle || n.reason || "")}</p></div><span class="topic">${esc(topicOf(n))}</span><span class="circle-arrow" aria-hidden="true">↗</span></a></li>`;
}
function home(){
  const n = notes[0];
  if(!n){main.innerHTML=`<section class="interior"><h1>论文晨读</h1><p>第一篇笔记将从这里开始。</p><a class="button" href="#write">写第一篇笔记</a></section>`; return;}
  main.innerHTML = `<section class="feature"><div class="feature-copy"><div class="issue"><span class="ink-dot"></span>本期选读 <span class="issue-rule"></span><time datetime="${esc(n.date)}">${fmtDate(n.date)}</time></div><h1 lang="en">${esc(n.title)}</h1>${n.subtitle?`<p class="feature-dek">${esc(n.subtitle)}</p>`:""}<p class="reason">${esc(n.reason || n.byline || "")}</p><div class="actions"><a class="button" href="${noteUrl(n)}">阅读笔记 <span aria-hidden="true">→</span></a>${sourceLink(n)}</div></div><div class="cover"><img src="${cover}" alt="" width="1100" height="825"></div></section>
  <section class="recent"><div class="section-head"><h2>往期晨读</h2><a class="all" href="#archive">全部 ${notes.length} 篇 <span aria-hidden="true">↗</span></a></div>${notes.length>1?`<ul class="entries">${notes.slice(1,4).map(row).join("")}</ul>`:`<p>下一篇发布后，本期笔记会收进这里。</p>`}</section>`;
}
function archive(){
  main.innerHTML=`<section class="interior"><div class="page-head"><h1>全部笔记</h1><span class="count">共 ${notes.length} 篇</span></div><div class="filters"><label class="search-label">搜索笔记<input type="search" id="query" placeholder="搜索标题、作者或关键词"></label><label>主题<select id="topic"><option value="">全部主题</option>${[...new Set(notes.map(topicOf))].map(t=>`<option>${esc(t)}</option>`).join("")}</select></label></div><p class="filter-count" aria-live="polite"></p><ul class="entries"></ul></section>`;
  const q=main.querySelector("#query"), topic=main.querySelector("#topic");
  function filter(){
    const term=q.value.trim().toLocaleLowerCase();
    const matches=notes.filter(n=>(!topic.value || topicOf(n)===topic.value) && [n.title,n.byline,n.subtitle,n.reason,topicOf(n)].join(" ").toLocaleLowerCase().includes(term));
    main.querySelector(".entries").innerHTML=matches.map(row).join("");
    main.querySelector(".filter-count").textContent=matches.length===0 ? "没有找到笔记，换个关键词或主题试试。" : (term || topic.value ? `找到 ${matches.length} 篇笔记` : "");
  }
  q.addEventListener("input",filter);topic.addEventListener("change",filter);filter();
}
function article(n){
  if(!n){main.innerHTML=`<section class="interior"><h1>这篇笔记还未收录</h1><a class="all" href="#archive">浏览全部笔记</a></section>`; return;}
  document.title=`${n.title} · 论文晨读`;
  main.innerHTML=`<article class="note"><a class="back" href="#archive">← 全部笔记</a><div class="meta"><time>${fmtDate(n.date)}</time><span class="topic">${esc(topicOf(n))}</span></div><h1 lang="en">${esc(n.title)}</h1><p class="dek">${esc(n.subtitle || "")}</p><div class="citation"><span>${esc(n.byline || "")}</span>${sourceLink(n)}</div>${n.reason?`<aside class="pull"><h2>为什么选它</h2><p>${esc(n.reason)}</p></aside>`:""}<div class="prose">${n.body || ""}</div><a class="back lower" href="#archive">← 回到全部笔记</a></article>`;
}
function write(){
  const now=new Date();const date=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
  main.innerHTML=`<section class="author"><h1>写一篇晨读笔记</h1><p class="form-intro">写好后下载 Markdown 文件，放进 GitHub 仓库的 <code>_posts</code> 文件夹即可发布。</p><form><label>论文标题<input name="title" required placeholder="How to Read a Paper"></label><div class="form-pair"><label>晨读日期<input name="date" type="date" value="${date}" required></label><label>主题<input name="topic" placeholder="阅读方法"></label></div><label>原文链接<input name="source" type="url" required placeholder="https://…" pattern="https?://.+"></label><label>作者与年份<input name="byline" placeholder="S. Keshav · 2007"></label><label>一句话导读<input name="subtitle" placeholder="今天想带着什么问题读？"></label><label>为什么选它<textarea name="reason" rows="2" required></textarea></label><label>读后笔记<textarea name="body" rows="5" placeholder="记下一个发现，或一个还想追问的问题。支持 Markdown。"></textarea></label><button class="button" type="submit">下载笔记 <span aria-hidden="true">↓</span></button><p class="status" role="status"></p></form></section>`;
  const form=main.querySelector("form");
  form.addEventListener("submit",e=>{
    e.preventDefault();
    const f=Object.fromEntries(new FormData(form)); 
    const head=["title","subtitle","byline","topic","source","reason"].map(k=>`${k}: ${JSON.stringify(f[k].trim())}`).join("\n");
    const file=new Blob([`---\n${head}\n---\n\n${f.body.trim()}\n`],{type:"text/markdown;charset=utf-8"});
    const slug=f.title.trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu,"-").replace(/^-|-$/g,"").slice(0,85)||"note";
    const a=document.createElement("a");a.href=URL.createObjectURL(file);a.download=`${f.date}-${slug}.md`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
    form.querySelector(".status").textContent=`已生成 ${a.download}。提交到仓库的 _posts 文件夹后，读者就能看到。`;
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
