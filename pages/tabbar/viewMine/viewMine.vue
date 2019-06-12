<template>
	<view class="viewMine">
		<view class="head">
			<image :src="memberInfo.avatarUrl" mode="scaleToFill" class="head-img"></image>
			<view class="head-info">
				<view class="head-pname">{{memberInfo.nickName}}</view>
				<view class="head-fname">辛普森一家</view>
			</view>
			<icon class="er-code" type="qrcode" size="40" color="#888"></icon>
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
		padding-top: 69px;
		.head{
			padding: 0 40upx 0 40upx;
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
	}
</style>
