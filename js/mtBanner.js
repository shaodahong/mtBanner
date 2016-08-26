function $mtBanner(data) {
    /*
    * $imgBox   图片容器
    * $imgWidth 图片宽度
    * $listBox  序号容器
    * $lists    序号集合
    * */
    // create banner tag
    var $banner = $("<div id='banner' class='clearfix'></div>").appendTo(document.body);
    var imgBox = "<ul class='clearfix'>" + $.map(data, function (v) {
            return "<li><a href='#'><img src='"+v.img+"' alt='"+v.alt+"' '></a></li>";
        }).join("") + "</ul>";
    var listBox = "<ul class='clearfix'>" + $.map(data, function () {
            return "<li></li>";
        }).join("") + "</ul>";
    $banner.html(imgBox + listBox);

    //set banner style
    var $imgBox = $("#banner ul:first-child");
    var $imgWidth = $imgBox.find("a").innerWidth();
    $imgBox.css("width", ""+(data.length + 2) * $imgWidth+"px");
    var $listBox = $("#banner ul:last-child");

    var $lists = $listBox.find("li");
    $($lists.get(0)).addClass("active");

    //clone seamless carousel
    var cFirst = $("#banner ul:first-child li:first-child").clone();
    var cLast = $("#banner ul:first-child li:last-child").clone();

    $imgBox.append(cFirst).prepend(cLast);

    //add jq extend (static method)
    $.extend({
        setTransition: function(dom) {
            if(!dom) return false;
            dom.css({
                transition: "all 0.3s",
                webkitTransition: "all 0.3s"
            });
        },
        cleanTransition: function (dom) {
            if(!dom) return false;
            dom.css({
                transition: "none",
                webkitTransition: "none"
            });
        },
        setTransformX: function (dom, x) {
            if(!dom) return false;
            dom.css({
                transform: "translateX("+x+"px)",
                webkitTransform: "translateX("+x+"px)"
            });
        },
        isTransitionEnd: function (dom, callback) {
            if(!dom) return false;
            dom.on("transitionEnd",function () {
                callback && callback();
            });
            dom.on("webkitTransitionEnd",function () {
                callback && callback();
            });
        }
    });
    //define global index
    var index = 1;
    //auto paly
    var timer = setInterval(function () {
        index++;
        $.setTransition($imgBox);
        $.setTransformX($imgBox, -index * $imgWidth);
    }, 2000);
    //监听过度完成
    $.isTransitionEnd($imgBox, function () {
        if(index > data.length) {
            index = 1;
            $.cleanTransition($imgBox);
            $.setTransformX($imgBox, -index*$imgWidth);
        }else if(index < 1) {
            index = 2;
            $.cleanTransition($imgBox);
            $.setTransformX($imgBox, -index*$imgWidth);
        }
        setIndex();
    });
    //对应序号
    function setIndex() {
        $lists.each(function (i, v) {
            $(this).removeClass("active");
        });
        $($lists.get(index-1)).addClass("active");
    }
    //触摸事件
    //触摸初始的位置
    var startX = 0;
    //触摸结束的位置
    var endX = 0;
    //触摸移动的位置
    var moveX = 0;
    var flag = false;
    $banner.on("touchstart", function (e) {
        clearInterval(timer);
        startX = e.originalEvent.touches[0].clientX;
        e.preventDefault();
    });
    $banner.on("touchmove", function (e) {
        endX = e.originalEvent.touches[0].clientX;
        moveX = endX - startX;
        $.cleanTransition($imgBox);
        $.setTransformX($imgBox, -index*$imgWidth+moveX);
        flag = true;
        e.preventDefault();
    });
    $banner.on("touchend", function (e) {
        if(Math.abs(moveX) > $imgWidth/3 && flag) {
            if(moveX > 0) {
                index--;
            }else {
                index++;
            }
            $.setTransition($imgBox);
            $.setTransformX($imgBox, -index*$imgWidth);
        }else {
            $.setTransition($imgBox);
            $.setTransformX($imgBox, -index*$imgWidth);
        }
        timer = setInterval(function () {
            index++;
            $.setTransition($imgBox);
            $.setTransformX($imgBox, -index*$imgWidth);
        }, 2000);
        startX = 0;
        endX = 0;
        moveX = 0;
        flag = false;
        startTime = 0;
        endTime = 0;
        moveTime = 0;
        e.preventDefault();
    });
}