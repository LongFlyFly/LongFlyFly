var User = {
	// 查询用户名
	queryUserName(param){
		if(param.user){
			//phone = 应该是手机号这个变量属性，为了后面好操作所有名称均改为userName
			return "SELECT * from user where userName = '"+param.userName+"' or phone='"+param.userName+"'"
		}else{
			// 第三方登录方式
			return "SELECT * from user where provider = '"+param.provider+"' or openid='"+param.openid+"'"
		}
		
	},
	
	//验证用户名和密码
	queryUserPwd(param){
		return "SELECT * from user where userName = '"+param.userName+"' or phone='"+param.userName+"' and userPwd='"+param.userPwd+"'"
	},
	
	//增加一条用户数据
	insertData(param){
		let userName = param.userName || param.openid
		let nickName = param.nickName || "默认昵称"
		let avatarUrl = param.avatarUrl || "null"
		let token = Math.random().toString(36).substr(2);
		return 'insert into user (userName,userPwd,phone,imgUrl,nickName,token,provider,openid) values ("","12345678","'+param.userName+'","'+avatarUrl+'","'+nickName+'","'+token+'","'+param.provider+'","'+param.openid+'")'
	},
}

exports = module.exports = User

