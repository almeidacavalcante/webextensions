function setupFirebase(){
  
    var config = {
        apiKey: "AIzaSyBquTcxItmMfsRbkSaOcPYAmPtl9Ko97ys",
        authDomain: "lucifer-plugin.firebaseapp.com",
        databaseURL: "https://lucifer-plugin.firebaseio.com",
        projectId: "lucifer-plugin",
        storageBucket: "lucifer-plugin.appspot.com",
        messagingSenderId: "198463203684"
    };

    try {
        firebase.initializeApp(config);
        email = '';
        password = '';
      
        firebase.auth().signInAnonymously().catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
          
            if (errorCode === 'auth/operation-not-allowed') {
              alert('You must enable Anonymous auth in the Firebase Console.');
            } else {
              console.error(error);
            }
        });
    }
    catch(err) {

    }

    // firebase.auth().signInWithEmailAndPassword(email, password)
    //         .catch(function(error) {
    //     // Handle Errors here.
    //     var errorCode = error.code;
    //     var errorMessage = error.message;
    //     if (errorCode === 'auth/wrong-password') {
    //         alert('Wrong password.');
    //     } else {
    //         alert(errorMessage);
    //     }
    //     console.log(error);
    // });
}

chrome.runtime.onMessage.addListener(treatContentEvent);

var connected = false

function treatContentEvent(articles){
    print('** TREAT CONTENT EVENT **');
    
    setupFirebase();

    fetchConfigurations()
    getStatus(articles)

}

function fetchConfigurations(){
    print('** FETCH CONFIGURATIONS **');
    var rootRef = firebase.database().ref();
    var configRef = rootRef.child('configurations/responsible_for');
    var newConfigRef = configRef.push();

    newConfigRef.set({
        "ticket_1" : 0,
        "ticket_2" : 0,
        "ticket_3" : 0,
        "ticket_4" : "http://srv-helpdesk.mp.rn.gov.br/otrs/index.pl?Action=AgentTicketSearch;Subaction=Search;TakeLastSearch=1;SaveProfile=1;Profile=Final%2004",
        "ticket_5" : "http://srv-helpdesk.mp.rn.gov.br/otrs/index.pl?Action=AgentTicketSearch;Subaction=Search;TakeLastSearch=1;SaveProfile=1;Profile=Final%205",
        "ticket_6" : "http://srv-helpdesk.mp.rn.gov.br/otrs/index.pl?Action=AgentTicketSearch;Subaction=Search;TakeLastSearch=1;SaveProfile=1;Profile=Final%206",
        "ticket_7" : 0,
        "ticket_8" : 0,
        "ticket_9" : 0,
        "ticket_0" : 0
    });
}

function getStatus(articles){
    print('** GET STATUS **');
    var rootRef = firebase.database().ref();
    var unreadRef = rootRef.child('unreadArticles');

    //Comparar tickets da pagina com os do banco
    print(articles);

    pageNumber = articles.pageNumber
    
    getArticlesByPageNumber(pageNumber).then(function(snapshot){

        verifyNewArticles(articles, snapshot).then(function(persistAndNotify) {

            removeSnapshopArticles(snapshot)

            persistAndNotify.persist.forEach( element => {
                var newUnreadRef = unreadRef.push();
                newUnreadRef.set({
                    "ticket": element.ticket,
                    "href": element.href,
                    "pageNumber": articles.pageNumber
                });
            })

            persistAndNotify.notify.forEach( element => {
                var newUnreadRef = unreadRef.push();
                newUnreadRef.set({
                    "ticket": element.ticket,
                    "href": element.href,
                    "pageNumber": articles.pageNumber
                });
                message = {
                    title: 'Nova movimentação!',
                    body: 'Ticket: #' + element.ticket,
                    href: element.href
                }
                notifyMe(message)
            })

        })
    });

}

function verifyNewArticles(articles, storedArticlesSnapshot){
    return new Promise( (resolve, reject) => {
        newUnreadArticles = []
        unreadArticles = []

        //Verifica se o novo artigo ja nao esta no banco.
        //se nao tiver adiciona no array newUnreadArticles que seja retornado
        articles.unreadArticlesJSON.forEach( element => {

            var found = false
            storedArticlesSnapshot.forEach(function(article){

                if (element.ticket == article.child('ticket').val()){
                    found = true;
                }

            })

            if (found == false) {
                //PERSIST 
                //NOTIFY
                newUnreadArticles.push(element);
            } else {
                unreadArticles.push(element);
                found = false
            }
        })

        resolve({
            notify: newUnreadArticles,
            persist: unreadArticles
        })
    });
}

function notifyMe(message){
    if((Notification in window)){
        alert("This browser does not support system notifications");
    }
    else if (Notification.permission === "granted"){
        notify(message);
    }
    else if (Notification.permission !== 'denied'){
        Notification.requestPermission(function (permission){
            if (permission === 'granted'){
                notify(message);
            }
        });
    }
}

function notify(message){

    var notification = new Notification(message.title, {
        icon: 'icons/lucifer-48.png',
        body: message.body,
        ticket: message.ticket
    })

    authorizedUrls = [
        'http://srv-helpdesk.mp.rn.gov.br/otrs/index.pl?Action=AgentTicketSearch;Subaction=Search;TakeLastSearch=1;SaveProfile=1;Profile=Final%2004',
        'http://srv-helpdesk.mp.rn.gov.br/otrs/index.pl?Action=AgentTicketSearch;Subaction=Search;TakeLastSearch=1;SaveProfile=1;Profile=Final%205',
        'http://srv-helpdesk.mp.rn.gov.br/otrs/index.pl?Action=AgentTicketSearch;Subaction=Search;TakeLastSearch=1;SaveProfile=1;Profile=Final%206'
    ]

    //TODO: To make it OFFLINE
    // authorizedUrls = [
    //     'file:///home/almeida/webextensions/lucifer-plug-in/pages/Procurar%20-%20Chamado%20-%20AtendeMP%20-%2004.html',
    //     'file:///home/almeida/webextensions/lucifer-plug-in/pages/Procurar%20-%20Chamado%20-%20AtendeMP%20-%2005.html',
    //     'file:///home/almeida/webextensions/lucifer-plug-in/pages/Procurar%20-%20Chamado%20-%20AtendeMP%20-%2006.html'
    // ]

    chrome.tabs.query({},function(tabs){
        tabs.forEach(function(tab){
            if( tab.url == authorizedUrls[0] ||
                tab.url == authorizedUrls[1] ||
                tab.url == authorizedUrls[2] ){

                tabId = tab.id;

                notification.onclick = function (event){
                    console.log(event);
                    // window.open(message.href, '_blank');
                    window.open(message.href, '_blank','width=800,height=600,toolbar=1,menubar=1,location=0');
                    //window.open(message.href, 'New Popup',height=100,width=100);
                    chrome.tabs.sendMessage(tabId,
                        {
                            messageObject: message,
                        },
                        function(response) {
                    });
                    notification.close();
                };
            }
        });
    });

    // 2 minutes
    timeToCloseNotification = 3 * 60000;
    setTimeout(notification.close.bind(notification), timeToCloseNotification);
}

function getArticleByTicket(ticket){
    var rootRef = firebase.database().ref();
    var query = rootRef.child('unreadArticles');

    promise = query.orderByChild("ticket").equalTo(ticket).once("value")
    
    return promise
}

function removeSnapshopArticles(snapshot){
    snapshot.forEach(function(data) {
        data.ref.remove()
    });
}

function getArticlesByPageNumber(pageNumber){
    var rootRef = firebase.database().ref();
    var query = rootRef.child('unreadArticles');

    print("PAGE NUMBER: " + pageNumber)
    promise = query.orderByChild("pageNumber").equalTo(pageNumber).once("value")
    
    return promise
}

function findTicket(ticket){
    var rootRef = firebase.database().ref();
    var unreadRef = rootRef.child('unreadArticles');
    print("TICKET:" + ticket)
    promise = unreadRef.orderByChild('ticket').equalTo(ticket).once("value")

    return promise
}

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * max) + min
}

function print(content){
    console.log(JSON.stringify(content, null, 4));
}


// function treatEventNew(unreadArticles){
    
//     id = 'unreadArticles' + unreadArticles.pageNumber;
//     print('TREAT EVENT -> ID: ' + id)
//     chrome.storage.sync.get(id, function(storedValue) {

//         print(storedValue);

//         if (!chrome.runtime.error) {
//             if (typeof storedValue[id] != 'string') {
//                 storedValue[id] = '';
//             }
//             if (storedValue.unreadArticles == undefined){  
//                 print('UNDEFINED');
//                 saveStatus(unreadArticles);
//             }else if ([storedValue.id].unreadArticlesJSON.length < unreadArticles.unreadArticlesJSON.length) {
//                 print('STORED VALUES <= ACTUAL VALUES');
//                 saveStatus(unreadArticles);
//             }
//         }
//     });
// }

// function saveStatus(unreadArticles){
//     print('SAVE STATUS');
//     print(unreadArticles);

//     id = 'unreadArticles' + unreadArticles.pageNumber;
//     print('SAVE STATUS -> ID: ' + id)

//     chrome.storage.sync.set({id: unreadArticles}, function() {
//         unreadArticles.unreadArticlesJSON.forEach(element => {
//             message = {
//                 title: 'Nova movimentação!',
//                 body: 'Ticket: #' + element.ticket,
//                 href: element.href
//             }
//             notifyMe(message);

//             //chrome.storage.sync.clear();
//         });

//         chrome.storage.sync.get(id, function(dados){
//             console.log(dados);
//         })
//     });
// }


// function treatEvent(unreadArticlesObject){
//     //saveChanges(unreadArticles.unreadArticles);
//     console.log('treatEvent: ' + unreadArticlesObject.unreadArticles);
//     // Get a value saved in a form.
//     var actualUnreadArticles = unreadArticlesObject;
//     // Check that there's some code there.
//     if (!actualUnreadArticles) {
//       alert('Error: No value specified');
//       return;
//     }

//     // chrome.storage.sync.set({'unreadArticles': 0}, function() {
//     //     message = {
//     //         title: 'You have new messages...',
//     //         body: 'check those out'
//     //     }
//     //     notifyMe(message);
//     // });
//     chrome.storage.sync.clear();


//     chrome.storage.sync.get("unreadArticles", function(items) {
//         if (!chrome.runtime.error) {
//             console.log('GET: items: ' + items.unreadArticles);
//             storedValue = items.unreadArticles;

//             // if (actualUnreadArticles.hrefs.length == 12){
//             //     chrome.storage.sync.set({'unreadArticles': 0}, function() {
//             //         //no code
//             //     });
//             // } else
//             if (storedValue == undefined){
//                 console.log('storedValue == undefined');

//                 chrome.storage.sync.set({'unreadArticles': actualUnreadArticles.unreadArticles}, function() {
//                     console.log('chrome.storage.sync.set: '+JSON.stringify(actualUnreadArticles.unreadArticles.hrefs, null, 4));

//                     Array.prototype.forEach.call((actualUnreadArticles.unreadArticles.hrefs), element => {
//                         console.log('ELEMENT: '+JSON.stringify(element))

//                         ticket = '70101' + getRandomArbitrary(100,199)
//                         message = {
//                             title: 'New movimentation',
//                             body: 'Ticket: #' + ticket,
//                             href: element + ticket
//                         }
//                         console.log('chrome.storage.sync.set: before notifyMe()');

//                         notifyMe(message);
//                     });
//                 });
//             }
//             else if (true){

//                 chrome.storage.sync.set({'unreadArticles': actualUnreadArticles.unreadArticles}, function() {

//                     //result = actualUnreadArticles - storedValue;

//                     message = {
//                         title: 'You have ' + result + ' messages',
//                         body: 'check those out',
//                         href: 'http://www.google.com.br/' + '#' + actualUnreadArticles
//                     }

//                     notifyMe(message);
//                 });
//             }
//         }
//         // else {
//         //     chrome.storage.sync.set({'unreadArticles': actualUnreadArticles}, function() {
//         //         message = {
//         //             title: 'You have new messages...',
//         //             body: 'check those out',
//         //             href: 'http://www.google.com.br/' + '#' + actualUnreadArticles
//         //         }
//         //         notifyMe(message);
//         //     });
//         // }
//     });
// }


// function saveChanges(unreadArticlesObject) {
//     console.log('inside saveChanges' + unreadArticlesObject.hrefs);
//     // Get a value saved in a form.
//     var actualUnreadArticles = unreadArticlesObject.hrefs;
//     console.log('saveChanges... ' + actualUnreadArticles);
//     // Check that there's some code there.
//     if (!actualUnreadArticles) {
//       alert('Error: No value specified');
//       return;
//     }

//     // chrome.storage.sync.set({'unreadArticles': 0}, function() {
//     //     message = {
//     //         title: 'You have new messages...',
//     //         body: 'check those out'
//     //     }
//     //     notifyMe(message);
//     // });

//     chrome.storage.sync.get("unreadArticles", function(items) {
//         if (!chrome.runtime.error) {
//             console.log('GET->items: ' + items.hrefs.length);
//             storedValue = items.hrefs;

//             if (actualUnreadArticles.hrefs.length == 12){
//                 chrome.storage.sync.set({'unreadArticles': 0}, function() {
//                     //no code
//                 });
//             } else  if (storedValue == undefined){
//                 chrome.storage.sync.set({'unreadArticles': actualUnreadArticles}, function() {
//                     actualUnreadArticles.href.forEach(element => {
//                         message = {
//                             title: 'New comment...',
//                             body: 'Ticket: #70101212',
//                             href: element
//                         }
//                         notifyMe(message);
//                     });
//                 });
//             }
//             // else if (storedValue.length < actualUnreadArticles.hrefs.length){

//             //     chrome.storage.sync.set({'unreadArticles': actualUnreadArticles}, function() {

//             //         result = actualUnreadArticles - storedValue;

//             //         message = {
//             //             title: 'You have ' + result + ' messages',
//             //             body: 'check those out',
//             //             href: 'http://www.google.com.br/' + '#' + actualUnreadArticles
//             //         }

//             //         notifyMe(message);
//             //     });
//             // }
//         }
//         // else {
//         //     chrome.storage.sync.set({'unreadArticles': actualUnreadArticles}, function() {
//         //         message = {
//         //             title: 'You have new messages...',
//         //             body: 'check those out',
//         //             href: 'http://www.google.com.br/' + '#' + actualUnreadArticles
//         //         }
//         //         notifyMe(message);
//         //     });
//         // }
//     });
// }

// function sendData(tab){
//     chrome.tabs.sendMessage(tab.id, {data:'dummyData'});
// }

