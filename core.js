$(function () {
	initNav();
	if ($("#news").length) {
		initNews();
	}
	if ($("#about").length) {
		initAboutPhotoHover();
	}
	if ($("#resume").length) {
		initResumeHover();
	}
	if ($("div.thumbs").length) {
		initThumbs();
	}
	if ($("ul.videos").length) {
		initVideos();
	}
	initSurprise();
});

$.fn.shake = function () {
	var shakeInterval  = 30,
		shakeDuration  = 1000,
		shakeIntensity = 10,
		shakeIndex     = 0;		
	return this.each(function () {
		var	$shakeElement = $(this);
		shakeIndex = setInterval(function () {
			$shakeElement.stop(true, false).css({
				"left" : Math.round(Math.random() * shakeIntensity) - ((shakeIntensity + 1) / 2) + "px",
				 "top" : Math.round(Math.random() * shakeIntensity) - ((shakeIntensity + 1) / 2) + "px"
			});
		}, shakeInterval);
		setTimeout(function () {
			clearInterval(shakeIndex);
			$shakeElement.stop(true, false).css({
				"left" : 0,
				 "top" : 0
			});
		}, shakeDuration);		
	});
}

function hideNews() {
	var $news = $("#news");
	if ($news.css("left").slice(0, -2) == 0) {
		$news.animate({"left" : -210}, 1000);
	}
}

function initAboutPhotoHover() {
	var $aboutPhotoHover = $("<div id='about-photo-hover' />");	
	$aboutPhotoHover.hover(
		function () {
			$aboutPhotoHover.css("backgroundPosition", "0 0");
		},
		function () {
			$aboutPhotoHover.css("backgroundPosition", "0 -1000px");
		}
	).appendTo("#about");
}

function initNav() {
	var $navHover     = $("<div id='nav-hover' />"),
		$navExplosion = $("<div id='nav-explosion' />");
	$navHover.add($navExplosion).appendTo("#nav");
	$("#nav li").hover(
		function () {
			$navHover.removeClass().addClass($(this).attr("id") + "-hover");
		},
		function () {
			$navHover.removeClass();
		}
	);	
	$("#nav a").click(function (e) {
		e.preventDefault();	
		var id  = $(this).parent().attr("id"),
			url = this.href;
		if (id == "nav-home") {
			$("<div id='page-transition' />").css("height", $(document).height()).appendTo("body");
			$("#page-transition").show();
		} else {
			$("#nav").shake();
			$navExplosion.removeClass().addClass(id + "-explosion").show().sprite({
				         "fps" : 12,
				"no_of_frames" : 18,
				 "play_frames" : 18
			});
		}
		setTimeout(function() {
			window.location.href = url;
		}, 500);
	});
}

function initNews() {
	var trigger = false,
		link    = $("#news a").attr("href"),
		$news   = $("#news"),
		content = [
				   "<div id='news-close'></div>",
				   "<div id='news-bubble'>",
				   "<div id='news-text'>",
				   $news.html(),
				   "</div>",
				   "</div>"
				   ].join("");
	$news.empty().append(content);
	$("#news-bubble").click(function () { 
		window.location.href = link;
	});
	$("#news-close").click(function () {
		hideNews();
	});
	$news.hover(
		function () {
			trigger = true;
			showNews(0);
		},
		function () {
			hideNews();
		}
	);
	if (!trigger) {
		setTimeout(function () {
			showNews(5000);
		}, 2000);
	}	
}

function initResumeHover() {
	var resumeLink   = $("#resume a").attr("href");
		$resumeHover = $("<div id='resume-hover' />");	
	$("#resume").hover(
		function () {
			$resumeHover.click(function () {
				window.location = resumeLink;
			}).show();
		},
		function () {
			$resumeHover.hide();
		}
	).append($resumeHover);
}

function initSurprise() {
	var $surprise = $("<div id='surprise' />"),
		surprises = [
						{
							   "class" : "purple",
							  "frames" : 2,
							"startPos" : -286,
							 "stopPos" : 0,
							   "speed" : 500,
							"duration" : 500
						},
						{
							   "class" : "cupcake",
							  "frames" : 3,
							"startPos" : -308,
							 "stopPos" : 100,
							   "speed" : 1000,
							"duration" : 1000
						}
					],
		surprise  = (function () {
						var selected = 0,
							counter  = 0;
						for (surprise in surprises) {
							if (Math.random() < 1 / ++counter) {
								selected = surprise;
							}
						}
						return selected;
					})(),
		surprise  = surprises[surprise];
		showTimes = [2000, 3000, 4000, 5000],
		showTime  = showTimes[Math.floor(Math.random()*showTimes.length)];
	$surprise.addClass(surprise.class);
	$("#page").append($surprise);
	setTimeout(function () {
		$surprise.sprite({
					 "fps" : 12,
			"no_of_frames" : surprise.frames
		}).animate({"top" : surprise.stopPos}, surprise.speed,
			function () {
				setTimeout(function () {
					$surprise.animate({"top" : surprise.startPos}, (surprise.speed / 2),
						function () {
							$surprise.destroy();
						}
					);					
				}, surprise.duration);
			}
		);
	}, showTime);
}

function initThumbs() {
	$("div.thumbs").addClass("popup-group");
	$("div.thumbs a").click(function (e) {
		e.preventDefault();
		$("<img id='image' src='" + this.href + "' class='popup' />").popup({
			"closeOnClickPopup" : true
		});
	});
}

function initVideos() {
	var popup = [
				"<div id='video-player' class='popup'>",
				"<div id='video-loader'></div>",
				"</div>"
				].join("");
	$("ul.videos").addClass("popup-group");
	$("ul.videos a").click(function (e) {
		e.preventDefault();
		var url = this.href;
		$(this).addClass("popup-current");
		$(popup).popup({
			"closeOnClickButton" : true,
			             "cycle" : true,
					    "onLoad" : function () {
					    				loadVideo(url);
					    			},
					   "onCycle" : function () {
					  					loadVideo($("ul.videos a.popup-current").attr("href"));	
					 				}
		});
	});
}

function loadVideo(url) {
	$("#video").remove();
	$("#video-loader").fadeIn().delay(1000).fadeOut();
	setTimeout(function () {
		$("#video-player").append("<iframe id='video' src='" + url + "' frameborder='0'></iframe>");
	}, 1500);
}

function showNews(duration) {
	$("#news").animate({"left" : 0}, 1000,
		function () {
			$("#news-bubble").fadeIn();
			if (duration > 0) {
				setTimeout(function () {
					hideNews();
				}, duration);
			}
		}
	);
}