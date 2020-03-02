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

    $(".leaders-carousel").slick({
        dots: true,
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 7
      });
})