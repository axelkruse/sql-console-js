var sql = null;
var curAssign = -1;
var db = null;
//Register Frames
DOM.panes.cssVisiblePane = 'frameActive';
DOM.panes.cssHiddenPane = 'frameInactive';
DOM.panes.addPane('FrameConsole', null, 
	new Array( 'btOpenScript', 'btExec', 'btClear', 'btCopyLog', 'btSettings' ), new Array(  'btLoadAssign') );
DOM.panes.addPane('FrameAssign',  null,
	new Array(  'btLoadAssign' ), new Array( 'btOpenScript', 'btExec', 'btClear', 'btCopyLog', 'btSettings'));
DOM.panes.addPane('FrameHistory', null, 
	new Array( ), new Array( 'btOpenScript', 'btExec', 'btClear', 'btCopyLog', 'btLoadAssign', 'btSettings' ));
DOM.panes.addPane('FrameStruct', function ( ) {
        showDB();
	}, new Array( ), new Array( 'btOpenScript', 'btExec', 'btClear', 'btCopyLog', 'btLoadAssign', 'btSettings' )
);
DOM.panes.addPane('FrameHelp', null, 
	new Array( ), new Array( 'btOpenScript', 'btExec', 'btClear', 'btCopyLog', 'btLoadAssign', 'btSettings' ));
DOM.panes.addPane('FrameAbout', null,
	new Array( ), new Array( 'btOpenScript', 'btExec', 'btClear', 'btCopyLog', 'btLoadAssign', 'btSettings' ));
//Register Buttons
DOM.buttons.cssActive = 'btToolbarActive';
DOM.buttons.cssInactive = 'btToolbarInactive';
DOM.buttons.addButton('btExec',  function (evt) {
	//	DOM.clearDisplayArea('outputArea');
    var sqlStmt = editQuery.value;
    selectByStatement('hh:mm:ss Ergebnistabelle #. Statement', sqlStmt, 'outputArea');
});
DOM.buttons.addButton('btOpenScript',  function(evt) {
	DOM.modal.open('modalOpenScript');
});
DOM.buttons.addButton( 'btLoadAssign',  function(evt) {
	DOM.modal.open('modalLoadAssign');
});
DOM.buttons.addButton('btClear', function (evt) {
    var idToClear = evt.target.value;
	if( evt.target.tagName.toLowerCase() == 'img') {
		idToClear = evt.target.parentElement.value;
	}
    DOM.clearDisplayArea(idToClear);
});
DOM.buttons.addButton('btCopyLog', function( evt ) {
    var textCopy = DOM.getElem('editQuery').value;
    var tExec = new Date();
    var tExecStr = tExec.toLocaleString();
    DOM.appendPreText('logArea', 
            '/* ++++++ ' + tExecStr + ' ++++++ */\n'
           + textCopy + '\n' 
           + '/* ++++++++++++++++++++++++++++++ */', 'outMsgCodeOK');
});
DOM.buttons.addButton('btSettings', function( evt ) {
	alert('TODO:settings');
});
//Register DropDowns
DOM.dropDown.addDropDown('selFrame',function( evt ) {
	var frameToShow = evt.target.value;
	DOM.panes.switchPane(frameToShow);
});
//Register Modal Dialogs
DOM.modal.addModal('modalLoadAssign', 
	'btOpenOKAssign', function( evt) {
		var fileToOpen = DOM.getElem('tbOpenAssign').value;
		loadAssign(fileToOpen);
		DOM.modal.close(evt.target.value);
	}, 
	'btOpenCancelAssign', function( evt) {
		DOM.modal.close(evt.target.value);		
	});
DOM.modal.addModal('modalOpenScript', 
	'btOpenOKScript', function( evt) {
		var fileToOpen = DOM.getElem('tbOpen').value;
		loadScript(fileToOpen);
		DOM.modal.close(evt.target.value);
	}, 
	'btOpenCancelScript', function( evt) {
		DOM.modal.close(evt.target.value);		
	});
function showDB() {
    DOM.clearDisplayArea('structArea');
    var sqlStmt = "SELECT name FROM sqlite_master WHERE type='table'";
    var result = selectByStatement('hh:mm:ss Tabelle #. ', sqlStmt, 'NONE', false);
    if (result != null && result.length > 0 ) {
        sqlStmt = '';
        for (var i = 0; i < result[0].values.length; i++) {
            sqlStmt = 'PRAGMA table_info(' + result[0].values[i] + '); ';
            selectByStatement('Tabelle: ' + result[0].values[i], sqlStmt, 'structArea', false);
            sqlStmt = 'PRAGMA foreign_key_list(' + result[0].values[i] + '); ';
            selectByStatement('Fremdschlüssel Tabelle: ' + result[0].values[i], sqlStmt, 'structArea', false);
        }
    }
}
function execRun(sqlStmt, title ) {
    var tExec = new Date();
    var tExecStr = tExec.toLocaleString();
    try {
        db.exec(sqlStmt);
    } catch (e) {
        DOM.addMsgWithCode('outputArea', tExecStr + '  Fehler', e.message, sqlStmt, 'outMsgBoxErr', 'outMsgCodeErr');
        DOM.addMsgWithCode('logArea', tExecStr + '  Fehler', e.message, sqlStmt, 'outMsgBoxErr', 'outMsgCodeErr');
        return;
    }
    DOM.addMsgWithCode('outputArea', tExecStr + '  ' + title, 'OK', sqlStmt, 'outMsgBoxOK', 'outMsgCodeOK');
}
function selectByStatement(title, sqlStmt, outAreaId) {
    var tExec = new Date();
    var tExecStr = tExec.toLocaleString();
    var result = null;
    try {
        result = db.exec(sqlStmt);
    } catch (e) {
        DOM.addMsgWithCode('outputArea', tExecStr + '  Fehler', e.message, sqlStmt, 'outMsgBoxErr', 'outMsgCodeErr');
        return;
    }
    if (outAreaId != 'NONE') {
        for (var i = 0; i < result.length; i++) {
            var replTitle = title.replace('#', '' + (i + 1));
            replTitle = replTitle.replace('hh:mm:ss', tExecStr);
            var capObj = DOM.createTabCaption(replTitle, 'selCaption');
            var headObj = DOM.createTabHead(result[i].columns, new Array('selHead'));
            var objBody = DOM.createTabBody();
            for (var j = 0; j < result[i].values.length; j++) {
                objBody = DOM.addRowToBody(objBody, result[i].values[j], new Array('selBody'));
            }
            DOM.addTab(outAreaId, 'selTable', capObj, headObj, objBody);
        }
        if (result.length == 0) {
            DOM.addMsgWithCode('outputArea', tExecStr + ' - OK', '', sqlStmt, 'outMsgBoxOK', 'outMsgCodeOK');
        }
    }
    return result;
}
function loadScript( fileToLoad ) {
	var ajax = new Ajax( "GET", fileToLoad);
	ajax.setCallback( function( rText, status, rXML ) {
		var editQuery = DOM.getElem('editQuery');
		editQuery.value = rText;
	});
	ajax.request();	
}
function loadAssign( fileToLoad ) {
	DOM.getElem('assignIF').src = fileToLoad;	
}
/* ++++ Event Handler einrichten +++++ */
var keyPressEdit = function (evt) {
    if (evt.keyCode != 13)
        return;
    var diffCRsemi = evt.target.value.length - evt.target.value.lastIndexOf(';');
    if (evt.target.value.length > 4 && diffCRsemi == 2) {
        doExecClick(evt);
    }
};

var doLoadAssign = function( evt ) {
	var tbAssign = DOM.getElem('tbAssign');
	DOM.loadIFrame('assignIF', tbAssign.value);
}
/* +++++ Ende Event Handler ++++++ */
var paramsExec = function( strParam ) {
	if(strParam.charAt(0)== '#') {
		strParam = strParam.substring(1);
	}
	var paramArr = strParam.split( '&');
	for( var i = 0; i<paramArr.length; i++ ) {
		var nameValue = paramArr[i].split('=');
		if(nameValue.length == 2) {
			switch (nameValue[0]) {
				case 'script':
						loadScript( nameValue[1] );
					break;
				case 'assign':
						loadAssign( nameValue[1] );
					break;
			}
		}
	}	
}
winOnClose = function ( ) {
    localStorage.setItem(config.prefixStorage + 'DB', toBinString(db.export()));
    db.close();
    return 'Store DB';
};
/* orign toBinString and toBinArray is wiki sqljs */
var toBinString = function(arr) {
    var uarr = new Uint8Array(arr);
    var strings = [], chunksize = 0xffff;
    // There is a maximum stack size. We cannot call String.fromCharCode with as many arguments as we want
    for (var i=0; i*chunksize < uarr.length; i++){
        strings.push(String.fromCharCode.apply(null, uarr.subarray(i*chunksize, (i+1)*chunksize)));
    }
    return strings.join('');
};
var toBinArray = function(str) {
    var l = str.length,
            arr = new Uint8Array(l);
    for (var i=0; i<l; i++) arr[i] = str.charCodeAt(i);
    return arr;
};
window.onload = function () {
    if (window.localStorage === undefined) {
        alert('Local Storage wird nicht supported\nBitte einen anderen Browser benutzen.');
        throw('Local Storage wird nicht supported\nBitte einen anderen Browser benutzen.');
        return;
    }
	db = new SQL.Database();
	DOM.init();
	//Event SQL Editor: if ENTER check on semicolon for Execution 
    var editQuery = DOM.getElem('editQuery');
    editQuery.onkeyup = keyPressEdit;
	//Load default Frame
	DOM.panes.switchPane('FrameConsole');
	DOM.dropDown.setSelectionByValue('selFrame', 'FrameConsole');
	var strParam = location.hash;
	if(strParam.length > 1 ) {
		paramsExec( strParam );	
	}
}