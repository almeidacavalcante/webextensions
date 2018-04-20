class Counter {

    constructor(articles) {
        this.numberOfTickets = articles.numberOfTickets;
        this.pageNumber = articles.pageNumber;
    }

    getTickets(){
        let rootRef = firebase.database().ref();
        let counterRef = rootRef.child('counter');

        counterRef.orderByChild("pageNumber").once("value").then((snapshot) => {
            snapshot.forEach( element => {
                console.log(element);
                
            })
        })
    }

    save(){
        let rootRef = firebase.database().ref();
        let counterRef = rootRef.child('counter');

        counterRef.orderByChild("pageNumber").equalTo(this.pageNumber).once("value").then((snapshot) => {
            if(snapshot.numChildren() == 0){
                console.log("ZERO!");
                counterRef.push().set({
                    "numberOfTickets": this.numberOfTickets,
                    "pageNumber" : this.pageNumber
                }) 
            }else{
                
                snapshot.forEach(element => {
                    if (element.child('pageNumber').val() == this.pageNumber){
                        let key = element.key;

                        let updateRef = rootRef.child('counter/' + key)
                        
                        updateRef.update({
                            "numberOfTickets": this.numberOfTickets,
                            "pageNumber" : this.pageNumber
                        })
                    }
                });
            }

        })
    }
}