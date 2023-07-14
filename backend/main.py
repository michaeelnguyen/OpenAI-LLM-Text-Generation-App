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

@app.post("/")
def process_data(input_data: InputData):
    option = input_data.option
    value = input_data.value

    print("Received option:", option)
    print("Received value:", value)
    
    # Call OpenAI API call on user input

    # Return a response back to React frontend
    return {"value": value}

@app.get("/")
def get_root():
    return {"message": "Hello. This is the backend!"}