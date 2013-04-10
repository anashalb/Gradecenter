from django.http import HttpResponse
from django.shortcuts import render_to_response, HttpResponseRedirect, redirect
from gradecenter.GradeCenter.models import Professor,Student, Course, Course_Instance, Enroll, Work, Grade, Final_Grade

from django.contrib.auth.decorators import login_required
from django.contrib.auth.decorators import permission_required
from django.contrib.auth import logout

import datetime


#Student
#Response: "courses" "finalgrades" "coursework"	"student" "notifictions"
@login_required(login_url='/gradecenter/login/')
def student(request):
	try:
		student = Student.objects.get(andrewid = request.user)						#studentid
	except Student.DoesNotExist:
		return  HttpResponseNotFound('<h1>Sorry, you are not a registered user yet!</h1>')
	courses = Enroll.objects.filter(studentid = student).order_by('id')			#courses that student is enrolled in

	finalgrades = list()
	for course in courses:
		c = course.courseid
		try:
			finalgrades.append(Final_Grade.objects.get(student = student, courseinstance = c))
		except Final_Grade.DoesNotExist:
			f = Final_Grade(courseinstance=c, student=student, grade='-')
			finalgrades.append(f)
	
	#Gets course work
	coursework = list()
	for c in courses:
		work = Work.objects.filter( courseid = c.courseid).order_by('duedate','duetime')
		if len(work) != 0:
			coursework.append(work)

	#Gets course work with due date are today and tomorrow
	notifications = list()
	for allwork in coursework:
		for w in allwork:
			if w.duedate == datetime.date.today():
				notifications.append(w)

	return render_to_response('GradeCenter/student.html',{	'courses':courses,
															'finalgrades':finalgrades,
															'coursework':coursework,
															'notifications':notifications,
															'student':student})
def studentcoursework(request):
	courseid = request.POST['id']	
	try:
		student = Student.objects.get(andrewid = request.user)						#studentid
	except Student.DoesNotExist:
		return  HttpResponseNotFound('<h1>Sorry, you are not a registered user yet!</h1>')

	courses = list()
	if courseid == "all":
		courses = Enroll.objects.filter(studentid=student)			#courses that student is enrolled in
	else:
		try:
			course = Enroll.objects.get(courseid = courseid, studentid=student)			#courses that student is enrolled in
			courses.append(course)
		except Enroll.DoesNotExist:
			return  HttpResponseForbidden('<h1>Sorry, you are not authorized to view the requested course work</h1>')

	coursework = list()
	for c in courses:
		work = Work.objects.filter( courseid = c.courseid).order_by('duedate','duetime')
		if len(work) != 0:
			coursework.append(work)
	
	return render_to_response('GradeCenter/studentcoursework.html',{ 'coursework':coursework,})
	
