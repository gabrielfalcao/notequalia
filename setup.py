#!/usr/bin/env python
# -*- coding: utf-8 -*-

import ast
import os
from setuptools import setup, find_packages


def local_file(*f):
    with open(os.path.join(os.path.dirname(__file__), *f), "r") as fd:
        return fd.read()


class VersionFinder(ast.NodeVisitor):
    VARIABLE_NAME = "version"

    def __init__(self):
        self.version = None

    def visit_Assign(self, node):
        try:
            if node.targets[0].id == self.VARIABLE_NAME:
                self.version = node.value.s
        except Exception:
            pass


def read_version():
    finder = VersionFinder()
    finder.visit(ast.parse(local_file("notequalia", "version.py")))
    return finder.version


setup(
    name="notequalia",
    version=read_version(),
    description="\n".join(
        [
            "A python application consisting of "
            "an HTTP server, ZMQ Components and "
            "a command-line tool to help put everything together"
        ]
    ),
    entry_points={"console_scripts": ["notequalia-io = notequalia.cli:main"]},
    url="https://github.com/gabrielfalcao/kube-python-app-example",
    packages=find_packages(exclude=["*tests*"]),
    include_package_data=True,
    package_data={
        "notequalia": ["README.rst", "*.png", "*.json", "*.rst", "docs/*", "docs/*/*"]
    },
    package_dir={"notequalia-io": "notequalia"},
    zip_safe=False,
    author="Gabriel Falcão",
    author_email="gabriel@nacaolivre.org",
    install_requires=local_file("requirements.txt").splitlines(),
    dependency_links=[],
)
