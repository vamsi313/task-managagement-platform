package com.taskmgmt.repository;

import com.taskmgmt.model.Task;
import com.taskmgmt.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    // Find tasks where the user is either the creator or the assignee
    List<Task> findByCreatedByOrAssignedTo(User createdBy, User assignedTo);

    @Query("SELECT t FROM Task t WHERE t.createdBy.id = :userId OR t.assignedTo.id = :userId ORDER BY t.createdAt DESC")
    List<Task> findAllAccessibleToUser(@Param("userId") Long userId);

    List<Task> findAllByOrderByCreatedAtDesc();
}
