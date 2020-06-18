modelfilestrs['links'] = hereDoc(function(){/*!
<script type="text/javascript">


	// pageChanged & sizeChanged functions are needed in every model file
	// other functions for model should also be in here to avoid conflicts
	var links = new function() {
		// function called every time the page is viewed after it has initially loaded
		this.pageChanged = function() {

		}

		// function called every time the size of the LO is changed
		this.sizeChanged = function(firstLoad) {
			if (x_browserInfo.mobile == false) {
				links.setRowHeight();
			}
		}

		this.init = function() {
			var $linkHolder = $("#linkHolder");
			$("#textHolder").html(x_addLineBreaks(x_currentPageXML.getAttribute("text")));
			var numCols = x_currentPageXML.getAttribute("cols");
			if (numCols < 1) {
				numCols = 3;
			}
			
			// warn that links open in new window (for screen readers)
			var linkWarning = x_getLangInfo(x_languageData.find("screenReaderInfo")[0], "newWindow", "");
			linkWarning = linkWarning != "" ? '<span class="ui-helper-hidden-accessible">' + linkWarning + '</span>' : linkWarning;
			
			var $linkBlock = $(".linkBlock:first");
			$(x_currentPageXML).children().each(function(i) {
				var $thisLink;
				if (i != 0) {
					$thisLink = $linkBlock.clone().appendTo($linkHolder);
				} else {
					$thisLink = $linkHolder;
				}
				
				$thisLink.find("h3")
					.attr("id", "link" + i)
					.html(this.getAttribute("name"));
				
				$thisLink.find(".info").html(x_addLineBreaks(this.getAttribute("text")));
				
				$thisLink.find(".link a")
					.html(this.getAttribute("url") + linkWarning)
					.attr({
						"href" : this.getAttribute("url"),
						"target" : "_blank",
						"aria-labelledby" : (linkWarning != "" ? "link" + i + " linkHelper" + i : "link" + i) // the text read by screen reader for link (instead of url)
						})
					.find("span.ui-helper-hidden-accessible").attr("id", "linkHelper" + i);
				
				if (i % numCols == 0) {
					$thisLink.addClass("clear");
				}
			});
			
			
			
			// set column widths
			if (x_browserInfo.mobile == false) {
				var numColumns = Number(x_currentPageXML.getAttribute("cols"));
				var spacerWidth = (numColumns + 1) * 2,	// 2% gap between columns
					paddingWidth = numColumns * 2,		// 1% padding inside panel
					columnWidth = Math.floor((100 - spacerWidth - paddingWidth) / numColumns);

				$("#linkHolder .linkBlock")
					.css({
						width			:columnWidth + "%",
						"padding"		:"1%",
						"margin-left"	:"2%"
					});
				
				links.setRowHeight();
			}

			x_pageLoaded();
		}
		
		// set link height for each row
		this.setRowHeight = function() {
			
			var maxH = [0,0,0],
				numColumns = Number(x_currentPageXML.getAttribute("cols"));
			
			$(".linkBlock").each(function(i) {
				var $this = $(this);
				$this.find(".title, .info, .link").height("auto");
				var remainder = i % numColumns;
				if (remainder == 0) {
					if (i != 0) {
						for (var j=0; j<numColumns; j++) {
							$(".linkBlock .title:eq(" + (i-1-j) + ")").height(maxH[0]);
							$(".linkBlock .info:eq(" + (i-1-j) + ")").height(maxH[1]);
							$(".linkBlock .link:eq(" + (i-1-j) + ")").height(maxH[2]);
						}
					}
					// 1st in row so start maxH again from 0
					maxH.splice(0, 1, $this.find(".title").height() > 0 ? $this.find(".title").height() : 0);
					maxH.splice(1, 1, $this.find(".info").height() > 0 ? $this.find(".info").height() : 0);
					maxH.splice(2, 1, $this.find(".link").height() > 0 ? $this.find(".link").height() : 0);
				} else {
					maxH.splice(0, 1, $this.find(".title").height() > maxH[0] ? $this.find(".title").height() : maxH[0]);
					maxH.splice(1, 1, $this.find(".info").height() > maxH[1] ? $this.find(".info").height() : maxH[1]);
					maxH.splice(2, 1, $this.find(".link").height() > maxH[2] ? $this.find(".link").height() : maxH[2]);
					
					// last row
					if (i == $(".linkBlock .info").length - 1) {
						for (var j=0; j<numColumns-(numColumns-remainder-1); j++) {
							$(".linkBlock .title:eq(" + (i-j) + ")").height(maxH[0]);
							$(".linkBlock .info:eq(" + (i-j) + ")").height(maxH[1]);
							$(".linkBlock .link:eq(" + (i-j) + ")").height(maxH[2]);
						}
					}
				}
			});
		}
	}

	links.init();

</script>


<div id="textHolder">

</div>

<div id="linkHolder">
	<div class="panel linkBlock">
		<h3 class="title"></h3>
		<div class="info"></div>
		<p class="link"><a></a></p>
	</div>
</div>

*/});