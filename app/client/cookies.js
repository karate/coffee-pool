
class Cookie {
  static getCookie( name ) {
    var pattern = name + '=';
    var cookieList = document.cookie.split('; ');
    for (var i=0; i< cookieList.length; i++) {
      var cookie = cookieList[i];
      if ( cookie.search( pattern ) === 0) {
        return cookie.substring( pattern.length );
      }
    }
  }
}

export default Cookie;
