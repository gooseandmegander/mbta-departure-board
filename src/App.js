import React, { useState, useEffect } from 'react';

import mapStream from './mapStream';
import './App.css';

function App() {
  const [predictions, setPredictions] = useState([]);


  function stream() {
    const events = new EventSource('http://localhost:8000');
    events.onmessage = ({ data }) => {
      const parsedData = JSON.parse(data);
      const mappedStream = mapStream(parsedData);
    }

    events.onerror = (error) => {
      console.log('EventSource Error: ', error)
    }
  }

  useEffect(() => {
    stream();
  })

  return (
    <div className="App">
      <h1>South Station</h1>
      {predictions.map(prediction => {
        return <div key={prediction['id']}>
          <p>{prediction['attributes']['departure_time']}</p>
        </div>
      })}


    </div>
  );
}

export default App;
