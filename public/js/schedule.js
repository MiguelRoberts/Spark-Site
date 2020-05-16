$(function() {
    $(".mod").click(function() {
        if ($('.schedule')[0].hasAttribute('data-uneditable')) return
        
        const $el = $(this)
        if ($el.hasClass('wednesday')) return

        $el.toggleClass('selected')
    })

    $("#save-schedule").click(function() {
        const url = $('.schedule').attr('data-post-url')
        let schedule = {
            monday: [],
            tuesday: [],
            thursday: [],
            friday: []
        }

        $.each($('.selected'), function() {
            const day = $(this).attr('data-day')
            const mod = Number($(this).html())
            
            schedule[day].push(mod)
        })

        $.ajax({
            method: "POST",
            url,
            data: { schedule },
            dataType: 'JSON'
        })
        .done(function(data) {
            $("html, body").animate({ scrollTop: 0 }, 400);

            $('.success').css({ display: 'block'})
            setTimeout(function() {
                $('.success').fadeOut(500)
            }, 2000)
        })
        .fail(function(err) {
            $("html, body").animate({ scrollTop: 0 }, 400);

            $('.error').css({ display: 'block'})
            setTimeout(function() {
                $('.error').fadeOut(500)
            }, 2000)
        })
    })
})