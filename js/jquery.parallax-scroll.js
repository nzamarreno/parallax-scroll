$(function() {
  ParallaxScroll.init();
});

var ParallaxScroll = {
  round: 1000,
  _properties: ["x", "y", "z"],
  _requestAnimationFrame: null,

  init: function() {
    this._requestAnimationFrame = (function() {
      return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(/* function */ callback, /* DOMElement */ element) {
          window.setTimeout(callback, 1000 / 60);
        }
      );
    })();

    this._onScroll(true);
  },

  _onScroll: function(noSmooth) {
    var scroll = $(document).scrollTop();

    var windowHeight = $(window).height();

    $("[data-parallax]").each(
      $.proxy(function(index, el) {
        var $el = $(el);
        var properties = [];
        var applyProperties = false;
        var style = $el.data("style");

        if (style == undefined) {
          style = $el.attr("style") || "";
          $el.data("style", style);
        }

        var data = $el.data("parallax");
        var scrollFrom = data["from-scroll"];

        if (scrollFrom == undefined)
          scrollFrom = Math.max(0, $(el).offset().top - windowHeight);
        scrollFrom = scrollFrom | 0;

        var scrollDistance = data["distance"];
        var scrollTo = data["to-scroll"];
        if (scrollDistance == undefined && scrollTo == undefined)
          scrollDistance = windowHeight;

        scrollDistance = Math.max(scrollDistance | 0, 1);

        if (scrollTo == undefined) scrollTo = scrollFrom + scrollDistance;
        scrollTo = scrollTo | 0;

        var smoothness = data["smoothness"];
        if (smoothness == undefined) smoothness = 30;
        smoothness = smoothness | 0;

        if (noSmooth || smoothness == 0) smoothness = 1;
        smoothness = smoothness | 0;

        var scrollCurrent = scroll;
        scrollCurrent = Math.max(scrollCurrent, scrollFrom);
        scrollCurrent = Math.min(scrollCurrent, scrollTo);

        this._properties.map(
          $.proxy(function(prop) {
            var defaultProp = 0;
            var to = data[prop];

            if (to == undefined) return;

            var prev = $el.data("_" + prop);

            if (prev == undefined) prev = defaultProp;
            var next =
              (to - defaultProp) *
                ((scrollCurrent - scrollFrom) / (scrollTo - scrollFrom)) +
              defaultProp;
            var val = prev + (next - prev) / smoothness;

            val = Math.ceil(val * this.round) / this.round;
            if (val == prev && next == to) val = to;
            if (!properties[prop]) properties[prop] = 0;
            properties[prop] += val;
            if (prev != properties[prop]) {
              console.log(properties[prop]);

              $el.data("_" + prop, properties[prop]);
              applyProperties = true;
            }
          }, this)
        );

        if (applyProperties) {
          if (properties["z"] != undefined) {
            var perspective = data["perspective"];
            if (perspective == undefined) perspective = 800;
            var $parent = $el.parent();
            if (!$parent.data("style"))
              $parent.data("style", $parent.attr("style") || "");
            $parent.attr(
              "style",
              "perspective:" +
                perspective +
                "px; -webkit-perspective:" +
                perspective +
                "px; " +
                $parent.data("style")
            );
          }

          var translate3d =
            "translate3d(" +
            (properties["x"] ? properties["x"] : 0) +
            "px, " +
            (properties["y"] ? properties["y"] : 0) +
            "px, " +
            (properties["z"] ? properties["z"] : 0) +
            "px)";
          var cssTransform = translate3d + ";";

          $el.attr(
            "style",
            "transform:" +
              cssTransform +
              " -webkit-transform:" +
              cssTransform +
              " " +
              style
          );
        }
      }, this)
    );

    if (window.requestAnimationFrame) {
      window.requestAnimationFrame($.proxy(this._onScroll, this, false));
    } else {
      this._requestAnimationFrame($.proxy(this._onScroll, this, false));
    }
  }
};
