modelfilestrs['pdf'] = hereDoc(function(){/*!
<script type="text/javascript">

	
	// pageChanged & sizeChanged functions are needed in every model file
	// other functions for model should also be in here to avoid conflicts
	var pdf = new function() {		
		var $pageContents;

		// function called every time the page is viewed after it has initially loaded
		this.pageChanged = function() {
			pdf.setUp();
		}
		
		// function called every time the size of the LO is changed
		this.sizeChanged = function() {
			if (x_browserInfo.iOS == true) {
				this.setUp();
			} else {	
				$("#pdfDoc").height(pdf.calcHeight());
			}
		}
		
		this.init = function() {
			
			$pageContents = $("#pageContents");
			
			var textContents = x_addLineBreaks(x_currentPageXML.getAttribute("text")),
				pdfWidth = x_currentPageXML.getAttribute("pdfWidth");
			
			// text is top or no text & full width pdf
			if ((x_currentPageXML.getAttribute("position") == "T" && textContents != undefined && textContents != "") || pdfWidth == "full" || textContents == undefined || textContents == "") {
				
				$("#textHolder")
					.appendTo($pageContents)
					.removeClass('left');
				
				$("#pageContents .panel").appendTo($pageContents);
				$("#pageContents .splitScreen").remove();
				
				pdfWidth == "full";
				
			// text is removed because pdf is full & it's not positioned above it
			} else if (pdfWidth == "full" && (x_currentPageXML.getAttribute("position") != "T" || (textContents == undefined && textContents == ""))) {
				
				$("#textHolder").remove();
				
			} else if (pdfWidth == undefined || pdfWidth == "") {
				
				pdfWidth = "medium";
				
			}
			
			// remove text holder if there is no text
			if (textContents != undefined && textContents != "") {
				
				$("#textHolder").html(textContents);
				
			} else {
				
				$("#textHolder").remove();
				
			}
			
			// swap positions of text & pdf
			if (x_currentPageXML.getAttribute("position") == "R") {
				
				$(".splitScreen .right")
					.removeClass("right")
					.addClass("left");
				
				$("#textHolder")
					.removeClass("left")
					.addClass("right")
					.insertAfter(".splitScreen.left");
				
				// Set the width of the pdf
				if (pdfWidth == "small") {
					$("#pageContents .splitScreen").addClass("medium");
				} else if (pdfWidth == "large") {
					$("#pageContents .splitScreen").addClass("xlarge");
				} else {
					$("#pageContents .splitScreen").addClass("large");
				}
				
			} else {
				
				// Set the width of the pdf
				if (pdfWidth == "small") {
					$("#pageContents .splitScreen").addClass("large"); // make text area on left large so panel on right is small
				} else if (pdfWidth == "large") {
					$("#pageContents .splitScreen").addClass("small");
				} else {
					$("#pageContents .splitScreen").addClass("medium");
				}
			}

			pdf.setUp();
			x_pageLoaded();
		}
		
		this.setUp = function() {
			if (x_browserInfo.iOS == true) {
				$("#pdfPage").html('<div id="pdfCover" /><object onload="pdf.createCover()" "id="pdfDoc" data="' + x_evalURL(x_currentPageXML.getAttribute("url")) + '" type="application/pdf" width="' + pdf.calcWidth() + '" height="auto"><param name="src" value="' + x_evalURL(x_currentPageXML.getAttribute("url")) + '"></object>');
			} else {
				this.createLink();
				$("#pdfPage").prepend('<object id="pdfDoc" data="' + x_evalURL(x_currentPageXML.getAttribute("url")) + '" type="application/pdf" width="100%" height="' + pdf.calcHeight() + '"><param name="src" value="' + x_evalURL(x_currentPageXML.getAttribute("url")) + '"></object>');
			}
		}
		
		this.createCover = function() {
			setTimeout(function(){
				$("#link").remove();
				$("#pdfCover").css({
					width:	$("#pdfPage").width(),
					height: $("#pdfPage").height()
				});
				pdf.createLink();
			}, 1);
		}
		
		this.createLink = function() {
			$("#pdfPage").append('<div id="link"><hr/><a id="pdfLink" href="' + x_evalURL(x_currentPageXML.getAttribute("url")) + '" target="_blank">' + (x_currentPageXML.getAttribute("open") == "" || x_currentPageXML.getAttribute("open") == undefined ? "Open PDF in new tab" : x_currentPageXML.getAttribute("open")) + '</a></div>');
		}
		
		this.calcWidth = function() {
			if ($("#textHolder").length > 0 && x_browserInfo.mobile == false) {
				return $x_pageHolder.width() - $("#textHolder").width() - parseInt($("div.right").css("margin-left")) - (parseInt($x_pageDiv.css("padding-left")) * 2) - (parseInt($("div.panel").css("padding-left")) * 2);
			} else {
				return $x_pageHolder.width() - (parseInt($x_pageDiv.css("padding-left")) * 2) - (parseInt($("div.panel").css("padding-left")) * 2);
			}
		}
		
		this.calcHeight = function() {
			var height;
			
			if (x_browserInfo.mobile == false) {
				height = $x_pageHolder.height() - (parseInt($x_pageDiv.css("padding-top")) * 2) - (parseInt($("div.panel").css("padding-top")) * 2) - (parseInt($("div.panel").css("border-top-width")) * 2) - $("#link").outerHeight(true) - 20;
			} else {
				height = $x_mobileScroll.height() - $x_headerBlock.height() - $x_footerBlock.height() - (parseInt($x_pageDiv.css("padding-top")) * 2) - 3;
			}
			
			return height;
		}
	}
	
	pdf.init();
	
</script>


<div id="pageContents">
	
	<div class="splitScreen">
		
		<div id="textHolder" class="left">
			
		</div>
		
		<div class="right">
			<div class="panel">
				<div id="pdfPage"></div>
			</div>
		</div>
		
	</div>
	
</div>


*/});