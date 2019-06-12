import store from "./store.js"
class common {
	createOrderNo(orderTypeCode) {

		let bussNo = store.getters.erpBusiness.BusinessNO
		let strDateTime = this.formartDate(new Date(), "yyyyMMddhhmmss0S")
		let rnd = this.rndNum(6)
		//门店编号(6位)+操作码(2位)年月日时分秒(14位)+四位毫秒(4位)6位随机数
		let result = `${bussNo}${orderTypeCode}${strDateTime}${rnd}`
		return result
	}
	rndNum(len) {
		let result = ""
		for (var i = 0; i < len; i++) {
			result += Math.floor(Math.random() * (len + 1))
		}
		return result
	}
	dateSpanAndFormart(dateFrom, dateTo) {
		dateFrom = new Date(dateFrom)
		dateTo = new Date(dateTo)
		return Math.floor((dateTo - dateFrom) / (24 * 3600 * 1000)) + "天前";
	}
	formartDate(date, fmt) {
		date = new Date(date)
		var o = {
			"M+": date.getMonth() + 1, //月份   
			"d+": date.getDate(), //日   
			"h+": date.getHours(), //小时   
			"m+": date.getMinutes(), //分   
			"s+": date.getSeconds(), //秒   
			"q+": Math.floor((date.getMonth() + 3) / 3), //季度   
			"S": date.getMilliseconds() //毫秒   
		};
		if (/(y+)/.test(fmt))
			fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt))
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}
	//打开订单完成页面
	showOderFinishPage(option) {
		if (option) {
			let tmp = store.getters.pageDataTran || {}
			tmp.orderFinish = option
			store.commit("setStateValue", {
				"pageDataTran": tmp
			})
		}
		uni.navigateTo({
			url: '/pages/home/orderFinish/orderFinish'
		});
	}
	//判断字符串是否正整数
	checkRate(input) {
		var re = /^[1-9]+[0-9]*]*$/; //判断字符串是否为数字 //判断正整数 /^[1-9]+[0-9]*]*$/ 
		return re.test(input)
	}
	getMemberAccountValueName(valueType) {
		let result = ""
		switch (valueType) {
			case "Coin":
				result = "代币"
				break;
			case "Ticket":
				result = "彩票"
				break;
			case "Point":
				result = "积分"
				break;
			case "Money":
				result = "预存款"
				break;
			case "Passticket":
				result = "门票"
				break;
			case "Coupon":
				result = "优惠卷"
				break;
			default:
				result = valueType
				break;
		}
		return result;
	}

	//精确的加法
	mathAdd(arg1, arg2) {
		var r1, r2, m, c;
		try {
			r1 = arg1.toString().split(".")[1].length;
		} catch (e) {
			r1 = 0;
		}
		try {
			r2 = arg2.toString().split(".")[1].length;
		} catch (e) {
			r2 = 0;
		}
		c = Math.abs(r1 - r2);
		m = Math.pow(10, Math.max(r1, r2));
		if (c > 0) {
			var cm = Math.pow(10, c);
			if (r1 > r2) {
				arg1 = Number(arg1.toString().replace(".", ""));
				arg2 = Number(arg2.toString().replace(".", "")) * cm;
			} else {
				arg1 = Number(arg1.toString().replace(".", "")) * cm;
				arg2 = Number(arg2.toString().replace(".", ""));
			}
		} else {
			arg1 = Number(arg1.toString().replace(".", ""));
			arg2 = Number(arg2.toString().replace(".", ""));
		}
		return (arg1 + arg2) / m;
	}
	//精确的减法
	mathSub(arg1, arg2) {
		var r1, r2, m, n;
		try {
			r1 = arg1.toString().split(".")[1].length;
		} catch (e) {
			r1 = 0;
		}
		try {
			r2 = arg2.toString().split(".")[1].length;
		} catch (e) {
			r2 = 0;
		}
		m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
		n = (r1 >= r2) ? r1 : r2;
		return ((arg1 * m - arg2 * m) / m).toFixed(n);
	}
	//精确的乘法
	mathMul(arg1, arg2) {
		var m = 0,
			s1 = arg1.toString(),
			s2 = arg2.toString();
		try {
			m += s1.split(".")[1].length;
		} catch (e) {}
		try {
			m += s2.split(".")[1].length;
		} catch (e) {}
		return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
	}
	//精确的除法
	mathDiv(arg1, arg2) {
		var t1 = 0,
			t2 = 0,
			r1, r2;
		try {
			t1 = arg1.toString().split(".")[1].length;
		} catch (e) {}
		try {
			t2 = arg2.toString().split(".")[1].length;
		} catch (e) {}

		r1 = Number(arg1.toString().replace(".", ""));
		r2 = Number(arg2.toString().replace(".", ""));
		return (r1 / r2) * Math.pow(10, t2 - t1);

	}
}
module.exports = new common()
