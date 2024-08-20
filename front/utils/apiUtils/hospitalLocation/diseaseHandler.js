import { getNearbyHospitals, createResponse, getGPTResponse } from './utils';

export const handleNeedHospital = async (question, userLocation, hospitalType) => {
    try {
      const nearbyHospitals = await getNearbyHospitals(userLocation, hospitalType);
      const { gptResponse } = await getGPTResponse(question, hospitalType);
  
      let responseText = gptResponse;
  
      console.log('responseText:', responseText);
  
      if (nearbyHospitals.length > 0) {
        const hospitalList = nearbyHospitals.map(item => item.name).join(', ');
        responseText += ` 근처에서 찾은 ${hospitalType}(으)로는 ${hospitalList} 등이 있습니다.`;
      } else {
        responseText += ` 하지만 죄송하게도 근처에서 ${hospitalType}을(를) 찾을 수 없습니다.`;
      }
  
      return createResponse(responseText);
    } catch (error) {
      console.error('Nearby Hospitals Error:', error);
      return createResponse(`근처 병원 정보를 가져오는 중 오류가 발생했습니다: ${error.message}`);
    }
  };