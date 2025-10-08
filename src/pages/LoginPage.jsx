import React, { useState } from 'react';
import { Card } from 'antd';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    console.log('Login values:', values);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('¡Inicio de sesión exitoso!');
    }, 1000);
  };

  return (
    <div>
      <Card title="Iniciar sesión" >
        <LoginForm onFinish={onFinish} loading={loading} />
      </Card>
    </div>
  );
};

export default LoginPage;