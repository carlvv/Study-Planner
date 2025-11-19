import requests

response = requests.get("https://intern.fh-wedel.de/~splan/index.html?typ=benutzer_vz_ausgabe&id=53&id=151&id=101")
response.raise_for_status()
print(response.text)