window.localStorage.setItem("switch","on");
window.localStorage.setItem("score",50); //default status 
// 通用网络请求函数
function httpRequest(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            callback(xhr.responseText);
        }
    }
    xhr.onerror = function () {
        callback(faxhr.responseTextlse);
    }
    xhr.send();
}
