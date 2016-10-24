export default {
  update (el, binding, vnode) {
    let content = JSON.stringify(binding.value)
    let spilttedLines = content.split('\n')
    spilttedLines.forEach((val, key) => {

      if (val.indexOf('#') != -1) {
        spilttedLines[key] = '<span class="bold">' + val + '</span>'
      }
      if (val.indexOf('*') === 0) {
        spilttedLines[key] = '<li>' + val + '</li>'
      }
    })
    console.log(spilttedLines)
    // el.innerHTML = spilttedLines.join('\n')
  }
}
