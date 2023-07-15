import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from './App';

test('renders welcome message', () => {
  render(<App />);
  const welcomeMessage = screen.getByText("Welcome to the R2D2 Prototype!");
  expect(welcomeMessage).toBeInTheDocument();
});

test('displays error message when prompt is not modified', () => {
  process.env.REACT_APP_BACKEND_URL = 'http://localhost:8000/';

  render(<App />);
  const submitButton = screen.getByRole('button', { name: /submit/i });
  fireEvent.click(submitButton);
  const errorMessage = screen.getByText(/Please modify the initial prompt/i);
  expect(errorMessage).toBeInTheDocument();
});
