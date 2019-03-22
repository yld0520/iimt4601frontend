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
			var list = res;
			var list = [];
			var c = {};
			
			c.author = 'test2';
			c.score = 57;
			c.high = 1;
			c.low = 2;
			c.mixed = 3;
			c.very_high = 4;
			c.very_low = 5;
			list.push(c); 
			$.each(list,function(j,b){
				if(b.score > s){
					$('a[reddit_id=reddit_'+b.author+']').parents('.scrollerItem').children(":first").css('background','#fc6161');
					$('a[reddit_id=reddit_'+b.author+']').parent().next().next().append('<span style="background:#fc6161">[Doubtful User]<button high="'+b.high+'" low="'+b.low+'" mixed="'+b.mixed+'" very_high="'+b.very_high+'" very_low="'+b.very_low+'" style="display:none;background: #fff;border: 1px solid #999;padding: 3px 10px;">click for pie chart analysis</button><div class="container" style="width:650px;height:300px;position: absolute;border: 1px solid #999;background: #fff;display:none;"><svg width="100%" height="100%"></svg></div></span>');
					$('a[reddit_id=reddit_'+b.author+']').parent().next().next().find('span').hover(function(){

						$(this).find('button').show();
					},function(){
						$(this).find('button').hide();
						$(this).find('.container').hide()
						$(this).find('g').html('');
					});
					
					$('a[reddit_id=reddit_'+b.author+']').parent().next().next().find('span').find('button').bind('click',function(){
						var X = $(this).offset().left;
						var Y = $(this).offset().top;
						var cw = $(document).width();
						if(X>325){
							$('.container').css('left',X-325);
						}
						if((X+325)>cw){
							$('.container').css('left',cw-670);
						}
						$('.container').css('top',Y+26);
						$(this).parent().find('.container').show()
						var high = $(this).attr('high')
						var low = $(this).attr('low')
						var mixed = $(this).attr('mixed')
						var very_high = $(this).attr('very_high')
						var very_low = $(this).attr('very_low')
						
						var width = 650, height = 300;
					  // create a group to include all information required in the pie chart
					  var main = d3.select('.container svg').append('g').classed('main', true).attr('transform', "translate(" + width/2 + ',' + height/2 + ')');
					  // mimic data
					  var dataset = [
					   {name: 'very_high', value:very_high},
					   {name: 'very_low', value: very_low},
					   {name: 'high', value: high},
					   {name: 'low', value: low},
					   {name: 'mixed', value: mixed}
					  ];
					  // trans original data to pie chart form
					  var pie = d3.layout.pie()
					   .sort(null)
					   .value(function(d) {
						return d.value;
					   });
					  // pie is a function
					  var pieData = pie(dataset);
					  // function required to calculate arc path
					  var radius = 100;
					  var arc = d3.svg.arc()
					   .innerRadius(0)
					   .outerRadius(radius);
					  var outerArc = d3.svg.arc()
					   .innerRadius(1.2 * radius)
					   .outerRadius(1.2 * radius);
					  var oArc = d3.svg.arc()
					   .innerRadius(1.1 * radius)
					   .outerRadius(1.1 * radius);
					  var slices = main.append('g').attr('class', 'slices');
					  var lines = main.append('g').attr('class', 'lines');
					  var labels = main.append('g').attr('class', 'labels');
					  // add arc to the chart（path in g）
					  var arcs = slices.selectAll('g')
					   .data(pieData)
					   .enter()
					   .append('path')
					   .attr('fill', function(d, i) {
						return getColor(i);
					   })
					   .attr('d', function(d){
						return arc(d);
					   });
					  // add text tag
					  var texts = labels.selectAll('text')
					   .data(pieData)
					   .enter()
					   .append('text')
					   .attr('dy', '0.35em')
					   .attr('fill', function(d, i) {
						return getColor(i);
					   })
					   .text(function(d, i) {
						var l=(d.endAngle-d.startAngle)/(2*Math.PI)*100
						return d.data.name+'--'+l.toFixed(2)+'%';
					   })
					   .style('text-anchor', function(d, i) {
						return midAngel(d)<Math.PI ? 'start' : 'end';
					   })
					   .attr('transform', function(d, i) {
						// find the center of outer arc
						var pos = outerArc.centroid(d);
						// change the x coordinates of text tags
						pos[0] = radius * (midAngel(d)<Math.PI ? 1.5 : -1.5);	
						return 'translate(' + pos + ')';
					   })
					   .style('opacity', 1);
					 
					  var polylines = lines.selectAll('polyline')
					   .data(pieData)
					   .enter()
					   .append('polyline')
					   .attr('points', function(d) {
						return [arc.centroid(d), arc.centroid(d), arc.centroid(d)];
					   })
					   .attr('points', function(d) {
						var pos = outerArc.centroid(d);
						pos[0] = radius * (midAngel(d)<Math.PI ? 1.5 : -1.5);
						return [oArc.centroid(d), outerArc.centroid(d), pos];
					   }).style('opacity', 0.5);
					   
					   
					   function midAngel(d) {
						  return d.startAngle + (d.endAngle - d.startAngle)/2;
						  }
						  function getColor(idx) {
						  var palette = [
						   '#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
						   '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
						   '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
						   '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
						  ]
						  return palette[idx % palette.length];
						  }
					   
					})
				}else{
					$('a[reddit_id=reddit_'+b.author+']').parents('.scrollerItem').children(":first").css('background','#dee1e7');
					$('a[reddit_id=reddit_'+b.author+']').parent().next().next().find('span').remove();
				}
			});
		});
	}
}


chrome.runtime.onConnect.addListener(function (port) {

    if(port.name == "reddit"){

        port.onMessage.addListener(function (msg) {
            if(msg['switch'] == "on"){
                window.localStorage.setItem("switch","on");
				getUserList();
            }else{
				window.localStorage.setItem("switch","off");
			}
        });
    }else if(port.name == "scoreport"){
		port.onMessage.addListener(function (msg) {
            window.localStorage.setItem("score",msg['score']);
			var status = window.localStorage.getItem("switch");
			if(status == 'on'){
				getUserList();
			}
        });
	}

});


$(function(){
	$('head').append('<style>polyline {fill: none;stroke: #000000;stroke-width: 2px;stroke-dasharray: 5px;}</style>');
	var status = window.localStorage.getItem("switch");
	if(status == 'on'){
        setInterval(getUserList(), 1000)
	}
	
});
