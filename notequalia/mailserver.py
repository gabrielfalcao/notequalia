import logging
import json
import smtpd
import asyncore
from typing import List
from notequalia.models import NoteMail

logger = logging.getLogger(__name__)


class NoteMailInboxServer(smtpd.SMTPServer):
    allowed_recepient_domains = ["cognod.es", "visualcu.es"]

    def accept_recepients(self, rcpttos: List[str]) -> bool:
        for email in rcpttos:
            if not email.startswith("note-"):
                continue
            for domain in self.allowed_recepient_domains:
                if email.endswith(f"@{domain}"):
                    return True

    def process_message(self, peer, mailfrom, rcpttos, data, **kwargs):
        logger.debug(
            f"process_message -> {peer!r} {mailfrom!r} {rcpttos!r} {kwargs!r}"
        )
        if not self.accept_recepients(rcpttos):
            logger.info(f"ignoring message from {mailfrom!r} to {rcpttos!r}")
            return

        for to in rcpttos:
            email = NoteMail.create(
                sender=mailfrom,
                recipient=to,
                data=data,
                extra=json.dumps(kwargs, default=str),
            )
            logger.info(f"saved email {email}")


def run(host="0.0.0.0", port=8825):
    server = NoteMailInboxServer((host, port), None)
    logger.info(f"Note Mail server listening on {host}:{port}")
    asyncore.loop()
    return server
