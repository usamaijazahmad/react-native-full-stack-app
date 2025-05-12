import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { icons } from "../constants";
import { Video, ResizeMode } from "expo-av";

interface TrendingProps {
  posts: any;
}

interface TrendingItemProps {
  activeItem: any;
  item: any;
}

const zoomIn = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1,
  },
};

const zoomOut = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.9,
  },
};

const TrendingItem: React.FC<TrendingItemProps> = ({ activeItem, item }) => {
  const [play, setPlay] = useState(false);

  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {play ? (
        <Video
          source={{ uri: item.video }}
          style={{
            width: 190,
            height: "100%",
            borderRadius: 35,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            marginTop: 12,
          }}
          resizeMode={ResizeMode.COVER}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status && status.isLoaded && status?.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          className="justify-center items-center relative"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            style={{ width: 190, height: 270 }}
            className="rounded-[35px] my-5 overflow-hidden shadow-lg shado-black/40"
          />
          <Image
            source={icons.play}
            className="absolute"
            style={{ width: 50, height: 50 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

const Trending: React.FC<TrendingProps> = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    if (posts.length > 0) {
      setActiveItem(posts[0]);
    }
  }, [posts]);

  const viewableItemChange = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].item.$id);
    }
  }).current;

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemChange}
      viewabilityConfig={{ viewAreaCoveragePercentThreshold: 70 }}
      contentOffset={{ x: 170 }}
      horizontal
    />
  );
};

export default Trending;
