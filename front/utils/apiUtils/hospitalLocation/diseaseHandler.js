import { getNearbyHospitals, createResponse, getGPTResponse } from './utils';

// 만약 병원을 가야 한다고 판단했으면...
export const handleNeedHospital = async (question, userLocation, hospitalType) => {
    try {
      // 근처 병원 정보를 찾음
      const nearbyHospitals = await getNearbyHospitals(userLocation, hospitalType);

      // 현재 상태에 대한 GPT4o 응답을 받아옴
      const { gptResponse } = await getGPTResponse(question, hospitalType);
  
      let responseText = gptResponse;
  
      console.log('responseText:', responseText);
  
      // 현재 상태는 ~한 상태고, 병원에 가는 게 좋겠습니다. 병원 추천해드릴게요. 와 같은 방식으로 대답
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