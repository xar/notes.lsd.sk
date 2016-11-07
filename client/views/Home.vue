<template>
<div>
  <div class="page">
    <div class="page--header">
      <input type="text" class="page--token"
        v-model="url"
        disabled>
    </div>
    <div class="page--body">
      <div id="editor-wrapper"></div>
    </div>
  </div>
</div>
</template>

<script>
import { str_rand } from 'root/helpers/utils.js'
import CodeMirror from 'codemirror'
import io from 'socket.io-client'
require('codemirror/mode/gfm/gfm')
export default {
  data () {
    return {
      token: '',
      url: ''
    }
  },

  mounted () {
    this.initComponent()
  },

  watch: {
    '$route': 'initComponent'
  },

  methods: {
    initComponent () {
      if (!this.$route.params.token) {
        const token = str_rand(24) + '.' + str_rand(12)
        this.$router.push({
          path: '/edit/' + token
        })
      } else {
        const token = this.$route.params.token
        this.token = token
        this.url = window.location.href
        this.initEditor()
      }
    },

    initEditor () {
      setTimeout(() => {
        const EditorClient = ot.EditorClient
        const SocketIOAdapter = ot.SocketIOAdapter
        const CodeMirrorAdapter = ot.CodeMirrorAdapter
        const socket = io.connect('https://notes.lsd.sk')
        const editorWrapper = document.getElementById('editor-wrapper')

        const cm = CodeMirror(editorWrapper, {
          lineNumbers: false,
          lineWrapping: true,
          mode: 'gfm',
          viewportMargin: Infinity,
          readOnly: 'nocursor'
        })

        cm.markText({line: 6, ch: 26}, {line: 6, ch: 42}, {className: "styled-background"})

        let cmClient

        socket.emit('set_token', this.token)

        socket.on('doc', function (obj) {
          cm.setValue(obj.str);
          cm.setOption('readOnly', false);
          cmClient = new EditorClient(
            obj.revision,
            obj.clients,
            new SocketIOAdapter(socket),
            new CodeMirrorAdapter(cm)
          )

          cm.on('change', function () {
            if (!cmClient) { return }
          })
        })

      }, 200)
    }
  }
}
</script>

<style lang="sass">
  body{
    margin: 0;
    padding: 0;
    background-color: #181822;
    font-family: 'Roboto Mono', monospace;
    text-shadow: rgba(0,0,0,.01) 0 0 1px;
    -webkit-font-smoothing: antialiased;
  }
  .page{
    position: relative;
    width: 1020px;
    margin:  150px auto;
    max-width: 100%;
  }
  .page{
    &--header{
      text-align: left;
      margin-bottom: 30px;
    }
    &--token{
      background: transparent;
      border: 0;
      border-bottom: 1px solid rgba(#ccc, .5);
      width: 100%;
      font-size: 20px;
      color: #fff;
      font-family: 'Roboto Mono', monospace;
      &:hover, &:active, &:focus{
        outline: 0;
      }
    }
  }
  @import '../helpers/codemirror.css';
  .CodeMirror {
    height: auto;
    text-align: left;
    background: transparent;
    font-size: 20px;
    line-height: 1.2;
  }
  .CodeMirror-line span{
    color: #fff;
  }
  .cm-s-default .cm-header {color: #fff;}
  .cm-s-default .cm-quote {color: #2CD2F1;}
  .cm-negative {color: #d44;}
  .cm-positive {color: #292;}
  .cm-header, .cm-strong {font-weight: bold;}
  .cm-em {font-style: italic;}
  .cm-link {text-decoration: underline;}
  .cm-strikethrough {text-decoration: line-through;}

  .cm-s-default .cm-keyword {color: #708;}
  .cm-s-default .cm-atom {color: #219;}
  .cm-s-default .cm-number {color: #164;}
  .cm-s-default .cm-def {color: #00f;}
  .cm-s-default .cm-variable,
  .cm-s-default .cm-punctuation,
  .cm-s-default .cm-property,
  .cm-s-default .cm-operator {}
  .cm-s-default .cm-variable-2 {color: #fff;}
  .cm-s-default .cm-variable-3 {color: #085;}
  .cm-s-default .cm-comment {color: #a50;}
  .cm-s-default .cm-string {color: #a11;}
  .cm-s-default .cm-string-2 {color: #f50;}
  .cm-s-default .cm-meta {color: #555;}
  .cm-s-default .cm-qualifier {color: #555;}
  .cm-s-default .cm-builtin {color: #30a;}
  .cm-s-default .cm-bracket {color: #997;}
  .cm-s-default .cm-tag {color: #170;}
  .cm-s-default .cm-attribute {color: #00c;}
  .cm-s-default .cm-hr {color: #999;}
  .cm-s-default .cm-link {
    color: #FFCA6B;
    display:inline-block;
    text-decoration: none;
    padding-right: 5px;
    position: relative;
    &:before, &:after{
      color: #757F98;
    }
    &:before{
      content: '[';
      position: absolute;
      left: 0;
    }
    &:after{
      content: ']';
      position: absolute;
      right: 5px;
    }
  }
  .cm-s-default .cm-url {
    color: #F573FF;
    position: relative;
    display: inline-block;
    &:before, &:after{
      color: #757F98;
    }
    &:before{
      content: '(';
      position: absolute;
      left: 0;
    }
    &:after{
      content: ')';
      position: absolute;
      right: 0px;
    }
  }



  .cm-s-default .cm-error {color: #f00;}
  .cm-invalidchar {color: #f00;}

  .CodeMirror-composing { border-bottom: 2px solid; }
  .CodeMirror-cursor {
    border-color: #fff;
  }

  /* Default styles for common addons */

  div.CodeMirror span.CodeMirror-matchingbracket {color: #0f0;}
  div.CodeMirror span.CodeMirror-nonmatchingbracket {color: #f22;}
  .CodeMirror-matchingtag { background: rgba(255, 150, 0, .3); }
  .CodeMirror-activeline-background {background: #e8f2ff;}
</style>
