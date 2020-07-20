from .validation import validate_password


class password(object):
    '''
    Validate an password.

    Example::

        parser = reqparse.RequestParser()
        parser.add_argument('password', type=inputs.password(minimum_length=12))

    Input to the ``password`` argument will be rejected if the password is short or weak
    '''

    def __init__(self, minimum_length: int = 8):
        self.minimum_length = minimum_length

    def __call__(self, value):
        return validate_password(value, self.minimum_length)

    __schema__ = {
        'type': 'string',
        'format': 'password',
    }
