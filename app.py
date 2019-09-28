# encoding=utf-8
from flask import Flask, render_template, url_for, jsonify, request, redirect, session
from models import db, Barrage, UserRecord
import config
import requests
from sign import Sign
from flask_session import Session
from redis import Redis

# 初始化flask实例
app = Flask(__name__)
app.config.from_object(config) # 从配置模块中导入配置

# 配置数据库
db.init_app(app)

# 初始化redis实例变量
redis = Redis(host=config.REDIS_HOST, port=config.REDIS_PORT, password=config.REDIS_PASSWD)

# 为session传入redis实例
app.config['SESSION_REDIS'] = redis
Session(app)


@app.route('/')
def index():
    # 第一步：后端重定位到微信提供的接口URL，让用户同意授权后，微信服务器会跳转到回调地址并携带code参数
    source_url = 'https://open.weixin.qq.com/connect/oauth2/authorize'\
        + '?appid={APPID}&redirect_uri={REDIRECT_URI}&response_type=code&scope={SCOPE}'\
        + '#wechat_redirect'
    url = source_url.format(APPID = config.APPID, REDIRECT_URI = config.REDIRECT_URI, SCOPE = config.SCOPE)
    return redirect(url) # 重定向

# 请求微信服务端获取用户信息
#   @code: 用于调用获取 “网页授权access_token” URL的code
def get_wx_userinfo(code):
    userinfo = session.get('userinfo')
    print(userinfo)
    if userinfo != None:
        return userinfo

    # 第二步：通过code获取 “网页授权access_token”
    source_url = 'https://api.weixin.qq.com/sns/oauth2/access_token?'\
        +'appid={APPID}&secret={APPSECRET}&code={CODE}&grant_type=authorization_code'
    oauth2_url = source_url.format(APPID = config.APPID, APPSECRET = config.APPSECRET, CODE = code)
    resp = requests.get(oauth2_url) # 请求api
    data = eval(resp.text) # 将字符串转为字典
    print(data)
    oauth2_access_token = data['access_token']
    openid = data['openid']

    # 第三步：刷新access_token（如果需要）

    # 第四步：拉取用户信息(需scope为 snsapi_userinfo)
    source_url = 'https://api.weixin.qq.com/sns/userinfo'\
        + '?access_token={ACCESS_TOKEN}&openid={OPENID}&lang=zh_CN'
    userinfo_url = source_url.format(ACCESS_TOKEN = oauth2_access_token, OPENID = openid)
    resp = requests.get(userinfo_url) # 请求api
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
    session['userinfo'] = userinfo
    return userinfo

# 第一步回调URL，主页面(包含所有场景)
@app.route('/home')
def home():
    code = request.args.get('code') # 获取code参数
    print(code)
    if code is None:
        return redirect('/')
    userinfo = get_wx_userinfo(code)
    return render_template('index.html', userinfo = userinfo)

# 选择界面
@app.route('/choose')
def choose():
    code = request.args.get('code') # 获取code参数
    print(code)
    if code is None:
        return redirect('/')
    get_wx_userinfo(code)
    # raise_flag = session.get('raise_flag')
    # return render_template('choose.html', raise_flag = raise_flag)
    first = session.get('first')
    return render_template('choose.html', first = first)

# 场景准备函数
#   @view: 返回的页面
#   @title: 页面标题
def scene_handler(view):
    userinfo = session.get('userinfo')
    if userinfo is None:
        return redirect('/') # 重定向
    else:
        first = session.get('first')
        print(first)
        if first is None:
            session['first'] = 'no'
        return render_template(view, userinfo = userinfo, first = first)

# 场景1界面
@app.route('/scene1')
def scene1():
    return scene_handler('scene1.html')

# 场景2界面
@app.route('/scene2')
def scene2():
    return scene_handler('scene2.html')

# 场景3界面
@app.route('/scene3')
def scene3():
    return scene_handler('scene3.html')

# 场景4界面
@app.route('/scene4')
def scene4():
    return scene_handler('scene4.html')

# 场景5界面
@app.route('/scene5')
def scene5():
    return scene_handler('scene5.html')

# 场景6界面
@app.route('/scene6')
def scene6():
    return scene_handler('scene6.html')

# 场景7界面
@app.route('/scene7')
def scene7():
    return scene_handler('scene7.html')

# 场景8界面
@app.route('/scene8')
def scene8():
    return scene_handler('scene8.html')

# 升旗界面
@app.route('/nation_flag')
def nation_flag():
    # session['raise_flag'] = True
    return render_template('nation_flag.html')


'''
api接口
'''

# 获取 wx.config
@app.route('/get_wx_config', methods=['POST'])
def get_wx_config():
    url = request.form.get('url')

    cgi_bin_access_token = redis.get('cgi_bin_access_token')
    jsapi_ticket = redis.get('jsapi_ticket')
    print('------>', cgi_bin_access_token, jsapi_ticket)

    if cgi_bin_access_token is None or jsapi_ticket is None:
        # 第一步：获取 “普通access_token”
        source_url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={APPID}&secret={APPSECRET}'
        cgi_bin_url = source_url.format(APPID = config.APPID, APPSECRET = config.APPSECRET)
        resp = requests.get(cgi_bin_url) # 请求api
        data = eval(resp.text) # 将字符串转为字典
        print(data)
        cgi_bin_access_token = data['access_token']
        redis.set('cgi_bin_access_token', cgi_bin_access_token, ex=data['expires_in'])

        # 第二步：获取 jsapi_ticket
        source_url = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token={ACCESS_TOKEN}&type=jsapi'
        ticket_url = source_url.format(ACCESS_TOKEN = cgi_bin_access_token)
        resp = requests.get(ticket_url) # 请求api
        data = eval(resp.text) # 将字符串转为字典
        print(data)
        jsapi_ticket = data['ticket']
        redis.set('jsapi_ticket', jsapi_ticket, ex=data['expires_in'])

    # 第三步：签名算法
    # noncestr=Wm3WZYTPz0wzccnW
    # jsapi_ticket=sM4AOVdWfPE4DxkXGEs8VMCPGGVi4C3VM0P37wVUCFvkVAy_90u5h9nbSlYy3-Sl-HhTdfl2fzFy1AOcHKP7qg
    # timestamp=1414587457
    # url=http://mp.weixin.qq.com?params=value
    sign = Sign(jsapi_ticket, url)
    ret = sign.sign()
    return jsonify({
        'status_code': config.SUCCESS,
        'msg': 'success',
        'data': {
            'appId': config.APPID,
            'timestamp': ret['timestamp'],
            'nonceStr': ret['nonceStr'],
            'signature': ret['signature'],
        }
    })

# 添加弹幕
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

# 获取弹幕
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

# 点赞弹幕
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


if __name__ == '__main__':
    app.run(host=config.HOST, port=config.PORT, debug=config.DEBUG)

