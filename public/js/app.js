$(function() {
    // waypoint for nav
    $('#about').waypoint(function(direction) {
        if (direction == "down")
            $('nav.sticky').removeClass('hidden')

        else 
            $('nav.sticky').addClass('hidden')
    }, {
        offset: 40
    })
})