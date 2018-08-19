let API_URL = "http://www.bing.com/HPImageArchive.aspx?format=js&idx=0&";
// n = The no of images u want(u can use Integers),
// mkt = Your location(example:zh-CN、en-US)

module.exports = {
  DailyWallPager: function(n = 8, mkt = "zh-CN") {
    let url = API_URL + "n=" + n + "&mkt=" + mkt;
    return url
  }
}