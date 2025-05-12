import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import CustomButton from "@/components/CustomButton";
import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";

export default function App() {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href={"/home"} />;

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full justify-center items-center min-h-[85vh] px-4">
          <Image
            source={images.logo}
            style={{ width: 130, height: 84 }}
            resizeMode="contain"
          />
          <Image
            source={images.cards}
            style={{ width: 380, height: 300, maxWidth: 380 }}
            resizeMode="contain"
          />

          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Discover Endless Possibilities with{" "}
              <Text className="text-secondary-200">Aora</Text>
            </Text>

            <Image
              source={images.path}
              className="absolute -bottom-2 -right-2"
              style={{
                width: 136,
                height: 15,
              }}
              resizeMode="contain"
            />
          </View>

          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
            Where creativity meets innovation: embark on a journey of limitless
            exploration with Aora
          </Text>

          <CustomButton
            title="Continue with Email"
            handlePress={() => {
              router.push("/sign-in");
            }}
            containerStyles="w-full mt-7 "
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}
