import React, { useState } from 'react';
import './App.css';

function App() {
  // Define the options for different features and their corresponding prompts
  const options = [
    { label: 'MarketGPT', prompt: 'Enter the company name to perform competitor research.' },
    { label: 'Personalized Email Outreach', prompt: 'Create an email for [Recipient] regarding [Subject].' },
    { label: 'Social Media Posting', prompt: 'Create a social media post on [Platform] and talk about [Topic].' }
  ];

  const [value, setValue] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [initialPrompt, setInitialPrompt] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [outputMsg, setOutputMsg] = useState('');

  // Handle textArea change and resizing based user input
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleResize = (event) => {
    event.target.style.height = 'auto';
    event.target.style.height = event.target.scrollHeight + 'px';
  };

  // Handle when different feature is selected
  const handleChoiceClick = (option) => {
    setSelectedOption(option);
    setValue(option.label === 'MarketGPT' ? '' : option.prompt);
    setInitialPrompt(option.prompt);
    setErrorMsg('');
    setOutputMsg('');
  };

  // Handle clear btn functionality to reset to default text values
  const handleClear = () => {
    setValue(selectedOption.label === 'MarketGPT' ? '' : initialPrompt);
    setErrorMsg('');
    setOutputMsg('');
  };

  // Handle submit btn functionality to send POST request of user input to FastAPI backend
  const handleSubmit = async () => {
    if (selectedOption) {
      if (!value.trim() || value === initialPrompt) {
        setErrorMsg('Please modify the initial prompt.');
        return;
      }
      console.log('Selected button:', selectedOption.label);
      console.log('Value:', value);
      try {
        const response = await fetch('http://127.0.0.1:8000/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            option: selectedOption.label,
            value: value 
          }),
        });

        if (response.ok) {
          const responseOutput = await response.json();
          console.log('Response from backend:', responseOutput);
          setOutputMsg(responseOutput.value);
        } else {
          console.error('Error:', response.status);
          // Handle error case
        }
      } catch (error) {
        console.error('Error:', error);
        // Handle network or request errors
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="app-info">
          <h1>Welcome to the R2D2 Prototype!</h1>
          <div className="app-choices">
            {options.map((option) => (
              <button
                key={option.label}
                className={`choice-btn ${selectedOption === option ? 'selected' : ''}`}
                onClick={() => handleChoiceClick(option)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </header>
      <main className="App-body">
      {errorMsg && (
          <div className="error-msg">
            {errorMsg}
          </div>
        )}
        {selectedOption && (
          <section className="textbox">
            <div className="prompt-input">
              <textarea
                className="prompt-textarea"
                value={value}
                placeholder={selectedOption.label === 'MarketGPT' ? selectedOption.prompt : ''}
                onChange={handleChange}
                onInput={handleResize}
              ></textarea>
            </div>
            <div className="btn-container">
              <button className="clear-btn" onClick={handleClear}>
                Clear
              </button>
              <button className="submit-btn" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </section>
        )}
        {outputMsg && (
          <div className="output-msg">
            {outputMsg}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
