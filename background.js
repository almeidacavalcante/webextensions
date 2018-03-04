function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * max) + min  
}

function treatEvent(unreadArticlesObject){ 
    //saveChanges(unreadArticles.unreadArticles);
    console.log('treatEvent: ' + unreadArticlesObject.unreadArticles);
    // Get a value saved in a form.
    var actualUnreadArticles = unreadArticlesObject;
    console.log('treatEvent:after assign: ' + actualUnreadArticles.unreadArticles);
    console.log('treatEvent:after assign length: ' + actualUnreadArticles.unreadArticles.hrefs.length);
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

chrome.runtime.onMessage.addListener(treatEvent);


// unreadArticles =  {
//     hrefs: [
//       'http://www.google.com.br/#1',
//       'http://www.google.com.br/#2',
//       'http://www.google.com.br/#3',
//       'http://www.google.com.br/#4',
//       'http://www.google.com.br/#5',
//       'http://www.google.com.br/#6'
//     ]
//   };

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
    })

    notification.onclick = function (){
        window.open(message.href);
    };
    setTimeout(notification.close.bind(notification), 12000);
}