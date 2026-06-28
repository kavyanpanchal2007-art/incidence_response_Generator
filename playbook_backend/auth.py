import bcrypt
import hashlib


def hash_password(password: str):
    password = hashlib.sha256(
        password.encode()
    ).hexdigest()

    hashed = bcrypt.hashpw(
        password.encode(),
        bcrypt.gensalt()
    )

    return hashed.decode()


def verify_password(
    plain_password: str,
    hashed_password: str,
):
    plain_password = hashlib.sha256(
        plain_password.encode()
    ).hexdigest()

    return bcrypt.checkpw(
        plain_password.encode(),
        hashed_password.encode(),
    )