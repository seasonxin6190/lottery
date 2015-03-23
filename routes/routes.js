
/*
 * GET home page.
 */
module.exports = function(app){
	//设置全局变量
	Global = {};G = Global;
	Global.async = require('../common/util/step').async;
	Global.sync = require('../common/util/step').sync;
	Global.dateFormat = require('dateformat');
/*// 进程异常处理	 
	var domain = require('domain');
	var EventEmitter = require('events').EventEmitter;
		e = new EventEmitter();
	domain = domain.create();
	domain.on('error', function(er){
		console.log('error :'+er);
	try{
		res.writeHead(500);
		res.end('Error', er, req.url);
	}catch(er){
		console.error('Error sending 500', er, req.url);
	}
})
	function next() {
	  e.once('data', function () {
	    throw new Error('something wrong here');
	  });
	}

	var timer = setTimeout(function () {
		  e.emit('data');  
		}, 10);

	domain.run(next);
	domain.add(e);
	domain.add(timer);
*/

	//连接数据库,返回一个连接池
	pool = require('../common/conf/database')(app.get('env'));
	//封装连接池的连接分配动作
	pool.connect = function(func){
		pool.getConnection(function(err, connection) {
			if (err) {
				console.error('error connecting: ' + err.stack);
				return;
			}
			console.log('connected as id ' + connection.threadId);
			connection.shutdown = function(){
				console.log("release connection");
			  	connection.release();
			}
			func(err, connection);
		});
	}
	
	//路由分支
	var fs = require('fs');
	function searchFile(path){
		fs.readdir(path, function(err, files){
			files.forEach(function(one){
				if(one.indexOf('.js')==-1){
					searchFile(path+'/'+one);
				}
				else if(one!='routes.js'){
					var module_path = '.'+(path+'/'+one);
					require(module_path)(app);
				}
			});
		});
	}
	searchFile('./routes');
	
	
};