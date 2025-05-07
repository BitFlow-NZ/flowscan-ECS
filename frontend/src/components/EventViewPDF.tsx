import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';


const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    padding: 30,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 15,
    fontSize: 12,
    lineHeight: 1.6,
  },
  label: {
    fontWeight: 'bold',
    color: '#555',
  },
  tableContainer: {
    marginTop: 20,
    border: 1,
    borderColor: '#ddd',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: 1,
    borderColor: '#ddd',
    padding: 5,
    fontSize: 10,
  },
  tableHeader: {
    backgroundColor: '#f2f2f2',
    fontWeight: 'bold',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
  },
  title: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 5,
    textDecoration: 'underline',
  },
});

const EventViewPDF = ({ eventData }: { eventData: any }) => {
  const safeEvent = eventData || {};
  const safeEventItems = eventData?.eventItems || [];
  console.log('eventData', eventData);

  // const pdfTitle = `Event Report - ${safeEvent.name || 'Unknown Event'} - ${
  //     safeEvent.time ? safeEvent.time.split(' ')[0] : 'Unknown Date'
  //   }`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <Text style={styles.header}>Event Details</Text>

        {/* Event Basic Information */}
        <View style={styles.section}>
          <Text>
            <Text style={styles.label}>Event Name: </Text>
            {safeEvent.name || 'N/A'}
          </Text>
          <Text>
            <Text style={styles.label}>Event Time: </Text>
            {safeEvent.time || 'N/A'}
          </Text>
          <Text>
            <Text style={styles.label}>Doctor Name: </Text>
            {safeEvent.doctorName || 'N/A'}
          </Text>
          <Text>
            <Text style={styles.label}>Patient Name: </Text>
            {safeEvent.patientName || 'N/A'}
          </Text>
          <Text>
            <Text style={styles.label}>Theater Number: </Text>
            {safeEvent.theaterNumber || 'N/A'}
          </Text>
          <Text>
            <Text style={styles.label}>Last Edited By: </Text>
            {safeEvent.lastEditPerson || 'N/A'}
          </Text>
        </View>

        {/* Event Items Table */}
        <Text style={styles.title}>Event Items</Text>
        <View style={styles.tableContainer}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Item Name</Text>
            <Text style={styles.tableCell}>Quantity</Text>
            <Text style={styles.tableCell}>Unit Name</Text>
          </View>
          {/* Table Rows */}
          {safeEventItems.length > 0 ? (
            safeEventItems.map((item: any, index: number) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.itemName || 'N/A'}</Text>
                <Text style={styles.tableCell}>{item.quantity || 0}</Text>
                <Text style={styles.tableCell}>{item.unitName || 'N/A'}</Text>
              </View>
            ))
          ) : (
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 3, textAlign: 'center' }]}>
                No Items Available
              </Text>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};
export default EventViewPDF;