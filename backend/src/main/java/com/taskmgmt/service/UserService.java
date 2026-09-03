package com.taskmgmt.service;

import com.taskmgmt.dto.UserSummaryDto;
import com.taskmgmt.model.User;
import com.taskmgmt.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<UserSummaryDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserSummaryDto(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole()
                ))
                .collect(Collectors.toList());
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
}
