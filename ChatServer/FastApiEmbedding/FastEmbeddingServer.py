from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import torch
import torch.nn.functional as F
from transformers import AutoTokenizer, AutoModel

app = FastAPI()

# CORS 미들웨어 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 origin(호스트) 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 모델과 토크나이저 초기화
tokenizer = AutoTokenizer.from_pretrained('intfloat/multilingual-e5-small')
model = AutoModel.from_pretrained('intfloat/multilingual-e5-small')

def average_pool(last_hidden_states: torch.Tensor,
                 attention_mask: torch.Tensor) -> torch.Tensor:
    last_hidden = last_hidden_states.masked_fill(~attention_mask[..., None].bool(), 0.0)
    return last_hidden.sum(dim=1) / attention_mask.sum(dim=1)[..., None]

class EmbeddingRequest(BaseModel):
    texts: List[str]

class EmbeddingResponse(BaseModel):
    embeddings: List[List[float]]
    scores: List[List[float]]


# 임베딩 요청 엔드포인트 설정
@app.post("/embed", response_model=EmbeddingResponse)
async def create_embeddings(request: EmbeddingRequest):
    try:
        input_texts = request.texts
        print(request.texts)

        # 토큰화
        batch_dict = tokenizer(input_texts, max_length=512, padding=True, truncation=True, return_tensors='pt')

        # 임베딩 생성
        with torch.no_grad():
            outputs = model(**batch_dict)
        embeddings = average_pool(outputs.last_hidden_state, batch_dict['attention_mask'])

        # 정규화
        embeddings = F.normalize(embeddings, p=2, dim=1)

        # 점수 계산 (첫 두 개의 임베딩과 나머지 임베딩 간의 유사도)
        scores = (embeddings[:2] @ embeddings[2:].T) * 100

        return EmbeddingResponse(
            embeddings=embeddings.tolist(),
            scores=scores.tolist()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



# 포트 수정 요함
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)