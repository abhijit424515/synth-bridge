from fastapi import FastAPI, Request
from services.taaft import predict 
from services.courses import predict_courses
from services.kt import get_history, store_file, knowledge_transfer_query
from services.project import project_summary
from services.mle import calculate_relevance
from services.whisper import stt
from services.common import context_chat
from pydantic import BaseModel

# Pydantic model for representing a Knowledge Transfer Query.
class KTR_Query(BaseModel):
    id: str
    query: str
    retain_history: bool = False

# Pydantic model for representing a Project Summary.
class Project_Summary(BaseModel):
    projectID : str
    milestoneDescription : str
    completedSubtasks : list
    pendingSubtasks : list

# Pydantic model for representing a Context Chat.
class Context_Chat(BaseModel):
    id : str
    prompt : str
    query : str

app = FastAPI()

# ============================================== Endpoints ============================================== 


# Search through AI tools
@app.get("/services/openai/taaft")
def taaft(q: str):
    return predict(q)

# Search through courses
@app.get("/services/openai/courses")
def courses(q: str):
    return predict_courses(q)

# Create project summary using description, pending subtasks and completed subtasks 
@app.post("/services/openai/project_summary")
async def project_summary_helper(body: Project_Summary):
    return project_summary(body.projectID, body.milestoneDescription, body.completedSubtasks, body.pendingSubtasks)

# Initialize knowledge base.
@app.get("/services/openai/ktr/init")
async def ktr_init(id: str):
    return get_history(id)

# Store a file as vector embeddings in the knowledge base.
@app.post("/services/openai/ktr/store")
async def ktr_store(req: Request, id, ext):
    t = await req.body()
    if (ext == "txt"):
        t = str(t,encoding='utf-8')
    return store_file(t, id, ext)

# Make a query on your knowledge base.
@app.post("/services/openai/ktr/query")
async def ktr_query(body: KTR_Query):
    return knowledge_transfer_query(body.query, body.id, body.retain_history)

# Generic context chat endpoint.
@app.post("/services/openai/contextchat")
async def context_handle(body: Context_Chat):
    return context_chat(body.id, body.prompt, body.query)

# Milestone evaluation on the uploaded file
@app.post("/services/openai/mle")
async def mle(req: Request, desc: str):
    t = await req.body()
    t = str(t,encoding='utf-8')
    return calculate_relevance(desc, t)

# OpenAI's Speech-to-Text endpoint.
@app.post("/services/openai/whisper")
async def whisper(req: Request, projectId: str):
    d = await req.body()
    return stt(projectId, d)
