import React from 'react';
import App from './App';
import { render, screen, fireEvent } from '@testing-library/react';


describe('App', () => {
  test('renders welcome message', () => {
    render(<App />);
    const welcomeMessage = screen.getByText(/Welcome to the R2D2 Prototype/i);
    expect(welcomeMessage).toBeInTheDocument();
  });

  test('displays error message when prompt is not modified', () => {
    render(<App />);
    const submitButton = screen.getByText((content, element) => {
      return element.tagName.toLowerCase() === 'button' && /Submit/i.test(content);
    });
    fireEvent.click(submitButton);
    const errorMessage = screen.getByText(/Please modify the initial prompt./i);
    expect(errorMessage).toBeInTheDocument();
  });  

  // Add more test cases as needed
});
