<template>
	<view class="my-path-list">
		<view class="path-list">
			<view  v-for="(item,index) in list" 
				:key="index"
				@tap="goAddPath(index)">
				
				<view class="path-item" @tap="goConfirmOrder(item)">
					<view class="item-main">
						<view class="item-name">{{item.name}}</view>
						<view class="">{{item.tel}}</view>
					</view>
					<view class="item-main">
						<view class="active" v-if="item.isDefault == 1">默认</view>
						<view class="">{{item.province}}{{item.city}} {{item.district}}{{item.address}}</view>
					</view>
				</view>
				</view>
			</view>
			<view class="add-path">
				<view class="add-path-btn" @tap="toAddPath">
					新增地址
				</view>
			</view>
		
		
	</view>
</template>

<script>
	import $http from '@/common/api/request.js'
	import {mapState,mapMutations} from 'vuex'
	export default {
		data() {
			return {
				isSelectedPath:false
			}
		},
		computed:{
			...mapState({
				list:state=>state.path.list
			})
		},
		onLoad(e) {
			if(e.type === 'selectedPath'){
				this.isSelectedPath = true
			}
			// 初始化拿到收货地址数据
			this._initAddress()
		},
		methods: {
			...mapMutations([`_initAddressList`]),
			
			// 初始化请求收货地址接口
			_initAddress(){
				
				$http.request({
					url:"/selectAdderss",
					method:"POST",
					// header:{
					// 	token:true
					// }
				}).then((res)=>{
					this._initAddressList(res)
				}).catch(()=>{
					uni.showToast({
						title:'请求失败',
						icon:'none'
					})
				})
			},
			
			// 修改地址
			goAddPath(index){
				let pathObj = JSON.stringify({
					index:index,
					item:this.list[index]
				})
				
				uni.navigateTo({
					url:"../my-add-path/my-add-path?data="+pathObj+""
				})
			},
			// 去添加地址页面
			toAddPath(){
				uni.navigateTo({
					url:'../my-add-path/my-add-path'
				})
			},
			// 返回确认订单页面
			goConfirmOrder(item){
				// 如果是从确认订单过来的，执行以下代码
				if(this.isSelectedPath){
					// 自定义事件，页面通讯
					uni.$emit('selectPathItem',item)
					// 返回上一页
					uni.navigateBack({
						delta:1
					})
				}
					
			}
		}
	}
</script>

<style scoped>
.add-path{
	width: 100%;
	display: flex;
	justify-content: center;
	padding: 20rpx 0 ;
}
.add-path-btn{
	border: 2rpx solid #00ffff;
	color: #00ffff;
	border-radius: 30rpx;
	padding: 6rpx 60rpx ;
}
.path-item{
	padding: 10rpx ;
	border-bottom: 2rpx solid #CCCCCC;
}
.path-list{
	padding-left: 20rpx;
}
	
.item-main{
	display: flex;
	align-items: center;
}
.active{
	padding: 2rpx 6rpx;
	background-color: #00ffff;
	color: white;
	border-radius: 20rpx;
	font-size: 24rpx;
	text-align: center;
}
.item-name{
	padding-right: 10rpx;
}
</style>
