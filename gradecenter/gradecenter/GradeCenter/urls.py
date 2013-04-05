from django.conf.urls.defaults import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

#Professor URLs
urlpatterns = patterns('',
	(r'^(?P<andrew>\w+)/(?P<course_number>\d+)/$', 'GradeCenter.views.index'),
	(r'^(?P<andrew>\w+)/(?P<course_number>\d+)/(?P<year>\d+)/$', 'GradeCenter.views.index'),
	(r'^addwork/$', 'GradeCenter.viewsP.addwork'),
	(r'^removework/$', 'GradeCenter.viewsP.removework'),
	(r'^saveworkedit/$', 'GradeCenter.viewsP.saveworkedit'),
	(r'^savegradeedit/$', 'GradeCenter.viewsP.savegradeedit'), 
    (r'^savefinalgradeedit/$', 'GradeCenter.viewsP.savefinalgradeedit'),
    (r'^professorgraphs/$', 'GradeCenter.viewsPC.professorgraphs'),
    (r'^getprofessorgraphs/$', 'GradeCenter.viewsPC.getprofessorgraphs'),
)

#Student URLs
urlpatterns += patterns('',
	(r'^coursework/$', 'GradeCenter.viewsS.studentcoursework'),
)

#Course Page URLs
urlpatterns += patterns('',
	(r'^usergrades/$', 'GradeCenter.viewsC.userGrades'),
	(r'^coursepage/$', 'GradeCenter.viewsC.coursepage'),
	(r'^average/$', 'GradeCenter.viewsC.average'),
	(r'^projections/$', 'GradeCenter.viewsC.projections'),
)

#Login URLs
urlpatterns += patterns ('',
	(r'login/$', 'django.contrib.auth.views.login',
					{'template_name':'GradeCenter/login.html'}),
	(r'^logout/$', 'GradeCenter.views.logout_view'),
)


urlpatterns += patterns('',
	(r'^(?P<andrew>\w+)/$', 'GradeCenter.views.index'),
	(r'^$', 'GradeCenter.views.index'),
)



 # Examples:
    # url(r'^$', 'gradecenter.views.home', name='home'),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
