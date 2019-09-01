function get_wx_config () {
  var url = location.href.split('#')[0]
  $.ajax({
    type: "POST",
    url: "/js-jdk/post",
    data: {
      'url': url
    },
    dataType: "json",
    async: false,
    success: function (data) {
      data = data.data
      // 微信接口
      wx.config({
        debug: false,
        appId: data.appId,
        timestamp: data.timestamp,
        nonceStr: data.nonceStr,
        signature: data.signature,
        jsApiList: [
          // 所有要调用的 API 都要加到这个列表中
          'onMenuShareAppMessage',
          'onMenuShareTimeline',
          'onMenuShareQQ',
          'onMenuShareWeibo',
          'onMenuShareQZone'
        ]
      });
    }
  })
}

function wx_share () {
  wx.ready(function () {
    //微信分享
    wx.onMenuShareTimeline({
      title: app.wx_config.title_other, // 分享标题
      desc: app.wx_config.des, // 分享描述
      link: app.wx_config.linkurl_wx, // 分享链接
      imgUrl: app.wx_config.imgurl300, // 分享图标
      success: function () {
        // 用户确认分享后执行的回调函数
        //alert("成功");
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
        //alert("失败");
      }
    });
    wx.onMenuShareAppMessage({
      title: app.wx_config.title, // 分享标题
      desc: app.wx_config.des, // 分享描述
      link: app.wx_config.linkurl_wx, // 分享链接
      imgUrl: app.wx_config.imgurl300, // 分享图标
      type: '', // 分享类型,music、video或link，不填默认为link
      dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
      success: function () {
        // 用户确认分享后执行的回调函数
        //alert("成功");
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
        //alert("失败");
      }
    });
    wx.onMenuShareQQ({
      title: app.wx_config.title_other, // 分享标题
      desc: app.wx_config.des, // 分享描述
      link: app.wx_config.linkurl_other, // 分享链接
      imgUrl: app.wx_config.imgurl300, // 分享图标
      success: function () {
        // 用户确认分享后执行的回调函数
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
      }
    });
    wx.onMenuShareWeibo({
      title: app.wx_config.title_other, // 分享标题
      desc: app.wx_config.des, // 分享描述
      link: app.wx_config.linkurl_other, // 分享链接
      imgUrl: app.wx_config.imgurl300, // 分享图标
      success: function (res) {
      },
      cancel: function (res) {
      },
      fail: function (res) {
      }
    });
    wx.onMenuShareQZone({
      title: app.wx_config.title_other, // 分享标题
      desc: app.wx_config.des, // 分享描述
      link: app.wx_config.linkurl_other, // 分享链接
      imgUrl: app.wx_config.imgurl300, // 分享图标
      success: function (res) {
      },
      cancel: function (res) {
      },
      fail: function (res) {
      }
    });
    wx.error(function(res){
      // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
      // alert("errorMSG:"+res);
    });
  });
}