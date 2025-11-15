from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

options = webdriver.FirefoxOptions()
options.add_argument('--headless')
driver = webdriver.Firefox(options=options)


url = "https://intern.fh-wedel.de/~splan/index.html?typ=benutzer_vz"
driver.get(url)

time.sleep(2)

checkboxes = driver.find_elements(By.CSS_SELECTOR, "input[type='checkbox']")
for checkbox in checkboxes:
    if not checkbox.is_selected():
        checkbox.click()

submit_button = driver.find_element(By.CSS_SELECTOR, "input[type='submit', value='Ergebnis erstellen']")
submit_button.click()

time.sleep(5)

lessons = driver.find_elements(By.CSS_SELECTOR, "table tr")
for lesson in lessons:
    print(lesson.text)

driver.quit()
