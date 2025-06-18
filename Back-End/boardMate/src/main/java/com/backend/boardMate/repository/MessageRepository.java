package com.backend.boardMate.repository;

import com.backend.boardMate.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByChatIdOrderByTimestampAsc(Long chatId);
    int countByChatIdAndSenderIdNotAndIsReadFalse(Long chatId, Long userId);

    // Get the latest message from each chat
    @Query("SELECT m FROM Message m WHERE m.id = (SELECT MAX(m2.id) FROM Message m2 WHERE m2.chat.id = m.chat.id) AND m.chat.id = :chatId")
    Message findLatestMessageByChatId(@Param("chatId") Long chatId);

    // Count unread messages for a user across all chats
    @Query("SELECT COUNT(m) FROM Message m JOIN m.chat c WHERE m.isRead = false AND m.senderId != :userId AND (c.studentId = :userId OR c.landlordId = :userId)")
    int countUnreadMessagesForUser(@Param("userId") Long userId);

    // Get the last message for each chat involving the user
    @Query("SELECT m FROM Message m WHERE m.id IN " +
            "(SELECT MAX(m2.id) FROM Message m2 JOIN m2.chat c WHERE c.studentId = :userId OR c.landlordId = :userId GROUP BY c.id)")
    List<Message> findLatestMessagesForUser(@Param("userId") Long userId);
}