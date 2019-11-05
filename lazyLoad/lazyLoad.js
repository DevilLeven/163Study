(function ($,window) {
  var $container,option, elements,loadedIndex=[];
  $.fn.lazyload=function (opt) {
    var defOpt = {
      container: window,
      placeholder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
    };
    option = $.extend(defOpt,opt);
    elements = this; // $[img]
    $container = $(defOpt.container);
    initPlaceholder();
    update();
    $container.bind('scroll',update);
  };
  function initPlaceholder() {
    elements.each(function () {
      var $img = $(this); // this === img Dom
      if($img.is("img")){
        !$img.attr("src") && $img.attr('src',option.placeholder) // 设置默认图片
      }
    })
  }
  function update() {
    elements.each(function (index) {
      var $img = $(this);
      if(loadedIndex.indexOf(index)<0 && isVisible($img)){
        $img.attr('src',$img.attr('data-src'));
        loadedIndex.push(index);
      }
    });
  }
  function isVisible($img) {
    var belowV = ($img.offset().top - $container.scrollTop()) > $container.height();
    var overV =   ($img.offset().top+$img.height() ) < $container.scrollTop();
    return !belowV && !overV;
  }
})(jQuery,window);
