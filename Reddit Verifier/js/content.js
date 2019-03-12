function getUserList(){
	var doms = $('.gWXVVu');
	var names = [];
	$.each(doms,function(i,o){
		names.push($(o).html().substring(2));
		$(o).attr('reddit_id','reddit_'+$(o).html().substring(2));
	});
	
	//alert('获取到页面数据：'+names.join(','));
	if(names.length > 0){
		var s = window.localStorage.getItem("score");
		$.post("",{data:names},function(res){
			var list = res.list;
			var list = [];
			var c = {};
			
			c.userName = 'test2';
			c.socre = 57;
			list.push(c);
			$.each(list,function(j,b){
				if(b.socre < s){
					$('a[reddit_id=reddit_'+b.userName+']').parents('.scrollerItem').children(":first").css('background','#fc6161');
					$('a[reddit_id=reddit_'+b.userName+']').parent().next().next().append('<span style="background:#fc6161">[Doubtful User]</span>');
				}else{
					$('a[reddit_id=reddit_'+b.userName+']').parents('.scrollerItem').children(":first").css('background','#dee1e7');
					$('a[reddit_id=reddit_'+b.userName+']').parent().next().next().find('span').remove();
				}
			});
		});
	}
}


chrome.runtime.onConnect.addListener(function (port) {//建立监听

    if(port.name == "reddit"){//判断通道名称

        port.onMessage.addListener(function (msg) {//监听消息
            if(msg['switch'] == "on"){
                window.localStorage.setItem("switch","on");
				getUserList();
            }else{
				window.localStorage.setItem("switch","off");
			}
        });
    }else if(port.name == "scoreport"){
		port.onMessage.addListener(function (msg) {//监听消息
            window.localStorage.setItem("score",msg['score']);
			var status = window.localStorage.getItem("switch");
			if(status == 'on'){
				getUserList();
			}
        });
	}

});


$(function(){
	var status = window.localStorage.getItem("switch");
	if(status == 'on'){
		getUserList();
	}
	
});
