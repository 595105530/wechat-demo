const bing = require("../../libraries/bing.js");
const hefengWeather = require("../../libraries/hefengWeather.js");
const doubanMovie = require("../../libraries/doubanMovie.js");
const one = require("../../libraries/one.js");
var App = getApp();
var that = this;
Page({
  data: {
    //顶部轮播图片
    images: [],
    //天气栏目
    weatherLocation: "珠海市",
    weatherInfo: [],
    //电影栏目
    moviesInTheaters: [],
    moviesComingSoon: [],
    //阅读栏目
    dateIndex: 0,
    idList: [],
    oneList: [],
    //分栏bar
    navList: [{
        id: 0,
        title: "天气",
      isCurr: true,
        hasLoad: false,
      }, {
        id: 1,
        title: "电影",
        isCurr: false,
        hasLoad: false,
      }, {
        id: 2,
        title: "阅读",
        isCurr: false,
        hasLoad: false,
      }
      // , {
      //   id: 3,
      //   title: "设置",
      //   isCurr: false,
      // }
    ],
    index: 0,
  },
  onLoad: function(o) {
    this.getDailyWallPaper();
    this.loadTab(); //遍历分页数组检测当天打开的tab页加载内容
  },

  /*获取页面内容 */
  getDailyWallPaper: function() { //从Bing API获取DailyWallPaper数据，url、title存入data的images数组中
    var that = this;
    wx.request({
      url: bing.DailyWallPager(),
      success: (res) => {
        // console.log(res.data.images + " ," + res.header + " ," + res.statusCode)
        if (res.statusCode == 200) {
          let resource = res.data.images;
          let list = [],
            url, title;
          for (let i = 0; i < resource.length; i++) {
            url = "http://www.bing.com/" + res.data.images[i].url;
            title = res.data.images[i].copyright;
            // console.log("url: " + url + " title: " + title);
            list.push({
              url,
              title
            });
          }
          that.setData({ //写入data
            images: list
          })
          console.log("====bing每日图片获取成功====")
        }
      },
      fail: (res) => {
        App.showToast("Bing每日图加载失败", 1000)
      }
    })
  },
  getWether: function(location) { //根据城市名"珠海市"获取天气
    var that = this;
    wx.request({
      url: hefengWeather.weather_now(location),
      success: (res) => {
        if (res.statusCode == 200) {
          // console.log(res.data.HeWeather6[0].now)
          let weatherInfo = res.data.HeWeather6[0].now;
          this.setData({
            "weatherInfo": weatherInfo
          })
          console.log("====getWether成功====" + res.statusCode)
          App.showToast('天气刷新成功', "success", 500);
        } else {
          App.showToast('天气获取失败');
        }
      }
    })
  },
  cityChange: function(e) { //通过picker取得地址，调用getWeather刷新天气
    console.log("cityChange.value:" + e.detail.value)
    let location = e.detail.value.slice(2); //将返回的字符串分割，只取最后
    console.log("location:" + location)
    this.setData({
      "weatherLocation": e.detail.value,
    })
    this.getWether(location)
  },
  getMovieInfo: function(movieInfoType) { //取得电影列表
    console.log("getMovieInfo:" + doubanMovie.doubanMovie(movieInfoType))
    wx.request({
      url: doubanMovie.doubanMovie(movieInfoType),
      header: {
        "Content-Type": "json"
      },
      data: {
        city: "珠海"
      },
      success: (res) => {
        //console.log("getMovieInfo success: " + res.data.subjects)
        switch (movieInfoType) {
          case "in_theaters":
            this.setData({
              "moviesInTheaters": res.data.subjects
            });
            break;
          case "coming_soon":
            this.setData({
              "moviesComingSoon": res.data.subjects
            });
            break;
        }

      }
    })
  },
  navigateToDetail_movie: function(e) { //携带电影ID跳转到电影详情页
    //console.log("e.currentTarget.dataset.movieId: "+e.currentTarget.dataset.movieId);
    let movieId = e.currentTarget.dataset.movieId;
    wx.navigateTo({
      url: '../movieDetail/movieDetail?movieId=' + movieId,
    })
  },

  getIdList: function() { //取得id列表,更新文章列表
    var that = this;
    let dateIndex = this.data.dateIndex;
    //console.log("===getIdList: dateIndex: " + dateIndex)
    one.IdList().then((idList) => {
      console.log("===test.js idList: " + idList)
      this.setData({
        "idList": idList,
      })
    }).then(() => {
      that.getOneList(dateIndex);
    })
  },
  getOneList: function(dateIndex) { //取得文章列表
    let idList = this.data.idList[0];
    //console.log("===test.js getOneList: " + idList);
    one.OneList(idList[dateIndex]).then((oneList) => {
      console.log("===test.js getOneList: '获取文章列表成功'" + oneList)
      this.setData({
        "oneList": oneList,
      })
    })
  },

  navigateToDetail_read: function(e) { //携带dataset contentId跳转到文章详情页
    // console.log("navigateToDetail_read: " + e.currentTarget.dataset.contentId)
    let contentId = e.currentTarget.dataset.contentId;
    wx.navigateTo({
      url: '/pages/readDetail/readDetail?contentId=' + contentId,
    })
  },
  changePostDate: function(e) { //改变dateIndex刷新文章列表
    var that = this;
    let direction = e.currentTarget.dataset.direction;
    let dateIndex = this.data.dateIndex;
    let length = this.data.idList[0].length;
    console.log("direction:" + direction);
    console.log("length:" + length);
    switch (direction) {
      case "go":
        if (dateIndex <= length && dateIndex > 0) {
          dateIndex -= 1;
          console.log("datebtnTap: dateIndex-=1");
          this.setData({
            "dateIndex": dateIndex
          })
          that.getOneList(dateIndex);
        } else {
          App.showToast("已经是最新的文章。", "none")
        }
        break;
      case "back":
        if (dateIndex < length - 1) {
          dateIndex += 1;
          console.log("datebtnTap: dateIndex+=1");
          this.setData({
            "dateIndex": dateIndex
          })
          that.getOneList(dateIndex);
        } else {
          App.showToast("已经是最早的文章。", "none")
        }
        break;
    }
    console.log("dateIndex: " + dateIndex)
  },

  /*分栏相关 */
  navBarTap: function(e) { //navBar切换
    this.changeIndex(e);
  },
  navListItemChange: function(e) {
    this.changeIndex(e);
  },
  changeIndex: function(e) { //navBar和swiper同步改变
    let list = this.data.navList;
    let index;
    if (e.type == "tap") { //取得index
      index = e.target.id;
    } else if (e.type == "change") {
      index = e.detail.current
    }
    if (index != this.data.index) { //如果index改变了，更新navList
      for (let i = 0; i < list.length; i++) {
        list[i].isCurr = false;
      }
      list[index].isCurr = true;
    }
    this.setData({
      "navList": list,
      "index": index,
    })
    this.loadTab();
  },
  loadTab: function() {  //切换分栏时检测tab页是否加载
    var that = this;
    let navList = this.data.navList;
    //console.log("===loadTab: navList: " + navList)
    for (let i = 0; i < navList.length; i++) {
      //console.log("===loadTab: navList[i].hasLoad: " + navList[i].hasLoad)
      if (navList[i].isCurr == true && navList[i].hasLoad == false) {
        navList[i].hasLoad = true;
        switch (i) {
          case 0:
            that.getWether(this.data.weatherLocation);
            break;
          case 1:
            that.getMovieInfo("in_theaters");
            that.getMovieInfo("coming_soon");
            break;
          case 2:
            that.getIdList();
            break;
        }
      }
    }
    that.setData({
      "navList": navList,
    })
  }
})

