var commonFn = {	
	//ie6 fixed
	fixIe6 : function(fixedObj,cssPos,maskObj){
		var isIe6 = $.browser.msie && ($.browser.version == "6.0") && !$.support.style;
		if(isIe6){
			fixedIe6(fixedObj,cssPos,maskObj);
		}
		function fixedIe6 (fixedObj,cssPos,maskObj) {
			$("body").addClass("ie6-body");
			var $fixedObjH = fixedObj.height(),
				$fixedObjTop = fixedObj.css("top"),
				$fixedObjBottom = fixedObj.css("bottom"),
				$docH = $(document).height(),
				$screenH = $(window).height(),
				$scrTop = $(window).scrollTop(),
				newPos = 0 ;
			if(maskObj){
			   maskObj.css("height",$docH); 
			} 
			if(cssPos=="top"){
				newPos = parseInt($fixedObjTop)+$scrTop;
			}
			else{
				newPos = ($screenH-parseInt($fixedObjBottom)-$fixedObjH)+$scrTop;
			}
			$(window).bind("scroll",function(){
				$scrTop = $(window).scrollTop();
				if(cssPos == "top"){
					newPos = parseInt($fixedObjTop)+$scrTop;
				}
				else{
					newPos = ($screenH-parseInt($fixedObjBottom)-$fixedObjH)+$scrTop;
				}
				fixedObj.css("top",newPos+"px");
			})
			fixedObj.css("top",newPos+"px");
		}
	},
	showPopup : function(popupHdTit,popupBdShowNode){
		var $modPopup = $(".mod-popup"),
			$popupBox = $(".mod-popup .popup-box"),
			$popupMask = $(".mod-popup .popup-mask"),
			$popupBdChildrenNode = $(".popup-box-bd").children(),
			$popupHdTit = $(".popup-box-hd h3");
		if(typeof popupHdTit === "string"){
			popupHdTit = popupHdTit ?  popupHdTit : "未定义标题";
		}
		else{
			alert("弹出框未设置标题！");
			return;
		}
		$popupBdChildrenNode.hide();
		popupBdShowNode.show();
		var popupBoxW = $popupBox.width(),
			popupBoxH = $popupBox.height(),
			$screenW = $(window).width(),
			$screenH = $(window).height();
		$popupBox.css({
			"left" : ($screenW-popupBoxW)/2+"px",
			"top" : ($screenH-popupBoxH)/2 +"px"
		});
		this.fixIe6($popupBox,"top",$popupMask);
		$popupHdTit.html(popupHdTit);
		$modPopup.css({ // 父级$modPopup的display为none，无法获取$popupBox的高度，需切换visibility的值（visible|hidden）
			"display":"none",
			"visibility":"visible"
		})
		$modPopup.fadeIn("fast");
	},
	closePopup : function(){
		var $modPopup = $(".mod-popup");
		$modPopup.fadeOut("fast",function(){
			$modPopup.css({
				"display" : "block",
				"visibility" : "hidden"
			})
		});
	}
}


