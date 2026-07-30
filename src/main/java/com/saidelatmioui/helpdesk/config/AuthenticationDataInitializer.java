package com.saidelatmioui.helpdesk.config;

import com.saidelatmioui.helpdesk.entity.Role;
import com.saidelatmioui.helpdesk.entity.User;
import com.saidelatmioui.helpdesk.repository.RoleRepository;
import com.saidelatmioui.helpdesk.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@ConditionalOnProperty(
        name = "app.auth.seed-enabled",
        havingValue = "true"
)
public class AuthenticationDataInitializer
        implements ApplicationRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final String seedPassword;

    public AuthenticationDataInitializer(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.auth.seed-password}") String seedPassword
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.seedPassword = seedPassword;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        configureUser(
                "John",
                "Customer",
                "john.customer@example.com",
                "CUSTOMER"
        );

        configureUser(
                "Alice",
                "Agent",
                "alice.agent@example.com",
                "AGENT"
        );

        configureUser(
                "Adam",
                "Administrator",
                "admin@example.com",
                "ADMIN"
        );
    }

    private void configureUser(
            String firstName,
            String lastName,
            String email,
            String roleName
    ) {
        Role role = roleRepository.findByNameIgnoreCase(roleName)
                .orElseThrow(() -> new IllegalStateException(
                        "Required role " + roleName + " was not found"
                ));

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseGet(User::new);

        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPasswordHash(
                passwordEncoder.encode(seedPassword)
        );
        user.setRole(role);
        user.setEnabled(true);

        userRepository.save(user);
    }
}