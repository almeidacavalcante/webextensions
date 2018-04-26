class ButtonView {

    constructor() {

    }

    // setup buttons and new actions
    setupButtonsAndActions() {
        
        this.changeFeatureName('a', 'Proprietário', '<b>TORNAR-SE PROPRIETÁRIO</b>');
        this.changeFeatureName('a', 'Fechar', '<b>FINALIZAR</b>');
        this.createButtonWithParameters('GIRS', 14, 'highlight-out')
        this.createButtonWithParameters('BANCADA', 10)
        this.createButtonWithParameters('CIRO', 29)
        this.createButtonWithParameters('LEANDRO', 28)
        this.createButtonRespostaEmBranco();
        this.createButton('INICIAR ATENDIMENTO');
    }

    createButton(buttonName) {
        var newItem = document.createElement('LI');       // Create a <li> node
        var textnode = document.createTextNode(buttonName);  // Create a text node

        var url = window.location.href;
        var id = this.getAllUrlParams(url)


        var link = document.createElement('A');
        link.className = 'moverGirsLink highlight-start';
        link.href = 'http://srv-helpdesk.mp.rn.gov.br/otrs/index.pl?Action=AgentTicketNote;TicketID=' + id.ticketid + '#iniciar-atendimento';

        var bold = document.createElement('B');

        link.appendChild(bold);
        bold.appendChild(textnode);
        newItem.appendChild(link);

        var list = document.getElementsByClassName('Actions');
        list[0].insertBefore(newItem, list[0].childNodes[17]);
    }

    createButtonRespostaEmBranco() {
        var newItem = document.createElement('LI');       // Create a <li> node
        var textnode = document.createTextNode('RESPOSTA EM BRANCO');  // Create a text node

        var link = document.createElement('A');
        link.className = 'moverGirsLink highlight-answer';
        link.href = '#';
        link.onclick = function () {
            this.selectFirstClientComment('tbody #Row1 td div')
            setTimeout(() => {
                submitFormWithValue(1, '#ResponseID')
            }, 200);
        };

        var bold = document.createElement('B');

        link.appendChild(bold);
        bold.appendChild(textnode);
        newItem.appendChild(link);

        var list = document.getElementsByClassName('Actions');
        list[0].insertBefore(newItem, list[0].childNodes[17]);
    }

    createButtonWithParameters(text, formId, cssClass='') {
        var newItem = document.createElement('LI');       // Create a <li> node
        var textnode = document.createTextNode(text);  // Create a text node
        var cssClass = cssClass;

        var link = document.createElement('A');
        link.className = 'moverGirsLink highlight ' + cssClass + '';
        link.href = '#';
        link.onclick = function () {
            this.submitFormWithValue(formId, '#DestQueueID');
        };

        var bold = document.createElement('B');

        link.appendChild(bold);
        bold.appendChild(textnode);
        newItem.appendChild(link);

        var list = document.getElementsByClassName('Actions');
        list[0].insertBefore(newItem, list[0].childNodes[17]);
    }

    getAllUrlParams(url) {

        // get query string from url (optional) or window
        var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

        // we'll store the parameters here
        var obj = {};

        // if query string exists
        if (queryString) {

            // stuff after # is not part of query string, so get rid of it
            queryString = queryString.split('#')[0];

            // split our query string into its component parts
            var arr = queryString.split(';');

            for (var i = 0; i < arr.length; i++) {
                // separate the keys and the values
                var a = arr[i].split('=');

                // in case params look like: list[]=thing1&list[]=thing2
                var paramNum = undefined;
                var paramName = a[0].replace(/\[\d*\]/, function (v) {
                    paramNum = v.slice(1, -1);
                    return '';
                });

                // set parameter value (use 'true' if empty)
                var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

                // (optional) keep case consistent
                paramName = paramName.toLowerCase();
                paramValue = paramValue.toLowerCase();

                // if parameter name already exists
                if (obj[paramName]) {
                    // convert value to array (if still string)
                    if (typeof obj[paramName] === 'string') {
                        obj[paramName] = [obj[paramName]];
                    }
                    // if no array index number specified...
                    if (typeof paramNum === 'undefined') {
                        // put the value on the end of the array
                        obj[paramName].push(paramValue);
                    }
                    // if array index number specified...
                    else {
                        // put the value at that index number
                        obj[paramName][paramNum] = paramValue;
                    }
                }
                // if param name doesn't exist yet, set it
                else {
                    obj[paramName] = paramValue;
                }
            }
        }

        return obj;
    }
    //Change feature name function
    changeFeatureName(tag, name, innerHTML) {
        
        let tagFound = this.findElementsByTagNameAndTextContent(tag, name);
        tagFound.innerHTML = innerHTML;
    }

    findElementsByTagNameAndTextContent(tag, text) {
        var aTags = document.getElementsByTagName(tag);
        var searchText = text;
        var found;

        for (var i = 0; i < aTags.length; i++) {
            if (aTags[i].textContent == searchText) {
                found = aTags[i];
                
                break;
            }
        }
        
        return found;
    }

    selectFirstClientComment(domPath) {

        var promise = new Promise(function (resolve, reject) {
            $(domPath)[1].click()
        });


        return promise
    }

    submitFormWithValue(value, id) {
        //select = document.getElementById(id);
        select = $('select' + id)[0]
        select.value = value;
        form = select.parentNode;
        form.submit();
    }
}