import os
from uuid import uuid4
from openai import OpenAI
from services.common import context_chat
from services.common import openai_api_key

client = OpenAI(api_key=openai_api_key)

# Convert speech to text using OpenAI's Whisper API
def stt(projectId, d):
  path = f"temp/whisper-{uuid4()}.wav"
  f = open(path,"w+b")
  f.write(d)
  transcript = client.audio.transcriptions.create(
    model="whisper-1", 
    file=f
  )
  f.close()
  os.remove(path)

  project_summary_template = """
  System : You are a meet summarization assistant to help capture the important information and tasks discussed in a meet. Use Project Context and Audio Transcript in triple backticks to generate list of tasks I have to do for the project. Focus more on the transcription info. Make sure to only and only output your response as markdown.

  Context : {context}

 ```Audio Transcript: {query}```
  """ 

  return {"transcript": transcript.text, "summary": context_chat(id=projectId, prompt=project_summary_template, query=transcript.text)}
