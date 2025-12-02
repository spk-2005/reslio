// UPDATED TOOLBAR - Remove the Edit button and modal
// Replace your ResumeEditorToolbar component

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useState, useEffect } from 'react';

interface ToolbarProps {
  isVisible: boolean;
  selectedElement: {
    content: string;
    fontSize: number;
    fontWeight: string;
    color: string;
    textAlign: string;
    fontFamily: string;
    lineHeight: number;
  } | null;
  onApply: (styles: any) => void;
  onClose: () => void;
}

export default function ResumeEditorToolbar({ 
  isVisible, 
  selectedElement, 
  onApply, 
  onClose, 
}: ToolbarProps) {
  const [editState, setEditState] = useState(selectedElement);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  useEffect(() => {
    if (selectedElement) {
      console.log('Toolbar received new selection:', selectedElement.content?.substring(0, 50));
      setEditState(selectedElement);
    }
  }, [selectedElement]);

  if (!isVisible || !editState) return null;

  const applyChange = (newState: any) => {
    console.log('Applying change:', newState);
    setEditState(newState);
    onApply(newState);
  };

  const ToolButton = ({ icon, label, onPress, isActive = false }: any) => (
    <TouchableOpacity style={styles.toolButton} onPress={onPress}>
      <View style={[styles.iconCircle, isActive && styles.iconCircleActive]}>
        <Text style={[styles.iconText, isActive && styles.iconTextActive]}>{icon}</Text>
      </View>
      <Text style={styles.toolLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={styles.toolbar}>
        <View style={styles.editHintBanner}>
          <Text style={styles.editHintText}>💡 Double-click any text to edit directly</Text>
        </View>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.toolbarContent}
        >
          {/* Font Size */}
          <ToolButton
            icon={editState.fontSize.toString()}
            label="Size"
            onPress={() => setActiveModal('size')}
            isActive={activeModal === 'size'}
          />

          {/* Font Family */}
          <ToolButton
            icon="Aa"
            label="Font"
            onPress={() => setActiveModal('font')}
            isActive={activeModal === 'font'}
          />

          {/* Alignment */}
          <ToolButton
            icon="≡"
            label="Align"
            onPress={() => setActiveModal('align')}
            isActive={activeModal === 'align'}
          />

          {/* Bold */}
          <ToolButton
            icon="B"
            label="Weight"
            onPress={() => setActiveModal('weight')}
            isActive={activeModal === 'weight'}
          />

          {/* Color */}
          <ToolButton
            icon="●"
            label="Color"
            onPress={() => setActiveModal('color')}
            isActive={activeModal === 'color'}
          />

          {/* Line Height */}
          <ToolButton
            icon="⇅"
            label="Spacing"
            onPress={() => setActiveModal('spacing')}
            isActive={activeModal === 'spacing'}
          />

          {/* Divider */}
          <View style={styles.divider} />

       
          {/* Close Button */}
          <TouchableOpacity style={styles.closeToolButton} onPress={onClose}>
            <Text style={styles.closeToolButtonText}>✕</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Font Size Modal */}
      <Modal
        visible={activeModal === 'size'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          activeOpacity={1}
          onPress={() => setActiveModal(null)}
        >
          <View style={styles.popupMenu}>
            <Text style={styles.popupTitle}>Font Size</Text>
            <View style={styles.sizeGrid}>
              {[10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48].map(size => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizeBox,
                    editState.fontSize === size && styles.sizeBoxActive
                  ]}
                  onPress={() => {
                    const newState = { ...editState, fontSize: size };
                    applyChange(newState);
                    setActiveModal(null);
                  }}
                >
                  <Text style={[
                    styles.sizeBoxText,
                    editState.fontSize === size && styles.sizeBoxTextActive
                  ]}>{size}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Font Family Modal */}
      <Modal
        visible={activeModal === 'font'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          activeOpacity={1}
          onPress={() => setActiveModal(null)}
        >
          <View style={styles.popupMenu}>
            <Text style={styles.popupTitle}>Font Family</Text>
            <View style={styles.optionList}>
              {['Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Courier New', 'Verdana', 'Trebuchet MS', 'Palatino'].map(font => (
                <TouchableOpacity
                  key={font}
                  style={[
                    styles.optionItem,
                    editState.fontFamily === font && styles.optionItemActive
                  ]}
                  onPress={() => {
                    const newState = { ...editState, fontFamily: font };
                    applyChange(newState);
                    setActiveModal(null);
                  }}
                >
                  <Text style={[
                    styles.optionText,
                    editState.fontFamily === font && styles.optionTextActive
                  ]}>{font}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Alignment Modal */}
      <Modal
        visible={activeModal === 'align'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          activeOpacity={1}
          onPress={() => setActiveModal(null)}
        >
          <View style={styles.popupMenu}>
            <Text style={styles.popupTitle}>Text Alignment</Text>
            <View style={styles.alignGrid}>
              {[
                { value: 'left', icon: '⬅', label: 'Left' },
                { value: 'center', icon: '↔', label: 'Center' },
                { value: 'right', icon: '➡', label: 'Right' },
                { value: 'justify', icon: '⬌', label: 'Justify' }
              ].map(align => (
                <TouchableOpacity
                  key={align.value}
                  style={[
                    styles.alignBox,
                    editState.textAlign === align.value && styles.alignBoxActive
                  ]}
                  onPress={() => {
                    const newState = { ...editState, textAlign: align.value };
                    applyChange(newState);
                    setActiveModal(null);
                  }}
                >
                  <Text style={[
                    styles.alignIcon,
                    editState.textAlign === align.value && styles.alignIconActive
                  ]}>{align.icon}</Text>
                  <Text style={[
                    styles.alignLabel,
                    editState.textAlign === align.value && styles.alignLabelActive
                  ]}>{align.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Font Weight Modal */}
      <Modal
        visible={activeModal === 'weight'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          activeOpacity={1}
          onPress={() => setActiveModal(null)}
        >
          <View style={styles.popupMenu}>
            <Text style={styles.popupTitle}>Font Weight</Text>
            <View style={styles.optionList}>
              {[
                { value: 'normal', label: 'Regular' },
                { value: '600', label: 'Semibold' },
                { value: 'bold', label: 'Bold' },
                { value: '700', label: 'Extra Bold' },
                { value: '800', label: 'Heavy' }
              ].map(weight => (
                <TouchableOpacity
                  key={weight.value}
                  style={[
                    styles.optionItem,
                    editState.fontWeight === weight.value && styles.optionItemActive
                  ]}
                  onPress={() => {
                    const newState = { ...editState, fontWeight: weight.value };
                    applyChange(newState);
                    setActiveModal(null);
                  }}
                >
                  <Text style={[
                    styles.optionText,
                    editState.fontWeight === weight.value && styles.optionTextActive
                  ]}>{weight.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Color Modal */}
      <Modal
        visible={activeModal === 'color'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          activeOpacity={1}
          onPress={() => setActiveModal(null)}
        >
          <View style={styles.popupMenu}>
            <Text style={styles.popupTitle}>Text Color</Text>
            <View style={styles.colorGrid}>
              {[
                { color: '#000000', name: 'Black' },
                { color: '#1f2937', name: 'Gray 900' },
                { color: '#374151', name: 'Gray 700' },
                { color: '#6b7280', name: 'Gray 500' },
                { color: '#2563eb', name: 'Blue' },
                { color: '#dc2626', name: 'Red' },
                { color: '#16a34a', name: 'Green' },
                { color: '#ea580c', name: 'Orange' },
                { color: '#9333ea', name: 'Purple' },
                { color: '#0891b2', name: 'Cyan' },
                { color: '#ca8a04', name: 'Yellow' },
                { color: '#be123c', name: 'Rose' }
              ].map(item => (
                <TouchableOpacity
                  key={item.color}
                  style={[
                    styles.colorBox,
                    editState.color === item.color && styles.colorBoxActive
                  ]}
                  onPress={() => {
                    const newState = { ...editState, color: item.color };
                    applyChange(newState);
                    setActiveModal(null);
                  }}
                >
                  <View style={[styles.colorCircle, { backgroundColor: item.color }]} />
                  <Text style={styles.colorName}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Line Spacing Modal */}
      <Modal
        visible={activeModal === 'spacing'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          activeOpacity={1}
          onPress={() => setActiveModal(null)}
        >
          <View style={styles.popupMenu}>
            <Text style={styles.popupTitle}>Line Spacing</Text>
            <View style={styles.spacingList}>
              {[1, 1.15, 1.5, 1.75, 2, 2.5, 3].map(spacing => (
                <TouchableOpacity
                  key={spacing}
                  style={[
                    styles.optionItem,
                    editState.lineHeight === spacing && styles.optionItemActive
                  ]}
                  onPress={() => {
                    const newState = { ...editState, lineHeight: spacing };
                    applyChange(newState);
                    setActiveModal(null);
                  }}
                >
                  <Text style={[
                    styles.optionText,
                    editState.lineHeight === spacing && styles.optionTextActive
                  ]}>{spacing}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  editHintBanner: {
    backgroundColor: '#eff6ff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#dbeafe',
  },
  editHintText: {
    fontSize: 12,
    color: '#1e40af',
    fontWeight: '600',
    textAlign: 'center',
  },
  toolbarContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 4,
    alignItems: 'center',
  },
  toolButton: {
    alignItems: 'center',
    marginHorizontal: 8,
    minWidth: 60,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  iconCircleActive: {
    backgroundColor: '#3b82f6',
  },
  iconText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
  },
  iconTextActive: {
    color: '#ffffff',
  },
  toolLabel: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 48,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 12,
  },
  historyButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  historyButtonDisabled: {
    backgroundColor: '#e5e7eb',
    opacity: 0.5,
  },
  historyButtonText: {
    fontSize: 24,
    color: '#374151',
    fontWeight: '600',
  },
  historyButtonTextDisabled: {
    color: '#9ca3af',
  },
  closeToolButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  closeToolButtonText: {
    fontSize: 20,
    color: '#dc2626',
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  popupMenu: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  sizeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  sizeBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sizeBoxActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#3b82f6',
  },
  sizeBoxText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  sizeBoxTextActive: {
    color: '#ffffff',
  },
  optionList: {
    gap: 8,
  },
  optionItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  optionItemActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  optionTextActive: {
    color: '#3b82f6',
  },
  alignGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  alignBox: {
    width: '48%',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    alignItems: 'center',
  },
  alignBoxActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  alignIcon: {
    fontSize: 24,
    color: '#6b7280',
    marginBottom: 6,
  },
  alignIconActive: {
    color: '#3b82f6',
  },
  alignLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  alignLabelActive: {
    color: '#3b82f6',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colorBox: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  colorBoxActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  colorName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  spacingList: {
    gap: 8,
  },
});