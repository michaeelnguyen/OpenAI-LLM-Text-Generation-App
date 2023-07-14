from fastapi import FastAPI

# Create an instance of the FastAPI application
app = FastAPI()

# Define your API routes and functions here
@app.get("/")
def hello_world():
    return {"message": "Hello, World!"}