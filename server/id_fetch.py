import requests
from bs4 import BeautifulSoup

url = "https://intern.fh-wedel.de/~splan/index.html?typ=benutzer_vz"

r = requests.get(url)
soup = BeautifulSoup(r.text, "html.parser")

# Alle Checkboxen sammeln
checkbox_names = [cb['value'] for cb in soup.select("input[type='checkbox']")]

print("Gefundene Checkboxen:")

url_post = "https://intern.fh-wedel.de/~splan/index.html?typ=benutzer_vz_ausgabe"
for name in checkbox_names:
    url_post += f"&id={name}"

r = requests.get(url)
soup = BeautifulSoup(r.text, "html.parser")

checkbox_names = [cb for cb in soup.select("td span")]
for name in checkbox_names:
    print(name.text,name.attrs['title'])