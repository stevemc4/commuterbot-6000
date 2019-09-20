import { createCanvas, registerFont, loadImage } from 'canvas'
import url from 'url'

export default async function (req, res) {
  const WIDTH = 1200
  const HEIGHT = 630
  const FONT_PATH = `${__dirname}/assets/fonts/Nunito-Regular.ttf`
  const LOGO = await loadImage(`${__dirname}/assets/images/logo.png`)

  const { query } = url.parse(req.url, true)

  registerFont(FONT_PATH, {
    family: 'Nunito'
  })
  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')

  ctx.save()

  function createStationNode (x, y, isCurrentStation = false) {
    ctx.strokeStyle = '#1565C0'
    ctx.beginPath()
    ctx.ellipse(x, y, 64, 64, 0, 0, 360)
    ctx.lineWidth = 32
    ctx.stroke()
    if (isCurrentStation) {
      ctx.closePath()
      ctx.beginPath()
      ctx.ellipse(x, y, 32, 32, 0, 0, 360)
      ctx.fillStyle = '#1565C0'
      ctx.fill()
    }
    ctx.closePath()
    ctx.restore()
  }

  function createLine (x1, y1, x2, y2) {
    ctx.strokeStyle = '#1565C0'
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.lineWidth = 24
    ctx.stroke()
    ctx.closePath()
    ctx.restore()
  }

  function writeStationName (text, x, y, smaller = false) {
    ctx.font = '48px Nunito'
    if (smaller) ctx.font = '32px Nunito'
    const textMeasurement = ctx.measureText(text)
    const XPOS = x - textMeasurement.width / 2
    ctx.fillStyle = '#1565C0'
    ctx.fillText(text, XPOS, y)
    ctx.restore()
  }

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, 1200, 630)

  ctx.restore()

  const CENTER_NODE_COORDINATE = createPoint(WIDTH / 2, HEIGHT / 2 - 72)
  const LEFT_NODE_COORDINATE = createPoint(WIDTH / 2 - 384 - 96, HEIGHT / 2 - 72)
  const RIGHT_NODE_COORDINATE = createPoint(WIDTH / 2 + 384 + 96, HEIGHT / 2 - 72)

  createStationNode(CENTER_NODE_COORDINATE.x, CENTER_NODE_COORDINATE.y, true)
  writeStationName(query.station, CENTER_NODE_COORDINATE.x, CENTER_NODE_COORDINATE.y + 144)
  writeStationName('Stasiun Saat Ini', CENTER_NODE_COORDINATE.x, CENTER_NODE_COORDINATE.y + 184, true)

  if (query.before) {
    createLine(LEFT_NODE_COORDINATE.x + 48, LEFT_NODE_COORDINATE.y, CENTER_NODE_COORDINATE.x - 48, CENTER_NODE_COORDINATE.y)
    createStationNode(LEFT_NODE_COORDINATE.x, LEFT_NODE_COORDINATE.y)
    createLine(LEFT_NODE_COORDINATE.x - 48, LEFT_NODE_COORDINATE.y, 0, LEFT_NODE_COORDINATE.y)  
    writeStationName(query.before, LEFT_NODE_COORDINATE.x, LEFT_NODE_COORDINATE.y + 144, true)
  }

  if (query.after) {
    createLine(RIGHT_NODE_COORDINATE.x - 48, RIGHT_NODE_COORDINATE.y, CENTER_NODE_COORDINATE.x + 48, CENTER_NODE_COORDINATE.y)
    createStationNode(RIGHT_NODE_COORDINATE.x, RIGHT_NODE_COORDINATE.y)
    createLine(RIGHT_NODE_COORDINATE.x + 48, RIGHT_NODE_COORDINATE.y, WIDTH, RIGHT_NODE_COORDINATE.y)
    writeStationName(query.after, RIGHT_NODE_COORDINATE.x, RIGHT_NODE_COORDINATE.y + 144, true)
  }

  ctx.drawImage(LOGO, 24, HEIGHT - 24 - LOGO.height)

  const stream = canvas.createPNGStream()

  stream.pipe(res)
}

function createPoint (x = 0, y = 0) {
  return { x, y }
}
