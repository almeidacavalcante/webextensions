beginScript();



chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

//   message = {
//     title: 'New movimentation',
//     body: 'Ticket: ' + unreadArticle.ticket,
//     href: unreadArticle.unreadArticleUrl,
//     ticket: unreadArticle.ticket
//   }
    
    readArticleByTicket(request.messageObject.ticket);

    log('CONTENT-SCRIP: RECEIVED');
});

function readArticleByTicket(ticket){
  log('TICKET NUMBER: ' + ticket)
  $('td:contains('+ticket+')').parent().removeAttr('id');
}

function beginScript() {

  monitoredUrls = [
    'http://srv-helpdesk.mp.rn.gov.br/otrs/index.pl?Action=AgentTicketSearch;Subaction=Search;TakeLastSearch=1;SaveProfile=1;Profile=Final%2004',
    'http://srv-helpdesk.mp.rn.gov.br/otrs/index.pl?Action=AgentTicketSearch;Subaction=Search;TakeLastSearch=1;SaveProfile=1;Profile=Final%205',
    'http://srv-helpdesk.mp.rn.gov.br/otrs/index.pl?Action=AgentTicketSearch;Subaction=Search;TakeLastSearch=1;SaveProfile=1;Profile=Final%206',
    'http://srv-helpdesk.mp.rn.gov.br/otrs/index.pl?Action=AgentTicketSearch;Subaction=Search;TakeLastSearch=1;SaveProfile=1;Profile=Final%20ZERO'
  ]

  if (location.href.includes(monitoredUrls[0]) ||
      location.href.includes(monitoredUrls[1]) ||
      location.href.includes(monitoredUrls[2]) || 
      location.href.includes(monitoredUrls[3]) ){

    identifyTicketAndRemoveTr();
    onReloadCheck();
    setupRowButtons();
    highlightUnreadedArticles();

    miliseconds = 2 * 60000;
    reloadPeriodically(miliseconds);

  } else if (location.href.includes('http://srv-helpdesk.mp.rn.gov.br/otrs/index.pl?Action=AgentTicketSearch;Subaction=Search;TakeLastSearch=1;SaveProfile=1;Profile=Fechados%20Hoje%20%2F%20por%20Atendente')){
    document.title = "FECHADOS";
  } else if (location.href.includes('index.pl?Action=AgentTicketClose;TicketID=')) {
    closeTitcketCall();
  } else if (location.href.includes('index.pl?Action=AgentTicketOwner;TicketID=')) {
    changeProperty();
  } else if (location.href.includes('index.pl?Action=AgentTicketZoom;TicketID=')) {
    setupButtonsAndActions();
    setupRowButtons();
    highlightUnreadedArticles();
  } else if (location.href.includes('index.pl?Action=AgentTicketNote') && location.href.includes('#iniciar-atendimento')) {
    addNote();
  } else if (location.href.includes('index.pl?ChallengeToken=')){ 
    setupBlankAnswer();

  } else if (location.href.includes('index.pl?Action=AgentTicketPhone')){
    setupFastUnblockTicket();
    
  } else if (location.href.includes('index.pl?Action=AgentTicketSearch') ||
    location.href.includes('index.pl?Action=AgentDashboard')) {
    setupRowButtons();
    highlightUnreadedArticles();
  } else if (location.href.includes('index.pl?Action=AgentTicketQueue')) {
    
    setupRowButtons();
  } 
}

function setupUnblock(){
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

function setupReset(){
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

function setupFastUnblockTicket(){
  $('#RichText').keydown(function (e) {

    if (e.ctrlKey && e.keyCode == 13 && e.shiftKey && e.altKey) {

      setupUnblock();

    } else if (e.ctrlKey && e.keyCode == 13 && e.shiftKey) {

      setupReset();

    } 
  });
}

function setupBlankAnswer(){

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

function recalculatePaginationNumber(count){
  $('span.Pagination').html('<h1><b id="quantity">' + count + '</b></h1>')
  console.log('COUNT:'+count);
}

function identifyTicketAndRemoveTr(){
    
    var count = 0
    $('tr.MasterAction').each(function(index){
      ticket = $(this)[0].children[3].children[0].innerText
      changedTicket = ticket
      
      for(i=0; i<6; i++){
        if(changedTicket.slice(-1) === '0') {
          changedTicket = changedTicket.substr(0, changedTicket.length - 1);
        }
      }

      if (changedTicket.slice(-1) != '4' && changedTicket.slice(-1) != '5' && changedTicket.slice(-1) != '6'){
        $(this).remove()
      }else{
        count += 1;
      }
    })

    recalculatePaginationNumber(count);
}

function addNote(){
  document.getElementById('RichText').value = 'Chamado em atendimento';
  //Value of "Email externo" == 1
  //$('select#StateID')[0].value = 13
  document.getElementById('ArticleTypeID').value = 1;
  document.getElementById('submitRichText').click();
}

function reloadPeriodically(miliseconds){
  setInterval(function() {
    window.location.reload();
  }, miliseconds); 
}

function insertOrChangeLine(){
  trs = $('table#searchform tbody').children();
  console.log('TR childs: '+trs.length);
  
  randomNumber = getRandomArbitrary(1, trs.length-1);

  trs.eq(randomNumber).attr('id', 'unread');
}

function includeCss(){
  //$("<link rel='stylesheet type='text/css' href='style.css' />").appendTo('head')
}

function addCSS(){

  
  $("<style type='text/css'> #unread{ background-color: #43C59E;} </style>").appendTo("head");

  $('table, th, td').css(
    {
      "border": "1px solid black",
      "border-collapse": "collapse"
    }
  )

  $('th, td').css(
    {
      "padding": "15px"
    }
  )
}

function onReloadCheck(){

  // TEXT (CHAMADO)
  //console.log($('td.UnreadArticles').parent()[0].children[3].children[0].innerText);

  // URL (CHAMADO)
  //console.log($('td.UnreadArticles').parent()[0].children[3].children[0].href);

  //JSON Array Object
  unreadArticlesJSON = [];

  //Populate the JSON Array
  $('td.UnreadArticles').parent().each(function(index){
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

  // OFFLINE
  // urls = [
  //   'file:///home/almeida/webextensions/lucifer-plug-in/pages/Procurar%20-%20Chamado%20-%20AtendeMP%20-%2004.html',
  //   'file:///home/almeida/webextensions/lucifer-plug-in/pages/Procurar%20-%20Chamado%20-%20AtendeMP%20-%2005.html',
  //   'file:///home/almeida/webextensions/lucifer-plug-in/pages/Procurar%20-%20Chamado%20-%20AtendeMP%20-%2006.html'
  // ]


  if (location.href == urls[0]){
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

function returnRandomSubGroup(articles){
    console.log(JSON.stringify(articles, null, 4));
    
    var index = [];

    // build the index
    for (var x in articles.hrefs) {
      index.push(x);
    }

    // sort the index
    index.sort(function (a, b) {    
      return a == b ? 0 : (a > b ? 1 : -1); 
    }); 

    selectedHrefs = [];
    counter = 0
    forLimit = getRandomArbitrary(1,3);
    console.log('FOR LIMIT: '+forLimit);
    for(i = 0; i<forLimit; i++){
      console.log('FOR: i = ' + i);
      
      randomNumber = getRandomArbitrary(1,6-i);
      console.log('RANDOM NUMBER: '+randomNumber);
      
      selectedHrefs[counter] = articles.hrefs[index[randomNumber]];
      articles.hrefs.splice(randomNumber, randomNumber);
      console.log(JSON.stringify(articles, null, 4));
      
      counter++;
    }
    return selectedHrefs;
}

function returnOneOf(articles){
  
  
  var index = [];

  // build the index
  for (var x in articles.hrefs) {
    index.push(x);
  }

  // sort the index
  index.sort(function (a, b) {    
    return a == b ? 0 : (a > b ? 1 : -1); 
  }); 

  selectedHref = []
  randomNumber = getRandomArbitrary(0,5);

  articles.hrefs.splice(randomNumber, 1);

  console.log(JSON.stringify(articles, null, 4));

}

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * max) + min  
}

function highlightUnreadedArticles() {
  //Na página AgentTicketZoom, tem uma estrela, mas não quero destacá-la
  //por isso essa consulta se o parent dela tem a classe Last


  if ($('.UnreadArticles').parent().attr('class') != 'Last') {
    tds = $('.UnreadArticles').parent().parent().children();
    tds.each(
      function(index){
        if ($(this).parent().attr('class') == 'MasterAction Even' || $(this).parent().attr('class') == 'MasterAction Even Last') {
          $(this).css('background', '#6FCEC3');
        }else{
          if ($(this).parent().attr('class') == 'MasterAction'){
            $(this).css('background', '#93E1D8');
          }
        }
      }
    );
  }
}

function insertStyle() {
  //$('#Header').css('height', '110px');
  $('#NavigationContainer').css('height', '70px');
  $('#Navigation').css('width', '100%');
}

function setupRowButtons() {
  setupMainButtons('Fechados', 'http://srv-helpdesk.mp.rn.gov.br/otrs/index.pl?Action=AgentTicketSearch;Subaction=Search;TakeLastSearch=1;SaveProfile=1;Profile=Fechados%20Hoje%20%2F%20por%20Atendente');
  setupMainButtons('Final-06', 'http://srv-helpdesk.mp.rn.gov.br/otrs/index.pl?Action=AgentTicketSearch;Subaction=Search;TakeLastSearch=1;SaveProfile=1;Profile=Final%206');
  setupMainButtons('Final-05', 'http://srv-helpdesk.mp.rn.gov.br/otrs/index.pl?Action=AgentTicketSearch;Subaction=Search;TakeLastSearch=1;SaveProfile=1;Profile=Final%205');
  setupMainButtons('Final-04', 'http://srv-helpdesk.mp.rn.gov.br/otrs/index.pl?Action=AgentTicketSearch;Subaction=Search;TakeLastSearch=1;SaveProfile=1;Profile=Final%2004');
  setupMainButtons('Final-ZERO', 'http://srv-helpdesk.mp.rn.gov.br/otrs/index.pl?Action=AgentTicketSearch;Subaction=Search;TakeLastSearch=1;SaveProfile=1;Profile=Final%20ZERO');
  insertStyle();

}

//Setup main setupButtons
function setupMainButtons(buttonName, href) {
  var newItem = document.createElement('LI');
  newItem.className = 'CanDrag Even ui-sortable-handle';
  newItem.setAttribute('aria-controls', 'nav-Survey-container');
  newItem.setAttribute('aria-expanded', 'false');
  newItem.setAttribute('aria-haspopup', 'true');
  var textnode = document.createTextNode(buttonName);  // Create a text node

  var link = document.createElement('A');
  link.className = buttonName;
  link.href = href;

  link.appendChild(textnode);
  newItem.appendChild(link);

  var list = document.getElementById('Navigation');
  console.log("SETUP MAIN BUTTONS");
  
  list.insertBefore(newItem, list.childNodes[7]);
}

// Submit form de mover
//DestQueueID
function submitFormWithValue(value, id) {
  //select = document.getElementById(id);
  select = $('select'+id)[0]
  select.value = value;
  form = select.parentNode;
  form.submit();
}

//Return the element that was found
function findElementsByTagNameAndTextContent(tag, text) {
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

//Change feature name function
function changeFeatureName(tag, name, innerHTML) {
  tagFound = findElementsByTagNameAndTextContent(tag, name);
  tagFound.innerHTML = innerHTML;
}

//Fechar fechar chamado
function changeProperty() {
  document.getElementById('NewOwnerID').value = 22;
  document.getElementById('RichText')
    .value = 'Alterei a propriedade do chamado para JOSE.CAVALCANTE.';

  document.getElementById('submitRichText').click();
}

//Function setup buttons and new actions
function setupButtonsAndActions() {
  changeFeatureName('a', 'Proprietário', '<b>TORNAR-SE PROPRIETÁRIO</b>');
  changeFeatureName('a', 'Fechar', '<b>FINALIZAR</b>');
  createButonMover('GIRS', 14, 'highlight-out')
  createButonMover('BANCADA', 10)
  createButonMover('CIRO', 29)
  createButonMover('LEANDRO', 28)
  createButtonRespostaEmBranco();
  createButton('INICIAR ATENDIMENTO');
}

function createButton(buttonName){
  var newItem = document.createElement('LI');       // Create a <li> node
  var textnode = document.createTextNode(buttonName);  // Create a text node
  
  var url = window.location.href;
  var id = getAllUrlParams(url)
  
  
  var link = document.createElement('A');
  link.className = 'moverGirsLink highlight-start';
  link.href = 'http://srv-helpdesk.mp.rn.gov.br/otrs/index.pl?Action=AgentTicketNote;TicketID='+id.ticketid+'#iniciar-atendimento';

  var bold = document.createElement('B');
  
  link.appendChild(bold);
  bold.appendChild(textnode);
  newItem.appendChild(link);

  var list = document.getElementsByClassName('Actions');
  list[0].insertBefore(newItem, list[0].childNodes[17]);
}

function getAllUrlParams(url) {

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

    for (var i=0; i<arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // in case params look like: list[]=thing1&list[]=thing2
      var paramNum = undefined;
      var paramName = a[0].replace(/\[\d*\]/, function(v) {
        paramNum = v.slice(1,-1);
        return '';
      });

      // set parameter value (use 'true' if empty)
      var paramValue = typeof(a[1])==='undefined' ? true : a[1];

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

function selectFirstClientComment(domPath) {

  var promise = new Promise(function(resolve, reject) {
    $(domPath)[1].click()
  });

   
  return promise
}

function createButtonRespostaEmBranco(){
  var newItem = document.createElement('LI');       // Create a <li> node
  var textnode = document.createTextNode('RESPOSTA EM BRANCO');  // Create a text node

  var link = document.createElement('A');
  link.className = 'moverGirsLink highlight-answer';
  link.href = '#';
  link.onclick = function() {
    selectFirstClientComment('tbody #Row1 td div')

    
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

function createButonMoverGirs(){
  var newItem = document.createElement('LI');       // Create a <li> node
  var textnode = document.createTextNode('MOVER (GIRS)');  // Create a text node

  var link = document.createElement('A');
  link.className = 'moverGirsLink';
  link.href = '#';
  link.onclick = function () {
    submitFormWithValue(14, '#DestQueueID');
  };

  var bold = document.createElement('B');

  link.appendChild(bold);
  bold.appendChild(textnode);
  newItem.appendChild(link);

  var list = document.getElementsByClassName('Actions');
  list[0].insertBefore(newItem, list[0].childNodes[17]);
}

function createButonMover(text, formId, cssClass){
  var newItem = document.createElement('LI');       // Create a <li> node
  var textnode = document.createTextNode(text);  // Create a text node
  var cssClass = cssClass || ''

  var link = document.createElement('A');
  link.className = 'moverGirsLink highlight '+cssClass+'';
  link.href = '#';
  link.onclick = function () {
    submitFormWithValue(formId, '#DestQueueID');
  };

  var bold = document.createElement('B');

  link.appendChild(bold);
  bold.appendChild(textnode);
  newItem.appendChild(link);

  var list = document.getElementsByClassName('Actions');
  list[0].insertBefore(newItem, list[0].childNodes[17]);
}

//Fechar chamado!
function closeTitcketCall() {
  document.getElementById('RichText').value = 'Solicitação atendida.';
  document.getElementById('submitRichText').click();
}
