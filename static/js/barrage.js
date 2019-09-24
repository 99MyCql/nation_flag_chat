const IconBoy = '/static/img/icon-boy.png';
const IconGirl = '/static/img/icon-girl.png';

var page = 1;

// 获取弹幕
function getDM() {
	console.log("获取弹幕")
	$.ajax({
		type: 'GET',
		url: '/list_page/' + page,
		success: function(data){
			let list = data.data;
			console.log(list);
			// 处理弹幕参数
			for (let i = 0; i < list.length; i++) {
				const speed = Math.random() / 5 + 0.1;
				const bottom = Math.floor(Math.random() * 350) + 50;
				const item = {
					avatar_url: list[i].avatar_url,
					sex: list[i].sex,
					content: list[i].content,
					like_count: list[i].like_count,
					bottom: bottom,
					speed: speed,
				};
				createDM(item, i);
			}
		},
		error: function(data){
			console.log(data);
		}
	});
}

// 发送弹幕
function sendDM(userinfo, input_msg) {
	console.log("发送弹幕")
	let item = {
		username: userinfo.nickname,
		avatar_url: userinfo.headimgurl,
		sex: userinfo.sex,
		content: input_msg,
		bottom: 200,
		speed: 0.15,
	}
	$.ajax({
		type: 'POST',
		url: '/add',
		data: item,
		success: function(data){
			console.log(data);
			createDM(item, 0);
		},
		error: function(data){
		}
	});
}

// 创建弹幕
function createDM(item, i) {
	// avatar头像标签
	var avatar = document.createElement('img')
	avatar.setAttribute('class', 'avatar')
	avatar.setAttribute('mode', 'aspectFit')
	avatar.setAttribute("src", item.avatar_url)

	// sex 性别标签
	var sex = document.createElement('img')
	sex.setAttribute('class', 'sex')
	sex.setAttribute('mode', 'aspectFit')
	if (item.sex == 1) {
		sex.setAttribute("src", IconBoy)
	} else {
		sex.setAttribute("src", IconGirl)
	}

	// avatarBox 头像和性别父标签
	var avatarBox = document.createElement('div')
	avatarBox.setAttribute('class', 'avatarBox')
	avatarBox.appendChild(avatar)
	avatarBox.appendChild(sex)

	// content 内容标签
	var content = document.createElement('text')
	content.setAttribute('class', 'content')
	content.innerHTML = item.content

	// dm 单个弹幕标签
	var dm = document.createElement('div')
	dm.setAttribute('class', 'dm')
	dm.appendChild(avatarBox)
	dm.appendChild(content)

	// dmItem 单个弹幕标签
	var dmItem = document.createElement('div')
	dmItem.setAttribute('class', 'dmItem')
	dmItem.appendChild(dm)

	// 设置top left偏移
	dmItem.style.bottom = item.bottom + "px";
	let left = 100;
	dmItem.style.left = left + "%";
	let flag = false;
	// 计时器
	let timer = setInterval(function() {
		if (flag == false && left < 0 && i % 10 == 9) {
			flag = true;
			page += 1;
			getDM(); // 当过去一个弹幕后，再从后端获取十个
		}
		// 小于-100，完全离开屏幕
		if (left < -100) {
			clearInterval(timer); //终止定时器
		}
		left += -item.speed;
		dmItem.style.left = left + "%";
	}.bind(this), 1000 / 70);

	// 主屏幕标签
	const s2 = document.getElementsByClassName("s2")[0]
	console.log(s2)
	s2.appendChild(dmItem)
}