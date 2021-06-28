import React from 'react';
import Provider from './context/Provider';
import Table from './components/Table/index';

import './App.css';

function App() {
  return (
    <Provider>
      <div className="App">
        <Table />
      </div>
    </Provider>
  );
}

export default App;
