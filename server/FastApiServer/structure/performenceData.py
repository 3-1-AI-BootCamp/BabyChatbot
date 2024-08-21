from pydantic import BaseModel
from typing import List, Dict, Any

class PerformenceResponse(BaseModel):
    userQuestion: str
    mappingNamespace: str
    qaList: List[Dict[str, Any]]
    gptResponse: str
    responseTime: int  # Python에서는 long 대신 int를 사용합니다