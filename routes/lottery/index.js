module.exports = function(app) {
    app.get('/api/lottery', function(req, res) {
        pool.connect(function(err, cc) {          
            var result = [];
            var activitiesId = 1
            Global.async([
                //查询抽奖应用表
                function(callback) {
                    cc.query('SELECT * FROM `app_lottery` where activity_id = ' + pool.escape(activitiesId), function(err, rows) {
                        
                        result = rows[0];
                        result['beginTime'] = Global.dateFormat(result['beginTime'], 'yyyy-mm-dd');
                        result['endTime'] = Global.dateFormat(result['endTime'], 'yyyy-mm-dd');
                        callback();
                        //cc.shutdown();
                    });
                },

                //查询奖项表
                function(callback) {
                    //查询活动参与者表
                    cc.query('SELECT * FROM `activity_user` WHERE activity_id = ' + pool.escape(activitiesId), function(err, rows) {
                        //console.log(rows);
                        result['joiner'] = rows;
                        cc.query('')
                        callback()
                    });
                }
                ],
                function() {

                    cc.query('SELECT * FROM `app_lottery_award` WHERE app_lottery_id = ' + result['id'], function(err, rows) {
                        result['award'] = rows;

                        var joiner = result['joiner'];
	                    var award = result['award'];
	                    	res.render('lottery/index', {
		                    result: result,
		                    joiner: joiner,
		                    award: award,
		                });
                    })
                    

/*                res.render('lottery/index', {
                    result: result,
                    joiner: joiner,
                    award: award,
                });*/

            });
        });
    });
    /*	app.get('/lottery/index/odds', function(req, res) {
    		Global.async([

    			function(callback) {
    				console.log('a');
    				callback();
    			},
    			function(callback) {
    				console.log('b');
    				callback();
    			},
    			function(callback) {
    				setTimeout(function() {
    					console.log('c');
    					callback();
    				}, 1000);
    			},
    			function(callback) {
    				console.log('d');
    				callback();
    			}
    		], function() {
    			console.log('last');
    		});
    		res.json('invoke');
    	});
    */

    app.get('/api/award', function(req, res) {
    	var reqData = req.query.award.toString().split('_');
		console.log(reqData);
        var result = [];
        var activitiesId = parseInt(reqData[reqData.length - 1 ]); 
        var awardId = parseInt(reqData[0]);
    	pool.connect(function(err, cc) {
           
                //查询抽奖应用表
                	if(err) console.log(err);
                    cc.query('SELECT * FROM `app_lottery` where activity_id = ' + pool.escape(activitiesId), function(err, rows) {
                        cc.query('SELECT * FROM `app_lottery_award` where id = ' + pool.escape(awardId), function(err, rows) {

	                        cc.shutdown();
	                        console.log(rows);
	                        res.json(rows);
                        });

                    });
                
        });
    });

    app.get('/api/static', function(req ,res){
    	res.render('lottery/static');
    })

    app.post('/api/lottery/index/lottery', function(req, res) {

            var result = [];
            var activitiesId = req.body.activitiesId;
            var activitiesConfig = req.body.activitiesConfig;
            var currentDate = Global.dateFormat(new Date().getTime(), 'yyyy-mm-dd hh:mm:ss');

            pool.connect(function(err, cc) {


            });
        })


    // 整体抽奖
    app.get('/api/lottery/index/lottery', function(req, res) {


    	var reqData = req.query.lottery.toString().split('_');
    		console.log(reqData);
        var result = [];
        var joiner = [];
        var tempArr = [];
        var winner = [];
        var activitiesId = parseInt(reqData[reqData.length - 1 ]); 								// 活动 ID 
        var activitiesConfig = true; 						// 活动配置？
        var awardId = parseInt(reqData[0]); 									// 活动奖品表ID
        var total, pernum, award, appLotteryId;
        var currentDate = Global.dateFormat(new Date().getTime(), 'yyyy-mm-dd hh:mm:ss');
        

        pool.connect(function(err, cc) {
            Global.sync([
                //查询活动表
                function(callback) {
                    cc.query('SELECT * FROM `app_lottery` WHERE id = ' + pool.escape(activitiesId), function(err, rows) {
                        if (err) console.log( 'query lottery are error' + err );
                        result = rows[0];
                        result['app_lottery_id'] = appLotteryId = result['id'];
                        result['beginTime'] = Global.dateFormat(result['beginTime'], 'yyyy-mm-dd hh:mm:ss');
                        result['endTime'] = Global.dateFormat(result['endTime'], 'yyyy-mm-dd hh:mm:ss');
                        callback();
                    });
                },
                function(callback) {

                    var parseCurrentTime = Date.parse(currentDate); 									//取到服务器的北京时间
                    var parseBeginTime = Date.parse(result['beginTime']);
                    var parseEndTimeDate = Date.parse(result['endTime']);
                    //var joinLen = joiner.length;
                    if (parseCurrentTime >= parseBeginTime && parseCurrentTime <= parseEndTimeDate) {			//判定活动是否再活动区间内

                        Global.async([
                                //查询奖品表
                                function(callback) {
                                    cc.query('SELECT * FROM `app_lottery_award` WHERE id = ' + pool.escape(awardId), function(err, rows) {
                                        if (err) console.log( 'query award are error' + err );
                                        result['award'] = rows;
                                        callback();
                                    })
                                },
                                //查询获奖者表
                                function(callback) {
                                //    cc.query('SELECT * FROM `app_lottery_user` WHERE app_lottery_award_id = ' + awardId, function(err, rows) {
                                	  cc.query('SELECT activity_user_id FROM `app_lottery_user` as lotteryUser left join `activity_user` as user on(lotteryUser.activity_user_id = user.id) WHERE user.activity_id = '+pool.escape(activitiesId),function(err, rows){
                                        if (err) console.log('query lottery user are error' + err)
                                        result['winner'] = rows;
                                        for (var i in result['winner']) {
                                            if (result['winner'][i].activity_user_id.length != 0) {
                                                winner[i] = result['winner'][i].activity_user_id;
                                            }
                                        }
                                        console.log(winner);
                                        callback();
                                    })
                                },
                                //查询活动参加者表
                                function(callback) {
                                    cc.query('SELECT * FROM `activity_user` WHERE activity_id = ' + pool.escape(activitiesId), function(err, rows) {
                                        if (err) console.log('query activity user are error' + err);
                                        result['joiner'] = rows;
                                        if (err) console.log( 'query joiners are error' + err);
                                        for (var i in result['joiner']) {
                                            if (result['joiner'][i].user_id.length != 0) {
                                                joiner.push(result['joiner'][i].user_id);
                                            }
                                        }
                                        callback();
                                    })
                                }
                            ],
                            //抽奖环节
                            function() { //原子性操作
                                award = result['award'][0];
                                total = parseInt(award['total']); 											//奖品总数
                                pernum = parseInt(award['per_num']); 										//每次抽奖的数量
                                	console.log('joiner:'+joiner);
                                	console.log('winner:'+winner);
                                var compareArr = require('../../common/util/compare-array');
                                	joiner = compareArr(joiner, winner, {show: 'compare'}); 				//从参加者中剔除已获奖者
                                	console.log('last joiner:'+joiner);
                                if ( (total >= pernum || ((total < pernum) && total >0 ) ) && (joiner.length >= total) ) {			//参加者必须多于等于该奖项的总数
                                    var randomArr = require('../../common/util/random-array');
                                    //	total = (total >= pernum )? (total - pernum) : 0;
                                    //	pernum =(total < pernum) ? total : pernum;
                                    	if(total >= pernum ){
                                    		total -= pernum;
                                    	}else if((total < pernum) && total >0 ){
											pernum = total;
											total = 0;
                                    	}
                                    var randomCol = randomArr(joiner, {'picks': pernum}); 					// 随机抽取返回抽到者 winners 和剩下未抽到者集合 collection
                                    var randomWiner, lotteryData, winLen;
                                    	winLen = randomCol.winners.length;
                                    	randomWiner = randomCol.winners;
                                    	console.log(randomWiner);
                                    	

                                    	//原子性操作，先减掉奖品表app_lottery_award 的剩余总数，然后向获奖者表app_lottery_user插入获奖者
                                    	cc.beginTransaction(function(err) {
										  if (err) { console.log( err ); }
										  console.log('beginTransaction');
										  	award = {
										  		total 	:  total
										  	}

											//将抽到者分批写入数据库
	            							for(var i=0;i<winLen;i++){	
	            								lotteryData = {
	            									app_lottery_award_id	: pool.escape(awardId),
	            									activity_user_id		: randomWiner[i],
	            									
	            									};
	            								cc.query('INSERT INTO `app_lottery_user` SET ? ', lotteryData, function(err ,rows){					
	            								 if (err) { 
												      cc.rollback(function() {
												        console.log( err );
												      });
												    }
	            								})

	            							}
										  	cc.query('UPDATE `app_lottery_award` SET ? WHERE app_lottery_id = '+pool.escape(appLotteryId)+' and id = '+pool.escape(awardId), award, function(err, rows){
										  		if(err){
										  			cc.rollback(function(){
										  				console.log( err );
										  			})
										  		}
										  	})
										    cc.commit(function(err) {
										        if (err) { 
										          cc.rollback(function() {
										            console.log( err );
										          });
										        }
										        console.log('success');
										      });
										});
					                    //根据抽到者 ID 取出该ID的信息

					                    var sql = 'SELECT id, name, photo FROM `user` WHERE id= ' + randomWiner.join(' or id= ');
					                    cc.query(sql, function(err, rows) {
					                        if (err) console.log('query joiner are :' + err);
					                        cc.shutdown();
					                        rows = {status :1,rows : rows}
					                        console.log(rows);
					                        res.json(rows);
					                    })

                                }else{
                                	var re = {'status':0,msg:'no more award to lottery.'};
                                	res.json(re);
                                }
                            })

                    } else {
                        res.json('the activity is end.');
                    }
                }
            ]);
        });

    });




    //	如遇到有人不在场，需要重新抽奖一次，需获取该用户 ID
    app.post('/api/lottery/index/lotteryAgain', function(req, res) {

        var result = [];
        var activitiesId = req.body.activitiesId;
        var activitiesConfig = req.body.activitiesConfig;
        var currentDate = Global.dateFormat(new Date().getTime(), 'yyyy-mm-dd hh:mm:ss');

        pool.connect(function(err, cc) {


        });
    });
    //	如遇到有人不在场，需要重新抽奖一次，需获取该用户 ID
    app.get('/api/lottery/index/lotteryAgain', function(req, res) {

    	var reqData = req.query.lottery.toString().split('_');								// 2_13_32_1  	2 是页面位置，13被替换的人，32是奖项，1是活动
    		console.log(reqData);
        var result = [];
        var joiner = [];
        var tempArr = [];
        var winner = [];
        var activitiesId = parseInt(reqData[reqData.length - 1 ]); 							// 活动 ID 
        var activitiesConfig = true; 														// 活动配置？
        var userId = reqData[1]; 																	// 需要重新被抽奖的人	
        var awardId = reqData[2]; 																	// 活动奖品表ID
        var LOTTERY_ONE = 1;																//重新抽奖个数为 1
        var award, appLotteryId, total;
        var currentDate = Global.dateFormat(new Date().getTime(), 'yyyy-mm-dd hh:mm:ss');

        pool.connect(function(err, cc) {
            Global.sync([
                //查询活动表
                function(callback) {
                    cc.query('SELECT * FROM `app_lottery` WHERE id = ' + pool.escape(activitiesId), function(err, rows) {
                        if (err) console.log('query lottery are error' + err);
                        result = rows[0];
                        result['app_lottery_id'] = appLotteryId = result['id'];
                        result['beginTime'] = Global.dateFormat(result['beginTime'], 'yyyy-mm-dd hh:mm:ss');
                        result['endTime'] = Global.dateFormat(result['endTime'], 'yyyy-mm-dd hh:mm:ss');
                        callback();
                    });
                },
                function(callback) {

                    var parseCurrentTime = Date.parse(currentDate); 									//取到服务器的北京时间
                    var parseBeginTime = Date.parse(result['beginTime']);
                    var parseEndTimeDate = Date.parse(result['endTime']);
                    //var joinLen = joiner.length;
                    if (parseCurrentTime >= parseBeginTime && parseCurrentTime <= parseEndTimeDate) {

                        Global.async([

                                //查询获奖者表
                                function(callback) {
                                    cc.query('SELECT * FROM `app_lottery_user` WHERE app_lottery_award_id = ' + pool.escape(awardId), function(err, rows) {
                                        if (err) console.log( 'query lottery user are error' + err);
                                        result['winner'] = rows;
                                        for (var i in result['winner']) {
                                            if (result['winner'][i].activity_user_id.length != 0) {
                                                winner[i] = result['winner'][i].activity_user_id;
                                            }
                                        }
                                        callback();
                                    })
                                },
                                //查询活动参加者表
                                function(callback) {
                                    cc.query('SELECT * FROM `activity_user` WHERE activity_id = ' + pool.escape(activitiesId), function(err, rows) {
                                        if (err) console.log( 'query activity user are error' + err);
                                        result['joiner'] = rows;
                                        if (err) console.log( 'query joiners are error' + err);
                                        for (var i in result['joiner']) {
                                            if (result['joiner'][i].user_id.length != 0) {
                                                joiner.push(result['joiner'][i].user_id);
                                            }
                                        }
                                        callback();
                                    })
                                }
                            ],
                            //抽奖环节
                            function() { 

                                var compareArr = require('../../common/util/compare-array');
                                	joiner = compareArr(joiner, winner, {show: 'compare'}); 				//将已获奖者从未抽到者
                                var randomArr = require('../../common/util/random-array');
                                var randomCol = randomArr(joiner, {'picks': LOTTERY_ONE}); 					// 随机抽取返回抽到者 winners 和剩下未抽到者集合 collection
                                var randomWiner, lotteryData, winLen;
                                	randomWiner = randomCol.winners;
                                	console.log(randomWiner);

                                	//直接修改获奖者表app_lottery_user
									  total = parseInt(total) + LOTTERY_ONE;
									  	award = {
									  		activity_user_id 	:  randomWiner
									  	}
									  	cc.query('UPDATE `app_lottery_user` SET ? WHERE app_lottery_award_id = '+pool.escape(awardId)+' and activity_user_id = '+pool.escape(userId), award, function(err, rows){
									  		if(err){
									  			cc.rollback(function(){
									  				console.log(  err );
									  			})
									  		}
									  	})
									
				                    //根据抽到者 ID 取出该ID的信息

				                    var sql = 'SELECT id, name, photo FROM `user` WHERE id= ' + randomWiner.join(' or id= ');
				                    cc.query(sql, function(err, rows) {
				                        if (err) console.log('query joiner are :' + err);
				                        	cc.shutdown();
				                        	rows = {status :1,rows : rows}
					                        console.log(rows);
					                        res.json(rows);
				                    })
                        })

                    } else {
                        res.json('the activity is end.');
                    }
                }
            ]);
        });

    });


//查询获奖者名单


    app.get('/api/lottery/index/lotteryList', function(req, res) {
    					// 活动 ID 
    	var lotteryId;
    	var reqData = req.query.lottery.toString().split('_');
    		console.log(reqData);
        var activitiesId = parseInt(reqData[reqData.length - 1 ]); 								// 活动 ID 
        var awardId = parseInt(reqData[0]); 
    	var result =[];
    	var winner =[];
    	var level =[];

    	 pool.connect(function(err, cc) {
    	 	Global.sync([
    	 			function(callback){
    	 				cc.query('SELECT id FROM `app_lottery` WHERE activity_id = '+pool.escape(activitiesId),function(err, rows){
    	 					if (err) console.log('query lottery are :' + err);

    	 						result['lottery'] = rows[0];
    	 						lotteryId = result['lottery']['id'];;
    	 						callback();
    	 				})
    	 			},
    	 			function(callback){
    	 				cc.query('SELECT id, level FROM `app_lottery_award` WHERE app_lottery_id = '+pool.escape(lotteryId)+' GROUP BY level ORDER By id',function(err, rows){
    	 					if (err) console.log('query lottery are :' + err);

    	 						result['award'] = rows;
    	 						console.log(result['award'].length);

/*    	 						for(var i=0,j;i < result['award'].length; i++){
    	 							if(result['award'][i].level.length != 0)
    	 								level[result['award'][i].id] = result['award'][i].level;
    	 							console.log(result['award'][i].level);
    	 						}*/
                                for (var i in result['award']) {
                                        level[i] = result['award'][i].id;
                                     	 /*level[result['award'][i].id] = result['award'][i].level;*/
                                }
    	 						callback();
    	 				})
    	 			},
    	 			function(){

    	 				cc.query('SELECT * FROM `app_lottery_award` as award LEFT JOIN `app_lottery_user` as user ON (award.id = user.app_lottery_award_id) LEFT JOIN `user` as u ON(user.activity_user_id = u.id) WHERE award.app_lottery_id = '+pool.escape(lotteryId),function(err, rows){
    	 					if (err) console.log('query award and  user are :' + err);
    	 					console.log(rows);
    	 					/*for (var i in result['award']) {
                                    winner.push(result['award'][i].user_id);
                                }*/
								cc.shutdown();
								//console.log('level:+'+level );
				                rows = {status :1,rows : rows, level : result['award']}
					            res.json(rows);
    	 				})
    	 			}
    	 		])


    	 	
    	 })
    })

}
