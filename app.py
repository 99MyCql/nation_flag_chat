# encoding=utf-8
from flask import Flask, render_template, url_for, jsonify, request, redirect
from models import db, Barrage
import config
import requests

app = Flask(__name__)
app.config.from_object(config)
db.init_app(app)

@app.route('/')
def index():
    # 第一步：后端重定位到微信提供的接口URL，让用户同意授权后，微信服务器会跳转到回调地址并携带code参数
    source_url = 'https://open.weixin.qq.com/connect/oauth2/authorize'\
        + '?appid={APPID}&redirect_uri={REDIRECT_URI}&response_type=code&scope={SCOPE}'\
        + '#wechat_redirect'
    url = source_url.format(APPID = config.APPID, REDIRECT_URI = config.REDIRECT_URI, SCOPE = config.SCOPE)
    return redirect(url) # 重定向

# 第一步回调URL
@app.route('/home')
def home():
    # 第二步：通过code换取网页授权access_token
    code = request.args.get('code')
    print(code)
    source_url = 'https://api.weixin.qq.com/sns/oauth2/access_token?'\
        +'appid={APPID}&secret={APPSECRET}&code={CODE}&grant_type=authorization_code'
    access_token_url = source_url.format(APPID = config.APPID, APPSECRET = config.APPSECRET, CODE = code)
    resp = requests.get(access_token_url) # 请求api
    data = eval(resp.text) # 将字符串转为字典
    print(data)
    access_token = data['access_token']
    openid = data['openid']

    # 第三步：刷新access_token（如果需要）

    # 第四步：拉取用户信息(需scope为 snsapi_userinfo)
    source_url = 'https://api.weixin.qq.com/sns/userinfo'\
        + '?access_token={ACCESS_TOKEN}&openid={OPENID}&lang=zh_CN'
    useinfo_url = source_url.format(ACCESS_TOKEN = access_token, OPENID = openid)
    resp = requests.get(useinfo_url) # 请求api
    resp.encoding = 'utf-8'
    data = eval(resp.text)
    print(data)
    userinfo = {
        'nickname': data['nickname'],
        'sex': data['sex'],
        'province': data['province'],
        'city': data['city'],
        'country': data['country'],
        'headimgurl': data['headimgurl']
    }
    print(userinfo)
    return render_template('index.html', userinfo = userinfo)

@app.route('/add', methods=['POST'])
def add_bar():
    # 获取前端数据
    username = request.form.get('username')
    sex = request.form.get('sex')
    avatar_url = request.form.get('avatar_url')
    content = request.form.get('content')
    like_count = 0

    # 增加
    bar = Barrage(username=username, sex=sex, avatar_url=avatar_url, content=content, like_count=like_count)
    db.session.add(bar)
    db.session.commit()
    return jsonify({
        'status_code': config.SUCCESS,
        'msg': 'success'
    })

@app.route('/list_page/<int:page>', methods=['GET'])
def list_page(page=1):
    # 获取点赞数前十的弹幕
    bar_list = Barrage.query.order_by(-Barrage.like_count).paginate(page = page, per_page = 10).items
    bar_list_schema = []
    for bar in bar_list:
        bar_list_schema.append({
            'username': bar.username,
            'sex': bar.sex,
            'avatar_url': bar.avatar_url,
            'content': bar.content,
            'like_count': bar.like_count
        })
    if len(bar_list) == 0:
        print("未查询到！")
    else:
        print(bar_list_schema)
    return jsonify({
        'status_code': config.SUCCESS,
        'msg': 'success',
        'data': bar_list_schema
    })

@app.route('/addLike', methods=['POST'])
def add_like():
    # 获取前端数据
    username = request.form.get('username')
    content = request.form.get('content')
    # 查找
    bar = Barrage.query.filter(Barrage.username==username, Barrage.content==content).first()
    # 更改获赞数
    if bar == None:
        print("未查询到！")
    else:
        bar.like_count = bar.like_count + 1
        db.session.commit()
    return jsonify({
        'status_code': config.SUCCESS,
        'msg': 'success'
    })

# @app.route('/search/',methods=['GET','POST'])
# def search_bar():
#     # 获取前端数据
#     username = "刘振龙"
#     content = "12345"

#     #查(根据用户名和弹幕内容进行查询)
#     bar = Barrage.query.filter(Barrage.username==username,Barrage.content==content).first()
#     # 查(根据用户名进行查询)
#     #bar = Barrage.query.filter(Barrage.username == username).first()
#     if bar == None:
#         print("未查询到！")
#     else:
#         #头像
#         print(bar.avatar_url)
#         #点赞数
#         print(bar.like_count)
#         #弹幕内容
#         print(bar.content)

#     return "ok"

# @app.route('/edit/',methods=["GET","POST"])
# def edit_bar():
#     # 获取前端数据
#     username = "刘振龙"
#     content = "12345"
#     #改
#     bar = Barrage.query.filter(Barrage.username==username, Barrage.content==content).first()
#     #更改获赞数
#     if bar == None:
#         print("未查询到！")
#     else:
#         bar.like_count = bar.like_count + 1
#         db.session.commit()

#     return "ok"

# @app.route('/delete/',methods=["GET","POST"])
# def delete_bar():
#     # 获取前端数据
#     username = "刘振龙"
#     content = "12345"

#     #删
#     bar = Barrage.query.filter(Barrage.username==username,Barrage.content==content).first()
#     if bar == None:
#         print("未查询到！")
#     else:
#         db.session.delete(bar)
#         db.session.commit()

#     return "ok"

if __name__ == '__main__':
    # app.run(host="服务器地址",post=端口号,debug模式)
    app.run(host=config.HOST, port=config.PORT, debug=config.DEBUG)

