import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";

const Cart = () => {
  const { cart, removeFromCart } = useContext(UserContext);
  const { themeStyles } = useContext(ThemeContext);
  const themedStyles = getStyles(themeStyles);
  const isProductSafe = (item) => {
    return !item.allergens || item.allergens.length === 0;
  };

  return (
    <SafeAreaView style={themedStyles.container}>
      <ScrollView style={themedStyles.container}>
        <Text style={themedStyles.title}>Your Cart ({cart.length})</Text>

        {cart.length === 0 ? (
          <View style={themedStyles.emptyContainer}>
            <Ionicons name="cart-outline" size={48} color={themeStyles.text} />
            <Text style={themedStyles.emptyText}>Your cart is empty</Text>
          </View>
        ) : (
          cart.map((item, index) => (
            <View
              key={`${item.barcode}-${index}`}
              style={[
                themedStyles.itemContainer,
                !isProductSafe(item) && themedStyles.unsafeItem,
              ]}
            >
              {item.image && (
                <Image
                  source={{ uri: item.image }}
                  style={themedStyles.itemImage}
                />
              )}

              <View style={themedStyles.itemDetails}>
                <Text style={themedStyles.itemName} numberOfLines={2}>
                  {item.name || "Unknown Product"}
                </Text>

                {!isProductSafe(item) && (
                  <View style={themedStyles.allergenWarning}>
                    <Ionicons name="warning" size={16} color="#e74c3c" />
                    <Text style={themedStyles.allergenText}>
                      Contains: {item.allergens.join(", ")}
                    </Text>
                  </View>
                )}

                {isProductSafe(item) && (
                  <View style={themedStyles.safeLabel}>
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color="#2ecc71"
                    />
                    <Text style={themedStyles.safeText}>Allergen-safe</Text>
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={themedStyles.removeButton}
                onPress={() => removeFromCart(item.barcode)}
              >
                <Ionicons name="trash-outline" size={20} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (themeStyles) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeStyles.background,
      padding: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      color: themeStyles.text,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 40,
    },
    emptyText: {
      fontSize: 18,
      marginTop: 16,
      color: themeStyles.text,
    },
    itemContainer: {
      flexDirection: "row",
      padding: 12,
      marginBottom: 12,
      borderRadius: 8,
      backgroundColor: themeStyles.bgless,
      alignItems: "center",
    },
    unsafeItem: {
      borderLeftWidth: 4,
      borderLeftColor: "#e74c3c",
    },
    itemImage: {
      width: 60,
      height: 60,
      borderRadius: 8,
      marginRight: 12,
      backgroundColor: "#f5f5f5",
    },
    itemDetails: {
      flex: 1,
    },
    itemName: {
      fontSize: 16,
      fontWeight: "500",
      color: themeStyles.text,
      marginBottom: 4,
    },
    allergenWarning: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#ffebee",
      padding: 4,
      borderRadius: 4,
      marginTop: 4,
    },
    allergenText: {
      fontSize: 12,
      color: "#c62828",
      marginLeft: 4,
    },
    safeLabel: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#e8f5e9",
      padding: 4,
      borderRadius: 4,
      marginTop: 4,
    },
    safeText: {
      fontSize: 12,
      color: "#2e7d32",
      marginLeft: 4,
    },
    removeButton: {
      padding: 8,
      marginLeft: 8,
    },
  });

export default Cart;
