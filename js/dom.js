/* alle Funktionen zur Manipulation des DOM Trees */
var DOM = {};
/* Verwaltung von Fenstern = Div Elemente */
DOM.guilist = new Array();
DOM.panes = new Object();
DOM.panes.paneList = new Array();
DOM.panes.cssVisiblePane = null;
DOM.panes.cssHiddenPane = null;
DOM.panes.visiblePane = '';
DOM.panes.visiblePaneNo = -1;
DOM.panes.selectId = '';
DOM.panes.addPane = function( idToAdd, textSelOpt, funcOnLoad, arrEnabledBT ) {
	var paneObj = new Object();
	paneObj.id = idToAdd;
	paneObj.selection = textSelOpt;
	paneObj.onShow = funcOnLoad;
	paneObj.enabledBT = arrEnabledBT;
	DOM.panes.paneList.push( paneObj );
}
DOM.panes.switchPane = function(idToShow) {
	if(DOM.panes.visiblePaneNo >= 0 ) {
		for (var i = 0; i < DOM.panes.paneList[DOM.panes.visiblePaneNo].enabledBT.length; i++) {
			var objBT = DOM.getElem(DOM.panes.paneList[DOM.panes.visiblePaneNo].enabledBT[i]);
			objBT.classList.remove(DOM.buttons.cssActive);
			objBT.classList.add(DOM.buttons.cssInactive);			
		}
	}
    for (var i = 0; i < DOM.panes.paneList.length; i++) {
		var objDisp = DOM.getElem(DOM.panes.paneList[i].id);
		if (DOM.panes.paneList[i].id == idToShow ) {
			objDisp.classList.remove(DOM.panes.cssHiddenPane);
            objDisp.classList.add(DOM.panes.cssVisiblePane);
			DOM.panes.visiblePane = idToShow;
			DOM.panes.visiblePaneNo = i;
			if( DOM.panes.paneList[i].onShow != null ) {
				DOM.panes.paneList[i].onShow();
			}
			for( var bt=0; bt< DOM.panes.paneList[i].enabledBT.length; bt++) {
				var objBT = DOM.getElem(DOM.panes.paneList[i].enabledBT[bt]);
				objBT.classList.remove(DOM.buttons.cssInactive);
				objBT.classList.add(DOM.buttons.cssActive);
			}
		} else {
			objDisp.classList.remove(DOM.panes.cssVisiblePane);
            objDisp.classList.add(DOM.panes.cssHiddenPane);			
		}
	}
}
DOM.panes.init  = function( ) {
	for( var i=0; i<DOM.panes.paneList.length; i++) {
		DOM.dropDown.addOption( DOM.panes.selectId, DOM.panes.paneList[i].selection, DOM.panes.paneList[i].id )
	}
}
/* Ende Fensterverwaltung */
/* Buttons Toolbar */
DOM.buttons = new Object();
DOM.buttons.cssActive = null;
DOM.buttons.cssInactive = null;
DOM.buttons.btList = new Array();
DOM.buttons.addButton = function( btId, funcOnClick ) {
	var objBt = new Object();
	objBt.id = btId;
	objBt.onClick = funcOnClick;
	DOM.buttons.btList.push( objBt );
}
DOM.buttons.init = function() {
	for( var i= 0; i < DOM.buttons.btList.length; i++ ) {
		var objBt = DOM.getElem( DOM.buttons.btList[i].id);
		objBt.onclick = DOM.buttons.btList[i].onClick; 
	}
}
DOM.dropDown = new Object();
DOM.dropDown.cssActive = null;
DOM.dropDown.cssInactive = null;
DOM.dropDown.ddList = new Array();
DOM.dropDown.addDropDown = function( idDD, funcOnChange ) {
	var objDD = new Object();
	objDD.id = idDD;
	objDD.onChange = funcOnChange;
	DOM.dropDown.ddList.push( objDD );
}
DOM.dropDown.setSelectionByValue = function (id, val) {
    objSel = DOM.getElem(id);
	for( var i=0; i< objSel.options.length; i++) {
		if( objSel.options[i].value == val ) {
			objSel.selectedIndex = i;
		}
	}   
};
DOM.dropDown.init = function() {
	for( var i= 0; i < DOM.dropDown.ddList.length; i++ ) {
		var objDD = DOM.getElem( DOM.dropDown.ddList[i].id);
		objDD.onchange = DOM.dropDown.ddList[i].onChange; 
	}
}
DOM.dropDown.addOption = function( idDD, textOption, value ) {
	var dd = DOM.getElem( idDD );
	var option = document.createElement("option");
	option.text = textOption;
	option.value = value;
	dd.add(option);
}
DOM.modal = new Object();
DOM.modal.overlay = 'modalOverlay';
DOM.modal.listMod = new Array();
DOM.modal.addModal = function(idMod, idOKBt, funcOK, idCancelBt, funcCancel) {
	var objMod = new Object();
	objMod.id = idMod;
	objMod.idOK = idOKBt;
	objMod.onOK = funcOK;
	objMod.idCancel = idCancelBt;
	objMod.onCancel = funcCancel;
	DOM.modal.listMod.push(objMod);
}
DOM.modal.open = function( idToOpen ) {
	var objOverlay = DOM.getElem(DOM.modal.overlay);
	objOverlay.style.display = "block";
	var objDlg = DOM.getElem( idToOpen );
	objDlg.style.display = "block";
}
DOM.modal.close = function(idToClose) {
	var objOverlay = DOM.getElem(DOM.modal.overlay);
	objOverlay.style.display = "none";
	var objDlg = DOM.getElem( idToClose );
	objDlg.style.display = "none";	
} 
DOM.modal.init = function() {
	for( var i = 0; i< DOM.modal.listMod.length; i++ ) {
		var okBt = DOM.getElem( DOM.modal.listMod[i].idOK );
		okBt.onclick = DOM.modal.listMod[i].onOK;
		var cancelBt = DOM.getElem( DOM.modal.listMod[i].idCancel );
		cancelBt.onclick = DOM.modal.listMod[i].onCancel;
	}
}
DOM.init = function() {
	DOM.panes.init();
	DOM.buttons.init();
	DOM.dropDown.init();
	DOM.modal.init();
}
DOM.getElem = function (idOfElem) {
    var obj = null;
    obj = document.getElementById(idOfElem);
    if (obj == null) {
        alert("Fehler: Kein Element mit der ID = " + idOfElem);
        throw "Fehler: Kein Element mit der ID = " + idOfElem;
    }
    return obj;
};
DOM.loadIFrame = function(ifId, file) {
    var objIF = DOM.getElem(ifId);
    objIF.src = file;
};
/* Tabellen dynamisch erzeugen */
DOM.table = function() {
	var that = this;
	this.cssEvenRow = '';
	this.cssOddRow = '';
	this.cssCell = '';
	this.cssCaption = '';
	this.cssHeadRow = '';
	this.cssHeadCell = '';
	this.cssTable = '';
	this.addTab = function(idParent, captionText, dataHead, dataBody) {
		var objTable =  document.createElement("table");
		if(that.cssTable != '') {
			objTable.className = that.cssTable;
		}
		//Caption
		var capObj = document.createElement("caption");
		capObj.appendChild(document.createTextNode(captionText));
		if (that.cssCaption != '') {
			capObj.className = that.cssCaption;
		}
		objTable.appendChild(capObj);
		var headObj = document.createElement("thead");
		var hRowObj = document.createElement("tr");
		if (that.cssHeadRow != '') {
			hRowObj.className = that.cssHeadRow;
		}	
		for (var i = 0; i < dataHead.length; i++) {
			var cell = document.createElement("th");
			cell.appendChild(document.createTextNode(dataHead[i]));
			if (that.cssHeadCell != '') {
				cell.className = that.cssHeadCell;
			}		
			hRowObj.appendChild(cell);
		}
		headObj.appendChild(hRowObj);
		objTable.appendChild(headObj);
		var bodyObj = document.createElement("tbody");	
		for( var rows = 0; rows < dataBody.length; rows++ ) {
			var rowObj = document.createElement("tr");
			if( (rows % 2) == 0 ) {
				if(that.cssOddRow != '') {
					rowObj.className = that.cssOddRow;
				}					
			} else {
				if(that.cssEvenRow != '') {
					rowObj.className = that.cssEvenRow;
				}				
			}
			for (var cols = 0; cols < dataBody[rows].length; cols++) {
				var cell = document.createElement("td");
				cell.appendChild(document.createTextNode(dataBody[rows][cols]));rows
				if (that.cssCell != '') {
					cell.className = that.cssCell;
				}
				rowObj.appendChild(cell);
			}
			bodyObj.appendChild(rowObj);	
		}
		objTable.appendChild(bodyObj);
		var parentObj = DOM.getElem(idParent);
		parentObj.insertBefore(objTable, parentObj.firstChild);
	}
}
/* Ende Tabellen dynamisch erzeugen */
DOM.clearDisplayArea = function (idOfOutArea) {
    var outArea = DOM.getElem(idOfOutArea);
    outArea.innerHTML = "";
};
DOM.setSpanValue = function (id, val) {
    objSpan = DOM.getElem(id);
    objSpan.innerHTML = "" + val;
};
DOM.appendPreText = function(parent, text, className ) {
    var objPar = DOM.getElem(parent);
    var preNode = document.createElement('pre');
    var txtNode = document.createTextNode(text);
    preNode.appendChild(txtNode);
    preNode.className = className;
    objPar.appendChild(preNode);
};




