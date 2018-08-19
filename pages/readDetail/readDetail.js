const one = require("../../libraries/one.js");
var WxParse = require('../components/wxParse/wxParse.js'); //富文本解析自定义组件

Page({
  data: {
    contentInfo: [],
  },
  onLoad(option) {
    //console.log("readDetail.js option.contentId:" + option.contentId);
    this.getContentInfo(option.contentId);
  },
  getContentInfo: function(contentId) { //根据传入的contentId请求文章
    one.ContentInfo(contentId).then((contentInfo) => {
      //console.log("readDetail.js contentInfo: " + contentInfo)
      this.setData({
        "contentInfo": contentInfo,
      })
    }).then(() => {
      let html = this.data.contentInfo[0].hp_content;
      this.resolveHtml(html)
    })
    // .then(() => {  //动态设置navigationBarTitleText
    //   let title = this.data.contentInfo[0].hp_title
    //   wx.setNavigationBarTitle({
    //     title: '《' + title + '》',
    //   })
    // })
  },
  resolveHtml: function(html) { //将HTML解析为WXML
    //console.log("resolveHtml html:" + html)
    var article = html;
    var that = this;
    WxParse.wxParse('article', 'html', article, that, 5);
  }

})