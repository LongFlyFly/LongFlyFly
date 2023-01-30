const { query, json } = require('express');
var express = require('express');
const { default: request } = require('../../common/api/request.js');
var router = express.Router();
var connection = require('../db/sql.js') 
var user = require('../db/UserSql.js')

	
// 解决跨域问题
router.all("*", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OP0TIONS");
    res.header("X-Powered-By", "Express");
    res.header("Content-Type", "text/html; charset=UTF-8");
    next();
});

/* GET home page. */
router.get('/',function(req,res,next){
	res.render('index',{title:'Express'});
});
//修改订单
router.post('/api/submitOrder',function(req,res,next){
	console.log(req.body,1111)
	//订单号
	let orderId = req.body.orderId;
	//购物车中选中的商品
	let shopArr = req.body.shopArr;
	connection.query(`select * from store_order where order_id = ${orderId}`,function(err,result){
		//订单的id
		let id = result[0].id
		connection.query(`update store_order set order_status = replace(order_status,'1','2') where id=${id}`,function(){
			shopArr.forEach(v=>{
				connection.query(`delete from goods_cart where id = ${v}`,function(){
					
				})
			})
			res.send({
				data:{
					code:200,
					success:true
				}
			})
		})
	})
	
})

//生成订单
router.post('/api/addOrder',function(req,res,next){
	// 前端给后端传递的数据,生成订单号
	let goodsArr = req.body.arr;
	function setTimeDateFmt(s){
		return s<10 ? '0'+s:s
	}
	function orderNumber(){
		const now = new Date();
		let fullYear = setTimeDateFmt(now.getFullYear());
		let month =setTimeDateFmt(now.getMonth()+1) ;
		let day =  setTimeDateFmt(now.getDate());
		let hour = setTimeDateFmt(now.getHours()) ;
		let minutes =setTimeDateFmt(now.getMinutes()) ;
		let seconds = setTimeDateFmt(now.getSeconds());
	    let orderCode = fullYear + month + day + hour + minutes + seconds + (Math.round(Math.random()*1000000));
		return orderCode;
 	}
	//商品名称
	let goodsName =[];
	//订单总价
	let goodsPrice =0;
	//订单商品
	let goodsNum = 0;
	//订单号
	let orderId = orderNumber();
	
	JSON.parse(goodsArr).forEach(v=>{
		goodsName = v.name;
		goodsNum += parseInt(v.num);
		goodsPrice += v.num * v.pprice;
	})
	
	connection.query(`insert into store_order (uId,order_id,goods_name,goods_price,goods_num,order_status) values ('','${orderId}','${goodsName}','${goodsPrice}','${goodsNum}','1')`,function(e,r){
		connection.query(`select * from store_order where order_id = ${orderId}`,function(err,result){
			res.send({
				data:{
					code:200,
					success:true,
					data:result
				}
			})
		})
	})
})

//删除购物车
router.post('/api/deleteCart',function(req,res,next){
	let goodsId = req.body.goodsId;
	for(var i=0;i<=goodsId.length;i++){
		connection.query(`delete * from goods_cart where id=${goodsId[i]}`,function(e,r){
			res.json({
				data:{
					success:true
				}
			})
		})
	}
})

// 加入购物车
router.post('/api/addCart',function(req,res,next){
	let goods_id = req.body.goods_id;
	// 用户输入的商品数量
	let num = req.body.num
	connection.query("select * from goods_search where id='"+goods_id+"'", function (err, result){
		
		let name = result[0].name;
		let imgUrl = result[0].imgUrl;
		let pprice = result[0].pprice;
		// 查询当前用户之前是否添加过
		connection.query("select * from goods_cart where goods_id='"+goods_id+"'", function (err, data){
			
			if(data.length>0){
				// 如果当前用户已经添加，则修改
				connection.query("update goods_cart set num = replace(num,'"+data[0].num+"','"+  parseInt(num)+parseInt(data[0].num)  +"') where id = '"+data[0].num+"' ",function(er,rs){
					res.json({
						data:{
							success:"修改成功！"
						}
					})
				})
			}else{
				// 如果当前用户未添加，则添加
				connection.query('insert into goods_cart (uId,goods_id,name,imgUrl,pprice,num) values ("12","'+goods_id+'","'+name+'","'+imgUrl+'","'+pprice+'","'+num+'")', function (err, data){
					res.json({
						data:{
							success:"加入成功！"
						}
					})
				})
			}
		})
	})
})

// 修改当前用户数据库商品数量，当前用户哪一个商品的数量发生变化，原来的数量替换
router.post('/api/updataNumCart',function(req,res,next){
	let goodsId = req.body.goodsId;
	// 用户输入的商品数量
	let num = req.body.num
	connection.query("select * from goods_cart", function (err, result){
		connection.query("select * from goods_cart where goods_id = '"+goodsId+"' ", function (e, results){
			//数据库中当前的数量
			let goods_num = results[0].num;
			let id = results[0].Id
			//修改（替换）
			connection.query("update goods_cart set num = replace(num,'"+goods_num+"','"+num+"') where id = '"+id+"'",function(er,rs){
				res.send({
					data:{
						success:true
					}
				})
			})
		})
	})
})

//获取当前用户购物车列表
router.post('/api/selectCart',function(req,res,next){
	connection.query("select * from goods_cart", function (err, result){
		res.json({
			data:result
		})
	})
})

// 当前用户修改收货地址
router.post('/api/updateAdderss',function(req,res,next){
	let	name = req.body.name
	let tel = req.body.tel
	let province = req.body.province
	let city = req.body.city
	let district = req.body.district
	let address = req.body.address
	let isDefault = req.body.isDefault
	let id = req.body.id
	connection.query('update address set name = "'+name+'",tel = "'+tel+'",province = "'+province+'",city = "'+city+'",district = "'+district+'",address = "'+address+'",isDefault = "'+isDefault+'" where id = "'+id+'" ', function (err, result){
			res.send({
				data:{
					success:"成功"
				}
		})	
	})
	
});
//地址添加
router.post('/api/addAddress',function(req,res,next){
	let	name = req.body.name
	let tel = req.body.tel
	let province = req.body.province
	let city = req.body.city
	let district = req.body.district
	let address = req.body.address
	let isDefault = req.body.isDefault
	
	connection.query('insert into address (name,tel,province,city,district,address,isDefault) values ("'+name+'","'+tel+'","'+province+'","'+city+'","'+district+'","'+address+'","'+isDefault+'")', function (error, results, fields){
		res.send({
			data:{
				success:true
			}
		})
	})
});


// 当前用户查询收货地址
router.post('/api/selectAdderss',function(req,res,next){
		connection.query("select * from address userId", function (err, result){
			res.send({
				data:result
			})
		})
});

// 第三方的登录方式
router.post('/api/loginother',function(req,res,next){
	let params = {
		provider:req.body.provider,
		openid:req.body.openid,
		nickName:req.body.nickName,
		avatarUrl:req.body.avatarUrl,
	};
	
	// 查询数据库有没有此用户
	connection.query(user.queryUserName(params), function (error, results, fields){
		if(results.length>0){
			// 数据库中存在  只需读取
			connection.query(user.queryUserName(params), function (e,r){
				res.send({
					data:r[0]
				})
			})
		}else{
			// 数据库中不存在 需要存储
			connection.query(user.insertData(params), function (err, result){
				connection.query(user.queryUserName(params), function (e,r){
					res.send({
						data:r[0]
					})
				})
			})
		}
	})
});


//添加注册信息
router.post('/api/code',function(req,res,next){
	let	userName = req.body.userName
	let userPwd = req.body.userPwd
	let phone = req.body.phone
	let nickName = req.body.nickName
	// 生成随机字符串
	let token = Math.random().toString(36).substr(2);
	
	connection.query('insert into user (userName,userPwd,phone,imgUrl,nickName,token) values ("'+userName+'","'+userPwd+'","'+phone+'","null","'+nickName+'","'+token+'")', function (error, results, fields){
		res.send({
			data:{
				success:true,
				data:results[0]
			}
		})
	})
});

// 手机号注册验证
router.post('/api/registered',function(req,res,next){
	let	userName = req.body.phone
	// 查询手机号是否存在
	connection.query("SELECT * from user where userName = '"+userName+"' or phone='"+userName+"'", function (error, results, fields){
		if(results.length>0){
			res.send({
				data:{
					success:false,
					msg:"手机号已经存在",
					data:{}
				}
			})
		}else{
			res.send({
				data:{
					success:true
				}
			})
		}
	})
});

// 用户登录的接口
router.post('/api/login',function(req,res,next){
	// 拿到前端所给的数据
	let	userName = req.body.userName
	let	userPwd = req.body.userPwd
	
	// 查询用户名或者手机号是否存在
	connection.query("SELECT * from user where userName = '"+userName+"' or phone='"+userName+"'", function (error, results, fields){
		if(results.length>0){
			connection.query("SELECT * from user where userName = '"+userName+"' or phone='"+userName+"' and userPwd='"+userPwd+"'", function (err, result){
				if(result.length>0){
					res.send({
						data:{
							success:true,
							msg:"登录成功",
							data:result[0]
						}
					})
				}else{ 
					res.send({
						data:{
							success:false,
							msg:"密码不正确"
						}
					})
				}
			})
		}else{
			res.send({
				data:{
					success:false,
					msg:"用户名或者手机号不存在"
				}
			})
		}
	})
});


router.get('/api/goods/id',function(req,res,next){
	let id = req.query.id
	connection.query("SELECT * from student where id="+id+" ", function (error, results, fields) {
		if (error) throw error;
		// 发送到前端
		res.send({
			code:"0",
			data:results
		})
	});
});

// list接口
router.get('/api/goods/list',function(req,res,next){
	res.json({
		code:0,
		data:[
			{
				id:1,
				name:"家庭专用",
				data:[
					{
						name:"家用围裙",
						list:[
							{
								id:1,
								name:"哈哈裙",
								imgUrl:"https://g-search1.alicdn.com/img/bao/uploaded/i4/imgextra/i4/309070188/O1CN01PBrnm41DG9FdGx1A5_!!0-saturn_solar.jpg_460x460Q90.jpg_.webp",
							},
							{
								id:2,
								name:"厨房裙",
								imgUrl:"https://picasso.alicdn.com/imgextra/O1CNA1nqrLX329VwdwaEBPY_!!3181508074-0-psf.jpg_460x460Q90.jpg_.webp",
							}
						]
					},
					{
						name:"家用鞋",
						list:[
							{
								id:1,
								name:"凉鞋",
								imgUrl:"https://picasso.alicdn.com/imgextra/ad4c3d/O1CNA1Pimgrenderad4c3dO1CN01R7zFt21g3tPUdhDyj_!!0-item_pic.jpg?backup_url=O1CN01R7zFt21g3tPUdhDyj_!!0-item_pic.jpg&p_context=eyJiaXoiOiJtYWMiLCJidWNrZXRJZCI6IkMiLCJjaGFubmVsIjoid3NlYXJjaGljb24taXRlbSIsIml0ZW1JZCI6IjYxMjYyOTEyMDg2OSIsInBpY1R5cGUiOiJwMTEiLCJyZW5kZXJDb25kaXRpb24iOnt9LCJyZW5kZXJEYXRhIjp7fX0-&sign=ad4c3d522887345d8c2647de108424ce&v=4.0_460x460Q90.jpg_.webp",
							},
							{
								id:2,
								name:"毛鞋",
								imgUrl:"https://g-search3.alicdn.com/img/bao/uploaded/i4/i4/3425540944/O1CN016xLg7g1IqOetDMHK1_!!0-item_pic.jpg_460x460Q90.jpg_.webp",
							}
						]
					}
				]
			},
			
			{
				id:2,
				name:"女装",
				data:[
					{
						name:"裙装",
						list:[
							{
								id:1,
								name:"连衣裙",
								imgUrl:"https://g-search2.alicdn.com/img/bao/uploaded/i4/i2/2449973497/O1CN01CWvJgB1bhfpNi6EN0_!!2449973497.jpg_460x460Q90.jpg_.webp",
							},
							{
								id:2,
								name:"半生裙",
								imgUrl:"https://g-search3.alicdn.com/img/bao/uploaded/i4/i3/1908020412/O1CN01NARuL31EujxyoJTxO_!!2-item_pic.png_460x460Q90.jpg_.webp",
							}
						]
					},
					{
						name:"上衣",
						list:[
							{
								id:1,
								name:"衬衣",
								imgUrl:"https://g-search1.alicdn.com/img/bao/uploaded/i4/imgextra/i3/32464494/O1CN01XJijRL1j4IhIlP7cb_!!0-saturn_solar.jpg_460x460Q90.jpg_.webp",
							},
							{
								id:2,
								name:"T恤",
								imgUrl:"https://g-search3.alicdn.com/img/bao/uploaded/i4/i4/2880232099/O1CN01KOqyQe1RNNyymx1CF_!!0-item_pic.jpg_460x460Q90.jpg_.webp",
							}
						]
					}
				]
			},
			{
				id:3,
				name:"男装",
				data:[
					{
						name:"上衣",
						list:[
							{
								id:1,
								name:"卫衣",
								imgUrl:"https://g-search1.alicdn.com/img/bao/uploaded/i4/imgextra/i3/708440003/O1CN01DGsHkd1BtPyxEfI1W_!!0-saturn_solar.jpg_460x460Q90.jpg_.webp",
							},
							{
								id:2,
								name:"嘻哈风",
								imgUrl:"https://g-search3.alicdn.com/img/bao/uploaded/i4/i3/676198570/O1CN018mNuyR2DB75cNN4Ho_!!0-item_pic.jpg_460x460Q90.jpg_.webp",
							}
						]
					},
					{
						name:"裤子",
						list:[
							{
								id:1,
								name:"工装裤",
								imgUrl:"https://g-search1.alicdn.com/img/bao/uploaded/i4/imgextra/i1/98648795/O1CN01v55Hkr2EqABwJFhJn_!!0-saturn_solar.jpg_460x460Q90.jpg_.webp",
							},
							{
								id:2,
								name:"运动裤",
								imgUrl:"https://g-search3.alicdn.com/img/bao/uploaded/i4/i3/2095638804/O1CN01VFpUd62EuHkAOSmmD_!!0-item_pic.jpg_460x460Q90.jpg_.webp",
							}
						]
					}
				]
			},
		]
	})
});

// 搜所数据
router.get("/api/goods/search",function(req,res,next){
	// 解构获取对象的key
	let [goodsName,orderName] = Object.keys(req.query);
	// 拿到name参数的值
	let name = req.query.name;
	// 拿到ordernName的key的值
	let order = req.query[orderName]
	
	// 模糊搜索，条件查询   desc降序  asc升序
	connection.query("SELECT * from student where name like '%"+name+"%' order by "+orderName+" "+order+"", function (error, results, fields) {
		if (error) throw error;
		// 发送到前端
		res.send({
			code:"0",
			data:results
		})
	});

});


// 运动户外
router.get('/api/index_list/2/data/1', function(req, res, next) {
   res.json({
	   code:'0',
	   data:[
		   {
			   type:"bannerList",
			   imgUrl:"https://img.zcool.cn/community/0142d359f1995da801216a4b379d5a.jpg@1280w_1l_2o_100sh.jpg"
		   },
		   {
			   type:"iconsList",
			   data:[
				    {imgUrl:"https://g-search2.alicdn.com/img/bao/uploaded/i4/i2/3728235227/O1CN01DgvnIK1oU12n3tT1l_!!0-item_pic.jpg_460x460Q90.jpg_.webp", name:"运动鞋"},
					{imgUrl:"https://g-search1.alicdn.com/img/bao/uploaded/i4/imgextra/i3/3099122381/O1CN01K0Ap8y1TSXoi04aXG_!!0-saturn_solar.jpg_460x460Q90.jpg_.webp", name:"运动裤"},
					{imgUrl:"https://g-search3.alicdn.com/img/bao/uploaded/i4/i2/352469034/O1CN01IyygPF2GbcqORmNpU_!!0-item_pic.jpg_460x460Q90.jpg_.webp", name:"运动衣"},
					{imgUrl:"https://g-search1.alicdn.com/img/bao/uploaded/i4/imgextra/i3/97009984/O1CN01EIWzff2Ncj6jbKFdS_!!0-saturn_solar.jpg_460x460Q90.jpg_.webp", name:"暴汗服"}
			   ]
		   },
		   {
			   type:"hotList",
			   data:[
				  {Id:1,imgUrl:"https://g-search3.alicdn.com/img/bao/uploaded/i4/i3/3201457638/O1CN01rAfxC426IFvtVRZkh_!!0-item_pic.jpg_460x460Q90.jpg_.webp",name:"超级暴汗服",pprice:"199",oprice:"299",discount:"6.6"},
				  {Id:2,imgUrl:"https://g-search2.alicdn.com/img/bao/uploaded/i4/i1/353571709/O1CN01JY9nqj1OUlgTm9H9l_!!353571709.jpg_460x460Q90.jpg_.webp",name:"好一双跑鞋",pprice:"299",oprice:"399",discount:"7.7"},
				  {Id:3,imgUrl:"https://g-search3.alicdn.com/img/bao/uploaded/i4/i1/1771478330/O1CN01NkJVEW2BPBnoJzHLG_!!0-item_pic.jpg_460x460Q90.jpg_.webp",name:"运动灰裤",pprice:"88",oprice:"128",discount:"8.8"}
			   ]
		   },
		   {
			   type:"shopList",
			   data:[
				   {
				   					bigUrl:"https://g-search1.alicdn.com/img/bao/uploaded/i4/imgextra/i3/97717357/O1CN01iiUeYy24DYQWK2q7h_!!0-saturn_solar.jpg_460x460Q90.jpg_.webp",
				   data:[
				      					   {Id:1,imgUrl:"https://g-search1.alicdn.com/img/bao/uploaded/i4/i3/653902181/O1CN01zdu3BA1RywafJ24Mo_!!0-item_pic.jpg_460x460Q90.jpg_.webp",name:"运动帽（冬）",pprice:"49",oprice:"69",discount:"8.8"},
				      					   {Id:2,imgUrl:"https://g-search3.alicdn.com/img/bao/uploaded/i4/i4/67179755/O1CN01tPlqYg2LvqMJeD8li_!!67179755.jpg_460x460Q90.jpg_.webp",name:"耐克袜子",pprice:"29",oprice:"39",discount:"6.5"},
				      					   {Id:3,imgUrl:"https://g-search1.alicdn.com/img/bao/uploaded/i4/i3/1714128138/O1CN01wrEdYq29zFzVwSg2a_!!2-item_pic.png_460x460Q90.jpg_.webp",name:"小米运动手环",pprice:"299",oprice:"599",discount:"5.2"},
				      					   {Id:4,imgUrl:"https://g-search3.alicdn.com/img/bao/uploaded/i4/i3/2201410209674/O1CN01qCYCEX2LKkKUxjgam_!!0-item_pic.jpg_460x460Q90.jpg_.webp",name:"情侣运动装",pprice:"269",oprice:"499",discount:"6.3"},
				      					   {Id:5,imgUrl:"https://g-search2.alicdn.com/img/bao/uploaded/i4/i4/1613724963/O1CN01ioZZVb1mX6TSzijU9_!!1613724963.jpg_460x460Q90.jpg_.webp",name:"跑步鞋",pprice:"129",oprice:"279",discount:"5.5"},
				      					   {Id:6,imgUrl:"https://g-search2.alicdn.com/img/bao/uploaded/i4/i4/2111351203/O1CN01JcoTnZ1Kl1Fuxcwvk_!!2111351203.jpg_460x460Q90.jpg_.webp",name:"运动裤（冬）",pprice:"63",oprice:"99",discount:"6"}
				   ]
				   }
			   ]
		   },
		   
		   // {
		   // 			   type:"bannerList",
		   // 			   imgUrl:"../../static/img/banner-2.jpg"
		   // },
		   // {
		   // 			   type:"iconsList",
		   // 			   data:[
		   // 				    {imgUrl:"../../static/img/tab-1.png", name:"运动户外"},
		   // 					{imgUrl:"../../static/img/tab-2.png", name:"运动户外"},
		   // 					{imgUrl:"../../static/img/tab-3.png", name:"运动户外"},
		   // 					{imgUrl:"../../static/img/tab-4.png", name:"运动户外"},
		   // 					{imgUrl:"../../static/img/tab-1.png", name:"运动户外"},
		   // 					{imgUrl:"../../static/img/tab-2.png", name:"运动户外"},
		   // 					{imgUrl:"../../static/img/tab-3.png", name:"运动户外"},
		   // 					{imgUrl:"../../static/img/tab-4.png", name:"运动户外"}
		   // 			   ]
		   // },
		   // {
		   // 			   type:"hotList",
		   // 			   data:[
		   // 				  {id:1,imgUrl:"../../static/img/chao-1.png",name:"哈哈哈好好好",pprice:"299",oprice:"599",discount:"5.2"},
		   // 				  {id:2,imgUrl:"../../static/img/chao-2.png",name:"哈哈哈好好好",pprice:"299",oprice:"599",discount:"5.2"},
		   // 				  {id:3,imgUrl:"../../static/img/chao-3.png",name:"哈哈哈好好好",pprice:"299",oprice:"599",discount:"5.2"}
		   // 			   ]
		   // },
		   // {
		   // 			   type:"shopList",
		   // 			   data:[
		   // 				   {
		   // 				   		bigUrl:"../../static/img/new-1.png",
		   // 				   data:[
		   // 				      	{id:1,imgUrl:"../../static/img/chao-1.png",name:"哈哈哈好好好",pprice:"299",oprice:"599",discount:"5.2"},
		   // 				      	{id:2,imgUrl:"../../static/img/chao-2.png",name:"哈哈哈好好好",pprice:"299",oprice:"599",discount:"5.2"},
		   // 				      	{id:3,imgUrl:"../../static/img/chao-3.png",name:"哈哈哈好好好",pprice:"299",oprice:"599",discount:"5.2"},
		   // 				      	{id:4,imgUrl:"../../static/img/chao-4.png",name:"哈哈哈好好好",pprice:"299",oprice:"599",discount:"5.2"},
					// 			{id:5,imgUrl:"../../static/img/chao-1.png",name:"哈哈哈好好好",pprice:"299",oprice:"599",discount:"5.2"},
		   // 				      	{id:6,imgUrl:"../../static/img/chao-2.png",name:"哈哈哈好好好",pprice:"299",oprice:"599",discount:"5.2"},
		   // 				   ]
		   // 				   }
		   // 			   ]
		   // },
		   {
		   				  // 下面的展示
		   				  type:"commodityList",
		   				  data:[
		   					  {Id:1,imgUrl:"../../static/img/chao-1.png",name:"休闲风（男）",pprice:"229",oprice:"159",discount:"6.7"},
		   					  {Id:2,imgUrl:"../../static/img/chao-2.png",name:"彩彩群",pprice:"323",oprice:"432",discount:"8.8"},
		   				  ]
		   }
	   ]
   })
});

// 气质女神
router.get('/api/index_list/3/data/1', function(req, res, next) {
   res.json({
   	   code:'0',
   	   data:[
   		   {
   			   type:"bannerList",
   			   imgUrl:"../../static/img/banner-2.jpg"
   		   },
   		   {
   			   type:"iconsList",
   			   data:[
   				    {imgUrl:"https://g-search3.alicdn.com/img/bao/uploaded/i4/i3/851003831/O1CN01g0cyxc1eAe3G5ViTu_!!851003831.jpg_460x460Q90.jpg_.webp", name:"上衣"},
   					{imgUrl:"https://g-search1.alicdn.com/img/bao/uploaded/i4/imgextra/i2/40475631/O1CN01BxkZgt1rT33UuqDBy_!!0-saturn_solar.jpg_460x460Q90.jpg_.webp", name:"裤子"},
   					{imgUrl:"https://g-search3.alicdn.com/img/bao/uploaded/i4/i3/2056385669/O1CN01HIr5za1rkS6WctNFY_!!0-item_pic.jpg_460x460Q90.jpg_.webp", name:"裙子"},
   					{imgUrl:"https://g-search3.alicdn.com/img/bao/uploaded/i4/i1/3436101173/O1CN01ctBn6e1KXHLcUIa4l_!!3436101173.jpg_460x460Q90.jpg_.webp", name:"高跟鞋"},
   			   ]
   		   },
   		   {
   			   type:"hotList",
   			   data:[
   				  {Id:1,imgUrl:"https://g-search3.alicdn.com/img/bao/uploaded/i4/i2/3428627558/O1CN01yuzD8a25hcG3mjAyw_!!0-item_pic.jpg_460x460Q90.jpg_.webp",name:"高脚跟的鞋",pprice:"76",oprice:"99",discount:"9"},
   				  {Id:2,imgUrl:"https://g-search3.alicdn.com/img/bao/uploaded/i4/i1/3518844301/O1CN01MbTWsH1hduFveVJlS_!!0-item_pic.jpg_460x460Q90.jpg_.webp",name:"修身",pprice:"139",oprice:"249",discount:"6.6"},
   				  {Id:3,imgUrl:"https://g-search3.alicdn.com/img/bao/uploaded/i4/i2/896386713/O1CN01RrG3EZ1zSba53IMaq_!!896386713.jpg_460x460Q90.jpg_.webp",name:"羊绒上衣",pprice:"299",oprice:"399",discount:"8.6"}
   			   ]
   		   },
   		   {
   			   type:"shopList",
   			   data:[
				   {
					bigUrl:"https://g-search3.alicdn.com/img/bao/uploaded/i4/i4/172619986/O1CN015FgyGD2NddtcUEkNt_!!172619986.jpg_460x460Q90.jpg_.webp",
   				   data:[
   					   {Id:1,imgUrl:"https://g-search1.alicdn.com/img/bao/uploaded/i4/imgextra/i4/13836353/O1CN01SQ88Su1wniwdJrYNv_!!0-saturn_solar.jpg_460x460Q90.jpg_.webp",name:"复古",pprice:"1299",oprice:"1999",discount:"9"},
   					   {Id:2,imgUrl:"https://g-search2.alicdn.com/img/bao/uploaded/i4/i2/676716255/O1CN01BuId5U1w4q6aK3n2Z_!!676716255.jpg_460x460Q90.jpg_.webp",name:"打底衫",pprice:"49",oprice:"59",discount:"6"},
   					   {Id:3,imgUrl:"https://g-search3.alicdn.com/img/bao/uploaded/i4/i4/2200642278893/O1CN01bSaYAq2FZ2vGEMn9P_!!0-item_pic.jpg_460x460Q90.jpg_.webp",name:"牛仔裤",pprice:"99",oprice:"139",discount:"5.2"},
   					   {Id:4,imgUrl:"https://g-search3.alicdn.com/img/bao/uploaded/i4/i1/3676779725/O1CN01ezYEBu2Li6TpLr767_!!0-item_pic.jpg_460x460Q90.jpg_.webp",name:"高腰裤",pprice:"69"},
   					   {Id:5,imgUrl:"https://g-search1.alicdn.com/img/bao/uploaded/i4/i1/1656954324/O1CN01nG8ul91hoRK5udDJr_!!1656954324.jpg_460x460Q90.jpg_.webp",name:"增高皮鞋",pprice:"158",oprice:"239",discount:"7.4"},
   					   {Id:6,imgUrl:"https://g-search3.alicdn.com/img/bao/uploaded/i4/i1/353571709/O1CN019HSQVw1OUlgTlGtKb_!!353571709.jpg_460x460Q90.jpg_.webp",name:"空军一号",pprice:"1199",oprice:"1899",discount:"8.2"},
   				   ]
				   }
   				  
   			   ]
   		   },
   		   
   		   {
   		   				  // 下面的展示
   		   				  type:"commodityList",
   		   				  data:[
   		   					  {Id:9,imgUrl:"https://g-search1.alicdn.com/img/bao/uploaded/i4/imgextra/i4/26958996/O1CN01ZauIfo2GKDiHk1DLo_!!0-saturn_solar.jpg_460x460Q90.jpg_.webp",name:"复古小群",pprice:"329",oprice:"659",discount:"5.5"},
   		   					  {Id:10,imgUrl:"https://g-search1.alicdn.com/img/bao/uploaded/i4/i3/2056385669/O1CN01HIr5za1rkS6WctNFY_!!0-item_pic.jpg_460x460Q90.jpg_.webp",name:"连衣裙",pprice:"59",oprice:"99",discount:"5.6"},
   		   				  ]
   		   }
   	   ]
   })
});
// 推荐
router.get('/api/index_list/data', function(req, res, next) {
  res.send({
	  "code":0,
	  "data":{
		  // 导航栏
		  topBar:[
		  	{id:1,name:'推荐'},
			{id:2,name:'运动户外'},
			{id:3,name:'气质女神'},
			{id:4,name:'精神小伙'},
			{id:5,name:'春秋换季'},
			{id:6,name:'冬暖夏凉'},
			{id:7,name:'母婴专场'}
		  ],
		  data:[
			  {
				// 滑动轮番
				type:"swiperList",
				data:[
					{imgUrl:'https://img.alicdn.com/imgextra/i4/6000000004047/O1CN01Y8A3Cu1flZaFyZZft_!!6000000004047-0-alimamazszw.jpg'},
					{imgUrl:'https://img.alicdn.com/simba/img/TB1lUZLJVXXXXXtXFXXSutbFXXX.jpg'},
					{imgUrl:'../../static/img/banner-3.jpg'},
					{imgUrl:'../../static/img/banner-4.jpg'}
				] 
			  },
			  // 内容
			  {
				  type:"recommendList",
				  data:[
					  {
						  // 大图
						  bigUrl:'https://img.alicdn.com/imgextra/i4/6000000004047/O1CN01Y8A3Cu1flZaFyZZft_!!6000000004047-0-alimamazszw.jpg',
						  data:[
							  // 小图
							  {imgUrl:'https://img.alicdn.com/bao/uploaded/i1/2469229960/O1CN012Z0meM2NRjc5koNQU_!!2469229960.jpg'},
							  {imgUrl:'https://gd4.alicdn.com/imgextra/i4/805519431/O1CN01nI1r5H2JXS3XUM887_!!805519431.jpg'},
							  {imgUrl:'https://gw.alicdn.com/imgextra/i4/2851559050/O1CN01zuuSLO2GixBYwYAV7_!!2851559050.jpg_Q75.jpg_.webp'}
						  ]
					  }
				  ]
			  },
			  {
				  // 下面的展示
				  type:"commodityList",
				  data:[
					  {Id:1,imgUrl:"https://g-search3.alicdn.com/img/bao/uploaded/i4/i2/282443726/O1CN01dGZpkx1dOYWTayClv_!!282443726.jpg_460x460Q90.jpg_.webp",name:"卫衣男酷",pprice:"89",oprice:"159",discount:"6"},
					  {Id:2,imgUrl:"https://g-search1.alicdn.com/img/bao/uploaded/i4/i3/2201488921/O1CN016YE6H52Fls2q3cNqU_!!0-item_pic.jpg_460x460Q90.jpg_.webp",name:"清爽短袖",pprice:"39",oprice:"49",discount:"8.8"},
				  ]
			  }
		  ]
	  }
  })
});

// 气质女神第一次触底的数据
router.get('/api/index_list/3/data/3',function(req, res, next){
	res.json({
		code:'0',
		data:[
			{
				// 下面的展示
				type:"commodityList",
				data:[
					{Id:1,imgUrl:"https://g-search1.alicdn.com/img/bao/uploaded/i4/i3/3074128955/O1CN0174Vajq2G1RXMiMewf_!!0-item_pic.jpg_460x460Q90.jpg_.webp",name:"jk裙",pprice:"129",oprice:"179",discount:"8.7"},
					{Id:2,imgUrl:"https://g-search3.alicdn.com/img/bao/uploaded/i4/i1/2200860831754/O1CN01GrH45C1OpNICjrKIT_!!2200860831754-0-lubanu-s.jpg_460x460Q90.jpg_.webp",name:"jk群2",pprice:"199",oprice:"299",discount:"7.7"},
					{Id:3,imgUrl:"https://g-search1.alicdn.com/img/bao/uploaded/i4/i3/2206863261473/O1CN01iGiO881MkgCaiEqk3_!!0-item_pic.jpg_460x460Q90.jpg_.webp",name:"宽松裤",pprice:"29",oprice:"59",discount:"6.7"},
					{Id:4,imgUrl:"https://g-search3.alicdn.com/img/bao/uploaded/i4/i3/3841645288/O1CN01qrrpOh1ovxB7isj52_!!0-item_pic.jpg_460x460Q90.jpg_.webp",name:"运动休闲裤（韩）",pprice:"19",oprice:"38",discount:"5"},
					{Id:5,imgUrl:"https://g-search1.alicdn.com/img/bao/uploaded/i4/imgextra/i2/109060025/O1CN018y8mol1C3UhW7BdP1_!!0-saturn_solar.jpg_460x460Q90.jpg_.webp",name:"卫衣女",pprice:"80",oprice:"100",discount:"8"},
					{Id:6,imgUrl:"https://g-search3.alicdn.com/img/bao/uploaded/i4/i1/157343295/O1CN01pK3Av21aD9qIqekfg_!!0-item_pic.jpg_460x460Q90.jpg_.webp",name:"毛衣秀",pprice:"199",oprice:"299",discount:"6.4"}
				]
			}
		]
	})
})

// 运动户外第一次触底的数据
router.get('/api/index_list/2/data/3',function(req, res, next){
	res.json({
		code:'0',
		data:[
			{
				// 下面的展示
				type:"commodityList",
				data:[
					{Id:1,imgUrl:"https://g-search1.alicdn.com/img/bao/uploaded/i4/i3/3074128955/O1CN0174Vajq2G1RXMiMewf_!!0-item_pic.jpg_460x460Q90.jpg_.webp",name:"jk裙",pprice:"129",oprice:"179",discount:"8.7"},
					{Id:2,imgUrl:"https://g-search3.alicdn.com/img/bao/uploaded/i4/i1/2200860831754/O1CN01GrH45C1OpNICjrKIT_!!2200860831754-0-lubanu-s.jpg_460x460Q90.jpg_.webp",name:"jk群2",pprice:"199",oprice:"299",discount:"7.7"},
					{Id:3,imgUrl:"https://g-search1.alicdn.com/img/bao/uploaded/i4/i3/2206863261473/O1CN01iGiO881MkgCaiEqk3_!!0-item_pic.jpg_460x460Q90.jpg_.webp",name:"宽松裤",pprice:"29",oprice:"59",discount:"6.7"},
					{Id:4,imgUrl:"https://g-search3.alicdn.com/img/bao/uploaded/i4/i3/3841645288/O1CN01qrrpOh1ovxB7isj52_!!0-item_pic.jpg_460x460Q90.jpg_.webp",name:"运动休闲裤（韩）",pprice:"19",oprice:"38",discount:"5"},
					{Id:5,imgUrl:"https://g-search1.alicdn.com/img/bao/uploaded/i4/imgextra/i2/109060025/O1CN018y8mol1C3UhW7BdP1_!!0-saturn_solar.jpg_460x460Q90.jpg_.webp",name:"卫衣女",pprice:"80",oprice:"100",discount:"8"},
					{Id:6,imgUrl:"https://g-search3.alicdn.com/img/bao/uploaded/i4/i1/157343295/O1CN01pK3Av21aD9qIqekfg_!!0-item_pic.jpg_460x460Q90.jpg_.webp",name:"毛衣秀",pprice:"199",oprice:"299",discount:"6.4"}
				]
			}
		]
	})
})

// 首页第一次触底的数据
router.get('/api/index_list/1/data/2',function(req, res, next){
	res.json({
		code:'0',
		data:[
			{
				// 下面的展示
				type:"commodityList",
				data:[
					{Id:3,imgUrl:"https://g-search1.alicdn.com/img/bao/uploaded/i4/imgextra/i3/97717357/O1CN01LnOlSD24DYbhX7N53_!!0-saturn_solar.jpg_460x460Q90.jpg_.webp",name:"健身全套",pprice:"99",oprice:"129",discount:"7.8"},
					{Id:4,imgUrl:"https://g-search1.alicdn.com/img/bao/uploaded/i4/i1/2845531033/O1CN01s6Ox8l1JV9wVKK6vy_!!0-item_pic.jpg_460x460Q90.jpg_.webp",name:"最靓的崽",pprice:"59",oprice:"99",discount:"8.8"},
					{Id:5,imgUrl:"https://g-search1.alicdn.com/img/bao/uploaded/i4/i3/2206863261473/O1CN01iGiO881MkgCaiEqk3_!!0-item_pic.jpg_460x460Q90.jpg_.webp",name:"宽松裤",pprice:"29",oprice:"59",discount:"6.7"},
					{Id:6,imgUrl:"https://g-search3.alicdn.com/img/bao/uploaded/i4/i3/3841645288/O1CN01qrrpOh1ovxB7isj52_!!0-item_pic.jpg_460x460Q90.jpg_.webp",name:"运动休闲裤（韩）",pprice:"19",oprice:"38",discount:"5"},
					{Id:7,imgUrl:"https://g-search1.alicdn.com/img/bao/uploaded/i4/imgextra/i2/109060025/O1CN018y8mol1C3UhW7BdP1_!!0-saturn_solar.jpg_460x460Q90.jpg_.webp",name:"卫衣女",pprice:"80",oprice:"100",discount:"8"},
					{Id:8,imgUrl:"https://g-search3.alicdn.com/img/bao/uploaded/i4/i1/157343295/O1CN01pK3Av21aD9qIqekfg_!!0-item_pic.jpg_460x460Q90.jpg_.webp",name:"毛衣秀",pprice:"199",oprice:"299",discount:"6.4"}
				]
			}
		]
	})
})

module.exports = router;
