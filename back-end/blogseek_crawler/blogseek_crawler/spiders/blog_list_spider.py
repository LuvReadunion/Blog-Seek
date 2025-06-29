import scrapy
from urllib.parse import urljoin
import xml.etree.ElementTree as ET
from scrapy.exceptions import IgnoreRequest
from scrapy.spidermiddlewares.httperror import HttpError
from twisted.internet.error import TimeoutError, DNSLookupError, ConnectionRefusedError, ConnectionDone, ConnectError, ConnectionLost, TCPTimedOutError
from ..items import BlogseekCrawlerItem
import re
import os
from tqdm import tqdm
import pandas as pd
import feedparser
from html import unescape
import time
class BlogListSpider(scrapy.Spider):
    name = "blogseek"


    def __init__(self, start=None, xml_only=False, **kwargs):
        super(BlogListSpider, self).__init__( **kwargs)
        if not start:
            raise ValueError("You must provide the urls to crawl via -a start=...")

        self.start_urls_path = start
        self.xml_only = str(xml_only).lower() in ['true', '1', 'yes']
        self.failed_urls = []
        self.successful_urls = {} 

        os.makedirs("feeds", exist_ok=True)
        with open(self.start_urls_path, "r") as f:
            self.start_urls = [url.strip().strip('>') for url in f.readlines()]
            self.start_urls = [url for url in self.start_urls if len(url) > 0]
            self.logger.info(f'Crawling {len(self.start_urls)} urls...')

    def clean_html(self, html_content):
        """Clean HTML content and extract plain text"""
        if not html_content:
            return ''
        # Remove HTML tags
        clean_text = re.sub(r'<[^>]+>', ' ', html_content)
        # Decode HTML entities
        clean_text = unescape(clean_text)
        # Remove extra whitespace
        clean_text = re.sub(r'\s+', ' ', clean_text).strip()
        return clean_text

    def start_requests(self):
        headers = {
            'Accept': 'application/xml,application/xhtml+xml,text/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
        }
        for url in tqdm(self.start_urls): 
            feed_urls = [
                    url
                ]
            
            for feed_url in feed_urls:
                self.logger.info(f'Looking into {feed_url}...')
                filename = f"feeds/{self.name}_{re.sub(r'[^a-zA-Z0-9]', '_', feed_url)}.xml"
                yield scrapy.Request(
                    feed_url,
                    headers=headers,
                    # 以下两行用于选择是否在爬虫过程中parse feed文件
                    callback= self.find_xml if self.xml_only else self.parse_feed, # 爬的时候就分解 or 只保存xml文件
                    errback=self.errback_httpbin,
                    meta={
                        'original_url': url, 
                        'feed_url': feed_url,
                        'file_name': filename
                        },
                    dont_filter=False
                )
        

    def closed(self, reason):
        """Save failed URLs after crawl ends"""
        with open(f"failed_urls_{time.time()}.txt", "w", encoding="utf-8") as f:
            for url, reason in set(self.failed_urls):  # 去重
                f.write(f"{url}\t{reason}\n")
    
    def find_xml(self,response):
        feed_links = response.css('link[rel="alternate"]::attr(href)').getall()
        feed_links = [urljoin(response.url, link) for link in feed_links if 'rss' in link or 'atom' in link]
        self.logger.info(f"{response.meta['original_url']} : 找到 {len(feed_links)} 个 RSS 或 Atom 链接")

        for feed_link in feed_links:
            file_name = f"feeds/{self.name}_{re.sub(r'[^a-zA-Z0-9]', '_', feed_link)}.xml"
            if os.path.exists(file_name):
                self.logger.info(f"文件已存在: {file_name}")
                continue
            yield scrapy.Request(
                feed_link,
                callback=self.save_xml,
                meta={'original_url': response.meta['original_url'], 'feed_url': feed_link, 'file_name':file_name},
            )
            
    def parse_feed(self, response):
        parsed = feedparser.parse(response.body)
        feed_url = response.meta['feed_url']
        filename = response.meta['file_name']
        if not os.path.exists(filename):

            with open(filename, "wb") as f:
                f.write(response.body)
        for entry in parsed.entries:
            item = BlogseekCrawlerItem()
            item['url'] = entry.link
            item['title'] = self.clean_html(entry.title)
            item['author'] = self.clean_html(entry.get('author', ''))
            item['tags'] = [self.clean_html(getattr(tag, 'term', '')) for tag in entry.get('categories', [])]
            item['date'] = entry.get('published', '')
            item['description'] = entry.get("summary", "") or entry.get("description", "")
            
            item['feed_url'] = feed_url
            item['file_path'] = filename
            yield item



    def errback_httpbin(self, failure):
        original_url = failure.request.meta.get('original_url')
        feed_url = failure.request.meta.get('feed_url')

        reason = "unknown"

        if failure.check(HttpError):
            response = failure.value.response
            if response.status == 503:
                reason = "503_service_unavailable"
            else :
                return  # 不记录
            
        elif failure.check(DNSLookupError):
            reason = "dns_lookup_error"
        elif failure.check(TimeoutError, TCPTimedOutError):
            reason = "timeout"
        elif failure.check(ConnectionRefusedError, ConnectionDone, ConnectError, ConnectionLost):
            reason = "connection_error"

        if reason != "unknown" and not self.successful_urls.get(original_url, False):
            self.failed_urls.append((original_url, reason))

        self.logger.error(f"Request failed: {feed_url} — Reason: {reason}")