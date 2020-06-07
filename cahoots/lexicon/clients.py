import requests


class DataMuseAPI(object):
    def __init__(self):
        self.base_url = 'https://api.datamuse.com'
        self.http = requests.Session()

    def get(self):
        # https://api.datamuse.com/words?ml=breakfast&rel_rhy=grape&max=1000
        pass
