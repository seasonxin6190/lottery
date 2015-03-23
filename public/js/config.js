seajs.config({
	alias:{
		'still':'/js/dist/still.min.js'
	},
	preload:['still'],
	base:'/js/src'
})

/*seajs.config({
	alias:{
		'still':'../js/dist/still.min.js'
	},
	preload:['still'],
	base:'../js/src'
});*/
seajs.use('common/util');