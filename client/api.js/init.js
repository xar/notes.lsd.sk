import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)

Vue.http.options.crossOrigin = false
Vue.http.options.credentials = false

Vue.http.interceptors.push((request, next)=>{
  request.headers = request.headers || {}
  next((response) => {
    if (response.status === 401) {
      window.location.pathname = '/'
    }
  })
})

export default Vue
