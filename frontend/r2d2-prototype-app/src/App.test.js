test('renders welcome message', () => {
  render(<App />);
  const welcomeMessage = screen.getByText("Welcome to the R2D2 Prototype!");
  expect(welcomeMessage).toBeInTheDocument();
});
