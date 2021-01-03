$(document).ready(function () {
	('use strict');

	console.log('connecting . . . .');
	// var socket = io.connect('http://0.0.0.0:3000');
	var socket = io.connect(window.location.protocol+"//"+window.location.hostname+":3000");
	socket.on('connect', function () {
		console.log('connected ......');
		// socket.send('User has connected');
	});
	// socket.on('message', function (msg) {
	// 	console.log('error connected !!!!!!');
	// 	console.log(msg);
	// 	console.log($('.mess'));
	// 	$('.mess').text(msg);
	// });

	const webcamElement = document.getElementById('webcam');
	const canvasElement = document.getElementById('canvas');
	const snapSoundElement = document.getElementById('snapSound');
	const webcam = new Webcam(webcamElement, 'user', canvasElement);

	webcam
		.start()
		.then((result) => {
			console.log('webcam started');
		})
		.catch((err) => {
			console.log(err);
		});

	$('label#switch-mode input[type="checkbox"]').click(function () {
		if ($(this).prop('checked') == true) {
			console.log($('#text-mode').text('File or url'));
			webcam.stop();
			// console.log('Checkbox is checked.');
			console.log('đã tắt webcam');
		} else if ($(this).prop('checked') == false) {
			console.log($('#text-mode').text('Directly through your camera'));
			webcam
				.start()
				.then((result) => {
					console.log('webcam started');
				})
				.catch((err) => {
					console.log(err);
				});
			console.log('đã bật webcam');
		}
	});
	const FPS = 60;
	$('#webcam')[0].onplaying = function () {
		console.log('dax vaof day');
		setInterval(() => {
			let rs = webcam.snap();
			let data_sended = rs.replace(/^data\:image\/\w+\;base64\,/, '');
			socket.emit('image', data_sended);
		}, 10000 / FPS);
		socket.on('result_predict', function (image) {
			// const image_id = $('#result_predict_on2');
			const image_id = document.getElementById('result_predict_on2');
			console.log('client nhận về', typeof image);
			image_id.src = image;
		});
	};
	$('#take_picture').on('click', function (event) {
		event.preventDefault();
		let picture = webcam.snap();
		console.log($('#canvas'));
		console.log(picture);
		$('#canvas').href = picture;

		// let data_sended = picture.replace(/^data\:image\/\w+\;base64\,/, '');
		// console.log(data_sended);
		// console.log('client gửi đi', typeof data_sended);
		// socket.emit('image', data_sended);
	});
});
