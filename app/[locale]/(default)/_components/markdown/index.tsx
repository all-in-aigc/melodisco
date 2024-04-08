import MarkdownIt from "markdown-it";
import React from "react";
import hljs from "highlight.js";

export default function ({ content }: { content: string }) {
  const md: MarkdownIt = new MarkdownIt({
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return `<pre class="hljs"><code>${
            hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
          }</code></pre>`;
        } catch (_) {}
      }

      return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
    },
  });

  md.use(function (md) {
    const citationRegex = /\[citation:(\d+)\]/gi;

    md.renderer.rules.citation = function (tokens, idx) {
      const citationId = tokens[idx].content;

      // return sup;
      return `<sup class="citation text-primary mx-0.5 text-md font-medium cursor-pointer" data-citation-id="${citationId}" id="cite-${citationId}">[${citationId}]</sup>`;
    };

    md.core.ruler.after("inline", "citation", function (state) {
      state.tokens.forEach((blockToken) => {
        if (blockToken.type === "inline" && blockToken.children) {
          let newChildren: any = [];
          blockToken.children.forEach((token, idx) => {
            if (token.type === "text") {
              const parts = token.content.split(citationRegex);
              for (let i = 0; i < parts.length; i++) {
                // Even parts are outside citations, odd parts are citation IDs
                if (i % 2 === 0 && parts[i]) {
                  newChildren.push(new state.Token("text", "", 0));
                  newChildren[newChildren.length - 1].content = parts[i];
                } else if (i % 2 === 1) {
                  const citationToken = new state.Token("citation", "", 0);
                  citationToken.content = parts[i];
                  newChildren.push(citationToken);
                }
              }
            } else {
              // For tokens that are not text, just pass them through
              newChildren.push(token);
            }
          });
          blockToken.children = newChildren;
        }
      });
    });
  });

  const renderedMarkdown = md.render(content);

  return <div dangerouslySetInnerHTML={{ __html: renderedMarkdown }} />;
}
