import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from "react-router-dom";
import App from './App';

test('renders welcome message', () => {
  render(
    <Router>
      <App />
    </Router>
  );
  const welcomeMessage = screen.getByText(/¡Te damos la bienvenida a Wichat! ¡Esperamos que disfrutes!/i);
  expect(welcomeMessage).toBeInTheDocument();
});


