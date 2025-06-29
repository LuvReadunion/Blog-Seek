OUTPUT_PATH='output.json'
INPUT_URLS='...'
XML_ONLY=false

scrapy crawl blogseek -s MY_OUTPUT_FILE=$OUTPUT_PATH -a start=$INPUT_URLS -a xml_only=$XML_ONLY