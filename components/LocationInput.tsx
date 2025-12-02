// components/LocationInput.tsx
// Create this as a new file in your components folder

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator, 
  Alert, 
  StyleSheet 
} from 'react-native';
import { MapPin, Navigation, X } from 'lucide-react-native';
import * as Location from 'expo-location';

interface LocationSuggestion {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface LocationInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  editable?: boolean;
}

export const LocationInput: React.FC<LocationInputProps> = ({ 
  label = "Location",
  value, 
  onChangeText, 
  placeholder = "Enter your location",
  editable = true
}) => {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Debounce timer for search suggestions
  useEffect(() => {
    if (value.length > 2 && editable) {
      const timer = setTimeout(() => {
        fetchLocationSuggestions(value);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value]);

  const fetchLocationSuggestions = async (input: string) => {
    setIsLoading(true);
    try {
      // Using OpenStreetMap Nominatim API (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}&limit=5&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'ReslioApp/1.0'
          }
        }
      );
      const data = await response.json();
      
      // Transform the data to match our interface
      const transformedSuggestions = data.map((item: any) => ({
        place_id: item.place_id,
        description: item.display_name,
        structured_formatting: {
          main_text: item.name || item.display_name.split(',')[0],
          secondary_text: item.display_name.split(',').slice(1).join(',').trim()
        }
      }));
      
      setSuggestions(transformedSuggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      Alert.alert('Error', 'Could not fetch location suggestions. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const detectCurrentLocation = async () => {
    if (!editable) return;
    
    setIsDetectingLocation(true);
    try {
      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to detect your current location. Please enable it in your device settings.'
        );
        setIsDetectingLocation(false);
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Reverse geocode to get address
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        const formattedLocation = [
          address.city || address.subregion,
          address.region,
          address.country
        ].filter(Boolean).join(', ');
        
        onChangeText(formattedLocation);
        Alert.alert('Success', 'Location detected successfully!');
      } else {
        Alert.alert('Error', 'Could not determine your address. Please enter manually.');
      }
    } catch (error) {
      console.error('Error detecting location:', error);
      Alert.alert('Error', 'Could not detect your location. Please try again or enter manually.');
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const selectSuggestion = (suggestion: LocationSuggestion) => {
    const locationText = `${suggestion.structured_formatting.main_text}, ${suggestion.structured_formatting.secondary_text}`;
    onChangeText(locationText);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const clearLocation = () => {
    if (!editable) return;
    onChangeText('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      <View style={styles.inputContainer}>
        <View style={[styles.inputWrapper, !editable && styles.inputDisabled]}>
          <MapPin color="#667eea" size={20} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#999"
            editable={editable}
            onFocus={() => value.length > 2 && editable && setShowSuggestions(true)}
          />
          {value.length > 0 && editable && (
            <TouchableOpacity onPress={clearLocation} style={styles.clearButton}>
              <X color="#999" size={18} />
            </TouchableOpacity>
          )}
          {isLoading && <ActivityIndicator size="small" color="#667eea" style={styles.loader} />}
        </View>

        {editable && (
          <TouchableOpacity 
            style={[styles.detectButton, isDetectingLocation && styles.detectButtonDisabled]} 
            onPress={detectCurrentLocation}
            disabled={isDetectingLocation}
          >
            {isDetectingLocation ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Navigation color="#fff" size={18} />
                <Text style={styles.detectButtonText}>Detect</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.place_id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => selectSuggestion(item)}
              >
                <MapPin color="#667eea" size={16} style={styles.suggestionIcon} />
                <View style={styles.suggestionTextContainer}>
                  <Text style={styles.suggestionMainText}>
                    {item.structured_formatting.main_text}
                  </Text>
                  <Text style={styles.suggestionSecondaryText} numberOfLines={1}>
                    {item.structured_formatting.secondary_text}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            scrollEnabled={true}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}

      {editable && (
        <Text style={styles.helperText}>
          Click "Detect" to automatically find your location or type manually
        </Text>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 15,
  },
  inputDisabled: {
    backgroundColor: '#f9f9f9',
    opacity: 0.7,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 5,
  },
  loader: {
    marginLeft: 5,
  },
  detectButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 90,
    justifyContent: 'center',
  },
  detectButtonDisabled: {
    opacity: 0.6,
  },
  detectButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  suggestionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 5,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionIcon: {
    marginRight: 10,
  },
  suggestionTextContainer: {
    flex: 1,
  },
  suggestionMainText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
    marginBottom: 2,
  },
  suggestionSecondaryText: {
    fontSize: 13,
    color: '#666',
  },
  helperText: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
    fontStyle: 'italic',
  },
});