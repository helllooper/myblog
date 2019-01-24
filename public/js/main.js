var pathname = window.location.pathname;
	$('.nav > li > a[href="'+pathname+'"]').parent().addClass('active');
	console.log(window.location.pathname);
	
	
	var nav = $("nav");
	var jumbotron = $(".jumbotron");
	var tl2 = new TimelineLite();
	tl2.fromTo(nav, 1, {y:-100}, {y:0, autoAlpha:1})
	.fromTo(jumbotron, 1, {y:-100}, {y:0, autoAlpha:1}, 0.5);
	var controller = new ScrollMagic.Controller();

var pinJumbotron = new ScrollMagic.Scene({
	triggerElement:".jumbotron",
	duration:"50%",
	triggerHook:0
})
.setPin(".jumbotron", {pushFollowers: false})
.addTo(controller)


    var ourScene = new ScrollMagic.Scene({triggerElement:"#para",
    	triggerHook:0.5
})  .setClassToggle('#para', "fadeIn")
    .addTo(controller);

    var ourScene2 = new ScrollMagic.Scene({triggerElement:"#des",
    	triggerHook:1, reverse: false
})
    .on("enter", function(){
    	var list = $("#des li");
    	var tl3 = new TimelineLite();
    	tl3.staggerFrom(list, 2, {x:-200, opacity:0}, 0.5);
    })
    .addTo(controller);

    var ourScene3 = new ScrollMagic.Scene({triggerElement:"#port4",
        triggerHook:0.9,
        reverse: false
})  .setClassToggle('#port4', "fadeIn")
    .addTo(controller);

    var ourScene4 = new ScrollMagic.Scene({
        triggerElement:"#port3",
        triggerHook: 1,
        reverse: false  
    }).on("enter", function(){
        var cards = $(".card");
        console.log(cards);
        var tl4 = new TimelineLite();
        tl4.staggerFrom(cards, 1, {x: -200 , opacity: 0}, 0.5)
    }).addTo(controller);




var nav = $("nav");
	var port1 = $(".port1");
	var comments = $("#comments");
	var alerts = $(".alert");
	var tl = new TimelineLite();
	tl.fromTo(nav, 1, {y:-100}, {y:0, autoAlpha:1})
	.fromTo(port1, 1, {y:-100}, {y:0, autoAlpha:1}, 0.5)
	.fromTo(comments, 1, {y:-100}, {y:0, autoAlpha:1}, 0.5)
    .fromTo(alerts, 1, {y:-100}, {y:0, autoAlpha:1}, 0.5);
	
	
	
	var formBody = $(".formBody");
	var tl5 = new TimelineLite();
	tl5.fromTo(nav, 1, {y:-100}, {y:0, autoAlpha:1})
	.fromTo(formBody, 1, {y:-100}, {y:0, autoAlpha:1}, 0.5);
	
		var signup = $("#signup");
	var tl6 = new TimelineLite();
	tl6.fromTo(signup, 1, {y:-100}, {y:0, autoAlpha:1}, 0.5);
	
	var about = $("#about");
	var tl7= new TimelineLite();
	tl7.fromTo(about, 1, {y:-100}, {y:0, autoAlpha:1}, 0.5);

	
