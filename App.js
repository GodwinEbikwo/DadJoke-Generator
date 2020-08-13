import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  ActivityIndicator,
  Share,
  TouchableOpacity,
} from "react-native";
import {
  useFonts,
  BungeeShade_400Regular,
} from "@expo-google-fonts/bungee-shade";
import { AppLoading } from "expo";
import { Helmet } from "react-helmet";
import axios from "axios";
import { StatusBar } from "expo-status-bar";

const WebMeta = () => (
  <Helmet>
    <title>Dad jokes generator</title>
    <link
      rel="icon"
      type="image/png"
      href="https://res.cloudinary.com/dqv9mfbvt/image/upload/v1597332858/triangle-logo_hde33r.png"
    />
  </Helmet>
);

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      {Platform.OS === "web" && <WebMeta />}
      <DadJoke />
    </>
  );
}

function DadJoke() {
  const [loaded] = useFonts({
    BungeeShade_400Regular,
  });

  const [Loading, setLoading] = useState(true);
  const [setup, setSetup] = useState("");
  const [punchline, setSetpunchline] = useState("");
  const [moreJoke, setMoreJoke] = useState(false);

  function generateMore() {
    setMoreJoke(!moreJoke);
  }

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const result = await axios(
        "https://us-central1-dadsofunny.cloudfunctions.net/DadJokes/random/type/general"
      );
      // console.log(result.data);
      setSetup(result.data[0].setup);
      setSetpunchline(result.data[0].punchline);
      setLoading(false);
    };
    getData();
  }, [moreJoke]);

  const onShareTwo = async () => {
    try {
      const result = await Share.share({
        title: "Dad joke generator",
        message: `Here is a joke for you: So um ${setup}, wait for it ... ${punchline} 😂😂`,
      });
      if (result.action === Share.sharedAction) {
        alert("Joke Shared");
      } else if (result.action === Share.dismissedAction) {
        console.log("cancelled");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  if (!loaded) {
    return <AppLoading />;
  } else
    return (
      <View style={styles.container}>
        <View style={styles.heading}>
          <Text
            style={{
              fontFamily: "BungeeShade_400Regular",
              fontSize: 40,
              textAlign: "center",
            }}
          >
            DAD JOKE GENERATOR
          </Text>
        </View>
        {Loading ? (
          <ActivityIndicator size="small" />
        ) : (
          <View style={styles.inner}>
            <Text style={styles.innerJokeQ}>{setup}</Text>
            <Text style={styles.innerJokeA}>{punchline}</Text>
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <ShowMore label="Generate more" onPress={generateMore} />
              <ShowMore label="Share the joke" onPress={onShareTwo} />
            </View>
          </View>
        )}
      </View>
    );
}

const ShowMore = ({ label, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.showmoreButton}>
      <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      web: {
        borderRadius: 10,
        backgroundColor: "rgba(12, 13, 53, 0.05)",
        maxWidth: 700,
        maxHeight: 350,
        width: "100%",
        height: "100%",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 60,
        marginBottom: 60,
        shadowColor: "#161616",
        shadowOffset: {
          width: 0,
          height: 6,
        },
        shadowOpacity: 0.25,
        shadowRadius: 9.51,
        elevation: 15,
      },
      default: {
        backgroundColor: "#f1e0d3",
      },
    }),
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    marginBottom: 10,
  },
  inner: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    width: "90%",
    ...Platform.select({
      web: {
        backgroundColor: "transparent",
      },
      default: {
        backgroundColor: "rgba(12, 13, 53, 0.05)",
      },
    }),
  },
  innerJokeQ: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "600",
  },
  innerJokeA: {
    marginTop: 5,
    fontSize: 15,
    textAlign: "center",
    fontWeight: "400",
    color: "#0779e4",
  },
  showmoreButton: {
    paddingVertical: 13,
    paddingHorizontal: 13,
    backgroundColor: "#ff5722",
    borderRadius: 3,
    margin: 10,
  },
});
