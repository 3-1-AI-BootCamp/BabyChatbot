import torch


# id2tag 딕셔너리 생성
tags = [
    "태몽", "사주", "별자리 운세", "십이지 운세", "병원",
    "아기 용품", "의학 정보", "부모 고민 상담",
    "예방 접종", "육아 보조금", "기타"
]

# 텍스트 라벨링
async def classify_tag(targetSentence, tokenizer, model):
    id2tag = {id: tag for id, tag in enumerate(tags)}
    print(predict_tag(targetSentence, tokenizer, model, id2tag))
    print(predict_tag(targetSentence, tokenizer, model, id2tag))
    
    return predict_tag(targetSentence, tokenizer, model, id2tag)


# 모델 추론(라벨링)
def predict_tag(text, tokenizer, model, id2tag):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
    predicted_class_id = outputs.logits.argmax().item()
    return id2tag[predicted_class_id]
