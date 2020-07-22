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
      document.querySelector(`time#${prop}`).innerText = `${(updated.getFullYear()+"").padStart(2,0)}-${(updated.getMonth() + 1 + "").padStart(2,0)}-${(updated.getDate() + "").padStart(2, 0)} @ ${(updated.getHours() + "").padStart(2, '0')}:${(updated.getMinutes() + "").padStart(2, '0')}`
    }
  }
  
  const totalInfections = parseInt(dataJson.infected,10)
  const healed = parseInt(dataJson.healed,10)
  const dead = parseInt(dataJson.dead,10)
  document.querySelector('#inf-perc').innerText = (100 * (totalInfections / HungaryPop)).toPrecision(2) + "%"
  document.querySelector('#hea-perc').innerText = (100 *  healed / totalInfections).toPrecision(2) + "%"
  document.querySelector('#dea-perc').innerText = (100 *  dead / totalInfections).toPrecision(2) + "%"
}

init()