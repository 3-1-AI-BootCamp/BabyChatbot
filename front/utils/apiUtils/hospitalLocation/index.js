import { handleHospitalInfo } from './hospitalInfoHandler';
import { handleDirectionsRequest } from './directionsHandler';
import { handleNeedHospital } from './diseaseHandler';
import { getInitialTags, createResponse, getNearbyHospitals } from './utils';

// 병원 태그가 나왔을 경우의 처리
export const getHospital = async (userLocation, question, host, port) => {
    if (!userLocation) {
        return createResponse('위치 정보를 가져올 수 없습니다. 위치 권한을 확인해주세요.');
    }

    console.log('Question:', question);
    console.log(`현재 위치 - 위도: ${userLocation.latitude}, 경도: ${userLocation.longitude}`);

    try {
        // 소분류 함수를 통해 병원 가야 할 지 여부, 병원 정보를 원하는 지 여부, 근처 병원을 원하는 지 여부, 그리고 병원 유형을 가져옴
        const { needHospital, hospitalInfo, nearbyHospitals, hospitalType } = await getInitialTags(question);

        console.log(`병원 유형: ${hospitalType}`);
        console.log(`NEED_HOSPITAL: ${needHospital}, HOSPITAL_INFO: ${hospitalInfo}, NEARBY_HOSPITALS: ${nearbyHospitals}`);

        // 만일 특정 단어가 포함되면 길찾기를 수행하도록 함
        const isDirectionsRequest = question.includes('가는 길') || question.includes('길찾기') || question.includes('어떻게 가') || question.includes('찾아줘');

        let response;

        if (nearbyHospitals) { // 근처 병원을 찾는 경우
            // 유형에 맞는 가장 가까운 병원 3개 찾은 후 사용자에게 안내
            const nearbyHospitals = await getNearbyHospitals(userLocation, hospitalType);
            if (nearbyHospitals.length > 0) {
                const hospitalList = nearbyHospitals.map(item => item.name).join(', ');

                // hospitalType 예시로는 소아과, 정형외과 등이 있음
                response = ` 근처에서 찾은 ${hospitalType}(으)로는 ${hospitalList} 등이 있습니다.`;
              } else {
                response = ` 근처에서 ${hospitalType}을(를) 찾을 수 없습니다.`;
              }
            response = createResponse(response);
        } else if (hospitalInfo && !isDirectionsRequest) { // 병원 정보를 요청하는 경우
            response = await handleHospitalInfo(question, userLocation, hospitalType, host, port);
        } else if (isDirectionsRequest) { // 길찾기를 요청하는 경우
            response = await handleDirectionsRequest(question, userLocation, hospitalType, host, port);
        } else if (needHospital && !isDirectionsRequest) { // 병원에 가야 한다고 판단한 경우
            response = await handleNeedHospital(question, userLocation, hospitalType);
        } else { // 모두 아니라고 판단한 경우
            response = createResponse(`현재는 병원 관련 정보를 주로 다루고 있어 자세한 답변은 어렵습니다만, ${hospitalType} 관련 정보가 필요하시면 병원 정보를 요청해주세요.`);
        }
        return response;
    } catch (error) {
        console.error('Error:', error);
        return createResponse(`정보를 가져오는 중 오류가 발생했습니다: ${error.message}`);
    }
};
