package com.backend.boardMate.repository;

import com.backend.boardMate.model.VirtualTour;
// import com.backend.boardMate.entity.VirtualTour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VirtualTourRepository extends JpaRepository<VirtualTour, Long> {
}