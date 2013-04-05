/*
    Anas Halbawi
	aih@qatar.cmu.edu 
	Mohamed Soudy
	msoudy@qatar.cmu.edu 
*/

var cwShown = true;
var guShown = true;
var fgShown = true;
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


function init()
{   
    $(".coursework_section > button").hide();
}

function glow(e)
{
    $(e).animate({ backgroundColor: "#ffff99" }, 700);
    $(e).animate({ backgroundColor: "#EDF2F7" }, 700);
}

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

function gradeuploadertoggle() 
{		
	if (guShown)
	{
		$("#gradeuploader_table").slideUp();
		var x = document.getElementsByClassName("gradeuploadertoggle")
		x[0].setAttribute("src", "/static/images/maximize.png");
		guShown = false;
	}
	else
	{
		$("#gradeuploader_table").slideDown();
		var x = document.getElementsByClassName("gradeuploadertoggle")
		x[0].setAttribute("src", "/static/images/minimize.png");
		guShown = true;
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

function finalgradestoggle()
{		
	if (fgShown)
	{
		$("#gradeslist_table").slideUp();
		var x = document.getElementsByClassName("finalgradestoggle")
		x[0].setAttribute("src", "/static/images/maximize.png");
		fgShown = false;
	}
	else
	{
		$("#gradeslist_table").slideDown();
		var x = document.getElementsByClassName("finalgradestoggle")
		x[0].setAttribute("src", "/static/images/minimize.png");
		fgShown = true;
	}
}

function showRemoveWork(x)
{     
    $("#" + x).show();
}

function hideRemoveWork(x)
{
    $("#" + x).hide();
}

function removeWork(id)
{
    $.ajax({
             url: "/gradecenter/removework/",
             type: "POST",
             data: "workid=" + id,
             processData: false,
             contentType: false,
             success: function (data) {
                $("#coursework_section_" + data["title"]).remove();
                ($("#" + data['title'])).remove();
                var gradeuploaderSections = ($(".gradeuploader_section > ul > li > label[for='studentname']"));

                $(gradeuploaderSections).each (function() {
                    student = $(this).parent().find("input").val();
                    $("#" + student + id).parent().remove();
                });
                $("#Average" + id).parent().remove();
                $("#E" + id).remove();
            
                var gradeuploaderSections = ($(".gradeuploader_section > ul > li > label[for='studentname']"));

                $(gradeuploaderSections).each (function() {
                    student = $(this).parent().find("input").val();

                    var studentSections = ($("#gradeuploader_section_" + student + " > ul > li > input"));

                    var grades = 0;
                    var totalweight = 0;

                    $(studentSections).each (function() {
                        grade = this.value;
                        if(isInt(grade))
                        {
                            var maxpoints = parseInt(this.alt);
                            var weight = parseInt(this.name);
                            grades += (( (parseInt(grade))/maxpoints) * weight);
                            totalweight += weight;
                        }
                    });
                    grades = (grades/totalweight) * 100;
                    $("#gradeslist_section_" + student + " > ul > li > label[for='overallaverage']").parent().find("input").attr("value",grades.toFixed(2));
                    glow(document.getElementById(student + "average" ));
                });
         }
         });
}

	
$(function(){
	$("#datepicker").datepicker({});
	$("#datepicker").datepicker( "option", "dateFormat", "M. dd, yy" );
	var dates = document.getElementsByClassName('date');

	for (i=0; i < dates.length; i++)
	{
		val = dates[i].value
		$('#'+dates[i].id).datepicker({onClose: function(dateText) {saveWorkEdit(this.id,""); }});
		$('#'+dates[i].id).datepicker( "option", "dateFormat", "M. dd, yy" );
		$('#'+dates[i].id).datepicker( "setDate" , val );
	}

});

$(function(){
	$("#timepicker").timepicker({ampm: true,});
	var times = document.getElementsByClassName('time');

	for (i=0; i < times.length; i++)
	{
        var id = times[i].id;
		$('#'+times[i].id).timepicker({ampm: true, onClose: function(dateText) {var title = document.getElementById((parseInt(this.id/10))*10).value;saveWorkEdit(this.id,title); } });
	}
});




function addToWork( course_number, course_year ){
    var title = $(".coursework_section_upload > ul > li > label[for='title']").parent().find("input").val();
    var description = $(".coursework_section_upload > ul > li > label[for='description']").parent().find("input").val();
    var duedate = $(".coursework_section_upload > ul > li > label[for='duedate']").parent().find("input").val();
    var duetime = $(".coursework_section_upload > ul > li > label[for='duetime']").parent().find("input").val();
    var weight = $(".coursework_section_upload > ul > li > label[for='weight']").parent().find("input").val();
    var maxpoints = $(".coursework_section_upload > ul > li > label[for='maxpoints']").parent().find("input").val();
    var error = 0;

    if((title == "") || (description == "") || (duedate == "") || (duetime == "") || (weight == "") || (maxpoints == ""))
	{
		alert("Please fill in ALL the fields");
        return;
	}

    if( (!isInt(weight)) || (!isInt(maxpoints)) )
    {
        alert("The weight/max points should be a number");
        return;
	}

    var workTitles = ($(".coursework_section > ul > li > label[for='title']"));

    $(workTitles).each (function() {
        worktitle = $(this).parent().find("input").val();
        if(title == worktitle)
        {
		    alert("Can't have the same title for two different courseworks");     
            error = 1;       
            return;
        }
    });
   
    if(error != 0)
        return;

    $.ajax({
         url: "/gradecenter/addwork/",
         type: "POST",
         data: "title=" + title + "&description=" + description + "&duedate=" + duedate + "&duetime=" + duetime + "&maxpoints=" + maxpoints
             + "&weight=" + weight + "&course_number=" + course_number + "&course_year=" + course_year,
         processData: false,
         contentType: false,
         success: function (data) {
                $(data).insertBefore($(".coursework_section_upload"));

                var glowli = ($("#coursework_section_" + title + " > ul > li > input"));
                $(glowli).each (function() {
                            glow((this));
                        });

                var dates = document.getElementsByClassName('date');
                i = dates.length-1;
	            val = dates[i].value
	            $('#'+dates[i].id).datepicker({onClose: function(dateText) {saveWorkEdit(this.id,""); }});
	            $('#'+dates[i].id).datepicker( "option", "dateFormat", "M. dd, yy" );
	            $('#'+dates[i].id).datepicker( "setDate" , val );

                var times = document.getElementsByClassName('time');
                i = times.length-1;
                var id = times[i].id;
	            $('#'+times[i].id).timepicker({ampm: true, onClose: function(dateText) {var title = document.getElementById((parseInt(this.id/10))*10).value;saveWorkEdit(this.id,title); } });

                $(".coursework_section > button").hide();

                var buttonid = document.getElementsByName("coursework_section_" + title)[0].id.substr(1);
                $("<li class=\"css_gradeUpload\" id=\"E" + buttonid + "\"><p>" + title + " (/" + maxpoints + ")</p></li>").appendTo($("#gradeuploader_header > ul"));
                var gradeuploaderSections = ($(".gradeuploader_section > ul > li > label[for='studentname']"));

                $(gradeuploaderSections).each (function() {
                    student = $(this).parent().find("input").val();
                    var labelid = student + buttonid;
                    $("<li><label for=\"" + title + "\"></label><input for=\"css_gradeUpload\" id=\"" + labelid  +  "\" type=\"text\" value=\"-\" alt=\"" + maxpoints + "\" name=\"" + weight + "\" onchange=\"saveGradeEdit('" + student + "'," + buttonid + ");\"></li>").appendTo($("#gradeuploader_section_" + student + " > ul"));
                });
                $("<li><label for='" + title + "averagegrade'></label><input for=\"css_gradeUpload\" id=\"Average" + buttonid + "\" type=\"text\" name=\"averagegrade\" value=\"-\" readonly=\"readonly\"/></li>").appendTo($("#gradeuploader_section_average > ul"));

                glowli = ($(".gradeuploader_section > ul > li > label[for='" + title + "']"));
                $(glowli).each (function() {
                            glow(($(this).parent().find("input")));
                        });
         }
     });
    $(".coursework_section_upload > ul > li > label[for='title']").parent().find("input").attr("value","");
    $(".coursework_section_upload > ul > li > label[for='description']").parent().find("input").attr("value","");
    $(".coursework_section_upload > ul > li > label[for='duedate']").parent().find("input").attr("value","");
    $(".coursework_section_upload > ul > li > label[for='duetime']").parent().find("input").attr("value","");
    $(".coursework_section_upload > ul > li > label[for='weight']").parent().find("input").attr("value","");
    $(".coursework_section_upload > ul > li > label[for='maxpoints']").parent().find("input").attr("value","");
}

function getcourse(numberyear, professor)
{ 
    if(numberyear == "")
        return;
    var number = numberyear.substring(0,5);
    var year = numberyear.substring(6,numberyear.length);
    location.href= "/gradecenter/" + professor + "/" + number + "/" + year + "/";
}

function saveWorkEdit(id)
{
    workid = parseInt(id/10);
    var content = document.getElementById(id).value;
    var newSection =  document.getElementById(id).parentNode.parentNode.parentNode.onmouseover;
    var titles ={};
    var indextitles = 0;
    
    var error = 0;

    var field;

    switch(id%10)
    {
    case 0:
        field = "title"
        var workTitles = ($(".coursework_section > ul > li > label[for='title']"));

        $(workTitles).each (function() {
            worktitle = $(this).parent().find("input").val();
            currentSection = (this.parentNode.parentNode.parentNode).onmouseover;
            if((currentSection != newSection))
            {
                titles[indextitles] = worktitle;
                indextitles++;
            }
        });
        break;
    case 1:
        field = "description"       
        break
    case 2:
        field = "duedate"
        break;
    case 3:
        field = "duetime"
        break;
    case 4:
        field = "weight"
        break;
    case 5:
        field = "maxpoints"
        break;
    default:
        return;
    }

    var data ={};
    data["workid"] = workid;
    data["content"] = content;
    data["field"] = field;

    $.ajax({
        url: "/gradecenter/saveworkedit/",
        type: "POST",
        dataType: 'json',
        data: "titles=" + JSON.stringify(titles) + "&data=" + JSON.stringify(data),
        contentType: 'application/json', 
        success: function (data) {
            if((data["title"] != content) && (field == "title"))
            {
                alert("Can't have the same title for two different courseworks");
                $("#coursework_section_" + data["title"] + " > ul > li > label[for='title']").parent().find("input").attr("value",data["title"]);
                return;
            }
            if((data["weight"] != content) && (field == "weight"))
            {
                alert("Weight has to be a number");
                $("#coursework_section_" + data["title"] + " > ul > li > label[for='weight']").parent().find("input").attr("value",data["weight"]);
                return;
            }
            if((data["maxpoints"] != content) && (field == "maxpoints"))
            {
                alert("Max points has to be a number");
                $("#coursework_section_" + data["title"] + " > ul > li > label[for='maxpoints']").parent().find("input").attr("value",data["maxpoints"]);
                return;
            }
                
            if((field == "title") || (field == "maxpoints"))
            {
                ($("#E" + workid)).replaceWith("<li class=\"css_gradeUpload\" id =\"E" + workid + "\"><p>" + data["title"] + " (/" + data["maxpoints"] + ")</p></li>");
                $(("#E" + workid + " > p")).fadeOut("slow");
                $(("#E" + workid + " > p")).fadeIn("slow");
            }

            if(field == "weight")
            {
                var gradeuploaderSections = ($(".gradeuploader_section > ul > li > label[for='" + data["title"] + "']"));

                $(gradeuploaderSections).each (function() {
                    student = $(this).parent().find("input").attr("name",data["weight"]);                 
                });
                
                gradeuploaderSections = ($(".gradeuploader_section > ul > li > label[for='studentname']"));

                $(gradeuploaderSections).each (function() {
                    student = $(this).parent().find("input").val();

                    var studentSections = ($("#gradeuploader_section_" + student + " > ul > li > input"));

                    var grades = 0;
                    var totalweight = 0;

                    $(studentSections).each (function() {
                        grade = this.value;
                        if(isInt(grade))
                        {
                            var maxpoints = parseInt(this.alt);
                            var weight = parseInt(this.name);
                            grades += (( (parseInt(grade))/maxpoints) * weight);
                            totalweight += weight;
                        }
                    });
                    grades = (grades/totalweight) * 100;
                    //alert(grades);
                    $("#gradeslist_section_" + student + " > ul > li > label[for='overallaverage']").parent().find("input").attr("value",grades.toFixed(2));
                    glow(document.getElementById(student + "average" ));
                });
            }

            if(field == "maxpoints")
            {
                var gradeuploaderSections = ($(".gradeuploader_section > ul > li > label[for='" + data["title"] + "']"));
                var numOfGrades = 0;
                var grades = 0;

                $(gradeuploaderSections).each (function() {
                    student = $(this).parent().find("input").attr("alt",data["maxpoints"]);
                    grade = $(this).parent().find("input").val();
                    if((grade != "") && (grade != "-"))
                    {
                        grades += parseInt(grade);
                        numOfGrades++;
                    }
                });

                if((grades == 0) || (numOfGrades == 0)) 
                    var average = 0;   
                else
                    var average = ((grades/numOfGrades));
                $("#gradeuploader_section_average > ul > li > label[for='" + data["title"] + "averagegrade']").parent().find("input").attr("value",average.toFixed(2));
                glow($("#gradeuploader_section_average > ul > li > label[for='" + data["title"] + "averagegrade']").parent().find("input"));
                
                gradeuploaderSections = ($(".gradeuploader_section > ul > li > label[for='studentname']"));

                $(gradeuploaderSections).each (function() {
                    student = $(this).parent().find("input").val();

                    var studentSections = ($("#gradeuploader_section_" + student + " > ul > li > input"));

                    var grades = 0;
                    var totalweight = 0;

                    $(studentSections).each (function() {
                        grade = this.value;
                        if(isInt(grade))
                        {
                            var maxpoints = parseInt(this.alt);
                            var weight = parseInt(this.name);
                            grades += (( (parseInt(grade))/maxpoints) * weight);
                            totalweight += weight;
                        }
                    });
                    grades = (grades/totalweight) * 100;
                    //alert(grades);
                    $("#gradeslist_section_" + student + " > ul > li > label[for='overallaverage']").parent().find("input").attr("value",grades.toFixed(2));
                    glow(document.getElementById(student + "average" ));
                });
            }
        }
});
}

function saveGradeEdit(student, workid)
{
    var grade = document.getElementById(student+workid).value;
    $.ajax({
        url: "/gradecenter/savegradeedit/",
        type: "POST",
        data: "workid=" + workid + "&student=" + student + "&grade=" + grade,
        processData: false,
        contentType: false,
        success: function (data) {
            if(data["grade"] != grade)
            {
                alert("Grade can be either a number, a dash (\"-\") or kept blank");
                document.getElementById(student+workid).value = data["grade"];
                return;
            }
            var gradeuploaderSections = ($(".gradeuploader_section > ul > li > label[for='" + data["title"] + "']"));
            var numOfGrades = 0;
            var grades = 0;

            $(gradeuploaderSections).each (function() {
                grade = $(this).parent().find("input").val();
                if((grade != "") && (grade != "-"))
                {
                    grades += parseInt(grade);
                    numOfGrades++;
                }
            });

            if((grades == 0) || (numOfGrades == 0)) 
                    var average = 0;   
                else
                    var average = ((grades/numOfGrades));
            $("#gradeuploader_section_average > ul > li > label[for='" + data["title"] + "averagegrade']").parent().find("input").attr("value",average.toFixed(2));
            glow($("#gradeuploader_section_average > ul > li > label[for='" + data["title"] + "averagegrade']").parent().find("input"));

            var studentSections = ($("#gradeuploader_section_" + student + " > ul > li > input"));

            grades = 0;
            totalweight = 0;
            var allGrades = {};
            $(studentSections).each (function() {
                grade = this.value;
                if(isInt(grade))
                {
                    var maxpoints = parseInt(this.alt);
                    var weight = parseInt(this.name);
                    grades += (( (parseInt(grade))/maxpoints) * weight);
                    totalweight += weight;
                }
            });
            grades = (grades/totalweight) * 100;
            $("#gradeslist_section_" + student + " > ul > li > label[for='overallaverage']").parent().find("input").attr("value",grades.toFixed(2));
            glow(document.getElementById(student + "average" ));
            
        }        
});
}

function isInt(value)
{ 
	if((parseFloat(value) == parseFloat(value)) && !isNaN(value))
		return true;
	else
		return false;
}

function saveFinalGradeEdit(student, courseinstanceid)
{
    var grade = document.getElementById(student + "final").value;
    grade = grade.toUpperCase();

    $.ajax({
        url: "/gradecenter/savefinalgradeedit/",
        type: "POST",
        data: "student=" + student + "&grade=" + grade  + "&courseinstanceid=" + courseinstanceid,
        processData: false,
        contentType: false,
        success: function (data) {
            if(data != grade)
            {
                alert("Grade can be either A, B, C, D or R");
            }
            $("#gradeslist_section_" + student + " > ul > li > label[for='finalgrade']").parent().find("input").attr("value",data);
        }     
});
}

function gotouser()
{
	location.href = "/gradecenter/";
}

function logout()
{
	location.href = "/gradecenter/logout/";
}
