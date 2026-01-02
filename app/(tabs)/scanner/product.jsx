import { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../../context/ThemeContext";
import { UserContext } from "../../../context/UserContext";

export default function Product() {
  const { barcode, allergies } = useLocalSearchParams();
  const { themeStyles } = useContext(ThemeContext);
  const { addToCart } = useContext(UserContext);
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [foundAllergens, setFoundAllergens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        barcode,
        name: product.product_name,
        image: product.image_url,
        allergens: foundAllergens || [],
      });
      alert("Added to cart!");
      router.back();
    }
  };
  const fetchProduct = async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);
      setProduct(null);

      const res = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );
      const data = await res.json();

      if (data.status === 1) {
        const p = data.product;
        setProduct(p);

        const ingredientText = [
          p.ingredients_text?.toLowerCase(),
          p.allergens?.toLowerCase(),
          p.allergens_from_ingredients?.toLowerCase(),
          p.allergens_hierarchy?.join(" ")?.toLowerCase(),
        ]
          .filter(Boolean)
          .join(" ");

        const allergyList = allergies
          ?.split(",")
          .filter((a) => a.trim() !== "")
          .map((a) => a.trim().toLowerCase());

        const detected = allergyList?.filter((a) => {
          const normalizedAllergen = a.replace(/\s+/g, "");
          return (
            ingredientText.includes(a) ||
            ingredientText.includes(normalizedAllergen)
          );
        });

        setFoundAllergens(detected || []);
      } else {
        if (retryCount < 2) {
          // Wait 1 second before retrying (increased from 0ms)
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return fetchProduct(retryCount + 1);
        } else {
          setError("Product not found after multiple attempts");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Error loading product. Please try again.");
      if (retryCount < 2) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return fetchProduct(retryCount + 1);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Add cleanup to prevent state updates if component unmounts
    let isMounted = true;

    const loadProduct = async () => {
      await fetchProduct();
    };

    if (barcode) {
      loadProduct();
    }

    return () => {
      isMounted = false;
    };
  }, [barcode, allergies]);

  const themedStyles = getStyles(themeStyles);

  if (loading) {
    return (
      <View style={themedStyles.centered}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={themedStyles.loadingText}>
          Loading product information...
        </Text>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={themedStyles.centered}>
        <Ionicons name="warning" size={48} color="#FF3B30" />
        <Text style={themedStyles.errorText}>
          {error || "Product information not available"}
        </Text>
        <Text style={themedStyles.barcodeText}>Barcode: {barcode}</Text>
        <TouchableOpacity
          style={themedStyles.retryButton}
          onPress={() => {
            setError(null);
            setLoading(true);
            fetchProduct();
          }}
        >
          <Text style={themedStyles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={themedStyles.container}
      contentContainerStyle={themedStyles.content}
    >
      <ScrollView
        style={themedStyles.container}
        contentContainerStyle={themedStyles.content}
      >
        {product.image_url && (
          <Image
            source={{ uri: product.image_url }}
            style={themedStyles.productImage}
            resizeMode="contain"
          />
        )}

        <Text style={themedStyles.productName}>{product.product_name}</Text>
        <Text style={themedStyles.brandText}>{product.brands}</Text>

        {foundAllergens.length > 0 && (
          <View style={themedStyles.allergenAlert}>
            <Text style={themedStyles.allergenTitle}>⚠️ Allergen Alert</Text>
            <Text style={themedStyles.allergenText}>
              Contains: {foundAllergens.join(", ")}
            </Text>
          </View>
        )}

        <View style={themedStyles.nutritionContainer}>
          <Text style={themedStyles.sectionTitle}>Nutrition Facts</Text>
          <View style={themedStyles.nutritionGrid}>
            <View style={themedStyles.nutritionItem}>
              <Text style={themedStyles.nutritionValue}>
                {product.nutriments?.energy || "N/A"}
              </Text>
              <Text style={themedStyles.nutritionLabel}>calories</Text>
            </View>

            <View style={themedStyles.nutritionItem}>
              <Text style={themedStyles.nutritionValue}>
                {product.nutriments?.proteins || "N/A"}g
              </Text>
              <Text style={themedStyles.nutritionLabel}>protein</Text>
            </View>

            <View style={themedStyles.nutritionItem}>
              <Text style={themedStyles.nutritionValue}>
                {product.nutriments?.fat || "N/A"}g
              </Text>
              <Text style={themedStyles.nutritionLabel}>fat</Text>
            </View>

            <View style={themedStyles.nutritionItem}>
              <Text style={themedStyles.nutritionValue}>
                {product.nutriments?.carbohydrates || "N/A"}g
              </Text>
              <Text style={themedStyles.nutritionLabel}>carbs</Text>
            </View>
          </View>
        </View>

        <View style={themedStyles.ingredientsContainer}>
          <Text style={themedStyles.sectionTitle}>Ingredients</Text>
          <Text style={themedStyles.ingredientsText}>
            {product.ingredients_text_en ||
              "No ingredients information available"}
          </Text>
        </View>

        {product.nutriscore_grade && (
          <View style={themedStyles.nutriscoreContainer}>
            <Text style={themedStyles.sectionTitle}>Nutri-Score</Text>
            <View style={themedStyles.nutriscoreWrapper}>
              <View
                style={[
                  themedStyles.nutriscoreCircle,
                  {
                    backgroundColor: getNutriscoreColor(
                      product.nutriscore_grade
                    ),
                  },
                ]}
              >
                <Text style={themedStyles.nutriscoreText}>
                  {product.nutriscore_grade.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={themedStyles.barcodeContainer}>
          <Text style={themedStyles.barcodeLabel}>Product Code</Text>
          <Text style={themedStyles.barcodeText}>{barcode}</Text>
        </View>
      </ScrollView>
      <View style={themedStyles.buttonContainer}>
        <TouchableOpacity
          style={[themedStyles.button, themedStyles.backButton]}
          onPress={() => router.back()}
        >
          <Text style={themedStyles.buttonText}>Go Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[themedStyles.button, themedStyles.addButton]}
          onPress={handleAddToCart}
        >
          <Text style={themedStyles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const getNutriscoreColor = (grade) => {
  const colors = {
    a: "#038141",
    b: "#85bb2f",
    c: "#fecb02",
    d: "#ee8100",
    e: "#e63e11",
  };
  return colors[grade.toLowerCase()] || "#888888";
};

// ✅ THEME-AWARE STYLES
const getStyles = (themeStyles) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeStyles.background,
    },
    content: {
      padding: 20,
      paddingBottom: 40,
    },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: themeStyles.background,
    },
    loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: themeStyles.text,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 20,
      backgroundColor: themeStyles.bgless,
      gap: 10,
    },
    button: {
      flex: 1,
      padding: 15,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    backButton: {
      backgroundColor: themeStyles.bgless,
      borderWidth: 1,
      borderColor: themeStyles.text,
    },
    addButton: {
      backgroundColor: "#4CAF50",
    },
    buttonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },
    backButtonText: {
      color: themeStyles.text,
    },
    errorText: {
      fontSize: 18,
      color: "#e74c3c",
      marginBottom: 10,
    },
    productImage: {
      width: "100%",
      height: 200,
      marginBottom: 20,
      borderRadius: 12,
      backgroundColor: "#f9f9f9",
    },
    productName: {
      fontSize: 24,
      fontWeight: "700",
      marginBottom: 8,
      color: themeStyles.text,
    },
    brandText: {
      fontSize: 16,
      color: "#999",
      marginBottom: 20,
    },
    allergenAlert: {
      backgroundColor: "#ffebee",
      borderRadius: 10,
      padding: 16,
      marginBottom: 20,
      borderLeftWidth: 4,
      borderLeftColor: "#e53935",
    },
    allergenTitle: {
      fontWeight: "700",
      fontSize: 16,
      marginBottom: 4,
      color: "#c62828",
    },
    allergenText: {
      color: "#c62828",
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 12,
      color: themeStyles.text,
    },
    nutritionContainer: {
      marginBottom: 24,
    },
    nutritionGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    nutritionItem: {
      width: "48%",
      backgroundColor: themeStyles.bgless,
      borderRadius: 10,
      padding: 16,
      marginBottom: 10,
      alignItems: "center",
    },
    nutritionValue: {
      fontSize: 20,
      fontWeight: "700",
      color: "#4A90E2",
      marginBottom: 4,
    },
    nutritionLabel: {
      fontSize: 14,
      color: "#666",
    },
    ingredientsContainer: {
      marginBottom: 24,
    },
    ingredientsText: {
      fontSize: 15,
      lineHeight: 22,
      color: themeStyles.text,
    },
    nutriscoreContainer: {
      marginBottom: 24,
    },
    nutriscoreWrapper: {
      alignItems: "center",
      marginTop: 10,
    },
    nutriscoreCircle: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
    },
    nutriscoreText: {
      color: "#fff",
      fontSize: 28,
      fontWeight: "bold",
    },
    barcodeContainer: {
      alignItems: "center",
      marginTop: 10,
      paddingTop: 20,
      borderTopWidth: 1,
      borderTopColor: "#eee",
    },
    barcodeLabel: {
      fontSize: 14,
      color: "#888",
    },
    barcodeText: {
      fontSize: 16,
      color: themeStyles.text,
    },
    retryButton: {
      marginTop: 10,
      backgroundColor: "#4A90E2",
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
    },
    retryText: {
      color: "#fff",
      fontWeight: "bold",
    },
  });
