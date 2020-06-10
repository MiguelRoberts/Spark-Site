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
})