// App.js
import React from 'react';  
import QuoteList from './components/QuoteList';
import AddQuote from './components/AddQuote';
function App() {
    console.log("App is rendering");
    return (
         
        <div>        <AddQuote />
        <QuoteList />
        </div >                
                );
}

export default App;
