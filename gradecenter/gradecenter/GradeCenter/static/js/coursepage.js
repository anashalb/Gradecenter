google.load("visualization", "1", {packages:["corechart"]});
var cwShown = true;
var cdShown = true;
var gShown = true;

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

function desccontenttoggle() 
{		
	if (cdShown)
	{
		$("#desc_content").slideUp();
		var x = document.getElementsByClassName("desccontenttoggle")
		x[0].setAttribute("src", "/static/images/maximize.png");
		cdShown = false;
	}
	else
	{
		$("#desc_content").slideDown();
		var x = document.getElementsByClassName("desccontenttoggle")
		x[0].setAttribute("src", "/static/images/minimize.png");
		cdShown = true;
	}
}

function graphstoggle()
{		
	if (gShown)
	{
		$("#graphs_body").slideUp();
		var x = document.getElementsByClassName("graphstoggle")
		x[0].setAttribute("src", "/static/images/maximize.png");
		gShown = false;
	}
	else
	{
		$("#graphs_body").slideDown();
		var x = document.getElementsByClassName("graphstoggle")
		x[0].setAttribute("src", "/static/images/minimize.png");
		gShown = true;
	}
}

function graph(t,n,y,s)
{
	switch (t)
	{
		case '0':
			break;
		case '1':
			projections(n,y,s);
			break;
		case '2':		
			userGrades(n,y,s);
			break;
		case '3':
			average(n,y,s);
			break;
	}

}

function userGrades(n,y)
{
	$.ajax({
		url: "/gradecenter/usergrades/",
		type: "POST",
		data: "year=" + y + '&number=' + n,
		success: function(data){
				$('#projections').empty()
				ar = JSON.parse(data);
				userGradesChart(ar);			
			}
		})
}

function userGradesChart(ar) {

	var chart;

	chart = new Highcharts.Chart({
	chart: {
		renderTo: 'chart_div',
		defaultSeriesType: 'column'
	},
	title: {
		text: ''
	},
	xAxis: {
		categories: ar[0]
	},
	yAxis: {
		min: 0,
		title: {
			text: 'Grade'
		}
	},
	legend: {
		layout: 'vertical',
		backgroundColor: '#FFFFFF',
		align: 'left',
		verticalAlign: 'top',
		x: 100,
		y: 70,
		floating: true,
		shadow: true
	},
	tooltip: {
		formatter: function() {
			return ''+
				this.x +': '+ this.y;
		}
	},
	plotOptions: {
		column: {
			pointPadding: 0.2,
			borderWidth: 0
		}
	},
        series: [{
		name: 'Your Grade',
		data: ar[1]

	}]
});

}

function average(n,y,s)
{
	$.ajax({
		url: "/gradecenter/average/",
		type: "POST",
		data: "year=" + y + '&number=' + n,
		success: function(data){
				$('#projections').empty()
				ar = JSON.parse(data);
				averageChart(ar);			
			}
		})
}

function averageChart(ar) {
	var chart;

	chart = new Highcharts.Chart({
	chart: {
		renderTo: 'chart_div',
		defaultSeriesType: 'column'
	},
	title: {
		text: ''
	},
	xAxis: {
		categories: ar[0]
	},
	yAxis: {
		min: 0,
		title: {
			text: 'Grade'
		}
	},
	legend: {
		layout: 'vertical',
		backgroundColor: '#FFFFFF',
		align: 'left',
		verticalAlign: 'top',
		x: 100,
		y: 70,
		floating: true,
		shadow: true
	},
	tooltip: {
		formatter: function() {
			return ''+
				this.x +': '+ this.y;
		}
	},
	plotOptions: {
		column: {
			pointPadding: 0.2,
			borderWidth: 0
		}
	},
        series: [{
		name: 'Your Grade',
		data: ar[1]

	}, {
		name: 'Class Average',
		data: ar[2]

	}]
	});			
}

function projections(n,y,s)
{
		$.ajax({
		url: "/gradecenter/projections/",
		type: "POST",
		data: "year=" + y + '&number=' + n,
		success: function(data){
				$('#projections').empty()
				$('#chart_div').empty()
				$('#projections').append(data);
			}
		})	
}

function calculate()
{
	if (validate())
	{
		var num = $('.grade').length;
		var total = 0;
		var grades = document.getElementsByClassName('grade');
		var maxpoints = document.getElementsByClassName('max');
		var weights = document.getElementsByClassName('weight');

		var weighed = new Array()

		for (i=0; i < num; i++)
		{	
			var grade = grades[i].value;
			var weight = weights[i].value;
			var maxpoint = maxpoints[i].value;
			total += (grade/maxpoint)*weight;
			weighed.push(total);
		}
		projectionsGraph(weighed);
	}
	else
		alert ("Please enter a valid grade");
}

function validate()
{
	var num = $('.newgrade').length;

	var grades = document.getElementsByClassName('newgrade');
	
	for (i=0; i < num ;i++)
	{
		var grade = grades[i].value;
		if (!(isInt(grade) && grade >= 0))
		{
			return false;
		}			
	}

	return true;
}

function isInt(value)
{ 
	if((parseFloat(value) == parseFloat(value)) && !isNaN(value))
		return true;
	else
		return false;
}

function projectionsGraph(grades)
{
	var chart;
	var t = document.getElementsByClassName('title');
	titles = new Array()
	
	for (i=0; i < t.length; i++)
	{
		titles.push(t[i].innerHTML);
	}

	chart = new Highcharts.Chart({
		chart: {
			renderTo: 'chart_div',
			defaultSeriesType: 'line',
			marginRight: 130,
			marginBottom: 25
		},
		title: {
			text: 'Percentage',
			x: -20 //center
		},
		xAxis: {
			categories: titles
		},
		yAxis: {
			max: 100,
			title: {
				text: 'Percentage (%)'
			},
			plotLines: [{
				value: 0,
				width: 1,
				color: '#808080'
			}],
			plotBands: [{ //A
		        from: 100,
		        to: 90,
		        color: 'rgba(68, 170, 213, 0.1)',
		        label: {
		           text: 'A',
		           style: {
		              color:'#606060'
		           }
		        }
		     }, { // B
		        from: 89,
		        to: 80,
		        color: 'rgba(0, 0, 0, 0)',
		        label: {
		           text: 'B',
		           style: {
		              color: '#606060'
		           }
		        }
		     }, { // C
		        from: 79,
		        to: 70,
		        color: 'rgba(68, 170, 213, 0.1)',
		        label: {
		           text: 'C',
		           style: {
		              color: '#606060'
		           }
		        }
		     }, { // D
		        from: 69,
		        to: 60,
		        color: 'rgba(0, 0, 0, 0)',
		        label: {
		           text: 'D',
		           style: {
		              color: '#606060'
		           }
		        }
		     }, { // R
		        from: 59,
		        to: 0,
		        color: 'rgba(68, 170, 213, 0.1)',
		        label: {
		           text: 'R',
		           style: {
		              color: '#606060'
		           }
		        }
		     }]
		},
		tooltip: {
			formatter: function() {
	                return this.x +': '+ this.y +'%';
			}
		},
		legend: {
			layout: 'vertical',
			align: 'right',
			verticalAlign: 'top',
			x: -10,
			y: 100,
			borderWidth: 0
		},
		series: [{
			name: 'Cumulative grade',
			data: grades
		}]
	});
}

function autobest()
{
	var grades = document.getElementsByClassName ('newgrade');
	var maxpoints = document.getElementsByClassName ('newmax');
	for (i=0; i < grades.length; i++)
	{
		grades[i].value = maxpoints[i].value;
	}

	calculate();
}

function autoworst()
{
	var grades = document.getElementsByClassName ('newgrade');

	for (i=0; i < grades.length; i++)
	{
		grades[i].value = 0;
	}
	calculate();
}

function autoaverage()
{
	var grades = document.getElementsByClassName ('oldgrade');
	var maxpoints = document.getElementsByClassName ('oldmax');
	var average = 0;
	for (i=0; i < grades.length; i++)
	{
		average += grades[i].value/maxpoints[i].value;
	}

	average = average/i;

	var grades = document.getElementsByClassName ('newgrade');
	var maxpoints = document.getElementsByClassName ('newmax');

	for (i=0; i < grades.length; i++)
	{
		grades[i].value = (average*maxpoints[i].value).toFixed(2);
	}	
	calculate();
}

function perform(g)
{
	var grades = document.getElementsByClassName ('oldgrade');
	var maxpoints = document.getElementsByClassName ('oldmax');
	var weights = document.getElementsByClassName ('oldweight');

	var gradeNeeded = 0;
	switch (g)
	{
		case 'A':
			gradeNeeded = 90;
			break;
		case 'B':
			gradeNeeded = 80;
			break;
		case 'C':
			gradeNeeded = 70;
			break;
		case 'D':
			gradeNeeded = 60;
			break;
		case 'R':
			gradeNeeded = 0;
			break;
	}

	
	var currentGrade = 0;
	for (i=0; i < grades.length; i++)
	{
		currentGrade += (grades[i].value/maxpoints[i].value)*weights[i].value;
	}

	var gradeLeft = gradeNeeded - currentGrade;

	var newGrades = document.getElementsByClassName ('newgrade');
	var newMax = document.getElementsByClassName ('newmax');
	var newWeights = document.getElementsByClassName ('newweight');
	var percentageLeft = 0;

	if (gradeLeft <= 0)
	{
		autoworst()
	}
	else
	{
		for (i = 0; i < newWeights.length; i++)
		{
			percentageLeft += parseFloat(newWeights[i].value);
		}

		if (gradeLeft > percentageLeft)
		{
			alert ("It is not possible :(");
		}
		else
		{
			var canLose = percentageLeft - gradeLeft;
			canLose = canLose / newWeights.length;
			for (i = 0; i < newWeights.length; i++)
			{
				var achieve = newWeights[i].value - canLose;
				var pointsRequired = newMax[i].value * (achieve/newWeights[i].value)
				if (pointsRequired < 0)
				{
					pointsRequired = 0
				}
				newGrades[i].value = pointsRequired.toFixed(2);
			}
			calculate();			
		}
	}
}

function gotouser()
{
	location.href = "/gradecenter/";
}

function logout()
{
	location.href = "/gradecenter/logout/";
}
