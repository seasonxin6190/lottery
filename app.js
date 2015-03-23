/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes/routes');
var http = require('http');
var path = require('path');
var ejs = require('ejs');

ejs.open = '{{';
ejs.close = '}}';

var app = express();
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', ejs.__express);
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
//验证session





var ok = require('okay');
app.use(require('express-domain-middleware'));
app.use(app.router);


app.get('/error', function(req, res, next) {
//  db.query('SELECT happiness()', ok(next, function(rows) {
    fs.writeFile('./error.log', err, ok(next, function(contents) {
      process.nextTick(ok(next, function() {
        throw new Error("The individual request will be passed to the express error handler, and your application will keep running.");
      }));
    }));
//  }));
});


/*app.use(function(req, res, next) {

	if (false) {
		res.render('index', {
			title: 'Error'
		});
	} else {
		//console.log('---------');
		
		next();
	}
});*/
app.use(express.static(__dirname + "/public"));
app.use('views',express.static(path.join(__dirname, 'views')));

//app.use(app.router);
// development only
if ('development' == app.get('env')) {
	//app.use(express.errorHandler());
	app.use(function errorHandler(err, req, res, next) {
	  console.log('error on request %d %s %s: %j', process.domain.id, req.method, req.url, err);
	  res.send(500, "Something bad happened. :(");
	});


}
app.set('routesLv', 1); //标示routes下为两级目录
routes(app);

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});