from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from structure.DBstructure import Base, ChatLog, QAListData

# 데이터베이스 연결 설정
DATABASE_URL = "mysql+pymysql://babychat:1234@192.168.247.7:3307/babychatdb"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 데이터베이스 테이블 생성 (이미 존재하는 경우 무시됨)
Base.metadata.create_all(bind=engine)

def save_chat_log(chat_log_data):
    db = SessionLocal()
    try:
        # chat_logs 테이블에 데이터 저장
        new_chat_log = ChatLog(
            userQuestion=chat_log_data.userQuestion,
            gptResponse=chat_log_data.gptResponse,
            responseTime=chat_log_data.responseTime,
            nameSpace=chat_log_data.mappingNamespace,
            tag=chat_log_data.tag if hasattr(chat_log_data, 'tag') else None
        )
        db.add(new_chat_log)
        db.flush()  # ID를 얻기 위해 flush

        # qalist_data 테이블에 데이터 저장
        for qa in chat_log_data.qaList:
            new_qa = QAListData(
                chat_log_id=new_chat_log.id,
                score=qa.get('score'),
                answer=qa.get('answer'),
                question=qa.get('question')
            )
            db.add(new_qa)

        db.commit()
        return new_chat_log.id
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()