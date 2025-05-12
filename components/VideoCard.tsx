import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import { icons } from "../constants";
import { useEffect, useState } from "react";
import { ResizeMode, Video } from "expo-av";
import { useGlobalContext } from "@/context/GlobalProvider";
import AntDesign from "@expo/vector-icons/AntDesign";
import { toggleLikePost } from "@/lib/appwrite";

interface VideoCardProps {
  video: any;
  onDislike?: (id: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({
  video: {
    $id,
    title,
    thumbnail,
    video,
    creator: { username, avatar },
    likes,
  },
  onDislike,
}) => {
  const [localLikes, setLocalLikes] = useState(likes);

  const [play, setPlay] = useState(false);
  const { user } = useGlobalContext();

  useEffect(() => {
    setLocalLikes(likes);
  }, [likes, user?.$id]);
  const checkUserLiked = () =>
    localLikes.some((like: any) => like.$id === user?.$id);

  const handleLike = async () => {
    if (onDislike) {
      onDislike(video.$id);
    }

    const hasLiked = checkUserLiked();
    setLocalLikes((prev: any) =>
      hasLiked
        ? prev.filter((like: any) => like.$id !== user?.$id)
        : [...prev, { $id: user?.$id }]
    );

    await toggleLikePost($id, user?.$id);
  };

  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start justify-between w-full">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary items-center justify-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full  h-full rounded-lg "
              resizeMode="cover"
            />
          </View>
          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="text-white font-psemibold text-sm"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {username}
            </Text>
          </View>
        </View>
        <Pressable onPress={handleLike}>
          <View className="pt-2 flex-row gap-1 items-center">
            {/* <Image
            source={icons.menu}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          /> */}

            {checkUserLiked() ? (
              <AntDesign name="heart" size={25} color="#FF9C01" />
            ) : (
              <AntDesign name="hearto" size={25} color="#FF9C01" />
            )}
            <Text className="text-sm font-psemibold text-gray-100">
              {localLikes.length}
            </Text>
          </View>
        </Pressable>
      </View>
      {play ? (
        <Video
          source={{ uri: video }}
          style={{
            width: "100%",
            height: 240,
            borderRadius: 12,
            marginTop: 12,
          }}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status && status?.isLoaded && status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          className="w-full h-60 rounded-xl justify-center items-center relative mt-3"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="absolute"
            style={{ width: 50, height: 50 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
