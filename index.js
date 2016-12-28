

// Ezzing3DApi.createLayout(data, function(err, layoutData) {
//     if (err) throw err;
//     Ezzing3DApi.loadLayout(layoutData.id, function(err, layout, container) {
//         if (err) throw err;
//     });
//     console.log(layoutData);
// });
//
var functions = [];
var events = [];
init();
function init(){
    var data = localStorage.getItem('Ezzing3DId');
    if(data){
        loadLayout(data);
    } else {
        var data = {
            title: "EzzingSolar",
            latitude: 40.428121,
            longitude: -3.698695,
            address: "Calle de Sagasta, 18",
            zip: "28004",
            city: "Madrid",
            province: "Madrid",
            country: "Spain"
        };

        Ezzing3DApi.createLayout(data, function(err, layoutData) {
            if (err) throw err;
            loadLayout(layoutData.id);
            localStorage.setItem('Ezzing3DId', layoutData.id);
            localStorage.setItem('Ezzing3DUrl', layoutData.url);
        });

    }
}

function loadLayout(idLoyaut){
    Ezzing3DApi.loadLayout(idLoyaut, function(err, layout, container) {
        if (err) throw err;

        events = [
            'zoomChanged', 'fullscreen', 'tabChanged', 'editArea', 'editKeepout', 'editTree',
            'areaChanged', 'buildingChanged', 'roofChanged', 'editRoof', 'editVertices',
            'buildingRemoved', 'buildingSelected', 'buildingCreated', 'customAlertOk'
        ]

        functions = [{
            name: 'getCurrentBuildingId',
            params: [''],
            description: 'This function returns the id value of the current active building.',
            action: layout.getCurrentBuildingId
        }, {
            name: 'getLayoutData',
            params: [''],
            description: 'This function returns the id value of the current active building.',
            action: layout.getLayoutData
        }, {
            name: 'getNumberOfModules',
            params: [''],
            description: 'This function returns the id value of the current active building.',
            action: layout.getNumberOfModules
        }, {
            name: 'getTotalPower',
            params: [''],
            description: 'This function returns the id value of the current active building.',
            action: layout.getTotalPower
        }, {
            name: 'getPower',
            params: [''],
            description: 'This function returns the id value of the current active building.',
            action: layout.getPower
        }, {
            name: 'getBuildingInfo',
            params: ['id_building'],
            description: 'This function returns the id value of the current active building.',
            action: layout.getBuildingInfo
        }, {
            name: 'getRoofInfo',
            params: ['id_building'],
            description: 'This function returns the id value of the current active building.',
            action: layout.getRoofInfo
        }, {
            name: 'getBuildingPosition',
            params: ['id_building'],
            description: 'This function returns the id value of the current active building.',
            action: layout.getBuildingPosition
        }, {
            name: 'getAreaInfo',
            params: ['id_area'],
            description: 'This function returns the id value of the current active building.',
            action: layout.getAreaInfo
        }, {
            name: 'getModuleInfoByArea',
            params: ['id_area'],
            description: 'This function returns the id value of the current active building.',
            action: layout.getModuleInfoByArea
        }, {
            name: 'getModulesSructureByArea',
            params: ['id_area'],
            description: 'This function returns the id value of the current active building.',
            action: layout.getModulesSructureByArea
        }, {
            name: 'getAreaOffset',
            params:['id_area', 'offset'],
            description: 'This function returns the id value of the current active building.',
            action: layout.getAreaOffset
        }];

        var consoleInput = document.getElementById('consoleInput');
        var consoleContent = document.getElementById('consoleContent');

        rescroll('consoleContent');
    });
}

function checkConsole() {

    var functionSplit = consoleInput.value.split('(');
    var funcitonName = functionSplit[0];
    if(functionSplit[1]){
        var paramsString = functionSplit[1];
        var params = paramsString.split(',')
        params[params.length - 1] = params[params.length - 1].slice(0, -1);
    }

    var functionToExecute = functions.find(function(actionItem){
        return funcitonName === actionItem.name;
    });

    switch (funcitonName) {
        case 'clear':

            var childrens = consoleContent.children;
            while(childrens.length !== 0){
                consoleContent.removeChild(childrens[0]);
            }

            break;
        case 'help':
            var help1 = "The next functions are avalible in the system, to get more information about one type the name in the console and we show more information about it"
            addToConsole(consoleContent, help1);

            functions.forEach(function(functionItem) {
                var name = functionItem.name + '('
                functionItem.params.forEach(function(param, id, array){
                    if(id === array.length - 1){
                        name = name + param
                    } else {
                        name = name + param + ', '
                    }
                });
                name = name + ')'

                addToConsole(consoleContent, name);
            });

            break;
        case 'start':
            var container = window.document.getElementById('ezzing3d');

            addToConsole(consoleContent, 'Start traking events')

            events.forEach(function(eventToListen) {
                container.addEventListener(eventToListen, function(event, data) {
                    if (event.detail) {
                        addToConsole(consoleContent, 'Event: " ' + event.type + ' " Data: " ' + event.detail + ' "');
                    } else {
                        addToConsole(consoleContent, event.type);
                    }

                });
            });

            break;
        case 'newLayout':
            localStorage.clear();
            location.reload();
            break;
        case 'showcase':
            window.open(localStorage.getItem('Ezzing3DUrl') + '/spin-showcase');
        case functionToExecute ? functionToExecute.name : undefined:

            var name = functionToExecute.name + '('

            params.forEach(function(param, id, array){
                if(id === array.length - 1){
                    name = name + param
                } else {
                    name = name + param + ', '
                }
            });
            name = name + ')'
            addToConsole(consoleContent, 'Action: ' + name)

            if(params[0] === ''){
                functionToExecute.action(function(res, err) {
                    addToConsole(consoleContent, JSON.stringify(res, null, 4), true)
                });
            } else {
                functionToExecute.action(...params ,function(res, err) {
                    addToConsole(consoleContent, JSON.stringify(res, null, 4), true)
                });
            }


            break;

        default:
            addToConsole(consoleContent, 'Action: ' + consoleInput.value + ' not found')
    }

    consoleInput.value = '';
}

function addToConsole(consoleContent, textToShow, isPreprocesed) {
    if(isPreprocesed){
        var li = document.createElement("li");
        var pre = document.createElement("pre")
        pre.appendChild(document.createTextNode(textToShow));
        li.appendChild(document.createTextNode('Data: '));
        li.appendChild(pre);
        consoleContent.appendChild(li);
    } else {
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(textToShow));
        consoleContent.appendChild(li);
    }

    rescroll('consoleContent');
}

function rescroll(div) {
    var objDiv = document.getElementById(div);
    console.log(objDiv);
    objDiv.scrollTop = objDiv.scrollHeight;
}
