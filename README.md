# nation_flag_chat

庆祝祖国七十周年，“今日我们都是升旗手”项目

网页模仿微信群聊

## 运行

### 安装依赖

建议使用virtualenv

```bash
pip install -r requirements.txt
```

### 创建配制文件(必须)

在根目录下新建`config.py`，初始内容如下：

```py
import os

"""
config file

  store basic configuration of the app
"""

# flask运行配置
HOST = '0.0.0.0'
PORT = 80
DEBUG = True # 是否开启调试环境

# session configuration
SECRET_KEY = os.urandom(24) # 密钥
SESSION_TYPE = 'redis' # session存储格式为redis
SESSION_USE_SIGNER = True # 是否对发送到浏览器上session的cookie值进行加密
SESSION_PERMANENT = True # 如果设置为False，则关闭浏览器session就失效；如果True，则长期有效
PERMANENT_SESSION_LIFETIME = 1200 # 如果设置session长期有效，则设定session生命周期，整数秒

# 微信公众号配置
APPID = 'xxxxxxx' # 公众号ID
APPSECRET = 'xxxxxx' # 公众号密钥
REDIRECT_URI = 'http%3A//127.0.0.1/home' # 回调URL，需要在公众号中配置
SCOPE = 'snsapi_userinfo' # 弹出授权页面，可通过openid拿到昵称、性别、所在地。并且， 即使在未关注的情况下，只要用户授权，也能获取其信息

# setup the basic configuration of database
DATABASE_HOST = 'xxxxxxxxxxx'
DATABASE_PORT = '3306'
DATABASE = 'xxxxxx'
USERNAME = 'xxxxxx'
PASSWORD = 'xxxxxx'
URI = "mysql+pymysql://{}:{}@{}:{}/{}?charset=utf8".format(USERNAME, PASSWORD, DATABASE_HOST, DATABASE_PORT, DATABASE)
SQLALCHEMY_DATABASE_URI = URI
SQLALCHEMY_TRACK_MODIFICATIONS =False

# redis configuration
REDIS_HOST = 'xxxxx'
REDIS_PORT = 'xxxxx'
REDIS_PASSWD = 'xxxxx'

# 返回状态码设置
SUCCESS = 0
FAIL = 1
ERROR = 2
```

### 微信测试号配置

需要在测试号中，配置`JS接口安全域名`和`网页授权获取用户基本信息 - 回调域名`为`127.0.0.1`。

### 启动

```bash
python app.py
```

然后在 微信web开发者工具 中访问`http://127.0.0.1`即可。
