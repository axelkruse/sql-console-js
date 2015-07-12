/* alle Funktionen zur Manipulation des DOM Trees */
var DOM = {};
/* Verwaltung von Fenstern = Div Elemente */
DOM.panes = new Object();
DOM.panes.paneList = new Array();
DOM.panes.cssVisiblePane = null;
DOM.panes.cssHiddenPane = null;
DOM.panes.visiblePane = '';
DOM.panes.addPane = function( idToAdd, funcOnLoad, arrEnabledBT, arrDisabledBT ) {
	var paneObj = new Object();
	paneObj.id = idToAdd;
	paneObj.onShow = funcOnLoad;
	paneObj.enabledBT = arrEnabledBT;
	paneObj.disabledBT = arrDisabledBT;
	DOM.panes.paneList.push( paneObj );
}
DOM.panes.switchPane = function(idToShow) {
    for (var i = 0; i < DOM.panes.paneList.length; i++) {
		var objDisp = DOM.getElem(DOM.panes.paneList[i].id);
		if (DOM.panes.paneList[i].id == idToShow ) {
			objDisp.classList.remove(DOM.panes.cssHiddenPane);
            objDisp.classList.add(DOM.panes.cssVisiblePane);
			DOM.panes.visiblePane = idToShow;
			if( DOM.panes.paneList[i].onShow != null ) {
				DOM.panes.paneList[i].onShow();
			}
			for( var bt=0; bt< DOM.panes.paneList[i].enabledBT.length; bt++) {
				var objBT = DOM.getElem(DOM.panes.paneList[i].enabledBT[bt]);
				objBT.classList.remove(DOM.buttons.cssInactive);
				objBT.classList.add(DOM.buttons.cssActive);
			}
			for( var bt=0; bt< DOM.panes.paneList[i].disabledBT.length; bt++) {
				var objBT = DOM.getElem(DOM.panes.paneList[i].disabledBT[bt]);
				objBT.classList.remove(DOM.buttons.cssActive);
				objBT.classList.add(DOM.buttons.cssInactive);
			}
		} else {
            objDisp.classList.remove(DOM.panes.cssVisiblePane);
			objDisp.classList.add(DOM.panes.cssHiddenPane);
        }	
	}
}
DOM.panes.init  = function() {
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
DOM.table = new Object();
DOM.table.cssEvenRow = '';
DOM.table.cssOddRow = '';
DOM.table.cssOuter = '';
DOM.table.cssCaption = '';
DOM.table.cssHeadRow = '';
DOM.table.cssHeadCell = '';
DOM.table.cssBody = '';
DOM.table.addTab(idParent, textCaption, dataHead, dataBody) {
	//Caption
	var capObj = document.createElement("caption");
    capObj.appendChild(document.createTextNode(captionText));
    if (DOM.table.cssCaption != '') {
        capObj.className = DOM.table.cssCaption;
    }
    var headObj = document.createElement("thead");
    var hRowObj = document.createElement("tr");
    if (DOM.table.cssHeadRow != '') {
        hRowObj.className = DOM.table.cssHeadRow;
    }	
    for (var i = 0; i < dataHead.length; i++) {
        var cell = document.createElement("th");
        cell.appendChild(document.createTextNode(dataHead[i]));
		if (DOM.table.cssHeadCell != '') {
			cell.className = DOM.table.cssHeadCell;
		}		
        hRowObj.appendChild(cell);
    }
    headObj.appendChild(hRowObj);
    var bodyObj = document.createElement("tbody");	
	for( var rows = 0; rows < dataBody.length, rows++ ) {
		var rowObj = document.createElement("tr");
		for (var cols = 0; cols < dataBody[rows].length; cols++) {
			var cell = document.createElement("td");
			cell.appendChild(document.createTextNode(arrCols[rows][cols]));
			cell.className = arrCss[i];
			rowObj.appendChild(cell);
		}
		objBody.appendChild(rowObj);
		return objBody		
	}
}
DOM.addTab = function (idParent, cssTab, captionObj, headObj, bodyObj) {
    var tabObj = document.createElement("table");
    if (cssTab != null) {
        tabObj.className = cssTab;
    }
    tabObj.appendChild(captionObj);
    tabObj.appendChild(headObj);
    tabObj.appendChild(bodyObj);
    var parent = document.getElementById(idParent);
    parent.appendChild(tabObj);
};
DOM.createTabCaption = function (captionText, cssCaption) {
    var capObj = document.createElement("caption");
    capObj.appendChild(document.createTextNode(captionText));
    if (typeof cssCaption === 'string') {
        capObj.className = cssCaption;
    }
    return capObj;
};
DOM.genCssArr = function (arrGiven, expectedLength) {
    if (arrGiven.length == expectedLength) {
        return arrGiven;
    }
    var arrCss = new Array(expectedLength);
    if (arrGiven.length == 1) {
        for (var i = 0; i < expectedLength; i++) {
            arrCss[i] = arrGiven[0];
        }
        return arrCss;
    }
    if (arrGiven.length == 2) {
        for (var i = 0; i < expectedLength; i++) {
            arrCss[i] = arrGiven[(i % 2)];
        }
        return arrCss;
    }
};
DOM.createTabHead = function (arrCols, arrHeadCss) {
    var headObj = document.createElement("thead");
    var hRowObj = document.createElement("tr");
    var arrCss = DOM.genCssArr(arrHeadCss, arrCols.length);
    for (var i = 0; i < arrCols.length; i++) {
        var cell = document.createElement("th");
        cell.appendChild(document.createTextNode(arrCols[i]));
        cell.className = arrCss[i];
        hRowObj.appendChild(cell);
    }
    headObj.appendChild(hRowObj);
    return headObj;
};
DOM.createTabBody = function () {
    var bodyObj = document.createElement("tbody");
    return bodyObj;
};
DOM.addRowToBody = function (objBody, arrCols, arrBodyCss) {
    var rowObj = document.createElement("tr");
    var arrCss = DOM.genCssArr(arrBodyCss, arrCols.length);
    for (var i = 0; i < arrCols.length; i++) {
        var cell = document.createElement("td");
        cell.appendChild(document.createTextNode(arrCols[i]));
        cell.className = arrCss[i];
        rowObj.appendChild(cell);
    }
    objBody.appendChild(rowObj);
    return objBody;
};
/* Ende Tabellen dynamisch erzeugen */
DOM.addMsgWithCode = function (idParent, title, subtitle, code, cssDiv, cssCode) {
    var divObj = document.createElement("div");
    divObj.appendChild(document.createTextNode(title));
    if (subtitle.length > 0) {
        divObj.appendChild(document.createElement("br"));
        divObj.appendChild(document.createTextNode(subtitle));
    }
    if (cssDiv != null) {
        divObj.className = cssDiv;
    }
    var codeObj = document.createElement("pre");
    codeObj.appendChild(document.createTextNode(code));
    if (cssCode != null) {
        codeObj.className = cssCode;
    }
    divObj.appendChild(codeObj);
    var parent = DOM.getElem(idParent);
	if(parent.childNodes[0]) {
		parent.insertBefore(divObj, parent.childNodes[0]);
	} else {
		parent.appendChild(divObj);
	}
};
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




