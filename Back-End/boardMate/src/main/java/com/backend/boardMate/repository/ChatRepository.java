package com.backend.boardMate.repository;

import com.backend.boardMate.model.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {
    List<Chat> findByStudentId(Long studentId);
    List<Chat> findByLandlordId(Long landlordId);
    Optional<Chat> findByStudentIdAndLandlordIdAndPropertyId(Long studentId, Long landlordId, Long propertyId);
}