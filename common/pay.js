import {
	wxService
} from "@/services/authorization/wxService.js"
import store from "./store.js"
let wxservice = new wxService()

class payHandle {

	constructor() {
		this.enumPayTypeList = ["saobei", "weixin", "zhifubao"]
		this.checkEnvironment()
	}
	//检测当前环境
	checkEnvironment() {
		this.currentEvn = "wxgzh"
		// #ifdef MP-WEIXIN
		this.currentEvn = "wxmp"
		// #endif
	}
	createPayResult(isOk, payType, out_trade_no) {
		return {
			issuccess: isOk,
			evn: this.currentEvn,
			payType: payType,
			out_trade_no: out_trade_no
		}
	}
	//统一支付
	pay(option) {

		console.log(option)
		//从配置获取payType
		// let payTypeResult = await wxservice.getPayType()
		// if (!this.enumPayTypeList.some(x => x == option.payType)) {
		// 	throw new RangeError("payType参数中的值必须为「saobei、weixin、zhifubao」中的一种")
		// }
		if (!option.orderNo) {
			throw new ReferenceError("未设置订单号：「orderNo」")
		}
		if (option.payTotalAmount == 0) {
			//无需支付
			let ok = this.createPayResult(true)
			option.callBack(ok)
			return
		}
		if (!option.payTotalAmount) {
			throw new ReferenceError("未设置支付金额：「payTotalAmount」")
		}
		


		// let funcName = `pay_${option.payType}_${this.currentEvn}`
		// if (this[funcName]) {
		// 	this[funcName](option)
		// } else {
		// 	throw new ReferenceError(`未实现方法：「${funcName}」`)
		// }
		let tmp = store.getters.isPaying || false
		if (tmp) {
			console.log("重复支付")
			return
		}
		store.commit("setStateValue", {
			"isPaying": true
		})

		this.pay_weixinMp(option)
	}

	// 	//小程序扫呗支付
	// 	async pay_saobei_wxmp(option) {
	// 		//获取扫呗支付参数
	// 		try {
	// 			let payresult = await wxservice.getSaobeiMpPayParams({
	// 				orderNo: option.orderNo,
	// 				totalAmount: 1
	// 			})
	// 			if (payresult.result_code == 1 && payresult.return_code == 1) {
	// 				uni.requestPayment({
	// 					provider: 'wxpay',
	// 					timeStamp: payresult.timeStamp,
	// 					nonceStr: payresult.nonceStr,
	// 					package: payresult.package_str,
	// 					signType: payresult.signType,
	// 					paySign: payresult.paySign,
	// 					success: function(res) {
	// 						console.log('success:' + JSON.stringify(res));
	// 					},
	// 					fail: function(err) {
	// 						uni.showModal({
	// 							title: '提示',
	// 							content: JSON.stringify(err),
	// 							showCancel: false,
	// 
	// 						});
	// 						console.log('fail:' + JSON.stringify(err));
	// 					},
	// 					complete() {
	// 						store.commit("setStateValue", {
	// 							"isPaying": false
	// 						})
	// 					}
	// 				});
	// 			}
	// 		} catch (e) {
	// 			store.commit("setStateValue", {
	// 				"isPaying": false
	// 			})
	// 		}
	// 	}
	// 
	//微信支付（包括各种支付手段：原生，扫呗等）
	async pay_weixinMp(option) {
		try {
			//获取微信支付参数
			let payresult = await wxservice.getPayParams({
				orderNo: option.orderNo,
				totalAmount: option.payTotalAmount,
				title: option.title,
				payEvn: this.currentEvn
			})
			uni.hideLoading()
			if (!payresult.issuccess) {
				uni.showModal({
					title: '提示',
					content: '获取支付参数失败',
					showCancel: false
				});
				store.commit("setStateValue", {
					"isPaying": false
				})
				return
			} else {
				payresult = payresult.data
			}
			uni.requestPayment({
				provider: 'wxpay',
				timeStamp: payresult.timeStamp + "",
				nonceStr: payresult.nonceStr,
				package: payresult.package || payresult.package_str,
				signType: payresult.signType,
				paySign: payresult.paySign,
				success: (res) => {
					let ok = this.createPayResult(true, payresult.payType, payresult.out_trade_no || option.orderNo)
					option.callBack(ok)
					console.log('success:' + JSON.stringify(res));
				},
				fail: (err) => {
					let unok = this.createPayResult(false, payresult.payType, payresult.out_trade_no || option.orderNo)
					option.callBack(unok)
					console.log('fail:' + JSON.stringify(err));
				},
				complete: () => {
					console.log("complete")
					store.commit("setStateValue", {
						"isPaying": false
					})
				}
			});
		} catch (e) {
			store.commit("setStateValue", {
				"isPaying": false
			})
		}
	}
}
export default new payHandle()
