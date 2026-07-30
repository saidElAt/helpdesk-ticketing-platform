package com.saidelatmioui.helpdesk.dto;

public class AuthResponse {

    private String token;
    private String tokenType;
    private long expiresIn;
    private Long userId;
    private String email;
    private String role;

    public AuthResponse() {
    }

    public AuthResponse(
            String token,
            String tokenType,
            long expiresIn,
            Long userId,
            String email,
            String role
    ) {
        this.token = token;
        this.tokenType = tokenType;
        this.expiresIn = expiresIn;
        this.userId = userId;
        this.email = email;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public long getExpiresIn() {
        return expiresIn;
    }

    public Long getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
}