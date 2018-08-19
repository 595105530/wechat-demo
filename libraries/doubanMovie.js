let API_URL = "https://api.douban.com/v2/movie/";
let API_URL1 ="https://douban.uieee.com/v2/movie/"; //某大佬搭建的代理，可用

module.exports = {
  doubanMovie: function(infoType) {
    let url = API_URL1 + infoType;
    return url
  }
}