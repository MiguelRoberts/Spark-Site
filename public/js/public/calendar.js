const calendarEl = document.getElementById('spark-calendar')

const calendar = new FullCalendar.Calendar(calendarEl, {
    plugins: ['dayGrid', 'interaction'],
    defaultView: 'dayGridMonth',
    events: '/api/events/public',
})

calendar.render()