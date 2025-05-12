import { Image, Text, View } from "react-native";
import { images } from "../constants";
import CustomButton from "./CustomButton";
import { router } from "expo-router";

interface EmptyProps {
  title: string;
  subtitle: string;
}

const Empty: React.FC<EmptyProps> = ({ title, subtitle }) => {
  return (
    <View className="justify-center items-center px-4">
      <Image
        source={images.empty}
        resizeMode="contain"
        style={{ width: 270, height: 215 }}
      />
      <Text className="font-psemibold text-center text-lg text-white mt-2">
        {title}
      </Text>
      <Text className="font-pmedium text-sm text-gray-100">{subtitle}</Text>

      <CustomButton
        title="Create a video"
        handlePress={() => {
          router.push("/create");
        }}
        containerStyles="w-full my-5"
      />
    </View>
  );
};

export default Empty;
