import axios from 'axios'
import stations from './stations'

function emitText () {
  const line = stations[Math.floor(Math.random() * stations.length)]
  const station = line[Math.floor(Math.random() * line.length)]
  
  const announcementLines = [
    `Sesaat lagi Anda akan tiba di Stasiun ${station}. Pastikan tiket dan barang bawaan Anda tidak tertinggal dan perhatikan celah peron.`,
    `Stasiun berikutnya, Stasiun ${station}.`,
    `Stasiun ${station}. Hati-hati melangkah.`
  ]

  return announcementLines[Math.floor(Math.random() * announcementLines.length)]
}

export default async function (_req, res) {
  const text = emitText()

  try {
    await axios.post(process.env.IFTTT_TOKEN, {
      value1: text
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    res.send(text)
  } catch (e) {
    console.log(e)
    res.send(e)
  }
}
