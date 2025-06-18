# BlogSeek简介

[English](./README_en.md)  | 简体中文

BlogSeek是一款网页博客搜索Web应用，提供了个人博客搜索、博客收藏功能。

本项目包含前后端完整代码，部署后可直接使用。

# 目录 

[用户使用说明](#用户使用说明)

[开发者使用说明](#开发者使用说明)

# 用户使用说明

本部分面向使用者介绍BlogSeek该如何使用。

## 访问我们搭建好的网站

本团队已经部署好了BlogSeek，可通过域名 [blogseek.top](blogseek.top) 进行访问。(长期有效)

## 页面介绍

BlogSeek的页面及其功能：
- 主页：可搜索博客，登录/注册，下载桌面端BlogSeek，跳转到个人主页(登录后在右上角个人头像下拉选项点击个人主页)
- 搜索结果页：可查看搜索结果，或**收藏博客**(必须登录)
- 登录/注册页：登录注册。
- 个人主页：查看已收藏博客。

## 功能介绍

### 登录注册

点击主页右上角进行登录/注册。

登录后可在右上角的个人头像处下拉选项中进入**个人主页**或**退出登录**。

### 搜索博客

在主页和搜索结果页的搜索框内输入关键词后回车即可。

### 收藏博客

点击搜索结果卡片的星号进行收藏。

收藏后可在个人主页查看收藏的博客。

### 桌面端下载

本项目提供Windows和Mac桌面端下载, 在主页右上角可进行下载。

# 开发者使用说明

BlogSeek基本架构：
- 前端：Vue.js (最终打包到后端中)，位于[./front-end](https://github.com/LuvReadunion/Blog-Seek/tree/main/front-end)
- 后端：Django，位于 [./back-end](https://github.com/LuvReadunion/Blog-Seek/tree/main/back-end)

## 前端部署

// 待补充

## 后端部署

### 激活虚拟环境

cd到文件目录：

```
cd Blog-Seek/back-end
```

激活虚拟环境 `django_env`：

```
source django_env/bin/activate
```

### 启动Django服务器

监听 `0.0.0.0:8000`，使公网 IP 可访问：

```
nohup python manage.py runserver 0.0.0.0:8000 > nohup.out &
```

- `0.0.0.0:8000`：监听所有网络接口，外部设备可访问。
- `nohup ... &`：让服务在后台运行，即使退出 SSH 会话也不会中断。
- `> nohup.out`：将输出日志写入当前目录的 `nohup.out` 文件中。

### **部署阶段（已配置域名）**

由于通过域名访问即可，使用默认监听地址：

```
nohup gunicorn global.wsgi:application --bind 127.0.0.1:8000 --workers 1 --timeout 180 > nohup.out &
```

| 参数                      | 说明                                                         |
| ------------------------- | ------------------------------------------------------------ |
| `global.wsgi:application` | 指定 Django 项目的 WSGI 接入点，路径为 `项目包.wsgi:application`。 |
| `--bind 127.0.0.1:8000`   | 监听本地地址。                                               |
| `--workers 1`             | 启动 1 个主进程，避免重复加载大模型。                        |
| `--timeout 180`           | 设置每个请求的最大处理时间为 180 秒，避免模型响应慢被误杀。  |
| `> nohup.out &`           | 后台运行并将日志写入 `nohup.out` 文件。                      |

实时查看输出日志：

```
tail -f nohup.out
```

### 关闭Django后端服务器

查看监听 `8000` 端口的进程：

```
lsof -i :8000
```

杀死该进程：

```
kill -9 <PID>
```


## 博客数据爬取

本项目需要爬取个人博客相关信息(但不是博客本身)，实现思路是爬取个人博客的RSS (如`feed.xml`)，解析并存储其中的博客信息。我们不保存博客本身，而是保存指向博客的指针(URL).

// 待完善

### 博客爬取

### 导入博客数据

### 启动服务器

### 关闭服务器