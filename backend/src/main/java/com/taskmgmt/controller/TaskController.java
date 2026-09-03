package com.taskmgmt.controller;

import com.taskmgmt.dto.ApiResponse;
import com.taskmgmt.dto.TaskRequest;
import com.taskmgmt.dto.TaskResponse;
import com.taskmgmt.dto.TaskStatusUpdateRequest;
import com.taskmgmt.dto.TaskUpdateRequest;
import com.taskmgmt.security.UserPrincipal;
import com.taskmgmt.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getTasks(@AuthenticationPrincipal UserPrincipal currentUser) {
        List<TaskResponse> tasks = taskService.getAccessibleTasks(currentUser);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTaskById(@PathVariable Long id,
                                                    @AuthenticationPrincipal UserPrincipal currentUser) {
        TaskResponse task = taskService.getTaskById(id, currentUser);
        return ResponseEntity.ok(task);
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody TaskRequest taskRequest,
                                                   @AuthenticationPrincipal UserPrincipal currentUser) {
        TaskResponse createdTask = taskService.createTask(taskRequest, currentUser);
        return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(@PathVariable Long id,
                                                   @Valid @RequestBody TaskUpdateRequest updateRequest,
                                                   @AuthenticationPrincipal UserPrincipal currentUser) {
        TaskResponse updatedTask = taskService.updateTask(id, updateRequest, currentUser);
        return ResponseEntity.ok(updatedTask);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskResponse> updateTaskStatus(@PathVariable Long id,
                                                         @Valid @RequestBody TaskStatusUpdateRequest statusRequest,
                                                         @AuthenticationPrincipal UserPrincipal currentUser) {
        TaskResponse updatedTask = taskService.updateTaskStatus(id, statusRequest, currentUser);
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteTask(@PathVariable Long id,
                                                  @AuthenticationPrincipal UserPrincipal currentUser) {
        taskService.deleteTask(id, currentUser);
        return ResponseEntity.ok(new ApiResponse(true, "Task deleted successfully"));
    }
}
