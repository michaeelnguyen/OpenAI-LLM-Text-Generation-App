# OpenAI Text Generation App

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
    
    - MarketGPT: Enter a company name to generate information and research about a competitor
    - Personalized Email Outreach: Generate a personalized email by providing the recipient and subject in the prompt
    - Social Media Posting: Generate a Twitter post by providing the topic in the prompt (Work in Progress - No automatic posting)

<br>

5. Use the submit button to generate text based on user input and menu option. You can use the clear button to reset the text input.

6. Wait until the text results are generated.

## Deployment Instructions

1. Create and set up an AWS S3 bucket for the React Frontend:
    - Go to S3 from AWS Management Console and create a bucket for frontend
    - Enter Bucket name and AWS Region
    - Uncheck the box for `Block all public access`
    - Click on `Create bucket` to finish.
    - Go to the `Properties` > `Static website hosting` > `Edit` to set up static website hosting
        - `Enable` option for Static website hosting
        - `Host a static website` for Hosting type
        - `index.html` for Index document
        - Save changes
    - Modify permissions and bucket policy to allow `GetObject` action for the S3 bucket as the resource.

<br>

2. Create and set up an S3 bucket for the FastAPI Backend:
    - Go to S3 from AWS Management Console and create another bucket for backend
    - Enter Bucket name and AWS Region
    - Ensure `Block all public access` is on
    - Click on `Create bucket` to finish

<br>

3. Create and set up an AWS Lambda function:
    - Go to AWS Lambda from AWS Management Console
    - Create a Lambda function
        - Enter Function Name
        - Set the runtime to `Python 3.10`
        - Choose the architecture as `x86_64`
        - Click on `Create function` to finish
        - Under `Runtime settings`, change the `Handler` to `app.main.handler`

<br>

4. Set up IAM for S3 Bucket to work with GitHub Actions:
    - Go to IAM from AWS Management Console
    - Go to `Policies` > `Create Policies` and define the permissions using the JSON policy editior 
        - Add a statement with `GetObject`, `PutObject`, `ListBucket` as the "Action", and provide the Amazon Resource Names (ARNs) for each of the S3 Buckets created under "Resources" 
        - Click `Add a new statement`, and include `UpdateFunctionCode`, `UpdateFunctionConfiguration` as the "Action", and provide the ARN for the Lambda function created under "Resources"
    - Go to `User groups` > `Create group` to create a user group
        - Enter `User group name`
        - Under `Attach permissions policies`, attach the recently create policy and click `Create group`
    - Go to `User` > `Add Users` to create a user 
        - Enter `User name` then click `Next` to continue
        - Add user to the user group just recently created and continue
        - Review information then click `Create user`
        - Click on the recently created User and go to `Security credentials` > `Access keys` > `Create access key` to generate/store an access key for programmatic access later in GitHub Actions .yml file

<br>

5. Create and set up AWS API Gateway
    - Go to API Gateway from AWS Management Console
    - Click `Create API` and find `REST API` and click Build
        - Select `REST` for protocol 
        - `New API` option for Create new API
        - Enter `API name` and select Endpoint Type as `Regional` for Settings
    - Create GET and POST methods by clicking on `Actions` > `Create Method`
        - Select `Lambda Function` as Integration type. 
        - Check the box for `User Lambda Proxy Integration`
        - Select `Lambda Region` and enter the `Lambda Function` name created in step 3.
    - Setup CORS by clicking on `Actions` > `Enable CORS`
        - Set `Access-Control-Allow-Origin` to 'Bucket_Website_Endpoint_URL' associated with S3 bucket for frontend (URL is under `Properties` > `Static website hosting` > `Bucket website endpoint`)
        - Confirm by clicking `Enable CORS and replace existing CORS headers`

<br>

6. Create and set up GitHub Actions (CI/CD) pipeline:
    - Create the required GitHub Actions Repository Secrets under the Repository `Settings` > `Security` > `Secrets and variables` > `Actions`
    - Define the Name for each of the variables below and provide the corresponding Secret value
        - `REACT_APP_BACKEND_URL`
        - `FRONTEND_URL`
        - `OPENAI_API_KEY`
        - `AWS_ACCESS_KEY_ID` (From Step 4)
        - `AWS_SECRET_ACCESS_KEY` (From Step 4)
   - Create a `.github/workflows` directory
   - Create the workflow file in the directory recently created called `react-fastapi-build-test-deploy.yml` for building, testing, and deploying the app
   - In `react-fastapi-build-test-deploy.yml` define the CI and CD job and the following steps in each job:
        - CI:
            - React:
                - Pass and import `REACT_APP_BACKEND_URL` Secret as environment variables
                - Install `npm install` and `npm run build` to install dependencies and create a production build.
                - `npm run test` to run tests from `App.test.js`
                - Upload the created directory (`/build`) as an artifact for CD job steps
            - FastAPI:
                - Create a virtual environment, run virtual environment, and install dependencies from `requirements.txt`
                - Pass and import `OPENAI_API_KEY` and `FRONT_END_URL` Secret as environment variables
                - Run tests for main.py using `pytest tests`
                - Zip the required Python site-packages and the app directory into `lambda_function.zip`
                - Upload the zip file as an artifact for CD job steps
        - CD:
            - Download the React build artifact and FastAPI zip file artifact from the CI job
            - Define and configure AWS credentials
            - Deploy the React build artifact and FastAPI zip file artifact in their respective S3 buckets
            - Deploy the FastAPI zip file from the S3 bucket to the AWS Lambda function using `aws lambda update-function-code` to import backend zip file to Lambda
            - Run `aws lambda update-function-configuration` to pass over `OPENAI_API_KEY` and `FRONT_END_URL` secret to AWS Lambda environment

<br>

7. Trigger the CI/CD pipeline: Merge the changes from the `develop` branch into the `main` branch and push the updated `main` branch to the remote repository. The CI/CD pipeline will be automatically executed upon detecting the changes, as defined in the `.github/workflows/react-fastapi-build-test-deploy.yml` file

<br>

8. Create AWS CloudWatch Monitoring/Dashboards: The creation of the S3 buckets, API Gateway, and Lambda will automatically generate dashboards and metrics for monitoring that pertain to the AWS services used: S3, API Gateway, Lambda. To view their respective dashboard, go to the AWS Management Console and select/navigate to CloudWatch. Afterward, navigate to Dashboards > Automatic Dashboards and select S3, API Gateway, or Lambda. No action is required from the developer(s) unless custom metrics are required

These instructions will guide you through the setup, usage, and deployment of your application.




