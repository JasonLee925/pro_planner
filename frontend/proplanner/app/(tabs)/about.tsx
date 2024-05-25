import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Image, Platform } from "react-native";
import { GlobalLayout } from "../../components/Layout";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function TabThreeScreen() {
  return (
    <GlobalLayout >

    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Image
          source={require("@/assets/images/about.png")}
          style={styles.headImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">About</ThemedText>
      </ThemedView>
      <ThemedText>
        This app adopts the Eisenhower Matrix to help you plan your life.
      </ThemedText>
      <Collapsible title="What is the Eisenhower Matrix?">
        <ThemedText>
          The Eisenhower Matrix is a way to organize tasks by urgency and
          importance, so you can effectively prioritize your most important
          work.
        </ThemedText>
        <ExternalLink href="https://asana.com/resources/eisenhower-matrix">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="How it works?" defaultOpen={true}>
        <ThemedText>
          This tool helps you divide your tasks into four categories: the tasks
          you’ll <ThemedText type="defaultSemiBold">do first</ThemedText>, the
          tasks you’ll{" "}
          <ThemedText type="defaultSemiBold">schedule for later</ThemedText>,
          the tasks you’ll{" "}
          <ThemedText type="defaultSemiBold">delegate</ThemedText>, and the
          tasks you’ll <ThemedText type="defaultSemiBold">delete</ThemedText>.
        </ThemedText>
        <Image
          source={require("@/assets/images/eisenhower-matrix-example.png")}
          style={styles.matrixImage}
        />
        <ThemedText type="defaultSemiBold">
          Urgent and Important (do first):
        </ThemedText>
        <ThemedText type="default">
          Tasks that you should do it NOW!!
        </ThemedText>
        <ThemedText type="defaultSemiBold">
          Not Urgent but Important (schedule):
        </ThemedText>
        <ThemedText type="default">
          Tasks that can wait, but please keep them in mind!
        </ThemedText>
        <ThemedText type="defaultSemiBold">
          Urgent, but not Important (delegate):
        </ThemedText>
        <ThemedText type="default">
          Tasks that must be done but won't take much effort.
        </ThemedText>
        <ThemedText type="defaultSemiBold">
          Not Urgent and not Important (delete):
        </ThemedText>
        <ThemedText type="default">
          Distraction and unnecessary tasks.
        </ThemedText>
      </Collapsible>
      <Collapsible title="A bit of history about the Eisenhower Matrix">
        <ThemedText>
          Dwight D. Eisenhower—the 34th President of the United States and a
          five-star general during World War II—presented the idea that would
          later lead to the Eisenhower Matrix. In a 1954 speech, Eisenhower
          quoted an unnamed university president when he said, “I have two kinds
          of problems, the urgent and the important. The urgent are not
          important, and the important are never urgent.”
        </ThemedText>
        <ExternalLink href="https://en.wikipedia.org/wiki/Priority_Matrix">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
    </ParallaxScrollView>
    </GlobalLayout >

  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  headImage: {
    alignSelf: "center",
    objectFit: "fill",
    width: "100%",
    height: "100%",
  },
  matrixImage: {
    alignSelf: "center",
    objectFit: "cover",
    width: 350,
    height: 350,
  },
});
