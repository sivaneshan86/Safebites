import React, { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import globalStyles from "../styles";
import { Ionicons } from "@expo/vector-icons";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ThemeContext } from "../../context/ThemeContext";

const chatbot = () => {
  const { themeStyles } = useContext(ThemeContext);

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your Allergy Assistant. Ask me about food allergies, symptoms, or ingredients.",
      isUser: false,
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef();

  const genAI = new GoogleGenerativeAI(
    "AIzaSyDdbfvmGN9XNVYdpGqqObnCZV12EdLYSGY"
  );
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const allergyKeywords = [
    "allergy",
    "allergies",
    "ingredient",
    "ingredients",
    "peanut",
    "milk",
    "soy",
    "egg",
    "fish",
    "gluten",
    "wheat",
    "shellfish",
    "tree nuts",
    "dairy",
    "product contains",
    "contain",
    "cross contact",
    "gluten free",
    "lactose",
    "nut free",
  ];

  const symptomKeywords = [
    "symptom",
    "symptoms",
    "reaction",
    "anaphylaxis",
    "rash",
    "hives",
    "swelling",
    "itching",
    "difficulty breathing",
    "vomiting",
    "diarrhea",
    "dizziness",
    "nausea",
  ];

  const greetingKeywords = [
    "hi",
    "hello",
    "hey",
    "greetings",
    "good morning",
    "good evening",
  ];

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: themeStyles.background,
    },
    messagesList: {
      paddingHorizontal: 15,
      paddingVertical: 10,
    },
    messageBubble: {
      padding: 10,
      borderRadius: 15,
      marginVertical: 5,
      maxWidth: "80%",
    },
    userBubble: {
      backgroundColor: "#DCF8C6",
      alignSelf: "flex-end",
    },
    botBubble: {
      backgroundColor: themeStyles.bgless,
      alignSelf: "flex-start",
    },
    messageText: {
      fontSize: 16,
    },
    userText: {
      color: "000",
    },
    botText: {
      color: themeStyles.text,
    },
    inputContainer: {
      flexDirection: "row",
      width: "100%",
      padding: 10,
      borderTopWidth: 0,
      backgroundColor: themeStyles.background,
    },
    input: {
      flex: 1,
      backgroundColor: themeStyles.bgless,
      padding: 10,
      borderRadius: 20,
      marginRight: 10,
      color: themeStyles.text,
    },
    sendButton: {
      backgroundColor: "#4CAF50",
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  const isGreeting = (text) => {
    const lower = text.toLowerCase();
    return greetingKeywords.some((greet) => lower.includes(greet));
  };

  const isAllergyOrSymptomRelated = (text) => {
    const lower = text.toLowerCase();
    return (
      allergyKeywords.some((keyword) => lower.includes(keyword)) ||
      symptomKeywords.some((keyword) => lower.includes(keyword))
    );
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = { id: Date.now(), text: inputText, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    const lowerText = inputText.toLowerCase();

    if (isGreeting(lowerText)) {
      const botMessage = {
        id: Date.now() + 1,
        text: "Hi there! 👋 I'm your Allergy Assistant. Ask me anything about food allergies, symptoms, or safe ingredients.",
        isUser: false,
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
      return;
    }

    if (!isAllergyOrSymptomRelated(lowerText)) {
      const botMessage = {
        id: Date.now() + 1,
        text: "I specialize in food allergies, symptoms, and ingredients. Please ask something related to that.",
        isUser: false,
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
      return;
    }

    try {
      const result = await model.generateContent({
        contents: [
          {
            parts: [
              {
                text: `You are a knowledgeable assistant focused only on food allergies, symptoms, and product ingredients. Respond concisely (under 100 words) to the following question:\n\n${inputText}`,
              },
            ],
          },
        ],
      });

      const response = await result.response;
      const text = response.text();

      const botMessage = {
        id: Date.now() + 2,
        text:
          text ||
          "I'm not sure how to answer that. Please ask about food allergies, symptoms, or ingredients.",
        isUser: false,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 3,
          text: "Oops! I couldn't connect right now. Please try again shortly.",
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.isUser ? styles.userBubble : styles.botBubble,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.isUser ? styles.userText : styles.botText,
        ]}
      >
        {item.text}
      </Text>
    </View>
  );

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.messagesList}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholderTextColor={themeStyles.text}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask about allergies, ingredients, or symptoms..."
          editable={!isLoading}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSend}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="send" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default chatbot;
