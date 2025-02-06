import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Card } from 'antd';
import Persona from './components/Persona';
import DistribucionGastos from './pages/DistribucionPage';

const App = () => {
  return (
    <div style={{ padding: "20px" }}>
      <Persona name="Pedro"></Persona>
    </div>
  );
};

export default App;