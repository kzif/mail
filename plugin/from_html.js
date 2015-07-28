function getBodyEmailNoImage(){
	//Pega o corpo do email
	var corpo = document.getElementsByClassName("rpHighlightAllClass rpHighlightBodyClass allowTextSelection")[0];
	//Pega o iframe e envia a mensagem
	var list = document.getElementsByTagName("iframe");
	for(var i=0; i<list.length; i++) {
		if(list[i].src.indexOf('kzif.') > -1){
			list[i].contentWindow.postMessage('MSG0001:'+corpo.innerHTML, 'https://kzif.github.io');
		}
	}
}
var completeEmail, emailAcrtive, controlImg;
function getBodyEmailComplete(){
	//Pega o corpo do email
	var corpo = document.getElementsByClassName("rpHighlightAllClass rpHighlightBodyClass allowTextSelection")[0];
	completeEmail = corpo.innerHTML;
	var imagens = corpo.getElementsByTagName('img');
	var tokken = makeid();
	emailAcrtive = tokken;
	controlImg = new Array();
	
	//Carrega as imagens
	for(var i = 0; i < imagens.length; i++){
		if(controlImg.indexOf(imagens[i].src) < 0){
			controlImg[controlImg.length] = imagens[i].src;
			convertImgToBase64(imagens[i].src, completeRequestBody, tokken);
		}
	}
	if(imagens.length == 0){
		list[i].contentWindow.postMessage('MSG0002:'+completeEmail, 'https://kzif.github.io');
	}
}	
function convertImgToBase64(url, callback, token){
	var img = new Image();
	img.onload = function(){
		img.clearTimer();
		var canvas = document.createElement('CANVAS');
		var ctx = canvas.getContext('2d');
		canvas.height = this.height;
		canvas.width = this.width;
		ctx.drawImage(this,0,0);
		var dataURL = canvas.toDataURL('image/png');
		if(token == emailAcrtive){ callback(dataURL, url, this.width, this.height); }
		canvas = null;
	};
	
	img.onerror = function(){
		if(token == emailAcrtive){ callback("ERROR", url, 0, 0); }
	};
	
	img.clearTimer = function() {
        if (img.timer) {                
            clearTimeout(img.timer);
            img.timer = null;
        }
    }
	
	img.timer = setTimeout(function(){ if(token == emailAcrtive){ callback("ERROR", url, 0, 0); } }, 15000);
	
	img.src = url;
}	
function makeid(){
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for( var i=0; i < 8; i++ )
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	return text;
}

function completeRequestBody(dataURL, url, width, height){		
	url = url.replace('https://outlook.office365.com/owa/', '');
	url = url.replace(/\./g, '\\.');
	url = url.replace(/\?/g, '\\?');
	url = url.replace(/\+/g, '\\+');
	url = url.replace(/&/g, '&amp;');
	
	//Ajusta imagem
	var max_image = 1000;
	if(width > max_image){
		height = height / width * max_image;
		width = max_image;
	}
		
	var re = new RegExp('<img.+'+url+'.+\/?>', 'g');
	if(dataURL == "ERROR"){
		completeEmail = completeEmail.replace(re, '');
	}else{
		completeEmail = completeEmail.replace(re, '<img src="'+dataURL+'" width="'+width+'px" height="'+height+'px">');
	}	
	
	controlImg.splice(controlImg.indexOf(url), 1);
	
	if(controlImg.length == 0){
		var list = document.getElementsByTagName("iframe");
		for(var i=0; i<list.length; i++) {
			if(list[i].src.indexOf('kzif.') > -1){
				list[i].contentWindow.postMessage('MSG0002:'+completeEmail, 'https://kzif.github.io');
			}
		}
	}
}

function addEvent(){
	window.addEventListener("message",
		function(e){
			if(e.origin == 'https://kzif.github.io'){
				if(e.data == 'START'){
					getBodyEmailNoImage();
					getBodyEmailComplete();
				}
			}
		},
	false);
}	
addEvent();	
