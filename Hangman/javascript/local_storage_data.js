class Local_storage_data{

    constructor(type,name){

        this.type = type;
        this.name = name;
        
    }

    set type(type){

        this._type = type;
    }

    get type(){

        return this._type;
    }

    set name(name){

        this._name = name;
    }

    get name(){

        return this._name;
    }

    set data(data){

        this._data = data;
    }

    get data(){

        return this._data;
    }

    save(data)
    {
        this.data = data;

        if(this.type)
            localStorage.setItem(this.name,JSON.stringify(this.data));
        else
            localStorage.setItem(this.name,this.data);
        
    }

    load()
    {

        var data = [];

        if(localStorage.getItem(this.name))
        {
            
            if(this.type)
                data = JSON.parse(localStorage.getItem(this.name));
            else
                data.push(localStorage.getItem(this.name));
        }
        
        if(data[0])        
            return data;
        else
            return [];    

    }

    remove()
    {

        if(localStorage.getItem(this.name))
        {
            localStorage.removeItem(this.name);
        }

    }

}


