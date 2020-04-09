$(function() {
    const calendarEl = document.getElementById('spark-calendar')

    const calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: ['dayGrid', 'interaction'],
        defaultView: 'dayGridMonth',
        events: [
            {
                id: 'aasdfxb23342lk3j1094',
                title: 'First Spark Event',
                start: '2020-04-09',
                end: '2020-04-09'
            },
            {
                id: 'asdlfkjlk124346asd',
                title: 'Second Spark Event',
                start: '2020-04-19',
                end: '2020-04-19'
            },
            {
                id: '231asdf32l4kjlk',
                title: 'Third Spark Event',
                start: '2020-04-29',
                end: '2020-04-29'
            }
        ],

        dateClick: function(info) {
            console.log(info)
        },

        eventClick: function(info) {
            console.log(info)
        }
    })

    calendar.render()
})