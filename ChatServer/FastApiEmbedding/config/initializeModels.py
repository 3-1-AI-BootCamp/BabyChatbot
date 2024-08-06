from transformers import AutoTokenizer, AutoModel
from transformers import AutoModelForSequenceClassification



# multilingual 모델과 토크나이저 초기화
def multilingual_model():
    tokenizer = AutoTokenizer.from_pretrained('intfloat/multilingual-e5-small')
    model = AutoModel.from_pretrained('intfloat/multilingual-e5-small')
    return tokenizer, model


# deberta 모델과 토크나이저 초기화
def deberta_model():
    tokenizer = AutoTokenizer.from_pretrained("kakaobank/kf-deberta-base")
    model = AutoModelForSequenceClassification.from_pretrained("./models/fine_tuned_model_kf-deberta-base")
    return tokenizer, model