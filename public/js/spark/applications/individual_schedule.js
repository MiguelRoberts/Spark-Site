$(function() {
    const user = JSON.parse($("#userInfo").val())

    $("#interviewer_id").val(`${user._id}`)

    $("#schedule-interview").click(function() {
        MicroModal.show('schedule-interview-modal')
    })
})