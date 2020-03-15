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
        arrows: true,

        slidesToShow: 5,
        slidesToScroll: 5,

        infinite: true,
        speed: 1253,
      });
})