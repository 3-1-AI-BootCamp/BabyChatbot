import { getInitialTags } from './tagClassifier';
import { handleHospitalInfo } from './hospitalInfoHandler';
import { handleDirectionsRequest } from './directionsHandler';
import { handleNeedHospital } from './diseaseHandler';
import { createResponse } from './utils';
import { getNearbyHospitals } from './utils';
import { startTokenUsageTracking, endTokenUsageTracking } from '../tokenTracker'; // 토큰 추적 기능 가져오기

export const getHospital = async (userLocation, question) => {
    if (!userLocation) {
        return createResponse('위치 정보를 가져올 수 없습니다. 위치 권한을 확인해주세요.');
    }

    console.log('Question:', question);
    console.log(`현재 위치 - 위도: ${userLocation.latitude}, 경도: ${userLocation.longitude}`);

    try {
        startTokenUsageTracking();

        const { needHospital, hospitalInfo, nearbyHospitals, hospitalType } = await getInitialTags(question);

        console.log(`병원 유형: ${hospitalType}`);
        console.log(`NEED_HOSPITAL: ${needHospital}, HOSPITAL_INFO: ${hospitalInfo}, NEARBY_HOSPITALS: ${nearbyHospitals}`);

        const isDirectionsRequest = question.includes('가는 길') || question.includes('길찾기') || question.includes('어떻게 가') || question.includes('찾아줘');

        let response;
        if (nearbyHospitals) {
            const nearbyHospitals = await getNearbyHospitals(userLocation, hospitalType);
            if (nearbyHospitals.length > 0) {
                const hospitalList = nearbyHospitals.map(item => item.name).join(', ');
                response = ` 근처에서 찾은 ${hospitalType}(으)로는 ${hospitalList} 등이 있습니다.`;
              } else {
                response = ` 근처에서 ${hospitalType}을(를) 찾을 수 없습니다.`;
              }
            response = createResponse(response);
        } else if (hospitalInfo && !isDirectionsRequest) {
            response = await handleHospitalInfo(question, userLocation, hospitalType);
        } else if (isDirectionsRequest) {
            response = await handleDirectionsRequest(question, userLocation, hospitalType);
        } else if (needHospital && !isDirectionsRequest) {
            response = await handleNeedHospital(question, userLocation, hospitalType);
        } else {
            response = createResponse(`현재는 병원 관련 정보를 주로 다루고 있어 자세한 답변은 어렵습니다만, ${hospitalType} 관련 정보가 필요하시면 병원 정보를 요청해주세요.`);
        }

        endTokenUsageTracking();
        return response;
    } catch (error) {
        console.error('Error:', error);
        endTokenUsageTracking();
        return createResponse(`정보를 가져오는 중 오류가 발생했습니다: ${error.message}`);
    }
};
