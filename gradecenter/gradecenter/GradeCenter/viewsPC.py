from django.http import HttpResponse, HttpResponseForbidden, HttpResponseNotFound
from django.shortcuts import render_to_response, HttpResponseRedirect, redirect
from gradecenter.GradeCenter.models import Professor,Student, Course, Course_Instance, Enroll, Work, Grade, Final_Grade
from django.utils import simplejson

#Send data needed to generate graph of all coursework for
#current user
def professorgraphs (request):
	work = request.POST["work"]
	student = request.POST["student"]
	year = request.POST["year"]
	coursenumber = request.POST["number"]
	showaverage = request.POST["showaverage"]

	professor = Professor.objects.get (andrewid = request.user)
	course = Course.objects.get(number = coursenumber);
	instance = Course_Instance.objects.get(year = year, courseid = course)

	#Check if user is enrolled in course
	try:	
		Course_Instance.objects.get (courseid = instance, professor = professor)
	except Course_Instance.DoesNotExist:
		return  HttpResponseNotFound('<h1>Sorry, you are not authorized to access these grades!</h1>')

	students = list()
	if student == "entire":
		studentslist = Enroll.objects.filter (courseid = instance).order_by('id')
		for s in studentslist:
			students.append(s.studentid)
	else:
		students.append(Student.objects.get (andrewid = student))
	
	works = list()
	if work == "entire":
		works = Work.objects.filter(courseid = instance).order_by('duedate','duetime')
	else:
		works.append(Work.objects.get(title = work, courseid = instance))

	#Get work for specific course instance	
	titles = list()
	studentGrades = {}
	flag = True

	for s in students:
		name = s.andrewid
		grades = list()
		for w in works:
			try:
				if flag:
					titles.append(w.title + " (" + str(w.maxpoints) + ")")
				curgrade = Grade.objects.get(workid = w, student = s)
				grades.append(curgrade.grade)
			except Grade.DoesNotExist:
				continue
		flag = False
		studentGrades[name] = grades

	if showaverage == "1":
		works = Work.objects.filter(courseid = instance).order_by('duedate','duetime')
		average = list()

		for w in works:
			try:
				total = 0

				allgrades = Grade.objects.filter(workid = w)
				if allgrades:
					for g in allgrades:
						total += g.grade
					average.append(total/len(allgrades))
			except Grade.DoesNotExist:
				continue
		studentGrades["average"] = average
	data = [titles, studentGrades]

	return HttpResponse(simplejson.dumps(data))

def getprofessorgraphs (request):
	return render_to_response ('GradeCenter/professorGraphs.html',{})
