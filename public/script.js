const HungaryPop = 9773000

const init = async () => {
  const rawData = await fetch('/api/data')
  const dataJson = await rawData.json()
  
  for (let prop in dataJson) {
    if (document.querySelector(`p#${prop}`)) {
      document.querySelector(`p#${prop}`).innerText = dataJson[prop]
    } else if (document.querySelector(`time#${prop}`)) {
      document.querySelector(`time#${prop}`).dateTime = dataJson[prop]
      const updated = new Date(dataJson[prop])
      document.querySelector(`time#${prop}`).innerText = `${updated.getFullYear()}-${updated.getMonth() + 1}-${updated.getDate()} @ ${updated.getHours()}:${updated.getMinutes()}`
    }
  }
  
  const totalInfections = dataJson.infected + dataJson.healed + dataJson.dead
  
  document.querySelector('#inf-perc').innerText = (totalInfections / HungaryPop).toPrecision(2) + "%"
  document.querySelector('#hea-perc').innerText = (dataJson.healed / totalInfections).toPrecision(2) + "%"
  document.querySelector('#dea-perc').innerText = (dataJson.dead / totalInfections).toPrecision(2) + "%"
  document.querySelector('#qua-perc').innerText = (dataJson.quarantined / HungaryPop).toPrecision(2) + "%"
  document.querySelector('#sam-perc').innerText = (totalInfections / dataJson.samples).toPrecision(2) + "%"
}

init()