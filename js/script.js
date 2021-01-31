var piesiteFired = 0;
$(document).ready(function() {
    var $win = $(window),
        $win_height = $(window).height(),
        // - A multiple of viewport height - The higher this number the sooner triggered.
        windowPercentage = $(window).height() * 0.9;
    $win.on("click", scrollReveal);
    function scrollReveal() {
        var scrolled = $win.scrollTop();
        
        ///////////////////////////////////////
        // Bar Charts scroll activate, looking for .trigger class to fire.
        $(".onAppear").each(function() {
            var $this = $(this),
                offsetTop = $this.offset().top;

                $(this).each(function(key, bar) {
                    var percentage = $(this).data("percentage");

                    // $(this).css("animation-duration", 5);
                    $(this).css("height", percentage); 
                    
                    ///////////////////////////////////////
                    //        Animated numbers
                    $(this).prop("Counter", 0).animate(
                        {
                            Counter: $(this).data("percentage")
                        },
                        {
                            duration: 2000,
                            easing: "swing",
                            step: function(now) {
                                $(this).text(Math.ceil(now));
                            }
                        }
                    );
                    //        Animated numbers
                    ///////////////////////////////////////
                });
            
        });

    }
    scrollReveal();
});

