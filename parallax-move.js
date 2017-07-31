class Parallax {
  constructor() {
    this.round = 1000;
    this._properties = [ "x", "y", "z" ];
    this._requestAnimationFrame = null;
  }

  init () {
    this._requestAnimationFrame = (() => {
      return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (/* function */ callback, /* DOMElement */ element) {
          window.setTimeout(callback, 1000 / 60);
        }
      );
    })();

    this._onScroll(true);
  }


  _onScroll (noSmooth) {
    let scroll = window.scrollY;
    let windowHeight = window.innerHeight;

    let $elementsMove = document.querySelectorAll("[data-parallax]");

    /**
     * Load Polyfill
     */

    if (NodeList.prototype.forEach == undefined) {
      NodeList.prototype.forEach = Array.prototype.forEach;
    }

    /**
     * Parse Elements DOM
     */
    $elementsMove.forEach((el, index) => {
      let $el = el;
      let properties = [];
      let applyProperties = false;
      let style = $el[ "style_el" ];

      if (style == undefined) {
        style = $el.getAttribute("style") || "";
        $el[ "style_el" ] = style;
      }

      let data = JSON.parse($el.getAttribute("data-parallax"));

      let scrollFrom = data[ "from-scroll" ];
      if (scrollFrom == undefined)
        scrollFrom = Math.max(0, $el.offsetTop - windowHeight);
      scrollFrom = scrollFrom | 0;

      let scrollDistance = data[ "distance" ];
      let scrollTo = data[ "to-scroll" ];
      if (scrollDistance == undefined && scrollTo == undefined)
        scrollDistance = windowHeight;

      scrollDistance = Math.max(scrollDistance | 0, 1);

      if (scrollTo == undefined)
        scrollTo = scrollFrom + scrollDistance;
      scrollTo = scrollTo | 0;

      var smoothness = data[ "smoothness" ];
      if (smoothness == undefined) smoothness = 30;
      smoothness = smoothness | 0;

      if (noSmooth || smoothness == 0) smoothness = 1;
      smoothness = smoothness | 0;

      var scrollCurrent = scroll;
      scrollCurrent = Math.max(scrollCurrent, scrollFrom);
      scrollCurrent = Math.min(scrollCurrent, scrollTo);

      this._properties.map(prop => {
        var defaultProp = 0;

        var to = data[ prop ];

        //If the propriety don't have definition, break map function
        if (to == undefined) return;

        var prev = $el[ "_" + prop ];

        if (prev == undefined) {
          prev = defaultProp;
        }

        var next =
          (to - defaultProp) *
          ((scrollCurrent - scrollFrom) / (scrollTo - scrollFrom)) +
          defaultProp;

        var val = prev + (next - prev) / smoothness;

        val = Math.ceil(val * this.round) / this.round;

        if (val == prev && next == to) val = to;

        if (!properties[ prop ]) {
          properties[ prop ] = 0;
        }

        properties[ prop ] += val;

        if (prev != properties[ prop ]) {
          $el[ "_" + prop ] = properties[ prop ];
          applyProperties = true;
        }
      });

      if (applyProperties) {
        if (properties[ "z" ] != undefined) {
          var perspective = data[ "perspective" ];
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
          (properties[ "x" ] ? properties[ "x" ] : 0) +
          "px, " +
          (properties[ "y" ] ? properties[ "y" ] : 0) +
          "px, " +
          (properties[ "z" ] ? properties[ "z" ] : 0) +
          "px)";
        var cssTransform = translate3d + ";";

        $el.setAttribute(
          "style",
          "transform:" +
          cssTransform +
          " -webkit-transform:" +
          cssTransform +
          " " +
          style
        );
      }
    });

    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(() => this._onScroll.call(this));
    }
    else {
      this._requestAnimationFrame(() => this._onScroll.call(this));
    }
  }
}
