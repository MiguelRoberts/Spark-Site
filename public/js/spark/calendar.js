$(function() {
    const calendarEl = document.getElementById('spark-calendar')

    const calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: ['dayGrid', 'interaction'],
        defaultView: 'dayGridMonth',
        events: '/api/events',

        dateClick: function(info) {
            const date = info.dateStr
            $('input#start').val(date)
            $('input#end').val(date)

            MicroModal.show('add-event-modal')
        },

        eventClick: function(info) {
            console.log(info)
            MicroModal.show('add-event-modal')
        }
    })

    $("#add-event-form").submit(function(e) {
        e.preventDefault()
       
        $.post('/api/events', {
            title: $('#title').val(),
            description: $('#description').val(),
            start: $('#start').val(),
            end: $('#end').val(),
            public: $('#public').is(":checked") ? true : false,
        }, data => location.reload())
    })

    calendar.render()

    MicroModal.init();

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(mutation => {
            if (mutation.attributeName === "class") {
                let attributeValue = $(mutation.target).prop(mutation.attributeName).split(' ')
                
                if (attributeValue.indexOf('is-open') === -1)
                    $("#spark-calendar").removeClass('back')
                else
                    $("#spark-calendar").addClass('back')
            }
        })
    })

    observer.observe($('#add-event-modal')[0], { attributes: true });
})