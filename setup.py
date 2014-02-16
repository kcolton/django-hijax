# -*- coding: utf-8 -*-
from setuptools import setup, find_packages

setup(
    name='django-hijax',
    version='0.0.3',
    description='Hijax framework for Django.',
    author='Ken Colton',
    author_email='kcolton@gmail.com',
    url='https://github.com/kcolton/django-hijax',
    packages=find_packages(),
    include_package_data=True,
    classifiers=[
        'Environment :: Web Environment',
        'Intended Audience :: Developers',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
    ]
)
