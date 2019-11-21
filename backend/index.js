var express = require('express');
var app   = express();
var mysql = require('mysql');

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));



var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "gaearontest"
});
var cors = require('cors');
app.use(cors());

app.set('views', './views'); // specify the views directory
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', function (req, res) {
	res.render('index', { title: 'Hey', message: 'Hello there!' })
})

app.get('/get_sellers', function(req, res){
	con.connect(function(err) {
		if(req.query.start) {
			start = req.query.start;
		}
		else
			start = 0;

		con.query("SELECT * FROM sellers ORDER BY id desc limit "+start+" ,10 ", function (err, result, fields) {
			
			var sellers = {
				recordsTotal: 10,
				recordsFiltered: 10,
				data: result
			};
			res.send(sellers);
		});
	});
});
app.get('/availabledates', function(req, res){
	con.connect(function(err) {
		if(req.query.start) {
			start = req.query.start;
		}
		else
			start = 0;

		con.query("SELECT * FROM availableslot ORDER BY id desc limit "+start+" ,10 ", function (err, result, fields) {
			
			var availableslot = {
				recordsTotal: 10,
				recordsFiltered: 10,
				data: result
			};
			res.send(availableslot);
		});
	});
});
app.get('/get_bookrequest', function(req, res){
	con.connect(function(err) {
		if(req.query.start) {
			start = req.query.start;
		}
		else
			start = 0;

		con.query("SELECT * FROM bookrequest ORDER BY id desc limit "+start+" ,10 ", function (err, result, fields) {
			for (var i = 0;i<result.length;i++)
			{
				result[i].action = ' <a class="update" value_id="'+result[i].id+'"  href="javascript:void(0);">Update</a>';
			}
			var availableslot = {
				recordsTotal: 10,
				recordsFiltered: 10,
				data: result
			};
			res.send(availableslot);
		});
	});
});
app.post('/checkavailabledates', function(req, res){
	con.connect(function(err) {
		con.query("SELECT count(*) as totalcount FROM availableslot where available_date='"+req.body.available_date+"' ", function (err, result, fields) {
			
			var availableslot = {
				data: result
			};
			res.send(availableslot);
		});
	});
});

app.post('/add_timeslot', function(req, res){
	con.connect(function(err) {
		con.query("SELECT count(*) as totalcount FROM availableslot where available_date='"+req.body.request_date+"'", function (err, result, fields) {
			if(result[0].totalcount == 0){
				var sql = "INSERT INTO availableslot (available_date) VALUES (?)";
				con.query(sql, [req.body.available_date], function (err, result) {
				if (err) res.send(err);
				var bookrequest = {
					data: result
				};
					res.send(bookrequest);
				});
			}else
			{
				var availableslot = {
				data: result
				};
				res.send(availableslot);
			}
	});
});

});

app.post('/bookrequest', function (req, res) {
	con.connect(function(err) {
		con.query("SELECT count(*) as totalcount FROM bookrequest where request_date='"+req.body.request_date+"' and seller_id='"+req.body.seller_id+"' ", function (err, result, fields) {
			if(result[0].totalcount == 0){
				var sql = "INSERT INTO bookrequest (request_date, seller_id, seller_name) VALUES (?, ?)";
				con.query(sql, [req.body.request_date,req.body.seller_id, req.body.seller_name], function (err, result) {
				if (err) res.send(err);
				var bookrequest = {
					data: result
				};
					res.send(bookrequest);
				});

			}else
			{
				var availableslot = {
				data: result
				};
				res.send(availableslot);
			}
			
		});
		
	});
});

app.post('/update_user', function (req, res) {
	con.connect(function(err) {
		var sql = "UPDATE bac_user SET first_name = '"+req.body.first_name+"', last_name = '"+req.body.last_name+"', email_address = '"+req.body.email+"' WHERE id ='"+req.body.id_to_update+"'";
		con.query(sql, function (err, result) {
			if (err) throw err;
				res.send(result);
		});
	});
});

app.get('/get_user_by_id/:id', function (req, res) {
	con.connect(function(err) {
		con.query("SELECT * FROM bac_user WHERE id ="+req.params.id+"", function (err, result, fields) {
			res.send(result);
		});
	});
})

app.get('/delete_user/:id', function (req, res) {
	console.log(req.params);
	con.connect(function(err) {
		console.log("DELETE FROM bac_user WHERE id ="+req.params.id+"");
		con.query("DELETE FROM bac_user WHERE id ="+req.params.id+"", function (err, result, fields) {
			console.log(err);
			console.log(result);
			console.log(fields);
			res.send(result);
		});
	});
})
app.listen(3000, function () {
	console.log('Server started: Port 3000');
});