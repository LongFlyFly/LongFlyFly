export default{
	state:{
		list:[]
	},
	getters:{
		// 筛选默认地址
		defaultPath(state){
			return state.list.filter(v=>{
				return v.isDefault ==1;
			})
		}
	},
	mutations:{
		// 拿到当前用户收货地址数据
		_initAddressList(state,list){
			state.list = list
		},
		createPath(state,obj){
			state.list.unshift(obj);
		},
		updatePath(state,{index,item}){
			
			for(let key in item){
				state.list[index][key]=item[key]
			}
		},
		// 把选中的变成未选中
		removePath(state){
			state.list.forEach(v=>{
				if(v.isDefault){
					v.isDefault = 0;
				}
			})
		}
	},
	actions:{
		createPathFn({commit},obj){
			if(obj.isDefault){
				commit('removePath')
			}
			commit('createPath',obj)
		},
		updatePathFn({commit},obj){
			if(obj.item.isDefault){
				commit('removePath')
			}
			
			commit('updatePath',obj)
		}
		
	}
}