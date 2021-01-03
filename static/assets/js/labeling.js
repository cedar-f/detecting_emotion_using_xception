$(document).ready(function () {
	('use strict');
	var owl = $('#owl-demo');
	function customDataSuccess(data, owl) {
		var name = '';

        var items_sp_hero='';
		for (var i in data['items']) {
		    var item_hero = '';
			console.log('bac nac bnacb bac', i);
			var img = data['items'][i].img;
			name = img.split('/');
			name = name[name.length - 1];
			var alt = data['items'][i].alt;
			var stt = i;

			item_hero =
				'<div class="item">' +
				'<img style="width: 334px; height: 225px" src="' +
				img +
				'" alt="' +
				alt +
				'" />' +
				'<h1>' +
				stt +
				'</h1>' +
				'<div class="label">' +
				'<div class="form-check form-check-inline"> ' +
				'<input class="form-check-input" type="radio" name="' +
				name +
				'" id="' +
				name +
				'" value="happy" /> ' +
				'<label class="form-check-label" for="' +
				name +
				'">Happy</label>' +
				'</div>' +
				'<div class="form-check form-check-inline"> ' +
				'<input class="form-check-input" type="radio" name="' +
				name +
				'" id="' +
				name +
				'" value="angry" /> ' +
				'<label class="form-check-label" for="' +
				name +
				'">Angry</label>' +
				'</div>' +
				'<div class="form-check form-check-inline"> ' +
				'<input class="form-check-input" type="radio" name="' +
				name +
				'" id="' +
				name +
				'" value="disgust" /> ' +
				'<label class="form-check-label" for="' +
				name +
				'" >Disgust</label >' +
				'</div>' +
				'<div class="form-check form-check-inline"> ' +
				'<input class="form-check-input" type="radio" name="' +
				name +
				'" id="' +
				name +
				'" value="scared" /> ' +
				'<label class="form-check-label" for="' +
				name +
				'" >Scared</label >' +
				'</div>' +
				'<div class="form-check form-check-inline"> ' +
				'<input class="form-check-input" type="radio" name="' +
				name +
				'" id="' +
				name +
				'" value="sad" /> ' +
				'<label class="form-check-label" for="' +
				name +
				'">Sad</label>' +
				'</div>' +
				'<div class="form-check form-check-inline">' +
				' <input class="form-check-input" type="radio" name="' +
				name +
				'" id="' +
				name +
				'" value="surprised" />' +
				' <label class="form-check-label" for="' +
				name +
				'" >Surprised</label >' +
				'</div>' +
				'<div class="form-check form-check-inline"> ' +
				'<input class="form-check-input" type="radio" name="' +
				name +
				'" id="' +
				name +
				'" value="neutral" /> ' +
				'<label class="form-check-label" for="' +
				name +
				'" >Neutral</label >' +
				'</div>' +
				'</div>' +
				'</div>';
				items_sp_hero+=item_hero

		}
		$('#owl-demo').html(items_sp_hero);
		owl.owlCarousel();
	}
	console.log('connecting . . . .');
	// var socket = io.connect('http://0.0.0.0:3000');
	var socket = io.connect(window.location.protocol+"//"+window.location.hostname+":3000");
	socket.on('connect', function () {
		console.log('connected ......');
		socket.send('User has connected');
	});
	// socket.on('message', function (msg) {
	// 	console.log('error connected !!!!!!');
	// 	console.log(msg);
	// 	console.log($('.mess'));
	// 	$('.mess').text(msg);
	// });

	function load_page_labeling() {
		// window.alert('đã nhận load page');
		// socket.send('ok lòa page lên đi');
		var test = 'ok rồi load lên đi';
		socket.emit('load_labeling', test);
	}
	load_page_labeling();
	socket.on('load_labeling_client', function (dataJson) {
		// window.alert('đã nhận về dc');
		// window.alert(dataJson);
		console.log(dataJson)
		owl.trigger('destroy.owl.carousel');
		owl.find('.owl-stage-outer').children().unwrap();
		owl.removeClass('owl-center owl-loaded owl-text-select-on');
		customDataSuccess(dataJson, owl);
	});

	owl.owlCarousel({
		items: 5, //10 items above 1000px browser width
		itemsDesktop: [1000, 5], //5 items between 1000px and 901px
		itemsDesktopSmall: [900, 3], // betweem 900px and 601px
		itemsTablet: [600, 2], //2 items between 600 and 0
		itemsMobile: false, // itemsMobile disabled - inherit from itemsTablet option
		responsiveClass: true,
		responsive: {
			0: {
				items: 1,
				nav: true,
			},
			600: {
				items: 3,
				nav: false,
			},
			1000: {
				items: 5,
				nav: true,
				loop: false,
			},
		},
	});

	// Custom Navigation Events
	$('.next').click(function () {
		// owl.trigger('owl.next');
		owl.trigger('next.owl.carousel');
	});
	$('.prev').click(function () {
		// owl.trigger('owl.prev');
		owl.trigger('prev.owl.carousel', [300]);
	});
	// $('.play').click(function () {
	// 	owl.trigger('owl.play', 1000); //owl.play event accept autoPlay speed as second parameter
	// });
	// $('.stop').click(function () {
	// 	owl.trigger('owl.stop');
	// });

	// save
	$('.save').on('click', function (event) {
		event.preventDefault();
		let data = document.querySelectorAll('.owl-stage>.active>.item');

		// data.forEach(send);
		var name_img = [];
		var lb_img = [];
		for (let i = 0; i < data.length; i++) {
			name_img.push(getname(data[i]));
			if (getStatus(i) !== '') {
				lb_img.push(getStatus(i));
			}
		}
		// console.log('name', name_img);
		// console.log('status', lb_img);
		console.log(name_img.length,lb_img.length);
		if (name_img.length === lb_img.length) {
//			data.forEach(send);
//			console.log('có gửi được mà');
            sendArray(data);
		} else {
			window.alert('bạn phải gán hết nhãn');
		}
	});

	function getname(item) {
		let img_name = item.querySelector('img').src.split('/');
		img_name = img_name[img_name.length - 1];
		return img_name;
	}

	function getStatus(index) {
		let label = $('.owl-stage>.active>.item')[index].querySelectorAll(
			'.item>.label>.form-check>input'
		);
		let satus_label = '';
		for (i = 0; i < label.length; i++) {
			if (label[i].checked) {
				satus_label = label[i].value;
			}
		}
		return satus_label;
	}

	function send(item, index) {
		let img_name = item.querySelector('img').src.split('/');
		img_name = img_name[img_name.length - 1];
		let label = $('.owl-stage>.active>.item')[index].querySelectorAll(
			'.item>.label>.form-check>input'
		);
		let satus_label = '';
		for (i = 0; i < label.length; i++) {
			if (label[i].checked) {
				satus_label = label[i].value;
			}
		}

		let data_label = img_name + '@' + satus_label;
		socket.emit('save_after_label', data_label);
		console.log("da lbel va da gui di",data_label);
	}
	function sendArray(data) {
	    console.log(data);
	    var array_to_lam=[];
	    for(var item =0; item<data.length; item++){
	        let img_name=data[item].querySelector("img").src.split('/');
	        console.log(img_name);
            img_name = img_name[img_name.length - 1];
            console.log(img_name);
            let label = $('.owl-stage>.active>.item')[item].querySelectorAll(
                '.item>.label>.form-check>input'
            );
            let satus_label = '';
            for (i = 0; i < label.length; i++) {
                if (label[i].checked) {
                    satus_label = label[i].value;
                }
            }

            let data_label = img_name + '@' + satus_label;
            array_to_lam.push(data_label);


	    }
	    socket.emit('save_after_label', array_to_lam);
        console.log("da lbel va da gui di",array_to_lam);

	}
	socket.on('testguiok', function (data) {
		owl.trigger('destroy.owl.carousel');
		owl.find('.owl-stage-outer').children().unwrap();
		owl.removeClass('owl-center owl-loaded owl-text-select-on');
		customDataSuccess(data, owl);
		// console.log(item_hero);
	});
});
