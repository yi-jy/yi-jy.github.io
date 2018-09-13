(function(){

	var toolbar = element.byId("#toolbar"),
		rteMain = element.byId("#rte-main"),
		toolItem = element.byClass(".item",toolbar),
		toolCurBtn = element.byClass(".current",toolbar),
		toolSelectBtn = element.byClass(".select-btn",toolbar),
		toolSelectLayer = element.byClass(".layer",toolbar),
		colorItem = element.byClass(".color-item",toolbar)[0],
		bgColorItem = element.byClass(".bgcolor-item",toolbar)[0],
		colorItemInput = element.byId("#color-input"),
		bgcolorItemInput = element.byId("#bgcolor-input"),
		rteTextarea = element.byId("#rte-textarea"),
		rtePopup = element.byId("#ret-popup"),
		rtePopupBoxHd = element.byId("#popup-box-bd"),
		closeRtePopup = element.byId("#close-popup"),
		subMenuShow = false,
		symbolAddEvent = emoticonAddEvent = true;

	var iframe = document.createElement("iframe");
    iframe.style.cssText = "width:100%;height:100%;border:none;";
    rteMain.appendChild(iframe);
    var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
	// 获取文本或html内容  iframeDocument.innerText(innerHTML)
    iframeDocument.designMode = "on";
    iframeDocument.open();
    iframeDocument.write("<html><head></head><body style='word-break:break-all;'></body></html>");
    iframeDocument.close();

	var command = {
		insertImage : function(ele){
			var tempValue = prompt("请输入图片链接:", "http://");
			iframeDocument.body.innerHTML += "<img src='"+tempValue+"'/>";
			element.removeClass(ele.parentNode.parentNode.parentNode,"selected");
		},
		createLink : function(ele){
			var tempValue = prompt("请输入链接地址:", "http://");
			iframeDocument.body.innerHTML += "<a href='"+tempValue+"'>" + tempValue + "</a>";
			element.removeClass(ele.parentNode.parentNode.parentNode,"selected");
		},
		insertTime : function(ele){
			var time = new Date();
			var tempValue = "　" + time.getFullYear() + "-" + (time.getMonth()+1) + "-" + time.getDate() + " 星期" + "日一二三四五六".charAt(time.getDay()) + " " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + "　";
			iframeDocument.body.innerHTML += tempValue ;
			element.removeClass(ele.parentNode.parentNode.parentNode,"selected");
		},
		html : function(ele){
			if(!element.hasClass(ele.parentNode,"selected")){
				rteTextarea.innerHTML = iframeDocument.body.innerHTML;
				element.show(rteTextarea);
			}
			else{
				element.hide(rteTextarea);
			}
		},
		preview : function(){
			// 低版本ie不支持window.open().document.write(iframeDocument.body.innerHTML)，采用弹框形式。
			element.show(rtePopup);
			rtePopupBoxHd.innerHTML = iframeDocument.body.innerHTML;
		},
		newDoc : function(){
			confirm("新建会删除当前编辑内容，确定要新建？") && (rteTextarea.innerHTML = iframeDocument.body.innerHTML = "");
		},
		save : function(){
			if(!+[1,]){
				iframeDocument.execCommand("saveas",false,"document.html");
			}
			else{
				alert("对不起，当前浏览器出于安全机制禁止保存，你可以尝试手动保存或使用IE浏览器！");
			}	
		},
		insertFace : function(ele){
			var emoticon = element.byClass(".emoticon",ele.parentNode)[0];
			emoticonAddEvent && eventUnit.addEvent(emoticon,"click",function(e){
				var e=window.event || e,
					target= e.target || e.srcElement;
				if(target.nodeName.toLowerCase()==="img"){
					iframeDocument.body.innerHTML += "<img src='"+target.getAttribute("src")+"'/>";
				}
				element.removeClass(ele.parentNode,"selected");
				emoticonAddEvent = false;
			});	
		},
		insertSymbol : function(ele){
			var symbol = element.byClass(".symbol",ele.parentNode)[0];
			symbolAddEvent && eventUnit.addEvent(symbol,"click",function(e){
				var e= window.event || e,
					target= e.target || e.srcElement;
				if(target.nodeName.toLowerCase()==="li"){
					tempValue = target.innerHTML;
					iframeDocument.body.innerHTML += tempValue;
				}
				element.removeClass(ele.parentNode,"selected");
				symbolAddEvent = false;
			});
		},
		insertTable : function(ele){
			var tableInfo = element.byClass(".table-info",ele.parentNode)[0],
				tableRow = element.byClass(".tab-row",tableInfo)[0],
				tableCol = element.byClass(".tab-col",tableInfo)[0],
				tableConfirm = element.byClass(".tab-confirm",tableInfo)[0],
				// 页面的样式对于iframe里的内容，无法生效
				tempValue = "<table border='1' style='border-collapse:collapse;border-spacing:0;line-height:30px;'>";
			eventUnit.addEvent(tableConfirm,"click",function(){
				element.removeClass(this.parentNode.parentNode.parentNode,"selected");
				if( parseInt(tableRow.value) >=1 && parseInt(tableCol.value)>=1 ){
					for(var i=0 ; i<parseInt(tableRow.value) ; i++){
						tempValue += "<tr>";
						for(var j=0 ; j<parseInt(tableCol.value) ; j++){
							tempValue +="<td style='padding:0 20px'>&nbsp;</td>";
						}
						tempValue += "</tr>";
					}
					tempValue += "</table>";
					iframeDocument.body.innerHTML += tempValue;	
				}
				else{
					alert("请确认输入正确的数字！");
				}
			});
		}
	}
	
	var rte = {
		commandHandle : function(ele){
			for(var i=0,l=ele.length; i<l ; i++){
				// 在IE浏览器中，当input获得焦点时，点击有unselectable="on"属性的标签时，不会触发onblur事件
				ele[i].setAttribute("unselectable" , "on");
				eventUnit.addEvent(ele[i],"click",function(){
					iframe.contentWindow.focus();
					var dataCommand = this.getAttribute("data-command"),
						selfCommand = this.getAttribute("self-command");
					if(dataCommand){
						var tempParent = this.parentNode.parentNode.parentNode;
						switch (dataCommand){
							case "fontsize" :
								var tempValue = this.getAttribute("data-value");
								iframeDocument.execCommand(dataCommand,false,tempValue);
								
							default :
								iframeDocument.execCommand(dataCommand);	
						}
						(tempParent) && element.removeClass(tempParent,"selected");
					}
					if(selfCommand){
						switch(selfCommand){
							case "insertimage" : // 插入图片
								command.insertImage(this);	
								break;
							
							case "createlink" : // 插入链接
								command.createLink(this);
								break;
							
							case "inserttime" : // 插入日期
								command.insertTime(this);
								break;
							
							case "html" : // 源代码
								command.html(this);
								break;
							
							case "preview" : // 预览
								command.preview();
								break;
							
							case "new" : // 新建
								command.newDoc();
								break;
							
							case "save" : // 保存
								command.save();
								break;
							
							case "insertface" : // 插入表情
								command.insertFace(this);
								break;
							
							case "insertsymbol" : // 插入符号
								command.insertSymbol(this);
								break;
							
							case "inserttable" : // 插入表格
								command.insertTable(this);
								break;
							
						}	// end switch
					}	
				});
			}
		},
		menuLayerShow : function(){
			for(var i=0 , len = toolCurBtn.length ; i<len ; i++){
				eventUnit.addEvent(toolCurBtn[i],"mouseover",function(){
					element.addClass(this.parentNode,"hover");
				});
				eventUnit.addEvent(toolCurBtn[i],"mouseout",function(){
					element.removeClass(this.parentNode,"hover");
					if(element.hasClass(this.parentNode,"selected")){
						return ;
					}
					element.removeClass(this.parentNode,"selected");
				});
				eventUnit.addEvent(toolCurBtn[i],"click",function(){
					var selfCommand = this.getAttribute("self-command");
					if(selfCommand && (selfCommand === "preview" || selfCommand === "new" || selfCommand === "save")){
						return;
					}
					if(!element.hasClass(this.parentNode,"selected")){
						element.addClass(this.parentNode,"selected");
					}
					else{
						element.removeClass(this.parentNode,"selected");
					}	
				});
			}
		}
	}
	
	function colorCommand (commandType,commandVal,classEle){
		iframe.contentWindow.focus();
		iframeDocument.execCommand(commandType,false,commandVal);
		element.removeClass(classEle,"selected");
	}
	
	eventUnit.addEvent(closeRtePopup,"click",function(){
		element.hide(rtePopup);
	});
	
	// ie6 三位数的颜色，不支持 
	new colorTake(colorItem,colorItemInput,function(){
		colorCommand("forecolor",colorItemInput.value,colorItem);
	});
	new colorTake(bgColorItem,bgcolorItemInput,function(){
		colorCommand("backcolor",bgcolorItemInput.value,bgColorItem);
	});
	
	rte.commandHandle(toolCurBtn);
    rte.commandHandle(toolSelectBtn);
	rte.menuLayerShow();

})()