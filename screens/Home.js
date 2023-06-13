import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Alert, Image, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { androidCameraPermission } from '../permissions';
import { Header } from 'react-native-elements';
import RNFS from 'react-native-fs';
import { useNavigation, useIsFocused } from '@react-navigation/native';

export default function Home() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [oldProjects, setOldProjects] = useState([]);

  useEffect(() => {
    if (isFocused) {
      fetchOldProjects();
    }
  }, [isFocused]);

  const fetchOldProjects = async () => {
    try {
      const folderPath = RNFS.ExternalDirectoryPath + '/capturedImages';
      const folders = await RNFS.readDir(folderPath);
      const projects = folders.filter((folder) => folder.isDirectory()).map((folder) => folder.name);
      setOldProjects(projects);
    } catch (error) {
      console.log('Error fetching old projects:', error);
    }
  };

  const navigateToImageSlider = (projectName) => {
    const selectedProject = oldProjects.find((project) => project === projectName);
    if (selectedProject) {
      const folderPath = RNFS.ExternalDirectoryPath + '/capturedImages/' + selectedProject;
      RNFS.readDir(folderPath)
        .then((result) => {
          const images = result.map((file) => file.path);
          navigation.navigate('ImageSliderScreen', { images });
        })
        .catch((error) => {
          console.log('Error reading project folder:', error);
        });
    }
  };

  const flexD = 'column';
  return (
    <View style={{ flex: 1, flexDirection: flexD, backgroundColor: '#fff' }}>
      <Header
        backgroundColor="#95B6FF"
        // leftComponent={{ icon: 'menu', onPress: () => navigation.openDrawer() }}
        centerComponent={{ text: 'Home', style: { color: '#fff' } }}
        // rightComponent={{ icon: 'search', onPress: () => {} }}
      />
      <StatusBar style="auto" />
      <View style={[styles.box, { flex: 6, backgroundColor: '#fff' }]}>
        <Text style={[styles.label]}>SHOW PROJECTS</Text>
        <View>
          {oldProjects.map((project, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.projectButton,
                { backgroundColor: '#144A9C', width: 300, height: 100, marginLeft: 60, borderRadius: 35 },
              ]}
              onPress={() => navigateToImageSlider(project)}
            >
              <Text style={styles.projectButtonText}>{project}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        {/* footer */}
      </View>
    </View>
  );
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  box: {
    width: width,
    margin: 'auto',
    height: height / 2,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 24,
  },
  projectButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  projectButtonText: {
    fontSize: 16,
    color: 'white',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});




// import React , { useState , useEffect} from 'react';
// import { StyleSheet, Text, View,TouchableOpacity,Dimensions, Alert,Image,Button} from 'react-native';
// import { StatusBar } from 'expo-status-bar';
// import {androidCameraPermission} from '../permissions'
// import {Header} from 'react-native-elements'
// import RNFS from 'react-native-fs'
// import { useNavigation, useIsFocused } from '@react-navigation/native';


// export default function Home() {
//   const navigation = useNavigation();
//   const isFocused = useIsFocused();
//   const [oldProjects, setOldProjects] = useState([]);

  
//   const OnSelectImage = async () =>{
//     const permissionStatus = await androidCameraPermission()
//     if(permissionStatus || Platform.OS == 'ios')
//     {
//       Alert.alert(
//         'upload a photo',
//         'Choose an option',
//         [
//           {text:"Cancel", onPress:()=>{ }},
//           {text:"Gallery/Photo library", onPress:OnGallery},
//           {text:"Camera", onPress:()=>{navigation.navigate("AppCamera")}},
//         ]
//       )
      
//     } 
//   }

  
//   useEffect(() => {
//     if (isFocused) {
//       fetchOldProjects();
//     }
//   }, [isFocused]);
  

//   const fetchOldProjects = async () => {
//     try {
//       const folderPath = RNFS.ExternalDirectoryPath + '/capturedImages';
//       const folders = await RNFS.readDir(folderPath);
//       const projects = folders
//         .filter((folder) => folder.isDirectory())
//         .map((folder) => folder.name);
//       setOldProjects(projects);
//     } catch (error) {
//       console.log('Error fetching old projects:', error);
//     }
//   };
//   const flexD = 'column'
//   return (
//       <View style={{flex: 1, flexDirection: flexD, backgroundColor: '#fff'}}>
//         <Header
//         backgroundColor='#95B6FF'
//         leftComponent={{ icon: 'menu', onPress: () => navigation.openDrawer() }}
//         centerComponent={{ text: 'Home', style: { color: '#fff' } }}
//         rightComponent={{ icon: 'search', onPress: () => {} }}
//       />
//       <StatusBar style="auto" />
//       <View style={[styles.box,{ flex: 6, backgroundColor: '#fff'}]}>
//       <Text style={[styles.label]}>SHOW PROJECTS</Text>
//       <View 
//       >

//       {oldProjects.map((project, index) => (
//         <TouchableOpacity
//           key={index}
//           style={[styles.projectButton,{backgroundColor: "#144A9C", width: 300,
//           height: 100 ,marginLeft:60,borderRadius:35}]}
//           onPress={() => navigation.navigate('ImageSliderScreen', { projectName: project })}
//         >
//           <Text style={styles.projectButtonText}>{project}</Text>
//         </TouchableOpacity>
//       ))}
//       </View>
      
//       </View>
//       <View style={{ flex: 1, backgroundColor: '#fff'}}>
//         {/* footer */}
//       </View>
//       </View>
      
//   );
// }

// const { width, height } = Dimensions.get('window');
// const styles = StyleSheet.create({
//   box: {
//     width: width ,
//     margin: 'auto',
//     height: height/2,
//     // width: 100,
//     // margin: 'auto',
//     // height: 100,
//     },
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   label: {
//     textAlign: "center",
//     marginBottom: 10,
//     fontSize: 24,
//   },
//   projectButton: {
//     backgroundColor: 'blue',
//     padding: 10,
//     borderRadius: 5,
//     marginBottom: 10,
//     width: '100%',
//     alignItems: 'center',
//   },
//   projectButtonText: {
//     fontSize: 16,
//     color: 'white',
//   },
//   heading: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },

// });




