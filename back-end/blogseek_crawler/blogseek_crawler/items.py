# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class BlogseekCrawlerItem(scrapy.Item):
    # MQY 定义爬取数据结构
    title = scrapy.Field()
    url = scrapy.Field()
    description = scrapy.Field()
    author = scrapy.Field()
    date = scrapy.Field()
    tags = scrapy.Field()
    feed_url = scrapy.Field()
    file_path = scrapy.Field()
    pass
