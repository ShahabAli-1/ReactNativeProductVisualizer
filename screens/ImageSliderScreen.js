import React from "react";
import { View, Dimensions, Text, Image } from "react-native";
import Image360Viewer from "@hauvo/react-native-360-image-viewer";
import _ from "lodash";

//const { width, height } = Dimensions.get("window");
//const width = 100;
//const height = 100;

const ImageSliderScreen = ({ route }) => {
  const { images } = route.params;

  if (!images || images.length === 0) {
    return (
      <View>
        <Text>No images found.</Text>
      </View>
    );
  }

  const reversedImages = _.reverse([...images]); // Reverse the array of images

  const imageUris = reversedImages.map((imageUrl, index) => {
    if (typeof imageUrl !== "string") {
      console.log("Invalid image URL:", imageUrl);
      return null; // Skip rendering if the URL is invalid
    }

    console.log("Image URL:", imageUrl);
    return { uri: `file://${imageUrl}` };
  });

  return (
    <View style={{ flex: 1 }}>
      {imageUris.map((imageUri, index) => (
        <Image360Viewer
          key={index}
          srcset={[imageUri]}
          width={100}
          height={100}
        />
      ))}
    </View>
  );
};

export default ImageSliderScreen;

// import React from "react";
// import { View, Dimensions, Text } from "react-native";
// import Image360Viewer from "@hauvo/react-native-360-image-viewer";

// const { width, height } = Dimensions.get("window");

// const ImageSliderScreen = ({ route }) => {
//   const { images } = route.params;

//   if (!images || images.length === 0) {
//     return (
//       <View>
//         <Text>No images found.</Text>
//       </View>
//     );
//   }

//   const reversedImages = [...images].reverse(); // Reverse the array of images

//   return (
//     <View style={{ flex: 1 }}>
//       {reversedImages.map((imageUrl, index) => {
//         if (typeof imageUrl !== "string") {
//           console.log("Invalid image URL:", imageUrl);
//           return null; // Skip rendering if the URL is invalid
//         }

//         console.log("Image URL:", imageUrl);

//         return (
//           <Image360Viewer
//             key={index}
//             imageUri={{
//               uri: `file://${imageUrl}`,
//             }}
//             width={width}
//             height={height}
//           />
//         );
//       })}
//     </View>
//   );
// };

// export default ImageSliderScreen;

// // import React from "react";
// // import { View, Dimensions, Text, Image } from "react-native";
// // import Image360Viewer from "@hauvo/react-native-360-image-viewer";
// // import _ from "lodash";

// // const { width, height } = Dimensions.get("window");

// // const ImageSliderScreen = ({ route }) => {
// //   const { images } = route.params;

// //   if (!images || images.length === 0) {
// //     return (
// //       <View>
// //         <Text>No images found.</Text>
// //       </View>
// //     );
// //   }

// //   const reversedImages = _.reverse([...images]); // Reverse the array of images

// //   return (
// //     <View style={{ flex: 1 }}>
// //       {reversedImages.map((imageUrl, index) => {
// //         if (typeof imageUrl !== "string") {
// //           console.log("Invalid image URL:", imageUrl);
// //           return null; // Skip rendering if the URL is invalid
// //         }

// //         console.log("Image URL:", imageUrl);

// //         return (
// //           <Image360Viewer
// //             key={index}
// //             srcset={{ uri: `file://${imageUrl}` }}
// //             width={width}
// //             height={height}
// //             index={index} // Store the index as a prop
// //           />
// //         );
// //       })}
// //     </View>
// //   );
// // };

// // export default ImageSliderScreen;

// // // import React from "react";
// // // import { View, StyleSheet, Image, TouchableOpacity, Text } from "react-native";
// // // import _ from "lodash";
// // // import { Dimensions } from "react-native";

// // // import Image360Viewer from "@hauvo/react-native-360-image-viewer";
// // // //{ route }
// // // export default function ImageSliderScreen({ route }) {
// // //   const { images } = route.params;
// // //   const viewPagerRef = React.useRef(null);
// // //   const imagesArray = [...images, route.params.image];
// // //   const width = 200;
// // //   const height = 300;
// // //   console.log(imagesArray);
// // //   return (
// // //     <View>
// // //       <View style={{ flex: 1 }}>
// // //         <Image360Viewer srcset={images} width={width} height={height} />
// // //       </View>
// // //     </View>
// // //   );
// // // }
// // // //const { images } = route.params;
// // // //const viewPagerRef = React.useRef(null);
// // // // const images = _.reverse([
// // // //   require("./Images/one.jpg"),
// // // //   require("./Images/two.jpg"),
// // // //   require("./Images/three.jpg"),
// // // //   require("./Images/four.jpg"),
// // // //   require("./Images/five.jpg"),
// // // //   // Add the rest of your image paths here
// // // // ]);

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: "#fff",
// // //   },
// // //   viewPager: {
// // //     flex: 1,
// // //   },
// // //   slide: {
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //   },
// // //   image: {
// // //     width: "100%",
// // //     height: "100%",
// // //     resizeMode: "contain",
// // //   },
// // //   buttonContainer: {
// // //     flexDirection: "row",
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     marginTop: 10,
// // //   },
// // //   button: {
// // //     width: 10,
// // //     height: 10,
// // //     borderRadius: 5,
// // //     backgroundColor: "rgba(0, 0, 0, 0.3)",
// // //     marginHorizontal: 5,
// // //   },
// // //   buttonSelected: {
// // //     backgroundColor: "rgba(0, 0, 0, 0.8)",
// // //   },
// // // });

// // // {
// // //   /* <View style={styles.container}>
// // // <PagerView
// // //   ref={viewPagerRef}
// // //   style={styles.viewPager}
// // //   initialPage={0}
// // //   onPageSelected={(event) => {
// // //     const selectedIndex = event.nativeEvent.position;
// // //     // You can perform additional actions when the page changes
// // //   }}
// // // >
// // //   {images.map((item, index) => (
// // //     <View key={index} style={styles.slide}>
// // //       <Image source={{ uri: `file://${item}` }} style={styles.image} />
// // //     </View>
// // //   ))}
// // // </PagerView>

// // // <View style={styles.buttonContainer}>
// // //   {images.map((_, index) => (
// // //     <TouchableOpacity
// // //       key={index}
// // //       style={[
// // //         styles.button,
// // //         viewPagerRef.current?.getCurrentPage() === index &&
// // //           styles.buttonSelected,
// // //       ]}
// // //       onPress={() => viewPagerRef.current?.setPage(index)}
// // //     />
// // //   ))}
// // // </View>
// // // </View> */
// // // }
