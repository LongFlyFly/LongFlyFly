<template>
	<view>
		<Lines/>
		<view class="list">
			<!-- 左侧滑动 -->
			<scroll-view scroll-y="true" class="list-left" :style="'height:' +clentHeight+'px;'">
				<view v-for="(item,index) in leftData" :key="index" 
				class="left-item"
				@tap="changeLeftTap(index,item.id)"
				>
					<view class="left-name" :class='activeIndex===index?"left-name-active":"left-item" '>
						{{item.name}}
					</view>
				</view>
			</scroll-view>
			
			<!-- 右侧滑动 -->
			<scroll-view scroll-y="true" class="list-right" :style="'height:' +clentHeight+'px;'">
				<view class="right-list" 
				v-for="(item,index) in rightData" :key="index"
				>
				
				<block v-for="(k,i) in item" :key="i">
					<view class="list-title">{{k.name}}</view>
					<view class="right-content">
						<view class="right-item" v-for="(j,idx) in k.list" :key="idx">
							<image class="right-image" :src="j.imgUrl" mode=""></image>
							<view class="right-name">{{j.name}}</view>
						</view>
					</view>
				</block>
				
				</view>
				
			</scroll-view>
			
		</view>
		<Tabbar cureenPage='list'></Tabbar>
	</view>
</template>

<script>
	import $http from '@/common/api/request.js'
	import Lines from '@/components/common/Lines.vue'
	import Tabbar from '@/components/common/Tabbar.vue'
	export default {
		data() {
			return {
				clentHeight:0,
				activeIndex:0,
				// 左侧数据
				leftData:[],
				rightData:[]
			}
		},
		components:{
			Lines,
			Tabbar
		},
		onLoad() {
			this.getData()
		},
		methods: {
			// 左侧点击事件
			changeLeftTap(index,id){
				// 先拿到id才能获取
				this.getData(id);
				this.activeIndex=index;
			},
			// 请求数据的方法
			// 封装接口
			getData(id){
				if(id===(this.activeIndex+1)){
					return;
				}
				$http.request({
					url:"/goods/list"
				}).then((res)=>{
					let leftData = []
					let rightData = []
					res.forEach(v=>{
						leftData.push({
							id:v.id,
							name:v.name
						})
						// 如果点击的id值相同，向右添加数据
						if(v.id===(this.activeIndex+1)){
							rightData.push(v.data)
						}
					})
					this.leftData = leftData
					this.rightData = rightData
				}).catch(()=>{
					uni.showToast({
						title:'请求失败',
						icon:'none'
					})
				})
			}
		},
		onReady() {
			uni.getSystemInfo({
				// 获取可视化高度
				success:(res)=>{
					this.clentHeight=res.windowHeight
				}
			})
		},
		onNavigationBarSearchInputClicked(){
			uni.navigateTo({
				url:'../search/search'
			})
		}
	}
</script>

<style scoped>
.list{
	display: flex;
}
.list-left{
	width: 200rpx;
}

.left-item{
	border-bottom: 2rpx solid black;
	font-size: 28rpx;
	background-color: #dadada;
	font-weight: bold;
}
.left-name{
	padding: 30rpx 6rpx;
	text-align: center;
}
.left-name-active{
	border-left: 8px solid blue;
	background-color: white;
}
.list-right{
	flex: 1;
	padding-left: 30rpx;
}
.list-title{
	font-weight: bold;
	padding: 30rpx 0 ;
}
.right-content{
	display: flex;
	flex-wrap: wrap;
}
.right-image{
	width: 150rpx;
	height: 150rpx;
}
.right-item{
	width: 150rpx;
	display: flex;
	/* 竖向摆放 */
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 10rpx;
}
.right-name{
	padding: 16rpx 0;
}
</style>
