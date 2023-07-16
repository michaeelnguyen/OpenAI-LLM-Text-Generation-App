# R2D2 Prototype

Cloud application that makes use of OpenAI LLM through Langchain framework to generate custom prompts.

Tech Stack:
- Frontend: React
- Backend: FastAPI
- CI/CD: GitHub Actions
- Cloud Provider: AWS
    - Storage: S3
    - Compute: Lambda
    - Monitoring: CloudWatch

## Setup

1. Install the required Python packages by running the following command:

        pip install -r requirements.txt

    This will install the necessary dependencies, including:
    - FastAPI - Python RESTFUL API framework
    - "uvicorn[standard]" - ASGI Development Server
    - openai - LLM
    - langchain - LLM Framework
    - mangum - ASGI adapter for deploying to AWS Lambda

<br>

2. Install Node.js on your system.

3. Initialize a new npm project by running the following command:
        
        npm init -y

4. Install React and ReactDOM by running the following command:

        npm install react react-dom

5. Create a new React app by running the following command:

        npx create-react-app r2d2-prototype-app

6. Install the required dependencies for the React app by running the following command:

        npm install dotenv @uiball/loaders

## Usage

1. (If running in a local environment) Start the backend development environment by running the following command:

    ```
    uvicorn app.main:app --reload
    ```

    This will start the backend server at `http://localhost:8000`.

2. Start the React frontend development environment by running the following command:

    ```
    npm start
    ```

    This will start the React app at `http://localhost:3000`.

3. Access the React application either through the local environment URLs or the React Frontend static website hosting URL from the S3 bucket.

4.  In the React application, select one of the three menu options:
    
    - MarketGPT: Enter a company name to generate information and research about a competitor.
    - Personalized Email Outreach: Generate a personalized email by providing the recipient and subject in the prompt.
    - Social Media Posting: Generate a Twitter post by providing the topic in the prompt (Work in Progress - No automatic posting).

<br>


5. Use the submit button to generate text based on user input and menu option. You can use the clear button to reset the text input.

6. Wait until the text results are generated.

## Deployment Instructions

1. Create and set up an AWS S3 bucket for the React Frontend:
    - Enable public access.
    - Enable static website hosting.
    - Modify permissions and bucket policy to allow `GetObject` access.

<br>


2. Create and set up an S3 bucket for the FastAPI Backend:
    - Disable public access.

<br>


3. Set up IAM for S3 Bucket to work with GitHub Actions:
    - Define JSON with `GetObject`, `PutObject`, `ListBucket` access permissions for the S3 bucket, and `UpdateFunctionCode`, `UpdateFunctionConfiguration` access permissions for Lambda.
    - Create a user group associated with the S3 buckets and Lambda.
    - Create a user and generate/store an access key for programmatic access.

<br>


4. Create and set up an AWS Lambda function:
    - Set the runtime to Python 3.10.
    - Choose the architecture as x86_64.
    - Change the handler to `app.main.handler`.

<br>

5. GitHub Actions (CI/CD):
    - Define the required GitHub Actions Repository Secrets in the repository settings, including:
        - `REACT_APP_BACKEND_URL`
        - `OPENAI_API_KEY`
        - `AWS_ACCESS_KEY_ID`
        - `AWS_SECRET_ACCESS_KEY`
        - Define the workflow file in `.github/workflows` for building, testing, and deploying the app.
    - CI:
        - React:
            - Build and run tests.
            - Run `npm run build` for a production build.
            - Upload the created directory (`/build`) as an artifact for CD job steps.
        - FastAPI:
            - Create a virtual environment, install dependencies, and run tests.
            - Zip the required Python site-packages and the app directory into `lambda_function.zip`.
            - Upload the zip file as an artifact for CD job steps.
    - CD:
        - Download the React build artifact and FastAPI zip file artifact from the CI job.
        - Define and configure AWS credentials.
        - Deploy the React build artifact and FastAPI zip file artifact in their respective S3 buckets.
        - Deploy the FastAPI zip file from the S3 bucket to the AWS Lambda function, including the OpenAI API key and the React frontend URL located in the S3 bucket properties under static website hosting.
- The GitHub Action CI/CD workflow executes when code is push event to the `main` branch occurs.

These instructions will guide you through the setup, usage, and deployment of your application.





