$(function() {
    // ADDABLE SCRIPTS
    function fillAddables() {
        $.each($('.addable'), function() {
            const $el = $(this)
            
            if ($el.attr('data-custom') === 'true') return

            const $content = $el.children('.addable__body').children('.addable__content')
            const url = $el.attr('data-api')

            $.ajax({
                method: "GET",
                url,
                dataType: 'JSON'
            })
            .done(function(data) {
                if (data.elements) addElement.call($content, data.elements, true)
            })
            .fail(function(err) {
                console.log(err)
            })
        })
    }

    fillAddables()

    // click enter in input
    $('.addable__input input').keydown(function(e) {
        if ($(this).parent().parent().parent().attr('data-custom') === 'true') return
        if (e.keyCode === 13) {
            const $input = $(this)
            const element = $input.val()
            const $content = $input.parent('.addable__input').prev('.addable__content')

            addElement.call($content, element)
            $input.val('')
        }

    })

    // click add element button
    $('.addable__input button').click(function() {
        if ($(this).parent().parent().parent().attr('data-custom') === 'true') return
        const $el = $(this)
        const $content = $el.parent().prev('.addable__content')
        const $input = $el.prev('input')
        const element = $input.val()

        addElement.call($content, element)

        $input.val('')
    })

    $('.addable__content').delegate('.remove-element', 'click', removeElement)
    $('.addable__header button').click(removeAllElements)

    function addElement(element, init=false) {
        const $content = $(this)

        if (typeof element === "object") {
            element.forEach(e => {
                $content.append(`
                    <div class="addable__content__element">
                        <p>${e}</p>
                        <button class="remove-element">Remove</button>
                    </div>
                `)
            })

            if (!init) updateElements.call($el.parent('.addable__body').parent('.addable'))
        } else if (element) {
            $content.append(`
                <div class="addable__content__element">
                    <p>${element}</p>
                    <button class="remove-element">Remove</button>
                </div>
            `)

            if (!init) updateElements.call($content.parent('.addable__body').parent('.addable'))
        }
    }

    function removeElement() {
        const $el = $(this)
        const $element = $el.parent()
        
        const $addable = $el.parent('.addable__content__element').parent('.addable__content').parent('.addable__body').parent('.addable')
        $element.remove()

        updateElements.call($addable)
    }

    function removeAllElements() {
        const $el = $(this)
        const $content = $el.parent().next('.addable__body').children('.addable__content')

        $content.empty()

        updateElements.call($el.parent('.addable__header').parent('.addable'))
    }

    function updateElements() {
        const $addable = $(this)
        const $elements = $addable.children('.addable__body').children('.addable__content')
        
        const url = $addable.attr('data-api')
        let elements = []
        
        $.each($elements.children(), function() {
            elements.push($(this).children('p').text())
        })

        $.ajax({
            method: "POST",
            url,
            data: { elements },
            dataType: 'JSON'
        })
        .done(function(data) {
            console.log(data)
        })
        .fail(function(err) {
            console.log(err)
        })
    }

    // CUSTOM ADDABLE SCRIPTS
    
    // written deadline
    function fillWrittenDeadline() {
        const url = $("#written-deadline").attr('data-api')

        $.ajax({
            method: "GET",
            url,
            dataType: 'JSON'
        })
        .done(function(data) {
            if (JSON.stringify(data) !== JSON.stringify({}))
                $("#written-deadline input").val(data.deadline)
        })
        .fail(function(err) {
            console.log(err)
        })
    }

    fillWrittenDeadline()
    
    $("#written-deadline button").click(function() {
        const deadline = $("#written-deadline input").val()
        if (!deadline) return
        
        const url = $("#written-deadline").attr('data-api')
        $.ajax({
            method: "POST",
            url,
            data: { deadline },
            dataType: 'JSON'
        })
        .done(function(data) {
            console.log(data)
        })
        .fail(function(err) {
            console.log(err)
        })
    })

    // group interview dates
    $("#add-group-interview-button").click(function() {
        MicroModal.show('add-group-interview-modal')
    })

    // group activity dates
    $("#add-group-activity-button").click(function() {
        MicroModal.show('add-group-activity-modal')
    })
})

$("#add-group-interview-modal-form").submit(function(e) {
    e.preventDefault()

    const url =  $(this).attr('action')
    const name = "Group Interview"
    const date = $("#date").val()
    const time = $("#mods").val()
    const room = $("#room").val()

    $.ajax({
        method: "POST",
        url,
        data: { name, date, time, room },
        dataType: 'JSON'
    })
    .done(function(data) {
        fillGroupInterviews()
    })
    .fail(function(err) {
        console.log(err)
    })
})

$("#add-group-activity-modal-form").submit(function(e) {
    e.preventDefault()

    const url =  $(this).attr('action')
    const name = "Group Activity"
    const date = $("#activity-date").val()
    const room = $("#activity-room").val()
    const time = $("#activity-time").val()

    $.ajax({
        method: "POST",
        url,
        data: { name, date, room, time },
        dataType: 'JSON'
    })
    .done(function(data) {
        fillGroupActivities()
    })
    .fail(function(err) {
        console.log(err)
    })
})

function fillGroupInterviews() {
    const $content = $("#group-interview-dates").children('.addable__body').children('.addable__content')
    $content.empty()

    const url = $("#group-interview-dates").attr('data-api')

    $.ajax({
        method: "GET",
        url,
        dataType: 'JSON'
    })
    .done(function(data) {
        if (data.groups.length > 0) {
            data.groups.forEach(({ date, time, room, leaders, _id:id }) => {
                const { _id:user_id } = JSON.parse($("#userInfo").val())
                let $joinButton = `<button class="join" onclick="joinGroupInterview('${id}')">Join</button>` 

                if (leaders.indexOf(user_id) !== -1)
                    $joinButton = `<button class="joined" onclick="joinGroupInterview('${id}')">Joined</button>`
                else if (leaders.length === 5)
                    $joinButton = `<button class="full">Full</button>`

                $content.append(`
                    <div class="addable__content__elements" id="${id}">
                        <div class="info">
                            <p>Date: ${date}</p>
                            <div class="mods-room">
                                <p>Mods: ${time}</p>
                                <p>Room: ${room}</p>
                            </div>
                        </div>
                        
                        <div class="actions">
                            ${$joinButton}
                            <button class="delete" onclick="deleteGroupInterview('${id}')">Delete</button>
                        </div>
                    </div>
                `)
            })
        }
    })
    .fail(function(err) {
        console.log(err)
    })
}

fillGroupInterviews()

function fillGroupActivities() {
    const $content = $("#group-activity-dates").children('.addable__body').children('.addable__content')
    $content.empty()

    const url = $("#group-activity-dates").attr('data-api')

    $.ajax({
        method: "GET",
        url,
        dataType: 'JSON'
    })
    .done(function(data) {
        if (data.groups.length > 0) {
            data.groups.forEach(({ date, time, room, leaders, _id:id }) => {
                $content.append(`
                    <div class="addable__content__elements" id="${id}">
                        <div class="info">
                            <p>Date: ${date}</p>
                            <div class="room-time">
                                <p>Room: ${room}</p>
                                <p>Time: ${time}</p>
                            </div>
                        </div>
                        
                        <div class="actions">
                            <button class="delete" onclick="deleteGroupActivity('${id}')">Delete</button>
                        </div>
                    </div>
                `)
            })
        }
    })
    .fail(function(err) {
        console.log(err)
    })
}

fillGroupActivities()

function joinGroupInterview(id) {
    const url = `/api/application-details/group-interview/${id}/join`
    const { _id:user_id, leader_data } = JSON.parse($("#userInfo").val())

    $.ajax({
        method: "POST",
        url,
        data: { user_id, leader_data },
        dataType: 'JSON'
    })
    .done(function(data) {
        const $joined = $('.joined')
        if ($joined) {
            $joined.removeClass('joined')
            $joined.addClass('join')
            $joined.text('Join')
        }

        const $join = $(`#${id}`).children('.actions').children(".join")
        $join.removeClass('join')
        $join.addClass('joined')
        $join.text("Joined")
    })
    .fail(function(err) {
        console.log(err)
    })
}

function deleteGroupInterview(id) {
    const url = `/api/application-details/group-interview/${id}/delete?_method=delete`
    $.ajax({
        method: "POST",
        url
    })
    .done(function(data) {
        $(`#${id}`).remove()
    })
    .fail(function(err) {
        console.log(err)
    })
}

function deleteGroupActivity(id) {
    const url = `/api/application-details/group-activity/${id}/delete?_method=delete`
    $.ajax({
        method: "POST",
        url
    })
    .done(function(data) {
        $(`#${id}`).remove()
    })
    .fail(function(err) {
        console.log(err)
    })
}