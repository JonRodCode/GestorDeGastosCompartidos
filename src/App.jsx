import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Card } from 'antd';
import Persona from './components/Persona';
import DistribucionGastos from './pages/DistribucionPage';
import GastosDeOtros from './components/GastosDeOtros';

const App = () => {
  

  return (
    <div style={{ padding: "20px" }}>
      <DistribucionGastos/>
    </div>
  );
};

export default App;