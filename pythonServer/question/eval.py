import pandas as pd
import torch
from transformers import BertTokenizer, BertModel
from sklearn.metrics.pairwise import cosine_similarity
from tqdm import tqdm

# KoBERT 모델 로드
model_name = "monologg/kobert"
tokenizer = BertTokenizer.from_pretrained(model_name)
model = BertModel.from_pretrained(model_name)

# 데이터 로드
gemma2 = pd.read_csv('qa_results_gemma2.csv')
gemma2_instruction = pd.read_csv('qa_results_gemma2_instruction.csv')
gpt4o = pd.read_csv('qa_results_gpt4o.csv')

# 데이터 결합
combined = pd.DataFrame({'question': gemma2['question']})
combined['gemma2'] = gemma2['answer']
combined['gemma2_instruction'] = gemma2_instruction['answer']
combined['gpt4o'] = gpt4o['answer']

def get_embedding(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
    return outputs.last_hidden_state.mean(dim=1).squeeze().numpy()

def calculate_clarity(answer):
    # 단어 수 계산
    word_count = len(str(answer).split())
    
    # 문장 수 계산 (마침표, 느낌표, 물음표로 구분)
    sentence_count = sum(1 for char in str(answer) if char in '.!?')
    
    # 평균 문장 길이 계산 (단어 수 / 문장 수)
    avg_sentence_length = word_count / max(sentence_count, 1)  # 0으로 나누는 것 방지
    
    # 점수 계산: 평균 문장 길이가 10~20 단어일 때 가장 높은 점수
    if 10 <= avg_sentence_length <= 20:
        score = 10
    elif avg_sentence_length < 10:
        score = avg_sentence_length
    else:
        score = max(0, 30 - avg_sentence_length)
    
    return min(max(score, 0), 10)  # 0-10 사이의 값으로 제한

def evaluate_answer(question, answer):
    if answer is None or pd.isna(answer) or answer == '':
        return {
            'relevance': 0,
            'completeness': 0,
            'clarity': 0
        }
    
    question_embedding = get_embedding(question)
    answer_embedding = get_embedding(str(answer))
    
    similarity = cosine_similarity([question_embedding], [answer_embedding])[0][0]
    
    # 유사도 점수를 1-10 척도로 변환
    relevance_score = min(max(int(similarity * 10) + 1, 1), 10)
    
    return {
        'relevance': relevance_score,
        'completeness': min(len(str(answer).split()) / 10, 10),  # 단어 수 기반 완전성 점수 (최대 10점) # X
        'clarity': calculate_clarity(answer), # X
    }

# 평가 실행
results = []

for i, row in tqdm(combined.iterrows(), total=len(combined), desc="평가 진행 중"):
    question = row['question']
    for model_name in ['gemma2', 'gemma2_instruction', 'gpt4o']:
        answer = row[model_name]
        scores = evaluate_answer(question, answer)
        results.append({
            'question': question,
            'model': model_name,
            'answer': answer if not pd.isna(answer) else 'No answer',
            **scores
        })

# 결과를 데이터프레임으로 변환
results_df = pd.DataFrame(results)

# CSV 파일로 저장
results_df.to_csv('model_evaluation_results.csv', index=False)

print("평가 완료. 결과가 'model_evaluation_results.csv' 파일에 저장되었습니다.")

# 평균 점수 계산 및 출력
average_scores = results_df.groupby('model')[['relevance', 'completeness', 'clarity']].mean()
print("\n평균 점수:")
print(average_scores)