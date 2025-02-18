import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";

// Register Noto Sans Georgian font
Font.register({
  family: "NotoSansGeorgian",
  src: "https://fonts.gstatic.com/s/notosansgeorgian/v36/PlIaFke5O6RzLfvNNVSitxkr76PRHBC4Ytyq-Gof7PUs4S7zWn-8YDB09HFNdpvnzFj-f5WK0OQV.ttf",
});

const translations = {
  ka: {
    apartment: "ბინა",
    block: "ბლოკი",
    floor: "სართული",
    price: "ფასი",
    features: "მახასიათებლები",
    studio: "სტუდიო",
    livingRoom: "მისაღები",
    bedroom: "საძინებელი",
    bathroom: "სააბაზანო",
    balcony: "აივანი",
    totalArea: "საერთო ფართი",
    status: "სტატუსი",
    available: "თავისუფალი",
    sold: "გაყიდული",
    reserved: "დაჯავშნილი",
    documentGenerated: "დოკუმენტი შექმნილია",
  },
  en: {
    apartment: "Apartment",
    block: "Block",
    floor: "Floor",
    price: "Price",
    features: "Features",
    studio: "Studio",
    livingRoom: "Living Room",
    bedroom: "Bedroom",
    bathroom: "Bathroom",
    balcony: "Balcony",
    totalArea: "Total Area",
    status: "Status",
    available: "Available",
    sold: "Sold",
    reserved: "Reserved",
    documentGenerated: "Document Generated",
  },
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#ffffff",
    fontFamily: "NotoSansGeorgian",
  },
  header: {
    marginBottom: 30,
    borderBottom: 1,
    borderBottomColor: "#2563eb",
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: "#1e40af",
  },
  section: {
    marginBottom: 20,
  },
  imageContainer: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 10,
  },
  image: {
    width: "48%",
    height: 200,
    objectFit: "contain",
  },
  infoGrid: {
    marginTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  column: {
    width: "50%",
    paddingRight: 20,
    marginBottom: 15,
  },
  featureItem: {
    fontSize: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 8,
    borderRadius: 4,
  },
  featureLabel: {
    color: "#64748b",
    width: 120,
  },
  featureValue: {
    color: "#334155",
    flex: 1,
  },
  price: {
    fontSize: 18,
    marginTop: 10,
    color: "#059669",
  },
  statusContainer: {
    marginTop: 20,
    padding: 12,
    borderRadius: 4,
  },
  statusAvailable: {
    backgroundColor: "#dcfce7",
  },
  statusSold: {
    backgroundColor: "#fee2e2",
  },
  statusReserved: {
    backgroundColor: "#fef9c3",
  },
  statusText: {
    fontSize: 14,
  },
  statusAvailableText: {
    color: "#059669",
  },
  statusSoldText: {
    color: "#dc2626",
  },
  statusReservedText: {
    color: "#ca8a04",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 10,
    color: "#94a3b8",
    textAlign: "center",
    borderTop: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 10,
  },
});

const formatNumber = (num) => {
  if (!num) return "0";
  return parseFloat(num)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const ApartmentPDF = ({ apartmentData, locale = "ka" }) => {
  if (!apartmentData) {
    return null;
  }

  const t = translations[locale];
  const currentDate = new Date().toLocaleDateString(
    locale === "ka" ? "ka-GE" : "en-US"
  );

  const getStatusStyles = (status) => {
    switch (status) {
      case "available":
        return {
          container: styles.statusAvailable,
          text: styles.statusAvailableText,
        };
      case "sold":
        return {
          container: styles.statusSold,
          text: styles.statusSoldText,
        };
      case "reserved":
        return {
          container: styles.statusReserved,
          text: styles.statusReservedText,
        };
      default:
        return {
          container: styles.statusAvailable,
          text: styles.statusAvailableText,
        };
    }
  };

  const statusStyles = getStatusStyles(apartmentData.status);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>
              {t.apartment} {apartmentData.apartment_number}
            </Text>
            <Text>
              {t.block} {apartmentData.block_id}
            </Text>
            <Text>
              {t.floor} {apartmentData.floor}
            </Text>
          </View>
          <View style={styles.headerRight}>
            {apartmentData.price && (
              <Text style={styles.price}>
                {t.price}: {formatNumber(apartmentData.price)} ₾
              </Text>
            )}
            <View
              style={{ ...styles.statusContainer, ...statusStyles.container }}
            >
              <Text style={{ ...styles.statusText, ...statusStyles.text }}>
                {t.status}: {t[apartmentData.status]}
              </Text>
            </View>
          </View>
        </View>

        {(apartmentData.home_3d || apartmentData.home_2d) && (
          <View style={styles.imageContainer}>
            {apartmentData.home_3d && (
              <Image src={apartmentData.home_3d} style={styles.image} />
            )}
            {apartmentData.home_2d && (
              <Image src={apartmentData.home_2d} style={styles.image} />
            )}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.title}>{t.features}</Text>

          <View style={styles.infoGrid}>
            <View style={styles.column}>
              {Number(apartmentData.studio_area) > 0 && (
                <View style={styles.featureItem}>
                  <Text style={styles.featureLabel}>{t.studio}:</Text>
                  <Text style={styles.featureValue}>
                    {formatNumber(apartmentData.studio_area)} მ²
                  </Text>
                </View>
              )}

              {Number(apartmentData.living_room_area) > 0 && (
                <View style={styles.featureItem}>
                  <Text style={styles.featureLabel}>{t.livingRoom}:</Text>
                  <Text style={styles.featureValue}>
                    {formatNumber(apartmentData.living_room_area)} მ²
                  </Text>
                </View>
              )}

              {Number(apartmentData.bedroom_area) > 0 && (
                <View style={styles.featureItem}>
                  <Text style={styles.featureLabel}>{t.bedroom}:</Text>
                  <Text style={styles.featureValue}>
                    {formatNumber(apartmentData.bedroom_area)} მ²
                  </Text>
                </View>
              )}

              {Number(apartmentData.bedroom2_area) > 0 && (
                <View style={styles.featureItem}>
                  <Text style={styles.featureLabel}>{t.bedroom} 2:</Text>
                  <Text style={styles.featureValue}>
                    {formatNumber(apartmentData.bedroom2_area)} მ²
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.column}>
              {Number(apartmentData.bathroom_area) > 0 && (
                <View style={styles.featureItem}>
                  <Text style={styles.featureLabel}>{t.bathroom}:</Text>
                  <Text style={styles.featureValue}>
                    {formatNumber(apartmentData.bathroom_area)} მ²
                  </Text>
                </View>
              )}

              {Number(apartmentData.bathroom2_area) > 0 && (
                <View style={styles.featureItem}>
                  <Text style={styles.featureLabel}>{t.bathroom} 2:</Text>
                  <Text style={styles.featureValue}>
                    {formatNumber(apartmentData.bathroom2_area)} მ²
                  </Text>
                </View>
              )}

              {Number(apartmentData.balcony_area) > 0 && (
                <View style={styles.featureItem}>
                  <Text style={styles.featureLabel}>{t.balcony}:</Text>
                  <Text style={styles.featureValue}>
                    {formatNumber(apartmentData.balcony_area)} მ²
                  </Text>
                </View>
              )}

              {Number(apartmentData.balcony2_area) > 0 && (
                <View style={styles.featureItem}>
                  <Text style={styles.featureLabel}>{t.balcony} 2:</Text>
                  <Text style={styles.featureValue}>
                    {formatNumber(apartmentData.balcony2_area)} მ²
                  </Text>
                </View>
              )}

              {Number(apartmentData.total_area) > 0 && (
                <View style={styles.featureItem}>
                  <Text style={styles.featureLabel}>{t.totalArea}:</Text>
                  <Text style={styles.featureValue}>
                    {formatNumber(apartmentData.total_area)} მ²
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>
            {t.documentGenerated}: {currentDate}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default ApartmentPDF;
