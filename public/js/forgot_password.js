$(function() {
    $('form').submit(function(e) {
        e.preventDefault()

        const email = $('[name="email"]').val()

        $.post( "/api/users/send_reset_email", { email }, function( data ) {
            console.log(data)
            if (data.type === 'success') {
                $('.submit-notification.submit-error').addClass('hidden')
                $('form').addClass('hidden')
                $('.submit-notification.submit-success').removeClass('hidden')
            } else if (data.type === 'error') {
                $('.submit-notification.submit-error').html(data.msg)
                $('.submit-notification.submit-error').removeClass('hidden')
            }
        })
    })
})