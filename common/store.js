//全局变量管理文件，使用了浏览器缓存

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		memberInfo:{}
	},
	getters: {
		memberInfo(state) {
			if (!state.memberInfo) {
				state.memberInfo = uni.getStorageSync('memberInfo')
			}
			return state.memberInfo
		},
	},
	mutations: {
		//通用的批量设置state属性值的方法
		//传入的对象为：{属性名:属性值,...}
		setStateValue(state, o) {
			Object.keys(o).forEach((key, i, v) => {
				state[key] = o[key]
				uni.setStorageSync(key, o[key])
			})
		}
	},
	actions: {

	}
})
