var noticias = new Object();
var podcasts_items = new Object();
var player = new Audio('http://188.226.176.70:8000/killallradio');
player.addEventListener("error", function(e){
	console.error(e);
	player.pause();
	player.src = '';
});
player.setAttribute('mozaudiochannel', 'content');
var seekbar = document.getElementById('seekbar-progress');
seekbar.disabled = true;
var leermas = false;
var tabs = ['news', 'podcasts', 'sobre'];
var actual_tab = 0;
var app;
var platform; nowListen = 'Killall Radio';
var dia_activo;
function convertTime(date){
	dateOptions = {
		weekday: "long", year: "numeric", month: "short",
		day: "numeric", hour: "2-digit", minute: "2-digit"
	};
	dateN = Date.parse(date);
	date = new Date(dateN);
	return date.toLocaleDateString("es-ES", dateOptions);
}

function getData(url, cb){
	loading = document.createElement('div');
	loading.className = "loading";
	loading.innerHTML = '<img src="img/loading.png" />';
	mui.overlay('on', loading);
	$.ajax({
		url: url,
		type: 'GET',
		dataType: 'jsonp',
		cache: true,
		xhrFields: {
			mozAnon: true,
			mozSystem: true
		},
		beforeSend: function(xhr){
			xhr.withCredentials = true;
		},
		error: function(xhr, status, error) {
			mui.overlay('off');
			console.error(error);
		},
		success: function(json) {
			mui.overlay('off');
			if (cb){
				cb(json);
			}
		}
	});
}

function getNews(){
	url = 'http://killallradio.tk/app/x2j.php?url=http://killallradio.wordpress.com/feed/';
	getData(url, function(responseText){
		$('#news').empty();
		i = 0;
		feed = feed = responseText.rss.channel;
		$.each(feed.item, function(key, value){
			value.pubDate = convertTime(value.pubDate);
			value.id = i;
			i++;
			value.title_encode = encodeURIComponent(value.title);
			$('#news').append(MicroTmpl('feeds', value));
		});
		noticias = feed.item;
	});
}

function getPodcasts(){
	url = 'http://killallradio.tk/app/x2j.php?url=http://www.ivoox.com/killall-radio_fg_f1129480_filtro_1.xml';
	getData(url, function(responseText){
		$('#podcasts').empty();
		feed = responseText.rss.channel;
		pod = {}
		$.each(feed.item, function(key, value){
			pod.pubDate = convertTime(value.pubDate);
			pod.title = value.title;
			pod.description = value.description;
			pod.url = value.enclosure.url;
			pod.link = value.link;
			pod.title_encode = encodeURIComponent(value.title);
			$('#podcasts').append(MicroTmpl('podcasts_list', pod));
			podcasts_items += (pod);
		});
	});
}

$('#player_button').click(function(e){
	e.preventDefault();
	button = $('#player_button i');
	if (player.paused){
		player.play();
		button.removeClass('icon-play').addClass('icon-pause');
	}else{
		player.pause()
		button.removeClass('icon-pause').addClass('icon-play');
	}
});

$('.radio').click(function(e){
	e.preventDefault();
	button = $('#player_button i');
	$('#estado').text('En directo');
	player.pause();
	seekbar.disabled = true;
	player.removeEventListener('timeupdate', update_seekbar());
	player.src = 'http://188.226.176.70:8000/killallradio'
	button.removeClass('icon-play').addClass('icon-pause');
	if (platform == 'firefoxos'){
		notifyMe('En directo');
	}else{
		cordova.plugins.notification.local.update({
			id: 1,
			text: 'En directo'
		});
	}
	player.play();
})

$('.leermas').live('click', function(e){
	e.preventDefault();
	leermas = true;
	id = $(this).attr('data-id');
	noticia = noticias[id];
	modalEl = document.createElement('div');
	modalEl.className = "modal";
	modalEl.innerHTML = '<h3 class="autor">'+noticia.title+'</h3><div class="msg">'+noticia['content:encoded']+'</div>';
	mui.overlay('on', {'onclose': modalClose}, modalEl);
});

function update_seekbar(){
	var curtime = parseInt(player.currentTime, 10);
		seekbar.value = curtime;
		seekbar.max = player.duration;
}

$('.escuchar_podcast').live('click', function(e){
	e.preventDefault();
	url = $(this).attr('href');
	txt = $(this).parent().children('h3').text();
	$('#estado').text(txt);
	if (platform == 'firefoxos'){
		notifyMe(txt);
	}else{
		cordova.plugins.notification.local.update({
			id: 1,
			text: txt
		});
	}
	player.pause();
	player.src = url;
	player.play();
	$('#player_button i').removeClass('icon-play').addClass('icon-pause');
	seekbar.disabled = false;
	seekbar.addEventListener("change", function(){
		player.currentTime = seekbar.value;
	});
	seekbar.max = player.duration;
	player.addEventListener('timeupdate', update_seekbar());
});

$('#tabs a').click(function(e){
	tab = $(this).attr('data-mui-controls');
	if (tab == 'news'){
		actual_tab = 0;
		getNews();
	}else if (tab == 'podcasts'){
		actual_tab = 1;
		getPodcasts();
	}else{
		actual_tab = 2;
	}
});
function modalClose(){
	leermas = false;
}
document.addEventListener("backbutton", onBackKeyDown, false);

function onBackKeyDown(e) {
    e.preventDefault();
	if (leermas){
		mui.overlay('off');
		leermas = false;
	}else{
		salir = confirm("¿Quieres salir?"); 
		if (salir){
			player.pause();
			player.src = '';
			player = null;
			cordova.plugins.notification.local.cancelAll();
			navigator.app.exitApp();
		}
	}
}

$('html').swipeRight(function(){
	if (actual_tab > 0){
		actual_tab--;
		$('a[data-mui-controls="'+tabs[actual_tab]+'"]').click();
	}
});

$('html').swipeLeft(function(){
	if (actual_tab < tabs.length){
		actual_tab++;
		$('a[data-mui-controls="'+tabs[actual_tab]+'"]').click();
	}
});

function notifyMe(body) {
	if (!('Notification' in window)) {
		alert('This browser does not support desktop notification');
	}
	else if (Notification.permission === 'granted') {
		var notification = new Notification('Killall Radio', {'body': body, tag: 'killallradio'});
		notification.onclick = function(){
			app.launch();
		}
	}
	else if (Notification.permission !== 'denied') {
		Notification.requestPermission(function (permission) {
			if (permission === 'granted') {
				var notification = new Notification('Killall Radio', {'body': body, tag: 'killallradio'});
				notification.onclick = function(){
					app.launch();
				}
			}
		});
	}
}

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	platform = device.platform;
	if (platform == 'firefoxos'){
		var request = navigator.mozApps.getSelf();
		request.onsuccess = function onApp(evt) {
			app = evt.target.result;
		}
	}
	// Notificaciones
	cordova.plugins.notification.local.schedule({
		id: 1,
		text: "En ejecución",
		title: 'Killall Radio',
		sound: 'file://silence_notification.mp3',
		ongoing: true
	});
}

$(document).ready(function(){
	$('.mostrar').click(function(e){
		e.preventDefault();
		id = $(this).attr('href');
		if (dia_activo == id){
			dia_activo = '';
			$(id+' h3 + div').removeClass('active');
		}else{
			$(dia_activo+' h3 + div').removeClass('active');
			$(id+' h3 + div').addClass('active');
			dia_activo = id;
		}
	});
});

/*window.addEventListener('unload', function () {
	// For stop playing on app closed
	if (player){
		player.pause();
		player.src = '';
		player = null;
	}
	cordova.plugins.notification.local.cancelAll();
});
*/
