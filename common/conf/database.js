module.exports = function(env){
	var mysql = require('mysql');
	var db_config = require('./mysql_config');

	//创建数据库连接池
	if ('development' == env) {
		db_config = db_config.info_dev;
	}else{
		db_config = db_config.info;
	}
	var pool = mysql.createPool(db_config);
	return pool;
}
