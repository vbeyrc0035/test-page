$(document).ready(function() {
    var $win = $(window),
        $win_height = $(window).height(),
        windowPercentage = $(window).height() * 0.9;
    $win.on("click", scrollReveal);
    function scrollReveal() {
        var scrolled = $win.scrollTop();
        $(".onAppear").each(function() {
            var $this = $(this),
                offsetTop = $this.offset().top;
                $(this).each(function(key, bar) {
                    var percentage = $(this).data("percentage");
                    $(this).css("height", percentage); 
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
                });
        });
    }
    scrollReveal();
});