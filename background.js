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

function verifyConfiguration(){
    var rootRef = firebase.database().ref();
    var configRef = rootRef.child('configurations/responsible_for');

    promise = configRef.once("value")
    
    return promise
}

function fetchConfigurations(){
    print('** FETCH CONFIGURATIONS **');

    var promise = verifyConfiguration();

    promise.then(function(snapshot){
        if (snapshot.numChildren() == 0){
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
        } else {
            console.log("CONFIGURATION IS DONE");
        }
    })
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
        icon: 'icons/message-40.png',
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
                    window.open(message.href, '_blank','width='+screen.width+',height='+screen.height+',toolbar=1,menubar=1,location=0');
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

    // 3 minutes
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