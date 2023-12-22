import re
from services.common import context_chat

# Generate project summary using description, pending subtasks and completed subtasks with a context-chat based approach
def project_summary(projectID, milestoneDescription, completedSubtasks, pendingSubtasks):
  completedSubtasksString = "\n".join(completedSubtasks)
  pendingSubtasksString = "\n".join(pendingSubtasks)
  completedSubtasksString = re.sub(r'[^\w\s]', '', completedSubtasksString)
  pendingSubtasksString = re.sub(r'[^\w\s]', '', pendingSubtasksString)

  sub_part = f"""
  Completed Subtasks : {completedSubtasksString}
  
  Pending Subtasks : {pendingSubtasksString}
  """

  project_summary_template = """
  System : You are a summary bot. You will accept Context, Milestone Description, Completed Subtasks and Pending Subtasks and generate
  a project summary, STRICTLY between 80-100 words.

  Context : {context}

  Milestone Description : {query}
  """ + sub_part

  return context_chat(id=projectID, prompt=project_summary_template, query=milestoneDescription)

