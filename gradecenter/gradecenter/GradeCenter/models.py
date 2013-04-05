from django.db import models

class Professor(models.Model):
	username = models.CharField(max_length=200)
	andrewid = models.CharField(max_length=200)

class Student(models.Model):
	username = models.CharField(max_length=200)
	andrewid = models.CharField(max_length=200)

class Course(models.Model):
	number = models.IntegerField(max_length=100)
	name = models.CharField(max_length=200)
	units = models.IntegerField()
	description = models.CharField(max_length=9999)

class Course_Instance(models.Model):
	professor = models.ForeignKey(Professor)
	courseid = models.ForeignKey(Course)
	year = models.IntegerField(max_length=100)

class Enroll(models.Model):
	courseid = models.ForeignKey(Course_Instance)
	studentid = models.ForeignKey(Student)

class Work(models.Model):
	title = models.CharField(max_length=200)
	courseid = models.ForeignKey(Course_Instance)
	description = models.CharField(max_length=9999)
	weight = models.IntegerField(max_length=100)
	duedate = models.DateField()
	duetime = models.TimeField()
	maxpoints = models.IntegerField(max_length=100)

class Grade(models.Model):
	workid = models.ForeignKey(Work)
	student = models.ForeignKey(Student)
	grade = models.IntegerField(max_length=100)

class Final_Grade(models.Model):
	courseinstance = models.ForeignKey(Course_Instance)
	student = models.ForeignKey(Student)
	grade = models.CharField(max_length=2)

