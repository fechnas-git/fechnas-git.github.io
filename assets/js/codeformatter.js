/* http://prismjs.com/download.html?themes=prism&languages=markup+css+css-extras+clike+javascript+java+php+php-extras+coffeescript+scss+bash+c+cpp+python+sql+groovy+http+ruby+gherkin+csharp+go+nsis+aspnet&plugins=line-highlight+line-numbers+show-invisibles+autolinker+wpd+file-highlight+show-language */
var self = typeof window != "undefined" ? window : {},
  Prism = (function () {
    var e = /\blang(?:uage)?-(?!\*)(\w+)\b/i,
      t = (self.Prism = {
        util: {
          type: function (e) {
            return Object.prototype.toString
              .call(e)
              .match(/\[object (\w+)\]/)[1];
          },
          clone: function (e) {
            var n = t.util.type(e);
            switch (n) {
              case "Object":
                var r = {};
                for (var i in e)
                  e.hasOwnProperty(i) && (r[i] = t.util.clone(e[i]));
                return r;
              case "Array":
                return e.slice();
            }
            return e;
          },
        },
        languages: {
          extend: function (e, n) {
            var r = t.util.clone(t.languages[e]);
            for (var i in n) r[i] = n[i];
            return r;
          },
          insertBefore: function (e, n, r, i) {
            i = i || t.languages;
            var s = i[e],
              o = {};
            for (var u in s)
              if (s.hasOwnProperty(u)) {
                if (u == n)
                  for (var a in r) r.hasOwnProperty(a) && (o[a] = r[a]);
                o[u] = s[u];
              }
            return (i[e] = o);
          },
          DFS: function (e, n) {
            for (var r in e) {
              n.call(e, r, e[r]);
              t.util.type(e) === "Object" && t.languages.DFS(e[r], n);
            }
          },
        },
        highlightAll: function (e, n) {
          var r = document.querySelectorAll(
            'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
          );
          for (var i = 0, s; (s = r[i++]); ) t.highlightElement(s, e === !0, n);
        },
        highlightElement: function (r, i, s) {
          var o,
            u,
            a = r;
          while (a && !e.test(a.className)) a = a.parentNode;
          if (a) {
            o = (a.className.match(e) || [, ""])[1];
            u = t.languages[o];
          }
          if (!u) return;
          r.className =
            r.className.replace(e, "").replace(/\s+/g, " ") + " language-" + o;
          a = r.parentNode;
          /pre/i.test(a.nodeName) &&
            (a.className =
              a.className.replace(e, "").replace(/\s+/g, " ") +
              " language-" +
              o);
          var f = r.textContent;
          if (!f) return;
          f = f
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/\u00a0/g, " ");
          var l = { element: r, language: o, grammar: u, code: f };
          t.hooks.run("before-highlight", l);
          if (i && self.Worker) {
            var c = new Worker(t.filename);
            c.onmessage = function (e) {
              l.highlightedCode = n.stringify(JSON.parse(e.data), o);
              t.hooks.run("before-insert", l);
              l.element.innerHTML = l.highlightedCode;
              s && s.call(l.element);
              t.hooks.run("after-highlight", l);
            };
            c.postMessage(
              JSON.stringify({ language: l.language, code: l.code })
            );
          } else {
            l.highlightedCode = t.highlight(l.code, l.grammar, l.language);
            t.hooks.run("before-insert", l);
            l.element.innerHTML = l.highlightedCode;
            s && s.call(r);
            t.hooks.run("after-highlight", l);
          }
        },
        highlight: function (e, r, i) {
          return n.stringify(t.tokenize(e, r), i);
        },
        tokenize: function (e, n, r) {
          var i = t.Token,
            s = [e],
            o = n.rest;
          if (o) {
            for (var u in o) n[u] = o[u];
            delete n.rest;
          }
          e: for (var u in n) {
            if (!n.hasOwnProperty(u) || !n[u]) continue;
            var a = n[u],
              f = a.inside,
              l = !!a.lookbehind,
              c = 0;
            a = a.pattern || a;
            for (var h = 0; h < s.length; h++) {
              var p = s[h];
              if (s.length > e.length) break e;
              if (p instanceof i) continue;
              a.lastIndex = 0;
              var d = a.exec(p);
              if (d) {
                l && (c = d[1].length);
                var v = d.index - 1 + c,
                  d = d[0].slice(c),
                  m = d.length,
                  g = v + m,
                  y = p.slice(0, v + 1),
                  b = p.slice(g + 1),
                  w = [h, 1];
                y && w.push(y);
                var E = new i(u, f ? t.tokenize(d, f) : d);
                w.push(E);
                b && w.push(b);
                Array.prototype.splice.apply(s, w);
              }
            }
          }
          return s;
        },
        hooks: {
          all: {},
          add: function (e, n) {
            var r = t.hooks.all;
            r[e] = r[e] || [];
            r[e].push(n);
          },
          run: function (e, n) {
            var r = t.hooks.all[e];
            if (!r || !r.length) return;
            for (var i = 0, s; (s = r[i++]); ) s(n);
          },
        },
      }),
      n = (t.Token = function (e, t) {
        this.type = e;
        this.content = t;
      });
    n.stringify = function (e, r, i) {
      if (typeof e == "string") return e;
      if (Object.prototype.toString.call(e) == "[object Array]")
        return e
          .map(function (t) {
            return n.stringify(t, r, e);
          })
          .join("");
      var s = {
        type: e.type,
        content: n.stringify(e.content, r, i),
        tag: "span",
        classes: ["token", e.type],
        attributes: {},
        language: r,
        parent: i,
      };
      s.type == "comment" && (s.attributes.spellcheck = "true");
      t.hooks.run("wrap", s);
      var o = "";
      for (var u in s.attributes) o += u + '="' + (s.attributes[u] || "") + '"';
      return (
        "<" +
        s.tag +
        ' class="' +
        s.classes.join(" ") +
        '" ' +
        o +
        ">" +
        s.content +
        "</" +
        s.tag +
        ">"
      );
    };
    if (!self.document) {
      if (!self.addEventListener) return self.Prism;
      self.addEventListener(
        "message",
        function (e) {
          var n = JSON.parse(e.data),
            r = n.language,
            i = n.code;
          self.postMessage(JSON.stringify(t.tokenize(i, t.languages[r])));
          self.close();
        },
        !1
      );
      return self.Prism;
    }
    var r = document.getElementsByTagName("script");
    r = r[r.length - 1];
    if (r) {
      t.filename = r.src;
      document.addEventListener &&
        !r.hasAttribute("data-manual") &&
        document.addEventListener("DOMContentLoaded", t.highlightAll);
    }
    return self.Prism;
  })();
typeof module != "undefined" && module.exports && (module.exports = Prism);
Prism.languages.markup = {
  comment: /&lt;!--[\w\W]*?-->/g,
  prolog: /&lt;\?.+?\?>/,
  doctype: /&lt;!DOCTYPE.+?>/,
  cdata: /&lt;!\[CDATA\[[\w\W]*?]]>/i,
  tag: {
    pattern:
      /&lt;\/?[\w:-]+\s*(?:\s+[\w:-]+(?:=(?:("|')(\\?[\w\W])*?\1|[^\s'">=]+))?\s*)*\/?>/gi,
    inside: {
      tag: {
        pattern: /^&lt;\/?[\w:-]+/i,
        inside: { punctuation: /^&lt;\/?/, namespace: /^[\w-]+?:/ },
      },
      "attr-value": {
        pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/gi,
        inside: { punctuation: /=|>|"/g },
      },
      punctuation: /\/?>/g,
      "attr-name": { pattern: /[\w:-]+/g, inside: { namespace: /^[\w-]+?:/ } },
    },
  },
  entity: /&amp;#?[\da-z]{1,8};/gi,
};
Prism.hooks.add("wrap", function (e) {
  e.type === "entity" && (e.attributes.title = e.content.replace(/&amp;/, "&"));
});
Prism.languages.css = {
  comment: /\/\*[\w\W]*?\*\//g,
  atrule: {
    pattern: /@[\w-]+?.*?(;|(?=\s*{))/gi,
    inside: { punctuation: /[;:]/g },
  },
  url: /url\((["']?).*?\1\)/gi,
  selector: /[^\{\}\s][^\{\};]*(?=\s*\{)/g,
  property: /(\b|\B)[\w-]+(?=\s*:)/gi,
  string: /("|')(\\?.)*?\1/g,
  important: /\B!important\b/gi,
  ignore: /&(lt|gt|amp);/gi,
  punctuation: /[\{\};:]/g,
};
Prism.languages.markup &&
  Prism.languages.insertBefore("markup", "tag", {
    style: {
      pattern: /(&lt;|<)style[\w\W]*?(>|&gt;)[\w\W]*?(&lt;|<)\/style(>|&gt;)/gi,
      inside: {
        tag: {
          pattern: /(&lt;|<)style[\w\W]*?(>|&gt;)|(&lt;|<)\/style(>|&gt;)/gi,
          inside: Prism.languages.markup.tag.inside,
        },
        rest: Prism.languages.css,
      },
    },
  });
Prism.languages.css.selector = {
  pattern: /[^\{\}\s][^\{\}]*(?=\s*\{)/g,
  inside: {
    "pseudo-element":
      /:(?:after|before|first-letter|first-line|selection)|::[-\w]+/g,
    "pseudo-class": /:[-\w]+(?:\(.*\))?/g,
    class: /\.[-:\.\w]+/g,
    id: /#[-:\.\w]+/g,
  },
};
Prism.languages.insertBefore("css", "ignore", {
  hexcode: /#[\da-f]{3,6}/gi,
  entity: /\\[\da-f]{1,8}/gi,
  number: /[\d%\.]+/g,
  function:
    /(attr|calc|cross-fade|cycle|element|hsla?|image|lang|linear-gradient|matrix3d|matrix|perspective|radial-gradient|repeating-linear-gradient|repeating-radial-gradient|rgba?|rotatex|rotatey|rotatez|rotate3d|rotate|scalex|scaley|scalez|scale3d|scale|skewx|skewy|skew|steps|translatex|translatey|translatez|translate3d|translate|url|var)/gi,
});
Prism.languages.clike = {
  comment: {
    pattern: /(^|[^\\])(\/\*[\w\W]*?\*\/|(^|[^:])\/\/.*?(\r?\n|$))/g,
    lookbehind: !0,
  },
  string: /("|')(\\?.)*?\1/g,
  "class-name": {
    pattern:
      /((?:(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/gi,
    lookbehind: !0,
    inside: { punctuation: /(\.|\\)/ },
  },
  keyword:
    /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/g,
  boolean: /\b(true|false)\b/g,
  function: { pattern: /[a-z0-9_]+\(/gi, inside: { punctuation: /\(/ } },
  number: /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?)\b/g,
  operator:
    /[-+]{1,2}|!|&lt;=?|>=?|={1,3}|(&amp;){1,2}|\|?\||\?|\*|\/|\~|\^|\%/g,
  ignore: /&(lt|gt|amp);/gi,
  punctuation: /[{}[\];(),.:]/g,
};
Prism.languages.javascript = Prism.languages.extend("clike", {
  keyword:
    /\b(var|let|if|else|while|do|for|return|in|instanceof|function|get|set|new|with|typeof|try|throw|catch|finally|null|break|continue|this)\b/g,
  number: /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?|NaN|-?Infinity)\b/g,
});
Prism.languages.insertBefore("javascript", "keyword", {
  regex: {
    pattern:
      /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\r\n])+\/[gim]{0,3}(?=\s*($|[\r\n,.;})]))/g,
    lookbehind: !0,
  },
});
Prism.languages.markup &&
  Prism.languages.insertBefore("markup", "tag", {
    script: {
      pattern:
        /(&lt;|<)script[\w\W]*?(>|&gt;)[\w\W]*?(&lt;|<)\/script(>|&gt;)/gi,
      inside: {
        tag: {
          pattern: /(&lt;|<)script[\w\W]*?(>|&gt;)|(&lt;|<)\/script(>|&gt;)/gi,
          inside: Prism.languages.markup.tag.inside,
        },
        rest: Prism.languages.javascript,
      },
    },
  });
Prism.languages.java = Prism.languages.extend("clike", {
  keyword:
    /\b(abstract|continue|for|new|switch|assert|default|goto|package|synchronized|boolean|do|if|private|this|break|double|implements|protected|throw|byte|else|import|public|throws|case|enum|instanceof|return|transient|catch|extends|int|short|try|char|final|interface|static|void|class|finally|long|strictfp|volatile|const|float|native|super|while)\b/g,
  number:
    /\b0b[01]+\b|\b0x[\da-f]*\.?[\da-fp\-]+\b|\b\d*\.?\d+[e]?[\d]*[df]\b|\W\d*\.?\d+\b/gi,
  operator: {
    pattern:
      /([^\.]|^)([-+]{1,2}|!|=?&lt;|=?&gt;|={1,2}|(&amp;){1,2}|\|?\||\?|\*|\/|%|\^|(&lt;){2}|($gt;){2,3}|:|~)/g,
    lookbehind: !0,
  },
});
/**
 * Original by Aaron Harun: http://aahacreative.com/2012/07/31/php-syntax-highlighting-prism/
 * Modified by Miles Johnson: http://milesj.me
 *
 * Supports the following:
 * 		- Extends clike syntax
 * 		- Support for PHP 5.3 and 5.4 (namespaces, traits, etc)
 * 		- Smarter constant and function matching
 *
 * Adds the following new token classes:
 * 		constant, delimiter, variable, function, package
 */ Prism.languages.php = Prism.languages.extend("clike", {
  keyword:
    /\b(and|or|xor|array|as|break|case|cfunction|class|const|continue|declare|default|die|do|else|elseif|enddeclare|endfor|endforeach|endif|endswitch|endwhile|extends|for|foreach|function|include|include_once|global|if|new|return|static|switch|use|require|require_once|var|while|abstract|interface|public|implements|private|protected|parent|throw|null|echo|print|trait|namespace|final|yield|goto|instanceof|finally|try|catch)\b/gi,
  constant: /\b[A-Z0-9_]{2,}\b/g,
});
Prism.languages.insertBefore("php", "keyword", {
  delimiter: /(\?>|&lt;\?php|&lt;\?)/gi,
  variable: /(\$\w+)\b/gi,
  package: {
    pattern: /(\\|namespace\s+|use\s+)[\w\\]+/g,
    lookbehind: !0,
    inside: { punctuation: /\\/ },
  },
});
Prism.languages.insertBefore("php", "operator", {
  property: { pattern: /(->)[\w]+/g, lookbehind: !0 },
});
if (Prism.languages.markup) {
  Prism.hooks.add("before-highlight", function (e) {
    if (e.language !== "php") return;
    e.tokenStack = [];
    e.code = e.code.replace(
      /(?:&lt;\?php|&lt;\?|<\?php|<\?)[\w\W]*?(?:\?&gt;|\?>)/gi,
      function (t) {
        e.tokenStack.push(t);
        return "{{{PHP" + e.tokenStack.length + "}}}";
      }
    );
  });
  Prism.hooks.add("after-highlight", function (e) {
    if (e.language !== "php") return;
    for (var t = 0, n; (n = e.tokenStack[t]); t++)
      e.highlightedCode = e.highlightedCode.replace(
        "{{{PHP" + (t + 1) + "}}}",
        Prism.highlight(n, e.grammar, "php")
      );
    e.element.innerHTML = e.highlightedCode;
  });
  Prism.hooks.add("wrap", function (e) {
    e.language === "php" &&
      e.type === "markup" &&
      (e.content = e.content.replace(
        /(\{\{\{PHP[0-9]+\}\}\})/g,
        '<span class="token php">$1</span>'
      ));
  });
  Prism.languages.insertBefore("php", "comment", {
    markup: {
      pattern: /(&lt;|<)[^?]\/?(.*?)(>|&gt;)/g,
      inside: Prism.languages.markup,
    },
    php: /\{\{\{PHP[0-9]+\}\}\}/g,
  });
}
Prism.languages.insertBefore("php", "variable", {
  this: /\$this/g,
  global:
    /\$_?(GLOBALS|SERVER|GET|POST|FILES|REQUEST|SESSION|ENV|COOKIE|HTTP_RAW_POST_DATA|argc|argv|php_errormsg|http_response_header)/g,
  scope: {
    pattern: /\b[\w\\]+::/g,
    inside: { keyword: /(static|self|parent)/, punctuation: /(::|\\)/ },
  },
});
Prism.languages.coffeescript = Prism.languages.extend("javascript", {
  "block-comment": /([#]{3}\s*\r?\n(.*\s*\r*\n*)\s*?\r?\n[#]{3})/g,
  comment: /(\s|^)([#]{1}[^#^\r^\n]{2,}?(\r?\n|$))/g,
  keyword:
    /\b(this|window|delete|class|extends|namespace|extend|ar|let|if|else|while|do|for|each|of|return|in|instanceof|new|with|typeof|try|catch|finally|null|undefined|break|continue)\b/g,
});
Prism.languages.insertBefore("coffeescript", "keyword", {
  function: {
    pattern: /[a-z|A-z]+\s*[:|=]\s*(\([.|a-z\s|,|:|{|}|\"|\'|=]*\))?\s*-&gt;/gi,
    inside: {
      "function-name": /[_?a-z-|A-Z-]+(\s*[:|=])| @[_?$?a-z-|A-Z-]+(\s*)| /g,
      operator: /[-+]{1,2}|!|=?&lt;|=?&gt;|={1,2}|(&amp;){1,2}|\|?\||\?|\*|\//g,
    },
  },
  "attr-name": /[_?a-z-|A-Z-]+(\s*:)| @[_?$?a-z-|A-Z-]+(\s*)| /g,
});
Prism.languages.scss = Prism.languages.extend("css", {
  comment: {
    pattern: /(^|[^\\])(\/\*[\w\W]*?\*\/|\/\/.*?(\r?\n|$))/g,
    lookbehind: !0,
  },
  atrule: /@[\w-]+(?=\s+(\(|\{|;))/gi,
  url: /([-a-z]+-)*url(?=\()/gi,
  selector:
    /([^@;\{\}\(\)]?([^@;\{\}\(\)]|&amp;|\#\{\$[-_\w]+\})+)(?=\s*\{(\}|\s|[^\}]+(:|\{)[^\}]+))/gm,
});
Prism.languages.insertBefore("scss", "atrule", {
  keyword:
    /@(if|else if|else|for|each|while|import|extend|debug|warn|mixin|include|function|return|content)|(?=@for\s+\$[-_\w]+\s)+from/i,
});
Prism.languages.insertBefore("scss", "property", {
  variable: /((\$[-_\w]+)|(#\{\$[-_\w]+\}))/i,
});
Prism.languages.insertBefore("scss", "ignore", {
  placeholder: /%[-_\w]+/i,
  statement: /\B!(default|optional)\b/gi,
  boolean: /\b(true|false)\b/g,
  null: /\b(null)\b/g,
  operator: /\s+([-+]{1,2}|={1,2}|!=|\|?\||\?|\*|\/|\%)\s+/g,
});
Prism.languages.bash = Prism.languages.extend("clike", {
  comment: { pattern: /(^|[^"{\\])(#.*?(\r?\n|$))/g, lookbehind: !0 },
  string: {
    pattern: /("|')(\\?[\s\S])*?\1/g,
    inside: { property: /\$([a-zA-Z0-9_#\?\-\*!@]+|\{[^\}]+\})/g },
  },
  keyword:
    /\b(if|then|else|elif|fi|for|break|continue|while|in|case|function|select|do|done|until|echo|exit|return|set|declare)\b/g,
});
Prism.languages.insertBefore("bash", "keyword", {
  property: /\$([a-zA-Z0-9_#\?\-\*!@]+|\{[^}]+\})/g,
});
Prism.languages.insertBefore("bash", "comment", {
  important: /(^#!\s*\/bin\/bash)|(^#!\s*\/bin\/sh)/g,
});
Prism.languages.c = Prism.languages.extend("clike", {
  keyword:
    /\b(asm|typeof|inline|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while)\b/g,
  operator:
    /[-+]{1,2}|!=?|&lt;{1,2}=?|&gt;{1,2}=?|\-&gt;|={1,2}|\^|~|%|(&amp;){1,2}|\|?\||\?|\*|\//g,
});
Prism.languages.insertBefore("c", "keyword", {
  property: {
    pattern: /#[a-zA-Z]+\ .*/g,
    inside: { property: /&lt;[a-zA-Z.]+>/g },
  },
});
Prism.languages.cpp = Prism.languages.extend("c", {
  keyword:
    /\b(alignas|alignof|asm|auto|bool|break|case|catch|char|char16_t|char32_t|class|compl|const|constexpr|const_cast|continue|decltype|default|delete|delete\[\]|do|double|dynamic_cast|else|enum|explicit|export|extern|float|for|friend|goto|if|inline|int|long|mutable|namespace|new|new\[\]|noexcept|nullptr|operator|private|protected|public|register|reinterpret_cast|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|try|typedef|typeid|typename|union|unsigned|using|virtual|void|volatile|wchar_t|while)\b/g,
  operator:
    /[-+]{1,2}|!=?|&lt;{1,2}=?|&gt;{1,2}=?|\-&gt;|:{1,2}|={1,2}|\^|~|%|(&amp;){1,2}|\|?\||\?|\*|\/|\b(and|and_eq|bitand|bitor|not|not_eq|or|or_eq|xor|xor_eq)\b/g,
});
Prism.languages.python = {
  comment: { pattern: /(^|[^\\])#.*?(\r?\n|$)/g, lookbehind: !0 },
  string: /("|')(\\?.)*?\1/g,
  keyword:
    /\b(as|assert|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|pass|print|raise|return|try|while|with|yield)\b/g,
  boolean: /\b(True|False)\b/g,
  number: /\b-?(0x)?\d*\.?[\da-f]+\b/g,
  operator:
    /[-+]{1,2}|=?&lt;|=?&gt;|!|={1,2}|(&){1,2}|(&amp;){1,2}|\|?\||\?|\*|\/|~|\^|%|\b(or|and|not)\b/g,
  ignore: /&(lt|gt|amp);/gi,
  punctuation: /[{}[\];(),.:]/g,
};
Prism.languages.sql = {
  comment: {
    pattern: /(^|[^\\])(\/\*[\w\W]*?\*\/|((--)|(\/\/)|#).*?(\r?\n|$))/g,
    lookbehind: !0,
  },
  string: /("|')(\\?.)*?\1/g,
  keyword:
    /\b(ACTION|ADD|AFTER|ALGORITHM|ALTER|ANALYZE|APPLY|AS|ASC|AUTHORIZATION|BACKUP|BDB|BEGIN|BERKELEYDB|BIGINT|BINARY|BIT|BLOB|BOOL|BOOLEAN|BREAK|BROWSE|BTREE|BULK|BY|CALL|CASCADE|CASCADED|CASE|CHAIN|CHAR VARYING|CHARACTER VARYING|CHECK|CHECKPOINT|CLOSE|CLUSTERED|COALESCE|COLUMN|COLUMNS|COMMENT|COMMIT|COMMITTED|COMPUTE|CONNECT|CONSISTENT|CONSTRAINT|CONTAINS|CONTAINSTABLE|CONTINUE|CONVERT|CREATE|CROSS|CURRENT|CURRENT_DATE|CURRENT_TIME|CURRENT_TIMESTAMP|CURRENT_USER|CURSOR|DATA|DATABASE|DATABASES|DATETIME|DBCC|DEALLOCATE|DEC|DECIMAL|DECLARE|DEFAULT|DEFINER|DELAYED|DELETE|DENY|DESC|DESCRIBE|DETERMINISTIC|DISABLE|DISCARD|DISK|DISTINCT|DISTINCTROW|DISTRIBUTED|DO|DOUBLE|DOUBLE PRECISION|DROP|DUMMY|DUMP|DUMPFILE|DUPLICATE KEY|ELSE|ENABLE|ENCLOSED BY|END|ENGINE|ENUM|ERRLVL|ERRORS|ESCAPE|ESCAPED BY|EXCEPT|EXEC|EXECUTE|EXIT|EXPLAIN|EXTENDED|FETCH|FIELDS|FILE|FILLFACTOR|FIRST|FIXED|FLOAT|FOLLOWING|FOR|FOR EACH ROW|FORCE|FOREIGN|FREETEXT|FREETEXTTABLE|FROM|FULL|FUNCTION|GEOMETRY|GEOMETRYCOLLECTION|GLOBAL|GOTO|GRANT|GROUP|HANDLER|HASH|HAVING|HOLDLOCK|IDENTITY|IDENTITY_INSERT|IDENTITYCOL|IF|IGNORE|IMPORT|INDEX|INFILE|INNER|INNODB|INOUT|INSERT|INT|INTEGER|INTERSECT|INTO|INVOKER|ISOLATION LEVEL|JOIN|KEY|KEYS|KILL|LANGUAGE SQL|LAST|LEFT|LIMIT|LINENO|LINES|LINESTRING|LOAD|LOCAL|LOCK|LONGBLOB|LONGTEXT|MATCH|MATCHED|MEDIUMBLOB|MEDIUMINT|MEDIUMTEXT|MERGE|MIDDLEINT|MODIFIES SQL DATA|MODIFY|MULTILINESTRING|MULTIPOINT|MULTIPOLYGON|NATIONAL|NATIONAL CHAR VARYING|NATIONAL CHARACTER|NATIONAL CHARACTER VARYING|NATIONAL VARCHAR|NATURAL|NCHAR|NCHAR VARCHAR|NEXT|NO|NO SQL|NOCHECK|NOCYCLE|NONCLUSTERED|NULLIF|NUMERIC|OF|OFF|OFFSETS|ON|OPEN|OPENDATASOURCE|OPENQUERY|OPENROWSET|OPTIMIZE|OPTION|OPTIONALLY|ORDER|OUT|OUTER|OUTFILE|OVER|PARTIAL|PARTITION|PERCENT|PIVOT|PLAN|POINT|POLYGON|PRECEDING|PRECISION|PREV|PRIMARY|PRINT|PRIVILEGES|PROC|PROCEDURE|PUBLIC|PURGE|QUICK|RAISERROR|READ|READS SQL DATA|READTEXT|REAL|RECONFIGURE|REFERENCES|RELEASE|RENAME|REPEATABLE|REPLICATION|REQUIRE|RESTORE|RESTRICT|RETURN|RETURNS|REVOKE|RIGHT|ROLLBACK|ROUTINE|ROWCOUNT|ROWGUIDCOL|ROWS?|RTREE|RULE|SAVE|SAVEPOINT|SCHEMA|SELECT|SERIAL|SERIALIZABLE|SESSION|SESSION_USER|SET|SETUSER|SHARE MODE|SHOW|SHUTDOWN|SIMPLE|SMALLINT|SNAPSHOT|SOME|SONAME|START|STARTING BY|STATISTICS|STATUS|STRIPED|SYSTEM_USER|TABLE|TABLES|TABLESPACE|TEMPORARY|TEMPTABLE|TERMINATED BY|TEXT|TEXTSIZE|THEN|TIMESTAMP|TINYBLOB|TINYINT|TINYTEXT|TO|TOP|TRAN|TRANSACTION|TRANSACTIONS|TRIGGER|TRUNCATE|TSEQUAL|TYPE|TYPES|UNBOUNDED|UNCOMMITTED|UNDEFINED|UNION|UNPIVOT|UPDATE|UPDATETEXT|USAGE|USE|USER|USING|VALUE|VALUES|VARBINARY|VARCHAR|VARCHARACTER|VARYING|VIEW|WAITFOR|WARNINGS|WHEN|WHERE|WHILE|WITH|WITH ROLLUP|WITHIN|WORK|WRITE|WRITETEXT)\b/gi,
  boolean: /\b(TRUE|FALSE|NULL)\b/gi,
  number: /\b-?(0x)?\d*\.?[\da-f]+\b/g,
  operator:
    /\b(ALL|AND|ANY|BETWEEN|EXISTS|IN|LIKE|NOT|OR|IS|UNIQUE|CHARACTER SET|COLLATE|DIV|OFFSET|REGEXP|RLIKE|SOUNDS LIKE|XOR)\b|[-+]{1}|!|=?&lt;|=?&gt;|={1}|(&amp;){1,2}|\|?\||\?|\*|\//gi,
  ignore: /&(lt|gt|amp);/gi,
  punctuation: /[;[\]()`,.]/g,
};
Prism.languages.groovy = Prism.languages.extend("clike", {
  keyword:
    /\b(as|def|in|abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|trait|transient|try|void|volatile|while)\b/g,
  string: /("""|''')[\W\w]*?\1|("|'|\/)[\W\w]*?\2|(\$\/)(\$\/\$|[\W\w])*?\/\$/g,
  number:
    /\b0b[01_]+\b|\b0x[\da-f_]+(\.[\da-f_p\-]+)?\b|\b[\d_]+(\.[\d_]+[e]?[\d]*)?[glidf]\b|[\d_]+(\.[\d_]+)?\b/gi,
  operator: {
    pattern:
      /(^|[^.])(={0,2}~|\?\.|\*?\.@|\.&amp;|\.{1,2}(?!\.)|\.{2}(&lt;)?(?=\w)|->|\?:|[-+]{1,2}|!|&lt;=>|>{1,3}|(&lt;){1,2}|={1,2}|(&amp;){1,2}|\|{1,2}|\?|\*{1,2}|\/|\^|%)/g,
    lookbehind: !0,
  },
  punctuation: /\.+|[{}[\];(),:$]/g,
});
Prism.languages.insertBefore("groovy", "punctuation", {
  "spock-block": /\b(setup|given|when|then|and|cleanup|expect|where):/g,
});
Prism.languages.insertBefore("groovy", "function", {
  annotation: { pattern: /(^|[^.])@\w+/, lookbehind: !0 },
});
Prism.hooks.add("wrap", function (e) {
  if (e.language === "groovy" && e.type === "string") {
    var t = e.content[0];
    if (t != "'") {
      var n = /([^\\])(\$(\{.*?\}|[\w\.]+))/;
      t === "$" && (n = /([^\$])(\$(\{.*?\}|[\w\.]+))/);
      e.content = Prism.highlight(e.content, {
        expression: {
          pattern: n,
          lookbehind: !0,
          inside: Prism.languages.groovy,
        },
      });
      e.classes.push(t === "/" ? "regex" : "gstring");
    }
  }
});
Prism.languages.http = {
  "request-line": {
    pattern:
      /^(POST|GET|PUT|DELETE|OPTIONS|PATCH|TRACE|CONNECT)\b\shttps?:\/\/\S+\sHTTP\/[0-9.]+/g,
    inside: {
      property: /^\b(POST|GET|PUT|DELETE|OPTIONS|PATCH|TRACE|CONNECT)\b/g,
      "attr-name": /:\w+/g,
    },
  },
  "response-status": {
    pattern: /^HTTP\/1.[01] [0-9]+.*/g,
    inside: { property: /[0-9]+[A-Z\s-]+$/g },
  },
  keyword: /^[\w-]+:(?=.+)/gm,
};
var httpLanguages = {
  "application/json": Prism.languages.javascript,
  "application/xml": Prism.languages.markup,
  "text/xml": Prism.languages.markup,
  "text/html": Prism.languages.markup,
};
for (var contentType in httpLanguages)
  if (httpLanguages[contentType]) {
    var options = {};
    options[contentType] = {
      pattern: new RegExp(
        "(content-type:\\s*" + contentType + "[\\w\\W]*?)\\n\\n[\\w\\W]*",
        "gi"
      ),
      lookbehind: !0,
      inside: { rest: httpLanguages[contentType] },
    };
    Prism.languages.insertBefore("http", "keyword", options);
  }
/**
 * Original by Samuel Flores
 *
 * Adds the following new token classes:
 * 		constant, builtin, variable, symbol, regex
 */ Prism.languages.ruby = Prism.languages.extend("clike", {
  comment: /#[^\r\n]*(\r?\n|$)/g,
  keyword:
    /\b(alias|and|BEGIN|begin|break|case|class|def|define_method|defined|do|each|else|elsif|END|end|ensure|false|for|if|in|module|new|next|nil|not|or|raise|redo|require|rescue|retry|return|self|super|then|throw|true|undef|unless|until|when|while|yield)\b/g,
  builtin:
    /\b(Array|Bignum|Binding|Class|Continuation|Dir|Exception|FalseClass|File|Stat|File|Fixnum|Fload|Hash|Integer|IO|MatchData|Method|Module|NilClass|Numeric|Object|Proc|Range|Regexp|String|Struct|TMS|Symbol|ThreadGroup|Thread|Time|TrueClass)\b/,
  constant: /\b[A-Z][a-zA-Z_0-9]*[?!]?\b/g,
});
Prism.languages.insertBefore("ruby", "keyword", {
  regex: {
    pattern:
      /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\r\n])+\/[gim]{0,3}(?=\s*($|[\r\n,.;})]))/g,
    lookbehind: !0,
  },
  variable: /[@$]+\b[a-zA-Z_][a-zA-Z_0-9]*[?!]?\b/g,
  symbol: /:\b[a-zA-Z_][a-zA-Z_0-9]*[?!]?\b/g,
});
// TODO:
// 		- Support for outline parameters
// 		- Support for tables
Prism.languages.gherkin = {
  comment: {
    pattern: /(^|[^\\])(\/\*[\w\W]*?\*\/|((#)|(\/\/)).*?(\r?\n|$))/g,
    lookbehind: !0,
  },
  string: /("|')(\\?.)*?\1/g,
  atrule: /\b(And|Given|When|Then|In order to|As an|I want to|As a)\b/g,
  keyword: /\b(Scenario Outline|Scenario|Feature|Background|Story)\b/g,
};
Prism.languages.csharp = Prism.languages.extend("clike", {
  keyword:
    /\b(abstract|as|base|bool|break|byte|case|catch|char|checked|class|const|continue|decimal|default|delegate|do|double|else|enum|event|explicit|extern|false|finally|fixed|float|for|foreach|goto|if|implicit|in|int|interface|internal|is|lock|long|namespace|new|null|object|operator|out|override|params|private|protected|public|readonly|ref|return|sbyte|sealed|short|sizeof|stackalloc|static|string|struct|switch|this|throw|true|try|typeof|uint|ulong|unchecked|unsafe|ushort|using|virtual|void|volatile|while|add|alias|ascending|async|await|descending|dynamic|from|get|global|group|into|join|let|orderby|partial|remove|select|set|value|var|where|yield)\b/g,
  string: /@?("|')(\\?.)*?\1/g,
  preprocessor: /^\s*#.*/gm,
  number: /\b-?(0x)?\d*\.?\d+\b/g,
  unityvar: /\b(Vector3|LayerMask|Transform|Collider2D|Physics2D)\b/g,
  literal: /\b(i|directionArray|Length|collidableObjects|possibleMoveTiles|col|direction|layer|character|Characters|position)
});
Prism.languages.go = Prism.languages.extend("clike", {
  keyword:
    /\b(break|case|chan|const|continue|default|defer|else|fallthrough|for|func|go(to)?|if|import|interface|map|package|range|return|select|struct|switch|type|var)\b/g,
  builtin:
    /\b(bool|byte|complex(64|128)|error|float(32|64)|rune|string|u?int(8|16|32|64|)|uintptr|append|cap|close|complex|copy|delete|imag|len|make|new|panic|print(ln)?|real|recover)\b/g,
  boolean: /\b(_|iota|nil|true|false)\b/g,
  operator:
    /([(){}\[\]]|[*\/%^!]=?|\+[=+]?|-[>=-]?|\|[=|]?|>[=>]?|&lt;(&lt;|[=-])?|==?|&amp;(&amp;|=|^=?)?|\.(\.\.)?|[,;]|:=?)/g,
  number: /\b(-?(0x[a-f\d]+|(\d+\.?\d*|\.\d+)(e[-+]?\d+)?)i?)\b/gi,
  string: /("|'|`)(\\?.|\r|\n)*?\1/g,
});
delete Prism.languages.go["class-name"];
/**
 * Original by Jan T. Sott (http://github.com/idleberg)
 *
 * Includes all commands and plug-ins shipped with NSIS 3.0a2
 */ Prism.languages.nsis = {
  comment: {
    pattern: /(^|[^\\])(\/\*[\w\W]*?\*\/|(^|[^:])(#|;).*?(\r?\n|$))/g,
    lookbehind: !0,
  },
  string: /("|')(\\?.)*?\1/g,
  keyword:
    /\b(Abort|Add(BrandingImage|Size)|AdvSplash|Allow(RootDirInstall|SkipFiles)|AutoCloseWindow|Banner|BG(Font|Gradient|Image)|BrandingText|BringToFront|Call(\b|InstDLL)|Caption|ChangeUI|CheckBitmap|ClearErrors|CompletedText|ComponentText|CopyFiles|CRCCheck|Create(Directory|Font|ShortCut)|Delete(\b|INISec|INIStr|RegKey|RegValue)|Detail(Print|sButtonText)|Dialer|Dir(Text|Var|Verify)|EnableWindow|Enum(RegKey|RegValue)|Exch|Exec(\b|Shell|Wait)|ExpandEnvStrings|File(\b|BufSize|Close|ErrorText|Open|Read|ReadByte|ReadUTF16LE|ReadWord|WriteUTF16LE|Seek|Write|WriteByte|WriteWord)|Find(Close|First|Next|Window)|FlushINI|Get(CurInstType|CurrentAddress|DlgItem|DLLVersion|DLLVersionLocal|ErrorLevel|FileTime|FileTimeLocal|FullPathName|Function(\b|Address|End)|InstDirError|LabelAddress|TempFileName)|Goto|HideWindow|Icon|If(Abort|Errors|FileExists|RebootFlag|Silent)|InitPluginsDir|Install(ButtonText|Colors|Dir|DirRegKey)|InstProgressFlags|Inst(Type|TypeGetText|TypeSetText)|Int(Cmp|CmpU|Fmt|Op)|IsWindow|Lang(DLL|String)|License(BkColor|Data|ForceSelection|LangString|Text)|LoadLanguageFile|LockWindow|Log(Set|Text)|Manifest(DPIAware|SupportedOS)|Math|MessageBox|MiscButtonText|Name|Nop|ns(Dialogs|Exec)|NSISdl|OutFile|Page(\b|Callbacks)|Pop|Push|Quit|Read(EnvStr|INIStr|RegDWORD|RegStr)|Reboot|RegDLL|Rename|RequestExecutionLevel|ReserveFile|Return|RMDir|SearchPath|Section(\b|End|GetFlags|GetInstTypes|GetSize|GetText|Group|In|SetFlags|SetInstTypes|SetSize|SetText)|SendMessage|Set(AutoClose|BrandingImage|Compress|Compressor|CompressorDictSize|CtlColors|CurInstType|DatablockOptimize|DateSave|DetailsPrint|DetailsView|ErrorLevel|Errors|FileAttributes|Font|OutPath|Overwrite|PluginUnload|RebootFlag|RegView|ShellVarContext|Silent)|Show(InstDetails|UninstDetails|Window)|Silent(Install|UnInstall)|Sleep|SpaceTexts|Splash|StartMenu|Str(Cmp|CmpS|Cpy|Len)|SubCaption|System|Unicode|Uninstall(ButtonText|Caption|Icon|SubCaption|Text)|UninstPage|UnRegDLL|UserInfo|Var|VI(AddVersionKey|FileVersion|ProductVersion)|VPatch|WindowIcon|WriteINIStr|WriteRegBin|WriteRegDWORD|WriteRegExpandStr|Write(RegStr|Uninstaller)|XPStyle)\b/g,
  property:
    /\b(admin|all|auto|both|colored|false|force|hide|highest|lastused|leave|listonly|none|normal|notset|off|on|open|print|show|silent|silentlog|smooth|textonly|true|user|ARCHIVE|FILE_(ATTRIBUTE_ARCHIVE|ATTRIBUTE_NORMAL|ATTRIBUTE_OFFLINE|ATTRIBUTE_READONLY|ATTRIBUTE_SYSTEM|ATTRIBUTE_TEMPORARY)|HK(CR|CU|DD|LM|PD|U)|HKEY_(CLASSES_ROOT|CURRENT_CONFIG|CURRENT_USER|DYN_DATA|LOCAL_MACHINE|PERFORMANCE_DATA|USERS)|ID(ABORT|CANCEL|IGNORE|NO|OK|RETRY|YES)|MB_(ABORTRETRYIGNORE|DEFBUTTON1|DEFBUTTON2|DEFBUTTON3|DEFBUTTON4|ICONEXCLAMATION|ICONINFORMATION|ICONQUESTION|ICONSTOP|OK|OKCANCEL|RETRYCANCEL|RIGHT|RTLREADING|SETFOREGROUND|TOPMOST|USERICON|YESNO)|NORMAL|OFFLINE|READONLY|SHCTX|SHELL_CONTEXT|SYSTEM|TEMPORARY)\b/g,
  variable: /(\$(\(|\{)?[-_\w]+)(\)|\})?/i,
  number: /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?)\b/g,
  operator: /[-+]{1,2}|&lt;=?|>=?|={1,3}|(&amp;){1,2}|\|?\||\?|\*|\/|\~|\^|\%/g,
  punctuation: /[{}[\];(),.:]/g,
  important:
    /\!(addincludedir|addplugindir|appendfile|cd|define|delfile|echo|else|endif|error|execute|finalize|getdllversionsystem|ifdef|ifmacrodef|ifmacrondef|ifndef|if|include|insertmacro|macroend|macro|packhdr|searchparse|searchreplace|tempfile|undef|verbose|warning)\b/gi,
};
Prism.languages.aspnet = Prism.languages.extend("markup", {
  "page-directive tag": {
    pattern: /(<|&lt;)%\s*@.*%>/gi,
    inside: {
      "page-directive tag":
        /&lt;%\s*@\s*(?:Assembly|Control|Implements|Import|Master|MasterType|OutputCache|Page|PreviousPageType|Reference|Register)?|%>/gi,
      rest: Prism.languages.markup.tag.inside,
    },
  },
  "directive tag": {
    pattern: /(<|&lt;)%.*%>/gi,
    inside: {
      "directive tag": /(<|&lt;)%\s*?[$=%#:]{0,2}|%>/gi,
      rest: Prism.languages.csharp,
    },
  },
});
Prism.languages.insertBefore(
  "inside",
  "punctuation",
  { "directive tag": Prism.languages.aspnet["directive tag"] },
  Prism.languages.aspnet.tag.inside["attr-value"]
);
Prism.languages.insertBefore("aspnet", "comment", {
  "asp comment": /&lt;%--[\w\W]*?--%>/g,
});
Prism.languages.insertBefore(
  "aspnet",
  Prism.languages.javascript ? "script" : "tag",
  {
    "asp script": {
      pattern:
        /(&lt;|<)script(?=.*runat=['"]?server['"]?)[\w\W]*?(>|&gt;)[\w\W]*?(&lt;|<)\/script(>|&gt;)/gi,
      inside: {
        tag: {
          pattern:
            /&lt;\/?script\s*(?:\s+[\w:-]+(?:=(?:("|')(\\?[\w\W])*?\1|\w+))?\s*)*\/?>/gi,
          inside: Prism.languages.aspnet.tag.inside,
        },
        rest: Prism.languages.csharp || {},
      },
    },
  }
);
if (Prism.languages.aspnet.style) {
  Prism.languages.aspnet.style.inside.tag.pattern =
    /&lt;\/?style\s*(?:\s+[\w:-]+(?:=(?:("|')(\\?[\w\W])*?\1|\w+))?\s*)*\/?>/gi;
  Prism.languages.aspnet.style.inside.tag.inside =
    Prism.languages.aspnet.tag.inside;
}
if (Prism.languages.aspnet.script) {
  Prism.languages.aspnet.script.inside.tag.pattern =
    Prism.languages.aspnet["asp script"].inside.tag.pattern;
  Prism.languages.aspnet.script.inside.tag.inside =
    Prism.languages.aspnet.tag.inside;
}
(function () {
  if (!window.Prism) {
    return;
  }
  function $$(a, b) {
    return Array.prototype.slice.call((b || document).querySelectorAll(a));
  }
  function hasClass(a, b) {
    b = " " + b + " ";
    return (" " + a.className + " ").replace(/[\n\t]/g, " ").indexOf(b) > -1;
  }
  var h = (crlf = /\r?\n|\r/g);
  function highlightLines(a, b, c) {
    var d = b.replace(/\s+/g, "").split(","),
      offset = +a.getAttribute("data-line-offset") || 0;
    var e = parseFloat(getComputedStyle(a).lineHeight);
    for (var i = 0, range; (range = d[i++]); ) {
      range = range.split("-");
      var f = +range[0],
        end = +range[1] || f;
      var g = document.createElement("div");
      g.textContent = Array(end - f + 2).join(" \r\n");
      g.className = (c || "") + " line-highlight";
      if (!hasClass(a, "line-numbers")) {
        g.setAttribute("data-start", f);
        if (end > f) {
          g.setAttribute("data-end", end);
        }
      }
      g.style.top = (f - offset - 1) * e + "px";
      if (hasClass(a, "line-numbers")) {
        a.appendChild(g);
      } else {
        (a.querySelector("code") || a).appendChild(g);
      }
    }
  }
  function applyHash() {
    var b = location.hash.slice(1);
    $$(".temporary.line-highlight").forEach(function (a) {
      a.parentNode.removeChild(a);
    });
    var c = (b.match(/\.([\d,-]+)$/) || [, ""])[1];
    if (!c || document.getElementById(b)) {
      return;
    }
    var d = b.slice(0, b.lastIndexOf(".")),
      pre = document.getElementById(d);
    if (!pre) {
      return;
    }
    if (!pre.hasAttribute("data-line")) {
      pre.setAttribute("data-line", "");
    }
    highlightLines(pre, c, "temporary ");
    document.querySelector(".temporary.line-highlight").scrollIntoView();
  }
  var j = 0;
  Prism.hooks.add("after-highlight", function (b) {
    var c = b.element.parentNode;
    var d = c && c.getAttribute("data-line");
    if (!c || !d || !/pre/i.test(c.nodeName)) {
      return;
    }
    clearTimeout(j);
    $$(".line-highlight", c).forEach(function (a) {
      a.parentNode.removeChild(a);
    });
    highlightLines(c, d);
    j = setTimeout(applyHash, 1);
  });
  addEventListener("hashchange", applyHash);
})();
Prism.hooks.add("after-highlight", function (e) {
  var t = e.element.parentNode;
  if (
    !t ||
    !/pre/i.test(t.nodeName) ||
    t.className.indexOf("line-numbers") === -1
  ) {
    return;
  }
  var n = 1 + e.code.split("\n").length;
  var r;
  lines = new Array(n);
  lines = lines.join("<span></span>");
  r = document.createElement("span");
  r.className = "line-numbers-rows";
  r.innerHTML = lines;
  if (t.hasAttribute("data-start")) {
    t.style.counterReset =
      "linenumber " + (parseInt(t.getAttribute("data-start"), 10) - 1);
  }
  e.element.appendChild(r);
});
(function () {
  if (!window.Prism) return;
  for (var e in Prism.languages) {
    var t = Prism.languages[e];
    t.tab = /\t/g;
    t.lf = /\n/g;
    t.cr = /\r/g;
  }
})();
(function () {
  if (!self.Prism) return;
  var e = /\b([a-z]{3,7}:\/\/|tel:)[\w-+%~/.:]+/,
    t = /\b\S+@[\w.]+[a-z]{2}/,
    n = /\[([^\]]+)]\(([^)]+)\)/,
    r = ["comment", "url", "attr-value", "string"];
  for (var i in Prism.languages) {
    var s = Prism.languages[i];
    Prism.languages.DFS(s, function (i, s) {
      if (r.indexOf(i) > -1) {
        s.pattern || (s = this[i] = { pattern: s });
        s.inside = s.inside || {};
        i == "comment" && (s.inside["md-link"] = n);
        s.inside["url-link"] = e;
        s.inside["email-link"] = t;
      }
    });
    s["url-link"] = e;
    s["email-link"] = t;
  }
  Prism.hooks.add("wrap", function (e) {
    if (/-link$/.test(e.type)) {
      e.tag = "a";
      var t = e.content;
      if (e.type == "email-link") t = "mailto:" + t;
      else if (e.type == "md-link") {
        var r = e.content.match(n);
        t = r[2];
        e.content = r[1];
      }
      e.attributes.href = t;
    }
  });
})();
(function () {
  function n(t) {
    var n = t.toLowerCase();
    if (e.HTML[n]) return "html";
    if (e.SVG[t]) return "svg";
    if (e.MathML[t]) return "mathml";
    if (e.HTML[n] !== 0) {
      var r = (document
        .createElement(t)
        .toString()
        .match(/\[object HTML(.+)Element\]/) || [])[1];
      if (r && r != "Unknown") {
        e.HTML[n] = 1;
        return "html";
      }
    }
    e.HTML[n] = 0;
    if (e.SVG[t] !== 0) {
      var i = (document
        .createElementNS("http://www.w3.org/2000/svg", t)
        .toString()
        .match(/\[object SVG(.+)Element\]/) || [])[1];
      if (i && i != "Unknown") {
        e.SVG[t] = 1;
        return "svg";
      }
    }
    e.SVG[t] = 0;
    if (e.MathML[t] !== 0 && t.indexOf("m") === 0) {
      e.MathML[t] = 1;
      return "mathml";
    }
    e.MathML[t] = 0;
    return null;
  }
  if (!self.Prism) return;
  if (Prism.languages.css) {
    Prism.languages.css.atrule.inside["atrule-id"] = /^@[\w-]+/;
    if (Prism.languages.css.selector.pattern) {
      Prism.languages.css.selector.inside["pseudo-class"] = /:[\w-]+/;
      Prism.languages.css.selector.inside["pseudo-element"] = /::[\w-]+/;
    } else
      Prism.languages.css.selector = {
        pattern: Prism.languages.css.selector,
        inside: { "pseudo-class": /:[\w-]+/, "pseudo-element": /::[\w-]+/ },
      };
  }
  if (Prism.languages.markup) {
    Prism.languages.markup.tag.inside.tag.inside["tag-id"] = /[\w-]+/;
    var e = {
      HTML: {
        a: 1,
        abbr: 1,
        acronym: 1,
        b: 1,
        basefont: 1,
        bdo: 1,
        big: 1,
        blink: 1,
        cite: 1,
        code: 1,
        dfn: 1,
        em: 1,
        kbd: 1,
        i: 1,
        rp: 1,
        rt: 1,
        ruby: 1,
        s: 1,
        samp: 1,
        small: 1,
        spacer: 1,
        strike: 1,
        strong: 1,
        sub: 1,
        sup: 1,
        time: 1,
        tt: 1,
        u: 1,
        var: 1,
        wbr: 1,
        noframes: 1,
        summary: 1,
        command: 1,
        dt: 1,
        dd: 1,
        figure: 1,
        figcaption: 1,
        center: 1,
        section: 1,
        nav: 1,
        article: 1,
        aside: 1,
        hgroup: 1,
        header: 1,
        footer: 1,
        address: 1,
        noscript: 1,
        isIndex: 1,
        main: 1,
        mark: 1,
        marquee: 1,
        meter: 1,
        menu: 1,
      },
      SVG: {
        animateColor: 1,
        animateMotion: 1,
        animateTransform: 1,
        glyph: 1,
        feBlend: 1,
        feColorMatrix: 1,
        feComponentTransfer: 1,
        feFuncR: 1,
        feFuncG: 1,
        feFuncB: 1,
        feFuncA: 1,
        feComposite: 1,
        feConvolveMatrix: 1,
        feDiffuseLighting: 1,
        feDisplacementMap: 1,
        feFlood: 1,
        feGaussianBlur: 1,
        feImage: 1,
        feMerge: 1,
        feMergeNode: 1,
        feMorphology: 1,
        feOffset: 1,
        feSpecularLighting: 1,
        feTile: 1,
        feTurbulence: 1,
        feDistantLight: 1,
        fePointLight: 1,
        feSpotLight: 1,
        linearGradient: 1,
        radialGradient: 1,
        altGlyph: 1,
        textPath: 1,
        tref: 1,
        altglyph: 1,
        textpath: 1,
        tref: 1,
        altglyphdef: 1,
        altglyphitem: 1,
        clipPath: 1,
        "color-profile": 1,
        cursor: 1,
        "font-face": 1,
        "font-face-format": 1,
        "font-face-name": 1,
        "font-face-src": 1,
        "font-face-uri": 1,
        foreignObject: 1,
        glyph: 1,
        glyphRef: 1,
        hkern: 1,
        vkern: 1,
      },
      MathML: {},
    };
  }
  var t;
  Prism.hooks.add("wrap", function (e) {
    if (
      (["tag-id"].indexOf(e.type) > -1 ||
        (e.type == "property" && e.content.indexOf("-") != 0) ||
        (e.type == "atrule-id" && e.content.indexOf("@-") != 0) ||
        (e.type == "pseudo-class" && e.content.indexOf(":-") != 0) ||
        (e.type == "pseudo-element" && e.content.indexOf("::-") != 0) ||
        (e.type == "attr-name" && e.content.indexOf("data-") != 0)) &&
      e.content.indexOf("<") === -1
    ) {
      var r = "w/index.php?fulltext&search=";
      e.tag = "a";
      var i = "http://docs.webplatform.org/";
      if (e.language == "css") {
        i += "wiki/css/";
        e.type == "property"
          ? (i += "properties/")
          : e.type == "atrule-id"
          ? (i += "atrules/")
          : e.type == "pseudo-class"
          ? (i += "selectors/pseudo-classes/")
          : e.type == "pseudo-element" && (i += "selectors/pseudo-elements/");
      } else if (e.language == "markup")
        if (e.type == "tag-id") {
          t = n(e.content) || t;
          t ? (i += "wiki/" + t + "/elements/") : (i += r);
        } else
          e.type == "attr-name" &&
            (t ? (i += "wiki/" + t + "/attributes/") : (i += r));
      i += e.content;
      e.attributes.href = i;
      e.attributes.target = "_blank";
    }
  });
})();
(function () {
  if (!self.Prism || !self.document || !document.querySelector) {
    return;
  }
  var a = {
    js: "javascript",
    html: "markup",
    svg: "markup",
    xml: "markup",
    py: "python",
  };
  Array.prototype.slice
    .call(document.querySelectorAll("pre[data-src]"))
    .forEach(function (c) {
      var e = c.getAttribute("data-src");
      var g = (e.match(/\.(\w+)$/) || [, ""])[1];
      var f = a[g] || g;
      var b = document.createElement("code");
      b.className = "language-" + f;
      c.textContent = "";
      b.textContent = "Loading…";
      c.appendChild(b);
      var d = new XMLHttpRequest();
      d.open("GET", e, true);
      d.onreadystatechange = function () {
        if (d.readyState == 4) {
          if (d.status < 400 && d.responseText) {
            b.textContent = d.responseText;
            Prism.highlightElement(b);
          } else {
            if (d.status >= 400) {
              b.textContent =
                "✖ Error " + d.status + " while fetching file: " + d.statusText;
            } else {
              b.textContent = "✖ Error: File does not exist or is empty";
            }
          }
        }
      };
      d.send(null);
    });
})();
(function () {
  if (!self.Prism) {
    return;
  }
  var e = { csharp: "C#", cpp: "C++" };
  Prism.hooks.add("before-highlight", function (t) {
    var n = e[t.language] || t.language;
    t.element.setAttribute("data-language", n);
  });
})();
