package com.opsflow.config;

import com.opsflow.entity.User;
import com.opsflow.enums.Role;
import com.opsflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Override
    public void run(String... args) throws Exception {
        // Create admin user if it doesn't exist
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEmail(adminEmail);
            admin.setFullName("System Administrator");
            admin.setRole(Role.ADMIN);
            admin.setIsActive(true);
            admin.setEmailVerified(true);
            userRepository.save(admin);

            System.out.println("Admin user created successfully!");
            System.out.println("Username: admin");
            System.out.println("Password: admin123");
            System.out.println("Email: " + adminEmail);
        }

        // Create sample manager if it doesn't exist
        if (!userRepository.existsByUsername("manager")) {
            User manager = new User();
            manager.setUsername("manager");
            manager.setPassword(passwordEncoder.encode("manager123"));
            manager.setEmail("manager@opsflow.com");
            manager.setFullName("Sample Manager");
            manager.setRole(Role.MANAGER);
            manager.setIsActive(true);
            manager.setEmailVerified(true);
            userRepository.save(manager);

            System.out.println("Sample manager created successfully!");
            System.out.println("Username: manager");
            System.out.println("Password: manager123");
            System.out.println("Email: manager@opsflow.com");
        }
    }
}