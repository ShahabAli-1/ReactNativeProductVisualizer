import React, { useState, useRef, useEffect, useCallback} from "react";
import {View,TouchableOpacity,Text,ActivityIndicator,Image,StyleSheet,ScrollView,Modal,TextInput,Alert,} from "react-native";
import { Camera, useCameraDevices } from "react-native-vision-camera";
import RNFS from "react-native-fs";
import { Header } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation , useIsFocused} from "@react-navigation/native";
import { StackActions } from "@react-navigation/native";


const isReactNative = typeof navigator !== "undefined" && navigator.product === "ReactNative";

// Conditionally import BackHandler only in React Native
let BackHandler;
if (isReactNative) {
  BackHandler = require("react-native").BackHandler;
}


export default function AppCamera() {
  const [images, setImages] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureInterval, setCaptureInterval] = useState(null);
  const [sessionFolder, setSessionFolder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sessionName, setSessionName] = useState("");
  const camera = useRef(null);
  const devices = useCameraDevices();
  const device = devices.back;
  const interval = useRef(null);
  const [buttonColor, setButtonColor] = useState("red");
  const isFocused = useIsFocused();


  //------------------------
  const [isSecondModalVisible, setIsSecondModalVisible] = useState(false);
  const [isHotspotCaptureButtonVisible, setIsHotspotCaptureButtonVisible] =
    useState(false);
  const showSecondModal = () => {
    setIsSecondModalVisible(true);
  };

  const captureHotspot = async () => {
    if (camera.current) {
      try {
        const data = await camera.current.takePhoto({
          skipProcessing: false,
        });
        console.log(data.path);
        setImages((prevImages) => [...prevImages, data.path]);

        //saveImages();
      } catch (error) {
        console.log("Camera capture error:", error);
      }
    }
    setIsHotspotCaptureButtonVisible(false);
  };

  const closeSecondModal = () => {
    setIsSecondModalVisible(false);
    setIsHotspotCaptureButtonVisible(true);
  };
  const closeSecondModalNoHotspot = () => {
    setIsSecondModalVisible(false);
  };

  //-------------------------------------------
  const navigation = useNavigation();

  useEffect(() => {
    // initializeCamera();
    createSessionFolder();
  }, []);
  // const initializeCamera = async () => {
  //   try {
  //     await Camera.requestCameraPermission();
  //     await Camera.getCameraPermissionStatus();
  //     await Camera.requestMicrophonePermission();
  //     await Camera.getMicrophonePermissionStatus();
  //     await Camera.initializeAsync();
  //   } catch (error) {
  //     console.log('Camera initialization error:', error);
  //   }
  // };

  useEffect(() => {
    const handleBackPress = () => {
      if (!isCapturing && images.length === 0) {
      navigation.dispatch(StackActions.replace("BottomNavigator",{screen:'Home'}));
        // navigation.goBack();
        return true;
      }
      if(images.length > 0){
      navigation.dispatch(StackActions.replace("BottomNavigator",{screen:'Home'}));
      return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress",handleBackPress);
    return () => {
      backHandler.remove();
    };
  }, [isCapturing, images, navigation]);

  
  const createSessionFolder = useCallback(async () => {
    const folderPath = RNFS.ExternalDirectoryPath + "/capturedImages";
    if (sessionName) {
      const sessionFolder = `${folderPath}/${sessionName}`;
      console.log(sessionFolder);
      const folderExists = await RNFS.exists(sessionFolder);
      if (folderExists) {
        // Append a specific identifier to the session name
        const currentDate = new Date();
        const identifier = `${currentDate.getFullYear()}${
          currentDate.getMonth() + 1
        }${currentDate.getDate()}`;
        const newSessionName = `${sessionName}_${identifier}`;
        const newSessionFolder = `${folderPath}/${newSessionName}`;
        await RNFS.mkdir(newSessionFolder, { intermediates: true });
        setSessionFolder(newSessionFolder);
      } else {
        console.log(sessionFolder);
        await RNFS.mkdir(sessionFolder, { intermediates: true });
        setSessionFolder(sessionFolder);
      }
    }
  }, [sessionName]);

  const showModal = () => {
    setIsModalVisible(true);
  };
  const confirmSessionName = async () => {
    setIsModalVisible(false);
    setSessionFolder(sessionName);
    await createSessionFolder();
    saveImages();
  };

  const startCapture = async () => {
    if (!isHotspotCaptureButtonVisible) {
      setIsCapturing(true);
      setImages([]);
      captureFrame();
      const interval = setInterval(captureFrame, 1000);
      setCaptureInterval(interval);
      return () => {
        clearInterval(interval);
        setIsCapturing(false);
        setButtonColor("white");
      };
    } else {
      captureHotspot();
    }
  };

  const captureFrame = async () => {
    if (camera.current) {
      try {
        const data = await camera.current.takePhoto({
          skipProcessing: false,
        });
        console.log(data.path);
        setImages((prevImages) => [...prevImages, data.path]);
      } catch (error) {
        console.log("Camera capture error:", error);
      }
    }
  };

  const stopCapture = () => {
    setIsCapturing(false);
    clearInterval(captureInterval);
    setCaptureInterval(null);
    setButtonColor("red");
  };

  const discardSession = async () => {
    setIsCapturing(false);
    clearInterval(captureInterval);
    setCaptureInterval(null);
    setImages([]);
    if (sessionFolder) {
      try {
        const files = await RNFS.readDir(sessionFolder);
        await Promise.all(files.map((file) => RNFS.unlink(file.path)));
        // await RNFS.unlink(sessionFolder);
      } catch (error) {
        console.log("Error deleting session files:", error);
      }
    }
  };

  const saveImages = async () => {
    // console.log(sessionFolder);
    if (!sessionFolder) {
      const folderPath = RNFS.ExternalDirectoryPath + "/capturedImages";
      const sessionFolder = `${folderPath}/${sessionName}`;
      console.log(sessionFolder);
      const folderExists = await RNFS.exists(sessionFolder);
      if (folderExists) {
        try {
          console.log("Save button pressed");
          await Promise.all(
            images.map(async (image) => {
              const imageName = image.substring(image.lastIndexOf("/") + 1);
              const destPath = `${sessionFolder}/${imageName}`;
              await RNFS.moveFile(image, destPath);
              console.log(destPath)
            })
          );
          // navigation.dispatch(StackActions.replace("ImageSliderScreen", { images: images.map(image => `${sessionFolder}/${image.substring(image.lastIndexOf("/") + 1)}`) }));
          // navigation.navigate("ImageSliderScreen", { images: images.map(image => `${sessionFolder}/${image.substring(image.lastIndexOf("/") + 1)}`) });
          refreshPage();
        } catch (error) {
          console.log("Error saving images:", error);
          Alert.alert("Error", "Failed to save the images. Please try again.");
        }
      }
    } else {
      Alert.alert(
        "Session Name Not Set",
        "Please enter a session name and create the folder first."
      );
    }
  };
  const refreshPage = () => {
    // Implement the logic to refresh the page here
    // You can set the necessary state variables to their initial values
    navigation.dispatch(StackActions.replace("BottomNavigator",{screen:'Home'}));
    setImages([]);
    setIsCapturing(false);
    setCaptureInterval(null);
    setSessionFolder(null);
    setSessionName("");
  };

  if (device == null) return <ActivityIndicator />;

  return (
    <View style={{ flex: 1 }}>
      <Header
        backgroundColor="#95B6FF"
        // leftComponent={{ icon: 'menu', onPress: () => navigation.openDrawer() }}
        centerComponent={{ text: "Camera", style: { color: "#fff" } }}
        // rightComponent={{ icon: 'search', onPress: () => {} }}
      />
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Enter a name for the session:</Text>
            <TextInput
              style={styles.modalInput}
              value={sessionName}
              onChangeText={setSessionName}
              autoFocus={true}
            />
            <TouchableOpacity
              onPress={confirmSessionName}
              style={[
                styles.modalButton,
                { backgroundColor: sessionName ? "lightgreen" : "gray" },
              ]}
              disabled={!sessionName}
            >
              <Text style={styles.modalButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ===================================================================== */}
      {/* Hotspot Modal Option */}
      <Modal
        visible={isSecondModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Want to Add another Image?</Text>
            <TouchableOpacity
              onPress={closeSecondModal}
              style={[styles.modalButton, { backgroundColor: "lightgreen" }]}
            >
              <Text style={styles.modalButtonText}>Add to Project</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={closeSecondModalNoHotspot}
              style={[styles.modalButton, { backgroundColor: "red" }]}
            >
              <Text style={styles.modalButtonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ----------------------------------------------------- */}

      <Camera
        ref={camera}
        style={{ flex: 1 }}
        photo={true}
        device={device}
        // isActive={true}
        isActive={isFocused}
      />
      <View
        style={[
          styles.buttonContainer,
          { backgroundColor: "transparent !important" },
        ]}
      >


        {!isCapturing ? (
          <TouchableOpacity
            onPress={startCapture}
            style={[styles.button, { backgroundColor: buttonColor }]}
          ></TouchableOpacity>
        ) : (
          <TouchableOpacity 
          onPress={stopCapture} 
          style={styles.button} />
        )}

        {/* {!isCapturing ? (
          <TouchableOpacity
            onPress={startCapture}
            style={[styles.button, { backgroundColor: buttonColor }]}
          >
            <Text>---</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={stopCapture} style={styles.button} />
        )} */}
      </View>
      {!isCapturing && images.length > 0 && (
        <View style={{ flexDirection: "column" }}>
          <View style={{ flexDirection: "row" }}>
            <ScrollView
              horizontal={true}
              contentContainerStyle={{ padding: 0, margin: 0 }}
            >
              {images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: `file://${image}` }}
                  style={{ width: 80, height: 80 }}
                />
              ))}
            </ScrollView>
            {images.length !== 0 && !isCapturing ? (
              <TouchableOpacity
                onPress={showSecondModal}
                style={styles.buttonHotspot}
              >
                <Icon style={styles.icon}>+</Icon>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity>
                <Text></Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity 
          onPress={discardSession} 
          style={styles.buttons}>
            <Text style={styles.buttonText}>retake</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={showModal} style={styles.buttons}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttons: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "white",
  },

  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 3,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 5,
  },
  modalButtonText: {
    fontSize: 16,
    color: "white",
  },

  buttonHotspot: {
    marginTop: 19,
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: "gray",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonSave: {
    marginTop: 19,
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    color: "white",
    fontSize: 24,
  },
});



// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import { View, TouchableOpacity, Text, ActivityIndicator, Image, StyleSheet, ScrollView, Modal, TextInput , Alert} from 'react-native';
// import { Camera, useCameraDevices } from 'react-native-vision-camera';
// import RNFS from 'react-native-fs';
// import {Header} from 'react-native-elements'
// import { useNavigation } from '@react-navigation/native';



// export default function AppCamera() {
//   const [images, setImages] = useState([]);
//   const [isCapturing, setIsCapturing] = useState(false);
//   const [captureInterval, setCaptureInterval] = useState(null);
//   const [sessionFolder, setSessionFolder] = useState(null);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [sessionName, setSessionName] = useState('');
//   const camera = useRef(null);
//   const devices = useCameraDevices();
//   const device = devices.back;
//   const interval = useRef(null);
//   const [buttonColor, setButtonColor] = useState('red');

//   const navigation = useNavigation();

//   useEffect(() => {
//     createSessionFolder();
//   }, []);

//   const createSessionFolder = useCallback(async () => {
//     const folderPath = RNFS.ExternalDirectoryPath + '/capturedImages';
//     if (sessionName) {
//       const sessionFolder = `${folderPath}/${sessionName}`;
//       console.log(sessionFolder);
//       const folderExists = await RNFS.exists(sessionFolder);
//       if (folderExists) {
//         // Append a specific identifier to the session name
//         const currentDate = new Date();
//         const identifier = `${currentDate.getFullYear()}${currentDate.getMonth() + 1}${currentDate.getDate()}`;
//         const newSessionName = `${sessionName}_${identifier}`;
//         const newSessionFolder = `${folderPath}/${newSessionName}`;
//         await RNFS.mkdir(newSessionFolder, { intermediates: true });
//         setSessionFolder(newSessionFolder);
//       } else {
//         console.log(sessionFolder);
//         await RNFS.mkdir(sessionFolder, { intermediates: true });
//         setSessionFolder(sessionFolder);
//       }
//     }
//   }, [sessionName]);

//   const showModal= () => {
//     setIsModalVisible(true);
//   };
//   const confirmSessionName = async() => {
//     setIsModalVisible(false);
//     setSessionFolder(sessionName);
//     await createSessionFolder();
//     saveImages();
//   };


//   const startCapture = async() => {
//     setIsCapturing(true);
//     setImages([]);
//     captureFrame();
//     const interval = setInterval(captureFrame, 1000);
//     setCaptureInterval(interval);
//     return () => {
//       clearInterval(interval);
//       setIsCapturing(false);
//       setButtonColor('white');
//     };
//   };

//   const captureFrame = async () => {
//     if (camera.current) {
//       try {
//         const data = await camera.current.takePhoto({
//           skipProcessing: false,
//         });
//         console.log(data.path);
//         setImages((prevImages) => [...prevImages, data.path]);
//       } catch (error) {
//         console.log('Camera capture error:', error);
//       }
//     }
//   };

//   const stopCapture = () => {
//     setIsCapturing(false);
//     clearInterval(captureInterval);
//     setCaptureInterval(null);
//     setButtonColor('red')
//   };

//   const discardSession =  async() => {
//           setIsCapturing(false);
//           clearInterval(captureInterval);
//           setCaptureInterval(null);
//           setImages([]);
//           if (sessionFolder) {
//             try {
//               const files = await RNFS.readDir(sessionFolder);
//               await Promise.all(files.map(file => RNFS.unlink(file.path)));
//               // await RNFS.unlink(sessionFolder); 
//             } catch (error) {
//               console.log('Error deleting session files:', error);
//             }
//           }
//   };

//   const saveImages = async () => {
//     // console.log(sessionFolder);
//         if (!sessionFolder) {
//           const folderPath = RNFS.ExternalDirectoryPath + '/capturedImages';
//           const sessionFolder = `${folderPath}/${sessionName}`;
//           console.log(sessionFolder);
//           const folderExists = await RNFS.exists(sessionFolder);
//           if (folderExists) {
//       try {
//           console.log("Save button pressed");
//           await Promise.all(
//             images.map(async (image) => {
//               const imageName = image.substring(image.lastIndexOf('/') + 1);
//               const destPath = `${sessionFolder}/${imageName}`;
//               await RNFS.moveFile(image, destPath);
//             }
//             )
//           );
//           // Alert.alert('Images Saved', 'The images have been saved successfully.');
//           navigation.navigate('Home');
//           refreshPage();
        
//       } catch (error) {
//         console.log('Error saving images:', error);
//         Alert.alert('Error', 'Failed to save the images. Please try again.');
//       }}
//     } else {
//       Alert.alert('Session Name Not Set', 'Please enter a session name and create the folder first.');
//     }    
//   };
//   const refreshPage = () => {
//     // Implement the logic to refresh the page here
//     // You can set the necessary state variables to their initial values
//     setImages([]);
//     setIsCapturing(false);
//     setCaptureInterval(null);
//     setSessionFolder(null);
//     setSessionName('');
//   };

//   if (device == null) return <ActivityIndicator />;

//   return (
//     <View style={{ flex: 1 }}>
//        <Header
//         backgroundColor='#95B6FF'
//         // leftComponent={{ icon: 'menu', onPress: () => navigation.openDrawer() }}
//         centerComponent={{ text: 'Camera', style: { color: '#fff' } }}
//         // rightComponent={{ icon: 'search', onPress: () => {} }}
//       />
//       <Modal visible={isModalVisible} animationType="slide" transparent={true}>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalText}>Enter a name for the session:</Text>
//             <TextInput
//               style={styles.modalInput}
//               value={sessionName}
//               onChangeText={setSessionName}
//               autoFocus={true}
//             />
//             <TouchableOpacity onPress={confirmSessionName} style={[
//             styles.modalButton,
//             { backgroundColor: sessionName ? 'lightgreen' : 'gray' },
//              ]}
//           disabled={!sessionName}
//             >
//               <Text style={styles.modalButtonText}>Confirm</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       <Camera ref={camera} 
//       style={{ flex: 1 }} 
//       photo={true} device={device} isActive={true} />
//       <View style={[styles.buttonContainer,{ backgroundColor:"transparent !important"}]} >
//       {!isCapturing ? (
//         <TouchableOpacity 
//         onPress={startCapture}
//          style={[styles.button,{ backgroundColor: buttonColor }]} >
//           </TouchableOpacity>
//       ) : (
//         <TouchableOpacity 
//         onPress={stopCapture}
//          style={styles.button} />
//       )}
//       </View>
//       {!isCapturing &&  images.length > 0 && (
//       <View style={{ flexDirection: 'column' }}>
//         <ScrollView horizontal={true} contentContainerStyle={{ padding: 0, margin: 0 }}>
//           {images.map((image, index) => (
//             <Image key={index} source={{ uri: `file://${image}` }} style={{ width: 80, height: 80 }} />
//           ))}
//         </ScrollView>
//         <TouchableOpacity onPress={discardSession} style={styles.buttons}>
//           <Text style={styles.buttonText}>retake</Text>
//           </TouchableOpacity>
//         <TouchableOpacity onPress={showModal} style={styles.buttons}>
//           <Text style={styles.buttonText}>Save</Text>
//           </TouchableOpacity>
//       </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   buttons: {
//     backgroundColor: 'white',
//     padding: 10,
//     borderRadius: 5,
//     margin: 10,
//   },
//   buttonContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   button: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     borderWidth: 2,
//     borderColor: 'white', 
//   },

//   buttonText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     padding: 25,
//     borderRadius: 10,
//   },
//   modalText: {
//     fontSize: 16,
//     marginTop: 15,
//     marginBottom:3
//   },
//   modalInput: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     marginBottom: 10,
//   },
//   modalButton: {
//     backgroundColor: 'blue',
//     padding: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginBottom:5
//   },
//   modalButtonText: {
//     fontSize: 16,
//     color: 'white',
//   },
// });





// import React, { useState, useRef, useEffect } from 'react';
// import { View, TouchableOpacity, Text, ActivityIndicator, Image, StyleSheet, ScrollView } from 'react-native';
// import { Camera, useCameraDevices } from 'react-native-vision-camera';
// import RNFS from 'react-native-fs';
// import { CameraRoll } from "@react-native-camera-roll/camera-roll";

// export default function AppCamera() {
//   const [images, setImages] = useState([]);
//   const [isCapturing, setIsCapturing] = useState(false);
//   const [captureInterval, setCaptureInterval] = useState(null);
//   const [sessionFolder, setSessionFolder] = useState(null);
//   const camera = useRef(null);
//   const devices = useCameraDevices();
//   const device = devices.back;
//   const interval = useRef(null);
//   const createSessionFolder = async () => {
//     const folderPath = RNFS.ExternalDirectoryPath + '/capturedImages'; // Specify the base folder path
//     const sessionFolder = `${folderPath}/${Date.now()}`; // Generate a unique session folder name
//     await RNFS.mkdir(sessionFolder, { intermediates: true }); // Create the session folder if it doesn't exist
//     setSessionFolder(sessionFolder);
//   };

//   useEffect(() => {
//     createSessionFolder();
//   }, []);

//   const startCapture = () => {
//     setIsCapturing(true);
//     setImages([]);
//     captureFrame(); // Initial capture
//     const interval = setInterval(captureFrame, 1000); // Capture subsequent frames every 2 seconds
//     setCaptureInterval(interval);
//     // Cleanup function to clear the interval when the component unmounts
//     return () => {
//       clearInterval(interval);
//       setIsCapturing(false);
//     }
//   };

//   const stopCapture = () => {
//     setIsCapturing(false);
//     clearInterval(captureInterval);
//     setCaptureInterval(null);
//     setSessionFolder(''); // Reset the session folder
//     createSessionFolder(); 
    
//   };

//   const captureFrame = async () => {
//     if (camera.current && sessionFolder) {
//       try {
//         const data = await camera.current.takePhoto({
//           skipProcessing: false,
//         });

//         const imagePath = `${sessionFolder}/${Date.now()}.jpg`; // Generate a unique image file name within the session folder
//         await RNFS.moveFile(data.path, imagePath); // Move the captured image to the session folder
//         await CameraRoll.save(imagePath, { type: 'photo', album: 'mygallery' });
//         console.log(imagePath);
//         setImages((prevImages) => [...prevImages, imagePath]);
//       } catch (error) {
//         console.log('Camera capture error:', error);
//       }
//     }
//   };

//   if (device == null || sessionFolder == null) return <ActivityIndicator />;
//   return (
//     <View style={{ flex: 1 }}>
//       <Camera ref={camera} style={{ flex: 1 }} photo={true} device={device} isActive={true} />
//       {!isCapturing ? (
//         <TouchableOpacity onPress={startCapture} style={styles.button}>
//           <Text style={styles.buttonText}>Start Capture</Text>
//         </TouchableOpacity>
//       ) : (
//         <TouchableOpacity onPress={stopCapture} style={styles.button}>
//           <Text style={styles.buttonText}>Stop Capture</Text>
//         </TouchableOpacity>
//       )}

//       <View style={{ flexDirection: 'row' }}>
//         <ScrollView horizontal={true} contentContainerStyle={{ padding: 0, margin: 0 }}>
//           {images.map((image, index) => (
//             <Image key={index} source={{ uri: `file://${image}` }} style={{ width: 80, height: 80 }} />
//           ))}
//         </ScrollView>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   button: {
//     backgroundColor: 'white',
//     padding: 10,
//     borderRadius: 5,
//     margin: 10,
//   },
//   buttonText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });


// import React, { useState, useRef, useEffect } from 'react';
// import { View, TouchableOpacity, Text, ActivityIndicator, Image, StyleSheet, ScrollView } from 'react-native';
// import { Camera, useCameraDevices } from 'react-native-vision-camera';

// export default function AppCamera() {
//   const [images, setImages] = useState([]);
//   const [isCapturing, setIsCapturing] = useState(false);
//   const [captureInterval, setCaptureInterval] = useState(null);
//   const camera = useRef(null);
//   const devices = useCameraDevices();
//   const device = devices.back;
//   const interval = useRef(null);

//   const startCapture = () => {
//     setIsCapturing(true);
//     setImages([]);
//     captureFrame(); // Initial capture
//     const interval = setInterval(captureFrame, 1000); // Capture subsequent frames every 2 seconds
//     setCaptureInterval(interval);
//     // Cleanup function to clear the interval when the component unmounts
//     return () => {
//       clearInterval(interval);
//       setIsCapturing(false);
//     }
//   };

//   const stopCapture = () => {
//       setIsCapturing(false);
//       clearInterval(captureInterval);
//   };
        

//   const captureFrame = async () => {
//     if (camera.current) {
//       try {
//         const data = await camera.current.takePhoto({
//           skipProcessing: false,
//         });
//         console.log(data);
//         setImages((prevImages) => [...prevImages, data.path]);
//       } catch (error) {
//         console.log('Camera capture error:', error);
//       }
//     }
//   };

//   if (device == null) return <ActivityIndicator />;
//   return (
//     <View style={{ flex: 1 }}>
//       <Camera ref={camera} style={{ flex: 1 }} photo={true} device={device} isActive={true} />
//       {!isCapturing ? (
//       <TouchableOpacity onPress={startCapture} 
//       style={styles.button}
//       // style={{position:'absolute', borderWidth:4,borderColor:'white', bottom: 50, alignSelf: 'center',backgroundColor:'#FF0037', width:60, height:60, borderRadius:30  }}
//       >
//         <Text style={styles.buttonText}>Start Capture</Text>
//       </TouchableOpacity>
//        ) : (
//       <TouchableOpacity onPress={stopCapture} style={styles.button}>
//              <Text style={styles.buttonText}>Stop Capture</Text>
//       </TouchableOpacity>
//         )}
      
//       <View style={{ flexDirection: 'row' }}>
//       <ScrollView  horizontal={true} contentContainerStyle={{ padding: 0, margin: 0 }}>
//         {images.map((image, index) => (
//           <Image key={index} source={{ uri: `file://'${image}` }} style={{ width: 80, height: 80 }} />
//         ))}
//       </ScrollView>
//       </View>
     
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   button: {
//     backgroundColor: 'white',
//     padding: 10,
//     borderRadius: 5,
//     margin: 10,
//   },
//   buttonText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

