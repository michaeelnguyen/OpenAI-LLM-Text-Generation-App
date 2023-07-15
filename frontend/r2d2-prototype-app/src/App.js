import React, { useState } from 'react';
import './App.css';

function App() {
  // Define the options for the use cases and their corresponding prompts
  const options = [
    { label: 'MarketGPT', prompt: 'Enter the company name to perform competitor research.' },
    { label: 'Personalized Email Outreach', prompt: 'Generate email content for [Recipient] about [Subject].' },
    { label: 'Social Media Posting', prompt: 'Create a Twitter post about [Topic].' }
  ];

  // State variable definitions
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
    setInitialPrompt(option.label === 'MarketGPT' ? '' : option.prompt);
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
      // Attempt to pass user input to the FastAPI backend
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
        // If FastAPI and Langchain API call are successful return the generated response
        if (response.ok) {
          const responseOutput = await response.json();
          setOutputMsg(responseOutput.value);
        } else {
          console.error('Status Error:', response.status);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  // Start of the main component render
  return (
    <div className="App">
      <header className="App-header">
        <div className="app-info">
          <h1>Welcome to the R2D2 Prototype!</h1>
          <div className="app-choices">
            {/* Define the use cases as buttons */}
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
        {/* Display error message when user doesnt enter custom prompt */}
        {errorMsg && (
          <div className="error-msg">
            {errorMsg}
          </div>
        )}
        {/* Handle state of the textarea input and the Clear and Submit btns */}
        {selectedOption && (
          <section className="textbox">
            <div className="prompt-input">
              <textarea className="prompt-textarea" value={value} placeholder={selectedOption ? selectedOption.prompt : ''}
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
        {/* If response was sent back from the FastAPI backend, display output from OpenAI */}
        {outputMsg && (
          <div className="output-msg">
            {selectedOption.label === 'MarketGPT' ? (
              <div>
                {/* Handle MarketGPT case separately since we return key, value pairs */}
                {Object.entries(outputMsg).map(([section, response]) => (
                <div key={section}>
                  <h4>{section}</h4>
                  <p>{response}</p>
                </div>
                ))}
              </div>
            ) : (
              // Personalized email and social media posting should just return a string
              <p>{outputMsg}</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
