<template>
	<view class="viewMine">
		<view class="head">
			<image :src="memberInfo.avatarUrl" mode="scaleToFill" class="head-img"></image>
			<view class="head-info">
				<view class="head-pname">{{memberInfo.nickName}} <span>[爸爸]</span> </view>
				<view class="head-fname">辛普森一家</view>
			</view>
			<icon class="er-code" type="qrcode" size="40" color="#888"></icon>
		</view>
		<view class="edit-tools">
			<view class="tool-item">
				<icon class="first-icon" type="team" size="20"></icon>
				<view class="title">我的家庭</view>
				<icon class="last-icon" type="send" size="16" ></icon>
				
			</view>
			<view class="tool-item">
				<icon class="first-icon" type="user" size="20"></icon>
				<view class="title">个人资料</view>
				<icon class="last-icon" type="send" size="16" ></icon>
			</view>
		</view>
	</view>
</template>

<script>
	import icon from "@/components/uni-icon-old/uni-icon.vue"
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	export default {
		components:{icon},
		computed: {
			...mapGetters(['memberInfo'])
		},
		data() {
			return {

			};
		},
		methods: {
			...mapMutations(['setStateValue'])
		}
	}
</script>

<style lang="scss" scoped>
	.viewMine {
		background-color: #f6f6f6;
		height: 100vh;
		.head{
			background-color: #fff;
			padding: 69px 40upx 40upx 40upx;
			display: flex;
			align-items: center;
			.head-img{
				width: 120upx;
				height: 120upx;
				border-radius: 10upx;
			}
			.head-info{
				margin-left:40upx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				flex:1;
				.head-pname{
					font-size: $uni-font-size-lg;
					font-weight: bold;
					line-height: 60upx;
					span{
						font-weight:100;
						color:#409EFF;
					}
				}
				.head-fname{
					font-size: $uni-font-size-sm;
					color: $uni-text-color-grey;
					line-height: 60upx;
				}
			}
			.er-code{
				
			}
		}
		.edit-tools{
			background-color: #fff;
			margin-top: 20upx;
			.tool-item{
				padding: 20upx;
				height: 60upx;
				display: flex;
				align-items: center;
				border-bottom:1px solid #f6f6f6;
				.first-icon{
					
				}
				.title{
					flex:1;
					margin-left:15upx;
				}
				.last-icon{}
			}
		}
	}
</style>
