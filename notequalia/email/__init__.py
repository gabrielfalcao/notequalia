# -*- coding: utf-8 -*-
import logging

import io
import os
import hashlib
import getpass
import json

from .inbox import Inbox

from notequalia import logs

logger = logging.getLogger(__name__)
inbox = Inbox()

USER = os.getenv('USER', None) or getpass.getuser()


@inbox.collate
def handle(to, sender, body, subject=None, **kw):
    try:
        conversation_uuid = hashlib.sha256(":".join(map(repr, [to, sender]))).hexdigest()
        folder = './inbox/{}'.format(conversation_uuid)

        if not os.path.isdir(folder):
            os.makedirs(folder)

        email_uuid = hashlib.sha256(":".join(map(repr, [to, subject, sender, body]))).hexdigest()

        maildata = {
            'body': body,
            'conversation_uuid': conversation_uuid,
            'email_uuid': email_uuid,
            'sender': sender,
            'subject': subject,
            'to': to,
        }
        # maildata.update(kw)
        meta = json.dumps(maildata, indent=2)
        logger.info(meta)

        target = os.path.join(folder, '{}.json'.format(email_uuid))
        with io.open(target, 'wb') as fd:
            fd.write(meta)
    except Exception as e:
        print(e)
        logger.exception('failed to handle email from %s to %s', sender, to)
        return b'550'
