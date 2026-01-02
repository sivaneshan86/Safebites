import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 40,
    backgroundColor: "449985",
  },

  title: {
    color: "#286355",
    padding: 20,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 15,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  allergyContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  allergyOption: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    backgroundColor: "#f9f9f9",
  },
  selectedAllergy: {
    borderColor: "#007AFF",
    backgroundColor: "#e6f2ff",
  },
  allergyText: {
    fontSize: 14,
  },
  priorityOption: {
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  selectedPriority: {
    borderColor: "#007AFF",
    backgroundColor: "#e6f2ff",
  },
  optionText: {
    fontSize: 16,
  },
  successText: {
    fontSize: 18,
    color: "green",
    textAlign: "center",
    marginTop: 20,
  },
  memberCard: {
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  memberDetails: {
    fontSize: 14,
    color: "#666",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  secondaryButton: {
    backgroundColor: "#f44336",
    flex: 1,
    marginRight: 10,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    width: "100%",
  },
  menuText: {
    fontSize: 18,
    color: "#333",
  },
  logoutButton: {
    marginTop: 40,
    backgroundColor: "#f44336",
  },
  chatContainer: {
    flex: 1,
    width: "100%",
  },
  messageContainer: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#f0f0f0",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: "#fff",
  },
  typingIndicator: {
    padding: 10,
    alignSelf: "flex-start",
  },
  typingText: {
    color: "#666",
    fontStyle: "italic",
  },
});

export default styles;
