# encoding: utf-8
'''
更改models后，映射到数据库需在Pycharm中的Terminal执行以下命令:
    python manage.py db init(初始化一个迁移脚本的环境，只需执行一次)
    python manage.py db migrate(将模型生成迁移文件)
    python manage.py db upgrade(将迁移文件真正映射到数据库中)
'''
from flask_script import Manager
from flask_migrate import  Migrate, MigrateCommand
from app import app
from models import db, Barrage

manager = Manager(app)

# 使用Migrate绑定app和db
migrate = Migrate(app, db)

# 添加迁移脚本的命令到manager
manager.add_command('db', MigrateCommand)

if __name__=='__main__':
    manager.run()