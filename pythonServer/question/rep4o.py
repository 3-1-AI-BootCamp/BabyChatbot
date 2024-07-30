import openai
import pandas as pd
from tqdm import tqdm
from dotenv import load_dotenv
import os

# load .env
load_dotenv()

# api 키 적용
openai.api_key = os.environ.get('OPENAI_API_KEY')

# CSV 파일 읽기
input_path = 'questionList.csv'
df = pd.read_csv(input_path)

# 결과 저장 리스트
results = []

# 각 질문에 대해 답변 생성
for question in tqdm(df['question']):
    prompt = f"다음 질문에 대한 답을 한국어로 제공해주세요: {question}"
    
    response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You should answer questions that parents with children aged 0 to 5 are curious about"},
            {"role": "user", "content": prompt}
        ],
        max_tokens=1024,
        n=1,
        stop=None,
        temperature=0.7,
    )

    answer = response.choices[0].message['content'].strip()
    results.append({'question': question, 'answer': answer})

# 결과를 새로운 DataFrame으로 변환
results_df = pd.DataFrame(results)

# 새로운 CSV 파일로 저장
output_path = 'qa_results_4o.csv'
results_df.to_csv(output_path, index=False, encoding='utf-8-sig')

print(f"결과가 {output_path}에 저장되었습니다.")