<template>
	<view class="index">
		
		<scroll-view scroll-x="true" class="scroll-content" :scroll-into-view="scrollIntoIndex">
			<view 
			:id="'top'+index"
			class="scroll-item"
			v-for="(item,index) in topBar" 
			:key="index"
			@tap='changeTab(index)'
			>
				<text :class='topBarIndex===index?"f-active-color":"f-color" ' >{{item.name}}</text>
			</view>
		</scroll-view>
		
		
		<!-- current跟随滑块 -->
		<swiper @change='onChangeTab' :current="topBarIndex" :style="'height:' +clentHeight+'px;'">
			<swiper-item
			v-for="(item,index) in newTopBar"
			:key="index"
			>
			
				<scroll-view scroll-y="true" :style="'height:' +clentHeight+'px;'" @scrolltolower="loadMore(index)">
					
					<block v-if="item.data.length>0">
						<!-- 二层遍历里面的内容 -->
						<block v-for="(k,i) in item.data" :key="i">
							<!-- 推荐 -->
							<indexSwiper v-if='k.type==="swiperList"' :dataList='k.data'></indexSwiper>
							<template v-if='k.type==="recommendList"'>
								<Recommed  :dataList='k.data'></Recommed>
								<Card cardTitle='猜你喜欢'></Card>
							</template>
							
							<!-- 运动户外 -->
							<Banner v-if='k.type==="bannerList"' :dataList='k.imgUrl'></Banner>
							
							<template v-if='k.type==="iconsList"'>
								<Icons :dataList='k.data'></Icons>
								<Card cardTitle='热销爆品'></Card>
							</template>
							
							<template v-if='k.type==="hotList"'>
								<Hot :dataList='k.data'></Hot>
								<Card cardTitle='推荐店铺'></Card>
							</template>
							
							<template v-if='k.type==="shopList"'>
								<Shop :dataList='k.data'></Shop>
								<Card cardTitle='为您推荐'></Card>
							</template>
							
							<CommodityList v-if='k.type==="commodityList"' :dataList='k.data'></CommodityList>
							 
						</block>
					</block>
					<view v-else>
						暂无数据。。。。
					</view>
					
					<view class="load-text f-color">
						{{item.loadText}}
					</view>
					
				</scroll-view>
					
			</swiper-item>
		</swiper>
		
		<Tabbar cureenPage='index'></Tabbar>
		<!-- 推荐的模板 -->
		<!-- <indexSwiper></indexSwiper>
		<Recommed></Recommed>
		<Card cardTitle='猜你喜欢'></Card>
		<CommodityList></CommodityList> -->
		
		<!-- 其他模板：运动，户外，美妆等 -->
		<!-- <Banner></Banner>
		<Icons></Icons>
		<Card cardTitle='热销爆品'></Card>
		<Hot></Hot>
		<Card cardTitle='推荐店铺'></Card>
		<Shop></Shop>
		<Card cardTitle='为您推荐'></Card>
		<CommodityList></CommodityList> -->
	</view>
</template>

<script>
	// 引入request封装文件
	import $http from '@/common/api/request.js'
	// 导入banner
	import indexSwiper from '@/components/index/indexSwiper.vue'
	import Recommed from '@/components/index/Recommed.vue'
	import Card from '@/components/common/Card.vue'
	import CommodityList from '@/components/common/CommodityList.vue'
	import Banner from '@/components/index/Banner.vue'
	import Icons from '@/components/index/Icons.vue'
	import Hot from '@/components/index/Hot.vue'
	import Shop from '@/components/index/Shop.vue'
	import Tabbar from '@/components/common/Tabbar.vue'
	export default {
		data() {
			return {
				// 选中的索引
				topBarIndex:0,
				// 顶栏跟随索引id值
				scrollIntoIndex:'top0',
				// 内容块的高度值
				clentHeight:0,
				// 顶栏数据
				topBar:[],
				// 承载数据的数组
				newTopBar:[]
			}
		},
		components:{
			indexSwiper,
			Recommed,
			Card,
			CommodityList,
			Banner,
			Icons,
			Hot,
			Shop,
			Tabbar
		},
		onLoad() {
			// 封装成一个方法
			this.__init();
			
		},
		
		onReady() {
			// 获取dom节点
			// let view = uni.createSelectorQuery().select(".home-data")
			// 获取高度
			// view.boundingClientRect(data=>{
			// 	this.clentHeight=2000
			// 	// this.clentHeight=data.height
			// }).exec();
			
			// 调用可视化界面
			this.getClientHeight()
			
			uni.getSystemInfo({
				success:(res)=>{
					this.clentHeight=res.windowHeight-uni.upx2px(80)
				}
			})
		},
		
		//标题栏按钮点击,跳转页面.
		onNavigationBarButtonTap(e) {
			if(e.float=='left'){
				uni.navigateTo({
					url:'../search/search'
				})
			}
		},
		
		methods: {
			__init(){
				// 封装接口
				$http.request({
					url:"/index_list/data"
				}).then((res)=>{
					this.topBar = res.topBar;
					this.newTopBar = this.initData(res);
				}).catch(()=>{
					uni.showToast({
						title:'请求失败',
						icon:'none'
					})
				})
				
				
				// 前端请求后端的接口
				// uni.request({
				// 	// 此出不能用localhost,要用ip地址
				// 	url:"http://192.168.1.5:3000/api/index_list/data",
				// 	success:(res)=>{
				// 		let data = res.data.data;
				// 		this.topBar = data.topBar;
				// 		this.newTopBar = this.initData(data);
				// 	}	
				// })
			},
			
		
			// 定义initData方法来加载头部不同导航栏对应的数据
			initData(res){
				let arr = []
				for(let i=0;i<this.topBar.length;i++){
					let obj = {
						// data里面放数据
						data:[],
						load:'first',
						loadText:'上拉加载更多...'
					}
					// 获取首次数据
					if(i==0){
						obj.data=res.data
					}
					arr.push(obj)
				}
				
				return arr;
			},
			
			// 点击切换导航栏
			changeTab(index){
				if(this.topBarIndex===index){
					return ;
				}
				this.topBarIndex=index;
				this.scrollIntoIndex='top'+index;
				// 触底加载操作(每一次滑动赋值)
				if(this.newTopBar[this.topBarIndex].load ==='first'){
					this.addData();
				}
			},
			
			// 切换头部与内容一致
			onChangeTab(e){
				this.changeTab(e.detail.current);
			},
			
			// 兼容不同可视区域高度
			getClientHeight(){
				const res = uni.getSystemInfoSync()
				const system = res.platform;
				if(system==='ios'){
					return 44+res.statusBarHeight;
				}else if(system==='android'){
					return 48+res.statusBarHeight;
				}else{
					return 0;
				}
			},
			// 对应显示不同数据
			addData(callback){
				// 拿到索引
				let index = this.topBarIndex;
				// 拿到id
				let id = this.topBar[index].id;
				// 请求不同的数据
				
				let page=Math.ceil(this.newTopBar[index].data.length/3)+1;
				
				// 请求数据
				$http.request({
					url:`/index_list/${id}/data/${page}`
				}).then((res)=>{
					this.newTopBar[index].data=[...this.newTopBar[index].data,...res];
				}).catch(()=>{
					uni.showToast({
						title:'请求失败',
						icon:'none'
					})
				})
				
				
				// uni.request({
				// 	url:`http://192.168.1.5:3000/api/index_list/${id}/data/${page}`,
				// 	success:(res)=>{
				// 		if(res.statusCode!=200){
				// 			return;
				// 		}else{
				// 			let data =res.data.data;
				// 			this.newTopBar[index].data=[...this.newTopBar[index].data,...data];
				// 		}
				// 	}
				// })
				
				// 当请求结束后重新赋值
				this.newTopBar[index].load='last';
				
				if(typeof callback==='function'){
					callback()
				}
			},
			// 上拉加载更多
			loadMore(index){
				this.newTopBar[index].loadText='加载中...';
				// 请求完数据，内容又变回原来的
				this.addData(()=>{
					this.newTopBar[index].loadText='上拉加载更多...';
				})
			}
		}
	}
</script>

<style>
	.scroll-content{
		width: 100%;
		height: 80rpx;
		white-space: nowrap;
	}
	.scroll-item{
		display: inline-block;
		padding: 10rpx 30rpx;
		font-size: 36rpx;
	}
	.f-active-color{
		padding: 10rpx 0;
		border-bottom: 6rpx solid #00ffff;
	}
	.load-text{
		border-top: 2rpx solid black;
		line-height: 60rpx;
		text-align: center;
	}
</style>
