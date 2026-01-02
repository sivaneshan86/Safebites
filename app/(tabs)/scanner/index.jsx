import { useContext, useEffect, useState, useCallback } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions, FlashMode } from "expo-camera";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { UserContext } from "../../../context/UserContext";

export default function Scanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const router = useRouter();
  const { userData } = useContext(UserContext);

  // Reset scan state when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setScanned(false);
      return () => {};
    }, [])
  );

  useEffect(() => {
    if (!permission?.granted) {
      setScanned(false);
      requestPermission();
    }
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    if (!scanned) {
      setScanned(true);
      const allergiesString = userData?.allergies?.join(",") || "";

      router.push({
        pathname: "/(tabs)/scanner/product",
        params: {
          barcode: data,
          allergies: encodeURIComponent(allergiesString),
        },
      });
    }
  };

  const toggleFlashlight = () => {
    setFlashOn((prevState) => !prevState);
  };

  if (!permission?.granted) {
    return (
      <View style={styles.centered}>
        <Text>Camera permission is required to scan barcodes.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{
          barcodeTypes: [
            "qr",
            "ean13",
            "ean8",
            "upc_a",
            "upc_e",
            "code39",
            "code128",
          ],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        flashMode={flashOn ? "on" : "off"}
      />

      {/* Rest of your UI remains the same */}
      <View style={styles.overlay}>
        <View style={styles.scanArea}>
          <View style={styles.scanCorner} />
          <View style={[styles.scanCorner, { right: 0 }]} />
          <View style={[styles.scanCorner, { bottom: 0 }]} />
          <View style={[styles.scanCorner, { right: 0, bottom: 0 }]} />
        </View>

        <Text style={styles.instructionText}>
          Place barcode within the frame
        </Text>

        <TouchableOpacity
          style={styles.flashButton}
          onPress={toggleFlashlight}
          activeOpacity={0.7}
        >
          <Ionicons
            name={flashOn ? "flash" : "flash-outline"}
            size={28}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Your styles remain the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "transparent",
    position: "relative",
  },
  scanCorner: {
    position: "absolute",
    width: 20,
    height: 20,
    borderColor: "#ffffff",
    borderWidth: 3,
  },
  instructionText: {
    color: "white",
    fontSize: 16,
    marginTop: 30,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    overflow: "hidden",
    fontWeight: "500",
  },
  flashButton: {
    position: "absolute",
    bottom: 50,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});
