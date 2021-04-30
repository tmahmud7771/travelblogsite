const responsive = {
    0 :{
        items:1
    }, 
    375:{
       items:1
    },
    560: {
        items:2
    },
    960: {
        items:3
    }
}

$(document).ready(function(){
    $('.toggle-collapse').on('click', function () {
        $('.nav').toggleClass('collapse')
        $('.pro-picture').toggleClass('hide')
    });

    //carosule
    $('.owl-carousel').owlCarousel({
        loop:true,
        autoplay:true,
        autoTimeout:3500,
        dots:false,
        nav:true,
        responsive: responsive
    });
        // click to scroll top
        $('.move-up span').click(function () {
            $('html, body').animate({
                scrollTop: 0
            }, 1000);
        })
    
        // AOS Instance
        AOS.init();
        //login 
        $("#create").click(function () {
            $('.form-register').css("display","block");
            $('.form-login').css("display","none");
        });

        $("#onclickbio").click(function(){
            $('.bio').css('display','block')
        })

})

