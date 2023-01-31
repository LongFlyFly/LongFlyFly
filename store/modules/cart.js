import $http from '@/common/api/request.js'
export default{
	state:{
		list:[],
		selectedList:[]
	},
	getters:{
		// 判断是否全选
		checkedAll(state){
			return state.list.length === state.selectedList.length 
		},
		// 合计和结算数量
		totalCount(state){
			let total = {
				pprice:0,
				num:0
			}
			state.list.forEach(v=>{
				// 是否是选中状态
				if(state.selectedList.indexOf(v.goods_id)>-1){
					// 合计
					total.pprice += v.pprice * v.num
					// 结算数量
					total.num = state.selectedList.length
				}
			})
			return total
		}
	},
	mutations:{
		//请求数据赋值操作
		initGetData(state,list){
			state.list = list
		},
		// 全选方法
		checkAll(state){
			state.selectedList = state.list.map(v=>{
				v.checked = true;
				return v.goods_id
			})
		},
		// 全不选和不全选
		uncheckAll(state){
			state.list.forEach(v=>{
				v.checked = false;
			})
			state.selectedList = []
		},
		// 单选
		selectedItem(state,index){
			let id = state.list[index].goods_id
			let i = state.selectedList.indexOf(id)
			// 如果已经存在，代表是选中状态，移除
			if(i>-1){
				state.list[index].checked = false;
				return state.selectedList.splice(i,1)
			}
			// 如果没有选中，则添加
			state.list[index].checked = true
			state.selectedList.push(id)
		},
		delGoods(state){
			state.list = state.list.filter(v=>{
				return state.selectedList.indexOf(v.goods_id)
			})
		},
		// 加入购物车
		addShopCart(state,goods){
			state.list.push(goods);
		}
	},
	actions:{
		checkedAllFn({commit,getters}){
			getters.checkedAll ? commit("uncheckAll")  :  commit("checkAll")
		},
		delGoodsFn({commit,state}){
			uni.showModal({
				content:"确认删除吗？",
				success:()=> {
					$http.request({
						url:"/deleteCart",
						method:"POST",
						data:{
							goodsId:state.selectedList
						}
					}).then((res)=>{
						commit('delGoods');
						commit('uncheckAll')
						uni.showToast({
							title:'删除成功',
							icon:"none"
						})
					}).catch(()=>{
						uni.showToast({
							title:'请求失败',
							icon:'none'
						})
					})
				}
			})
			
		}
	}
}