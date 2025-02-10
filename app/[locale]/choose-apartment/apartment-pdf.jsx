// components/ApartmentPDF.js
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 20,
    borderBottom: "1px solid #ccc",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  section: {
    marginBottom: 15,
  },
  imageContainer: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 10,
  },
  image: {
    width: "48%",
    height: 200,
  },
  infoGrid: {
    marginTop: 20,
    gap: 10,
  },
  featureItem: {
    fontSize: 12,
    marginBottom: 5,
    flexDirection: "row",
    gap: 5,
  },
});

const ApartmentPDF = ({ apartmentData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Apartment {apartmentData.apartment_number}
        </Text>
        <Text>Floor {apartmentData.floor}</Text>
        <Text>Total Area: {apartmentData.total_area} m²</Text>
      </View>

      <View style={styles.imageContainer}>
        {apartmentData.home_3d && (
          <Image src={apartmentData.home_3d} style={styles.image} />
        )}
        {apartmentData.home_2d && (
          <Image src={apartmentData.home_2d} style={styles.image} />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Features</Text>

        <View style={styles.infoGrid}>
          {apartmentData.block_id && (
            <View style={styles.featureItem}>
              <Text>BLOCK /</Text>
              <Text>{apartmentData.block_id}</Text>
            </View>
          )}

          {apartmentData.living_room_area > 0 && (
            <View style={styles.featureItem}>
              <Text>Living Room /</Text>
              <Text>{apartmentData.living_room_area} m²</Text>
            </View>
          )}

          {apartmentData.bedroom_area > 0 && (
            <View style={styles.featureItem}>
              <Text>Bedroom /</Text>
              <Text>{apartmentData.bedroom_area} m²</Text>
            </View>
          )}

          {apartmentData.bathroom_area > 0 && (
            <View style={styles.featureItem}>
              <Text>WC /</Text>
              <Text>{apartmentData.bathroom_area} m²</Text>
            </View>
          )}

          {apartmentData.balcony_area > 0 && (
            <View style={styles.featureItem}>
              <Text>Terrace /</Text>
              <Text>{apartmentData.balcony_area} m²</Text>
            </View>
          )}
          {apartmentData.total_area > 0 && (
            <View style={styles.featureItem}>
              <Text>Total Area /</Text>
              <Text>{apartmentData.total_area} m²</Text>
            </View>
          )}
        </View>
      </View>

      {apartmentData.view_360 && (
        <View style={styles.section}>
          <Text style={styles.title}>360° View</Text>
          <Image
            src={apartmentData.view_360}
            style={{ width: "100%", height: 200 }}
          />
        </View>
      )}
    </Page>
  </Document>
);

export default ApartmentPDF;
