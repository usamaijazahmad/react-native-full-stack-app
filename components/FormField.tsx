import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, Image } from "react-native";
import { icons } from "../constants";

interface FormFieldProps {
  title: string;
  value: string;
  handleChangeText: (e: any) => void;
  otherStyles?: string;
  keyboardType?: string;
  placeholder?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  title,
  value,
  handleChangeText,
  otherStyles,
  keyboardType,
  placeholder,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
      <View className=" border-2 border-black-200 w-full h-16  bg-black-100 rounded-2xl focus:border-secondary items-center flex-row">
        <TextInput
          style={{ flex: 1, width: "100%", height: "100%" }}
          className="flex-1 text-white font-psemibold text-base text-center rounded-2xl"
          value={value}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor={"#7b7b8b"}
          secureTextEntry={title === "Password" && !showPassword}
        />

        {title === "Password" && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{ position: "absolute", right: 10 }}
          >
            <Image
              source={showPassword ? icons.eye : icons.eyeHide}
              style={{
                width: 35,
                height: 35,
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
