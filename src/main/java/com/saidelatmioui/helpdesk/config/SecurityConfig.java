package com.saidelatmioui.helpdesk.config;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import com.saidelatmioui.helpdesk.security.CustomUserDetailsService;
import com.saidelatmioui.helpdesk.security.RestAccessDeniedHandler;
import com.saidelatmioui.helpdesk.security.RestAuthenticationEntryPoint;
import jakarta.servlet.DispatcherType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            AuthenticationProvider authenticationProvider,
            JwtAuthenticationConverter jwtAuthenticationConverter,
            RestAuthenticationEntryPoint authenticationEntryPoint,
            RestAccessDeniedHandler accessDeniedHandler
    ) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authenticationProvider(
                        authenticationProvider
                )

                .authorizeHttpRequests(authorize -> authorize

                        .dispatcherTypeMatchers(
                                DispatcherType.ERROR
                        ).permitAll()

                        .requestMatchers(
                                "/error",
                                "/openapi.yaml"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.POST,
                                "/auth/login"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/categories"
                        ).hasAnyRole(
                                "CUSTOMER",
                                "AGENT",
                                "ADMIN"
                        )

                        .requestMatchers(
                                HttpMethod.GET,
                                "/dashboard/**",
                                "/reports/**"
                        ).hasAnyRole(
                                "AGENT",
                                "ADMIN"
                        )

                        .requestMatchers(
                                HttpMethod.GET,
                                "/tickets",
                                "/tickets/**"
                        ).hasAnyRole(
                                "CUSTOMER",
                                "AGENT",
                                "ADMIN"
                        )

                        .requestMatchers(
                                HttpMethod.POST,
                                "/tickets"
                        ).hasAnyRole(
                                "CUSTOMER",
                                "AGENT",
                                "ADMIN"
                        )

                        .requestMatchers(
                                HttpMethod.POST,
                                "/tickets/*/comments"
                        ).hasAnyRole(
                                "CUSTOMER",
                                "AGENT",
                                "ADMIN"
                        )

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/tickets/**"
                        ).hasAnyRole(
                                "AGENT",
                                "ADMIN"
                        )

                        .requestMatchers(
                                HttpMethod.PATCH,
                                "/tickets/*/status"
                        ).hasAnyRole(
                                "AGENT",
                                "ADMIN"
                        )

                        .requestMatchers(
                                HttpMethod.PATCH,
                                "/tickets/*/assign/*"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/tickets/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                "/users/**"
                        ).hasRole("ADMIN")

                        .anyRequest().authenticated()
                )

                .exceptionHandling(exceptions ->
                        exceptions
                                .authenticationEntryPoint(
                                        authenticationEntryPoint
                                )
                                .accessDeniedHandler(
                                        accessDeniedHandler
                                )
                )

                .oauth2ResourceServer(oauth2 ->
                        oauth2
                                .authenticationEntryPoint(
                                        authenticationEntryPoint
                                )
                                .accessDeniedHandler(
                                        accessDeniedHandler
                                )
                                .jwt(jwt ->
                                        jwt.jwtAuthenticationConverter(
                                                jwtAuthenticationConverter
                                        )
                                )
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(
            CustomUserDetailsService userDetailsService,
            PasswordEncoder passwordEncoder
    ) {
        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(
                        userDetailsService
                );

        provider.setPasswordEncoder(
                passwordEncoder
        );

        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration
    ) throws Exception {
        return configuration
                .getAuthenticationManager();
    }

    @Bean
    public SecretKey jwtSecretKey(
            @Value("${app.jwt.secret}")
            String secret
    ) {
        byte[] secretBytes =
                secret.getBytes(
                        StandardCharsets.UTF_8
                );

        if (secretBytes.length < 32) {
            throw new IllegalStateException(
                    "app.jwt.secret must contain at least 32 characters"
            );
        }

        return new SecretKeySpec(
                secretBytes,
                "HmacSHA256"
        );
    }

    @Bean
    public JwtEncoder jwtEncoder(
            SecretKey jwtSecretKey
    ) {
        return new NimbusJwtEncoder(
                new ImmutableSecret<>(
                        jwtSecretKey
                )
        );
    }

    @Bean
    public JwtDecoder jwtDecoder(
            SecretKey jwtSecretKey
    ) {
        return NimbusJwtDecoder
                .withSecretKey(jwtSecretKey)
                .macAlgorithm(
                        MacAlgorithm.HS256
                )
                .build();
    }

    @Bean
    public JwtAuthenticationConverter
    jwtAuthenticationConverter() {

        JwtGrantedAuthoritiesConverter
                authoritiesConverter =
                new JwtGrantedAuthoritiesConverter();

        authoritiesConverter
                .setAuthoritiesClaimName("role");

        authoritiesConverter
                .setAuthorityPrefix("ROLE_");

        JwtAuthenticationConverter
                authenticationConverter =
                new JwtAuthenticationConverter();

        authenticationConverter
                .setJwtGrantedAuthoritiesConverter(
                        authoritiesConverter
                );

        return authenticationConverter;
    }
}