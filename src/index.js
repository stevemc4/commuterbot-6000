import axios from 'axios'
import stations from './stations'

function emitText () {
  const line = stations[Math.floor(Math.random() * stations.length)]
  const station = line[Math.floor(Math.random() * line.length)]

  const announcementLines = [
    `Sesaat lagi Anda akan tiba di Stasiun ${station}. Pastikan tiket dan barang bawaan Anda tidak tertinggal dan perhatikan celah peron.`,
    `Stasiun berikutnya, Stasiun ${station}.`,
    `Stasiun ${station}. Hati-hati melangkah.`,
    `次は、${station}、${station}。お出口は${Math.random() >= 0.5 ? '左' : '右'}側です。`,
    `Next station, ${station} Station.`
  ]

  return announcementLines[Math.floor(Math.random() * announcementLines.length)]
}

export default async function (req, res) {
  const text = emitText()

  try {
    if (req.query.ignorePostRequest === undefined) {
      await axios.post(process.env.IFTTT_TOKEN, {
        value1: text
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
    res.send(text)
  } catch (e) {
    console.log(e)
    res.send(e)
  }
}
