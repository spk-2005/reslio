// components/DatePickerInput.tsx
// Create this as a new file in your components folder

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  Platform 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'lucide-react-native';

interface DatePickerInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  editable?: boolean;
  mode?: 'date' | 'month';
}

export const DatePickerInput: React.FC<DatePickerInputProps> = ({ 
  label,
  value, 
  onChangeText, 
  placeholder = "Select date",
  editable = true,
  mode = 'month' // Default to month picker for experience dates
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState(new Date());

  // Parse existing value to Date if it exists
  const parseDate = (dateString: string): Date => {
    if (!dateString || dateString === 'Present') return new Date();
    
    // Try to parse various date formats
    const formats = [
      // "Jan 2020" format
      /^([A-Za-z]+)\s+(\d{4})$/,
      // "January 2020" format
      /^([A-Za-z]+)\s+(\d{4})$/,
      // "2020-01" format
      /^(\d{4})-(\d{2})$/,
    ];

    for (const format of formats) {
      const match = dateString.match(format);
      if (match) {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const fullMonthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        let month = 0;
        let year = 0;

        if (format.source.includes('A-Za-z')) {
          // Month name format
          const monthStr = match[1];
          month = monthNames.findIndex(m => monthStr.startsWith(m));
          if (month === -1) {
            month = fullMonthNames.findIndex(m => monthStr.toLowerCase() === m.toLowerCase());
          }
          year = parseInt(match[2]);
        } else {
          // Numeric format (YYYY-MM)
          year = parseInt(match[1]);
          month = parseInt(match[2]) - 1;
        }

        return new Date(year, month, 1);
      }
    }

    return new Date();
  };

  const formatDate = (selectedDate: Date): string => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[selectedDate.getMonth()];
    const year = selectedDate.getFullYear();
    return `${month} ${year}`;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios'); // Keep picker open on iOS
    
    if (selectedDate) {
      setDate(selectedDate);
      const formattedDate = formatDate(selectedDate);
      onChangeText(formattedDate);
    }
  };

  const handlePress = () => {
    if (!editable) return;
    
    // Parse existing value if available
    if (value && value !== 'Present') {
      setDate(parseDate(value));
    }
    
    setShowPicker(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity 
        style={[styles.dateButton, !editable && styles.dateButtonDisabled]} 
        onPress={handlePress}
        disabled={!editable}
      >
        <Calendar color="#667eea" size={20} style={styles.icon} />
        <Text style={[styles.dateText, !value && styles.placeholder]}>
          {value || placeholder}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    fontWeight: '500',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dateButtonDisabled: {
    backgroundColor: '#f9f9f9',
    opacity: 0.7,
  },
  icon: {
    marginRight: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  placeholder: {
    color: '#999',
  },
});