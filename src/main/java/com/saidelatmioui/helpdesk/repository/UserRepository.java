package com.saidelatmioui.helpdesk.repository;

import com.saidelatmioui.helpdesk.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    @Query("""
            SELECT user
            FROM User user
            JOIN user.role role
            WHERE UPPER(role.name) = 'AGENT'
              AND user.enabled = true
            ORDER BY user.firstName ASC, user.lastName ASC
            """)
    List<User> findEnabledAgents();
}