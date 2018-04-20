class Database {

    constructor () {
        this.config = {
            apiKey: "AIzaSyBquTcxItmMfsRbkSaOcPYAmPtl9Ko97ys",
            authDomain: "lucifer-plugin.firebaseapp.com",
            databaseURL: "https://lucifer-plugin.firebaseio.com",
            projectId: "lucifer-plugin",
            storageBucket: "lucifer-plugin.appspot.com",
            messagingSenderId: "198463203684"
        };
    }

    setupFirebase(){
        try {
            firebase.initializeApp(this.config);
            let email = '';
            let password = '';
          
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
            console.log(err);
        }
    }
}