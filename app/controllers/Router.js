class RouterMap{

    constructor(){
        this._menuView = new MenuView();
        this._functions = [];
        this._context = [];
    }

    fetchFunctions(route){

        let monitoredUrls = [
            'Action=AgentTicketSearch;Subaction=Search;TakeLastSearch=1;SaveProfile=1;Profile=Final%2004',
            'Action=AgentTicketSearch;Subaction=Search;TakeLastSearch=1;SaveProfile=1;Profile=Final%205',
            'Action=AgentTicketSearch;Subaction=Search;TakeLastSearch=1;SaveProfile=1;Profile=Final%206',
            'Action=AgentTicketSearch;Subaction=Search;TakeLastSearch=1;SaveProfile=1;Profile=Final%20ZERO',
            'Action=AgentTicketSearch;Subaction=Search;TakeLastSearch=1;SaveProfile=1;Profile=Fechados%20Hoje%20%2F%20por%20Atendente',
            'index.pl?Action=AgentTicketClose;TicketID=',
            'index.pl?Action=AgentTicketOwner;TicketID=',
            'index.pl?Action=AgentTicketZoom;TicketID=',
            'index.pl?Action=AgentTicketNote',
            '#iniciar-atendimento',
            'index.pl?ChallengeToken=',
            'index.pl?Action=AgentTicketPhone',
            'index.pl?Action=AgentTicketSearch',
            'index.pl?Action=AgentDashboard',
            'index.pl?Action=AgentTicketQueue'
          ]

        if( route.includes(monitoredUrls[0]) ||
            route.includes(monitoredUrls[1]) ||
            route.includes(monitoredUrls[2]) ||
            route.includes(monitoredUrls[3]) ){

            this._menuView.setupRowButtons();
            this._menuView.highlightUnreadedArticles();
            this._menuView.identifyTicketAndRemoveTr();
            this._menuView.reloadPeriodically();
            this._menuView.onReloadCheck();
            return;
        }

        if( route.includes(monitoredUrls[4])) {
            this._menuView.changeTitles();
            return;
        }

        if( route.includes(monitoredUrls[5])) {
            this._menuView.closeTitcketCall();
            return;
        }

        if( route.includes(monitoredUrls[6])) {
            this._menuView.changeProperty();
            return;
        }

        if( route.includes(monitoredUrls[7])) {
            this._menuView.highlightUnreadedArticles();
            this._menuView.setupButtonsAndActions();
            this._menuView.setupRowButtons();
            return;
        }

        if( route.includes(monitoredUrls[8] &&
            route.includes(monitoredUrls[9]))) {
            this._menuView.addNote();
            return;
        }

        if( route.includes(monitoredUrls[10])) {
            this._menuView.setupBlankAnswer();
            return;
        }

        if( route.includes(monitoredUrls[11])) {
            this._menuView.setupFastUnblockTicket();
            return;
        }

        if( route.includes(monitoredUrls[12] ||
            route.includes(monitoredUrls[13] ))) {
            this._menuView.setupRowButtons();
            this._menuView.highlightUnreadedArticles();
            return;
        }

        if( route.includes(monitoredUrls[14])) {
            this._menuView.setupRowButtons();
            return;
        }
    }

    get context(){
        return this._context;
    }

    _add(functionRef, context){
        this._functions.push(functionRef);
        this._context.push(context)
    }
}

class Router {

    constructor () {
        this._route = location.href;
        this._menuView = new MenuView();
        this._routerMap = new RouterMap();

    }

    get route(){
        return this._route;
    }

    init(){
        this._routerMap.fetchFunctions(this.route);

    }
    
}