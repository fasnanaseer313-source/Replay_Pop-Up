from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time

options = Options()
options.add_argument('--headless')
options.add_argument('--window-size=1920,1080')
driver = webdriver.Chrome(options=options)
driver.get('http://localhost:8000/index.html')

# Get scrollHeight to ensure page is loaded
print(driver.execute_script("return document.body.scrollHeight"))

# Scroll to the section to trigger the animation
driver.execute_script('document.querySelector("#main-wrapper").scrollTop = document.querySelector(".editorial-how").offsetTop - 200;')
time.sleep(1) # Wait for animation to progress

driver.save_screenshot('timeline_anim.png')
driver.quit()
