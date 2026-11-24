---
layout: null
permalink: /assets/entries.js
---
window.paperNotes = [
{% for post in site.posts %}
{
  id: {{ post.id | jsonify }},
  editPath: {{ post.path | jsonify }},
  date: {{ post.date | date: "%Y-%m-%d" | jsonify }},
  title: {{ post.title | jsonify }},
  subtitle: {{ post.subtitle | jsonify }},
  byline: {{ post.byline | jsonify }},
  topic: {{ post.topic | jsonify }},
  source: {{ post.source | jsonify }},
  reason: {{ post.reason | jsonify }},
  takeaway: {{ post.takeaway | jsonify }},
  caveat: {{ post.caveat | jsonify }},
  gpu: {{ post.gpu | jsonify }},
  openness: {{ post.openness | jsonify }},
  body: {{ post.content | markdownify | jsonify }}
}{% unless forloop.last %},{% endunless %}
{% endfor %}
];

