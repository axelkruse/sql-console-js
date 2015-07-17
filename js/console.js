var sql = null;
var curAssign = -1;
var db = null;
var resTab = new DOM.table();
	resTab.cssEvenRow = 'queryEvenRow';
	resTab.cssOddRow = 'queryOddRow';
	resTab.cssCell = 'queryCell';
	resTab.cssCaption = 'queryCaption';
	resTab.cssHeadRow = 'queryHeadRow';
	resTab.cssHeadCell = 'queryHeadCell';
	resTab.cssTable = 'queryTable';
var errTab = new DOM.table();
	errTab.cssEvenRow = 'errMsgEvenRow';
	errTab.cssOddRow = 'errMsgOddRow';
	errTab.cssCell = 'errMsgCell';
	errTab.cssCaption = 'errMsgCaption';
	errTab.cssHeadRow = 'errMsgHeadRow';
	errTab.cssHeadCell = 'errMsgHeadCell';
	errTab.cssTable = 'errMsgTable';
function initGUI() {
	if( srcInitScript.length > 0 ) {
		preloadScript( srcInitScript );
	}
	//Register Frames
	DOM.panes.cssVisiblePane = 'frameActive';
	DOM.panes.cssHiddenPane = 'frameInactive';
	DOM.panes.selectId = 'selFrame';
	if( showLoadScript ) {
		DOM.panes.addPane('FrameConsole', optConsolFrame, null, 
			new Array( 'btOpenScript', 'btExec', 'btNew', 'btClear', 'btCopyLog' ) );
	} else {
		DOM.panes.addPane('FrameConsole', optConsolFrame, null, 
			new Array( 'btExec','btNew', 'btClear', 'btCopyLog' ) );
	}
	if( srcAssignment.length > 0 ) {
		if( showLoadAssign ) {
			DOM.panes.addPane('FrameAssign', optAssignFrame ,  null,
				new Array(  'btLoadAssign' ) );
		} else {
			DOM.panes.addPane('FrameAssign', optAssignFrame ,  null,
				new Array(  ) );	
		}
	}
	DOM.panes.addPane('FrameHistory', optHistoryFrame ,null, 
		new Array( 'btClearLog' ));
	DOM.panes.addPane('FrameStruct', optStructFrame , function ( ) {
			showDB();
		}, new Array( ) );
	if( srcHelp.length > 0 ) {
		DOM.panes.addPane('FrameHelp', optHelpFrame, null, 
			new Array( ));
	}
	DOM.panes.addPane('FrameAbout', optAboutFrame, null,
		new Array( ));
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
	DOM.buttons.addButton('btNew', function (evt) {
		var objTB = DOM.getElem( evt.target.value );
		objTB.value = "";
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
	DOM.buttons.addButton('btClearLog', function (evt) {
		var idToClear = evt.target.value;
		if( evt.target.tagName.toLowerCase() == 'img') {
			idToClear = evt.target.parentElement.value;
		}
		DOM.clearDisplayArea(idToClear);
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
	DOM.init();
	//Load default Frame
	DOM.panes.switchPane('FrameConsole');
	DOM.dropDown.setSelectionByValue('selFrame', 'FrameConsole');
	if( srcAssignment.length > 0) {
		loadAssign( srcAssignment );
	}
	if( srcHelp.length > 0 ) {
		loadHelp( srcHelp );
	}
}
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
		errTab.addTab('outputArea', tExecStr + ' - ERROR', new Array( 'Grund', 'Meldung'), new Array( new Array('Server',  e.message), new Array('SQL Statement', sqlStmt))); 
        return;
    }
	resTab.addTab( 'outputArea', tExecStr + ' - OK', new Array('SQL Statement ohne Rückgabe'), new Array(new Array( sqlStmt) ) );
}
function selectByStatement(title, sqlStmt, outAreaId) {
    var tExec = new Date();
    var tExecStr = tExec.toLocaleString();
    var result = null;
    try {
        result = db.exec(sqlStmt);
    } catch (e) {
		errTab.addTab(outAreaId, tExecStr + ' - ERROR', new Array( 'Grund', 'Meldung'), new Array( new Array('Server',  e.message), new Array('SQL Statement', sqlStmt))); 
        return;
    }
    if (outAreaId != 'NONE') {
        for (var i = 0; i < result.length; i++) {
            var replTitle = title.replace('#', '' + (i + 1));
            replTitle = replTitle.replace('hh:mm:ss', tExecStr);
			resTab.addTab( outAreaId, tExecStr + ' - OK', result[i].columns, result[i].values );
        }
        if (result.length == 0) {
            resTab.addTab( 'outputArea', tExecStr + ' - OK', new Array('SQL Statement ohne Rückgabe'), new Array(new Array( sqlStmt) ) );
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
function preloadScript( fileToLoad ) {
	var ajax = new Ajax( "GET", fileToLoad);
	ajax.setCallback( function( rText, status, rXML ) {
		var editQuery = DOM.getElem('editQuery');
		editQuery.value = rText;
		DOM.getElem('btExec').click();
	});
	ajax.request();	
}
function loadAssign( fileToLoad ) {
	DOM.getElem('assignIF').src = fileToLoad;	
}
function loadHelp( fileToLoad ) {
	DOM.getElem('helpIF').src = fileToLoad;	
}
/* ++++ Event Handler einrichten +++++ */
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
/* no longer used to store db
winOnClose = function ( ) {
    localStorage.setItem(config.prefixStorage + 'DB', toBinString(db.export()));
    db.close();
    return 'Store DB';
};
*/
/* orign toBinString and toBinArray is wiki sqljs */
/* no longer used, because store is not needed
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
*/
window.onload = function () {
    if (window.localStorage === undefined) {
        alert('Local Storage wird nicht supported\nBitte einen anderen Browser benutzen.');
        throw('Local Storage wird nicht supported\nBitte einen anderen Browser benutzen.');
        return;
    }
	db = new SQL.Database();
	var strParam = location.hash;
	if( strParam.length > 1 ) {
		if(strParam.charAt(0)== '#') {
			strParam = strParam.substring(1);
		}
		var ajax = new Ajax( "GET", strParam );
		ajax.setCallback( function( rText, status, rXML ) {
			var objAssign = rXML.getElementsByTagName('assignment');
			if( objAssign.length > 0) {
				if( objAssign[0].hasAttribute('src')) {
					srcAssignment = objAssign[0].getAttribute('src');
				}
				if(objAssign[0].hasAttribute('showload')) {
					var doLoad =  objAssign[0].getAttribute('showload');
					if( doLoad.toLowerCase() == 'true' ) {
						showLoadAssign = true;
					} else {
						showLoadAssign = false;
					}
				}
			}
			var objHelp = rXML.getElementsByTagName('help');
			if( objHelp.length > 0) {
				if(objHelp[0].hasAttribute('src')) {
					srcHelp = objHelp[0].getAttribute('src');
				}
			}
			var objScript = rXML.getElementsByTagName('script');
			if( objScript.length > 0) {
				if(objScript[0].hasAttribute('src')) {
					srcInitScript = objScript[0].getAttribute('src');
				}
				if(objScript[0].hasAttribute('showload')) {
					var doLoad =  objScript[0].getAttribute('showload');
					if( doLoad.toLowerCase() == 'true' ) {
						showLoadScript = true;
					} else {
						showLoadScript = false;
					}
				}
			}
			initGUI();
		});
		ajax.request();	
	} else {
		initGUI();
	}
}