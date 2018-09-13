	
	// svg
	function svgFn(options){
		var $dataMonth = $(".data-month"),	
			$dataMonthItem = $dataMonth.find(".data-month-item"),
			$dataMonthItemW = $dataMonthItem.width(),
			$chartBox = $(".chart-box"),
			$chartBoxH = $chartBox.height(),
			arrLineX = [],
			arrLineY = [],
			arrCircleX = [],
			arrCircleY = [],
			defaultInfo = {
				chartData:[
					{"xTitle":"一月","yVal":"10"},
					{"xTitle":"二月","yVal":"10"},
					{"xTitle":"三月","yVal":"10"},
					{"xTitle":"四月","yVal":"10"},
					{"xTitle":"五月","yVal":"10"}
				]
			},
			tempArrY = [],
			bFirst = true/***改***/;
		
		var options = $.extend(defaultInfo.chartData, options.chartData); 
	
		$.each(options, function(index, item) {
			tempArrY.push(item.yVal);
		});
		
		// 按比例显示纵坐标
		var tempMaxH = Math.max.apply(null,tempArrY);
			scale=tempMaxH==0?1:($chartBoxH-20)/tempMaxH;
		
		//生成图形父容器
		var $svgBox = $(".svg-box"),
			$mySvg = $(".my-svg"),
			$dataCircle = $(".svg-circle");
		$svgBox.css("height",$chartBoxH+"px");
	
		// 生成每个数据圆点
		$dataMonthItem.each(function(i){
			var dataX = options[i].xTitle,
				dataY = options[i].yVal;
			$dataCircle.eq(i).attr("data-x",dataX);
			$dataCircle.eq(i).attr("data-y",dataY);
		})
	
		
		var $dataCircleW = $dataCircle.width(),
			$dataCircleH = $dataCircle.height();
		
		arrCircleX = $dataMonthItem.map(function(index,item){
			var circleDis = $(item).position().left-$dataMonth.position().left;
			return circleDis+$dataMonthItemW/2+5;
		}).get();
		
		arrCircleY = $.map(tempArrY,function(item){
			if(item==0){
				return $chartBoxH-2;
			}
			else{
				return $chartBoxH+5-item*scale;
			}
			
		});
	
		$.each($dataCircle,function(index,item){
			$(item).attr("cx",arrCircleX[index]-5);
			$(item).attr("cy",arrCircleY[index]-5);
		})	
		
		//生成数据提示框  
		var $dataLayer = $(".svg-layer"),
			$layerKey = $(".rect-key"),
			$layerVal = $(".rect-val");
			
		
		// 设置每个数据圆点的位置-鼠标滑过效果
		$dataCircle.hover(
			function(){
				var index = $dataCircle.index($(this));
				$(this).attr("r",8); 
				$(this).attr("fill","#8dd7f7");
				$layerKey.text($(this).attr("data-x"));
				$layerVal.text($(this).attr("data-y"));
				var posX = $(this).attr("cx")/1,
					posY = $(this).attr("cy")/1;
				if(posY>$chartBoxH/2){
					if(index==0){
						$dataLayer.show().attr({"class":"svg-layer svg-layer-down","transform":"translate("+(posX-20)+","+(posY-50)+")"});
					}
					else if(index==$dataCircle.size()-1){
						$dataLayer.show().attr({"class":"svg-layer svg-layer-down","transform":"translate("+(posX-30)+","+(posY-55)+")"});
					}
					else{
						$dataLayer.show().attr({"class":"svg-layer svg-layer-down","transform":"translate("+(posX-25)+","+(posY-55)+")"});
					}	
				}
				else{
					if(index==0){
						$dataLayer.show().attr({"class":"svg-layer svg-layer-up","transform":"translate("+(posX-20)+","+(posY+15)+")"});
					}
					else if(index==$dataCircle.size()-1){
						$dataLayer.show().attr({"class":"svg-layer svg-layer-up","transform":"translate("+(posX-30)+","+(posY+15)+")"});
					}
					else{
						$dataLayer.show().attr({"class":"svg-layer svg-layer-up","transform":"translate("+(posX-25)+","+(posY+15)+")"});	
					}
				}
			},
			function(){	
				$(this).attr("r",5);
				$(this).attr("fill","#fff");
				$dataLayer.hide();	
			}
		)
		
		// 生成曲线图
		arrLineX = $dataMonthItem.map(function(index,item){
			return $(item).position().left-$dataMonth.position().left+$dataMonthItemW/2;
		}).get();
		
		arrLineY = $.map(tempArrY,function(item){
			if(item==0){
				return $chartBoxH-7;
			}
			else{
				return $chartBoxH-item*scale;
			}			
		});
		
		var linePoints = "";
		
		$.each(arrLineX,function(index,item){
			if(bFirst){ /***改***/
				linePoints+="M"+item+" "+arrLineY[index]+" ";
				bFirst=false;
			}
			else{
				linePoints+="L"+item+" "+arrLineY[index]+" ";
			}
		})
	
		$(".chart-line").attr("d",linePoints);
		$(".loading-tips").hide();
		$svgBox.show();
	}
	
	
	function vmlFn(options){
		var $dataMonth = $(".data-month"),	
			$dataMonthItem = $dataMonth.find(".data-month-item"),
			$dataMonthItemW = $dataMonthItem.width(),
			$chartBox = $(".chart-box"),
			$chartBoxH = $chartBox.height(),
			arrLineX = [],
			arrLineY = [],
			arrCircleX = [],
			arrCircleY = [],
			defaultInfo = {  // 默认参数
				chartData:[
					{"xTitle":"一月","yVal":"10"},
					{"xTitle":"二月","yVal":"10"},
					{"xTitle":"三月","yVal":"10"},
					{"xTitle":"四月","yVal":"10"},
					{"xTitle":"五月","yVal":"10"}
				]
			},
			tempArrY = [];
	
		var options = $.extend(defaultInfo.chartData, options.chartData); 
		
		$.each(options, function(index, item) {
			tempArrY.push(item.yVal);
		});
		
		// 按比例显示纵坐标
		var tempMaxH = Math.max.apply(null,tempArrY),
			scale=tempMaxH==0?1:($chartBoxH-20)/tempMaxH;;
		
		//生成图形父容器
		var $vmlBox = $("<div class='vml-box'/>");
		$vmlBox.appendTo($chartBox);
		$vmlBox.css("height",$chartBoxH+"px");
		
		// 生成每个数据圆点
		$dataMonthItem.each(function(i){
			var dataX = options[i].xTitle,
				dataY = options[i].yVal;
			var $vmlCircle = $("'<v:oval class='vml-circle' fillcolor='#fff' strokecolor='#F60' strokeWeight='1.5' data-x='"+dataX+"' data-y='"+dataY+"'/>'");
			$vmlCircle.appendTo($vmlBox);
		})
		
		var $dataCircle = $(".vml-circle"),
			$dataCircleW = $dataCircle.width(),
			$dataCircleH = $dataCircle.height();
		
		arrCircleX = $dataMonthItem.map(function(index,item){
			var circleDis = $(item).position().left-$dataMonth.position().left;
			return circleDis +$dataMonthItemW/2-Math.floor($dataCircleW/2)+1;
		}).get();
		
		arrCircleY = $.map(tempArrY,function(item){
			if(item==0){
				return -2;
			}
			else{
				return item*scale-6;
			}	
		});
	
		$.each($dataCircle,function(index,item){
			$(item).css({"left":arrCircleX[index]+"px","bottom":arrCircleY[index]+"px"});	
		})	
		
		//生成数据提示框
		var $layerTips = $("<div class='vml-tips' />");		
		$layerTips.html("<span class='rect-key'></span><span style='display:block;line-height:22px;'><span class='rect-val' style='color:red;'></span>M</span>")
		$layerTips.appendTo($vmlBox);
		var $layerKey = $(".rect-key"),
			$layerVal = $(".rect-val");
		
		// 设置每个数据圆点的位置-鼠标滑过效果
		$dataCircle.hover(
			function(){
				$(this).css({"width":$dataCircleW+3+"px","height":$dataCircleH+3+"px"});
				$layerKey.html($(this).attr("data-x"));
				$layerVal.html($(this).attr("data-y"));
				var pos=$(this).position();
				if(pos.top>$chartBoxH/2){
					$layerTips.show().css({"left":pos.left-16+"px","top":pos.top-50+"px"});	
				}
				else{
					$layerTips.show().css({"left":pos.left-16+"px","top":pos.top+24+"px"});	
				}
			},
			function(){	
				$(this).css({"width":$dataCircleW-3+"px","height":$dataCircleH-3+"px"});
				$layerTips.hide();	
			}
		)
		
		// 生成曲线图
		arrLineX = $dataMonthItem.map(function(index,item){
			return $(item).position().left-$dataMonth.position().left+$dataMonthItemW/2;
		}).get();
		
		arrLineY = $.map(tempArrY,function(item){
			if(item==0){
				return $chartBoxH-6;
			}
			else{
				return $chartBoxH-item*scale;
			}		
		});
		
		var linePoints = "";
		
		$.each(arrLineX,function(index,item){
			linePoints+=item+","+arrLineY[index]+" ";
		})
		
		var $vmlLine = $("'<v:PolyLine class='vml-line' filled='false' strokeweight='2' strokecolor='#ccc' Points='"+linePoints+"'/>'");
		$vmlLine.appendTo($vmlBox);
		
		$(".loading-tips").hide();
		$vmlBox.show();
	}

