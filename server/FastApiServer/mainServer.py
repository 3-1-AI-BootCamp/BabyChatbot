from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
import structure.embedClass as embedType
import structure.labelClass as labelType
import structure.performenceData as performenceType
from config import initializeModels as initModels



app = FastAPI()

# CORS 미들웨어 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 origin(호스트) 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# multilingual 모델 초기화
multilingual_tokenizer, multilingual_model = initModels.multilingual_model()

# deberta 모델 초기화
deberta_tokenizer, deberta_model = initModels.deberta_model()



@app.get("/")
def runningCheck():
    return 'server is running'


# 텍스트 임베딩 요청 처리
@app.post("/embed", response_model=embedType.EmbeddingResponse)
async def order_create_embeddings(request: embedType.EmbeddingRequest):
    from service import multilingualEmbedding as embed
    
    return await embed.create_embeddings(request.texts, multilingual_tokenizer, multilingual_model)


# 텍스트 라벨링 요청 처리
@app.post("/label", response_model=labelType.TextResponse)
async def order_classify_tag(request: labelType.TextRequest):
    from service import debertaLabeling as labeling
    predicted_label = await labeling.classify_tag(request.text, deberta_tokenizer, deberta_model)
    
    return labelType.TextResponse(label=predicted_label)
    

@app.post("/save_chat_log")
async def save_chat(request: performenceType.PerformenceResponse):
    from service import saveChatLogs
    try:
        saved_log_id = saveChatLogs.save_chat_log(request)
        return {"message": "Chat log saved successfully", "id": saved_log_id}
    except Exception as e:
        return {"error": f"Failed to save chat log: {str(e)}"}



if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)