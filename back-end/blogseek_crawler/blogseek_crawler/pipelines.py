# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html

# useful for handling different item types with a single interface
from itemadapter import ItemAdapter
from scrapy.utils.project import get_project_settings
from blogseek_crawler.utils.standardize_date import standardize_date
import csv
import os
import json
class BlogseekCrawlerPipeline:
    def __init__(self):
        settings = get_project_settings()
        self.output_file = settings.get('MY_OUTPUT_FILE', "blogs_django.json")
        self.file = open(self.output_file, 'w', encoding='utf-8')
        self.file.write('[')  # 写入json数组开始标记
        self.first_item = True

    def process_item(self, item, spider):
        adapter = ItemAdapter(item)
        entry = {
            "model": "BlogSeek.blog",
            "pk": None,  # pk可由数据库生成，或可选赋值
            "fields": {
                "title": adapter.get("title", ""),
                "url": adapter.get("url", ""),
                "author": adapter.get("author", ""),
                "date": standardize_date(adapter.get("date", "")),
                "tags": adapter.get("tags", []),
                "description": adapter.get("description", "") or adapter.get("content", "")
            }
        }
        # 边写边追加json对象，前面加逗号
        if self.first_item:
            self.first_item = False
        else:
            self.file.write(',\n')
        json.dump(entry, self.file, ensure_ascii=False, indent=2)
        return item

    
    def close_spider(self, spider):
        self.file.write(']\n')  # 写入json数组结束标记
        self.file.close()
        
# class BlogseekCrawlerPipeline_CSV:
#     """Pipeline for processing and saving scraped items to CSV"""
#     def __init__(self):
#         self.csv_file = 'blogs_new.csv'
#         self.csv_fields = ['url', 'title', 'author', 'date', 'tags', 'description', 'feed_url', 'file_path']
#         # Create CSV file with headers if it doesn't exist
#         if not os.path.exists(self.csv_file):
#             with open(self.csv_file, 'w', newline='', encoding='utf-8-sig') as f:
#                 writer = csv.DictWriter(f, fieldnames=self.csv_fields)
#                 writer.writeheader()

#     def process_item(self, item, spider):
#         # Clean and validate item data
#         adapter = ItemAdapter(item)
        
#         # Clean title
#         if adapter.get('title'):
#             adapter['title'] = adapter['title'].strip()
        
#         # feed url
#         if adapter.get('feed_url'):
#             adapter['feed_url'] = adapter['feed_url'].strip()
        
#         # file path
#         if adapter.get('file_path'):
#             adapter['file_path'] = adapter['file_path'].strip()
        
#         # Clean author
#         if adapter.get('author'):
#             adapter['author'] = adapter['author'].strip()
        
#         if adapter.get('description'):
#             adapter['description'] = adapter['description'].strip()
        
#         # Clean tags
#         if adapter.get('tags'):
#             if isinstance(adapter['tags'], str):
#                 adapter['tags'] = [tag.strip() for tag in adapter['tags'].split(',')]
#             else:
#                 adapter['tags'] = [tag.strip() for tag in adapter['tags']]
#             adapter['tags'] = ','.join(adapter['tags'])
        
#         # Save to CSV
#         with open(self.csv_file, 'a', newline='', encoding='utf-8-sig') as f:
#             writer = csv.DictWriter(f, fieldnames=self.csv_fields)
#             writer.writerow(dict(adapter))
#             spider.logger.info(f"Saved blog to CSV: {adapter['title']}")
        
#         return item
