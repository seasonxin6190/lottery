module.exports = function(app) {
	app.get('/lottery/adds', function(req, res) {
		res.render('lottery/adds', {
			msg: ''
		});
	})
	app.get('/api/lottery/adds/add', function(req, res) {
		pool.connect(function(err, cc) {
		var userName = 'sea1121';
		var userPhoto =	'/public/images/pt.jpg';
		var userPhone = '13480762170';
		var activitiesId = 1;
	//	var currentDate = Global.dateFormat(new Date().getTime(), 'yyyy-mm-dd hh:mm:ss');

		var addData = {
							userName		: userName,
							photo			: userPhoto,
							phone			: userPhone,
							activitiesId	: activitiesId,
							joinDate		: new Date()
							};

	var query = cc.query('SELECT * FROM `joiner` WHERE activitiesId= '+pool.escape(activitiesId)+' and phone='+pool.escape(userPhone)+'', function(err, rows){
				if(err) console.log('SELECT joiner are error');
				//	console.log(rows);
				//console.log(query.sql);
				rows.length ? console.log(rows):console.log('null');
				res.json(query.sql);
				if(rows.length){
					cc.query('UPDATE `joiner` SET ? WHERE activitiesId= '+pool.escape(activitiesId)+' and phone='+pool.escape(userPhone)+'', addData, function(err, rows){
						if(err) console.log('update joiner are error '+err);
						console.log(rows);
					});
				}else{
					cc.query('INSERT INTO `joiner` SET ? ', addData, function(err, rows){
						if(err) console.log('insert joiner are error');
						console.log(rows);
					});
				}
				
			})


			cc.shutdown();
		});
	});

/*	app.post('api/lottery/adds/add', function(req, res){
      
      //  console.log('user:'+req.user.local.email);
      var mac = req.body.mac;
      var name = req.body.name;
      var phone = req.body.phone;
      var email = req.body.email;
      var logo = req.body.logo;
      var query  = Ibeacon.where({ mac: mac });
            query.findOne(function (err, ibeacons) {
                if(err){
                    res.send(err);
                    }
                    console.log(ibeacons);
                if(ibeacons){
                    console.log('update');
                    var query = {_id : ibeacons._id}
                    var replace =  { 
                        $set:{
                        name            : name,
                        phone           : phone,
                        email           : (email) ? email : '',
                        logo            : (logo) ? logo : '',
                        }
                    }
                 //   var options = {upsert : true}
                    Ibeacon.findByIdAndUpdate(query, replace, function(err, rs){
                    if(err){
                        res.send(err);
                    }
                    console.log(rs);
                    res.json(rs);
                 //   res.redirect('/home#/api/getIbeacon/'+mac+'');
                    })

                }else{
                    console.log('insert');
                    Ibeacon.create({
                    name            : name,
                    phone           : phone,
                    mac             : mac,
                    email           : (email) ? email : '',
                    logo            : (logo) ? logo : '',
                }, function(err, rs){
                    if(err){
                         res.send(err);
                    }

                    res.json(rs);
                    //res.render('getIbeacon.html');
                });
                }
            })

    })
*/
}