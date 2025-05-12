import { useState } from "react";
import { TextInput, TouchableOpacity, View, Image, Alert } from "react-native";
import { icons } from "../constants";
import { router, usePathname } from "expo-router";

interface SearchInputProps {
  initialQuery?: any;
  placeholder?: string;
  fromBookmarks?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
  initialQuery,
  placeholder,
  fromBookmarks = false,
}) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || "");

  const handleSearch = () => {
    if (!query) {
      return Alert.alert(
        "Missing query",
        "Please input something to search across the database"
      );
    }

    const encodedQuery = encodeURIComponent(query);

    if (pathname.startsWith("/search")) {
      router.setParams({
        query: encodedQuery,
        fromBookmarks: fromBookmarks.toString(),
      });
    } else {
      const searchUrl = fromBookmarks
        ? `/search/${encodedQuery}?fromBookmarks=true`
        : `/search/${encodedQuery}`;

      router.push(searchUrl);
    }
  };

  return (
    <View className="border-2 border-black-200 w-full h-14 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row space-x-4">
      <TextInput
        style={{ flex: 1, width: "100%", height: "100%" }}
        className="text-base mt-0.5 text-white flex-1 font-pregular rounded-2xl px-4"
        value={query}
        onChangeText={setQuery}
        placeholder={placeholder}
        placeholderTextColor="#CDCDE0"
      />

      <TouchableOpacity
        style={{ position: "absolute", right: 10 }}
        onPress={handleSearch}
      >
        <Image
          source={icons.search}
          style={{
            width: 20,
            height: 20,
          }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
