import { Text, View } from "react-native";

interface InfoBoxProps {
  title?: any;
  subtitle?: string;
  titleStyles?: string;
  containerStyles?: string;
}

const InfoBox: React.FC<InfoBoxProps> = ({
  title,
  titleStyles,
  containerStyles,
  subtitle,
}) => {
  return (
    <View className={containerStyles}>
      <Text className={`text-white text-center font-psemibold ${titleStyles}`}>
        {title}
      </Text>
      <Text className="font-pregular text-sm text-center text-gray-100">
        {subtitle}
      </Text>
    </View>
  );
};

export default InfoBox;
