from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain, SimpleSequentialChain

# Create an instance of the FastAPI application
app = FastAPI()

# Configure CORS
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
    # Do something with the received value
    print("Received option:", option)
    print("Received value:", value)
    # Perform your desired processing logic here
    # Return a response if needed
    return {"value": value}

@app.get("/")
def get_root():
    return {"message": "Hello. This is the backend!"}