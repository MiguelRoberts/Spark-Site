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
    // ======== PARALLAX CODE ========== \\
    $.each($('[data-background="parallax"]'), function() {
        const $el = $(this)
        $el.addClass('parallax')

        const bgImage = $el.attr('data-background-image')
        if (bgImage)
            $el.attr('style', `background-image: url('${bgImage}')`)
    })

    // ========= CAROUSEL CODE ============== \\
    // Initialize Carousels
    $.each($('.carousel'), function() {
        const $el = $(this)

        // add navbar
        if ($el.attr('data-carousel-nav') !== 'false') { 
            let nav = '<div class="carousel-nav">'

            const $slides = $el.children('.carousel-container').children('.carousel-slides').children('.carousel-slide')

            $.each($slides, function(i) {
                if (i === 0) nav += '<button type="button" class="dot dot-active"></button>'
                else nav += '<button type="button" class="dot"></button>'
            })

            nav += '</div>'

            $el.append(nav)
        }
    })

    $('.carousel-button').click(function() {
        const $el = $(this)
        const $carousel = $el.parent('.carousel')

        if ($el.hasClass('carousel-button--left')) animateCarousel('left', $carousel)
        else animateCarousel('right', $carousel)
    })

    $('.carousel-nav .dot').click(function() {
        const $el = $(this)
        const $carousel = $el.parent('.carousel-nav').parent('.carousel')
        
        const index = $el.index()
        const slide = index === 0 ? 0 : index * -100

        console.log(slide)

        animateCarousel(slide, $carousel)
    })

    // Carousel Button Click
    function animateCarousel(slide, $carousel) { 
        const $nav = $carousel.children('.carousel-nav')
        const $slides = $carousel.children('.carousel-container').children('.carousel-slides')

        setTimeout(() => $carousel.trigger('slideStart'), 0)

        function getTranslateX($el) {
            const styles = $el.attr('style')
            const translatePos = styles && styles.indexOf('translateX')

            // if there is no translateX in styles string position is 0
            if (!translatePos || translatePos === -1) return 0

            // split the string to get the value of the translateX
            return Number(styles.substring(translatePos).split('(')[1].split(')')[0].split('%')[0])
        }

        const curPos = getTranslateX($slides)
        const minPos = 0
        const maxPos = ($slides.children('.carousel-slide').length - 1) * -100
        let endPos
        
        if (slide === "left") endPos = curPos + 100
        else if (slide === "right") endPos = curPos - 100 
        else endPos = slide

        if (endPos <= minPos && endPos >= maxPos)
            $slides.css({ 'transform': `translateX(${endPos}%)` })

        navIndex = Math.abs(getTranslateX($slides) / 100)

        console.log(navIndex)

        oldDot = $nav.children('.dot-active')
        newDot = $nav.children('.dot')[navIndex]
        
        $(oldDot).removeClass('dot-active')
        $(newDot).addClass('dot-active')

        setTimeout(() => {
            $carousel.trigger('slideComplete')
        }, 1500)
    }

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

        const centered = $el.css('display') !== 'none' && $(window)[0].scrollY >= $el[0].offsetTop + $el[0].offsetHeight - $(window).height()

        if (centered) animate($el)
        
        else if ($el.attr('data-transition-scroll') || $el.attr('data-transition').indexOf('fade-in') !== -1) hide($el)
    })

    // hide elements for fade in animation
    function hide($el) {
        $el.addClass('hidden')
        
        if ($el.attr('data-transition').indexOf('fade-in') === -1)
            $el.attr('data-transition', $el.attr('data-transition') + ' fade-in')
    }

    function animate($el) {
        // trigger "animationStart" event
        setTimeout(() => $el.trigger('animationStart'), 0)

        // get transition, duration and delay properties from html
        const transition = $el.attr('data-transition').split(' ')
        let duration = $el.attr('data-transition-duration')
        let delay = $el.attr('data-transition-delay')

        // if duration or delay are null, create an empty array in their place
        duration = duration ? duration.split(' ') : Array(transition.length)
        delay = delay ? delay.split(' ') : Array(transition.length)

        // build an inline style animation
        let animation = 'animation: '
        for (let i = 0; i < transition.length; i++) {
            // if either duration or delay is length 1, use that value for all transitions
            let dur = duration.length === transition.length ? duration[i] : duration[0]
            let del = delay.length === transition.length ? delay[i] : delay[0]
            animation += (getAnimation(transition[i], dur, del) + ', ')
        }
        
        $el.addClass(transition)
        $el.attr('style', animation.slice(0, animation.length - 2)) // remove the ", " at the end of the style attribute
        $el.removeAttr('data-transition')

        const timeout = getTimeoutDelay(duration, delay)

        //trigger 'animationComplete' event
        setTimeout(() => $el.trigger('animationComplete'), timeout)
    }

    function getTimeoutDelay(duration, delay) {
        // get maximum times
        let maxDur = Math.max.apply(0, duration) || 0
        let maxDel = Math.max.apply(0, delay) || 0

        // return timeout delay
        return maxDur + maxDel
    }

    function getAnimation(name, duration, delay) {
        // split on spaces to replace values if necessary
        let animation = animations[`${name}`]

        if (animation) animation = animation.split(' ')
        else throw new Error(`Animation "${name}" does not exist`)

        if (duration) animation[1] = duration + "ms"
        if (delay) animation[6] = `${delay}ms both`
        
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