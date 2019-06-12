<template>
	<view class="uni-icon" :class="['uni-icon-'+type]" :style="{color:color,'font-size':fontSize}" @click="onClick()"></view>
</template>

<script>
	export default {
		name: 'uni-icon',
		props: {
			/**
			 * 图标类型
			 */
			type: String,
			/**
			 * 图标颜色
			 */
			color: String,
			/**
			 * 图标大小
			 */
			size: [Number, String]
		},
		computed: {
			fontSize() {
				return `${this.size}px`
			}
		},
		methods: {
			onClick() {
				this.$emit('click')
			}
		}
	}
</script>

<style lang="scss" scoped>
	@font-face {
		font-family: uniicons;
		font-weight: normal;
		font-style: normal;
		src: url('//at.alicdn.com/t/font_1238376_ocysxihn0n.woff2') format('woff2');
	}

	.uni-icon {
		font-family: uniicons;
		font-size: 24px;
		font-weight: normal;
		font-style: normal;
		line-height: 1;
		display: inline-block;
		text-decoration: none;
		-webkit-font-smoothing: antialiased;
	}

	.uni-icon.uni-active {
		color: #007aff;
	}

	.uni-icon-qrcode:before {
		content: "\e76e";
	}
	
	.uni-icon-send:before {
		content: "\e916";
	}
	
	.uni-icon-user:before {
		content: "\e7ae";
	}
	
	.uni-icon-team:before {
		content: "\e7af";
	}

</style>