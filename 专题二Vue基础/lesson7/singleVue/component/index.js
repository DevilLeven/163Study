import loadingCom from './loading.vue'

export default{
  install: (Vue) => {
    Vue.component('loading', loadingCom)
  }
}