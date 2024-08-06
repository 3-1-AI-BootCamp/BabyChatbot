from pydantic import BaseModel


# 라벨링 데이터 형식
# 수용 타입
class TextRequest(BaseModel):
    text: str
    
# 리턴 타입
class TextResponse(BaseModel):
    label: str