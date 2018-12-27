import os

class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or "b'`F2\xff\xf2v\x1d\xa1X\x86X\xfd\x8d>\xe9]\x1e\x0c\t\x99\xad,<\xf8'"