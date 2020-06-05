$(function() {
    $('#save').click(function() {
        $("#save-questions").find(':submit').click()
    })

    $('#grade').click(function() {
        MicroModal.show('grade-modal')
    })
})