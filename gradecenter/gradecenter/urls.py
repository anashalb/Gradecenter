from django.conf.urls.defaults import patterns, include, url
from django.contrib import admin
import os
admin.autodiscover()

urlpatterns = patterns('',
	url(r'^gradecenter/', include('gradecenter.GradeCenter.urls')),
    url(r'^admin/', include(admin.site.urls)),
    # Examples:
    # url(r'^$', 'gradecenter.views.home', name='home'),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),



)
