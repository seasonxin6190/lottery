/**
*返回 一个或多个随机元素
*@param {Array} arr - 数组
*@param {Object} [options] -初始化选项
*@param {Number} [options.picks] - 随机抽取元素个数
*@returns {Object} -剩下未得奖者集合 和 得奖者集合
*
*/



randomArr = function(arr, options){
	if(!Array.isArray(arr)){
		throw new Error('random-array expect an array as parameter');
	}

	options = options || {};

	var rand = Math.random;
	var collection = arr.slice();
	var	collectionObj = {};
	var	picks = options.picks || 1;
		
	if(typeof picks == 'number' && picks !== 1){
		var len = arr.length;
		var	randomArr = [];
		var	index;

		while(picks){
			index = Math.floor(rand() * len);
			randomArr.push(collection[index]);
			collection.splice(index, 1);
			len -=1;
			picks -= 1;
			//console.log(collection);
		}
		collectionObj = {'collection':collection,'winners':randomArr}
		return collectionObj;
	}
		var tempIndex = Math.floor(rand() * arr.length);
		var temp = arr[tempIndex].toString().split(',');
			collection.splice(tempIndex, 1);
		collectionObj = {'collection':collection, 'winners': temp}
	return collectionObj;
}

module.exports = randomArr;