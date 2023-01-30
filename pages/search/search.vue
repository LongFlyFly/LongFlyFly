<template>
	<view class="search">
		<Lines></Lines>
		<view class="search-item">
			<view class="search-title">
				<view>
					最近搜索
				</view>
				<view class="iconfont" @tap="clearHistory">
				<svg t="1660360873129" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1789" width="16" height="16"><path d="M380.565633 84.168898C391.492953 73.241577 412.883938 64.383234 428.328892 64.383234L596.182087 64.383234C611.633685 64.383234 633.010015 73.233567 643.945345 84.168898L680.111776 120.335329 344.399202 120.335329 380.565633 84.168898Z" p-id="1790"></path><path d="M875.944112 176.287425C891.394856 176.287425 903.92016 163.762122 903.92016 148.311377 903.92016 132.860633 891.394856 120.335329 875.944112 120.335329L148.566866 120.335329C133.116122 120.335329 120.590818 132.860633 120.590818 148.311377 120.590818 163.762122 133.116122 176.287425 148.566866 176.287425L875.944112 176.287425Z" p-id="1791"></path><path d="M180.539492 232.239521 180.254748 228.253099 228.640985 176.287425 232.637564 176.287425 280.347765 844.230242C282.63628 876.269454 312.053012 903.664671 344.377659 903.664671L680.133319 903.664671C712.845805 903.664671 741.848496 876.636282 744.163214 844.230242L791.873414 176.287425 795.869993 176.287425 844.25623 228.253099 843.971486 232.239521 180.539492 232.239521ZM847.968064 176.287425 799.973118 848.216664C795.578506 909.741242 742.362215 959.616766 680.133319 959.616766L344.377659 959.616766C282.586578 959.616766 228.909839 909.424372 224.53786 848.216664L176.542914 176.287425 847.968064 176.287425Z" p-id="1792"></path><path d="M484.279441 763.784431C484.279441 779.235176 496.804744 791.760479 512.255489 791.760479 527.706234 791.760479 540.231537 779.235176 540.231537 763.784431L540.231537 372.11976C540.231537 356.669016 527.706234 344.143713 512.255489 344.143713 496.804744 344.143713 484.279441 356.669016 484.279441 372.11976L484.279441 763.784431Z" p-id="1793"></path><path d="M607.198225 760.600957C605.851604 775.992907 617.237593 789.562199 632.629543 790.908821 648.021493 792.255442 661.590785 780.869453 662.937406 765.477503L697.073232 375.303235C698.419853 359.911285 687.033864 346.341992 671.641914 344.995371 656.249965 343.64875 642.680672 355.034739 641.334051 370.426688L607.198225 760.600957Z" p-id="1794"></path><path d="M361.573572 765.477503C362.920193 780.869453 376.489486 792.255442 391.881435 790.908821 407.273385 789.562199 418.659374 775.992907 417.312753 760.600957L383.176927 370.426688C381.830306 355.034739 368.261013 343.64875 352.869064 344.995371 337.477114 346.341992 326.091125 359.911285 327.437746 375.303235L361.573572 765.477503Z" p-id="1795"></path></svg>
				</view>
			</view>
			<view v-if="searchData.length">
				<view class="search-name" 
				v-for="(item,index) in searchData" 
				:key="index"
				@tap='toSearchList(item)'
				>{{item}}</view>
			</view>
			<view v-else class="search-end">暂无搜索记录</view>
		</view>
		
		
		<view class="search-item">
			<view class="search-title">
				<view>
					热门搜索
				</view>
			</view>
			<view>
				<view class="search-name">运动服</view>
				<view class="search-name">裙子</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import Lines from '@/components/common/Lines.vue'
	export default {
		data() {
			return {
				// 输入的关键词
				keyword:'',
				// 搜索到的搜索次记录
				searchData:[]
			}
		},
		// 页面加载的时候
		onLoad() {
			uni.getStorage({
				key:"searchData",
				success: (res) => {
					this.searchData=JSON.parse(res.data)
				}
			})
		},
		// 点击顶栏中的文字按钮
		onNavigationBarButtonTap(e){
			this.search();
		},
		// 监听inpute输入内容的
		onNavigationBarSearchInputChanged(e) {
			this.keyword=e.text;
		},
		// 监听软件盘的搜索点击
		onNavigationBarSearchInputConfirmed() {
			this.search();
		},
		components:{
			Lines
		},
		methods: {
			// 判断关键词是否为空
			search(){
				if(this.keyword===""){
					return uni.showToast({
						title:"关键词不能为空",
						icon:"none"
					})
				}else{
					this.toSearchList(this.keyword)
					// uni.navigateTo({
					// 	url:"../search-list/search-list?keyword="+this.keyword+""
					// })
				}
				// 隐藏键盘
				uni.hideKeyboard()
				this.addSearch()
			},
			// 点击搜索记录进入页面
			toSearchList(item){
				uni.navigateTo({
					url:"../search-list/search-list?keyword="+item+""
				})
			},
			
			// 记录搜索词
			addSearch(){
				let idx = this.searchData.indexOf(this.keyword)
				if(idx<0){
					// 记录搜索历史
					this.searchData.unshift(this.keyword)
				}else{
					// 重复搜索时排序靠前
					this.searchData.unshift(this.searchData.splice(idx,1)[0])
				}
				// 存储
				uni.setStorage({
					key:"searchData",
					data:JSON.stringify(this.searchData)
				})
			},
			// 清除搜索记录
			clearHistory(){
				// 模态框
				uni.showModal({
					title:"重要提示",
					content:"是否清楚搜索记录",
					cancelText:"取消",
					confirmText:"确定",
					success: (res) => {
						if(res.confirm){
							// 清除存储
							uni.removeStorage({
								key:"searchData"
							})
							// 清除视图层
							this.searchData=[]
						}
					}
				})
			}
		}
	}
</script>

<style>
.search-item{
	padding: 20rpx;
}
.search-title{
	display: flex;
	justify-content: space-between;
}
.search-name{
	padding: 4rpx 24rpx;
	background-color: #E1E1E1;
	/* 行级块元素 */
	display: inline-block;
	border-radius: 26rpx;
	margin: 10rpx;
}
.search-end{
	text-align: center;
}
</style>
