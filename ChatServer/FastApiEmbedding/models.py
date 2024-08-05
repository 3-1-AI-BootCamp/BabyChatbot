from pydantic import BaseModel
from typing import Dict, List


# 임베딩 데이터 형식
# 수용 타입
class EmbeddingRequest(BaseModel):
    texts: List[str]

# 리턴 타입
class EmbeddingResponse(BaseModel):
    embeddings: List[List[float]]
    scores: List[List[float]]
    
    
    
# 라벨링 데이터 형식
# 수용 타입
class TextRequest(BaseModel):
    text: str
    
# 리턴 타입
class TextResponse(BaseModel):
    text: str
    label: str