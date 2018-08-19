let API_URL = "https://free-api.heweather.com/s6/weather/now" //普通用户接口
/* username:用户ID，
 key:认证key，*/
const username = "HE1807301507561540";
const key = "c3b7382d89e646908c3c28ce513e3593";

module.exports = {
  weather_now:function(location){
    let url = API_URL+"?key="+key+"&location="+location;
    return url;
  }
  
};