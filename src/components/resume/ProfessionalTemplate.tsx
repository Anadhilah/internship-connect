import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Define types for resume data
export interface ResumeData {
  full_name: string;
  email?: string;
  phone?: string;
  location?: string;
  portfolio_url?: string;
  education_level?: string;
  university?: string;
  field_of_study?: string;
  skills?: string[];
  experience_level?: string;
  interests?: string[];
  summary?: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginBottom: 20,
    borderBottom: 2,
    borderBottomColor: '#2D3748',
    paddingBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 5,
  },
  contactInfo: {
    fontSize: 10,
    color: '#4A5568',
    marginBottom: 3,
  },
  section: {
    marginTop: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 8,
    borderBottom: 1,
    borderBottomColor: '#CBD5E0',
    paddingBottom: 3,
  },
  text: {
    fontSize: 11,
    color: '#2D3748',
    marginBottom: 4,
    lineHeight: 1.5,
  },
  subsection: {
    marginBottom: 8,
  },
  subsectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 3,
  },
  subsectionSubtitle: {
    fontSize: 10,
    color: '#718096',
    marginBottom: 4,
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  skill: {
    fontSize: 10,
    color: '#2D3748',
    backgroundColor: '#EDF2F7',
    padding: '4 8',
    marginRight: 5,
    marginBottom: 5,
    borderRadius: 3,
  },
});

interface ProfessionalTemplateProps {
  data: ResumeData;
}

export const ProfessionalTemplate = ({ data }: ProfessionalTemplateProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{data.full_name || 'Your Name'}</Text>
        {data.email && <Text style={styles.contactInfo}>Email: {data.email}</Text>}
        {data.phone && <Text style={styles.contactInfo}>Phone: {data.phone}</Text>}
        {data.location && <Text style={styles.contactInfo}>Location: {data.location}</Text>}
        {data.portfolio_url && <Text style={styles.contactInfo}>Portfolio: {data.portfolio_url}</Text>}
      </View>

      {/* Professional Summary */}
      {data.summary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text style={styles.text}>{data.summary}</Text>
        </View>
      )}

      {/* Education */}
      {(data.education_level || data.university || data.field_of_study) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          <View style={styles.subsection}>
            {data.education_level && <Text style={styles.subsectionTitle}>{data.education_level}</Text>}
            {data.university && <Text style={styles.subsectionSubtitle}>{data.university}</Text>}
            {data.field_of_study && <Text style={styles.text}>Field of Study: {data.field_of_study}</Text>}
          </View>
        </View>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillsList}>
            {data.skills.map((skill, index) => (
              <Text key={index} style={styles.skill}>{skill}</Text>
            ))}
          </View>
        </View>
      )}

      {/* Experience Level */}
      {data.experience_level && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience Level</Text>
          <Text style={styles.text}>{data.experience_level}</Text>
        </View>
      )}

      {/* Interests */}
      {data.interests && data.interests.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Areas of Interest</Text>
          <View style={styles.skillsList}>
            {data.interests.map((interest, index) => (
              <Text key={index} style={styles.skill}>{interest}</Text>
            ))}
          </View>
        </View>
      )}
    </Page>
  </Document>
);
