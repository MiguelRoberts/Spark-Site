$(function() {
    const token = window.location.search.slice(1).split('=')[1]

    $.post( `/api/users/reset_password?token=${token}`, { checkToken: true }, function( data ) {
        if (data.type === 'error') 
           $('.invalid-url').removeClass('hidden')

        else $('.container').removeClass('hidden')
    })

    $('form').submit(function(e) {
        e.preventDefault()

        const passwordInputs = $('[name="password"]')
        const password = [$(passwordInputs[0]).val(), $(passwordInputs[1]).val()]

        $.post( `/api/users/reset_password?token=${token}`, { password }, function( data ) {
            if (data.type === 'success') {
                $('.reset-notification.reset-error').addClass('hidden')
                $('form').addClass('hidden')
                $('.reset-notification.reset-success').removeClass('hidden')
            } else if (data.type === 'error') {
                $('.reset-notification.reset-error').html(data.msg)
                $('.reset-notification.reset-error').removeClass('hidden')
            }

        })
    })
})