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
    'http://srv-helpdesk.mp.rn.gov.br/otrs/index.pl?Action=AgentTicketSearch;Subaction=Search;TakeLastSearch=1;SaveProfile=1;Profile=Final%206'
  ]

  monitoredOfflineUrls = [
    'file:///home/almeida/webextensions/lucifer-plug-in/pages/Procurar%20-%20Chamado%20-%20AtendeMP%20-%2004.html',
    'file:///home/almeida/webextensions/lucifer-plug-in/pages/Procurar%20-%20Chamado%20-%20AtendeMP%20-%2005.html',
    'file:///home/almeida/webextensions/lucifer-plug-in/pages/Procurar%20-%20Chamado%20-%20AtendeMP%20-%2006.html'
  ]

  if (location.href.includes(monitoredOfflineUrls[0]) ||
      location.href.includes(monitoredOfflineUrls[1]) ||
      location.href.includes(monitoredOfflineUrls[2])) {

    console.log("THE BEGINING...");

    onReloadCheck();
    setupRowButtons();
    highlightUnreadedArticles();

    miliseconds = 120 * 60000;
    reloadPeriodically(miliseconds);

  } else if (location.href.includes('index.pl?Action=AgentTicketClose;TicketID=')) {
    closeTitcketCall();
  } else if (location.href.includes('index.pl?Action=AgentTicketOwner;TicketID=')) {
    changeProperty();
  } else if (location.href.includes('index.pl?Action=AgentTicketZoom;TicketID=')) {
    setupButtonsAndActions();
    setupRowButtons();
    highlightUnreadedArticles();
  } else if (location.href.includes('index.pl?Action=AgentTicketSearch') ||
    location.href.includes('index.pl?Action=AgentDashboard') ||
    location.href.includes('index.pl?')) {
    setupRowButtons();
    highlightUnreadedArticles();
  }
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

function createEnvironment(){
  $('span#body.ctr-p').remove();
  $('div#searchform.jhp').remove();
  $('div.fbar').remove();

  $(`
  <table id="searchform" class="" style="width:100%">
    <tr>
      <th>Ticket</th>
      <th>Client</th> 
      <th>Subject</th>
    </tr>
    <tr>
      <td>#70119901</td>
      <td>Smith</td> 
      <td>Computer doesnt start</td>
    </tr>
    <tr>
      <td>#70119912</td>
      <td>Jackson</td> 
      <td>I need a mousepad</td>
    </tr>
    <tr>
      <td>#70119922</td>
      <td>Livia</td> 
      <td>I need a monitor</td>
    </tr>
    <tr>
      <td>#70111234</td>
      <td>Mark</td> 
      <td>Reset my password</td>
    </tr>
    <tr>
      <td>#70114321</td>
      <td>Jackson</td> 
      <td>I need a mousepad</td>
    </tr>
    <tr>
      <td>#70111324</td>
      <td>Livia</td> 
      <td>I need a monitor</td>
    </tr>
  </table>
  `).appendTo('div#main.content');

  addCSS();

  delay = getRandomArbitrary(5000,11000);
  setInterval(insertOrChangeLine, delay);
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

  offlineUrls = [
    'file:///home/almeida/webextensions/lucifer-plug-in/pages/Procurar%20-%20Chamado%20-%20AtendeMP%20-%2004.html',
    'file:///home/almeida/webextensions/lucifer-plug-in/pages/Procurar%20-%20Chamado%20-%20AtendeMP%20-%2005.html',
    'file:///home/almeida/webextensions/lucifer-plug-in/pages/Procurar%20-%20Chamado%20-%20AtendeMP%20-%2006.html'
  ]

  if (location.href == offlineUrls[0]){
    pageNumber = 4;
  } else if (location.href == offlineUrls[1]) {
    pageNumber = 5;
  } else if (location.href == offlineUrls[2]) {
    pageNumber = 6;
  }


  console.log(JSON.stringify(unreadArticlesJSON,null,4));
  chrome.runtime.sendMessage({
    unreadArticlesJSON: unreadArticlesJSON,
    pageNumber: pageNumber  
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
        if ($(this).parent().attr('class') == 'MasterAction Even') {
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
  list.insertBefore(newItem, list.childNodes[7]);
}

// Submit form de mover
function submitFormWithValue(value) {
  select = document.getElementById('DestQueueID');
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

  var newItem = document.createElement('LI');       // Create a <li> node
  var textnode = document.createTextNode('MOVER (GIRS)');  // Create a text node

  var link = document.createElement('A');
  link.className = 'moverGirsLink';
  link.href = '#';
  link.onclick = function () {
    submitFormWithValue(14);
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
