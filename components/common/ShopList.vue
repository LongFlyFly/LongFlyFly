<template>
	<view class="shop-list">
		<view class="shop-title f-color">
			<view class="shop-item" 
			v-for="(item,index) in shopList.data" :key="index"
			@tap="changeTab(index)"
			>
				<view :class="shopList.currentIndex==index?'f-active-color':''">{{item.name}}</view>
				<view class="shop-icon">
					<view class="iconfont up" :class="item.status===1?'f-active-color':''">∧</view>
					<view class="iconfont down" :class="item.status===2?'f-active-color':''">∨</view>
				</view>
			</view>
		</view>
		<Lines/>
		<CommodityList :dataList='dataList'></CommodityList>
	</view>
</template>

<script>
	import $http from '@/common/api/request.js'
	import Lines from '@/components/common/Lines.vue'
	import CommodityList from '@/components/common/CommodityList.vue'
	export default{
		props:{
			keyword:String
		},
		data(){
			return{
				shopList:{
					currentIndex:0,
					data:[
						{name:"价格",status:1,key:"pprice"},
						{name:"折扣",status:0,key:"discount"},
					]
				},
				dataList:[]
			}
		},
		computed:{
			orderBy(){
				// 拿到当前对象
				let obj = this.shopList.data[this.shopList.currentIndex]
				let val = obj.status === "1"?"desc":"asc";
				return{
					// 获取相应的值和属性
					[obj.key]:val
				}
			}	
		},
		components:{
			Lines,
			CommodityList
		},
		mounted() {
			this.getData()
		},
		methods:{
			// 请求搜索方法
			getData(){
				$http.request({
					url:"/goods/search",
					data:{
						name:this.keyword,
						...this.orderBy
					}
				}).then((res)=>{
					this.dataList=res;
				}).catch(()=>{
					uni.showToast({
						title:'请求失败',
						icon:'none'
					})
				})
			},
			
			changeTab(index){
				// 点击排序=>重新请求数据
				this.getData()
				
				// 获取上下箭头
				let idx= this.shopList.currentIndex  //获取索引值
				// 获取具体对象
				let item = this.shopList.data[idx]
				if(idx == index){
					return item.status = item.status ===1? 2:1;
				}
				// 新的值index
				let newItem = this.shopList.data[index]
				item.status = 0;
				
				// 点击内容切换颜色
				this.shopList.currentIndex=index;
				newItem.status=1;
			}
		}
	}
</script>

<style scoped>
	.shop-title{
		display: flex;
	}
	.shop-item{
		flex:1;
		display: flex;
		/* 水平垂直居中 */
		justify-content: center;
		align-items: center;
		height: 80rpx;
	}
	.shop-icon{
		position: relative;
		margin-left: 10rpx;
	}
	.iconfont{
		width: 16rpx;
		height: 20rpx;
		position: absolute;
		left: 0;
	}
	.up{
		top: -24rpx;
	}
	.down{
		top: -4rpx;
	}
</style>