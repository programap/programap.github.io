modelfilestrs['connectorHotspotImage'] = hereDoc(function(){/*!
<script type="text/javascript">

	// HTML5 version currently ignores imageTransition optional property
	// These properties are currently ignored as they're for desktop Xerte only:	reportTitle, pageLabel, titleLabel, idLabel
	
	// pageChanged & sizeChanged functions are needed in every model file
	// other functions for model should also be in here to avoid conflicts
	var connectorHotspotImage = new function() {
		var	$img,
			$pageContents,
		    options;
		
		// function called every time the page is viewed after it has initially loaded
		this.pageChanged = function() {
			$img = $("#image");
			$pageContents = $("#pageContents");
			
			$("#pageContents .selected").removeClass("selected");
			$("#pageContents .highlighted").removeClass("highlighted");
			$("#feedback").html("");
			$(".x_popupDialog").parent().detach(); // remove any open dialogs
			if (x_currentPageXML.getAttribute("highlight") == "true") {

				$("area").mapster('select');
			}
            else {
                // Keep unselected
                $("area").mapster('deselect');
            }
		};
		
		// function called every time the size of the LO is changed
		this.sizeChanged = function() {
            $img.css({
				"opacity"	:0,
				"filter"	:'alpha(opacity=0)'
			});
			this.resizeImg(false);
		};
		
		this.init = function() {
			$img = $("#image");
			$pageContents = $("#pageContents");

			if (x_currentPageXML.getAttribute("textWidth") == "none") {
				$("#mainText").remove();
				$("#pageContents").css("text-align", "center");
				// Remove panel
				//$("#panel").removeClass("inline");
				$("#panel").removeClass("panel");
			} else {
				$("#mainText").html(x_addLineBreaks(x_currentPageXML.getAttribute("text")));
				
				if (x_currentPageXML.getAttribute("align") == "Right") {
					$("#panel").addClass("left");
				} else {
					$("#panel").addClass("right");
				}
			}
			
			// set up dialog object for later if it hasn't already been set up on another page of this type
			// xenith.js contains the function used for creating/attaching dialogs - x_openDialog()
			var newDialog = true;
			$(x_dialogInfo).each(function(i) {
				if (this.type == "connectorHotspotImage") {
					newDialog = false;
				}
			});
			if (newDialog == true) {
				var dialog = new Object();
				dialog.type = "connectorHotspotImage";
				dialog.built = false;
				x_dialogInfo.push(dialog);
			}
			
			// deprecated
			
			
			$img
				.css({
						"opacity"	:0,
						"filter"	:'alpha(opacity=0)'
				})
				.one("load", function() {
					connectorHotspotImage.resizeImg(true);
					
					// call this function in every model once everything's loaded
					x_pageLoaded();
				})
				.attr({
					"src"	:x_evalURL(x_currentPageXML.getAttribute("url")),
					"alt"	:x_currentPageXML.getAttribute("tip"),
					"usemap":"#hsHolder_map"
				})
				.each(function() { // called if loaded from cache as in some browsers load won't automatically trigger
					if (this.complete) {
						$(this).trigger("load");
					}
				});
			
			// get feedback text if authorSupport is on
			if (x_params.authorSupport == "true") {
				$pageContents.data("authorSupport", x_currentPageXML.getAttribute("notFoundMessage") != undefined ? x_currentPageXML.getAttribute("notFoundMessage") : "could not be found in this project.");
			} else {
				$("#feedback").remove();
			}
			
			// get info about dialog popups ready
			var dialogPos = {left:"center", top:"middle", width:undefined, height:undefined};
			if (x_currentPageXML.getAttribute("popUpHAlign") != undefined && x_currentPageXML.getAttribute("popUpHAlign") != "") {
				dialogPos.left = x_currentPageXML.getAttribute("popUpHAlign");
			}
			if (x_currentPageXML.getAttribute("popUpVAlign") != undefined && x_currentPageXML.getAttribute("popUpVAlign") != "") {
				dialogPos.top = x_currentPageXML.getAttribute("popUpVAlign");
			}
			$pageContents.data({
				"dialogPos":dialogPos,
				"continueBtnTxt":x_currentPageXML.getAttribute("continueBtnTxt") != undefined ? x_currentPageXML.getAttribute("continueBtnTxt") : "Close"
			});
		};

		this.resizeImg = function(firstLoad) {
			var imgMaxW, imgMaxH;
			if (x_currentPageXML.getAttribute("textWidth") == "none") {
				imgMaxW = Math.round($x_pageHolder.width() - 30);
				imgMaxH = Math.round($x_pageHolder.height() - 30);
				$('#panel').css('margin', '0px');
			} else if (x_currentPageXML.getAttribute("textWidth") == "narrow") {
				imgMaxW = Math.round($x_pageHolder.width() * 0.8 - 20);
				imgMaxH = Math.round($x_pageHolder.height() - 50);
			} else if (x_currentPageXML.getAttribute("textWidth") == "max") {
				imgMaxW = Math.round($x_pageHolder.width() * 0.3 - 20);
				imgMaxH = Math.round($x_pageHolder.height() - 50);
			} else {
				imgMaxW = Math.round($x_pageHolder.width() * 0.55 - 20);
				imgMaxH = Math.round($x_pageHolder.height() - 50);
			}
			$img.mapster('unbind');

			x_scaleImg($img, imgMaxW, imgMaxH, true, firstLoad, false);
			
			$img.css({
				"opacity"	:1,
				"filter"	:'alpha(opacity=100)'
			});

			this.createHS();

		};
		
		this.createHS = function() {
			// create hotspots - taking scale of image into account
			var scale = $img.width() / $img.data("origSize")[0],
				selected = $("#pageContents .hotspot.selected").length > 0 ? $("#pageContents .hotspot.selected").index() : undefined;
			$("#hsHolder").html("<map id=\"hsHolder_map\" name=\"hsHolder_map\"></map>");

			var stroke = true;
			var highlightColour = "#ffff00";
			var strokeWidth = 1;
			var strokeOpacity = 1;
			var fill = false;
			var fillColor = "#FFFF00";
			var fillOpacity = 1;
			if (x_currentPageXML.getAttribute("hicol") != undefined && x_currentPageXML.getAttribute("hicol") != "") {
				highlightColour = x_getColour(x_currentPageXML.getAttribute("hicol"));
			}
			if (x_currentPageXML.getAttribute("hs_strokeWidth") != undefined && x_currentPageXML.getAttribute("hs_strokeWidth") != "") {
				strokeWidth = parseInt(x_currentPageXML.getAttribute("hs_strokeWidth"));
				if (strokeWidth == 0)
				{
					stroke = false;
				}
			}
			if (x_currentPageXML.getAttribute("hs_strokeOpacity") != undefined && x_currentPageXML.getAttribute("hs_strokeOpacity") != "") {
				strokeOpacity = parseFloat(x_currentPageXML.getAttribute("hs_strokeOpacity"));
			}
			if (x_currentPageXML.getAttribute("hs_fill") != undefined && x_currentPageXML.getAttribute("hs_fill") != "") {
				fill = x_currentPageXML.getAttribute("hs_fill") === "true";
			}
			if (x_currentPageXML.getAttribute("hs_fillColor") != undefined && x_currentPageXML.getAttribute("hs_fillColor") != "") {
				fillColor = x_getColour(x_currentPageXML.getAttribute("hs_fillColor"));
			}
			if (x_currentPageXML.getAttribute("hs_fillOpacity") != undefined && x_currentPageXML.getAttribute("hs_fillOpacity") != "") {
				fillOpacity = parseFloat(x_currentPageXML.getAttribute("hs_fillOpacity"));
			}

			if (selected != undefined) {
				$("#pageContents .hotspot:eq(" + selected + ")").trigger("click");
			}
			options = {
				render_highlight:
						{
							fill: false,
							fillColor: fillColor.substr(1),
							fillOpacity: fillOpacity,
							stroke: stroke,
							strokeColor: highlightColour.substr(1),
							strokeOpacity: (strokeOpacity > 0 ? strokeOpacity : 1),
							strokeWidth: strokeWidth * 2
						},
				render_select:
						{
							fill: fill,
							fillColor: fillColor.substr(1),
							fillOpacity: fillOpacity,
							stroke: stroke,
							strokeColor: highlightColour.substr(1),
							strokeOpacity: strokeOpacity,
							strokeWidth: strokeWidth
						},

				scaleMap: true,
				clickNavigate: true
			};
			var tabfocusoptions = JSON.parse(JSON.stringify(options));
			// Make sure focus is ALWAYS visible, even if strokewidth is set to 0
			tabfocusoptions.render_highlight.stroke = true;
			tabfocusoptions.render_highlight.strokeWidth = (strokeWidth == 0? 1 : strokeWidth * 2);

			$(x_currentPageXML).children()
				.each(function(i){
					var hsType,	// what does hs do when clicked?
						hsInfo;
					
					// open dialog popup
					if (this.getAttribute("hotspotMovie") != undefined && this.getAttribute("hotspotMovie") != "") {
						hsType = "dialog";
						hsInfo = "video";
					} else if (this.getAttribute("hotspotSound") != undefined && this.getAttribute("hotspotSound") != "") {
						hsType = "dialog";
						hsInfo = "sound";
					} else if (this.getAttribute("hotspotPopUp") != undefined && this.getAttribute("hotspotPopUp") != "") {
						hsType = "dialog";
						hsInfo = "text";
					
					// open new window
					} else if (this.getAttribute("htm") != undefined && this.getAttribute("htm") != "") {
						hsType = "newWindow";
						hsInfo = "html";
					} else if (this.getAttribute("windowURL") != undefined && this.getAttribute("windowURL") != "") {
						hsType = "newWindow";
						hsInfo = "url";
					
					// go to page in LO
					} else if (this.getAttribute("destination") != undefined && this.getAttribute("destination") != "") {
						hsType = "pageLink";
						hsInfo = this.getAttribute("destination");
					} else if (this.getAttribute("relNav") != undefined && this.getAttribute("relNav") != "") {
						hsType = "pageLink";
						if (this.getAttribute("relNav") == "first") {
							if ($(x_pageInfo)[0].type == "menu") {
								hsInfo = $(x_pageInfo)[1].linkID;
							} else {
								hsInfo = $(x_pageInfo)[0].linkID;
							}
						} else if (this.getAttribute("relNav") == "last") {
							hsInfo = $(x_pageInfo)[x_pageInfo.length - 1].linkID;
						} else if (this.getAttribute("relNav") == "prev") {
							hsInfo = $(x_pageInfo)[x_currentPage - 1].linkID;
						} else { // next page
							hsInfo = $(x_pageInfo)[x_currentPage + 1].linkID;
						}
					}
				
					var _this = this,
						//$hotspot = $('<a class="hotspot transparent" href="#" tabindex="' + (i+1) + '" />');
						$hotspot = $('<area class="hotspot transparent" shape="poly" href="#" tabindex="' + (i+2) + '" />');

					var coords = [];
					var coords_string = "";
					// Old way of specifying hotspot: x,y,w,h
					if (this.getAttribute("mode") == undefined && this.getAttribute("x") != undefined && this.getAttribute("y") != undefined && this.getAttribute("w") != undefined && this.getAttribute("h") != undefined) {
						// create polygon, start with topleft
						coords[0] = {x: parseFloat(this.getAttribute("x")), y: parseFloat(this.getAttribute("y"))};
						coords[1] = {x: parseFloat(this.getAttribute("x")) + parseFloat(this.getAttribute("w")), y: parseFloat(this.getAttribute("y"))};
						coords[2] = {x: parseFloat(this.getAttribute("x")) + parseFloat(this.getAttribute("w")), y: parseFloat(this.getAttribute("y")) + parseFloat(this.getAttribute("h"))};
						coords[3] = {x: parseFloat(this.getAttribute("x")), y: parseFloat(this.getAttribute("y")) + parseFloat(this.getAttribute("h"))};
					}
					if (coords.length == 4 || (this.getAttribute("points") != undefined && this.getAttribute("mode") != undefined)) {
						if (coords.length != 4) {
							coords = JSON.parse(this.getAttribute("points"));
						}

						if (coords.length > 0) {
							for (var j in coords) {
								// No more need to scale the points, handled by the plugin
								//coords[j].x *= scale;
								//coords[j].y *= scale;
								if (j>0)
								{
									coords_string += ",";
								}
								coords_string += coords[j].x + "," + coords[j].y;
							}
						}
					}

					$hotspot
						.attr("coords", coords_string)

						.click(function() {

							// when audio dialogs are closed because another dialog has been opened - stop flash audio playing first
							if ($("#x_connectorHotspotImage #pageAudio .mejs-audio").attr("id") != undefined) {
								var audioRefNum = $("#x_connectorHotspotImage #pageAudio .mejs-audio").attr("id").substring(4);
								$("body div#me_flash_" + audioRefNum + "_container").remove();
							}
							
							$(".x_popupDialog").parent().detach(); // remove any open dialogs
							$("#pageContents .selected").removeClass("selected");
							$("#pageContents .highlighted").removeClass("highlighted");
							
							if (hsType != "pageLink") $(this).addClass("selected");
							$("#feedback").html("");
							
							// go to page in LO
							if (hsType == "pageLink") {
								if (x_lookupPage("linkID", hsInfo) == null) { // destination not found
									if (x_params.authorSupport == "true") {
										$("#feedback").html(hsInfo + " " + $pageContents.data("authorSupport"));
									}
								} else { // go to destination page
									x_navigateToPage(false, {type:"linkID", ID:hsInfo});
								}
							
							// open dialog popup
							} else if (hsType == "dialog") {
								var dialogHtml;
								if (hsInfo == "video") {
									var videoDimensions = [320,240];
									if (_this.getAttribute("movieSize") != "" && _this.getAttribute("movieSize") != undefined) {
										var dimensions = _this.getAttribute("movieSize").split(",");
										if (dimensions[0] != 0 && dimensions[1] != 0) {
											videoDimensions = dimensions;
										}
									}
									var videoTip = "";
									if (_this.getAttribute("tip") != "" &&  _this.getAttribute("tip") != undefined) {
										videoTip = _this.getAttribute("tip");
									}
									
									dialogHtml = '<div id="pageVideo"></div>' +
										'<script type="text/javascript">' +
											'$("#pageVideo")' +
												'.attr("title", "' + videoTip + '")' +
												'.mediaPlayer({' +
													'type			:"video",' +
													'source			:"' + _this.getAttribute("hotspotMovie") + '",' +
													'width			:' + videoDimensions[0] + ',' +
													'height			:' + videoDimensions[1] + ',' +
													'startEndFrame	:[' + Number(_this.getAttribute("startFrame")) + ', ' + Number(_this.getAttribute("endFrame")) + ']' +
												'});' +
										'</' + 'script>'; // broken in to 2 strings to stop unterminated string literal problem
									
									$pageContents.data("dialogPos").width = videoDimensions[0];
									$pageContents.data("dialogPos").height = Number(videoDimensions[1]) + 3;
									
								} else if (hsInfo == "sound") {
									dialogHtml = '<div id="pageAudio"></div>' +
										'<script type="text/javascript">' +
											'$("#pageAudio").mediaPlayer({' +
												'type : "audio",' +
												'source : "' + _this.getAttribute("hotspotSound") + '",' +
												'width : "100%"' +
											'});' +
										'</' + 'script>';
									
									$pageContents.data("dialogPos").width = undefined;
									$pageContents.data("dialogPos").height = x_audioBarH;
									
								} else { // text
									dialogHtml = x_addLineBreaks(_this.getAttribute("hotspotPopUp"));
									$pageContents.data("dialogPos").width = undefined;
									$pageContents.data("dialogPos").height = undefined;
								}
								
								x_openDialog("connectorHotspotImage", "", $pageContents.data("continueBtnTxt"), $pageContents.data("dialogPos"), dialogHtml);
								
								// when audio dialogs are closed with dialog x button - stop flash audio playing first
								if (hsInfo == "sound") {
									var audioRefNum = $("#x_connectorHotspotImage #pageAudio .mejs-audio").attr("id").substring(4);
									$("#x_connectorHotspotImage").parent().on("dialogclose", function() {
										$("body div#me_flash_" + audioRefNum + "_container").remove();
									});
								}
							
							// open new window
							} else if (hsType == "newWindow") {
								var wh = [550,400];
								if (_this.getAttribute("windowWidth") != undefined && _this.getAttribute("windowWidth") != "") {
									wh.splice(0, 1, _this.getAttribute("windowWidth"));
								}
								if (_this.getAttribute("windowHeight") != undefined && _this.getAttribute("windowHeight") != "") {
									wh.splice(1, 1, _this.getAttribute("windowHeight"));
								}
								
								if (hsInfo == "url") {
									var src = _this.getAttribute("windowURL");
									window.open(src, "_blank", "width=" + wh[0] + ", height=" + wh[1]);
								} else {
									var popupWindow = window.open("", "", "width=" + wh[0] + ", height=" + wh[1]);
									popupWindow.document.write(_this.getAttribute("htm"));
									popupWindow.focus();
								}
							}
							// Keep highlighted/selected
							if (x_currentPageXML.getAttribute("highlight") == "true") {

								setTimeout(function() {
									$("area").mapster('select');
								}, 100);
							}
							else {
							    // Keep unselected
                                setTimeout(function() {
                                    $("area").mapster('deselect');
                                }, 100);
                            }

						})
						.focusin(function() {
							$('img').mapster('set_options', tabfocusoptions);
							$(this).addClass("highlight");
							$(this).mapster('highlight');
						})
						.focusout(function() {
							$('img').mapster('set_options', options);
							$(this).removeClass("highlight");
							$("img").mapster('highlight', false);
						})
						.keypress(function(e) {
						var charCode = e.charCode || e.keyCode;
						if (charCode == 32) {
							$(this).trigger("click");
						}
						});
					if (x_currentPageXML.getAttribute("hs_showTooltip") == undefined || x_currentPageXML.getAttribute("hs_showTooltip") !== "false") {
						if (this.getAttribute("alttext") != undefined && this.getAttribute("alttext") != "")
							$hotspot.attr("title", this.getAttribute("alttext"));
						else
							$hotspot.attr("title", this.getAttribute("name"));
					}

					$("#hsHolder_map").append($hotspot);
				});

			$('img').mapster(options);
			if (x_currentPageXML.getAttribute("highlight") == "true") {

				$("area").mapster('select');
			}
		}

	};
	
	connectorHotspotImage.init();
	
</script>


<div id="pageContents">
	
	<div id="panel" class="panel inline">
		<div id="imageHolder">
			<img id="image" />
			<div id="hsHolder"></div>
			<div id="feedback" class="alert" />
		</div>
	</div>
	
	<div id="mainText" tabindex="1"></div>
	
</div>

*/});