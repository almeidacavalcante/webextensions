class Button {
    constructor(name, href, li, ul){
        this._name = name;
        this._href = href;
        this._li = li;
        this._ul = ul;
    }

    get name(){
        return this._name;
    }

    get href(){
        return this._href;
    }

    get li(){
        return this._li;
    }

    get ul(){
        return this._ul;
    }

}