
  $(function () {

    // MENU
    $('.navbar-collapse a').on('click',function(){
      $(".navbar-collapse").collapse('hide');
    });

    // AOS ANIMATION
    AOS.init({
      disable: 'mobile',
      duration: 800,
      anchorPlacement: 'center-bottom'
    });


    // SMOOTHSCROLL NAVBAR
    $(function() {
      $('.navbar a, .hero-text a').on('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top - 49
        }, 1000);
        event.preventDefault();
      });
    });    
  });

  function openBlog1() {
    window.open('https://www.nerdfitness.com/blog/how-to-build-your-own-workout-routine/','_blank')
  }
  function openBlog2() {
    window.open('https://www.nerdfitness.com/blog/a-beginners-guide-to-the-gym-everything-you-need-to-know/','_blank')
  }
  function openBlog3() {
    window.open('https://www.nerdfitness.com/blog/7-strength-training-myths-every-woman-should-know/','_blank')
  }
  function openVegan() {
    window.open('vegan-diet-plan.html','_blank')
  }
  function openNonVegan() {
    window.open('non-vegan-diet-plan.html','_blank')
  }
