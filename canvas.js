(function () {
  'use strict'

  const svgPath = `
    M 100.000 130.000
    L 141.145 156.631
    L 128.532 109.271
    L 166.574 78.369
    L 117.634 75.729
    L 100.000 30.000
    L 82.366 75.729
    L 33.426 78.369
    L 71.468 109.271
    L 58.855 156.631
    L 100.000 130.000
  `

  const starsCanvas = document.getElementById('stars-canvas')
  const bgCanvas = document.getElementById('bg-canvas')

  const ctx = starsCanvas.getContext('2d')
  const bgCtx = bgCanvas.getContext('2d')

  function setBg (color) {
    bgCtx.fillStyle = color
    bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height)
  }

  function createStar (dx, dy, color) {
    const path = new Path2D(svgPath)
    ctx.setTransform(1, 0, 0, 1, dx, dy)
    ctx.fillStyle = color
    ctx.fill(path)
    return { path, dx, dy, color }
  }

  const redStar = createStar(50, 50, '#FF0000')
  const blueStar = createStar(350, 50, '#3914AF')
  const greenStar = createStar(350, 350, '#00CC00')
  const yellowStar = createStar(50, 350, '#FFD300')
  const blackStar = createStar(200, 200, '#111111')

  ctx.setTransform(1, 0, 0, 1, 0, 0)

  function isPointInPath (event, star) {
    return ctx.isPointInPath(star.path, event.offsetX - star.dx, event.offsetY - star.dy)
  }

  starsCanvas.addEventListener('click', function (event) {
    if (isPointInPath(event, redStar)) {
      setBg(redStar.color)
    } else if (isPointInPath(event, blueStar)) {
      setBg(blueStar.color)
    } else if (isPointInPath(event, greenStar)) {
      setBg(greenStar.color)
    } else if (isPointInPath(event, yellowStar)) {
      setBg(yellowStar.color)
    } else if (isPointInPath(event, blackStar)) {
      setBg(blackStar.color)
    } else {
      setBg('white')
    }
  })
})()
