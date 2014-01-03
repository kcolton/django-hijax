# -*- coding: utf-8 -*-
from distutils.core import setup

setup(
    name='django-hijax',
    version='0.0.1',
    description='Hijax framework for Django.',
    author='Ken Colton',
    author_email='kcolton@gmail.com',
    url='https://github.com/kcolton/django-hijax',
    packages=['hijax'],
    package_data={'hijax': [
        'static/hijax/*.js',
        'static/hijax/*.css',
        'static/third_party/*.js',
        'static/third_party/jquery/*.js',
    ]},
    classifiers=[
        'Environment :: Web Environment',
        'Intended Audience :: Developers',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
    ]
)
