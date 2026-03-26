package com.opsflow.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.base-url}")
    private String baseUrl;

    public void sendVerificationEmail(String to, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("OpsFlow - Verify Your Email Address");
        message.setText("Welcome to OpsFlow!\n\n" +
                "Please click the link below to verify your email address:\n" +
                baseUrl + "/verify-email?token=" + token + "\n\n" +
                "If you didn't create an account with OpsFlow, please ignore this email.\n\n" +
                "Best regards,\n" +
                "The OpsFlow Team");
        
        try {
            mailSender.send(message);
        } catch (Exception e) {
            // Log error but don't fail registration
            System.err.println("Failed to send verification email: " + e.getMessage());
        }
    }

    public void sendPasswordResetEmail(String to, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("OpsFlow - Password Reset Request");
        message.setText("Hello,\n\n" +
                "You requested a password reset for your OpsFlow account.\n\n" +
                "Please click the link below to reset your password:\n" +
                baseUrl + "/reset-password?token=" + token + "\n\n" +
                "This link will expire in 1 hour.\n\n" +
                "If you didn't request a password reset, please ignore this email.\n\n" +
                "Best regards,\n" +
                "The OpsFlow Team");
        
        try {
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send password reset email: " + e.getMessage());
        }
    }

    public void sendWelcomeEmail(String to, String fullName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Welcome to OpsFlow!");
        message.setText("Hello " + fullName + ",\n\n" +
                "Welcome to OpsFlow! Your email has been verified and your account is now active.\n\n" +
                "You can now log in and start managing your requests and approvals.\n\n" +
                "Visit: " + baseUrl + "\n\n" +
                "Best regards,\n" +
                "The OpsFlow Team");
        
        try {
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send welcome email: " + e.getMessage());
        }
    }
}