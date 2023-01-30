<template>
	<view class="card">
		<slot>
			<view class="card-name">
				{{cardTitle}}
			</view>	
		</slot>
	</view>
</template>

<script>
	// 接收card值
	export default{
		props:{
			cardTitle:String
		}
	}
</script>

<style scoped>
	.card{
		padding: 20rpx 0;
		display: flex;
		justify-content: center;
		font-weight: bold;
	}
</style>
