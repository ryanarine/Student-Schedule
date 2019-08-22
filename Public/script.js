getClasses();
getCourses();
displayHiddenMsg();
window.onload = setHighlightInterval;

function getClasses() {
    $.get("/getClasses", function (data) {
        if (!data) {
            console.log("No data");
        }
        else {
            for (var i = 0; i < data.length; i++) {
                showCourse(data[i]);
            }
            
        }
    });
}

function getCourses() {
    $.get("/getCourses", function (data) {
        if (!data) {
            console.log("No data");
        }
        else {
            var list1 = document.getElementById('courseList1');
            var list2 = document.getElementById('courseList2');
            for (var i = 0; i < data.length; i++) {
                var option1 = document.createElement('option');
                option1.innerHTML = data[i].id;
								var option2 = document.createElement('option');
                option2.innerHTML = data[i].id;
                list2.appendChild(option1);
								list1.appendChild(option2);
            }

        }
    });
}

function displayHiddenMsg(){
	var param = window.location.search.slice(1).split('=');
	if (param){
		var msg = document.getElementById('msg');
		if (param[0] == "err"){
			if (param[1] == 1){
				msg.style.color = 'red';
				msg.innerHTML = "That course ID already exists";
			}
		}
		else if(param[0] == "scs"){
			if (param[1] == 1){
				msg.style.color = 'green';
				msg.innerHTML = "Course successfully added";
			}
		}
		else if(param[0] == "cls"){
			var str = param[1].split('-');
			var addStr = "classes";
			var courseStr = "classes were";
			msg.style.color = 'green';
			if (str[0] == "1"){
				courseStr = "class was";
			}
			if (str[1] == "1"){
				addStr = "class";
			}
			
			msg.innerHTML = str[1] + " " + addStr + " out of " + str[0] + " " + courseStr + " sucessfully added";
		}
	}
	setTimeout(function(){msg.innerHTML = ""}, 10000);
}

function showCourse(course) {
    for (var i = course.start; i < course.end; i++) {
        var slot = document.getElementById("timeslot" + i).children[course.day];
        slot.innerHTML = course.id + " " + course.name + " " + course.room;
    }
}

function setHighlightInterval(){
	highlightCurrentSlot();
	setTimeout(setupHighlightInterval, ((60 - new Date().getSeconds()) % 60) * 1000);
}

function setupHighlightInterval(){
	setInterval(highlightCurrentSlot, 60 * 1000);
	highlightCurrentSlot();
}


function highlightCurrentSlot(){
	var date = new Date();
	var day = date.getDay();
	var hour = date.getHours();
	if (day > 0 && day < 6){
		var cslot = document.getElementById("timeslot" + hour).children[day];
		if (cslot.style.backgroundColor !== "red"){
			cslot.style.backgroundColor = "red";
			if (hour === 0 && day > 1){
				document.getElementById("timeslot23").children[day - 1].style.backgroundColor = "white";
			}
			else {
				document.getElementById("timeslot" + (hour - 1)).children[day].style.backgroundColor = "white";
			}
		}
	}
}

function changeClassDisplay(classname, display) {
    var elements = document.getElementsByClassName(classname);
    for (i = 0; i < elements.length; i++) {
        elements[i].style.display = display;
    }
}

function addStuff(classname) {
    changeClassDisplay(classname, "block");
    changeClassDisplay("init","none");
	
}

function cancelStuff(classname){
    changeClassDisplay(classname, "none");
    changeClassDisplay("init","inline");
}	
