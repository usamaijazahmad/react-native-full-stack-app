import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "../../constants";
import Empty from "@/components/Empty";
import { getUserPosts, signOut } from "@/lib/appwrite";
import VideoCard from "@/components/VideoCard";
import { useGlobalContext } from "@/context/GlobalProvider";
import InfoBox from "@/components/InfoBox";
import { router } from "expo-router";
import { useEffect, useState } from "react";

const HeaderComponent = ({ posts }: any) => {
  const { user, setUser, setIsLogged } = useGlobalContext();

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);
    router.replace("/sign-in");
  };

  return (
    <View className="w-full mt-6 mb-12 px-4 items-center justify-center">
      <TouchableOpacity className="mb-10 w-full items-end" onPress={logout}>
        <Image
          source={icons.logout}
          resizeMode="contain"
          style={{ width: 25, height: 25 }}
        />
      </TouchableOpacity>
      <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
        <Image
          source={{ uri: user?.avatar }}
          className="w-[90%]  h-[90%] rounded-lg "
          resizeMode="cover"
        />
      </View>
      <InfoBox
        title={user?.username}
        containerStyles="mt-5"
        titleStyles="text-lg"
      />
      <View className="mt-5 flex-row">
        <InfoBox
          title={posts?.length || 0}
          subtitle="Posts"
          containerStyles="mr-10"
          titleStyles="text-xl"
        />{" "}
        <InfoBox title={"1.2k"} subtitle="Followers" titleStyles="text-xl" />
      </View>
    </View>
  );
};

const Profile = () => {
  const { user } = useGlobalContext();
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!user?.$id) return;
      const userPosts = await getUserPosts(user.$id);
      setPosts(userPosts || []);
    };

    fetchPosts();
  }, [user]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => <HeaderComponent posts={posts} />}
        ListEmptyComponent={() => (
          <Empty
            title="No videos found"
            subtitle="No videos found for this search query"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Profile;
