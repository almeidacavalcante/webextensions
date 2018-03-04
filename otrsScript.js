beginScript();



function beginScript() {
  //if (location.href.includes('http://srv-helpdesk.mp.rn.gov.br/otrs/index.pl?Action=AgentTicketSearch;Subaction=Search;TakeLastSearch=1;SaveProfile=1;Profile=Final%205')){
  if(location.href.includes('https://www.google.com.br')){  
    console.log("HELLO");
    
    //highlightUnreadedArticles();
    //setupRowButtons();
    delay = getRandomArbitrary(15000, 30000);
    setInterval(identifyArticleChange, delay)
    // identifyArticleChange();
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

function identifyArticleChange(){
  //numberOfUnreadedArticles = $('td.unreadArticles').length;
  //numberOfUnreadedArticles = getRandomArbitrary(1,5);
  //console.log(numberOfUnreadedArticles);

  unreadArticles = {
    hrefs: [
      'http://www.google.com/#1',
      'http://www.google.com/#2',
      'http://www.google.com/#3',
      'http://www.google.com/#4',
      'http://www.google.com/#5',
      'http://www.google.com/#6'
    ]
  };

  returnRandomSubGroup(unreadArticles);

  chrome.runtime.sendMessage({
    unreadArticles: unreadArticles
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
