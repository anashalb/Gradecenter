from gradecenter.GradeCenter.models import Professor,Student, Course, Course_Instance, Enroll, Work, Grade, Final_Grade
from django.contrib import admin

admin.site.register(Professor)
admin.site.register(Student)
admin.site.register(Course)
admin.site.register(Course_Instance)
admin.site.register(Enroll)
admin.site.register(Work)
admin.site.register(Grade)
admin.site.register(Final_Grade)

