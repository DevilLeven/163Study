import Vue from 'vue'
import App from './app.vue'
import Loading from './component/index'

Vue.use(Loading)
new Vue({
  el: '#app',
  render: h => h(App)
})