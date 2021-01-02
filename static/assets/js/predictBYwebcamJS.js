$(document).ready(function () {
	('use strict');
	console.log('connecting . . . .');
	var socket = io.connect(window.location.protocol+"//"+window.location.hostname+":3000");
	socket.on('connect', function () {
		console.log('connected ......');
		// socket.send('User has connected');
	});
	// socket.on('message', function (msg) {
	// 	$('.mess').text(msg);
	// });

	Webcam.set({
		width: 400,
		height: 300,
		image_format: 'jpeg',
		jpeg_quality: 1080,
		flip_horiz: true,
	});
	Webcam.attach('#original');
	const FPS = 60;

	$('#original>video')[0].onplaying = function () {
		setInterval(() => {
			Webcam.snap(function (img) {
				var data_sended = img.replace(/^data\:image\/\w+\;base64\,/, '');
				socket.emit('image', data_sended);
				console.log('đang gửi ...');
			});
		}, 1000 / FPS);
		socket.on('result_predict', function (image) {
			console.log('client nhận về', typeof image);
			const image_id = document.getElementById('result_predict_on2');
			image_id.src = image;
		});
	};

	$('#take_picture').on('click', function (event) {
		event.preventDefault();
		Webcam.snap(function (img) {
			var data_sended1 = img.replace(/^data\:image\/\w+\;base64\,/, '');
			console.log('chỗ này để chụp hình');
		});
	});

	$('label#switch-mode input[type="checkbox"]').click(function () {
		if ($(this).prop('checked') == true) {
			console.log($('#text-mode').text('File or url'));
			console.log('đã tắt webcam');
		} else if ($(this).prop('checked') == false) {
			console.log($('#text-mode').text('Directly through your camera'));
			console.log('đã bật webcam');
		}
	});
});
