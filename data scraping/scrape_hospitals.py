from bs4 import BeautifulSoup
import requests
import csv

home_page = requests.get('http://hospitals.webometrics.info/en/world')
home_soup = BeautifulSoup(home_page.content)



home_menu = soup.find_all("div", {"class": "sitemenu"})
links = home_menu[0].contents[1].find_all("a")

data = []

def page_table(name, page):
    name_table = requests.get(page)
    soup_table = BeautifulSoup(name_table.content)
    country_table = soup_table.find_all("table", {"class": "sticky-enabled"})[0].find_all("tbody")
    country_tr = country_table[0].find_all("tr")
    for row in country_tr:
        cols = row.find_all('td')
        cols = [ele.text.strip().encode("utf8") for ele in cols]
        #print cols
        cols.append(name)
        if len(cols) > 2:
            data.append(cols)


def country_links(cname, cpage):
    page_table(cname, cpage)
    country_page = requests.get(cpage)
    spage = BeautifulSoup(country_page.content)
    next_tag = spage.find_all("li", {"class": "pager-next"})
    if len(next_tag) == 1:
        next_page = "http://hospitals.webometrics.info"+next_tag[0].find_all("a")[0].get("href")
        print next_page
        country_links(cname, next_page)
        
    
lock = "open"
for link in links:
    page_no=500
    if (link.get("href").count("/") == 3):
        country = link.text
        country_page = "http://hospitals.webometrics.info"+link.get("href")
        
        if country == "Ranking by Areas":
            break
        #if country == "American Samoa":
            #lock = "open"
        
        if (lock == "open"):
            print country
            print country_page
            country_links(country, country_page)
        

with open('world hospitals.csv', 'w') as fp:
    a = csv.writer(fp, delimiter=',')
    a.writerows(data)

