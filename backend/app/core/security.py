import base64
import hmac
import hashlib
import json
import time
from datetime import datetime, timedelta, timezone
from typing import Any, Union, Optional
from app.core.config import settings

try:
    import bcrypt
    _has_bcrypt = True
except ImportError:
    _has_bcrypt = False

def get_password_hash(password: str) -> str:
    if _has_bcrypt:
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")
    salt = settings.SECRET_KEY[:16]
    return hashlib.sha256((salt + password).encode("utf-8")).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    if _has_bcrypt and hashed_password.startswith("$2"):
        try:
            return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
        except Exception:
            return False
    salt = settings.SECRET_KEY[:16]
    return hashlib.sha256((salt + plain_password).encode("utf-8")).hexdigest() == hashed_password

def _base64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b'=').decode('ascii')

def _base64url_decode(data_str: str) -> bytes:
    padding = '=' * (4 - (len(data_str) % 4)) if (len(data_str) % 4) != 0 else ''
    return base64.urlsafe_b64decode((data_str + padding).encode('ascii'))

def create_access_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    now_ts = int(time.time())
    expire_ts = now_ts + (int(expires_delta.total_seconds()) if expires_delta else settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60)

    header = {"alg": "HS256", "typ": "JWT"}
    payload = {"sub": str(subject), "iat": now_ts, "exp": expire_ts}

    header_b64 = _base64url_encode(json.dumps(header, separators=(',', ':')).encode('utf-8'))
    payload_b64 = _base64url_encode(json.dumps(payload, separators=(',', ':')).encode('utf-8'))
    signing_input = f"{header_b64}.{payload_b64}".encode('ascii')

    signature = hmac.new(settings.SECRET_KEY.encode('utf-8'), signing_input, hashlib.sha256).digest()
    sig_b64 = _base64url_encode(signature)
    return f"{header_b64}.{payload_b64}.{sig_b64}"

def decode_access_token(token: str) -> Optional[str]:
    try:
        parts = token.strip().split('.')
        if len(parts) != 3:
            return None
        header_b64, payload_b64, sig_b64 = parts
        signing_input = f"{header_b64}.{payload_b64}".encode('ascii')
        expected_sig = hmac.new(settings.SECRET_KEY.encode('utf-8'), signing_input, hashlib.sha256).digest()
        actual_sig = _base64url_decode(sig_b64)

        if not hmac.compare_digest(expected_sig, actual_sig):
            return None

        payload = json.loads(_base64url_decode(payload_b64).decode('utf-8'))
        exp = payload.get("exp")
        if exp and int(time.time()) > exp:
            return None
        return str(payload.get("sub"))
    except Exception:
        return None
