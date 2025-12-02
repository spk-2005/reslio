import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert, ActivityIndicator, SafeAreaView } from 'react-native';
import { documentDirectory, EncodingType, copyAsync, writeAsStringAsync } from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import { captureRef } from 'react-native-view-shot';
import { Ionicons } from '@expo/vector-icons';

// --- INTERFACE UPDATE: Added onExportComplete ---
interface ExportOption {
  id: string;
  label: string;
  icon: string;
  format: 'pdf' | 'html' | 'png' | 'docx';
}

interface ExportComponentProps {
  htmlContent: string;
  resumeName?: string;
  containerRef?: any;
  showModal?: boolean;
  onCloseModal?: () => void;
  onExportComplete?: () => void; // <--- NEW PROP
}

export default function ResumeExportComponent({ 
  htmlContent, 
  resumeName = 'resume',
  containerRef,
  showModal: externalShowModal,
  onCloseModal,
  onExportComplete // <--- DESTRUCTURED NEW PROP
}: ExportComponentProps) {
  const [showModal, setShowModal] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportingFormat, setExportingFormat] = useState<string>('');

  // Use external modal control if provided, otherwise use internal state
  const isModalVisible = externalShowModal !== undefined ? externalShowModal : showModal;
  
  const handleCloseModal = () => {
    if (onCloseModal) {
      onCloseModal();
    } else {
      setShowModal(false);
    }
  };

  const exportOptions: ExportOption[] = [
    { id: '1', label: 'PDF (Best)', icon: '📄', format: 'pdf' },
    { id: '2', label: 'Image (PNG)', icon: '🖼️', format: 'png' },
    { id: '3', label: 'Word (DOC)', icon: '📝', format: 'docx' },
    { id: '4', label: 'Source (HTML)', icon: '🌐', format: 'html' },
  ];

  const sanitizeFileName = (name: string) => {
    // Note: Replaced "a-z0-9" with "a-zA-Z0-9" to handle mixed case input naturally
    return name.replace(/[^a-zA-Z0-9]/gi, '_').toLowerCase();
  };

  // --- EXPORT FUNCTION: PDF ---
  const exportToPDF = async () => {
    try {
      setExporting(true);
      setExportingFormat('PDF (Best)');

      // 1. Generate PDF
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      // 2. Share
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share Resume PDF',
        });
        Alert.alert('Success', 'PDF generated and shared!');
      } else {
        Alert.alert('Info', 'PDF saved temporarily. Sharing not available.');
      }
    } catch (error) {
      console.error('PDF export error:', error);
      Alert.alert('Error', 'Failed to export PDF');
    } finally {
      setExporting(false);
      setExportingFormat('');
      handleCloseModal();
      if (onExportComplete) onExportComplete(); // SIGNAL PARENT
    }
  };

  // --- EXPORT FUNCTION: IMAGE (PNG) ---
  const exportToImage = async () => {
    try {
      setExporting(true);
      setExportingFormat('Image (PNG)');

      if (!containerRef?.current) {
        Alert.alert('Error', 'Cannot capture resume. Please ensure the resume view is rendered.');
        return;
      }

      // 1. Capture View
      const uri = await captureRef(containerRef, {
        format: 'png',
        quality: 1,
      });

      // 2. Prepare Path and Share
      const docDir = documentDirectory;
      if (!docDir) {
        Alert.alert('Error', 'Cannot access file system');
        return;
      }

      const fileName = `${sanitizeFileName(resumeName)}.png`;
      const newPath = `${docDir}${fileName}`;
      
      await copyAsync({
        from: uri,
        to: newPath,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(newPath, {
          mimeType: 'image/png',
          dialogTitle: 'Share Resume Image',
        });
        Alert.alert('Success', 'Resume exported and shared as PNG!');
      } else {
        Alert.alert('Success', 'Resume exported as PNG (saved locally).');
      }

    } catch (error) {
      console.error('Image export error:', error);
      Alert.alert('Error', 'Failed to export image');
    } finally {
      setExporting(false);
      setExportingFormat('');
      handleCloseModal();
      if (onExportComplete) onExportComplete(); // SIGNAL PARENT
    }
  };

  // --- EXPORT FUNCTION: HTML ---
  const exportToHTML = async () => {
    try {
      setExporting(true);
      setExportingFormat('Source (HTML)');

      const docDir = documentDirectory;
      if (!docDir) {
        Alert.alert('Error', 'Cannot access file system.');
        return;
      }

      // 1. Write HTML content to file
      const fileName = `${sanitizeFileName(resumeName)}.html`;
      const filePath = `${docDir}${fileName}`;
      
      await writeAsStringAsync(filePath, htmlContent, {
        encoding: EncodingType.UTF8,
      });

      // 2. Share
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath, {
          mimeType: 'text/html',
          dialogTitle: 'Share Resume HTML Source',
        });
        Alert.alert('Success', 'HTML source exported and shared!');
      } else {
        Alert.alert('Info', 'HTML source saved temporarily.');
      }
    } catch (error) {
      console.error('HTML export error:', error);
      Alert.alert('Error', 'Failed to export HTML source.');
    } finally {
      setExporting(false);
      setExportingFormat('');
      handleCloseModal();
      if (onExportComplete) onExportComplete(); // SIGNAL PARENT
    }
  };

  // --- EXPORT FUNCTION: WORD (DOC) ---
  const exportToWord = async () => {
    try {
      setExporting(true);
      setExportingFormat('Word (DOC)');

      const docDir = documentDirectory;
      if (!docDir) {
        Alert.alert('Error', 'Cannot access file system');
        return;
      }

      // 1. Convert HTML to RTF/Basic DOC structure
      const docxContent = convertHtmlToDocx(htmlContent);
      
      const fileName = `${sanitizeFileName(resumeName)}.doc`;
      const filePath = `${docDir}${fileName}`;

      // Note: Writing as string is sufficient for basic DOC format (RTF).
      await writeAsStringAsync(filePath, docxContent);

      // 2. Share
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath, {
          mimeType: 'application/msword', // MimeType for .doc (RTF)
          dialogTitle: 'Share Resume Word Document',
        });
        Alert.alert('Success', 'Resume exported and shared as Word document!');
      } else {
        Alert.alert('Success', 'Resume exported as Word document (saved locally).');
      }

    } catch (error) {
      console.error('Word export error:', error);
      Alert.alert('Error', 'Failed to export Word document');
    } finally {
      setExporting(false);
      setExportingFormat('');
      handleCloseModal();
      if (onExportComplete) onExportComplete(); // SIGNAL PARENT
    }
  };

  // --- HTML to DOCX/RTF Conversion (Simple plain text method) ---
  const convertHtmlToDocx = (html: string): string => {
    // Highly simplified conversion for plain text readability in Word.
    // Full HTML to DOCX/RTF conversion requires a much more complex library/service.
    let text = html
      .replace(/<style[^>]*>.*?<\/style>/gi, '')
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<br\s*\/?>/gi, '\n') // Convert <br> to newline
      .replace(/<\/p>/gi, '\n\n') // Convert </p> to double newline
      .replace(/<\/div>/gi, '\n') // Convert </div> to newline
      .replace(/<[^>]+>/g, '') // Strip remaining HTML tags
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/\n\s*\n/g, '\n\n')
      .trim();

    // Wrapping in simple RTF (Rich Text Format) structure for basic compatibility with Word (.doc extension)
    return `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0 Times New Roman;}}
\\f0\\fs24
${text.split('\n').join('\\par\n')}
}`;
  };

  const handleExport = async (format: 'pdf' | 'html' | 'png' | 'docx') => {
    // Check if the component is already exporting
    if (exporting) return;
    
    switch (format) {
      case 'pdf':
        await exportToPDF();
        break;
      case 'png':
        await exportToImage();
        break;
      case 'html':
        await exportToHTML();
        break;
      case 'docx':
        await exportToWord();
        break;
      default:
        Alert.alert('Error', 'Unsupported format');
    }
  };

  return (
    <>
      {/* Export Button - Only show if not using external modal control */}
      {/* Given your previous context, this button should likely be hidden, 
          as the parent component (Layout Header) triggers the export by 
          setting the externalShowModal prop to true. */}
      {externalShowModal === undefined && (
        <TouchableOpacity 
          style={styles.exportButton} 
          onPress={() => setShowModal(true)}
        ><Ionicons name="download-outline" size={24} color="black" /> 
        </TouchableOpacity>
      )}

      {/* Export Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Export Resume</Text>
              <TouchableOpacity 
                onPress={handleCloseModal}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Choose your preferred export format
            </Text>

            <View style={styles.optionsContainer}>
              {exportOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[styles.exportOption, exporting && styles.exportOptionDisabled]}
                  onPress={() => handleExport(option.format)}
                  disabled={exporting}
                >
                  <Text style={styles.optionIcon}>{option.icon}</Text>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                  {exporting && exportingFormat === option.label && (
                    <ActivityIndicator size="small" color="#3b82f6" style={styles.loader} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {exporting && (
              <View style={styles.exportingIndicator}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.exportingText}>
                  Exporting as **{exportingFormat}**...
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.cancelButton, exporting && styles.cancelButtonDisabled]}
              onPress={handleCloseModal}
              disabled={exporting}
            >
              <Text style={[styles.cancelButtonText, exporting && styles.cancelButtonTextDisabled]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  exportButton: {
    shadowColor: '#000',
    
  },
  exportButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  exportButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#6b7280',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  exportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  exportOptionDisabled: { // New style for when exporting is in progress
    opacity: 0.7,
  },
  optionIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  loader: {
    marginLeft: 8,
  },
  exportingIndicator: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  exportingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  cancelButton: {
    marginTop: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cancelButtonDisabled: {
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  cancelButtonTextDisabled: {
    color: '#9ca3af',
  }
});