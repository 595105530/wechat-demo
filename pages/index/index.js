const app = getApp();

Page({
  data: {
    longitude: 113.523047,
    latitude: 22.301141,
    showLocation: true,
    scale: 18,
    markers: [{
      id: 1,
      longitude: 113.526105,
      latitude: 22.308397,
      title: "东坑老鹅村",
    }],
    showflag: true,
    showmap:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.mapContext = wx.createMapContext("map");
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  showTheMap:function(e){
    this.setData({
      showmap:!this.data.showmap
    })
    console.log(this.data.showmap)
  },

  hd1: function(e) {
    var that = this
    wx.getSetting({
      success: (res) => {
        console.log("hd1:" + res.authSetting["scope.userLocation"])
        if (res.authSetting["scope.userLocation"]) {
          that.setData({
            showflag: !res.authSetting["scope.userLocation"]
          })
        }
      }
    })

  },
  changeScale: function(e) {
    console.log(e.detail.value)
    this.setData({
      scale: e.detail.value
    })
  },
  getLocation: function(e) {
    console.log("getlocation");
    var that = this;
    wx.getSetting({
      success: (res) => {
        console.log(res.authSetting["scope.userLocation"]);
        if (res.authSetting["scope.userLocation"]) {
          wx.getLocation({
            type: "gcj02",
            success: function(res) {
              that.setData({
                longitude: res.longitude,
                latitude: res.latitude
              })
            },
            fail: function(e) {
              console.log(e.errMsg)
            }
          })
        } else {
          that.setData({
            showflag: !res.authSetting["scope.userLocation"]
          })
          wx.showToast({
            title: '地理位置没有授权',
            duration: 3000,
            icon: "none"
          })
        }
      }
    })
  },
  chooseLocation: function(e) {
    console.log("chooselocation")
    wx.chooseLocation({
      success: function(res) {
        console.log("name:" + res.name + " address:" + res.address + " longitude:" + res.longitude + " latitude:" + res.latitude)
      },
      fail: function(e) {
        console.log(e.errMsg)
        if (e.errMsg == "chooseLocation:fail auth deny") {
          wx.showToast({
            title: '地理位置没有授权',
            duration: 3000,
            icon: "none"
          })
        }

      }
    })
  },
  openLocation: function(e) {
    console.log("openlocation");
    wx.openLocation({
      latitude: 22.282662,
      longitude: 113.515634,
      name: "羽生创作料理",
      address: "奥园广场"
    })
  },
  moveToLocation: function(e) {
    console.log("getCenterLocation");
    this.mapContext.moveToLocation();
  },
  getCenterLocation: function(e) {
    console.log("getCenterLocation");
    this.mapContext.getCenterLocation({
      success: (res) => {
        console.log(res.longitude + " ," + res.latitude)
        wx.showToast({
          title: res.longitude + " ," + res.latitude,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  getRegion: function(e) {
    console.log("getRegion");
    this.mapContext.getRegion({
      success: (res) => {
        var txt = res.southwest.longitude + " ," + res.southwest.latitude +
          " ; " + res.northeast.longitude + " ," + res.northeast.latitude;
        console.log(txt)

        wx.showToast({
          title: txt,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  getScale: function(e) {
    console.log("getScale");
    this.mapContext.getScale({
      success: (res) => {
        console.log(res.scale)
        wx.showToast({
          title: "" + res.scale,
          icon: 'none',
          duration: 1000
        })
      }
    })
  }
})