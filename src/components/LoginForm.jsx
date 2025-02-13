import { Form, Input, Button, Checkbox } from 'antd';

const LoginForm = ({ onFinish, loading }) => (
  <Form
    name="login"
    initialValues={{ remember: true }}
    onFinish={onFinish}
    layout="vertical"
  >
    <Form.Item
      label="Correo electrónico"
      name="email"
      rules={[{ required: true, message: '¡Por favor ingresa tu correo electrónico!' }, { type: 'email', message: '¡El correo no es válido!' }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Contraseña"
      name="password"
      rules={[{ required: true, message: '¡Por favor ingresa tu contraseña!' }]}
    >
      <Input.Password />
    </Form.Item>

    <Form.Item name="remember" valuePropName="checked">
      <Checkbox>Recordarme</Checkbox>
    </Form.Item>

    <Form.Item>
      <Button type="primary" htmlType="submit" block loading={loading}>
        Iniciar sesión
      </Button>
    </Form.Item>
  </Form>
);

export default LoginForm;
