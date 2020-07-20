import re
from notequalia.web.core import ValidationError

at_least_one_lowercase_letter = re.compile(r"[a-z]")
at_least_one_uppercase_letter = re.compile(r"[A-Z]")
at_least_one_number = re.compile(r"[0-9]")
at_least_one_special_character = re.compile(r"[^a-zA-Z0-9]")


email_regex = re.compile(r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)")


def validate_email(self, value) -> str:
    """returns the given email in lower case"""

    found = email_regex.search(value)
    if not found:
        raise ValidationError(f"Invalid email: {value}")

    return value.lower()


def invalid_password_error(value: str, msg: str, field_name: str = "password"):
    message = f"invalid password: {msg}"
    raise ValidationError(field_name, message)


def validate_password(password, minimum_length=8, field_name='password') -> str:
    if not password:
        raise ValidationError(field_name, f"'{field_name}' is a required property")

    if len(password) < minimum_length:
        invalid_password_error(
            password, f"should be at least {minimum_length} characters long."
        )
    if not at_least_one_special_character.search(password):
        invalid_password_error(password, f"should have at least one special character.")
    if not at_least_one_number.search(password):
        invalid_password_error(password, f"should have at least one number.")
    if not at_least_one_uppercase_letter.search(password):
        invalid_password_error(password, f"should have at least one upper-case letter.")
    if not at_least_one_lowercase_letter.search(password):
        invalid_password_error(password, f"should have at least one lower-case letter.")

    return password
