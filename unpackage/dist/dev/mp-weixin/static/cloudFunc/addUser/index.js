// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
	env: 'lkylll-blog'
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()
	let data = event.loginUser
	data.openId = wxContext.OPENID
	data.createDate = new Date()
	try {
		let result = await db.collection('members').add({
			data: data
		})
		return {
			issuccess: true,
			data: result
		}
	} catch (ex) {
		return {
			issuccess: false,
			data: ex.message
		}
	}
}
