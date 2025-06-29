import json
import re

from dateutil import parser

# 中文月份和英文映射
zh_months = {
    '一月': 'January', '二月': 'February', '三月': 'March', '四月': 'April',
    '五月': 'May', '六月': 'June', '七月': 'July', '八月': 'August',
    '九月': 'September', '十月': 'October', '十一月': 'November', '十二月': 'December'
}

# 中文星期可直接删除
zh_weekdays = ['週一', '週二', '週三', '週四', '週五', '週六', '週日']

def clean_zh_date(zh_date):
    # 去掉中文星期
    for wd in zh_weekdays:
        zh_date = zh_date.replace(wd + ',', '').replace(wd, '')
    # 替换中文月份
    for zh, en in zh_months.items():
        zh_date = zh_date.replace(zh, en)
    return zh_date.strip()
def standardize_date(date_str):
    date_str = re.sub(r'^Thurs,', 'Thu,', date_str)
    date_str = re.sub(r'\(.*?\)', '', date_str).strip()
    date_str = clean_zh_date(date_str).replace('24:00:00', '00:00:00')
    try:
        dt = parser.parse(date_str)
        return dt.strftime('%Y-%m-%d')
    except Exception as e:
        # print(date_str)
        return " "  

if __name__=='__main__':
    path = 'data/merged_53548_with_con_des.json'

    data =json.load(open(path, 'r'))

    dates = data['date']
    for index in dates:
        date = dates[index]
        if len(date) > 0 and date is not None:
            # print('date',date)
            new_date = standardize_date(date)
            dates[index] =  new_date if new_date is not None else  date
            if not re.match(r"\d{4}-\d{2}-\d{2}$", dates[index]):
                print(date, new_date)
                # assert False

    json.dump(data, open('data/merged_53548_stan_date.json', 'w'))