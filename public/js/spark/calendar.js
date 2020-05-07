$(function() {
    const user = JSON.parse($("#userInfo").val())
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
            const d = new Date(Date.parse(info.event.start))
            const date = `${d.getFullYear()}-${("0"+(d.getMonth() + 1)).slice(-2)}-${("0"+d.getDate()).slice(-2)}`
            
            let event = {
                title: info.event.title,
                start: date,
                end: date,
                ...info.event.extendedProps
            }

            $('#event-id').val(`${event._id}`)
            $('#event-title').val(event.title)
            $('#event-description').val(event.description)
            $('#event-start').val(event.start)
            $('#event-end').val(event.end)
            

            if($('#event-public').is(":checked")) {
                if (!event.public) $("#event-public").trigger('click')
            } else {
                if (event.public) $("#event-public").trigger('click') 
            }
            
            if (event.owners.indexOf(user._id) === -1) {
                $('#event-title').attr('readonly', 'true')
                $('#event-title').addClass('uneditable')

                $('#event-description').attr('readonly', 'true')
                $('#event-description').addClass('uneditable')

                $('#event-start').attr('readonly', 'true')
                $('#event-start').addClass('uneditable')

                $('#event-end').attr('readonly', 'true')
                $('#event-end').addClass('uneditable')

                $('#event-public').click(function(event) { event.preventDefault() })

                $("#view-event-modal-submit-button").addClass('hidden')
                $("#view-event-modal-delete-button").addClass('hidden')
                $("#view-event-modal-close-button").text('Close')
            } else {
                $('#event-title').removeAttr('readonly')
                $('#event-title').removeClass('uneditable')

                $('#event-description').removeAttr('readonly')
                $('#event-description').removeClass('uneditable')

                $('#event-start').removeClass('uneditable')
                $('#event-end').removeClass('uneditable')

                $('#event-public').unbind('click')

                $("#view-event-modal-submit-button").removeClass('hidden')
                $("#view-event-modal-delete-button").removeClass('hidden')
                $("#view-event-modal-close-button").text('Cancel')
            }

            MicroModal.show('view-event-modal')
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

    $("#edit-event-form").submit(function(e) {
        e.preventDefault()

        data = {
            title: $('#event-title').val(),
            description: $('#event-description').val(),
            start: $('#event-start').val(),
            end: $('#event-end').val(),
            public: $('#event-public').is(":checked") ? true : false,
        }

        $.ajax({
            method: "POST",
            url: `/api/events/${$("#event-id").val()}?_method=PUT`,
            data,
            dataType: 'JSON'
        })
        .done(function(data) {
            location.reload()
        })
        .fail(function(err) {
            console.log(err)
        })
    })

    $("#view-event-modal-delete-button").click(function() {
        if(confirm('Are You Sure You Would Like to Delete This Event?'))
            $.ajax({
                method: "POST",
                url: `/api/events/${$("#event-id").val()}?_method=DELETE`,
                data: { id: user._id },
                dataType: 'JSON'
            })
            .done(function(data) {
                location.reload()
            })
            .fail(function(err) {
                console.log(err)
            })
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
    observer.observe($('#view-event-modal')[0], { attributes: true });
})