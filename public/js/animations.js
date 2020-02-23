const animations = {
    // === Entrance Animations === \\
    'fade-in': 'fade-in .75s cubic-bezier(0.390, 0.575, 0.565, 1.000) both',
    'slide-left': 'slide-left 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
    'slide-right': 'slide-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
    'slide-up': 'slide-up .5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
    'slide-down': 'slide-down 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
    'scale-up': 'scale-up 0.45s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
    'scale-down': 'scale-down 0.45s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',

    // === Idle Animations == \\
    'bounce': 'bounce 1.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) infinite both',

    // === Exit Animations == \\
    'fade-out': 'fade-out .75s cubic-bezier(0.390, 0.575, 0.565, 1.000) both',
    'slide-out-left': 'slide-out-left 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
    'slide-out-right': 'slide-out-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
    'slide-out-up': 'slide-out-up .5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
    'slide-out-down': 'slide-out-down 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
    'scale-out': 'scale-out 3s cubic-bezier(0.390, 0.575, 0.565, 1.000) both'
}

$(function() {
    // Parallax Backgrounds
    $.each($('[data-background="parallax"]'), function() {
        const $el = $(this)
        $el.addClass('parallax')

        const bgImage = $el.attr('data-background-image')
        if (bgImage)
            $el.attr('style', `background-image: url('${bgImage}')`)
    })

    // Scroll Buttons
    $.each($('[data-scroll]'), function() {
        const $el = $(this)
        const $scrollTo = $(`#${$el.attr('data-scroll')}`)

        if ($scrollTo.length === 0) throw new Error(`Scroll element with id: "${$el.attr('data-scroll')}" does not exist`)
        
        const scrollPos = $scrollTo[0].offsetTop
        const scrollDur = Number($el.attr('data-scroll-duration')) || 1000;

        $el.click(function() {
            $("html, body").animate({ scrollTop: scrollPos }, scrollDur);
        })
    })

    // Handle Animations
    $.each($('[data-transition]'), function() {
        const $el = $(this)
        const centered = $(window)[0].scrollY >= $el[0].offsetTop + $el[0].offsetHeight - $(window).height()

        if (centered) animate($el)
        else if ($el.attr('data-transition-scroll')) hide($el)
    })

    function hide($el) {
        $el.addClass('hidden')
        
        if ($el.attr('data-transition').indexOf('fade-in') === -1)
            $el.attr('data-transition', $el.attr('data-transition') + ' fade-in')
    }

    function animate($el) {
        // get transition, duration and delay properties from html
        const transition = $el.attr('data-transition').split(' ')
        let duration = $el.attr('data-transition-duration')
        let delay = $el.attr('data-transition-delay')

        // if duration or delay are null, create an empty array in their place
        duration = duration ? duration.split(' ') : Array(transition.length)
        delay = delay ? delay.split(' ') : Array(transition.length)

        // builds an inline style animation using animations in data-animation
        // applies animation classes
        let animation = 'animation: '
        for (let i = 0; i < transition.length; i++) {
            // if either duration or delay is length 1, use that value for all transitions
            let dur = duration.length === transition.length ? duration[i] : duration[0]
            let del = delay.length === transition.length ? delay[i] : delay[0]
            animation += (getAnimation(transition[i], dur, del) + ', ')
        }
        
        $el.addClass(transition)
        $el.attr('style', animation.slice(0, animation.length - 2))
        $el.removeAttr('data-transition')

        if ($el.attr('data-transition-exit')) {
            let timeout = `${duration[0]}`

            // if time is in miliseconds already just remove the ms
            if (timeout.indexOf('ms') !== -1)
                timeout = timeout.slice(0, timeout.indexOf('ms'))
            else if (timeout.indexOf('s') !== -1)
                timeout = Number(timeout.slice(0, timeout.length-1)) * 1000
            else 
                timeout = 1000
            
            console.log(timeout)

            setTimeout(function () {
                $el.css('display', 'none')
            }, timeout)
        }
    }

    function getAnimation(name, duration, delay) {
        // split on spaces to replace values if necessary
        let animation = animations[`${name}`]

        if (animation) animation = animation.split(' ')
        else throw new Error(`Animation "${name}" does not exist`)

        if (duration) animation[1] = duration
        if (delay) animation[6] = `${delay} both`
        
        // join array back into a string
        animation = animation.join(' ')

        return animation
    }

    // checks if an element should be animated every 200ms until all animations are complete
    function watchScroll() {
        let scrolling = false;
        $(window).scroll(() => scrolling = true)
        
        const watchScrollInterval = setInterval(() => {
            if (scrolling) {
                scrolling = false
                
                $.each($('[data-transition]'), function() {
                    const $el = $(this)
                    const inFocus = $(window)[0].scrollY >= $el[0].offsetTop + $el[0].offsetHeight - $(window).height()
                    
                    if (inFocus) animate($el)

                    if ($('[data-transition]').length === 0) clearInterval(watchScrollInterval)
                })
            }
        }, 200)
    }

    watchScroll()
})