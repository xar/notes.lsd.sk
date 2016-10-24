<template>
<div>
  <pre>
    {{ $data }}
  </pre>
  <div class="page">
    <!-- <textarea name="content"
      ref="textarea"
      @keyup.enter.delete="autoHeight"
      v-model="note.content"></textarea> -->
    <div class="fake-textarea" contenteditable="true"
      v-on:keyup="changed"
      v-on:blur="changed"
      v-on:paste="changed"
      v-on:delete="changed"
      v-on:focus="changed"
      ref="faketextarea"></div>
  </div>
</div>
</template>

<script>
import { ContentService } from 'root/api.js/index.js'
import parseContent from 'root/directives/parseContent.js'
import rangy from 'rangy'
require("../../node_modules/rangy/lib/rangy-selectionsaverestore.js")
export default {
  directives: { parseContent },
  data () {
    return {
      text: 'Hello world',
      note: {},
      firstKeyPress: false
    }
  },

  computed: {
    parsedText () {
      let spilttedLines = this.note.content.split('\n')
      spilttedLines.forEach((val, key) => {
        if (val.indexOf('#') != -1) {
          spilttedLines[key] = '<span class="bold">' + val + '</span>'
        }
        if (val.indexOf('*') === 0) {
          spilttedLines[key] = '<li>' + val + '</li>'
        }
      })
      return spilttedLines.join('\n')
    }
  },

  mounted () {
    this.createNote()
  },

  methods: {
    _setCaretPositionWithin (node, index) {
      console.log(index)
      var treeWalker = this._createTreeWalker(node);
      var currentPos = 0;

      while(treeWalker.nextNode()) {

        // while we don't reach the node that contains
        // our index we increment `currentPos`
        currentPos += treeWalker.currentNode.length;

        if (currentPos >= index) {

          // offset is relative to the current html element
          // We get the value before reaching the node that goes
          // over the thresold and then calculate the offset
          // within the current node.
          var prevValue = currentPos - treeWalker.currentNode.length;
          var offset = index - prevValue;

          // create a new range that will set the caret
          // at the good position
          var range = document.createRange();
          range.setStart(treeWalker.currentNode, offset);
          range.collapse(true);

          // Update the selection to reflect the range
          // change on the UI
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);

          break;
        }
      }
    },
    _createTreeWalker (node) {
      return document.createTreeWalker(
        node,
        NodeFilter.SHOW_TEXT,
        { acceptNode: function(node) { return NodeFilter.FILTER_ACCEPT; } },
        false
      );
    },
    _getCaretPosition(element) {
      var caretOffset = 0;
      var doc = element.ownerDocument || element.document;
      var win = doc.defaultView || doc.parentWindow;
      var sel;
      if (typeof win.getSelection != "undefined") {
          sel = win.getSelection();
          if (sel.rangeCount > 0) {
              var range = win.getSelection().getRangeAt(0);
              var preCaretRange = range.cloneRange();
              preCaretRange.selectNodeContents(element);
              preCaretRange.setEnd(range.endContainer, range.endOffset);
              caretOffset = preCaretRange.toString().length;
          }
      } else if ( (sel = doc.selection) && sel.type != "Control") {
          var textRange = sel.createRange();
          var preCaretTextRange = doc.body.createTextRange();
          preCaretTextRange.moveToElementText(element);
          preCaretTextRange.setEndPoint("EndToEnd", textRange);
          caretOffset = preCaretTextRange.text.length;
      }
      return caretOffset + 1;
    },
    _getCaretOffsetWithin (node) {
      var treeWalker = this._createTreeWalker(node);
      var sel = window.getSelection();

      var pos = {
        start: 0,
        end: 0
      };

      var isBeyondStart = false;

      while(treeWalker.nextNode()) {

        // anchorNode is where the selection starts
        if (!isBeyondStart && treeWalker.currentNode === sel.anchorNode ) {

          isBeyondStart = true;

          // sel object gives pos within the current html element only
          // the tree walker reached that node
          // and the `Selection` obj contains the caret offset in that el
          pos.start += sel.anchorOffset;

          if (sel.isCollapsed) {
            pos.end = pos.start;
            break;
          }
        } else if (!isBeyondStart) {

          // The node we are looking for is after
          // therefore let's sum the full length of that el
          pos.start += treeWalker.currentNode.length;
        }

        // FocusNode is where the selection stops
        if (!sel.isCollapsed && treeWalker.currentNode === sel.focusNode) {

          // sel object gives pos within the current html element only
          // the tree walker reached that node
          // and the `Selection` obj contains the caret offset in that el
          pos.end += sel.focusOffset;
          break;
        } else if (!sel.isCollapsed) {

          // The node we are looking for is after
          // therefore let's sum the full length of that el
          pos.end += treeWalker.currentNode.length;
        }
      }

      return pos;
    },
    autoHeight () {
      this.$refs.textarea.style.height = 'auto';
      this.$refs.textarea.style.height = this.$refs.textarea.scrollHeight + 'px'
      // this.$store.dispatch('createNote', this.note)
    },

    changed (event) {
      if (event.keyCode == 13) {
        const elem = this.$refs.faketextarea
        const position = this._getCaretOffsetWithin(elem)
        const positionSecond = this._getCaretPosition(elem)
        const rangyPosition = rangy.saveSelection()
        console.log(rangyPosition)
        if (this.firstKeyPress) {
          this.firstKeyPress = false
          document.execCommand('insertHTML', false, '<span>&nbsp;</span>')
          //rangy.restoreSelection(rangyPosition + 2)
        } else {
          setTimeout(() => {
            let defaultValue = elem.innerHTML
            let spilttedLines = elem.innerHTML.split(/<\/?(?:div)[^>]*>\s*/im)
            spilttedLines.forEach((val, key) => {
              if (val.indexOf('#') != -1 && val.indexOf('class="bold"') === -1) {
                // spilttedLines[key] = '<span class="bold">' + val + '</span>'
                defaultValue = defaultValue.replace(val, '<span class="bold">' + val + '</span>')
              }
              if (val.indexOf('*') === 0) {
                defaultValue = defaultValue.replace(val, '<li>' + val + '</li>')
                // spilttedLines[key] = '<li>' + val + '</li>'
              }
            })
            elem.innerHTML = defaultValue
            // elem.innerHTML = spilttedLines.map((val) => {
            //   return '<div>' + val + '</div>'
            // }).join('')
            rangy.restoreSelection(rangyPosition)
          }, 0)
          this.firstKeyPress = true
          setTimeout(() => {
            this.firstKeyPress = false
          }, 500)
          this.note.content = event.target.innerText
        }
      }
    },

    createNote () {
      ContentService.createNewContent().then((data, err) => {
        this.note = data.body.data
        this.$refs.faketextarea.innerHTML = data.body.data.content
      })
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
  }
  .fake-textarea{
    position: absolute;
    top: 0; left: 0;
    width:  100%;
    background: transparent;
    font-size: 20px;
    line-height: 28px;
    text-align: left;
    padding: 10px;
    border: 1px solid rgba(#fff, 0);
    color: #fff;
    z-index: 1;
    white-space: pre-wrap;
  }
  textarea {
    position: absolute;
    top: 0; left: 0;
    width:  100%;
    background: transparent;
    border:  0;
    color: #fff;
    font-size: 20px;
    line-height: 28px;
    padding: 10px;
    transition: all .2s;
    border: 1px solid rgba(#fff, 0);
    resize: none;
    color: #fff;
    overflow: hidden;
    font-family: 'Roboto Mono', monospace;
    z-index: 9;
    -webkit-text-fill-color: transparent;
    &:hover, &:active, &:focus{
      outline: 0;
      border: 1px solid rgba(#fff, 0.3);
    }
  }
  .bold{
    font-weight: 700;
    font-size: 20px;
  }
  li{
    margin: 0;
    padding: 0;
    list-style: none;
    padding-left: 10px;
  }
  .fake-caret{
    font-size: 20px;
    position: relative;
    top: -2px;
  }
</style>
