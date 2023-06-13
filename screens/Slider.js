import React from "react";
import _ from "lodash";
import { View, Dimensions } from "react-native";

import Image360Viewer from "@hauvo/react-native-360-image-viewer";

// const { width, height } = Dimensions.get("window");
const width = 200;
const height = 300;
const images = _.reverse([
  require("./Images/one.jpg"),
  require("./Images/two.jpg"),
  require("./Images/three.jpg"),
  require("./Images/four.jpg"),
  require("./Images/five.jpg"),
  // Add the rest of your image paths here
]);
console.log(images);
const Slider_ = () => {
  return (
    <View style={{ flex: 1 }}>
      <Image360Viewer srcset={images} width={width} height={height} />
    </View>
  );
};

export default Slider_;
