$(function() {
    const calendarEl = document.getElementById('spark-calendar')

    const calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: ['dayGrid', 'interaction'],
        defaultView: 'dayGridMonth',
        events: '/api/events',

        dateClick: function(info) {
            console.log(info)
        },

        eventClick: function(info) {
            console.log(info)
        }
    })

    calendar.render()
})