import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

const Card = ({ 
  children, 
  onPress, 
  style, 
  elevation = 2, 
  cornerRadius = 8,
  disabled = false 
}) => {
  const cardContent = (
    <View 
      style={[
        styles.card, 
        { borderRadius: cornerRadius },
        elevation > 0 && { elevation },
        style
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity 
        activeOpacity={0.8} 
        onPress={onPress}
        disabled={disabled}
        style={styles.touchable}
      >
        {cardContent}
      </TouchableOpacity>
    );
  }

  return cardContent;
};

const styles = StyleSheet.create({
  touchable: {
    overflow: 'hidden',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default Card;