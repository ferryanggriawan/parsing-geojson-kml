const fs = require("fs")
const readline = require("readline")
const polygonCenter = require("geojson-polygon-center")

const satria3 = require("./SATRIA_03.json")
const satria4 = require("./SATRIA_04.json")
const satria5 = require("./SATRIA_05.json")
const allsatria = require("./result/allsatria.json")

try {
  writeStaria3()
  writeStaria4()
  writeStaria5()
  writeBeamConstant()
  parsingKml()
} catch (error) {
  console.log(error)
}

async function parsingKml() {
  const lineReader = readline.createInterface({
    input: fs.createReadStream("./allsatria.kml"),
  })

  let content = ""
  const fileStream = fs.createReadStream("./allsatria.kml")
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  })

  for await (const line of rl) {
    const regex = /<name>.+<+\/name>/gm
    const textToReplace = line.match(regex)
    let t = line
    if (textToReplace != null) {
      const coordinate = createCoordinate(textToReplace[0])
      const temp = `${textToReplace[0]} ${coordinate}`

      t = line.replace(textToReplace[0], temp)
    }

    content = content + "\n" + t
  }

  fs.writeFileSync("./result/allsatria.kml", content)
}

function createCoordinate(line = "") {
  const name = findName(line)
  const idx = allsatria.features.findIndex((val) => val.properties.name == name)

  const feature = allsatria.features[idx]
  const lat = feature.properties.center[1]
  const lng = feature.properties.center[0]

  return `<center>${lng}, ${lat}</center>`
}

function findName(line = "") {
  const name = line.replace("<name>", "").replace("</name>", "")

  return name
}

function writeStaria3() {
  const file_title = `allsatria.geojson`
  const path = `./result/${file_title}`
  const features = []

  satria3.features.forEach((feature, index) => {
    if (feature.geometry.type == "Polygon") {
      feature.properties["center"] = polygonCenter(feature.geometry).coordinates
      feature.properties["name"] = `New LC 2 - 03 ${index + 1}`
      features.push(feature)
    }
  })
  satria4.features.forEach((feature, index) => {
    if (feature.geometry.type == "Polygon") {
      feature.properties["center"] = polygonCenter(feature.geometry).coordinates
      feature.properties["name"] = `New LC 2 - 04 ${index + 1}`
      features.push(feature)
    }
  })
  satria5.features.forEach((feature, index) => {
    if (feature.geometry.type == "Polygon") {
      feature.properties["center"] = polygonCenter(feature.geometry).coordinates
      feature.properties["name"] = `New LC 2 - 05 ${index + 1}`
      features.push(feature)
    }
  })

  const content = {
    type: "FeatureCollection",
    features: features,
  }

  fs.writeFileSync(path, JSON.stringify(content))
}

function writeStaria4() {
  satria4.features.forEach((feature, index) => {
    if (feature.geometry.type == "Polygon") {
      const file_title = `nlc2-04-${index + 1}.geojson`
      const path = `./result/${file_title}`
      const content = {
        type: "FeatureCollection",
        features: [feature],
      }

      fs.writeFileSync(path, JSON.stringify(content))
    }
  })
}

function writeStaria5() {
  satria5.features.forEach((feature, index) => {
    if (feature.geometry.type == "Polygon") {
      const file_title = `nlc2-05-${index + 1}.geojson`
      const path = `./result/${file_title}`
      const content = {
        type: "FeatureCollection",
        features: [feature],
      }

      fs.writeFileSync(path, JSON.stringify(content))
    }
  })
}

function writeBeamConstant() {
  const file_title = `spotbeams.json`
  const path = `./result/${file_title}`
  const beams = []

  satria3.features.forEach((feature, index) => {
    if (feature.geometry.type == "Polygon") {
      const id = `nlc2-03-${index + 1}`
      const alias = `New LC 2 - 03 ${index + 1}`
      const name = `Satria 03 ${index + 1}`
      const beam = {
        beam_id: id,
        beam_alias: alias,
        beam_name: name,
      }

      beams.push(beam)
    }
  })
  satria4.features.forEach((feature, index) => {
    if (feature.geometry.type == "Polygon") {
      const id = `nlc2-04-${index + 1}`
      const alias = `New LC 2 - 04 ${index + 1}`
      const name = `Satria 04 ${index + 1}`
      const beam = {
        beam_id: id,
        beam_alias: alias,
        beam_name: name,
      }

      beams.push(beam)
    }
  })
  satria5.features.forEach((feature, index) => {
    if (feature.geometry.type == "Polygon") {
      const id = `nlc2-05-${index + 1}`
      const alias = `New LC 2 - 05 ${index + 1}`
      const name = `Satria 05 ${index + 1}`
      const beam = {
        beam_id: id,
        beam_alias: alias,
        beam_name: name,
      }

      beams.push(beam)
    }
  })

  const content = {
    beams: beams,
  }

  fs.writeFileSync(path, JSON.stringify(content))
}
