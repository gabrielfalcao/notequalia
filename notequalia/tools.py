from notequalia.models import User, AccessToken


def create_user(email, password) -> User:
    user = User.find_one_by_email(email)
    if not user:
        user = User.create(email=email, password=password)
        return user

    if user.set_password(password):
        return user
