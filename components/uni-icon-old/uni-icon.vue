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
		src: url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAALQAAsAAAAABrwAAAKDAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCCcAqBSIE7ATYCJAMICwYABCAFhG0HMBvhBcg+QDy2kyBSRKU9lTZFa1PQf5+5PxewoNlDPDzt1+/cmVmb98WTCkSSilavJIiNkglJS9j9n7MM0Kg8v7GbAjpSI1/Ibzl9aY7U1DnDSp0jEO66GkAmZQNQuTGDiZy2xZrbgfgJOEDNGHCDwPHuN4aK6r80cQP0eS7Ht3yBXON7w2nNQYuPegHGAQW4F0aRFUjoDWM3ETzAxwSqWS2Fg4fPtlBXgFWBePnMs6BeKCiK0+4K7YaDRfzQ0k3f0vKdfz/+e9RJWhkYOPt44cL4d1A1f+2Dm/mrIkE/3kLGVqAQFxsbp5WEI5RUzbJFoCjl3/WnIXFUv3D+OtA9AKZ1wzMZselRuxMog1rbgWMmU0IDBdiG8OwPaTDfH0wDNxr1ItcVbRcz5sO2W2Egaqp5UBPN48basxrNRRxrXdgC2MP2lf34Wvr6pep7aT5NO3v79jaXtrz6Cmbz0BZ1oPPi5d3+FD8T3J0bfmx457GAXxZf0v9aJn9F94zJ4M8ZBw6V2AyCqYTGxlSy/fZWJlQVfWZmzN9Uz+RtxkK3YHSQdMwg61omCrMVLY1taOvag2qL1fHGOFESpYdNNxrCiCckQ34iG/FMFOYXLVP+0TYSJVSXY/zCxmoE9cB7spRctK8xcDg1KKxN0bsm7zy2JG/m4p4kD8rY7/TK7RWlJEtsyS+8gapBI5zgUnuO4pgxEw7J0Y6vmo26XdP0po7DCTQdIIhFEReyXUMBB0sZOl41K59fI55zMYt0SEbae0TkgulRX0dvALFypIMkj/JK7oJnQCkDGYIl0FKbR2IxhrLmeSHiUB3+hFpmpAtHmaGOzvau5O9OQAW8KeCsrP3uvcMuAQAA') format('woff2');
  
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

</style>