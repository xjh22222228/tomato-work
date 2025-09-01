import * as markdownit from 'markdown-it'
import anchor from 'markdown-it-anchor'
import hljs from 'highlight.js'

const config: markdownit.Options = {
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
  highlight: function (str: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value
      } catch {
        return str
      }
    }

    return ''
  },
}

const md = markdownit(config).use(anchor)

const defaultRender =
  md.renderer.rules.link_open ||
  function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options)
  }

md.renderer.rules.link_open = function (
  tokens: markdownit.Token[],
  idx: number,
  options: markdownit.Options,
  env: any,
  self,
) {
  const aIndex = tokens[idx].attrIndex('target')
  const isAnchor = tokens[idx]?.attrs?.[0]?.[1]?.startsWith('#')

  if (!isAnchor) {
    if (aIndex < 0) {
      tokens[idx].attrPush(['target', '_blank'])
    } else {
      if (tokens[idx]?.attrs?.[aIndex]?.[1]) {
        tokens[idx].attrs[aIndex][1] = '_blank'
      }
    }
  }

  return defaultRender(tokens, idx, options, env, self)
}

export default md
