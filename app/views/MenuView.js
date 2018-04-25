class MenuView {

    constructor() {
        this._buttons = [];
    }

    setupRowButtons() {
        this._addButton('Fechados', 'http://srv-helpdesk.mp.rn.gov.br/otrs/index.pl?Action=AgentTicketSearch;Subaction=Search;TakeLastSearch=1;SaveProfile=1;Profile=Fechados%20Hoje%20%2F%20por%20Atendente');
        this._addButton('Final-06', 'http://srv-helpdesk.mp.rn.gov.br/otrs/index.pl?Action=AgentTicketSearch;Subaction=Search;TakeLastSearch=1;SaveProfile=1;Profile=Final%206');
        this._addButton('Final-05', 'http://srv-helpdesk.mp.rn.gov.br/otrs/index.pl?Action=AgentTicketSearch;Subaction=Search;TakeLastSearch=1;SaveProfile=1;Profile=Final%205');
        this._addButton('Final-04', 'http://srv-helpdesk.mp.rn.gov.br/otrs/index.pl?Action=AgentTicketSearch;Subaction=Search;TakeLastSearch=1;SaveProfile=1;Profile=Final%2004');
        this._addButton('Final-ZERO', 'http://srv-helpdesk.mp.rn.gov.br/otrs/index.pl?Action=AgentTicketSearch;Subaction=Search;TakeLastSearch=1;SaveProfile=1;Profile=Final%20ZERO');
        this._insertStyle();
    }


    //Change feature name function
    changeFeatureName(tag, name, innerHTML) {
        tagFound = findElementsByTagNameAndTextContent(tag, name);
        tagFound.innerHTML = innerHTML;
    }

    //Fechar fechar chamado
    changeProperty() {
        document.getElementById('NewOwnerID').value = 22;
        document.getElementById('RichText')
            .value = 'Alterei a propriedade do chamado para JOSE.CAVALCANTE.';

        document.getElementById('submitRichText').click();
    }

    // setup buttons and new actions
    setupButtonsAndActions() {
        changeFeatureName('a', 'Proprietário', '<b>TORNAR-SE PROPRIETÁRIO</b>');
        changeFeatureName('a', 'Fechar', '<b>FINALIZAR</b>');
        createButonMover('GIRS', 14, 'highlight-out')
        createButonMover('BANCADA', 10)
        createButonMover('CIRO', 29)
        createButonMover('LEANDRO', 28)
        createButtonRespostaEmBranco();
        createButton('INICIAR ATENDIMENTO');
    }

    createButton(buttonName) {
        var newItem = document.createElement('LI');       // Create a <li> node
        var textnode = document.createTextNode(buttonName);  // Create a text node

        var url = window.location.href;
        var id = getAllUrlParams(url)


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

    _setupUnblock() {
        // Ctrl-Enter pressed
        let richTextContent = "Através de contato telefônico realizei o desbloqueio da conta de usuário.";
        let subject = "Desbloqueio da conta de usuário."

        console.log($('#RichText'));

        $('#RichText')[0].value = richTextContent;
        $('#Subject')[0].value = subject;

        var fecharValue = 2
        $('#NextStateID')[0].value = fecharValue;
        document.getElementById('submitRichText').click();
    }

    _setupReset() {
        // Ctrl-Shift-Enter pressed

        let richTextContent = "Através de ligação telefônica e mediante a confirmação dos dados cadastrais, realizei o Reset da senha do AD.";
        let subject = "Reset de senha do AD."

        console.log($('#RichText'));

        $('#RichText')[0].value = richTextContent;
        $('#Subject')[0].value = subject;


        var fecharValue = 2
        $('#NextStateID')[0].value = fecharValue;
        document.getElementById('submitRichText').click();
    }

    setupFastUnblockTicket() {
        $('#RichText').keydown(function (e) {

            if (e.ctrlKey && e.keyCode == 13 && e.shiftKey && e.altKey) {

                this._setupUnblock();

            } else if (e.ctrlKey && e.keyCode == 13 && e.shiftKey) {

                this._setupReset();

            }
        });
    }

    setupBlankAnswer() {

        $('#RichText').keydown(function (e) {

            if (e.ctrlKey && e.keyCode == 13 && e.shiftKey) {
                // Ctrl-Shift-Enter pressed
                var fecharValue = 2
                $('#StateID')[0].value = fecharValue;
                document.getElementById('submitRichText').click();
            } else if (e.ctrlKey && e.keyCode == 13) {
                // Ctrl-Enter pressed
                document.getElementById('submitRichText').click();
            }
        });
        document.getElementById('RichText').focus();

        //Value of "Email externo" == 1
        $('select#StateID')[0].value = 13
        document.getElementById('ArticleTypeID').value = 1;
        //document.getElementById('submitRichText').click();
    }


    addNote() {
        document.getElementById('RichText').value = 'Chamado em atendimento';
        //Value of "Email externo" == 1
        //$('select#StateID')[0].value = 13
        document.getElementById('ArticleTypeID').value = 1;
        document.getElementById('submitRichText').click();
    }
    //Function setup buttons and new actions
    setupButtonsAndActions() {
        changeFeatureName('a', 'Proprietário', '<b>TORNAR-SE PROPRIETÁRIO</b>');
        changeFeatureName('a', 'Fechar', '<b>FINALIZAR</b>');
        createButonMover('GIRS', 14, 'highlight-out')
        createButonMover('BANCADA', 10)
        createButonMover('CIRO', 29)
        createButonMover('LEANDRO', 28)
        createButtonRespostaEmBranco();
        createButton('INICIAR ATENDIMENTO');
    }

    changeProperty() {
        document.getElementById('NewOwnerID').value = 22;
        document.getElementById('RichText')
            .value = 'Alterei a propriedade do chamado para JOSE.CAVALCANTE.';

        document.getElementById('submitRichText').click();
    }

    closeTitcketCall() {
        document.getElementById('RichText').value = 'Solicitação atendida.';
        document.getElementById('submitRichText').click();
    }

    changeTitles() {
        document.title = "FECHADOS";
    }

    onReloadCheck() {

        //JSON Array Object
        unreadArticlesJSON = [];

        //Populate the JSON Array
        $('td.UnreadArticles').parent().each(function (index) {
            unreadArticlesJSON.push({
                ticket: $(this)[0].children[3].children[0].innerText,
                href: $(this)[0].children[3].children[0].href
            })
        })

        urls = [
            'http://srv-helpdesk.mp.rn.gov.br/otrs/index.pl?Action=AgentTicketSearch;Subaction=Search;TakeLastSearch=1;SaveProfile=1;Profile=Final%2004',
            'http://srv-helpdesk.mp.rn.gov.br/otrs/index.pl?Action=AgentTicketSearch;Subaction=Search;TakeLastSearch=1;SaveProfile=1;Profile=Final%205',
            'http://srv-helpdesk.mp.rn.gov.br/otrs/index.pl?Action=AgentTicketSearch;Subaction=Search;TakeLastSearch=1;SaveProfile=1;Profile=Final%206'
        ]

        if (location.href == urls[0]) {
            pageNumber = 4;
            document.title = "Fila 04"
        } else if (location.href == urls[1]) {
            pageNumber = 5;
            document.title = "Fila 05"
        } else if (location.href == urls[2]) {
            pageNumber = 6;
            document.title = "Fila 06"
        } else {
            pageNumber = 0;
            document.title = "Fila ZERO"
        }

        chrome.runtime.sendMessage({
            id: 'articles',
            unreadArticlesJSON: unreadArticlesJSON,
            pageNumber: pageNumber,
        });

        chrome.runtime.sendMessage({
            id: 'counter',
            numberOfTickets: document.querySelector("#quantity").textContent,
            pageNumber: pageNumber,
        });
    }

    reloadPeriodically() {

        miliseconds = 2 * 60000;

        setInterval(function () {
            window.location.reload();
        }, miliseconds);
    }


    identifyTicketAndRemoveTr() {

        var count = 0
        $('tr.MasterAction').each(function (index) {
            ticket = $(this)[0].children[3].children[0].innerText
            changedTicket = ticket

            for (i = 0; i < 6; i++) {
                if (changedTicket.slice(-1) === '0') {
                    changedTicket = changedTicket.substr(0, changedTicket.length - 1);
                }
            }

            if (changedTicket.slice(-1) != '4' && changedTicket.slice(-1) != '5' && changedTicket.slice(-1) != '6') {
                $(this).remove()
            } else {
                count += 1;
            }
        })

        recalculatePaginationNumber(count);
    }

    recalculatePaginationNumber(count) {
        $('span.Pagination').html('<h1><b id="quantity">' + count + '</b></h1>')
        console.log('COUNT:' + count);
    }

    highlightUnreadedArticles() {
        //Na página AgentTicketZoom, tem uma estrela, mas não quero destacá-la
        //por isso essa consulta se o parent dela tem a classe Last

        if ($('.UnreadArticles').parent().attr('class') != 'Last') {
            tds = $('.UnreadArticles').parent().parent().children();
            tds.each(
                function (index) {
                    if ($(this).parent().attr('class') == 'MasterAction Even' || $(this).parent().attr('class') == 'MasterAction Even Last') {
                        $(this).css('background', '#6FCEC3');
                    } else {
                        if ($(this).parent().attr('class') == 'MasterAction') {
                            $(this).css('background', '#93E1D8');
                        }
                    }
                }
            );
        }
    }

    //TODO: Separar em uma classe CSS
    _insertStyle() {
        $('#NavigationContainer').css('height', '70px');
        $('#Navigation').css('width', '100%');
    }

    //Setup main _addButtons
    _addButton(name, href) {

        let li = this._setupLi(name, href);
        let ul = document.getElementById('Navigation');

        let button = new Button(name, href, li, ul);

        ul.insertBefore(button.li, button.ul.childNodes[7]);

        this._buttons.push(button);
    }

    _setupLink(name, href) {
        let link = document.createElement('A');
        link.className = name;
        link.href = href;

        return link;
    }

    _setupLi(name, href) {
        let li = document.createElement('LI');
        li.className = 'CanDrag Even ui-sortable-handle';
        li.setAttribute('aria-controls', 'nav-Survey-container');
        li.setAttribute('aria-expanded', 'false');
        li.setAttribute('aria-haspopup', 'true');

        let textnode = document.createTextNode(name);  // Create a text node
        let link = this._setupLink(name, href);

        link.appendChild(textnode);
        li.appendChild(link);

        return li
    }

}