const URL_IDLIST = "http://v3.wufazhuce.com:8000/api/onelist/idlist/?channel=wdj&version=4.0.2&uuid=ffffffff-a90e-706a-63f7-ccf973aae5ee&platform=android";
// channel：个人设备品牌，目前已知：nexus6p取值是 wdj，小米取值是 mi，还有莫名其妙的update
// version：app 版本号
// uuid：个人设备 id，例：ffffffff - a90e - 706a - 63f7 - ccf973aae5ee 注意：前八位字符一定要相同
// platform：个人设备平台，目前已知：android / ios / web

module.exports = {
  IdList: function() {
    return new Promise(function(resolve, reject) {
      let idList = [];
      wx.request({
        url: URL_IDLIST,
        success: (res) => {
          if (res.statusCode == 200) {
            console.log("===one.js IdList: 调用'获取发布时间id'API成功！ " + res.data.data);
            idList.push(res.data.data);
            resolve(idList);
          }
        }
      })
    })
  },
  OneList: function(id) {
    let url_oneList = "http://v3.wufazhuce.com:8000/api/onelist/" + id + "/0?channel=wdj&version=4.0.2&uuid=ffffffff-a90e-706a-63f7-ccf973aae5ee&platform=android"
    return new Promise(function(resolve, reject) {
      let oneList = [];
      wx.request({
        url: url_oneList,
        success: (res) => {
          if (res.statusCode == 200) {
            console.log("===one.js OneList: 调用'获取文章列表'API成功！ " + res.data.data);
            oneList.push(res.data.data);
            resolve(oneList);
          }
        }
      })
    })
  },
  ContentInfo: function(contentId) {
    let url_content = "http://v3.wufazhuce.com:8000/api/essay/" + contentId + "?channel=wdj&source=summary&source_id=9261&version=4.0.2&uuid=ffffffff-a90e-706a-63f7-ccf973aae5ee&platform=android";
    return new Promise(function(resolve, reject) {
      let contentInfo = [];
      wx.request({
        url: url_content,
        success:(res)=>{
          if (res.statusCode == 200) {
            console.log("===one.js ContentInfo: 调用'获取文章内容'API成功！ " + res.data.data);
            contentInfo.push(res.data.data);
            resolve(contentInfo);
          }
        }
      })
    })
  }
}