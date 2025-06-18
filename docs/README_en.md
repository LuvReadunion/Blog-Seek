# BlogSeek Introduction
English | [简体中文](./README.md)

> Made in SYSU

BlogSeek is a web application for searching and bookmarking personal blogs, offering blog search and collection functionalities.

This project includes complete front-end and back-end code, ready for direct deployment and use.

# Table of Contents

[User Guide](#user-guide)

[Developer Guide](#developer-guide)

# User Guide

This section explains how to use BlogSeek for end users.

## Accessing the Deployed Website

Our team has deployed BlogSeek, accessible via the domain [blogseek.top](http://blogseek.top) (long-term availability).

## Page Overview

BlogSeek's pages and their functionalities:
- **Homepage**: Search for blogs, log in/register, download the desktop version of BlogSeek, and navigate to the personal page (available in the dropdown menu under the profile icon in the top-right corner after logging in).
- **Search Results Page**: View search results or **bookmark blogs** (requires login).
- **Login/Register Page**: Log in or register.
- **Personal Page**: View bookmarked blogs.

## Feature Introduction

### Login/Register

Click the top-right corner of the homepage to log in or register.

After logging in, access the **Personal Page** or **Log Out** from the dropdown menu under the profile icon in the top-right corner.

### Search Blogs

Enter keywords in the search bar on the homepage or search results page and press Enter.

### Bookmark Blogs

Click the star icon on a search result card to bookmark a blog.

Bookmarked blogs can be viewed on the personal page.

### Desktop Version Download

This project provides desktop versions for Windows and Mac, downloadable from the top-right corner of the homepage.

# Developer Guide

BlogSeek's basic architecture:
- **Front-end**: Vue.js (bundled into the back-end), located at [./front-end](https://github.com/LuvReadunion/Blog-Seek/tree/main/front-end)
- **Back-end**: Django, located at [./back-end](https://github.com/LuvReadunion/Blog-Seek/tree/main/back-end)

## Front-end Deployment

// To be completed

## Back-end Deployment

### Activating the Virtual Environment

Navigate to the directory:

```
cd Blog-Seek/back-end
```

Activate the virtual environment `django_env`:

```
source django_env/bin/activate
```

### Starting the Django Server

Listen on `0.0.0.0:8000` to allow access via public IP:

```
nohup python manage.py runserver 0.0.0.0:8000 > nohup.out &
```

- `0.0.0.0:8000`: Listens on all network interfaces, enabling external access.
- `nohup ... &`: Runs the service in the background, persisting even after SSH session termination.
- `> nohup.out`: Redirects output logs to the `nohup.out` file in the current directory.

### **Deployment Phase (With Configured Domain)**

Since the website is accessible via a domain, use the default listening address:

```
nohup gunicorn global.wsgi:application --bind 127.0.0.1:8000 --workers 1 --timeout 180 > nohup.out &
```

| Parameter                        | Description                                                                 |
|----------------------------------|-----------------------------------------------------------------------------|
| `global.wsgi:application`        | Specifies the WSGI entry point for the Django project, in the format `project_package.wsgi:application`. |
| `--bind 127.0.0.1:8000`          | Listens on the local address.                                               |
| `--workers 1`                    | Starts one main process to avoid reloading large models multiple times.      |
| `--timeout 180`                  | Sets the maximum processing time per request to 180 seconds to prevent premature termination of slow model responses. |
| `> nohup.out &`                  | Runs in the background and logs output to the `nohup.out` file.             |

View real-time logs:

```
tail -f nohup.out
```

### Stopping the Django Back-end Server

Check the process listening on port `8000`:

```
lsof -i :8000
```

Kill the process:

```
kill -9 <PID>
```

## Blog Data Crawling

This project involves crawling personal blog metadata (not the blog content itself). The approach is to crawl RSS feeds (e.g., `feed.xml`), parse the blog information, and store it. We do not store the blog content but save pointers (URLs) to the blogs.

// To be completed

### Blog Crawling

### Importing Blog Data

### Starting the Server

### Stopping the Server
