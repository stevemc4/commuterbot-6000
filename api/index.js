"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _axios = _interopRequireDefault(require("axios"));

var _stations = _interopRequireDefault(require("./stations"));

function emitText() {
  const line = _stations.default[Math.floor(Math.random() * _stations.default.length)];

  const station = line[Math.floor(Math.random() * line.length)];
  return `Sesaat lagi Anda akan tiba di Stasiun ${station}.
Pastikan tiket dan barang bawaan Anda tidak tertinggal dan perhatikan celah peron.`;
}

async function _default(_req, res) {
  const text = emitText();

  try {
    await _axios.default.post(process.env.IFTTT_TOKEN, {
      value1: text
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    res.send(text);
  } catch (e) {
    console.log(e);
    res.send(e);
  }
}