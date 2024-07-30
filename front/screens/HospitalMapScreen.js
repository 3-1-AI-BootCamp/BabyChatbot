// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import MapView, { Marker } from 'react-native-maps';
// import { useTheme } from '../themes/ThemeProvider';
// //import { getHospitals } from '../services/hospitalApiService';

// const HospitalMapScreen = () => {
//   const [hospitals, setHospitals] = useState([]);
//   const { colors } = useTheme();

//   useEffect(() => {
//     fetchHospitals();
//   }, []);

//   const fetchHospitals = async () => {
//     try {
//       //const hospitalData = await getHospitals();
//       setHospitals(hospitalData);
//     } catch (error) {
//       console.error('Error fetching hospitals:', error);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={[styles.title, { color: colors.text }]}>근처 병원</Text>
//       <MapView style={styles.map}>
//         {hospitals.map((hospital) => (
//           <Marker
//             key={hospital.id}
//             coordinate={hospital.location}
//             title={hospital.name}
//             description={hospital.address}
//           />
//         ))}
//       </MapView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     padding: 16,
//   },
//   map: {
//     flex: 1,
//   },
// });

// export default HospitalMapScreen;

import { View, Text } from 'react-native'
import React from 'react'
import { useTheme } from '../themes/ThemeProvider'

const HospitalMapScreen = () => {
    const { colors } = useTheme()
    return (
        <View style={{
            flex: 1,
            backgroundColor: colors.background,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Text style={{
                color: colors.text
            }}>근처 병원 정보가 들어갈 공간(미구현)</Text>
        </View>
    )
}

export default HospitalMapScreen;