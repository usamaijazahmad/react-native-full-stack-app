import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "@/components/SearchInput";
import Empty from "@/components/Empty";
import { useCallback, useEffect, useState } from "react";
import { getUserLikedPosts, searchPosts } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import VideoCard from "@/components/VideoCard";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useFocusEffect } from "@react-navigation/native";

const HeaderComponent = () => {
  return (
    <View className="my-6  px-4">
      <Text className="font-pmedium text-2xl text-white">Saved Videos</Text>

      <View className="mt-6 mb-8">
        <SearchInput placeholder="Search your saved videos" fromBookmarks />
      </View>
    </View>
  );
};

const Bookmarks = () => {
  const { user } = useGlobalContext();
  const [posts, setPosts] = useState<any[]>([]);

  const handleDislike = (id: string) => {
    setPosts((prev) => prev.filter((post) => post.$id !== id));
  };

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  useEffect(() => {
    fetchPosts();
  }, [user]);

  const fetchPosts = async () => {
    if (!user?.$id) return;
    const userLikedPosts = await getUserLikedPosts(user.$id);
    setPosts(userLikedPosts || []);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard video={item} onDislike={() => handleDislike(item.$id)} />
        )}
        ListHeaderComponent={HeaderComponent}
        ListEmptyComponent={() => (
          <Empty title="No videos found" subtitle="No saved videos found" />
        )}
      />
    </SafeAreaView>
  );
};

export default Bookmarks;
