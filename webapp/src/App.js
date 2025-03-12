import React, { useState } from 'react';
import AddUser from './components/register/AddUser';
import Login from './components/login/Login';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

function App() {
  const [showLogin, setShowLogin] = useState(true);

  const handleToggleView = () => {
    setShowLogin(!showLogin);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Typography component="h1" variant="h5" align="center" sx={{ marginTop: 2 }}>
          ¡Te damos la bienvenida a Wichat! ¡Esperamos que disfrutes!
      </Typography>
      {showLogin ? <Login /> : <AddUser />}
      <Typography component="div" align="center" sx={{ marginTop: 2 }}>
        {showLogin ? (
          <Link name="gotoregister" component="button" variant="body2" onClick={handleToggleView}>
            ¿No tienes una cuenta? Regístrate aquí.
          </Link>
        ) : (
          <Link component="button" variant="body2" onClick={handleToggleView}>
            ¿Ya tienes una cuenta? Inicia sesión aquí.
          </Link>
        )}
      </Typography>
    </Container>
  );
}

export default App;
