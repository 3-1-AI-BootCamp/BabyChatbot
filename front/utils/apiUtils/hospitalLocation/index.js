import { getInitialTags } from './tagClassifier';
import { handleHospitalInfo } from './hospitalInfoHandler';
import { handleDirectionsRequest } from './directionsHandler';
import { handleNeedHospital } from './diseaseHandler';
import { createResponse } from './utils';

export const getHospital = async (userLocation, question) => {
    if (!userLocation) {
      return createResponse('위치 정보를 가져올 수 없습니다. 위치 권한을 확인해주세요.');
    }
  
    console.log('Question:', question);
    console.log(`현재 위치 - 위도: ${userLocation.latitude}, 경도: ${userLocation.longitude}`);
  
    try {
      const { needHospital, hospitalInfo, hospitalType } = await getInitialTags(question);
  
      console.log(`병원 유형: ${hospitalType}`);
      console.log(`NEED_HOSPITAL: ${needHospital}, HOSPITAL_INFO: ${hospitalInfo}`);
  
      const isDirectionsRequest = question.includes('가는 길') || question.includes('길찾기') || question.includes('어떻게 가') || question.includes('찾아줘');
  
      if (hospitalInfo && !isDirectionsRequest) {
        return await handleHospitalInfo(question, userLocation, hospitalType);
      }
  
      if (isDirectionsRequest) {
        return await handleDirectionsRequest(question, userLocation, hospitalType);
      }
  
      if (needHospital && !isDirectionsRequest) {
        return await handleNeedHospital(question, userLocation, hospitalType);
      }
  
      return createResponse(`현재는 병원 관련 정보를 주로 다루고 있어 자세한 답변은 어렵습니다만, ${hospitalType} 관련 정보가 필요하시면 병원 정보를 요청해주세요.`);
    } catch (error) {
      console.error('Error:', error);
      return createResponse(`정보를 가져오는 중 오류가 발생했습니다: ${error.message}`);
    }
  };