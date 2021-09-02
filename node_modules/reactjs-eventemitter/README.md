
Step 1: Install the module as dependency.

```
npm i reactjs-eventemitter 
```

Step 2: Require the module.

```
import EventEmitter from "reactjs-eventemitter";
or
const EventEmitter = require("reactjs-eventemitter")
```

Step 3: Use the module.

```
// your app class

import React from 'react';

import Parent from "./parent";
import Child from "./child";

// here both parent and child are independent of each other

function App() {
  return (
    <div className="App">
        <Parent /> // parent or sibling component
        <Child /> // child or sibling component
    </div>
  );
}

export default App;
```


```
// parent class or sibling class

import React from 'react'
import EventEmitter from "reactjs-eventemitter";

export default function parent() {

    EventEmitter.subscribe('buttonClick', event => {

        console.log("button pressed inside child");
        console.log(event)

    })

    return (
        <div>
            This is parent component 
        </div>
    )

}
```

>[!Warning] When using useEffect hook use subscribe inside useEffect otherwise it'll be called twice
```
import React, { useEffect } from 'react'
const EventEmitter = require("reactjs-eventemitter")




export default function Parent() {

    useEffect(() => {
        console.log("parent component loading...")


        EventEmitter.subscribe('buttonClick', event => {

            console.log(event)
        
        })
        
        EventEmitter.subscribe('buttonClick2', event => {
        
            console.log(event)
        
        })
        
        
        EventEmitter.subscribe('buttonClick3', event => {
        
            console.log(event)
        
        })

    })

   
    return (
        <div>
            This is parent componetn 
        </div>
    )

}

```

```
// child class or sibling class

import React from 'react'
import EventEmitter from "reactjs-eventemitter";

export default function child() {


    return (
        <div>
            This is child componetn 

            <button onClick={(event) => EventEmitter.dispatch('buttonClick', event)}>
                Press Me
            </button>
        </div>
    )

}

```

Available Functions.

```
// publish the event (dispatch and emit both are same)

//for redux lovers
EventEmitter.dispatch('eventName', event);
//for angular lovers
EventEmitter.emit('eventName', event)

//subscribe the event
EventEmitter.subscribe('eventName', event => { //logic here })
```
