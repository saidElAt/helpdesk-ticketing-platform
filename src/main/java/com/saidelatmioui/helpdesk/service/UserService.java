package com.saidelatmioui.helpdesk.service;

import com.saidelatmioui.helpdesk.dto.UserSummaryResponse;
import com.saidelatmioui.helpdesk.entity.User;
import com.saidelatmioui.helpdesk.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    public UserService(
            UserRepository userRepository
    ) {
        this.userRepository = userRepository;
    }

    public boolean emailExists(String email) {
        if (email == null || email.isBlank()) {
            return false;
        }

        return userRepository.existsByEmailIgnoreCase(
                email.trim()
        );
    }

    public List<UserSummaryResponse> getEnabledAgents() {
        return userRepository.findEnabledAgents()
                .stream()
                .map(this::toSummaryResponse)
                .toList();
    }

    private UserSummaryResponse toSummaryResponse(
            User user
    ) {
        UserSummaryResponse response =
                new UserSummaryResponse();

        response.setId(user.getId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());

        return response;
    }
}