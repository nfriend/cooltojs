CodeMirror.defineSimpleMode('cool', {
    // The start state contains the rules that are intially used
    start: [
      {
          regex: /"(?:[^\\]|\\.)*?"/,
          token: 'string'
      },
      {
          regex: /"(?:[^\\]|\\.)*?\\[\s]*$/,
          token: 'string',
          next: 'multilineString'
      },
      {
          regex: /(?:class|else|if|fi|inherits|isvoid|let|loop|pool|then|while|case|esac|new|of|not)\b/i,
          token: 'keyword'
      },
      {
          regex: /t[Rr][Uu][Ee]|f[Aa][Ll][Ss][Ee]/,
          token: 'keyword'
      },
      {
          regex: /[0-9]+/,
          token: 'number'
      },
      {
          regex: /--.*/,
          token: 'comment',
      },
      {
          regex: /\(\*/,
          token: 'comment',
          next: 'comment'
      },
      {
          regex: /(?:self)\b/i,
          token: 'selfkeyword'
      },
      {
          regex: /(?:SELF_TYPE)\b/i,
          token: 'selftypekeyword'
      },

      { regex: /[-+\/*=<>!]+/, token: 'operator' },
      { regex: /[\{\[\(]/, indent: true },
      { regex: /[\}\]\)]/, dedent: true },
      { regex: /([a-z][a-zA-Z0-9_]*)/, token: 'objectidentifier' },
      { regex: /([A-Z][a-zA-Z0-9_]*)/, token: 'typeidentifier' },
    ],
    comment: [
      { regex: /.*?\*\)/, token: 'comment', next: 'start' },
      { regex: /.*/, token: 'comment' }
    ],
    multilineString: [
        { regex: /(?:[^\\]|\\.)*?\\[\s]*$/, token: 'string' },
        { regex: /(?:[^\\]|\\.)*?"/, token: 'string', next: 'start' }
    ],
    meta: {
        dontIndentStates: ['comment'],
        lineComment: '--',
        electricChars: '}])'
    }
});