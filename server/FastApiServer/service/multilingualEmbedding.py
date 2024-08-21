import torch
import torch.nn.functional as F
from structure import embedClass as dataType



# 텍스트 임베딩
async def create_embeddings(targetSentence, tokenizer, model):
    try:
        print(targetSentence)

        # 토큰화
        batch_dict = tokenizer(targetSentence, max_length=512, padding=True, truncation=True, return_tensors='pt')

        # 임베딩 생성
        with torch.no_grad():
            outputs = model(**batch_dict)
        embeddings = average_pool(outputs.last_hidden_state, batch_dict['attention_mask'])

        # 정규화
        embeddings = F.normalize(embeddings, p=2, dim=1)

        # 점수 계산 (첫 두 개의 임베딩과 나머지 임베딩 간의 유사도)
        scores = (embeddings[:2] @ embeddings[2:].T) * 100

        return dataType.EmbeddingResponse (
            embeddings=embeddings.tolist(),
            scores=scores.tolist()
        )
    except Exception as e:
        print(e)
        
        
        
# 모델 추론(임베딩)
def average_pool(last_hidden_states: torch.Tensor, attention_mask: torch.Tensor) -> torch.Tensor:
    last_hidden = last_hidden_states.masked_fill(~attention_mask[..., None].bool(), 0.0)
    return last_hidden.sum(dim=1) / attention_mask.sum(dim=1)[..., None]