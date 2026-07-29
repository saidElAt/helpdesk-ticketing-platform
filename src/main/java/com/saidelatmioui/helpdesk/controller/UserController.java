package com.saidelatmioui.helpdesk.controller;

import com.saidelatmioui.helpdesk.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users/email-exists")
    public boolean emailExists(@RequestParam String email) {
        return userService.emailExists(email);
    }
}