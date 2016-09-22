<template>
<div>
  <div class="page">
    <textarea name="content"
      ref="textarea"
      @keyup.enter.delete="autoHeight"
      v-model="note.text"></textarea>
    <div class="fake-textarea">{{ note.text }}</div>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      text: 'Hello world',
    }
  },

  computed: {
    note () {
      return this.$store.state.note
    }
  },

  mounted () {
    this.createNote()
  },

  methods: {
    autoHeight () {
      this.$refs.textarea.style.height = 'auto';
      this.$refs.textarea.style.height = this.$refs.textarea.scrollHeight + 'px'
      this.$store.dispatch('createNote', this.note)
    },

    createNote () {
      this.$store.dispatch('createNote', {text: 'Hello'})
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
    color: rgba(#fff, 0.5);
    overflow: hidden;
    font-family: 'Roboto Mono', monospace;
    z-index: 9;
    &:hover, &:active, &:focus{
      outline: 0;
      border: 1px solid rgba(#fff, 0.3);
    }
  }
</style>
