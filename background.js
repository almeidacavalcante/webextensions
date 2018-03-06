function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * max) + min
}

function print(content){
    console.log(JSON.stringify(content, null, 4));
}

// {
//     "ticket": "70122005",
//     "href": "localhost:4200"
// }
function treatEventNew(unreadArticles){

    chrome.storage.sync.get("unreadArticles", function(storedValue) {

        if (!chrome.runtime.error) {
            if (storedValue.unreadArticles == undefined){
                print('UNDEFINED');
                saveStatus(unreadArticles);
            }else if (storedValue.unreadArticles.unreadArticlesJSON.length <= unreadArticles.unreadArticlesJSON.length) {
                print('STORED VALUES <= ACTUAL VALUES');
                saveStatus(unreadArticles);
            }
        }
    });
}

chrome.runtime.onMessage.addListener(treatEventNew);

function saveStatus(unreadArticles){
    print('SAVE STATUS');
    chrome.storage.sync.set({'unreadArticles': unreadArticles}, function() {
        unreadArticles.unreadArticlesJSON.forEach(element => {
            message = {
                title: 'Nova movimentação!',
                body: 'Ticket: #' + element.ticket,
                href: element.href
            }
            notifyMe(message);
        });
    });
}


function treatEvent(unreadArticlesObject){
    //saveChanges(unreadArticles.unreadArticles);
    console.log('treatEvent: ' + unreadArticlesObject.unreadArticles);
    // Get a value saved in a form.
    var actualUnreadArticles = unreadArticlesObject;
    // Check that there's some code there.
    if (!actualUnreadArticles) {
      alert('Error: No value specified');
      return;
    }

    // chrome.storage.sync.set({'unreadArticles': 0}, function() {
    //     message = {
    //         title: 'You have new messages...',
    //         body: 'check those out'
    //     }
    //     notifyMe(message);
    // });
    chrome.storage.sync.clear();


    chrome.storage.sync.get("unreadArticles", function(items) {
        if (!chrome.runtime.error) {
            console.log('GET: items: ' + items.unreadArticles);
            storedValue = items.unreadArticles;

            // if (actualUnreadArticles.hrefs.length == 12){
            //     chrome.storage.sync.set({'unreadArticles': 0}, function() {
            //         //no code
            //     });
            // } else
            if (storedValue == undefined){
                console.log('storedValue == undefined');

                chrome.storage.sync.set({'unreadArticles': actualUnreadArticles.unreadArticles}, function() {
                    console.log('chrome.storage.sync.set: '+JSON.stringify(actualUnreadArticles.unreadArticles.hrefs, null, 4));

                    Array.prototype.forEach.call((actualUnreadArticles.unreadArticles.hrefs), element => {
                        console.log('ELEMENT: '+JSON.stringify(element))

                        ticket = '70101' + getRandomArbitrary(100,199)
                        message = {
                            title: 'New movimentation',
                            body: 'Ticket: #' + ticket,
                            href: element + ticket
                        }
                        console.log('chrome.storage.sync.set: before notifyMe()');

                        notifyMe(message);
                    });
                });
            }
            else if (true){

                chrome.storage.sync.set({'unreadArticles': actualUnreadArticles.unreadArticles}, function() {

                    //result = actualUnreadArticles - storedValue;

                    message = {
                        title: 'You have ' + result + ' messages',
                        body: 'check those out',
                        href: 'http://www.google.com.br/' + '#' + actualUnreadArticles
                    }

                    notifyMe(message);
                });
            }
        }
        // else {
        //     chrome.storage.sync.set({'unreadArticles': actualUnreadArticles}, function() {
        //         message = {
        //             title: 'You have new messages...',
        //             body: 'check those out',
        //             href: 'http://www.google.com.br/' + '#' + actualUnreadArticles
        //         }
        //         notifyMe(message);
        //     });
        // }
    });
}


function saveChanges(unreadArticlesObject) {
    console.log('inside saveChanges' + unreadArticlesObject.hrefs);
    // Get a value saved in a form.
    var actualUnreadArticles = unreadArticlesObject.hrefs;
    console.log('saveChanges... ' + actualUnreadArticles);
    // Check that there's some code there.
    if (!actualUnreadArticles) {
      alert('Error: No value specified');
      return;
    }

    // chrome.storage.sync.set({'unreadArticles': 0}, function() {
    //     message = {
    //         title: 'You have new messages...',
    //         body: 'check those out'
    //     }
    //     notifyMe(message);
    // });

    chrome.storage.sync.get("unreadArticles", function(items) {
        if (!chrome.runtime.error) {
            console.log('GET->items: ' + items.hrefs.length);
            storedValue = items.hrefs;

            if (actualUnreadArticles.hrefs.length == 12){
                chrome.storage.sync.set({'unreadArticles': 0}, function() {
                    //no code
                });
            } else  if (storedValue == undefined){
                chrome.storage.sync.set({'unreadArticles': actualUnreadArticles}, function() {
                    actualUnreadArticles.href.forEach(element => {
                        message = {
                            title: 'New comment...',
                            body: 'Ticket: #70101212',
                            href: element
                        }
                        notifyMe(message);
                    });
                });
            }
            // else if (storedValue.length < actualUnreadArticles.hrefs.length){

            //     chrome.storage.sync.set({'unreadArticles': actualUnreadArticles}, function() {

            //         result = actualUnreadArticles - storedValue;

            //         message = {
            //             title: 'You have ' + result + ' messages',
            //             body: 'check those out',
            //             href: 'http://www.google.com.br/' + '#' + actualUnreadArticles
            //         }

            //         notifyMe(message);
            //     });
            // }
        }
        // else {
        //     chrome.storage.sync.set({'unreadArticles': actualUnreadArticles}, function() {
        //         message = {
        //             title: 'You have new messages...',
        //             body: 'check those out',
        //             href: 'http://www.google.com.br/' + '#' + actualUnreadArticles
        //         }
        //         notifyMe(message);
        //     });
        // }
    });
}

function sendData(tab){
    chrome.tabs.sendMessage(tab.id, {data:'dummyData'});
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
        icon: 'img/penny.png',
        body: message.body,
        ticket: message.ticket
    })

    authorizedUrls = [
        'file:///home/almeida/webextensions/lucifer-plug-in/pages/Procurar%20-%20Chamado%20-%20AtendeMP.html',
        'file:///home/almeida/webextensions/lucifer-plug-in/pages/Procurar%20-%20Chamado%20-%20AtendeMP.html',
        'file:///home/almeida/webextensions/lucifer-plug-in/pages/Procurar%20-%20Chamado%20-%20AtendeMP.html',
        'file:///home/almeida/webextensions/lucifer-plug-in/pages/Procurar%20-%20Chamado%20-%20AtendeMP.html'
    ]

    chrome.tabs.query({},function(tabs){
        tabs.forEach(function(tab){
            if( tab.url == authorizedUrls[0] ||
                tab.url == authorizedUrls[1] ||
                tab.url == authorizedUrls[2] ||
                tab.url == authorizedUrls[3] ){

                tabId = tab.id;

                notification.onclick = function (event){
                    console.log(event);
                    // window.open(message.href, '_blank');
                    window.open('file:///home/almeida/webextensions/lucifer-plug-in/pages/70122145%20-%20Detalhes%20-%20Chamado%20-%20AtendeMP.html', '_blank','width=800,height=600,toolbar=1,menubar=1,location=0');
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


    setTimeout(notification.close.bind(notification), 10000);
}