function Ajax(methSend, url) {
	this.state = "WAIT";
	var that = this;
	var roundCounter = 0;
    updating = false;
    objAjax = null;
	var urlCall = url;
	var method = methSend;
	this.callback = null;
	this.abortAjax = function() {
		if (that.updating) {
			that.updating=false;
			objAjax.abort();
			objAjax=null;
		}  
	}     
	this.getState = function() {
		return this.state;	
	}
	this.setURL = function(url) {
		urlCall = url;
	}
	this.setCallback = function (funcToCall) {
		this.callback = funcToCall;
	}
	this.onreadystatechange = function() { 
		if (objAjax.readyState==4) {
			updating=false;
			that.callback(that.objAjax.responseText,that.objAjax.status,that.objAjax.responseXML);
			objAjax=null; 
		}
	}	
	this.request = function( dataToSend ) {
		that.state = "WAIT";
		if (updating) { return false; }
		that.objAjax = null;
		if (window.XMLHttpRequest) {
			that.objAjax=new XMLHttpRequest();
		} else {
			that.objAjax=new ActiveXObject("Microsoft.XMLHTTP");
		}  
		if (that.objAjax==null) { 
			return false;
		} else {
			that.objAjax.onreadystatechange =function() { 
				if (that.objAjax.readyState==4) {
					updating=false;
					that.callback(that.objAjax.responseText,that.objAjax.status,that.objAjax.responseXML);
					that.objAjax=null; 
				}
			}
			updating = new Date();
            var uri = urlCall +'?timestamp='+encodeURIComponent(updating.getTime());
			var data = dataToSend;
			if(method == "GET") {
				var uri = uri + '&' + data;
				that.objAjax.open("GET", uri, true);
				that.objAjax.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=ISO-8859-1");
				data = null;
			} else {
				that.objAjax.open("POST", uri, true);
				that.objAjax.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=ISO-8859-1");
				that.objAjax.setRequestHeader("Content-Length", data.length);
			}
			try {
				that.objAjax.send(data);
			} catch (e) {
				alert("Fehler: \n" + e.message);
			}
			return true;
		}
    }
 }
