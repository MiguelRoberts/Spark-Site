$(function() {
    $('td.group a').click(function() {
        const url = `/spark/applications/group-interview/${$(this).attr('id')}/grade`
        console.log(url)
        MicroModal.show('grade-modal')
    })
})