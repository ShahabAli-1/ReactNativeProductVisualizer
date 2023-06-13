// updated code with retake and session functionality working 
// date : 2 june 2023
// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import { View, TouchableOpacity, Text, ActivityIndicator, Image, StyleSheet, ScrollView, Modal, TextInput , Alert} from 'react-native';
// import { Camera, useCameraDevices } from 'react-native-vision-camera';
// import RNFS from 'react-native-fs';
// import { CameraRoll } from "@react-native-camera-roll/camera-roll";

// export default function AppCamera() {
//   const [images, setImages] = useState([]);
//   const [isCapturing, setIsCapturing] = useState(false);
//   const [captureInterval, setCaptureInterval] = useState(null);
//   const [sessionFolder, setSessionFolder] = useState(null);
//   const [issecondModalVisible, setIsSecondModalVisible] = useState(false);
//   const [isfirstModalVisible, setIsFirstModalVisible] = useState(false); 
//   const [isthirdModalVisible, setIsThirdModalVisible] = useState(false); // New
//   const [sessionName, setSessionName] = useState('');
//   const [tempSessionName, setTempSessionName] = useState('');
//   const camera = useRef(null);
//   const devices = useCameraDevices();
//   const device = devices.back;
//   const interval = useRef(null);

//   const createSessionFolder = useCallback(async () => {
//     const folderPath = RNFS.ExternalDirectoryPath + '/capturedImages';
//     if (sessionName) {
//       const sessionFolder = `${folderPath}/${sessionName}`;
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
//         await RNFS.mkdir(sessionFolder, { intermediates: true });
//         setSessionFolder(sessionFolder);
//       }
//     }
//   }, [sessionName]);

//   const showSecondModel= () => {
//     setIsFirstModalVisible(false);
//     setIsSecondModalVisible(true);
//     // setTempSessionName('');
//   };

//   const confirmSessionName = () => {
//     setIsSecondModalVisible(false);
//     setSessionName(sessionName);
//     createSessionFolder();
//   };

//   const showFirstModal = () => {
//     setIsFirstModalVisible(true);
//   };

//   // const closeFirstModal = () => {
//   //   setIsFirstModalVisible(false);
//   // };

//   // const closeSecondModal = () => {
//   //   setIsSecondModalVisible(false);
//   // };

//   const showThirdModal = () => {
//     setIsThirdModalVisible(true);
//   };


//   useEffect(() => {
//     showFirstModal();
//   }, []);

//   const startCapture = async() => {
//     if (!sessionName) {
//       try {
//           // const folderPath = RNFS.ExternalDirectoryPath + '/capturedImages';
//           // const sessionFolder = `${folderPath}/${sessionName}`;
//           // const folderExists = await RNFS.exists(sessionFolder);
//           //   if (!folderExists) {
//       // Display an error message or show a pop-up indicating that the folder needs to be created first
//       Alert.alert(
//         'Project Not Created',
//         'Please create a project first',
//         [
//           {
//             text: 'OK',
//             onPress: () => {
//               showSecondModel() 
//             },
//           },
//         ],
//         { cancelable: false }
//       );
//       return;
//     //  }
//     }
//  catch (error) {
//     console.log('Error image capturing:', error);
//     Alert.alert('Error', 'Failed to capture the images. Please try again.');
//   }
//   }
//     setIsCapturing(true);
//     setImages([]);
//     captureFrame();
//     const interval = setInterval(captureFrame, 1000);
//     setCaptureInterval(interval);
//     return () => {
//       clearInterval(interval);
//       setIsCapturing(false);
//     };
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
//     setIsThirdModalVisible(false);
//     // createSessionFolder(); 
//   };


//   const saveImages = async () => {
//     console.log("Save button pressed");
//     if (sessionFolder) {
//       try {
//         // const folderPath = RNFS.ExternalDirectoryPath + '/capturedImages';
//         // const sessionFolder = `${folderPath}/${sessionName}`;
//         // const folderExists = await RNFS.exists(sessionFolder);
        
//         // if (folderExists) {
//           console.log("Save button pressed");
//           await Promise.all(
//             images.map(async (image) => {
//               const imageName = image.substring(image.lastIndexOf('/') + 1);
//               const destPath = `${sessionFolder}/${imageName}`;
//               await RNFS.moveFile(image, destPath);
//             }
//             )
//           );
         
//           // setSessionFolder(sessionFolder); 
//           Alert.alert('Images Saved', 'The images have been saved successfully.');
//         // } else {
//         //   Alert.alert('Folder Not Found', 'The session folder does not exist. Please try again.');
//         // }
//       } catch (error) {
//         console.log('Error saving images:', error);
//         Alert.alert('Error', 'Failed to save the images. Please try again.');
//       }
//     } else {
//       Alert.alert('Session Name Not Set', 'Please enter a session name and create the folder first.');
//     }
//     setIsThirdModalVisible(false);
//   };

//   const stopCapture = () => {
//     setIsCapturing(false);
//     clearInterval(captureInterval);
//     setCaptureInterval(null);
//     // setSessionFolder('');
//     showThirdModal();
//   };

//   const captureFrame = async () => {
//     if (camera.current && sessionFolder) {
//       try {
//         const data = await camera.current.takePhoto({
//           skipProcessing: false,
//         });

//         const imagePath = `${sessionFolder}/${Date.now()}.jpg`;
//         // await RNFS.moveFile(data.path, imagePath);
//         // await CameraRoll.save(imagePath, { type: 'photo', album: 'mygallery' });
//         console.log(data.path);
//         setImages((prevImages) => [...prevImages, data.path]);
//       } catch (error) {
//         console.log('Camera capture error:', error);
//       }
//     }
//   };

//   if (device == null) return <ActivityIndicator />;

//   return (
//     <View style={{ flex: 1 }}>
//       <Modal visible={issecondModalVisible} animationType="slide" transparent={true}>
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
//             {/* <TouchableOpacity onPress={closeSecondModal}  style={[styles.modalButton,{backgroundColor:"red"}]}>
//               <Text style={styles.modalButtonText}>Close</Text>
//             </TouchableOpacity> */}
//           </View>
//         </View>
//       </Modal>

//       <Modal visible={isfirstModalVisible} animationType="slide" transparent={true}>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//           <TouchableOpacity onPress={showSecondModel} style={[styles.modalButton,{backgroundColor:"lightgreen"}]}>
//               <Text style={styles.modalButtonText}>New Project</Text>
//             </TouchableOpacity>
//             <Text style={styles.modalText}>Do You Want To Work On Existing Projects?</Text>
//             <TouchableOpacity 
//             // onPress={closeSecondModal} 
//             style={styles.modalButton}>
//               <Text style={styles.modalButtonText}>Old Projects</Text>
//             </TouchableOpacity>
//             {/* <TouchableOpacity 
//             onPress={closeFirstModal} 
//             style={[styles.modalButton,{backgroundColor:"red"}]}
//             >
//               <Text style={styles.modalButtonText}>Close</Text>
//             </TouchableOpacity> */}
//           </View>
//         </View>
//       </Modal>

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

//       <Modal visible={isthirdModalVisible} animationType="slide" transparent={true}>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalText}>Save or discard the images?</Text>
            
//             <TouchableOpacity
//              onPress={saveImages} 
//              style={
//              styles.modalButton}
//           //   { backgroundColor: sessionName ? 'lightgreen' : 'gray' },
//           //    ]}
//             //  disabled={!sessionName}
//             >
//               <Text style={styles.modalButtonText}>Save</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={discardSession}  style={[styles.modalButton,{backgroundColor:"red"}]}>
//               <Text style={styles.modalButtonText}>Discard</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
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
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     // padding:15,
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





// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import { View, TouchableOpacity, Text, ActivityIndicator, Image, StyleSheet, ScrollView, Modal, TextInput , Alert} from 'react-native';
// import { Camera, useCameraDevices } from 'react-native-vision-camera';
// import RNFS from 'react-native-fs';
// import { CameraRoll } from "@react-native-camera-roll/camera-roll";

// export default function AppCamera() {
//   const [images, setImages] = useState([]);
//   const [isCapturing, setIsCapturing] = useState(false);
//   const [captureInterval, setCaptureInterval] = useState(null);
//   const [sessionFolder, setSessionFolder] = useState(null);
//   const [issecondModalVisible, setIsSecondModalVisible] = useState(false);
//   const [isfirstModalVisible, setIsFirstModalVisible] = useState(false); 
//   const [isthirdModalVisible, setIsThirdModalVisible] = useState(false); // New
//   const [sessionName, setSessionName] = useState('');
//   const [tempSessionName, setTempSessionName] = useState('');
//   const [cachedImages, setCachedImages] = useState([]);
//   const camera = useRef(null);
//   const devices = useCameraDevices();
//   const device = devices.back;
//   const interval = useRef(null);

//   const createSessionFolder = useCallback(async () => {
//     const folderPath = RNFS.ExternalDirectoryPath + '/capturedImages';
//     if (sessionName) {
//       const sessionFolder = `${folderPath}/${sessionName}`;
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
//         await RNFS.mkdir(sessionFolder, { intermediates: true });
//         setSessionFolder(sessionFolder);
//       }
//     }
//   }, [sessionName]);

//   const showSecondModel= () => {
//     setIsFirstModalVisible(false);
//     setIsSecondModalVisible(true);
//     // setTempSessionName('');
//   };

//   const confirmSessionName = () => {
//     setIsSecondModalVisible(false);
//     setSessionName(sessionName);
//     createSessionFolder();
//   };

//   const showFirstModal = () => {
//     setIsFirstModalVisible(true);
//   };

//   // const closeFirstModal = () => {
//   //   setIsFirstModalVisible(false);
//   // };

//   // const closeSecondModal = () => {
//   //   setIsSecondModalVisible(false);
//   // };

//   const showThirdModal = () => {
//     setIsThirdModalVisible(true);
//   };


//   useEffect(() => {
//     showFirstModal();
//   }, []);

//   const startCapture = async() => {
//     if (sessionName) {
//       try {
//   const folderPath = RNFS.ExternalDirectoryPath + '/capturedImages';
//   const sessionFolder = `${folderPath}/${sessionName}`;
//   const folderExists = await RNFS.exists(sessionFolder);
//     if (!folderExists) {
//       // Display an error message or show a pop-up indicating that the folder needs to be created first
//       Alert.alert(
//         'Project Not Created',
//         'Please create a project first',
//         [
//           {
//             text: 'OK',
//             onPress: () => {
//               showSecondModel() 
//             },
//           },
//         ],
//         { cancelable: false }
//       );
//       return;
//  }
// } catch (error) {
//   console.log('Error image capturing:', error);
//   Alert.alert('Error', 'Failed to capture the images. Please try again.');
// }
// } else {
// Alert.alert('Session Name Not Set', 'Please enter a session name and create the folder first.');
// }

//     setIsCapturing(true);
//     setImages([]);
//     captureFrame();
//     const interval = setInterval(captureFrame, 1000);
//     setCaptureInterval(interval);
//     return () => {
//       clearInterval(interval);
//       setIsCapturing(false);
//     };
//   };
//   const discardSession =  async() => {
//           setIsCapturing(false);
//           clearInterval(captureInterval);
//           setCaptureInterval(null);
//           setImages([]);
//           // setCachedImages([]);
//           if (sessionFolder) {
//             try {
//               const files = await RNFS.readDir(sessionFolder);
//               await Promise.all(files.map(file => RNFS.unlink(file.path)));
//               // await RNFS.unlink(sessionFolder);
//             } catch (error) {
//               console.log('Error deleting session files:', error);
//             }
//           }
//     setIsThirdModalVisible(false);
//   };


//   const saveImages = async () => {
//     console.log("Save button pressed");
//     if (sessionName) {
//       try {
//         const folderPath = RNFS.ExternalDirectoryPath + '/capturedImages';
//         const sessionFolder = `${folderPath}/${sessionName}`;
//         const folderExists = await RNFS.exists(sessionFolder);
        
//         if (folderExists) {
//           await Promise.all(
//             cachedImages.map(async (cachedImage) => {
//               const { path, destination } = cachedImage;
//               await RNFS.moveFile(path, destination);
//             })
//           );
//           setCachedImages([]);
//           // await Promise.all(
//           //   images.map(async (image) => {
//           //     const imageName = image.substring(image.lastIndexOf('/') + 1);
//           //     const destPath = `${sessionFolder}/${imageName}`;
//           //     await RNFS.moveFile(image, destPath);
//           //   })
//           // );
//           Alert.alert('Images Saved', 'The images have been saved successfully.');
//         } else {
//           Alert.alert('Folder Not Found', 'The session folder does not exist. Please try again.');
//         }
//       } catch (error) {
//         console.log('Error saving images:', error);
//         Alert.alert('Error', 'Failed to save the images. Please try again.');
//       }
//     } else {
//       Alert.alert('Session Name Not Set', 'Please enter a session name and create the folder first.');
//     }
//     setIsThirdModalVisible(false);
//   };

//   const stopCapture = () => {
//     setIsCapturing(false);
//     clearInterval(captureInterval);
//     setCaptureInterval(null);
//     setSessionFolder('');
//     showThirdModal();
//   };

//   const captureFrame = async () => {
//     if (camera.current && sessionFolder) {
//       try {
//         const data = await camera.current.takePhoto({
//           skipProcessing: false,
//         });

//         const imagePath = `${sessionFolder}/${Date.now()}.jpg`;
//         // await RNFS.moveFile(data.path, imagePath);
//         // await CameraRoll.save(imagePath, { type: 'photo', album: 'mygallery' });
//         console.log(data.path);
//         setCachedImages((prevCachedImages) => [...prevCachedImages, { path: data.path, destination: imagePath }]);
//         setImages((prevImages) => [...prevImages, data.path]);
//         // setImages((prevImages) => [...prevImages, data.path]);
//       } catch (error) {
//         console.log('Camera capture error:', error);
//       }
//     }
//   };

//   if (device == null) return <ActivityIndicator />;

//   return (
//     <View style={{ flex: 1 }}>
//       <Modal visible={issecondModalVisible} animationType="slide" transparent={true}>
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
//             {/* <TouchableOpacity onPress={closeSecondModal}  style={[styles.modalButton,{backgroundColor:"red"}]}>
//               <Text style={styles.modalButtonText}>Close</Text>
//             </TouchableOpacity> */}
//           </View>
//         </View>
//       </Modal>

//       <Modal visible={isfirstModalVisible} animationType="slide" transparent={true}>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//           <TouchableOpacity onPress={showSecondModel} style={[styles.modalButton,{backgroundColor:"lightgreen"}]}>
//               <Text style={styles.modalButtonText}>New Project</Text>
//             </TouchableOpacity>
//             <Text style={styles.modalText}>Do You Want To Work On Existing Projects?</Text>
//             <TouchableOpacity 
//             // onPress={closeSecondModal} 
//             style={styles.modalButton}>
//               <Text style={styles.modalButtonText}>Old Projects</Text>
//             </TouchableOpacity>
//             {/* <TouchableOpacity 
//             onPress={closeFirstModal} 
//             style={[styles.modalButton,{backgroundColor:"red"}]}
//             >
//               <Text style={styles.modalButtonText}>Close</Text>
//             </TouchableOpacity> */}
//           </View>
//         </View>
//       </Modal>

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

//       <Modal visible={isthirdModalVisible} animationType="slide" transparent={true}>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalText}>Save or discard the images?</Text>
            
//             <TouchableOpacity
//              onPress={saveImages} 
//              style={
//              styles.modalButton}
//           //   { backgroundColor: sessionName ? 'lightgreen' : 'gray' },
//           //    ]}
//             //  disabled={!sessionName}
//             >
//               <Text style={styles.modalButtonText}>Save</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={discardSession}  style={[styles.modalButton,{backgroundColor:"red"}]}>
//               <Text style={styles.modalButtonText}>Discard</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
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
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     // padding:15,
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





// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import { View, TouchableOpacity, Text, ActivityIndicator, Image, StyleSheet, ScrollView, Modal, TextInput } from 'react-native';
// import { Camera, useCameraDevices } from 'react-native-vision-camera';
// import RNFS from 'react-native-fs';
// import { CameraRoll } from "@react-native-camera-roll/camera-roll";

// export default function AppCamera() {
//   const [images, setImages] = useState([]);
//   const [isCapturing, setIsCapturing] = useState(false);
//   const [captureInterval, setCaptureInterval] = useState(null);
//   const [sessionFolder, setSessionFolder] = useState(null);
//   const [issecondModalVisible, setIsSecondModalVisible] = useState(false);
//   const [isfirstModalVisible, setIsFirstModalVisible] = useState(false); // New
//   const [sessionName, setSessionName] = useState('');
//   const [tempSessionName, setTempSessionName] = useState('');
//   const camera = useRef(null);
//   const devices = useCameraDevices();
//   const device = devices.back;
//   const interval = useRef(null);

//   const createSessionFolder = useCallback(async () => {
//     const folderPath = RNFS.ExternalDirectoryPath + '/capturedImages';
//     if (sessionName) {
//       const sessionFolder = `${folderPath}/${sessionName}`;
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
//         await RNFS.mkdir(sessionFolder, { intermediates: true });
//         setSessionFolder(sessionFolder);
//       }
//     }
//   }, [sessionName]);

//   const showSecondModel= () => {
//     setIsFirstModalVisible(false);
//     setIsSecondModalVisible(true);
//     // setTempSessionName('');
//   };

//   const confirmSessionName = () => {
//     setIsSecondModalVisible(false);
//     setSessionName(sessionName);
//     createSessionFolder();
//   };

//   const showFirstModal = () => {
//     setIsFirstModalVisible(true);
//   };

//   const closeFirstModal = () => {
//     setIsFirstModalVisible(false);
//   };

//   const closeSecondModal = () => {
//     setIsSecondModalVisible(false);
//   };

//   useEffect(() => {
//     showFirstModal();
//   }, []);

//   const startCapture = () => {
//     setIsCapturing(true);
//     setImages([]);
//     captureFrame();
//     const interval = setInterval(captureFrame, 1000);
//     setCaptureInterval(interval);
//     return () => {
//       clearInterval(interval);
//       setIsCapturing(false);
//     };
//   };

//   const stopCapture = () => {
//     setIsCapturing(false);
//     clearInterval(captureInterval);
//     setCaptureInterval(null);
//     setSessionFolder('');
//   };

//   const captureFrame = async () => {
//     if (camera.current && sessionFolder) {
//       try {
//         const data = await camera.current.takePhoto({
//           skipProcessing: false,
//         });

//         const imagePath = `${sessionFolder}/${Date.now()}.jpg`;
//         await RNFS.moveFile(data.path, imagePath);
//         await CameraRoll.save(imagePath, { type: 'photo', album: 'mygallery' });
//         console.log(imagePath);
//         setImages((prevImages) => [...prevImages, imagePath]);
//       } catch (error) {
//         console.log('Camera capture error:', error);
//       }
//     }
//   };

//   if (device == null) return <ActivityIndicator />;

//   return (
//     <View style={{ flex: 1 }}>
//       <Modal visible={issecondModalVisible} animationType="slide" transparent={true}>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalText}>Enter a name for the session:</Text>
//             <TextInput
//               style={styles.modalInput}
//               value={sessionName}
//               onChangeText={setSessionName}
//               autoFocus={true}
//             />
//             <TouchableOpacity onPress={confirmSessionName} style={[styles.modalButton,{backgroundColor:"lightgreen"}]}>
//               <Text style={styles.modalButtonText}>Confirm</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={closeSecondModal}  style={[styles.modalButton,{backgroundColor:"red"}]}>
//               <Text style={styles.modalButtonText}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       <Modal visible={isfirstModalVisible} animationType="slide" transparent={true}>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//           <TouchableOpacity onPress={showSecondModel} style={[styles.modalButton,{backgroundColor:"lightgreen"}]}>
//               <Text style={styles.modalButtonText}>New Project</Text>
//             </TouchableOpacity>
//             <Text style={styles.modalText}>Do You Want To Work On Existing Projects?</Text>
//             <TouchableOpacity 
//             // onPress={closeSecondModal} 
//             style={styles.modalButton}>
//               <Text style={styles.modalButtonText}>Old Projects</Text>
//             </TouchableOpacity>
//             <TouchableOpacity 
//             onPress={closeFirstModal} 
//             style={[styles.modalButton,{backgroundColor:"red"}]}
//             >
//               <Text style={styles.modalButtonText}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

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
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     // padding:15,
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



// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import { View, TouchableOpacity, Text, ActivityIndicator, Image, StyleSheet, ScrollView, Modal, TextInput } from 'react-native';
// import { Camera, useCameraDevices } from 'react-native-vision-camera';
// import RNFS from 'react-native-fs';
// import { CameraRoll } from "@react-native-camera-roll/camera-roll";

// export default function AppCamera() {
//   const [images, setImages] = useState([]);
//   const [isCapturing, setIsCapturing] = useState(false);
//   const [captureInterval, setCaptureInterval] = useState(null);
//   const [sessionFolder, setSessionFolder] = useState(null);
//   const [isModalVisible, setIsModalVisible] = useState(false); // Updated
//   const [sessionName, setSessionName] = useState('');
//   const [tempSessionName, setTempSessionName] = useState('');
//   const camera = useRef(null);
//   const devices = useCameraDevices();
//   const device = devices.back;
//   const interval = useRef(null);

//   const createSessionFolder = useCallback(async () => {
//     const folderPath = RNFS.ExternalDirectoryPath + '/capturedImages';
//     if (sessionName) {
//       const sessionFolder = `${folderPath}/${sessionName}`;
//       const folderExists = await RNFS.exists(sessionFolder);
//     if (folderExists) {
//       // Append a specific identifier to the session name
//       const currentDate = new Date();
//       const identifier = `${currentDate.getFullYear()}${currentDate.getMonth() + 1}${currentDate.getDate()}`;
//       const newSessionName = `${sessionName}_${identifier}`;
//       const newSessionFolder = `${folderPath}/${newSessionName}`;
//       await RNFS.mkdir(newSessionFolder, { intermediates: true });
//       setSessionFolder(newSessionFolder);
//     } else {
//       await RNFS.mkdir(sessionFolder, { intermediates: true });
//       setSessionFolder(sessionFolder);
//     }
//       // await RNFS.mkdir(sessionFolder, { intermediates: true });
//       // setSessionFolder(sessionFolder);
//     }
//   }, [sessionName]);

//   const showSessionNamePrompt = () => {
//     setIsModalVisible(true);
//     // setTempSessionName('');
//   };

//   const confirmSessionName = () => {
//     setIsModalVisible(false);
//     setSessionName(sessionName);
//     createSessionFolder();
//   };

//   useEffect(() => {
//     showSessionNamePrompt();
//   }, []);

//   const startCapture = () => {
//     setIsCapturing(true);
//     setImages([]);
//     captureFrame();
//     const interval = setInterval(captureFrame, 1000);
//     setCaptureInterval(interval);
//     return () => {
//       clearInterval(interval);
//       setIsCapturing(false);
//     };
//   };

//   const stopCapture = () => {
//     setIsCapturing(false);
//     clearInterval(captureInterval);
//     setCaptureInterval(null);
//     setSessionFolder('');
//   };

//   const captureFrame = async () => {
//     if (camera.current && sessionFolder) {
//       try {
//         const data = await camera.current.takePhoto({
//           skipProcessing: false,
//         });

//         const imagePath = `${sessionFolder}/${Date.now()}.jpg`;
//         await RNFS.moveFile(data.path, imagePath);
//         await CameraRoll.save(imagePath, { type: 'photo', album: 'mygallery' });
//         console.log(imagePath);
//         setImages((prevImages) => [...prevImages, imagePath]);
//       } catch (error) {
//         console.log('Camera capture error:', error);
//       }
//     }
//   };

//   if (device == null) return <ActivityIndicator />;

//   return (
//     <View style={{ flex: 1 }}>
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
//             <TouchableOpacity onPress={confirmSessionName} style={styles.modalButton}>
//               <Text style={styles.modalButtonText}>Confirm</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
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
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 5,
//   },
//   modalText: {
//     fontSize: 16,
//     marginBottom: 10,
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
//   },
//   modalButtonText: {
//     fontSize: 16,
//     color: 'white',
//   },
// });


    
   
// import React, { useState, useRef } from 'react';
// import { View, TouchableOpacity, Text, ActivityIndicator ,Image ,StyleSheet} from 'react-native';
// import { Camera ,useCameraDevices } from 'react-native-vision-camera';
// import RNFS from 'react-native-fs';
// import { CameraRoll } from "@react-native-camera-roll/camera-roll";

// export default function AppCamera () {
//   const [showCamera, setShowCamera] = useState(true);
//   const [imageSource, setImageSource] = useState('');

//   const camera = useRef(null)
//   // const cameraRef = useRef(null);
//   const devices = useCameraDevices()
//   const device = devices.back

//   const showFeedOnScreen = async () => {
//     if (!camera) return;
//     const image = await camera.current.takePhoto();
//      //   setImages(prevImages => [...prevImages, photo]);
//     console.log(image.path)
//     const filePath = image.path
//     setImageSource(filePath)
//     setShowCamera(false)
//   }
//   const takePhoto = async (filePath) => {
//     try{
//     console.log(filePath)
//     const savePath = `${RNFS.ExternalDirectoryPath}/Pictures/${Date.now()}.jpg`;
//     console.log(savePath)
//     if (!(await RNFS.exists(`${RNFS.ExternalDirectoryPath}/Pictures`))) {
//       await RNFS.mkdir(`${RNFS.ExternalDirectoryPath}/Pictures`);
//     }    
//     await RNFS.moveFile(filePath , savePath)
//     await CameraRoll.save(savePath, "photo")
//     .then(()=>{
//       setShowCamera(true)
//       console.log('Image Moved',filePath ,'to',savePath)
//     })
//     .catch(error=>{
//       console.log(error)
//     })
//   }
//   catch(error){
//       console.log(error)
//   } 
//   };
//   if (device == null) return <ActivityIndicator />
//   return (
//     <View style={{ flex: 1 }}>
//       {showCamera ? (
//       <>
//       <Camera 
//       ref={camera} 
//       style={{flex:1}}
//       device={device}
//       isActive={showCamera}
//       autoFocus="on"
//       photo = {true}
//       />
//       <View style ={styles.buttonContainer}>
//       <TouchableOpacity onPress={showFeedOnScreen} style={{position:'absolute', borderWidth:4,borderColor:'white', bottom: 50, alignSelf: 'center',backgroundColor:'#FF0037', width:60, height:60, borderRadius:30  }}>
//       </TouchableOpacity>
//       </View>
//       </>
//       ) :(
//         <>
//         { imageSource !== '' ? (
//           <Image 
//           style ={styles.image}
//           source={{uri : `file://'${imageSource}`}}
//           />
//         ):null}
//         <View  style ={styles.backButton}>
//         <TouchableOpacity 
//         style ={{
//           backgroundColor: 'rgba(0,0,0,0.2)',
//           padding:10,
//           justifyContent:'center',
//           alignItems:'center',
//           borderRadius:10,
//           borderWidth:2,
//           borderColor:'#fff',
//           width:100
//         }}
//         onPress={()=>setShowCamera(true)}>
//           <Text style = {{color:'white',fontWeight:'500'}}>Back</Text>
//         </TouchableOpacity>
//         </View>
//         <View style ={styles.buttonContainer}>
//           <View style ={styles.buttons}>
//           <TouchableOpacity 
//         style ={{
//           backgroundColor: 'rgba(0,0,0,0.2)',
//           padding:10,
//           justifyContent:'center',
//           alignItems:'center',
//           borderRadius:10,
//           borderWidth:2,
//           borderColor:'#FF0037',
//           width:100
//         }}
//         onPress={()=>setShowCamera(true)}>
//           <Text style = {{color:'white',fontWeight:'500'}}>Retake</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//         style ={{
//           backgroundColor: 'rgba(0,0,0,0.2)',
//           padding:10,
//           justifyContent:'center',
//           alignItems:'center',
//           borderRadius:10,
//           borderWidth:2,
//           borderColor:'#FF0037',
//           width:100
//         }}
//         onPress={()=>takePhoto(imageSource)}>
//           <Text style = {{color:'white',fontWeight:'500'}}>Save Photo</Text>
//         </TouchableOpacity>
//           </View>
//         </View>
//         </>
      
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container:{
//     flex:1,
//     justifyContent:'center',
//     alignItems:'center'
//   },
//   button:{
//     backgroundColor:'grey'
//   },
//   backButton:{
//     position:'absolute',
//     justifyContent:'center',
//     width:'100%',
//     top:0,
//     padding:20,
//     backgroundColor:'rbga(0,0,0.0)'
//   },
//   buttonContainer:{
//     backgroundColor: 'rgba(0,0,0.2)',
//     justifyContent:'center',
//     alignItems:'center',
//     position:'absolute',
//     width:'100%',
//     bottom:0,
//     padding:20,
//   },
//   buttons:{
//     flexDirection:'row',
//     justifyContent:'space-between',
//     width:'100%'
//   },
//   image:{
//     width:'100%',
//     height:'100%',
//     aspectRatio:9/16
//   }

// })


// import React, { useState, useRef } from 'react';
// import { View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
// import { Camera ,useCameraDevices } from 'react-native-vision-camera';
// import RNFS from 'react-native-fs';
// import { CameraRoll } from "@react-native-camera-roll/camera-roll";

// export default function AppCamera () {
//   // const [camera, setCamera] = useState(null);
//   const camera = useRef(null)
//   // const cameraRef = useRef(null);
//   const devices = useCameraDevices()
//   const device = devices.back
//   const takePhoto = async () => {
//     try{
//     if (!camera) return;
//     const image = await camera.current.takePhoto();
//     console.log(image.path)
//     const filePath = image.path
//     const savePath = `${RNFS.ExternalDirectoryPath}/Pictures/${Date.now()}.jpg`;
//     console.log(savePath)
//     if (!(await RNFS.exists(`${RNFS.ExternalDirectoryPath}/Pictures`))) {
//       await RNFS.mkdir(`${RNFS.ExternalDirectoryPath}/Pictures`);
//     }    
//     await RNFS.moveFile(filePath , savePath)
//     await CameraRoll.save(savePath, "photo")
//     .then(()=>{
//       console.log('Image Moved',filePath ,'to',savePath)
//     })
//     .catch(error=>{
//       console.log(error)
//     })
//   }
//   catch(error){
//       console.log(error)
//   } 
//   };
//   if (device == null) return <ActivityIndicator />
//   return (
//     <View style={{ flex: 1 }}>
//       <Camera 
//       ref={camera} 
//       style={{ flex: 1 }}
//       device={device}
//       isActive={true}
//       autoFocus="on"
//       photo = {true}
//       />
//       <TouchableOpacity onPress={takePhoto} style={{ position: 'absolute', bottom: 50, alignSelf: 'center',backgroundColor:'#FF0037', width:60, height:60, borderRadius:30  }}>
//       </TouchableOpacity>
//     </View>
//   );
// };


// import React, { useRef } from 'react';
// import { View } from 'react-native';
// import { Camera, useCameraDevices } from 'react-native-vision-camera';

// const AppCamera = () => {
//   const cameraRef = useRef();
//   const { devices } = useCameraDevices();

//   const startPanorama = async () => {
//     if (devices.length > 0) {
//       const camera = devices[0];
//       if (cameraRef.current) {
//         await cameraRef.current.startPanorama({
//           camera: camera.id,
//           maxPhotos: 5, // Set the number of photos to capture for the panorama
//         });
//       }
//     }
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       <Camera
//         ref={cameraRef}
//         style={{ flex: 1 }}
//         device={devices.length > 0 ? devices[0] : undefined}
//       />
//       <Button title="Start Panorama" onPress={startPanorama} />
//     </View>
//   );
// };

// export default AppCamera;
