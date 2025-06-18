package com.backend.boardMate.controller;

import com.backend.boardMate.model.Chat;
import com.backend.boardMate.model.Message;
import com.backend.boardMate.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chats")
public class ChatController {

    @Autowired
    private ChatService chatService;

    // Start a new chat or get existing chat
    @PostMapping("/start")
    public ResponseEntity<Chat> startChat(@RequestBody Map<String, Long> request) {
        Long studentId = request.get("studentId");
        Long landlordId = request.get("landlordId");
        Long propertyId = request.get("propertyId");

        Chat chat = chatService.startChat(studentId, landlordId, propertyId);
        return ResponseEntity.ok(chat);
    }

    // Get all chats for a student
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Map<String, Object>>> getStudentChats(@PathVariable Long studentId) {
        List<Map<String, Object>> chats = chatService.getStudentChatsWithDetails(studentId);
        return ResponseEntity.ok(chats);
    }

    // Get all chats for a landlord
    @GetMapping("/landlord/{landlordId}")
    public ResponseEntity<List<Map<String, Object>>> getLandlordChats(@PathVariable Long landlordId) {
        List<Map<String, Object>> chats = chatService.getLandlordChatsWithDetails(landlordId);
        return ResponseEntity.ok(chats);
    }

    // Get a specific chat by ID
    @GetMapping("/{chatId}")
    public ResponseEntity<Chat> getChatById(@PathVariable Long chatId) {
        Chat chat = chatService.getChatById(chatId);
        return ResponseEntity.ok(chat);
    }

    // Get all messages in a chat
    @GetMapping("/{chatId}/messages")
    public ResponseEntity<List<Message>> getChatMessages(@PathVariable Long chatId) {
        List<Message> messages = chatService.getChatMessages(chatId);
        return ResponseEntity.ok(messages);
    }

    // Send a message
    @PostMapping("/{chatId}/messages")
    public ResponseEntity<Message> sendMessage(
            @PathVariable Long chatId,
            @RequestBody Map<String, Object> request) {

        Long senderId = Long.valueOf(request.get("senderId").toString());
        String senderType = (String) request.get("senderType");
        String content = (String) request.get("content");

        Message message = chatService.sendMessage(chatId, senderId, senderType, content);
        return ResponseEntity.ok(message);
    }

    // Mark messages as read
    @PostMapping("/{chatId}/read")
    public ResponseEntity<Map<String, String>> markMessagesAsRead(
            @PathVariable Long chatId,
            @RequestBody Map<String, Long> request) {

        Long userId = request.get("userId");
        chatService.markMessagesAsRead(chatId, userId);

        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Messages marked as read");

        return ResponseEntity.ok(response);
    }

    // Get unread message count for a user in a specific chat
    @GetMapping("/{chatId}/unread/{userId}")
    public ResponseEntity<Map<String, Integer>> getUnreadMessageCount(
            @PathVariable Long chatId,
            @PathVariable Long userId) {

        int count = chatService.getUnreadMessageCount(chatId, userId);

        Map<String, Integer> response = new HashMap<>();
        response.put("unreadCount", count);

        return ResponseEntity.ok(response);
    }

    // Get unread message count for a user across all chats
    @GetMapping("/unread/user/{userId}")
    public ResponseEntity<Map<String, Integer>> getTotalUnreadMessageCount(@PathVariable Long userId) {
        int count = chatService.getTotalUnreadMessageCount(userId);

        Map<String, Integer> response = new HashMap<>();
        response.put("totalUnreadCount", count);

        return ResponseEntity.ok(response);
    }
}