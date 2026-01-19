from pydantic import BaseModel

class StudyCreate(BaseModel):
    topic: str
    subject: str
    status: str
