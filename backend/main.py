import os
import boto3
from apikeys import openai_api_key

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain, SequentialChain

# Create an instance of the FastAPI application
app = FastAPI()

# Configure CORS to connect to different port mappings
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class InputData(BaseModel):
    option: str
    value: str

# Retrieve OpenAI API key from environment variable
os.environ['OPENAI_API_KEY'] = openai_api_key

@app.post("/")
def process_data(input_data: InputData):
    option = input_data.option
    prompt = input_data.value

    print("Received option:", option)
    print("Received value:", prompt)

    # Create an instance of the OpenAI API
    openai = OpenAI()

    if prompt and option == 'MarketGPT':
        # Prompt templates defined for multiple task to obtain competitors research for specific company.
        org_template = PromptTemplate(
            input_variables=['company'], 
            template= "Provide info about the company size, industry, key decision makers, and website for {company}."
        )
        finance_template = PromptTemplate(
            input_variables=['company'], 
            template= "Provide info about the revenue and profitability for {company}."
        )
        detailed_info_template = PromptTemplate(
            input_variables=['company'], 
            template= "Provide info about what {company} does and their product line."            
        )
        latest_news_template = PromptTemplate(
            input_variables=['company'], 
            template= "Provide the latest news about {company}"            
        )
        competitors_template = PromptTemplate(
            input_variables=['company'], 
            template= "Provide info about the competitors for {company}."         
        )
        # Define tasks (chains) that use openAI as LLM and the previously defined templates
        org_chain = LLMChain(llm=openai, prompt=org_template, verbose=True, output_key='org')
        finance_chain =  LLMChain(llm=openai, prompt=finance_template, verbose=True, output_key='finance')
        detailed_info_chain = LLMChain(llm=openai, prompt=detailed_info_template, verbose=True, output_key='detailed_info')
        latest_news_chain = LLMChain(llm=openai, prompt=latest_news_template, verbose=True, output_key='latest_news')
        competitors_chain = LLMChain(llm=openai, prompt=competitors_template, verbose=True, output_key='competitors')

        # Group all tasks together for sequential execution
        sequential_chain = SequentialChain(
            chains=[org_chain, finance_chain, detailed_info_chain, latest_news_chain, competitors_chain], 
            input_variables = ['company'],
            output_variables = ['org', 'finance', 'detailed_info', 'latest_news', 'competitors'],
            verbose=True
        )
        responses = sequential_chain({'company': prompt})

        # Create a dictionary to store the responses for each section
        section_responses = {
            'Organization': responses['org'],
            'Finance': responses['finance'],
            'Info and Products': responses['detailed_info'],
            'Latest News': responses['latest_news'],
            'Competitors': responses['competitors']
        }
        return {"value": section_responses}
    
    elif prompt and option == 'Personalized Email Outreach':
        # Generate personalized email using user prompt
        response = openai.predict(prompt)
        return {"value": response}
    elif prompt and option == 'Social Media Posting':
        # Generate social media post using user prompt
        response = openai.predict(prompt)
        return {"value": response}
    else:
        return {"value": "Error"}

@app.get("/")
def get_root():
    return {"message": "Hello. This is the backend!"}
