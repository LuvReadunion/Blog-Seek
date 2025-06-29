# BlogSeek Introduction

English | [简体中文](./README.md)

BlogSeek is a web application for searching and collecting personal blogs, offering blog search and bookmarking functionalities.

This project includes complete front-end and back-end code, ready for deployment and immediate use.

# Table of Contents

[User Guide](#user-guide)

[Developer Guide](#developer-guide)

# User Guide

This section explains how to use BlogSeek for end users.

## Accessing Our Deployed Website

Our team has deployed BlogSeek, accessible via the domain [blogseek.top](https://blogseek.top) (long-term availability).

## Page Overview

BlogSeek’s pages and their functionalities:
- **Homepage**: Search for blogs, log in/register, download the desktop version of BlogSeek, or navigate to the personal homepage (via the dropdown menu under the profile picture in the top-right corner after logging in).
- **Search Results Page**: View search results or **bookmark blogs** (requires login).
- **Login/Register Page**: For logging in or registering.
- **Personal Homepage**: View bookmarked blogs.

## Feature Overview

### Login/Register

Click the top-right corner of the homepage to log in or register.

After logging in, access the **Personal Homepage** or **Log Out** via the dropdown menu under the profile picture in the top-right corner.

### Search Blogs

Enter keywords in the search bar on the homepage or search results page and press Enter.

### Bookmark Blogs

Click the star icon on a search result card to bookmark a blog.

Bookmarked blogs can be viewed on the personal homepage.

### Desktop Version Download

The project provides Windows and Mac desktop versions, downloadable from the top-right corner of the homepage.

# Developer Guide

BlogSeek’s architecture:
- **Front-end**: Vue.js (packaged into the back-end), located at [./front-end](https://github.com/LuvReadunion/Blog-Seek/tree/main/front-end)
- **Back-end**: Django, located at [./back-end](https://github.com/LuvReadunion/Blog-Seek/tree/main/back-end)

## Front-end Deployment

### Install Dependencies

Navigate to the front-end directory:
```
cd Blog-Seek/front-end
```

Install dependencies using npm:
```
npm install
```

### Package Front-end to Back-end

After developing the front-end, it needs to be packaged into the back-end. Run the script in the front-end directory:
```
source ./auto_packaging.sh
```

## Back-end Deployment

### Activate Virtual Environment

Navigate to the back-end directory:
```
cd Blog-Seek/back-end
```

Activate the virtual environment `django_env`:
```
source django_env/bin/activate
```

### Start Django Server

Listen on `0.0.0.0:8000` to allow access via public IP:
```
nohup python manage.py runserver 0.0.0.0:8000 > nohup.out &
```

- `0.0.0.0:8000`: Listens on all network interfaces, allowing external access.
- `nohup ... &`: Runs the service in the background, persisting after SSH session termination.
- `> nohup.out`: Logs output to the `nohup.out` file in the current directory.

### **Deployment Phase (Configured Domain)**

For domain-based access, use the default listening address:
```
nohup gunicorn global.wsgi:application --bind 127.0.0.1:8000 --workers 1 --timeout 180 > nohup.out &
```

| Parameter                     | Description                                                                 |
|-------------------------------|-----------------------------------------------------------------------------|
| `global.wsgi:application`     | Specifies the WSGI entry point for the Django project, in the format `project_package.wsgi:application`. |
| `--bind 127.0.0.1:8000`       | Listens on the local address.                                               |
| `--workers 1`                 | Uses one main process to avoid reloading large models multiple times.        |
| `--timeout 180`               | Sets the maximum request processing time to 180 seconds to prevent timeouts for slow model responses. |
| `> nohup.out &`               | Runs in the background and logs output to the `nohup.out` file.             |

View real-time logs:
```
tail -f nohup.out
```

### Stop Django Server

Check processes listening on port `8000`:
```
lsof -i :8000
```

Kill the process:
```
kill -9 <PID>
```

## Blog Crawling

This project crawls metadata related to personal blogs (not the blogs themselves). The approach involves crawling RSS feeds (e.g., `feed.xml`), parsing, and storing blog metadata. We store pointers (URLs) to blogs, not the blogs themselves.

### Environment Requirements

Use the virtual environment `django_env`:
```bash
source django_env/bin/activate
```

Install crawler dependencies:
```bash
cd blogseek_crawler
pip install -r crawler_requirements.txt
```

### Running the Crawler

Edit parameters in `run.sh`:
- `OUTPUT`: Output file path, defaults to `blog_django.json`.
- `INPUT_URLS`: URLs to crawl, in `.csv` or `.txt` format (one URL per line), required parameter.
- `XML_ONLY`: If `true`, saves only feed files without splitting data; defaults to `false`.

Run the crawler:
```bash
bash run.sh
```

### Crawler Output

The following files will be generated in the `blogseek_crawler` directory:
```bash
├── blogseek_crawler
│   ├── __init__.py
│   ├── __pycache__
│   ├── items.py
│   ├── middlewares.py
│   ├── pipelines.py
│   ├── settings.py
│   ├── spiders
│   │   ├── __init__.py
│   │   ├── __pycache__
│   │   └── blog_list_spider.py
│   └── utils
│       ├── __init__.py
│       ├── __pycache__
│       └── standardize_date.py
├── crawler_requirements.txt
├── feeds                        // All feed.xml files
│   └── ...
├── bloglist.log                // Crawler log file
├── blogs_django.json           // Crawler output file (if using the default filename)
└── scrapy.cfg
```

### Import Blog Data

```bash
cp your_data.json ../
cd ..
python manage.py loaddata your_data.json
```