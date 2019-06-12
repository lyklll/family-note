import {
	machineService
} from "@/services/buss/machineService.js"
import store from '@/common/store.js'
import common from '@/common/common.js'
class scanHandle {
	constructor() {
		this.machine = new machineService()
		this.codeRule = [{
				desc: "扫码投币（跳转地址）(旧)",
				regRule: /https?\:\/\/[^\s]*\/TerminalPay?[^\s]*/,
				funcName: "scanCoinForUrl",
			},
			{
				desc: "扫码提币（二维码规则）（旧）",
				regRule: /[^\s]*\|[^\s]*\|[^\s]*\|[^\s]*/,
				funcName: "scanForTiBi_old",
			},
			{
				desc: "机台端口二维码",
				regRule: /MachinePortGUID\_[^\s]*\_[^\s]*/,
				funcName: "scanForMachinePort",
			},
			{
				desc: "机台二维码不带端口",
				regRule: /MachineGUID\_[^\s]*\_[^\s]*/,
				funcName: "scanForMachineWithOutPort",
			}
		]
	}

	//扫码统一入口
	scan(isRedirect) {
		this.isRedirect = isRedirect
		uni.scanCode({
			onlyFromCamera: true,
			success: (obj) => {
				this.matchFunction(obj.result)
			}
		})
	}

	//匹配扫描的词应该如何处理
	async matchFunction(scanCode) {
		uni.showLoading({
			title: '正在识别',
			mask: true
		});

		let haveOne = false
		let func = this.codeRule.find(x => {
			return x.regRule.test(scanCode)
		})
		if (func && this[func.funcName])
			await this[func.funcName](scanCode)
		else {
			this.showMsgBox('未识别的二维码，请确认。')
		}
		uni.hideLoading()
	}
	showMsgBox(msg) {
		uni.showModal({
			title: '提示',
			content: msg,
			showCancel: false
		});
	}
	openPage(url) {
		if (this.isRedirect) {
			uni.redirectTo({
				url: url
			})
		} else {
			uni.navigateTo({
				url: url
			});
		}
	}

	//扫带端口的机台二维码
	async scanForMachinePort(scanCode) {
		let arr = scanCode.split("_")
		if (arr.length != 4) {

			this.showMsgBox("无效的编码规则：" + scanCode)

			return

		}
		let machineId = arr[2]
		let machinePort = arr[3]
		//获取机台类型
		let erpResult = await this.getMachineInfoByPort(machineId)
		if (!erpResult.issuccess) {
			this.showMsgBox(erpResult.data)
			return
		}
		let erpMachineType = erpResult.data.MachinePort.BindMachine.BindMachineType.SystemMachineCate

		switch (erpMachineType) {
			case "Terminal": //扫码投币
				await this.scanCoinHandle(erpResult.data)
				break;
			case "ToteCoinMachine": //扫码提币
				await this.scanTiBiHandle(erpResult.data)
				break;
			case "GateBox": //门闸盒子
				await this.scanGateBoxHandle(erpResult.data)
				break;
			default:
				this.showMsgBox("未识别的二维码类型：" + erpMachineType)
				break;
		}
	}
	//获取机台支付信息闸机）
	async getGateMachinePayInfo(machineId) {
		let result = await this.machine.getGateMachinePayInfo({
			machineId: machineId,
			businessNO: store.getters.erpBusiness.BusinessNO
		});

		return result
	}
	//闸机二维码处理
	async scanGateBoxHandle(machineInfo) {
		let tmp=store.getters.pageDataTran||{}
		tmp.viewGateBox=machineInfo.MachinePort
		store.commit("setStateValue", {
			"pageDataTran": tmp
		})
		this.openPage("/pages/home/viewGateBox/viewGateBox")
// 		
// 		let machineInfoOpen = await this.getGateMachinePayInfo(machineId)
// 
// 		if (machineInfoOpen.issuccess) {
// 			machineInfoOpen = machineInfoOpen.data
// 		} else {
// 			this.showMsgBox(machineInfoOpen.data)
// 			return
// 		}
// 		switch (machineInfoOpen.data.error_code) {
// 			case 1:
// 				this.showMsgBox("与机台通信超时，请稍候重试！")
// 				break;
// 			case 2:
// 				this.showMsgBox(machineInfoOpen.data.return_msg)
// 				break;
// 			case 0:
// 				switch (machineInfoOpen.data.result_code) {
// 					case 0:
// 						store.commit("setStateValue", {
// 							"pageDataTran": machineInfoOpen.data
// 						})
// 						this.openPage("/pages/home/viewGateBox/viewGateBox")
// 						break;
// 					case 30:
// 						this.showMsgBox("与机台通信超时，请稍候重试！")
// 						break;
// 					default:
// 						this.showMsgBox(`出现错误:${machineInfoOpen.data.result_msg}，请稍候重试！`)
// 						break;
// 				}
// 
// 				break;
// 			default:
// 				this.showMsgBox(`出现未知错误:${machineInfoOpen.data.result_msg}，请稍候重试！`)
// 				break;
// 		}
// 

	}
	//创建订单（闸机|购买门票）
	async createOrder_gatebox(machineInfo, machineInfoOpen, orderNo, port) {
		let orderInfo = {
			machineId: machineInfo.GUID + "_" + port,
			machineName: machineInfo.BindMachine.MachineName,
			playAmount: 1,
			orderNo: orderNo,
			member: store.getters.erpMember,
			totalAmount: machineInfoOpen.data.adult_price,
			payMoney: machineInfoOpen.data.adult_price,
			orderType: "machineGateBox",
			tickType: "adult",
			exParams: machineInfoOpen.data
		};
		let result = await this.machine.createOrder(orderInfo)
		return result
	}
	//扫码提币处理
	async scanTiBiHandle(machineInfo) {
		let tmp=store.getters.pageDataTran||{}
		tmp.sweepCode=machineInfo.MachinePort
		store.commit("setStateValue", {
			"pageDataTran": tmp
		})
		this.openPage("/pages/home/sweepCode/sweepCode")
// 		let machineInfo = await this.getMachinePayInfo(machineId)
// 		if (machineInfo.issuccess) {
// 			machineInfo = machineInfo.data
// 		} else {
// 			this.showMsgBox(machineInfo.data)
// 			return
// 		}
// 
// 		switch (machineInfo.data.error_code) {
// 			case 1:
// 				this.showMsgBox("与机台通信超时，请稍候重试！")
// 				break;
// 			case 2:
// 				this.showMsgBox(machineInfo.data.return_msg)
// 				break;
// 			case 0:
// 				switch (machineInfo.data.result_code) {
// 					case 0:
// 						store.commit("setStateValue", {
// 							"pageDataTran": machineInfo.data
// 						})
// 						this.openPage("/pages/home/sweepCode/sweepCode")
// 					
// 						break;
// 					case 30:
// 						this.showMsgBox("与机台通信超时，请稍候重试！")
// 						break;
// 					default:
// 						this.showMsgBox(`出现错误:${machineInfo.data.result_msg}，请稍候重试！`)
// 						break;
// 				}
// 
// 				break;
// 			default:
// 				this.showMsgBox(`出现未知错误:${machineInfo.data.result_msg}，请稍候重试！`)
// 				break;
// 		}
// 

		//创建订单（提币）

	}



	async getMachineInfoByPort(machineId) {
		let result = await this.machine.getMachineInfoByPort({
			machineId: machineId
		});

		return result
	}
	//扫码投币处理
	async scanCoinHandle(machineInfo) {
		let tmp=store.getters.pageDataTran||{}
		tmp.insertCoin=machineInfo.MachinePort
		store.commit("setStateValue", {
			"pageDataTran": tmp
		})
		this.openPage("/pages/home/insertCoin/insertCoin")
// 		let machineInfo = await this.getMachinePayInfo(machineId)
// 		if (machineInfo.issuccess) {
// 			machineInfo = machineInfo.data
// 		} else {
// 			this.showMsgBox(machineInfo.data)
// 			return
// 		}
// 
// 		switch (machineInfo.data.error_code) {
// 			case 1:
// 				this.showMsgBox("与机台通信超时，请稍候重试！")
// 				break;
// 			case 2:
// 				this.showMsgBox(machineInfo.data.return_msg)
// 				break;
// 			case 0:
// 				switch (machineInfo.data.result_code) {
// 					case 0:
// 						store.commit("setStateValue", {
// 							"pageDataTran": machineInfo.data
// 						})
// 						this.openPage("/pages/home/insertCoin/insertCoin")
// 						break;
// 					case 30:
// 						this.showMsgBox("与机台通信超时，请稍候重试！")
// 						break;
// 					default:
// 						this.showMsgBox(`出现错误:${machineInfo.data.result_msg}，请稍候重试！`)
// 						break;
// 				}
// 
// 				break;
// 			default:
// 				this.showMsgBox(`出现未知错误:${machineInfo.data.result_msg}，请稍候重试！`)
// 				break;
// 		}
	}
	//获取机台支付信息
	async getMachinePayInfo(machineId) {
		let result = await this.machine.getMachinePayInfo({
			machineId: machineId,
			businessNO: store.getters.erpBusiness.BusinessNO
		});
		return result
	}

	//创建订单(投币)
	async createOrder_toubi(orderNo, machineInfo) {

		let orderInfo = {
			machineId: machineInfo.data.machineposition_guid,
			machineName: machineInfo.data.machineposition_name,
			playAmount: 1,
			orderNo: orderNo,
			member: store.getters.erpMember,
			payTypeCode: "memberPay",
			payTypeName: "会员储值",
			payMoney: machineInfo.data.pay_money,
			totalAmount: machineInfo.data.pay_money,
			orderType: "machineInsertCoin"
		};
		let result = await this.machine.createOrder(orderInfo)
		return result
	}
}
export default new scanHandle()
