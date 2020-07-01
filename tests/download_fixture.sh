#!/usr/bin/env bash

word="${@}"

if [ -z "${word}" ]; then
    echo "USAGE: ${0} <word>"
    exit 1
fi

wget "https://dictionaryapi.com/api/v3/references/thesaurus/json/${word}?key=eb37bf1c-0f2a-4399-86b8-ba444a0a9fbb" -O "tests/.fixtures/merriam-webster-api/thesaurus/${word}.json"
wget "https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=234297ff-eb8d-49e5-94d6-66aec4c4b7e0" -O "tests/.fixtures/merriam-webster-api/collegiate/${word}.json"
