import { FlatList, Image, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import SearchInput from "@/components/SearchInput";
import Trending from "@/components/Trending";
import Empty from "@/components/Empty";
import { useCallback, useState } from "react";
import { getAllPosts, getLatestPosts } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import VideoCard from "@/components/VideoCard";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useFocusEffect } from "@react-navigation/native";

const HeaderComponent = () => {
  const { data: latestPosts } = useAppwrite(getLatestPosts);
  const { user } = useGlobalContext();
  return (
    <View className="my-6 space-y-6 px-4">
      <View className="flex-row items-start justify-between ">
        <View>
          <Text className="font-pmedium text-sm text-gray-100">
            Welcome Back,
          </Text>
          <Text className="font-pmedium text-2xl text-white">
            {user?.username}
          </Text>
        </View>

        <View className="mt-1.5">
          <Image
            style={{ width: 30, height: 40 }}
            resizeMode="contain"
            source={images.logoSmall}
          />
        </View>
      </View>
      <SearchInput placeholder="Search for a video topic" />

      <View className="w-full flex-1 pt-5 pb-8">
        <Text className="text-lg text-gray-100 font-pregular mb-3">
          Latest Videos
        </Text>

        <Trending posts={latestPosts ?? []} />
      </View>
    </View>
  );
};

const Home = () => {
  const [refreshing, setRefreshing] = useState(false);

  const { data: posts, reftechData } = useAppwrite(getAllPosts);

  useFocusEffect(
    useCallback(() => {
      onRefresh();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await reftechData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={HeaderComponent}
        ListEmptyComponent={() => (
          <Empty
            title="No videos found"
            subtitle="Be the first one to upload a video"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;
