<template>
	<view class="shop-cart">
		
		<template v-if="list.length>0">
				
			<!-- 自定义导航栏 -->
			<uniNavBar
				title="购物车"
				:right-text='isNavBar ? "完成":"编辑" '
				fixed="true"
				status-bar="true"
				@clickRight="isNavBar = !isNavBar"
			></uniNavBar>
			
			<!-- 商品内容 -->
			<view class="shop-list">
				
				<view class="shop-item" v-for="(item,index) in list" :key="index">
					<label class="radio" @tap="selectedItem(index)">
						<radio value="" color="#ff3333" :checked="item.checked"/><text></text>
					</label>
					<image class="shop-img" :src="item.imgUrl" mode=""></image>
					<view class="shop-text">
						<view class="shop-name">{{item.name}}</view>
						<view class="shop-color f-color" >{{item.color}}</view>
						<view class="shop-price">
							<view>￥{{item.pprice}}</view>
							
							<!-- 编辑切换 -->
							<template v-if="!isNavBar">
								<view>x{{item.num}}</view>
							</template>
							
							<template v-else>
								<!-- app中应该写为min="1" -->
								<uni-number-box :value="item.num" min:1 @change="changeNumber($event,index,item)">
									
								</uni-number-box>
							</template>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 底部 -->
			<view class="shop-foots">
				<label class="radio foot-radio" @tap='checkedAllFn'>
					<radio value="" color="#ff3333" :checked="checkedAll"/><text>全选</text>
				</label>
				
				
				<template v-if="!isNavBar">
					<view class="foot-total">
						<view class="foot-count">合计：<text class="f-active-color">￥{{totalCount.pprice}}</text></view>
						<view class="foot-num" @tap="goConfirmOrder">结算({{totalCount.num}})</view>
					</view>
				</template>
				
				<template v-else>
					<view class="foot-total">
						<view class="foot-count" style="background-color: black;color: white;">移入收藏夹</view>
						<view class="foot-num" @tap="delGoodsFn">删除</view>
					</view>
				</template>
				
			</view>
	</template>
	
	<template v-else>
		<uniNavBar title="购物车" status-bar="true" fixed="true"></uniNavBar>
		<view class="shop-else-list">
			<text>购物车是空的~</text>
		</view>
	</template>
	<Tabbar cureenPage='shopcart'></Tabbar>
	</view>
	
</template>

<script>
	import $http from '@/common/api/request.js'
	import uniNavBar from '@/components/uni/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.vue'
	import uniNumberBox   from '@/components/uni/uni-number-box/components/uni-number-box/uni-number-box.vue'
	import {mapState,mapActions,mapGetters,mapMutations} from 'vuex'
	import Tabbar from '@/components/common/Tabbar.vue'
	export default {
		data() {
			return {
				isNavBar:false,
			}
		},
		components:{
			uniNavBar,
			uniNumberBox,
			Tabbar
		},
		computed:{
			...mapState({
				list:state=>state.cart.list,
				selectedList:state=>state.cart.selectedList
			}),
			...mapGetters(['checkedAll','totalCount'])
		},
		onShow() {
			this.getData();
		},
		methods: {
			...mapActions(['checkedAllFn','delGoodsFn']),
			...mapMutations(['selectedItem','initGetData','initOrder']),
			getData(){
				$http.request({
					url:"/selectCart",
					method:"POST",
				}).then((res)=>{
					this.initGetData(res)
				}).catch(()=>{
					uni.showToast({
						title:'请求失败',
						icon:'none'
					})
				})
			},
			changeNumber(value,index,item){
				if(item.num == value) return;
				$http.request({
					url:"/updataNumCart",
					method:"POST",
					data:{
						goodsId:item.goods_id,
						num:value
					},
				}).then((res)=>{
					// 编辑和完成之间的数量转换
					this.list[index].num=value;
				}).catch(()=>{
					uni.showToast({
						title:'请求失败',
						icon:'none'
					})
				})
				
			},
			// 进入确认订单
			goConfirmOrder(){
				if(this.selectedList.length ===0){
					return uni.showToast({
						title:"请至少选择一件商品",
						icon:"none"
					})
				}
				
				let newList = [];
				this.list.forEach(item=>{
					this.selectedList.filter(v=>{
						if(item.id == v){
							newList.push(item);
						}
					})
				})
				// 发送请求生成订单
				$http.request({
					url:"/addOrder",
					method:"POST",
					data:{
						arr:JSON.stringify(newList)
					}
					
				}).then((res)=>{
					if(res.success){
						this.initOrder(res.data[0].order_id);
						// 跳转页面存储订单号
						
						uni.navigateTo({
							url:`/pages/confirm-order/confirm-order?detail=${JSON.stringify(this.selectedList)}`
						})
					}
					
				}).catch(()=>{
					uni.showToast({
						title:'请求失败',
						icon:'none'
					})
				})
				
			}
		}
	}
</script>

<style scoped>
.shop-list{
	padding-bottom: 100rpx;
}
.shop-else-list{
	background-color: #c5c5c5;
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	justify-content: center;
}
.shop-item{
	display: flex;
	padding: 20rpx;
	align-items: center;
	background-color: #f7f7f7;
	margin-bottom: 10rpx;
}
.shop-img{
	width: 200rpx;
	height: 200rpx;
}
.shop-text{
	flex: 1;
	padding-left: 20rpx;
}
.shop-color{
	font-size: 24rpx;
}
.shop-price{
	display: flex;
	justify-content: space-between;
}
.shop-foots{
	border-top: 2rpx solid #c5c5c5;
	background-color: white;
	position: fixed;
	/* app和网页有区别 ,app bottom应该为0*/
	bottom: 120rpx;
	left: 0;
	width: 100%;
	height: 100rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.foot-radio{
	padding-left: 20rpx;
}
.foot-total{
		display: flex;
}
.foot-count{
	line-height: 100rpx;
	padding: 0 20rpx;
	font-size: 32rpx;
}
.foot-num{
	background-color: #00ffff;
	color: white;
	padding: 0 60rpx;
	line-height: 100rpx;
}
</style>
