const doubanMovie = require("../../libraries/doubanMovie.js");
Page({
  data: {
    movieId: "",
    movieInfo: [],
    trailers: [],//预告片数组
    trailerIndex: 0,
  },
  onLoad(option) {
    //console.log("option.movieId" + option.movieId)
    this.getMovieInfo(option.movieId);
    // this.videoContext = wx.createVideoContext("trailer");
  },
  getMovieInfo: function(movieId) {
    let url = doubanMovie.doubanMovie("subject") + "/" + movieId;
    console.log("url: " + url)
    wx.request({
      url: url,
      header: {
        "Content-Type": "json"
      },
      success: (res) => {
        if (res.statusCode == 200) {
          let list = [];
          list.push(res.data)
          this.setData({
            "movieInfo": list
          });
          // this.setData({
          //   "trailers": this.data.movieInfo[0].trailer_urls
          // });
          wx.setNavigationBarTitle({
            title: "《" + this.data.movieInfo[0].title + "》",
          })
        } else {
          wx.showToast({
            title: '获取电影列表失败 stautsCode:' + res.statusCode,
            duration: 1000,
          })
        }
      }
    })
  }

})