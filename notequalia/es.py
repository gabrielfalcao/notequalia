import os
import urllib.parse
from typing import List, Any, Dict, Union
from datetime import datetime
from elasticsearch import Elasticsearch

# hosts = [
#     {'host': 'localhost'},
#     {'host': 'othernode', 'port': 443, 'url_prefix': 'es', 'use_ssl': True},
# ]


HostList = List[str]
HostInfo = Dict[str, Union[str, int]]


class ElasticSearchEngine(object):
    def __init__(self, hosts: List[str]):
        if not hosts:
            hosts = ['localhost']

        self.hosts = self.parse_hosts(hosts)
        self.api = Elasticsearch(self.hosts)

    def store_document(self, index_name: str, type_name: str, unique_document_id: str, body: Dict[str, Any]):
        created = self.api.create(
            index=index_name,
            doc_type=type_name,
            refresh='wait_for',
            body=body,
            id=unique_document_id,
        )

        return created


    @classmethod
    def parse_host_string(cls, host: str) -> HostInfo:
        parsed = urllib.parse.urlparse(host)
        result = {}
        if parsed.hostname:
            result['host'] = parsed.hostname

        if parsed.port:
            result['port'] = parsed.port

        if parsed.scheme == 'https':
            result['use_ssl'] = True

        params = urllib.parse.parse_qs(parsed.params)
        result.update(params)
        return result

    @classmethod
    def parse_hosts(cls, hosts: HostList) -> HostInfo:
        return list(map(cls.parse_host_string, hosts))
