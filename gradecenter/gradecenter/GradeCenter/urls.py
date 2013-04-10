from django.conf.urls.defaults import patterns, include, url
import os

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()
PROJECT_PATH = os.path.abspath(os.path.dirname(__file__))

#Professor URLs
urlpatterns = patterns('',
	(r'^(?P<andrew>\w+)/(?P<course_number>\d+)/$', 'gradecenter.GradeCenter.views.index'),
	(r'^(?P<andrew>\w+)/(?P<course_number>\d+)/(?P<year>\d+)/$', 'gradecenter.GradeCenter.views.index'),
	(r'^addwork/$', 'gradecenter.GradeCenter.viewsP.addwork'),
	(r'^removework/$', 'gradecenter.GradeCenter.viewsP.removework'),
	(r'^saveworkedit/$', 'gradecenter.GradeCenter.viewsP.saveworkedit'),
	(r'^savegradeedit/$', 'gradecenter.GradeCenter.viewsP.savegradeedit'), 
    (r'^savefinalgradeedit/$', 'gradecenter.GradeCenter.viewsP.savefinalgradeedit'),
    (r'^professorgraphs/$', 'gradecenter.GradeCenter.viewsPC.professorgraphs'),
    (r'^getprofessorgraphs/$', 'gradecenter.GradeCenter.viewsPC.getprofessorgraphs'),
)

#Student URLs
urlpatterns += patterns('',
	(r'^coursework/$', 'gradecenter.GradeCenter.viewsS.studentcoursework'),
)

#Course Page URLs
urlpatterns += patterns('',
	(r'^usergrades/$', 'gradecenter.GradeCenter.viewsC.userGrades'),
	(r'^coursepage/$', 'gradecenter.GradeCenter.viewsC.coursepage'),
	(r'^average/$', 'gradecenter.GradeCenter.viewsC.average'),
	(r'^projections/$', 'gradecenter.GradeCenter.viewsC.projections'),
)

#Login URLs
urlpatterns += patterns ('',
	(r'login/$', 'django.contrib.auth.views.login',
					{'template_name':'GradeCenter/login.html'}),
	(r'^logout/$', 'gradecenter.GradeCenter.views.logout_view'),
)


urlpatterns += patterns('',
	(r'^(?P<andrew>\w+)/$', 'gradecenter.GradeCenter.views.index'),
	(r'^$', 'gradecenter.GradeCenter.views.index'),
)

#serving static files
urlpatterns += patterns('',
	(r'^css/(?P<path>.*)$', 'django.views.static.serve',
		{'document_root': os.path.join(PROJECT_PATH, 'static/css'), 'show_indexes': True}),
    (r'^js/(?P<path>.*)$', 'django.views.static.serve',
		{'document_root': os.path.join(PROJECT_PATH, 'static/js'), 'show_indexes': True}),
	(r'^images/(?P<path>.*)$', 'django.views.static.serve',
		{'document_root': os.path.join(PROJECT_PATH, 'static/images'), 'show_indexes': True}),
)

 # Examples:
    # url(r'^$', 'gradecenter.views.home', name='home'),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
