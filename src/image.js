import { createCanvas, registerFont, loadImage } from 'canvas'
import url from 'url'

export default async function (req, res) {
  const uri = new url.URL(req.url, 'https://0.0.0.0/')
  const query = uri.searchParams

  const WIDTH = 1200
  const HEIGHT = 630
  const FONT_PATH = `${__dirname}/assets/fonts/Nunito-Regular.ttf`
  const LOGO = await loadImage(`${__dirname}/assets/images/logo.png`)
  const COLOR = `#${query.get('color') || '1565C0'}`


  registerFont(FONT_PATH, {
    family: 'Nunito'
  })
  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')

  ctx.save()

  function createStationNode (x, y, isCurrentStation = false) {
    ctx.strokeStyle = COLOR
    ctx.beginPath()
    ctx.ellipse(x, y, 64, 64, 0, 0, 360)
    ctx.lineWidth = 32
    ctx.stroke()
    if (isCurrentStation) {
      ctx.closePath()
      ctx.beginPath()
      ctx.ellipse(x, y, 32, 32, 0, 0, 360)
      ctx.fillStyle = COLOR
      ctx.fill()
    }
    ctx.closePath()
    ctx.restore()
  }

  function createLine (x1, y1, x2, y2) {
    ctx.strokeStyle = COLOR
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.lineWidth = 24
    ctx.stroke()
    ctx.closePath()
    ctx.restore()
  }

  function createTerminus (x, y) {
    ctx.strokeStyle = COLOR
    ctx.beginPath()
    ctx.moveTo(x, y - 48)
    ctx.lineTo(x, y + 48)
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
    ctx.fillStyle = '#23374D'
    ctx.fillText(text, XPOS, y)
    ctx.restore()
  }

  function writeLineName (text) {
    ctx.font = '32px Nunito'
    const textMeasurement = ctx.measureText(`Lin ${text}`)
    const XPOS = WIDTH - 24 - textMeasurement.width
    ctx.fillStyle = '#1565C0'
    ctx.fillText(`Lin ${text}`, XPOS, HEIGHT - 24 - 16)
    ctx.restore()
  }

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, 1200, 630)

  ctx.restore()

  const CENTER_NODE_COORDINATE = createPoint(WIDTH / 2, HEIGHT / 2 - 72)
  const LEFT_NODE_COORDINATE = createPoint(WIDTH / 2 - 384 - 96, HEIGHT / 2 - 72)
  const RIGHT_NODE_COORDINATE = createPoint(WIDTH / 2 + 384 + 96, HEIGHT / 2 - 72)

  createStationNode(CENTER_NODE_COORDINATE.x, CENTER_NODE_COORDINATE.y, true)
  writeStationName(query.get('station'), CENTER_NODE_COORDINATE.x, CENTER_NODE_COORDINATE.y + 144)
  writeStationName('Stasiun Berikutnya', CENTER_NODE_COORDINATE.x, CENTER_NODE_COORDINATE.y + 184, true)

  if (query.get('before')) {
    createLine(LEFT_NODE_COORDINATE.x + 48, LEFT_NODE_COORDINATE.y, CENTER_NODE_COORDINATE.x - 48, CENTER_NODE_COORDINATE.y)
    createStationNode(LEFT_NODE_COORDINATE.x, LEFT_NODE_COORDINATE.y)
    createLine(LEFT_NODE_COORDINATE.x - 48, LEFT_NODE_COORDINATE.y, 0, LEFT_NODE_COORDINATE.y)
    writeStationName(query.get('before'), LEFT_NODE_COORDINATE.x, LEFT_NODE_COORDINATE.y + 144, true)
  } else {
    createLine(LEFT_NODE_COORDINATE.x + 256 + 48, LEFT_NODE_COORDINATE.y, CENTER_NODE_COORDINATE.x - 48, CENTER_NODE_COORDINATE.y)
    createTerminus(LEFT_NODE_COORDINATE.x + 256 + 48, LEFT_NODE_COORDINATE.y)
  }

  if (query.get('after')) {
    createLine(RIGHT_NODE_COORDINATE.x - 48, RIGHT_NODE_COORDINATE.y, CENTER_NODE_COORDINATE.x + 48, CENTER_NODE_COORDINATE.y)
    createStationNode(RIGHT_NODE_COORDINATE.x, RIGHT_NODE_COORDINATE.y)
    createLine(RIGHT_NODE_COORDINATE.x + 48, RIGHT_NODE_COORDINATE.y, WIDTH, RIGHT_NODE_COORDINATE.y)
    writeStationName(query.get('after'), RIGHT_NODE_COORDINATE.x, RIGHT_NODE_COORDINATE.y + 144, true)
  } else {
    createLine(RIGHT_NODE_COORDINATE.x - 256 - 48, RIGHT_NODE_COORDINATE.y, CENTER_NODE_COORDINATE.x + 48, CENTER_NODE_COORDINATE.y)
    createTerminus(RIGHT_NODE_COORDINATE.x - 256 - 48, RIGHT_NODE_COORDINATE.y)
  }

  ctx.drawImage(LOGO, 24, HEIGHT - 24 - LOGO.height)
  if (query.get('line'))
    writeLineName(query.get('line'))

  const stream = canvas.createPNGStream()

  stream.pipe(res)
}

function createPoint (x = 0, y = 0) {
  return { x, y }
}
