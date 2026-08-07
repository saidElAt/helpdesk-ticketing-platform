package com.saidelatmioui.helpdesk.controller;

import com.saidelatmioui.helpdesk.dto.UserSummaryResponse;
import com.saidelatmioui.helpdesk.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(
            UserService userService
    ) {
        this.userService = userService;
    }

    @GetMapping("/email-exists")
    public boolean emailExists(
            @RequestParam String email
    ) {
        return userService.emailExists(email);
    }

    @GetMapping("/agents")
    public List<UserSummaryResponse> getAgents() {
        return userService.getEnabledAgents();
    }
}