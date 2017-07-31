# Parallax-scroll ES6
Animation parallax on Scrool vertical using requestAnimationFrame and CSS3 3D transitions.

## Properties
- __X__: X axis translation (in pixels)
- __Y__: Y axis translation (in pixels)
- __Z__: Z axis translation (pixels)

## Parameters

 - `from-scroll`: vertical scroll position the animation starts _(default: when the element is visible)_
- `distance`: distance on vertical scroll position the animation will last (default: the window visible height)
- `to-scroll`: vertical scroll position the animation ends _(default: from-scroll + distance)_
- `smoothness`: factor that slowdown the animation, the more the smoothier _(default: 30)_

## Exemple

```html
    <div data-parallax='{"x": 650, "from-scroll": 90, "distance": 0}'>Number One</li>
```

