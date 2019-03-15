var port1;
chrome.tabs.query({active: true, currentWindow: true},
    function (tabs) {
        port1 = chrome.tabs.connect(//建立通道
            tabs[0].id,
            {name: "scoreport"}//通道名称
        );
    }
);

var s = window.localStorage.getItem("score");
$('select').val(s);

$('select').change(function () {
	var score = $(this).val();
	window.localStorage.setItem("score",score);
	port1.postMessage({"score": score});//向通道中发送消息
});