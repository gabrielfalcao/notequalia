import re
from flask_restplus import Resource, fields
from .validation import validate_email, validate_password



class EmailField(fields.String):

    def format(self, value):
        return validate_email(value)


class PasswordField(fields.String):
    MINIMUM_LENGTH = 8

    def format(self, value):
        return validate_password(value, minimum_length=self.MINIMUM_LENGTH)
