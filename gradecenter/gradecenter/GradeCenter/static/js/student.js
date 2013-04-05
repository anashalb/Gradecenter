var cwShown = true;
var nShown = true;
var clShown = true;
var gpaShown = true;

$(document).ajaxSend(function(event, xhr, settings) {
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    function sameOrigin(url) {
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }
    function safeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    }
});

function courseworktoggle() 
{
	if (cwShown)
	{
		$("#coursework_table").slideUp();
		var x = document.getElementsByClassName("courseworktoggle")
		x[0].setAttribute("src", "/static/images/maximize.png");
		cwShown = false;
	}
	else
	{
		$("#coursework_table").slideDown();
		var x = document.getElementsByClassName("courseworktoggle")
		x[0].setAttribute("src", "/static/images/minimize.png");
		cwShown = true;
	}
}

function notificationstoggle() 
{		
	if (nShown)
	{
		$("#notifications_table").slideUp();
		var x = document.getElementsByClassName("notificationstoggle")
		x[0].setAttribute("src", "/static/images/maximize.png");
		nShown = false;
	}
	else
	{
		$("#notifications_table").slideDown();
		var x = document.getElementsByClassName("notificationstoggle")
		x[0].setAttribute("src", "/static/images/minimize.png");
		nShown = true;
	}
}

function courselisttoggle() 
{		
	if (clShown)
	{
		$("#courselist_table").slideUp();
		var x = document.getElementsByClassName("courselisttoggle")
		x[0].setAttribute("src", "/static/images/maximize.png");
		clShown = false;
	}
	else
	{
		$("#courselist_table").slideDown();
		var x = document.getElementsByClassName("courselisttoggle")
		x[0].setAttribute("src", "/static/images/minimize.png");
		clShown = true;
	}
}

function gpatoggle() 
{		
	if (gpaShown)
	{
		$("#gpa_table").slideUp();
		var x = document.getElementsByClassName("gpatoggle")
		x[0].setAttribute("src", "/static/images/maximize.png");
		gpaShown = false;
	}
	else
	{
		$("#gpa_table").slideDown();
		var x = document.getElementsByClassName("gpatoggle")
		x[0].setAttribute("src", "/static/images/minimize.png");
		gpaShown = true;
	}
}

function selectcourse(id)
{
	$.ajax({
		url: "/gradecenter/coursework/",
		type: "POST",
		data: "id=" + id,
		success: function(data){
				$("#coursework_table").empty();
				$("#coursework_table").append(data);
			}
		})
}

function addRow()
{
	$('<div class=\"gpa_row\">\
						<input type=\"text\" for=\"name\" name=\"name\"/>\
						<input type=\"text\" for=\"unit\" name=\"unit\"/>\
						<input type=\"text\" for=\"grade\" name=\"grade\"/>\
						<button class=\"addrow\" onclick=\"delRow(this)\">-</button>\
					</div>').appendTo($("#gpa_content"));
}

function delRow(n)
{
	n.parentNode.parentNode.removeChild(n.parentNode);
}

function validate (grades, units)
{
	var i;
	for (i = 0; i < grades.length; i++)	
	{	
		grade = grades[i].value.toUpperCase();
		unit = parseInt(units[i].value);
		if (grade != 'A' && grade != 'B' && grade != 'C' && grade != 'D' && grade != 'F' && grade != 'R' && grade != '')
		{
			alert ("Please enter a valid letter grade");
			return -1;
		}
		else if (unit < 1)
		{
			alert ("The number of units should be greater then 0");
			return -1;
		}
	}	

	return 0;
}

function calculateGPA()
{
	var grades = document.getElementsByName("grade");
	var units = document.getElementsByName("unit");
	
	var totalU = 0;
	var totalG = 0;

	if ( validate(grades,units) == 0)
	{
		var i;
		for (i = 0; i < grades.length; i++)	
		{	
			var grade = grades[i].value.toUpperCase();
			var unit = units[i].value;
			
			if (unit == "")
				unit = 0;
			else
				unit = parseInt(unit);

			totalU = totalU + unit;	

			if (grade == 'A')
				totalG = totalG + (4 * unit);
			else if (grade == 'B')
				totalG = totalG + (3 * unit);
			else if (grade == 'C')
				totalG = totalG + (2 * unit);
			else if (grade == 'D')
				totalG = totalG + (1 * unit);
		}
		
		if (totalU != 0)
			document.getElementById("finalGPA").value =(totalG/totalU).toFixed(2);
	}
}

function getCoursePage(n,y)
{
	location.href = "/gradecenter/coursepage/?number=" + n + "&year=" + y;
}

function gotouser()
{
	location.href = "/gradecenter/";
}

function logout()
{
	location.href = "/gradecenter/logout/";
}
