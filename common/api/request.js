var Request ={
	
	// 默认值
	common:{
		// 网络地址
		baseUrl:"http://192.168.43.72:3000/api",
		
		// data给后端传东西
		data:{},
		
		header:{
			"Content-Type":"application/json",
			"Content-Type":"application/x-www-form-urlencoded"
		},
		method:"GET",
		dataType:"json"
	},
	
	request(options={}){
		
		uni.showLoading({
			title:'加载中'
		})
		
		options.url = this.common.baseUrl + options.url;
		options.data=options.data||this.common.data;
		options.header=options.header||this.common.header;
		options.method=options.method||this.common.method;
		options.dataType=options.dataType||this.common.dataType;
	
		// 异步操作
		return new Promise((res,rej)=>{
			uni.request({
				// 此出不能用localhost,要用ip地址
				...options,
				success:(result)=>{
					if(result.statusCode!=200){
						return rej();
					}
					let data = result.data.data;
					res(data);
					// 请求后关闭
					setTimeout(function(){
						uni.hideLoading();
					},1000);
				}	
			})
		})
	}
}

exports = module.exports = Request