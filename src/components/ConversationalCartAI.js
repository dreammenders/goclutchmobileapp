import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Spacing } from '../constants/Spacing';
import { useCart } from '../context/CartContext';

const ConversationalCartAI = ({ isVisible, onClose }) => {
  const { addToCart } = useCart();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hi! I\'m your smart cart assistant. I can help you find and add car services. What are you looking for today?',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef(null);

  // Mock AI responses based on user input
  const getAIResponse = (userInput) => {
    const input = userInput.toLowerCase();

    if (input.includes('ac') || input.includes('air conditioning')) {
      return {
        text: 'I found AC Service for ₹999 (was ₹1200). This includes gas refill, filter cleaning, and performance test. Would you like me to add it to your cart?',
        suggestions: [
          { text: 'Yes, add AC Service', action: 'add_service', serviceId: '1' },
          { text: 'Show me details', action: 'show_details', serviceId: '1' },
          { text: 'Something else', action: 'continue' }
        ]
      };
    }

    if (input.includes('oil') || input.includes('change')) {
      return {
        text: 'Oil Change service is available for ₹650. Includes synthetic oil, filter replacement, and fluid check. Add to cart?',
        suggestions: [
          { text: 'Add Oil Change', action: 'add_service', serviceId: '2' },
          { text: 'Bundle with AC service', action: 'bundle', services: ['1', '2'] },
          { text: 'No thanks', action: 'continue' }
        ]
      };
    }

    if (input.includes('wash') || input.includes('clean')) {
      return {
        text: 'Car Wash & Wax for ₹399 (20% off). Professional foam wash with wax coating. Interested?',
        suggestions: [
          { text: 'Add Car Wash', action: 'add_service', serviceId: '3' },
          { text: 'Monthly subscription?', action: 'subscription' },
          { text: 'Maybe later', action: 'continue' }
        ]
      };
    }

    if (input.includes('brake') || input.includes('inspection')) {
      return {
        text: 'Brake Inspection available for ₹499. Complete brake system check with 6-month warranty.',
        suggestions: [
          { text: 'Add Brake Inspection', action: 'add_service', serviceId: '4' },
          { text: 'Emergency service?', action: 'emergency' },
          { text: 'Not now', action: 'continue' }
        ]
      };
    }

    if (input.includes('help') || input.includes('what')) {
      return {
        text: 'I can help you find services like: AC Service, Oil Change, Car Wash, Brake Inspection, Tire Replacement, and more. Just tell me what you need!',
        suggestions: [
          { text: 'Show popular services', action: 'popular' },
          { text: 'Emergency services', action: 'emergency' },
          { text: 'Browse all', action: 'browse' }
        ]
      };
    }

    return {
      text: 'I\'m here to help you find the perfect car services. Try asking about "AC service", "oil change", "car wash", or "brake inspection". What would you like?',
      suggestions: [
        { text: 'Popular services', action: 'popular' },
        { text: 'Emergency help', action: 'emergency' },
        { text: 'Browse catalog', action: 'browse' }
      ]
    };
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const aiResponse = getAIResponse(inputText);
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: aiResponse.text,
        suggestions: aiResponse.suggestions,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSuggestionPress = (suggestion) => {
    switch (suggestion.action) {
      case 'add_service':
        // Mock service data
        const mockService = {
          id: suggestion.serviceId,
          name: getServiceName(suggestion.serviceId),
          price: getServicePrice(suggestion.serviceId),
          discountPrice: getServicePrice(suggestion.serviceId),
        };
        addToCart(mockService);
        break;

      case 'show_details':
        Alert.alert('Service Details', 'Opening detailed view...');
        break;

      case 'bundle':
        // Bundle logic here
        break;

      case 'popular':
        setMessages(prev => [...prev, {
          id: messages.length + 1,
          type: 'bot',
          text: 'Popular services: AC Service (₹999), Oil Change (₹650), Car Wash (₹399), Brake Inspection (₹499)',
          timestamp: new Date(),
        }]);
        break;

      case 'emergency':
        Alert.alert('Emergency Service', 'Call our 24/7 helpline: +91-9876543210');
        break;

      case 'browse':
        onClose(); // Close AI chat and show browse view
        break;

      default:
        break;
    }
  };

  const getServiceName = (id) => {
    const services = {
      '1': 'AC Service',
      '2': 'Oil Change',
      '3': 'Car Wash & Wax',
      '4': 'Brake Inspection',
    };
    return services[id] || 'Service';
  };

  const getServicePrice = (id) => {
    const prices = {
      '1': 999,
      '2': 650,
      '3': 399,
      '4': 499,
    };
    return prices[id] || 0;
  };

  const renderMessage = (message) => (
    <View key={message.id} style={[
      styles.messageContainer,
      message.type === 'user' ? styles.userMessage : styles.botMessage
    ]}>
      <Text style={[
        styles.messageText,
        message.type === 'user' ? styles.userMessageText : styles.botMessageText
      ]}>
        {message.text}
      </Text>

      {message.suggestions && (
        <View style={styles.suggestionsContainer}>
          {message.suggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionButton}
              onPress={() => handleSuggestionPress(suggestion)}
            >
              <Text style={styles.suggestionText}>{suggestion.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text style={styles.timestamp}>
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  if (!isVisible) return null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.aiIcon}>
            <MaterialCommunityIcons name="robot" size={20} color={Colors.PRIMARY} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Smart Cart Assistant</Text>
            <Text style={styles.headerSubtitle}>Ask me anything about services</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={Colors.TEXT_PRIMARY} />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map(renderMessage)}

        {isTyping && (
          <View style={[styles.messageContainer, styles.botMessage]}>
            <View style={styles.typingIndicator}>
              <View style={styles.typingDot} />
              <View style={[styles.typingDot, styles.typingDotDelay]} />
              <View style={[styles.typingDot, styles.typingDotDelay2]} />
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Ask about services..."
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSendMessage}
          returnKeyType="send"
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          disabled={!inputText.trim()}
        >
          <Ionicons
            name="send"
            size={20}
            color={inputText.trim() ? Colors.LIGHT_BACKGROUND : Colors.TEXT_MUTED}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.PAGE_BACKGROUND,
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.M,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER_LIGHT,
    backgroundColor: Colors.CARD_BACKGROUND,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.PRIMARY_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.M,
  },
  headerTitle: {
    fontSize: Typography.BODY_L,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
  },
  headerSubtitle: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
  },
  closeButton: {
    padding: Spacing.S,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: Spacing.M,
  },
  messageContainer: {
    marginBottom: Spacing.M,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.PRIMARY,
    borderRadius: Spacing.BORDER_RADIUS_M,
    borderBottomRightRadius: Spacing.XS,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.CARD_BACKGROUND,
    borderRadius: Spacing.BORDER_RADIUS_M,
    borderBottomLeftRadius: Spacing.XS,
  },
  messageText: {
    fontSize: Typography.BODY_M,
    padding: Spacing.M,
  },
  userMessageText: {
    color: Colors.LIGHT_BACKGROUND,
  },
  botMessageText: {
    color: Colors.TEXT_PRIMARY,
  },
  suggestionsContainer: {
    paddingHorizontal: Spacing.M,
    paddingBottom: Spacing.M,
  },
  suggestionButton: {
    backgroundColor: Colors.SECTION_BACKGROUND,
    borderRadius: Spacing.BORDER_RADIUS_S,
    paddingHorizontal: Spacing.M,
    paddingVertical: Spacing.S,
    marginBottom: Spacing.XS,
  },
  suggestionText: {
    fontSize: Typography.BODY_S,
    color: Colors.PRIMARY,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: Typography.BODY_XS,
    color: Colors.TEXT_MUTED,
    paddingHorizontal: Spacing.M,
    paddingBottom: Spacing.XS,
  },
  typingIndicator: {
    flexDirection: 'row',
    padding: Spacing.M,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.TEXT_MUTED,
    marginRight: Spacing.XS,
    opacity: 0.7,
  },
  typingDotDelay: {
    animationDelay: '0.2s',
  },
  typingDotDelay2: {
    animationDelay: '0.4s',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: Spacing.M,
    backgroundColor: Colors.CARD_BACKGROUND,
    borderTopWidth: 1,
    borderTopColor: Colors.BORDER_LIGHT,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.BORDER_LIGHT,
    borderRadius: Spacing.BORDER_RADIUS_M,
    paddingHorizontal: Spacing.M,
    paddingVertical: Spacing.S,
    marginRight: Spacing.M,
    fontSize: Typography.BODY_M,
    color: Colors.TEXT_PRIMARY,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.TEXT_MUTED,
  },
});

export default ConversationalCartAI;