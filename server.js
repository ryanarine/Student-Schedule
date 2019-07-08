var express = require('express');
var app = express();
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('db/courses.db');
var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res){
    res.redirect('index.html');
});

app.get('/getCourses', function (req, res) {
    db.all('SELECT courses.id FROM courses', function (err, rows) {
        if (err) {
            console.log("" + err);
        }
        else {
            res.send(rows);
        }
    });
});

app.get('/getClasses', function(req, res){
	db.all('SELECT * FROM courses INNER JOIN classes ON courses.id = classes.id', function(err, rows){
		if(err){
			console.log("" + err);
		}
		else{
			res.send(rows);
		}
	});
});

app.post('/addCourse', function (req, res) {
    var id = req.body.id.trim().replace(/\s+/g, ' ');
    var name = req.body.name;
    if (id != "" && name != "") {
        db.run('INSERT INTO courses VALUES (?, ?)', [id, name], function (err) {
            if (err) {
								res.redirect('index.html?err=1');
            }
            else {
                res.redirect('index.html?scs=1');
            }
        });
    }
    //res.status(200).redirect('index.html');
});

app.post('/addClass', function (req, res) {
    var id = req.body.courseList;
    var days = [req.body.monday, req.body.tuesday, req.body.wednesday, req.body.thursday, req.body.friday];
    var dayRooms = [req.body.mondayRoom, req.body.tuesdayRoom, req.body.wednesdayRoom, req.body.thursdayRoom, req.body.fridayRoom];
		var classes = 0;
		var added = 0;
    for (var i = 0; i < days.length; i++) {
        if (days[i] == "") {
            continue;
        }
        else {
            var times = days[i].split(',');
            var rooms = dayRooms[i].split(',');
            if (times.length != rooms.length) {
                continue;
            }
            for (var j = 0; j < times.length; j++) {
                var time = times[j].split('-');
                var start = time[0];
                var end = time[1];
                var room = rooms[j];
								classes++;
								added++;
                db.run('INSERT INTO classes VALUES (?,?,?,?,?)', [id, i + 1, start, end, room], function (err) {
									if (err) {
											console.log("" + err);
											added--;
									}
                });
            }
        }
    }
    res.redirect('index.html?cls=' + classes + '-' + added);
});

app.post('/delCourse', function (req, res) {
    db.run("DELETE FROM courses WHERE id = ?", [req.body.courseList], function (err) {
        if (err) {
            console.log("" + err);
        }
        else {
            db.run("DELETE FROM classes WHERE id = ?", [req.body.courseList], function (err) {
                if (err) {
                    console.log("" + err);
                }
                else {
                    console.log("Course removed");
                }
            });
        }
    });
    res.status(200).redirect('index.html');
});

app.listen(3000, function(){
	console.log("Server is running on port 3000");
});

