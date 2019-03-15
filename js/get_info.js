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
        callback(xhr.responseText);
    }
    xhr.send();
}

var port;
chrome.tabs.query({active: true, currentWindow: true},
    function (tabs) {
        port = chrome.tabs.connect(//建立通道
            tabs[0].id,
            {name: "reddit"}//通道名称
        );
        
    }
);

//alert(document.getElementById('test').className);
$(document).ready(function () {
	var status = window.localStorage.getItem("switch");
	//alert(status);
	if(status == 'on'){
		$('#toggle-button').prop('checked',true)
		$('.status-name').html('Verifier Enabled!');
	}else{
		$('#toggle-button').prop('checked',false)
		$('.status-name').html('Verifier Disabled!');
	}
    $('.button-label').click(function () {
        if($('#toggle-button').prop('checked') == true){
			window.localStorage.setItem("switch","off");
			$('.status-name').html('Verifier Disabled!');
			port.postMessage({"switch": "off"});//向通道中发送消息
		}else{
			window.localStorage.setItem("switch","on");
			$('.status-name').html('Verifier Enabled!');
			port.postMessage({"switch": "on"});//向通道中发送消息
		}
    });

});


