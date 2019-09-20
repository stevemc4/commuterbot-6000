import axios from 'axios'
import stations from './stations'

function emitText () {
  const [line, color, name] = stations[Math.floor(Math.random() * stations.length)]
  const stationIndex = Math.floor(Math.random() * line.length)
  const station = line[stationIndex]
  let imageUrl = `https://commuterbot.now.sh/assets/images/commuterbot-generated.png?line=${name}&color=${color}&station=${station}`
  if (stationIndex > 0) imageUrl += `&before=${line[stationIndex - 1]}`
  if (stationIndex < line.length - 1) imageUrl += `&after=${line[stationIndex + 1]}`

  const announcementLines = [
    `Sesaat lagi Anda akan tiba di Stasiun ${station}. Pastikan tiket dan barang bawaan Anda tidak tertinggal dan perhatikan celah peron.`,
    `Stasiun berikutnya, Stasiun ${station}.`,
    `Stasiun ${station}. Hati-hati melangkah.`,
    `次は、${station}、${station}。お出口は${Math.random() >= 0.5 ? '左' : '右'}側です。`,
    `Next station, ${station} Station.`
  ]

  return [
    announcementLines[Math.floor(Math.random() * announcementLines.length)],
    imageUrl.replace(/ /g, '%20')
  ]
}

export default async function (req, res) {
  const [text, imageUrl] = emitText()

  try {
    if (req.query.ignorePostRequest === undefined) {
      await axios.post(process.env.IFTTT_TOKEN, {
        value1: text,
        value2: imageUrl
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
