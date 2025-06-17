#!/bin/sh

nohup gunicorn global.wsgi:application --bind 127.0.0.1:8000 --workers 1 --timeout 180 > nohup.out &
# python manage.py runserver 0.0.0.0:8000