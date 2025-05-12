import FormField from "@/components/FormField";
import { ResizeMode, Video } from "expo-av";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "../../constants";
import CustomButton from "@/components/CustomButton";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { createVideoPost } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";

const Create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploaing] = useState(false);
  const [form, setForm] = useState<any>({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  });

  const submit = async () => {
    if (!form.title || !form.video || !form.thumbnail || !form.prompt) {
      Alert.alert("Please fill all fields");
      return;
    }
    setUploaing(true);
    try {
      console.log({ ...form, userId: user.$id });
      await createVideoPost({ ...form, userId: user.$id });

      Alert.alert("Success", "Post uploaded successfully");
      router.push("/home");
    } catch (ex) {
      console.log(ex);
    } finally {
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
      });
      setUploaing(false);
    }
  };

  const openPicker = async (selectType: any) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        selectType === "image"
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (selectType === "image")
        setForm({ ...form, thumbnail: result.assets[0] });
      if (selectType === "video") setForm({ ...form, video: result.assets[0] });
    }
    //  else {
    //   setTimeout(() => {
    //     Alert.alert("Document picked", JSON.stringify(result, null, 2));
    //   }, 100);
    // }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">Upload Video</Text>
        <FormField
          title="Video Title"
          value={form.title}
          placeholder="Give your video a catchy title..."
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-10"
        />
        <View className="mt-7 spac-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Video
          </Text>
          <TouchableOpacity
            onPress={() => {
              openPicker("video");
            }}
          >
            {form.video ? (
              <Video
                source={{ uri: form.video.uri }}
                style={{ width: "100%", height: 200 }}
                resizeMode={ResizeMode.COVER}
              />
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
                <View className="w-14 h-14 border border-secondary-100 justify-center items-center">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    style={{ width: "50%", height: "50%" }}
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Thumbnail Image
          </Text>
          <TouchableOpacity
            onPress={() => {
              openPicker("image");
            }}
          >
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                resizeMode="cover"
                className="rounded-2xl"
                style={{ width: "100%", height: 200 }}
              />
            ) : (
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  style={{ width: 20, height: 20 }}
                />
                <Text className="text-sm text-gray-100 font-pmedium">
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <FormField
          title="AI Prompt"
          value={form.prompt}
          placeholder="The prompt you used to create this video"
          handleChangeText={(e) => setForm({ ...form, prompt: e })}
          otherStyles="mt-7"
        />
        <CustomButton
          title="Submit & Publish"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
