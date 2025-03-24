const firstWeekDay = +(input?.firstWeekDay ?? 1) % 7
const colours = ['#004949', '#009292', '#490092', '#162556', '#2e6b9c', '#48a9d9', '#240c66', '#743fba', '#a451c7', '#79100e', '#b32d2d', '#d1593a']
const fontSize = '12px'

// CSS styles
const cssTransparent = 'border:transparent;background:transparent;'
const cssTd = `font-size:${fontSize};padding: .5rem .5em 1.5rem;`
// const cssTdBlank = cssTd + 'background:transparent;border-left-color:transparent;border-right-color:transparent;'
const cssTdBlank = cssTd + 'background:transparent;'
const cssTr = cssTd + 'text-align:center;padding: .25rem;'
const cssNoPadding = 'margin:0;padding:0;'

let now = moment()

/**
 * Generate an HTML element
 * @param {string} element
 * @param {string|number|null} [contents]
 * @param {Object} [attributes]
 * @returns {string}
 */
function el(element, contents = '', attributes = {}) {
  return `<${element} ${Object.keys(attributes).map(k => k + `="${attributes[k]}"`).join(' ')}>${contents}</${element}>`
}

function createHeader(date) {
  return `
  <div style="display:flex;align-items:center;justify-content:space-between;">
    <h2>${date.format('MMMM YYYY')}</h2>
    <div style="display:flex;gap:.25rem;">
      <button><</button>
      <button>Today</button>
      <button>></button>
    </div>
  </div>
  `.replace(/\n/g, '').replace(/\s{2,}/g, '')
}

function createMonth(date) {
  const theMonth = moment(date).startOf('month')
  const endOfMonth = theMonth.clone().endOf('month')
  let html = ''
  html += createHeader(theMonth)
  html += '<table style="width:100%;">'

  // Day of the week header row
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  html += el('tr', [...weekdays, ...weekdays].slice(firstWeekDay, firstWeekDay + 7).map(day => el('th', day, { style: cssTr })).join(''))
  // Blank cells at start of month
  const colspan_before = (+theMonth.format('E') + 7 - firstWeekDay) % 7
  html += '<tr>' + el('td', '&nbsp;', { style: cssTdBlank, colspan: colspan_before })
  // Render the month
  const lastDay = ~~endOfMonth.format('D')
  for (let i = 0; i < lastDay; i++) {
    const day = theMonth.clone().add(i, 'days'),
      today = day.isSame(now, 'day') ? 'background:#FFA664;color:black;' : null,
      colour = today || 'opacity:0.3;'
    html += el('td', i + 1, { style: cssTd + colour })
    if ((+day.format('E') + (7 - firstWeekDay)) % 7 == 6) html += '</tr><tr>'
    const colspan_after = +day.format('E') + 1 === firstWeekDay ? 0 : 7
    if (i + 1 == lastDay && colspan_after != 0) html += el('td', '&nbsp;', { style: cssTdBlank, colspan: colspan_after })
  }
  html += '</tr></table>'

  return html
}

// Generate the calendar
let html = `<table style="width:100%;${cssTransparent}">`
const startMonth = now.clone().startOf('month')
html += el('tr', el('td', createMonth(startMonth), { style: cssTransparent }), { style: cssNoPadding })
html += '</table>'
dv.el('div', html)
