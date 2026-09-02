// src/components/EcosystemPDF.tsx
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import type { Ecosystem } from '../types';

const styles = StyleSheet.create({
  page: { 
    padding: 40, 
    backgroundColor: '#0d1117', 
    color: '#ffffff',
    fontFamily: 'Helvetica'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#30363d',
    borderBottomStyle: 'solid',
    paddingBottom: 10
  },
  badge: {
    fontSize: 10,
    color: '#00ffcc',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 5
  },
  title: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    color: '#58a6ff' 
  },
  image: { 
    width: '100%', 
    height: 280, 
    objectFit: 'cover', 
    borderRadius: 8, 
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#30363d',
    borderStyle: 'solid'
  },
  section: {
    backgroundColor: '#161b22',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#30363d',
    borderStyle: 'solid'
  },
  label: {
    fontSize: 10,
    color: '#8b949e',
    marginBottom: 5,
    textTransform: 'uppercase'
  },
  description: { 
    fontSize: 13, 
    lineHeight: 1.6, 
    color: '#c9d1d9' 
  },
  factContainer: {
    backgroundColor: '#161b22', 
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#1f6feb',
    borderLeftStyle: 'solid'
  },
  fact: { 
    fontSize: 11, 
    fontStyle: 'italic', 
    color: '#79c0ff' 
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#8b949e',
    borderTopWidth: 1,
    borderTopColor: '#30363d',
    borderTopStyle: 'solid',
    paddingTop: 10
  }
});

export default function EcosystemPDF({ 
  ecosystem, 
  imageSnapshot 
}: { 
  ecosystem: Ecosystem; 
  imageSnapshot?: string; 
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header / Title */}
        <View style={styles.header}>
          <View>
            <Text style={styles.badge}>{ecosystem.type.toUpperCase()} ECOSYSTEM REPORT</Text>
            <Text style={styles.title}>{ecosystem.title}</Text>
          </View>
        </View>

        {/* Canvas Snapshot Image (if available) */}
        {imageSnapshot ? (
          <Image src={imageSnapshot} style={styles.image} />
        ) : (
          <View style={[styles.image, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#21262d' }]}>
            <Text style={{ color: '#8b949e', fontSize: 12 }}>Ecosystem Preview</Text>
          </View>
        )}

        {/* Description Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Overview</Text>
          <Text style={styles.description}>{ecosystem.description}</Text>
        </View>

        {/* Fun Fact Section */}
        <View style={styles.factContainer}>
          <Text style={styles.label}>Ecological Insight</Text>
          <Text style={styles.fact}>"{ecosystem.fact}"</Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Generated from 3D/2D Ecosystem Browser • {new Date().getFullYear()}
        </Text>
      </Page>
    </Document>
  );
}