const EventEmitter = {
    // holds all the events
    events : {}, 
    //for angular lovers
    emit : function(event, data){
        if(!this.events[event]) return;
        this.events[event].forEach(callback => callback(data));
    },
    // for redux lovers
    dispatch : function(event, data){
        if(!this.events[event]) return;
        this.events[event].forEach(callback => callback(data));
    },
    // for this module lovers
    subscribe : function(event, callback){
        if(!this.events[event]) this.events[event] = [];
        this.events[event].push(callback);
    }
}

module.exports = EventEmitter; 