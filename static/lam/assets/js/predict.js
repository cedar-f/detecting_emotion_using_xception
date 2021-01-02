$(document).ready(function () {
	('use strict');
	console.log('connecting . . . .');
	var socket = io.connect('localhost:3000/');
	socket.on('connect', function () {
		console.log('connected ......');
		socket.send('User has connected');
	});
	socket.on('message', function (msg) {
		// console.log('error connected !!!!!!');
		// console.log(msg);
		// console.log($('.mess'));
		$('.mess').text(msg);
	});
	/*
	const webcamElement = document.getElementById('webcam');
	const canvasElement = document.getElementById('canvas');
	const snapSoundElement = document.getElementById('snapSound');
	const webcam = new Webcam(webcamElement, 'user', canvasElement);

	webcam
		.start()
		.then((result) => {
			console.log('webcam started');
			// console.log(result);
		})
		.catch((err) => {
			console.log(err);
		});
*/
	$('label#switch-mode input[type="checkbox"]').click(function () {
		if ($(this).prop('checked') == true) {
			console.log($('#text-mode').text('File or url'));
			Webcam.off();
			// console.log('Checkbox is checked.');
			console.log('đã tắt webcam');
		} else if ($(this).prop('checked') == false) {
			console.log($('#text-mode').text('Directly through your camera'));
			Webcam.on();
			console.log('đã bật webcam');
		}
	});

	Webcam.set({
		width: 400,
		height: 300,
		image_format: 'jpeg',
		jpeg_quality: 1080,
		flip_horiz: true,
	});
	Webcam.attach('#original');
	const FPS = 60;
	const image_id = document.getElementById('result_predict_on2');

	$('#original>video')[0].onplaying = function () {
		setInterval(() => {
			Webcam.snap(function (img) {
				var data_sended = img.replace(/^data\:image\/\w+\;base64\,/, '');
				socket.emit('image', data_sended);
				console.log('đang gửi ...');
			});
		}, 1000 / FPS);
	};

	socket.on('result_predict', function (image) {
		console.log('client nhận về', typeof image);
		image_id.src = image;
	});

	$('#take_picture').on('click', function (event) {
		event.preventDefault();

		Webcam.snap(function (img) {
			var data_sended1 = img.replace(/^data\:image\/\w+\;base64\,/, '');
			socket.emit('result_predict_for_take', data_sended1);
			console.log('đã gửi đi');
		});
	});

	socket.on('result_predict_for_take', function (image) {
		console.log('client nhận về', typeof image);
		console.log('đã nhận vf khi chụo');
		$('#imagesssss').src = image;
	});
});
