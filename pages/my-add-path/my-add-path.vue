<template>
	<view class="my-add-path">
		<view class="path-item">
			<view class="">收 件 人</view>
			<input type="text" value="" placeholder="收件人姓名" v-model="pathObj.name">
		</view>
		
		<view class="path-item">
			<view class="">手 机 号</view>
			<input type="text" value="" placeholder="11位手机号" v-model="pathObj.tel">
		</view>
		
		<view class="path-item">
			<view class="">所在地址</view>
			<!-- 三级联动 -->
			<view class="" @tap="showCityPicker">{{pathObj.city}} > </view>
			<mpvue-city-picker ref="mpvueCityPicker" @onConfirm="onConfirm" :pickerValueDefault="pickerValueDefault"></mpvue-city-picker>
			
		</view>
		
		<view class="path-item">
			<view class="">详细地址</view>
			<input type="text" value="" placeholder="5-60个字符" v-model="pathObj.details">
			<view class="">{{pathObj.district}}</view>
		</view>
		
		<view class="path-item">
			<view class="">设为默认地址</view>
				<radio-group name="" @change="radioChange">
					<label class="radio">
						<radio value="" color="#ff3333" :checked="pathObj.isDefault == 1? true : false"/><text></text>
					</label>
			</radio-group>
				
		</view>
	</view>
</template>

<script>
	import $http from '@/common/api/request.js'
	import mpvueCityPicker from '@/components/uni/mpvue-citypicker/mpvueCityPicker.vue'
	import {mapActions} from 'vuex'
	export default {
		data() {
			return {
				pickerValueDefault:[0,0,1],
				pathObj:{
					name:'',
					city:"请选择",
					tel:"",
					details:'',
					isDefault:false
				},
				i:-1,
				// 是否修改状态
				isStatus:false
			}
		},
		components:{
			mpvueCityPicker
		},
		onLoad(e) {
			if(e.data){
				uni.setNavigationBarTitle({
					title:"修改地址"
				})
				let result = JSON.parse(e.data);
				this.pathObj = result.item
				this.i=result.index;
				this.isStatus=true;
			}
		},
		// 页面生命周周期
		onNavigationBarButtonTap() {
			
			if(this.isStatus){
				$http.request({
					url:"/updateAdderss",
					method:"POST",
					data:{
						...this.pathObj
					}
				}).then((res)=>{
					this.pathObj.isDefault = this.pathObj.isDefault == true?1:0;
					// 修改
					this.updatePathFn({
						index:this.i,
						item:this.pathObj
					})
					uni.navigateBack({
						delta:1
					})
					uni.showToast({
						title:"修改成功",
						icon:"none"
					})
				}).catch(()=>{
					uni.showToast({
						title:'请求失败',
						icon:'none'
					})
				})
				
			}else{
				// 封装接口
				$http.request({
					url:"/addAddress",
					method:"post",
					data:{
						...this.pathObj
					}
				}).then((res)=>{
					// 新增
					this.createPathFn(this.pathObj),
					// 返回上一页
					uni.navigateBack({
						delta:1
					})
				}).catch(()=>{
					uni.showToast({
						title:'请求失败',
						icon:'none'
					})
				})	
			}
		},
		methods: {
			...mapActions(["createPathFn","updatePathFn"]),
			showCityPicker(){
				this.$refs.mpvueCityPicker.show();
			},
			onConfirm(e) {
				// console.log(e)
				this.pathObj.city = e.label;
			},
			radioChange(){
				// 判断默认选中和非默认选中
				this.pathObj.isDefault = this.pathObj.isDefault == 1? true : false;
				this.pathObj.isDefault = !this.pathObj.isDefault
			}
		}
	}
</script>

<style scoped>
.my-add-path{
	padding-left: 20rpx;
}
.path-item{
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10rpx 0;
	width: 100%;
	border-bottom: 2rpx solid #cccccc;
}
.path-item input{
	flex:1;
	text-align: left;
	padding-left: 10rpx;
}
</style>
