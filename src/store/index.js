import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'
import getters from './getters'

// 1.安装插件
Vue.use(Vuex)

// 2.创建Store对象
const state = {
  cartList: []
}
const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters
  // mutations: {
    // mutations唯一的目的就是修改state中的状态
    // mutations中的每一个方法尽可能完成的事情比较单一一点
    // addCounter(state, payload) {
    //   payload.count++
    // },
    // addToCart(state, payload) {
    //   state.cartList.push(payload)
    // }
  // },
  // actions: {
  //   addCart(context, payload) {
  //     // payload 新添加到商品
  //     let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)

  //     // 2.判断oldProduct
  //     if(oldProduct) {
  //       context.commit('addCounter', oldProduct)
  //     } else {
  //       payload.count = 1
  //       // context.cartList.push(payload)
  //       context.commit('addToCart', payload)
  //     }
  //   }
  // }
})

// 3.挂在到vue实例上
export default store