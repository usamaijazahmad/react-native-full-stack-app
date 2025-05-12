import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "@/components/SearchInput";
import Empty from "@/components/Empty";
import { useEffect } from "react";
import { searchPosts, searchUserLikedPosts } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import VideoCard from "@/components/VideoCard";
import { useLocalSearchParams } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";

const HeaderComponent = () => {
  const { query, fromBookmarks } = useLocalSearchParams();
  const isBookmarkSearch = fromBookmarks === "true";
  return (
    <View className="my-6  px-4">
      <Text className="font-pmedium text-sm text-gray-100">Search Results</Text>
      <Text className="font-pmedium text-2xl text-white">{query}</Text>
      <View className="mt-6 mb-8">
        <SearchInput initialQuery={query} fromBookmarks={isBookmarkSearch} />
      </View>
    </View>
  );
};

const Search = () => {
  const { query, fromBookmarks } = useLocalSearchParams();
  const { user } = useGlobalContext();

  const isBookmarkSearch = fromBookmarks === "true";

  const { data: posts, reftechData } = useAppwrite(() =>
    isBookmarkSearch
      ? searchUserLikedPosts(query, user?.$id)
      : searchPosts(query)
  );

  useEffect(() => {
    reftechData();
  }, [query, fromBookmarks]);

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
            subtitle="No videos found for this search query"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
