import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

const config = {
  // 启用html, 否则markdown中出现标签会以纯文本渲染
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch {}
    }

    return ''; // use external default escaping
  }
};

export default MarkdownIt(config);
