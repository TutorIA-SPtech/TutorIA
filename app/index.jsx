import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function IntroductionScreen(){

    return (
        <View style={styles.container}>
            <Text>TutorIA</Text>
            <Text>A trilha que se ajusta ao que você já sabe</Text>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})