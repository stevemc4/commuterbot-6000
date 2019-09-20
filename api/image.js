"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _canvas = require("canvas");

var _url = _interopRequireDefault(require("url"));

async function _default(req, res) {
  const WIDTH = 1200;
  const HEIGHT = 630;
  const FONT_PATH = `${__dirname}/assets/fonts/Nunito-Regular.ttf`;
  const LOGO = await (0, _canvas.loadImage)(`${__dirname}/assets/images/logo.png`);

  const {
    query
  } = _url.default.parse(req.url, true);

  (0, _canvas.registerFont)(FONT_PATH, {
    family: 'Nunito'
  });
  const canvas = (0, _canvas.createCanvas)(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');
  ctx.save();

  function createStationNode(x, y, isCurrentStation = false) {
    ctx.strokeStyle = '#1565C0';
    ctx.beginPath();
    ctx.ellipse(x, y, 48, 48, 0, 0, 360);
    ctx.lineWidth = 24;
    ctx.stroke();

    if (isCurrentStation) {
      ctx.closePath();
      ctx.beginPath();
      ctx.ellipse(x, y, 24, 24, 0, 0, 360);
      ctx.fillStyle = '#1565C0';
      ctx.fill();
    }

    ctx.closePath();
    ctx.restore();
  }

  function createLine(x1, y1, x2, y2) {
    ctx.strokeStyle = '#1565C0';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = 24;
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }

  function writeStationName(text, x, y, smaller = false) {
    ctx.font = '32px Nunito';
    if (smaller) ctx.font = '24px Nunito';
    const textMeasurement = ctx.measureText(text);
    const XPOS = x - textMeasurement.width / 2;
    ctx.fillStyle = '#1565C0';
    ctx.fillText(text, XPOS, y);
    ctx.restore();
  }

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 1200, 630);
  ctx.restore();
  const CENTER_NODE_COORDINATE = createPoint(WIDTH / 2, HEIGHT / 2);
  const LEFT_NODE_COORDINATE = createPoint(WIDTH / 2 - 256 - 96, HEIGHT / 2);
  const RIGHT_NODE_COORDINATE = createPoint(WIDTH / 2 + 256 + 96, HEIGHT / 2);
  createStationNode(CENTER_NODE_COORDINATE.x, CENTER_NODE_COORDINATE.y, true);
  createStationNode(LEFT_NODE_COORDINATE.x, LEFT_NODE_COORDINATE.y);
  createStationNode(RIGHT_NODE_COORDINATE.x, RIGHT_NODE_COORDINATE.y);
  createLine(LEFT_NODE_COORDINATE.x + 48, LEFT_NODE_COORDINATE.y, CENTER_NODE_COORDINATE.x - 48, CENTER_NODE_COORDINATE.y);
  createLine(RIGHT_NODE_COORDINATE.x - 48, RIGHT_NODE_COORDINATE.y, CENTER_NODE_COORDINATE.x + 48, CENTER_NODE_COORDINATE.y);
  writeStationName(query.station, CENTER_NODE_COORDINATE.x, CENTER_NODE_COORDINATE.y + 144);
  writeStationName(query.before, LEFT_NODE_COORDINATE.x, LEFT_NODE_COORDINATE.y + 144, true);
  writeStationName(query.after, RIGHT_NODE_COORDINATE.x, RIGHT_NODE_COORDINATE.y + 144, true);
  writeStationName('Stasiun Saat Ini', CENTER_NODE_COORDINATE.x, CENTER_NODE_COORDINATE.y + 184, true);
  ctx.drawImage(LOGO, 24, HEIGHT - 24 - LOGO.height);
  const stream = canvas.createPNGStream();
  stream.pipe(res);
}

function createPoint(x = 0, y = 0) {
  return {
    x,
    y
  };
}