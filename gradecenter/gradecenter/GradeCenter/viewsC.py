from django.http import HttpResponse, HttpResponseForbidden, HttpResponseNotFound
from django.shortcuts import render_to_response, HttpResponseRedirect, redirect
from GradeCenter.models import Professor,Student, Course, Course_Instance, Enroll, Work, Grade, Final_Grade
from django.utils import simplejson

from django.contrib.auth.decorators import login_required

@login_required(login_url='/gradecenter/login/')
def coursepage(request):
	year = request.GET["year"]
	number = request.GET["number"]

	student = Student.objects.get (andrewid = request.user)

	try:
		course = Course.objects.get(number=number);
		instance = Course_Instance.objects.get(year = year, courseid = course)
	except Course.DoesNotExist:
		return  HttpResponseNotFound('<h1>Sorry, we could not get the required course page!</h1>')
	except Course_Instance.DoesNotExist:
		return  HttpResponseNotFound('<h1>Sorry, we could not get the required course page!</h1>')

	#Check if user is enrolled in course
	try:	
		Enroll.objects.get (courseid = instance, studentid = student)
	except Enroll.DoesNotExist:
		return  HttpResponseForbidden('<h1>Sorry, you are not authorized to access these grades!</h1>')

	#Get work for specific course instance	
	work = Work.objects.filter(courseid = instance).order_by('duedate','duetime')

	#Get grades of all course work for current student 
	graded = list()
	grades = list()
	for w in work:
		try:
			grade = Grade.objects.get(workid = w, student = student)
			graded.append(grade)
		except Grade.DoesNotExist:
			continue

	return render_to_response ('GradeCenter/coursepage.html',{	'student':student,
																'work':work,
																'course':course,
																'instance':instance,
																'graded':graded})

#Send data needed to generate graph of all coursework for
#current user
@login_required(login_url='/gradecenter/login/')
def userGrades (request):
	
	student = Student.objects.get (andrewid = request.user)
		
	work = getWork(request)

	usergrades = list()
	title = list()

	for w in work:
		try:
			curgrade = Grade.objects.get(workid = w, student = student)
			usergrades.append(curgrade.grade)
			title.append(w.title + ' (max: ' + str(w.maxpoints)+')')
		except Grade.DoesNotExist:
			continue

	final = (title,usergrades)
	return HttpResponse(simplejson.dumps(final))

#Send data needed to generate graph of all coursework for
#current user
@login_required(login_url='/gradecenter/login/')
def average (request):
	student = Student.objects.get (andrewid = request.user)

	#Get grades for current user of all coursework
	work = getWork(request)

	average = list()
	usergrades = list()
	title = list()

	for w in work:
		
		try:
			total = 0
			allgrades = Grade.objects.filter(workid = w)
			
			if allgrades:
				for g in allgrades:
					total += g.grade
				average.append(total/len(allgrades))

			curgrade = Grade.objects.get(workid = w, student = student)
			usergrades.append(curgrade.grade)
			title.append(w.title + '\n max points ' + str(w.maxpoints))
		
		except Grade.DoesNotExist:
			continue

	final = (title,usergrades,average)
	return HttpResponse(simplejson.dumps(final))

#Send data needed to generate graph of all coursework for
#current user

@login_required(login_url='/gradecenter/login/')
def projections (request):
	student = Student.objects.get (andrewid = request.user)

	#Get grades for current user of all coursework
	work = getWork(request)

	usergrades = list()
	remaining = list()

	for w in work:
		try:
			curgrade = Grade.objects.get(workid = w, student = student)
			usergrades.append(curgrade)
		except Grade.DoesNotExist:
			remaining.append(w)

	return render_to_response('GradeCenter/projections.html', { 'grades':usergrades,
																'remaining':remaining})



@login_required(login_url='/gradecenter/login/')
def getWork(request):
	year = request.POST["year"]
	number = request.POST["number"]
	student = Student.objects.get (andrewid = request.user)

	try:
		course = Course.objects.get(number=number);
		instance = Course_Instance.objects.get(year = year, courseid = course)
	except Course.DoesNotExist:
		return  HttpResponseNotFound('<h1>Sorry, we could not get the required course page!</h1>')
	except Course_Instance.DoesNotExist:
		return  HttpResponseNotFound('<h1>Sorry, we could not get the required course page!</h1>')

	
	#Check if user is enrolled in course
	try:	
		Enroll.objects.get (courseid = instance, studentid = student)
	except Enroll.DoesNotExist:
		return  HttpResponseNotFound('<h1>Sorry, you are not authorized to access these grades!</h1>')

	#Get work for specific course instance	
	work = Work.objects.filter(courseid = instance).order_by('duedate')
	return work
	
