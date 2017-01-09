// ----- TOOLS
function randomString() {
	const chars = '0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ';
	let str = '';
	for (const i = 0; i < 10; i++) {
		str += chars[Math.floor(Math.random() * chars.length)];
	};
	return str;
};

function showAlert(message, type, timeout) {
	const alert = $('<p>').css('display','none').addClass('alert ' + type).text(message);
	$('body').append(alert);
	alert.show('fast');
	setTimeout( function() {alert.hide('slow')}, timeout );
}