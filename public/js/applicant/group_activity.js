function joinGroupActivity(id) {
    const { _id:user_id, firstname, lastname } = JSON.parse($("#userInfo").val())
    const url = `/api/application-details/group-activity/${id}/join`
    $.ajax({
        method: "POST",
        url,
        data: { user_id },
        dataType: 'JSON'
    })
    .done(function(data) {
        const $signedUp = $('.signed-up')
        if ($signedUp) {
            $signedUp.removeClass('signed-up')
            $signedUp.addClass('sign-up')
            $signedUp.text('Sign Up')

            $('li[data-me="true"]').remove()
        }

        const $signUp = $(`#${id}`)
        $signUp.removeClass('sign-up')
        $signUp.addClass('signed-up')
        $signUp.text("Signed Up")
        $(`#${id}-ul`).append(`<li data-me="true">${firstname} ${lastname}</li>`)
    })
    .fail(function(err) {
        console.log(err)
    })
}