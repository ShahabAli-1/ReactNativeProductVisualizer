// import React, { useState } from 'react';
// import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
// import { View } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import SettingsScreen from './SettingsScreen';
// import Home from './Home';
// import AppCamera from './AppCamera';
// import { useNavigation } from "@react-navigation/native";



// const Tab = createMaterialBottomTabNavigator();

// export default function BottomNavigator() {
//   const navigation = useNavigation();
//   const [hideBottomBar, setHideBottomBar] = useState(false);

//   const toggleBottomBarVisibility = () => {
//     setHideBottomBar(!hideBottomBar);
//   };

//   const renderTabBar = () => (
//     <Tab.Navigator
//       initialRouteName="Home"
//       activeColor="#fff"
//       inactiveColor="#000"
//       barStyle={{ backgroundColor: '#95B6FF' }}
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ color, size }) => {
//           let iconName;

//           if (route.name === 'Home') {
//             iconName = 'home';
//           } else if (route.name === 'Camera') {
//             iconName = 'camera';
//           } else if (route.name === 'Settings') {
//             iconName = 'person';
//           }

//           return <Icon name={iconName} color={color} size={size} />;
//         },
//       })}
//     >
//       <Tab.Screen
//         name="Home"
//         component={Home}
//         options={{
//           tabBarLabel: 'Home',
//           tabBarIcon: ({ color }) => (
//             <Icon name="home" color={color} size={26} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Camera"
//         component={AppCamera}
//         options={{
//           tabBarLabel: 'Camera',
//           tabBarIcon: ({ color }) => (
//             <Icon name="camera" color={color} size={26} />
//           ),
//         }}
//         listeners={({ navigation, route }) => ({
//           tabPress: (e) => {
//             // Prevent navigating to the camera screen and hide the bottom bar
//             e.preventDefault();
//             toggleBottomBarVisibility();

//             // You can also navigate to the camera screen here if needed
//             // navigation.navigate('BottomNavigator',{screen:'Home'});
//           },
//         })}
//       />
//       <Tab.Screen
//         name="Settings"
//         component={SettingsScreen}
//         options={{
//           tabBarLabel: 'Settings',
//           tabBarIcon: ({ color }) => (
//             <Icon name="person" color={color} size={26} />
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );

//   return (
//     <>
//       {!hideBottomBar && renderTabBar()}
//       {hideBottomBar && (
//         <View style={{ flex: 1 }}>
//           <AppCamera />
//         </View>
//       )}
//     </>
//   );
// }




import * as React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SettingsScreen from './SettingsScreen';
import Home from './Home';
import AppCamera from './AppCamera';

const Tab = createMaterialBottomTabNavigator();

export default function BottomNavigator() {
  const [hideBottomBar, setHideBottomBar] = React.useState(false);

  const toggleBottomBarVisibility = () => {
    setHideBottomBar(!hideBottomBar);
  };

  return (
    <>
      {!hideBottomBar && (
        <Tab.Navigator
          initialRouteName="Home"
          activeColor="#fff"
          inactiveColor="#000"
          barStyle={{ backgroundColor: '#95B6FF' }}
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = 'home';
              } else if (route.name === 'Camera') {
                iconName = 'camera';
              } else if (route.name === 'Settings') {
                iconName = 'person';
              }

              return <Icon name={iconName} color={color} size={size} />;
            },
          })}
        >
          <Tab.Screen
            name="Home"
            component={Home}
            options={{
              tabBarLabel: 'Home',
              tabBarIcon: ({ color }) => (
                <Icon name="home" color={color} size={26} />
              ),
            }}
          />
          <Tab.Screen
            name="Camera"
            component={AppCamera}
            options={{
              tabBarLabel: 'Camera',
              tabBarIcon: ({ color }) => (
                <Icon name="camera" color={color} size={26} />
              ),
            }}
            listeners={({ navigation, route }) => ({
              tabPress: (e) => {
                // Prevent navigating to the camera screen and hide the bottom bar
                e.preventDefault();
                toggleBottomBarVisibility();
                // You can also navigate to the camera screen here if needed
                // navigation.navigate('BottomNavigator',{screen:'AppCamera'});
              },
            })}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              tabBarLabel: 'Settings',
              tabBarIcon: ({ color }) => (
                <Icon name="person" color={color} size={26} />
              ),
            }}
          />
        </Tab.Navigator>
      )}
      {hideBottomBar && (
        <View style={{ flex: 1 }}>
          <AppCamera />
        </View>
      )}
    </>
  );
}



// import React, { useState } from 'react';
// import { View, TouchableOpacity, StyleSheet } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import SettingsScreen from '../screens/SettingsScreen';
// import Home from '../screens/Home';
// import AppCamera from '../screens/AppCamera';

// export default function BottomNavigator() {
//   const [isCameraOpen, setIsCameraOpen] = useState(false);

//   const handleCameraPress = () => {
//     setIsCameraOpen(true);
//   };

//   const handleCameraClose = () => {
//     setIsCameraOpen(false);
//   };

//   if (isCameraOpen) {
//     return <AppCamera onClose={handleCameraClose} />;
//   }

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity style={styles.iconContainer} onPress={handleCameraPress}>
//         <Icon name="camera" color="#000" size={26} />
//       </TouchableOpacity>
//       <TouchableOpacity style={styles.iconContainer}>
//         <Icon name="home" color="#000" size={26} />
//       </TouchableOpacity>
//       <TouchableOpacity style={styles.iconContainer}>
//         <Icon name="person" color="#000" size={26} />
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     height: 56,
//     backgroundColor: '#95B6FF',
//   },
//   iconContainer: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });



