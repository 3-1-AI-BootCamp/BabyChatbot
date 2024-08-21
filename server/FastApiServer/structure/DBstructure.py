from sqlalchemy import Column, Integer, String, Text, Float, TIMESTAMP, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class ChatLog(Base):
    __tablename__ = "chat_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    userQuestion = Column(Text)
    gptResponse = Column(Text)
    responseTime = Column(Integer)
    nameSpace = Column(String(255))
    tag = Column(String(255))
    timeLogs = Column(TIMESTAMP, default=datetime.utcnow)

class QAListData(Base):
    __tablename__ = "qalist_data"

    id = Column(Integer, primary_key=True, autoincrement=True)
    chat_log_id = Column(Integer, ForeignKey('chat_logs.id'))
    score = Column(Float)
    answer = Column(Text)
    question = Column(Text)