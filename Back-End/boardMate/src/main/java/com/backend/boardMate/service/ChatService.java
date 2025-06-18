package com.backend.boardMate.service;

import com.backend.boardMate.model.Chat;
import com.backend.boardMate.model.Message;
import com.backend.boardMate.model.Property;
import com.backend.boardMate.model.User;
import com.backend.boardMate.repository.ChatRepository;
import com.backend.boardMate.repository.MessageRepository;
import com.backend.boardMate.repository.PropertyRepository;
import com.backend.boardMate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private PropertyService propertyService;

    // Start a new chat or get existing one
    public Chat startChat(Long studentId, Long landlordId, Long propertyId) {
        // Verify users and property exist
        // User student = userRepository.findById(studentId)
        //         .orElseThrow(() -> new RuntimeException("Student not found"));

        // User landlord = userRepository.findById(landlordId)
        //         .orElseThrow(() -> new RuntimeException("Landlord not found"));

        // Property property = propertyRepository.findById(propertyId)
        //         .orElseThrow(() -> new RuntimeException("Property not found"));

        // Check if chat already exists
        Optional<Chat> existingChat = chatRepository.findByStudentIdAndLandlordIdAndPropertyId(
                studentId, landlordId, propertyId);

        if (existingChat.isPresent()) {
            return existingChat.get();
        }

        // Create new chat
        Chat chat = new Chat();
        chat.setStudentId(studentId);
        chat.setLandlordId(landlordId);
        chat.setPropertyId(propertyId);

        propertyService.updatePropertyInquiryCount(propertyId);

        return chatRepository.save(chat);
    }

    // Get all chats for a student
    public List<Chat> getStudentChats(Long studentId) {
        return chatRepository.findByStudentId(studentId);
    }

    // Get all chats for a landlord
    public List<Chat> getLandlordChats(Long landlordId) {
        return chatRepository.findByLandlordId(landlordId);
    }

    // Get student chats with details (property info, unread count, last message)
    public List<Map<String, Object>> getStudentChatsWithDetails(Long studentId) {
        List<Chat> chats = getStudentChats(studentId);
        return getChatsWithDetails(chats, studentId);
    }

    // Get landlord chats with details (property info, unread count, last message)
    public List<Map<String, Object>> getLandlordChatsWithDetails(Long landlordId) {
        List<Chat> chats = getLandlordChats(landlordId);
        return getChatsWithDetails(chats, landlordId);
    }

    // Helper method to get details for a list of chats
    private List<Map<String, Object>> getChatsWithDetails(List<Chat> chats, Long userId) {
        return chats.stream().map(chat -> {
            Map<String, Object> chatDetails = new HashMap<>();
            chatDetails.put("chat", chat);

            // Get property details
            propertyRepository.findById(chat.getPropertyId()).ifPresent(property -> {
                Map<String, Object> propertyDetails = new HashMap<>();
                propertyDetails.put("id", property.getId());
                propertyDetails.put("title", property.getTitle());
                propertyDetails.put("location", property.getLocation());
                propertyDetails.put("price", property.getPrice());
                // if (property.getImageUrls() != null && !property.getImageUrls().isEmpty()) {
                //     propertyDetails.put("thumbnail", property.getImageUrls().get(0));
                // }
                chatDetails.put("property", propertyDetails);
            });

            // Get user details (other participant)
            Long otherUserId = userId.equals(chat.getStudentId()) ? chat.getLandlordId() : chat.getStudentId();
            userRepository.findById(otherUserId).ifPresent(user -> {
                Map<String, Object> userDetails = new HashMap<>();
                userDetails.put("id", user.getId());
                userDetails.put("name", user.getFirstName() + " " + user.getLastName());
                userDetails.put("email", user.getEmail());
                chatDetails.put("participant", userDetails);
            });

            // Get unread count
            int unreadCount = getUnreadMessageCount(chat.getId(), userId);
            chatDetails.put("unreadCount", unreadCount);

            // Get last message
            Message lastMessage = messageRepository.findLatestMessageByChatId(chat.getId());
            if (lastMessage != null) {
                Map<String, Object> messageDetails = new HashMap<>();
                messageDetails.put("id", lastMessage.getId());
                messageDetails.put("content", lastMessage.getContent());
                messageDetails.put("timestamp", lastMessage.getTimestamp());
                messageDetails.put("senderId", lastMessage.getSenderId());
                messageDetails.put("senderType", lastMessage.getSenderType());
                messageDetails.put("isRead", lastMessage.isRead());
                chatDetails.put("lastMessage", messageDetails);
            }

            return chatDetails;
        }).sorted((chat1, chat2) -> {
            // Sort by last message timestamp (most recent first)
            Map<String, Object> lastMsg1 = (Map<String, Object>) chat1.get("lastMessage");
            Map<String, Object> lastMsg2 = (Map<String, Object>) chat2.get("lastMessage");

            if (lastMsg1 == null && lastMsg2 == null) return 0;
            if (lastMsg1 == null) return 1;
            if (lastMsg2 == null) return -1;

            return ((Date)lastMsg2.get("timestamp")).compareTo((Date)lastMsg1.get("timestamp"));
        }).collect(Collectors.toList());
    }

    // Get a specific chat by ID
    public Chat getChatById(Long chatId) {
        return chatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Chat not found"));
    }

    // Send a message
    public Message sendMessage(Long chatId, Long senderId, String senderType, String content) {
        Chat chat = getChatById(chatId);

        Message message = new Message();
        message.setChat(chat);
        message.setSenderId(senderId);
        message.setSenderType(senderType);
        message.setContent(content);

        return messageRepository.save(message);
    }

    // Get all messages in a chat
    public List<Message> getChatMessages(Long chatId) {
        // Verify chat exists
        getChatById(chatId);
        return messageRepository.findByChatIdOrderByTimestampAsc(chatId);
    }

    // Mark messages as read
    public void markMessagesAsRead(Long chatId, Long userId) {
        List<Message> messages = messageRepository.findByChatIdOrderByTimestampAsc(chatId);

        messages.stream()
                .filter(message -> !message.getSenderId().equals(userId) && !message.isRead())
                .forEach(message -> {
                    message.setRead(true);
                    messageRepository.save(message);
                });
    }

    // Get unread message count for a specific chat
    public int getUnreadMessageCount(Long chatId, Long userId) {
        return messageRepository.countByChatIdAndSenderIdNotAndIsReadFalse(chatId, userId);
    }

    // Get total unread message count across all chats
    public int getTotalUnreadMessageCount(Long userId) {
        return messageRepository.countUnreadMessagesForUser(userId);
    }
}