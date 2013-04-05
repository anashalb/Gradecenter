from django.http import HttpResponse, HttpResponseForbidden, HttpResponseNotFound
from django.shortcuts import render_to_response, HttpResponseRedirect, redirect
from django.core.urlresolvers import reverse

from GradeCenter.models import Professor,Student, Course, Course_Instance, Enroll, Work, Grade, Final_Grade

from django.contrib.auth.decorators import login_required
from django.contrib.auth.decorators import permission_required
from django.contrib.auth import logout

#This is the login page
@login_required(login_url='/gradecenter/login/')
def index(request, andrew = None, course_number = None, year = None):
	if andrew != None and andrew != str(request.user):
		return  HttpResponseForbidden('<h1>Sorry, you are not authorized to access this page!</h1>')

	try:
		andrewi = Professor.objects.get(andrewid = request.user)
		from GradeCenter.viewsP import professor
		return professor(request,course_number,year)
	except Professor.DoesNotExist:
		try:
			andrewi = Student.objects.get(andrewid = request.user)
			from GradeCenter.viewsS import student
			return student(request)
		except Student.DoesNotExist:
			return HttpResponse('<h1>Incorrect</h1>')

def logout_view(request):
	logout(request)
	return HttpResponseRedirect(reverse('GradeCenter.views.index',))
