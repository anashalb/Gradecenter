from django.http import HttpResponse, HttpResponseNotFound
from django.shortcuts import render_to_response, HttpResponseRedirect
from django.core.context_processors import csrf
from gradecenter.GradeCenter.models import Professor,Student, Course, Course_Instance, Enroll, Work, Grade, Final_Grade
import datetime
import calendar
from django.utils import simplejson
from collections import defaultdict
from django.contrib.auth.decorators import login_required

#Student
#Request: andrewid
#Response: "course" "grade"
@login_required(login_url='/gradecenter/login/')
def professor(request, course_number = None, year = None):
    try:
        professor = Professor.objects.get(andrewid = request.user)						#professor username
    except Professor.DoesNotExist:
        return HttpResponse ("<h1>Professor does not exist </h1>") 
    course_instances = Course_Instance.objects.filter(professor = professor).order_by('year')	#courses that professor is teaching

    if( (course_number == None) and (year == None) ):
        course_instance = course_instances[0]
        course_number = course_instance.courseid.number
    elif( year == None ):
        try:
            course_instance = course_instances.get(courseid = Course.objects.get(number = course_number))
        except Course_Instance.DoesNotExist:
            return HttpResponse ("<h1>Course does not exist </h1>") 
        except Course.DoesNotExist:
            return HttpResponse ("<h1>Course does not exist </h1>") 
    else:
        try:
            course_instance = course_instances.get(courseid = Course.objects.get(number = course_number) , year = year )
        except Course_Instance.DoesNotExist:
            return HttpResponse ("<h1>Course does not exist </h1>")
        except Course.DoesNotExist:
            return HttpResponse ("<h1>Course does not exist </h1>") 

    course_work = Work.objects.filter(courseid = course_instance).order_by('id')	#All course work for specific course

    enrolled = Enroll.objects.filter(courseid = course_instance).order_by('id')	#Students enrolled in specific course

    final_grade_list = list()
    grades_all = list()
    graded = list()
    allworkaverages = list()
    flag = True

    for w in course_work:
        workaverage = 0
        workgrades = Grade.objects.filter(workid = w.id)
        numworkgrades = len(workgrades)
        for workgrade in workgrades:
             workaverage += workgrade.grade
        if(numworkgrades != 0):
            allworkaverages.append( {'id':w.id, 'title':w.title,'grade':"%.2f" %  ( (float(workaverage)/float(numworkgrades)) )}  )
        else:
            allworkaverages.append({'id':w.id, 'title':w.title,'grade':'-'})

    for s in enrolled:
        usergrades = list()
        averagelist = list()
        average = 0
        numOfWork = 0
        student = {'student':s.studentid.andrewid}
        try:
            grade = Final_Grade.objects.get(student = s.studentid, courseinstance = course_instance)
            final = {'grade':grade.grade}
        except Final_Grade.DoesNotExist:
            final = {'grade':'-'}

        for w in course_work:
            try:
                curgrade = Grade.objects.get(workid = w, student = s.studentid)
                averagelist.append({'grade':curgrade.grade, 'max':w.maxpoints, 'weight':w.weight})
                usergrades.append({'id':w.id, 'title':w.title, 'weight':w.weight, 'maxpoints':w.maxpoints,'grade':curgrade.grade})
                if flag:
                    graded.append (w.title)
            except Grade.DoesNotExist:
                usergrades.append({'id':w.id, 'title':w.title, 'weight':w.weight, 'maxpoints':w.maxpoints,'grade':'-'})
        totalweight = 0;
        for k in averagelist:
            totalweight += k['weight'] 
            numOfWork += 1
            average += float((float(k['grade'])/float(k['max'])) * float(k['weight']))

        try:
            final_grade_list.append([student['student'],final['grade'], "%.2f" % ( (float(average) / float(totalweight)) * float(100)) ])
        except ZeroDivisionError:
            final_grade_list.append([student['student'],final['grade'], "%.2f" % 0 ])
        grades_all.append([student['student'],{'grades':usergrades}])
        flag = False
      

    return render_to_response('GradeCenter/professor.html', { 'course_instances' : course_instances,
                                                              'course_instanceid' : course_instance.id,
                                                              'course_work' : course_work,
                                                              'grades_all' : grades_all, 
                                                              'allworkaverages' : allworkaverages, 
                                                              'course_name' : course_instance.courseid.name,                                                                                                                      
                                                              'course_number' : course_number,
                                                              'course_professor_andrewid' : course_instance.professor.andrewid,
                                                              'course_year' : course_instance.year,
                                                              'final_grade_list' : final_grade_list,
                                                              'enrolled': enrolled,
                                                              'graded_coursework' : graded })

@login_required(login_url='/gradecenter/login/')
def addwork(request):
    course_professor_andrewid = request.user.username
    try:
        professor = Professor.objects.get( andrewid = course_professor_andrewid)
        course_number = request.POST['course_number']
        course = Course.objects.get(number = course_number)
        course_year = request.POST['course_year']
        course_instance = Course_Instance.objects.get(professor = professor, courseid = course, year = course_year)
    except Course.DoesNotExist:
        return HttpResponse ("<h1>Course does not exist </h1>") 
    except Professor.DoesNotExist:
        return HttpResponse ("<h1>Professor does not exist </h1>") 
    except Course_Instance.DoesNotExist:
        return HttpResponse ("<h1>Course Instance does not exist </h1>") 

    if(professor != course_instance.professor):
        return HttpResponse ("<h1>Sorry, you are not authorized to edit this page </h1>")

    title = request.POST['title']
    description = request.POST['description']

    duedate = request.POST['duedate']
    month = duedate[0:3]
    d = dict((v,k) for k,v in enumerate(calendar.month_abbr))
    month = d[month]
    date = datetime.date(int(duedate[9:13]), int(month),int(duedate[5:7]))

    duetime = request.POST['duetime']
    time = datetime.time(int(duetime[0:2]), int(duetime[3:5]))
    weight = request.POST['weight']
    maxpoints = request.POST['maxpoints']
    work = Work(title = title, courseid = course_instance, duedate = date, duetime = time, description = description, weight = weight, maxpoints = maxpoints)
    work.save()
    return render_to_response('GradeCenter/courseworksection.html',{'course_work': [work]})

@login_required(login_url='/gradecenter/login/')
def saveworkedit(request):
    if ("titles" in request.POST):
        titles = simplejson.loads(request.POST["titles"])
    data = simplejson.loads(request.POST["data"])

    try:
        work = Work.objects.get(id = data['workid'])
    except Work.DoesNotExist:
        return HttpResponse("<h1>You're trying to access a course work that doesn't exist</h1>");

    if(request.user.username != work.courseid.professor.andrewid):
        return HttpResponse ("<h1>Sorry, you are not authorized to edit this page </h1>")

    if(data['field'] == "title"):
        if (not (data["content"] in titles.values())):
            work.title = data['content']
    elif(data['field'] == "description"):
        work.description = data['content']
    elif(data['field'] == "duedate"):
        duedate = data['content']
        month = duedate[0:3]
        d = dict((v,k) for k,v in enumerate(calendar.month_abbr))
        month = d[month]
        date = datetime.date(int(duedate[9:13]), int(month),int(duedate[5:7]))
        work.duedate = date
    elif(data['field'] == "duetime"):
        duetime = data['content']
        if (duetime[6] == 'p'):
            duetime = str(int(duetime[0])+1) + str(int(duetime[1])+2) + duetime[2:]
        elif ((duetime[0] == '1') and (duetime[1] == '2')):
            duetime = "00" + duetime[2:]
        time = datetime.time(int(duetime[0:2]), int(duetime[3:5]))
        work.duetime = time
    elif(data['field'] == "weight"):
        try:
            weight = int(data['content'])
            work.weight = data['content']
        except ValueError:
            ()      
    elif(data['field'] == "maxpoints"):
        try:
            weight = int(data['content'])
            work.maxpoints = data['content']
        except ValueError:
            ()   
        
    work.save()
    workarray = {'title':work.title, 'description':work.description, 'weight':work.weight, 'maxpoints':work.maxpoints}
    work_list = simplejson.dumps(workarray)  
    return HttpResponse(work_list, mimetype='application/json')

@login_required(login_url='/gradecenter/login/')
def savegradeedit(request):

    try:
        work = Work.objects.get(id = request.POST['workid'])
        student = Student.objects.get(andrewid = request.POST['student'])

        value = request.POST['grade']
    except Work.DoesNotExist:
        return HttpResponse("<h1>You're trying to access a course work that doesn't exist</h1>");
    except Student.DoesNotExist:
        return HttpResponse("<h1>The student you specified doesn't exist</h1>");

    if(request.user.username != work.courseid.professor.andrewid):
        return HttpResponse ("<h1>Sorry, you are not authorized to edit this page </h1>")

    if( (value == "-") or (value == "") ):
        try:
            grade = Grade.objects.get(workid = work, student = student)
            grade.delete()
        except Grade.DoesNotExist:
            ()
    else:
        try:
            value = int(value)
            grade = Grade.objects.get(workid = work, student = student)
            grade.grade = value
            grade.save()
        except Grade.DoesNotExist:
            newgrade = Grade(workid = work, student = student, grade = value)
            newgrade.save()
        except ValueError:
            try:
                grade = Grade.objects.get(workid = work, student = student)
                value = grade.grade
            except Grade.DoesNotExist:           
                value = "-"
            
    workarray = {'title':work.title, 'description':work.description, 'weight':work.weight, 'maxpoints':work.maxpoints, 'grade':value}
    work_list = simplejson.dumps(workarray)

    return HttpResponse(work_list, mimetype='application/json')

@login_required(login_url='/gradecenter/login/')
def savefinalgradeedit(request):
    grade = request.POST['grade']
    try:
        course_instance = Course_Instance.objects.get(id = request.POST['courseinstanceid'])
        student = Student.objects.get(andrewid = request.POST['student'])
    except Course_Instance.DoesNotExist:
        return HttpResponse ("<h1>Course Instance does not exist </h1>") 
    except Student.DoesNotExist:
        return HttpResponse ("<h1>Student does not exist </h1>") 

    if(request.user.username != course_instance.professor.andrewid):
        return HttpResponse ("<h1>Sorry, you are not authorized to edit this page </h1>")

    if( (grade == "-") or (grade == "") ):
        try:
            finalgrade = Final_Grade.objects.get(student = student, courseinstance = course_instance)
            finalgrade.delete()
            return HttpResponse(grade)
        except Final_Grade.DoesNotExist:
            return HttpResponse(grade)
    else:
        try:
            finalgrade = Final_Grade.objects.get(student = student, courseinstance = course_instance)
            if( (grade == "A") or (grade == "B") or (grade == "C") or (grade == "D") or (grade == "R")):
                finalgrade.grade = grade
                finalgrade.save()
            return HttpResponse(finalgrade.grade)
        except Final_Grade.DoesNotExist:
            if( (grade == "A") or (grade == "B") or (grade == "C") or (grade == "D") or (grade == "R")):
                newfinalgrade = Final_Grade(student = student, courseinstance = course_instance, grade = grade)
                newfinalgrade.save()
                return HttpResponse(newfinalgrade.grade)
            else:
                return HttpResponse("-")



@login_required(login_url='/gradecenter/login/')
def removework(request):
    try:
        work = Work.objects.get(id = request.POST['workid'])
        worktitle = work.title
        course_instance = work.courseid
        professor = course_instance.professor
        if(professor.andrewid == request.user.username):
            Grade.objects.filter(workid = work).delete()
            work.delete()
        else:
            return HttpResponse ("<h1>Sorry, you are not authorized to edit this page </h1>")
        workarray = {'title':work.title, 'description':work.description, 'weight':work.weight, 'maxpoints':work.maxpoints}
        work_list = simplejson.dumps(workarray)
        return HttpResponse(work_list, mimetype='application/json')
    except Work.DoesNotExist:
        return HttpResponse("doesntexist")
