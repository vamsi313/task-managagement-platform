package com.taskmgmt.service;

import com.taskmgmt.dto.*;
import com.taskmgmt.exception.ResourceNotFoundException;
import com.taskmgmt.exception.UnauthorizedException;
import com.taskmgmt.model.Role;
import com.taskmgmt.model.Task;
import com.taskmgmt.model.User;
import com.taskmgmt.repository.TaskRepository;
import com.taskmgmt.repository.UserRepository;
import com.taskmgmt.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    public List<TaskResponse> getAccessibleTasks(UserPrincipal currentUser) {
        List<Task> tasks;
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() == Role.ADMIN) {
            tasks = taskRepository.findAllByOrderByCreatedAtDesc();
        } else {
            tasks = taskRepository.findAllAccessibleToUser(user.getId());
        }

        return tasks.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public TaskResponse getTaskById(Long id, UserPrincipal currentUser) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check if user has permission to view this task
        if (user.getRole() != Role.ADMIN &&
            !task.getCreatedBy().getId().equals(user.getId()) &&
            (task.getAssignedTo() == null || !task.getAssignedTo().getId().equals(user.getId()))) {
            throw new UnauthorizedException("You do not have access to view this task");
        }

        return mapToResponse(task);
    }

    public TaskResponse createTask(TaskRequest taskRequest, UserPrincipal currentUser) {
        User creator = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        User assignee = null;
        if (taskRequest.getAssignedTo() != null) {
            assignee = userRepository.findById(taskRequest.getAssignedTo())
                    .orElse(null);
        }

        Task task = new Task(
                taskRequest.getTitle(),
                taskRequest.getDescription(),
                taskRequest.getPriority(),
                taskRequest.getDueDate(),
                creator,
                assignee
        );

        Task savedTask = taskRepository.save(task);
        return mapToResponse(savedTask);
    }

    public TaskResponse updateTask(Long id, TaskUpdateRequest updateRequest, UserPrincipal currentUser) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean isCreator = task.getCreatedBy().getId().equals(user.getId());
        boolean isAssignee = task.getAssignedTo() != null && task.getAssignedTo().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isCreator && !isAssignee && !isAdmin) {
            throw new UnauthorizedException("You do not have permission to update this task");
        }

        task.setTitle(updateRequest.getTitle());
        task.setDescription(updateRequest.getDescription());
        
        if (updateRequest.getPriority() != null) {
            task.setPriority(updateRequest.getPriority());
        }
        
        if (updateRequest.getStatus() != null) {
            task.setStatus(updateRequest.getStatus());
        }
        
        task.setDueDate(updateRequest.getDueDate());

        // Update assignee if provided
        if (updateRequest.getAssignedTo() != null) {
            User assignee = userRepository.findById(updateRequest.getAssignedTo())
                    .orElse(null);
            task.setAssignedTo(assignee);
        } else {
            task.setAssignedTo(null);
        }

        Task updatedTask = taskRepository.save(task);
        return mapToResponse(updatedTask);
    }

    public TaskResponse updateTaskStatus(Long id, TaskStatusUpdateRequest statusRequest, UserPrincipal currentUser) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean isCreator = task.getCreatedBy().getId().equals(user.getId());
        boolean isAssignee = task.getAssignedTo() != null && task.getAssignedTo().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isCreator && !isAssignee && !isAdmin) {
            throw new UnauthorizedException("You do not have permission to update the status of this task");
        }

        task.setStatus(statusRequest.getStatus());
        Task updatedTask = taskRepository.save(task);
        return mapToResponse(updatedTask);
    }

    public void deleteTask(Long id, UserPrincipal currentUser) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean isCreator = task.getCreatedBy().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isCreator && !isAdmin) {
            throw new UnauthorizedException("Only the creator of the task or an ADMIN can delete this task");
        }

        taskRepository.delete(task);
    }

    private TaskResponse mapToResponse(Task task) {
        UserSummaryDto createdByDto = null;
        if (task.getCreatedBy() != null) {
            createdByDto = new UserSummaryDto(
                    task.getCreatedBy().getId(),
                    task.getCreatedBy().getName(),
                    task.getCreatedBy().getEmail(),
                    task.getCreatedBy().getRole()
            );
        }

        UserSummaryDto assignedToDto = null;
        if (task.getAssignedTo() != null) {
            assignedToDto = new UserSummaryDto(
                    task.getAssignedTo().getId(),
                    task.getAssignedTo().getName(),
                    task.getAssignedTo().getEmail(),
                    task.getAssignedTo().getRole()
            );
        }

        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getPriority(),
                task.getDueDate(),
                createdByDto,
                assignedToDto,
                task.getCreatedAt(),
                task.getUpdatedAt()
        );
    }
}
