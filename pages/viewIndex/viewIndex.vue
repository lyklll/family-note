<template>
	<view class="viewIndex">
		<view class="auth-box" v-if="isShow">
			<button type="primary" open-type="getUserInfo" @getuserinfo="getuserinfo">授权获取</button>
		</view>


	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				isShow: false
			};
		},
		methods: {
			...mapMutations(['setStateValue']),
			async addUser(userData) {
				let userInfoResult = await wx.cloud.callFunction({
					name: "addUser",
					data: {
						loginUser: userData
					}
				})
				if (userInfoResult.result.issuccess) {
					this.setStateValue({
						memberInfo:userInfoResult.result.data
					})
					//增加账户成功
					uni.switchTab({
						url: '/pages/tabbar/viewHome/viewHome'
					});

				} else {
					uni.showModal({
						title: '提示',
						content: userInfoResult.result.data,
						showCancel: false
					});
				}

			},
			getuserinfo(data) {
				this.addUser(data.detail.userInfo)

			}
		},
		async created() {
			try {
				let result = await wx.cloud.callFunction({
					name: "getUserId"
				})
				if (result.result.data.length == 0) {
					let userInfo = await uni.getUserInfo()
					console.log(userInfo)
					if (userInfo.length == 2) {
						//已经授权，直接添加到数据库
						this.addUser(userInfo[1].userInfo)

					} else {
						//没授权，弹出授权按钮
						this.isShow = true
					}

				} else {
					//console.log(result)
					this.setStateValue({
						memberInfo:result.result.data[0]
					})
					uni.switchTab({
						url: '/pages/tabbar/viewHome/viewHome'
					});
				}
			} catch (ex) {
				console.log(ex)
			}

		}
	}
</script>

<style lang="scss" scoped>
	.viewIndex {
		.auth-box {
			width: 300upx;
			height: 300upx;
			background: red;
			margin: calc(100vh / 2 - 150upx) auto;
			animation: myfirst 0.5s;
		}

		@keyframes myfirst {
			from {
				margin: 100vh auto;
			}

			to {
				margin: calc(100vh / 2 - 150upx) auto;
			}
		}
	}
</style>
