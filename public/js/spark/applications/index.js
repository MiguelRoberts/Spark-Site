$(function() {
    $('td.group a').click(function() {
        const url = `/spark/applications/group-interview/${$(this).attr('id')}/grade`
        $("#grade-modal-form").attr('action', url)
        $.ajax({
            method: "GET",
            url,
            dataType: 'JSON'
        })
        .done(function(data) {
            const { grades, comments="" } = data
            const $inputs = $(".group-interview-category")

            if (grades.length === $inputs.length)
                $.each($inputs, function(i) {
                    $(this).val(grades[i])
                })
            
            $("#comments").text(comments)
        })
        .fail(function(err) {
            console.log(err)
        })

        MicroModal.show('grade-modal')
    })
})