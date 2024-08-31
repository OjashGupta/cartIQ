from fastapi import FastAPI, Body
from typing import List
import bs4
from pydantic import BaseModel
from langchain import hub
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.prompts import PromptTemplate
from langchain_community.document_loaders import WebBaseLoader  # Not used in this case
from langchain_community.vectorstores import Chroma
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
import pandas as pd
from langchain_openai import OpenAI

import os

# Initialize the FastAPI application
app = FastAPI()

# Define a route for the home page
@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI server!"}

default_model = "gpt-4o-mini"

def load_data(filename):
    data = pd.read_excel(filename)
    extracted_data = data[['name', 'serving_size', 'calories', 'total_fat', 
    'carbohydrate', 'fiber', 'sugars', 'fat', 'alcohol', 'water']].to_dict('records')
    print(extracted_data)
    return extracted_data

def create_documents(data):
    docs = []
    for item in data:
        doc = type('Document', (object,), {'page_content': f"{item['name']},{item['serving_size']}, {item['calories']}, {item['total_fat']}, {item['carbohydrate']}, {item['sugars']}, {item['fat']}, {item['alcohol']}, {item['water']}", 'metadata': {}})
        docs.append(doc)
    print(docs)
    return docs

def split_documents(docs):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    splits = text_splitter.split_documents(docs)
    print(splits)
    return splits

def create_vectorstore(splits):
    vectorstore = Chroma.from_documents(documents=splits, embedding=OpenAIEmbeddings())
    print(vectorstore)
    return vectorstore

def create_retriever(vectorstore):

    retriever = vectorstore.as_retriever()
    print(retriever)
    return retriever

def create_rag_chain(retriever):

    prompt = hub.pull("rlm/rag-prompt")
    llm = ChatOpenAI(model_name="gpt-4o-mini", temperature=0)

    def format_docs(docs):
        return "\n\n".join(doc.page_content for doc in docs)

    rag_chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )

    print(rag_chain)
    return rag_chain

def list_items_as_string(items):
    # import openai
    llm = OpenAI()
    prompt = PromptTemplate.from_template("Following is the list of all the items in the cart.  {input}. List down all the items in setence.\n")
    chain = prompt | llm
    print(chain = prompt | llm)
    return chain.invoke({"input": items})

def call_rag(items):
    # Load data
    
    result = list_items_as_string(items)
    print(result)
    question = f"Give all nutrional compositon of {result}"
    data = load_data('nutrition_test.xlsx')
    docs = create_documents(data)
    splits = split_documents(docs)
    vectorstore = create_vectorstore(splits)
    retriever = create_retriever(vectorstore)
    rag_chain = create_rag_chain(retriever)
    answer = rag_chain.invoke(question)
    print(answer)
    return answer

class ProductListRequest(BaseModel):
    product_list: list[str]
# Define a route to return some JSON data
@app.post("/insights")
def get_insights(request: ProductListRequest):
    # product_list = ["Cheese, camembert", "Eggplant, raw"]
    product_list = request.product_list
    print(product_list)
    items = []

    for item in product_list:
        items.append(item + " ")  # Append the item with a space

    # Replace 'call_rag' with the actual function or API call to get the answer
    answer_insight_string = call_rag(items)
    print(answer_insight_string)
    return answer_insight_string
