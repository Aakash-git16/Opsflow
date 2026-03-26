package com.opsflow.controller;

import com.opsflow.dto.CreateRequestDto;
import com.opsflow.dto.UpdateRequestDto;
import com.opsflow.entity.Request;
import com.opsflow.entity.StatusHistory;
import com.opsflow.entity.User;
import com.opsflow.enums.RequestStatus;
import com.opsflow.enums.Role;
import com.opsflow.service.RequestService;
import com.opsflow.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "*")
public class RequestController {

    @Autowired
    private RequestService requestService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<?> getAllRequests(Authentication authentication) {
        Optional<User> userOpt = userService.findByUsername(authentication.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        List<Request> requests = requestService.getAllRequests(userOpt.get());
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRequestById(@PathVariable Long id) {
        Optional<Request> request = requestService.getRequestById(id);
        if (request.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(request.get());
    }

    @PostMapping
    public ResponseEntity<?> createRequest(@RequestBody CreateRequestDto dto, Authentication authentication) {
        Optional<User> userOpt = userService.findByUsername(authentication.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = userOpt.get();
        if (user.getRole() != Role.EMPLOYEE && user.getRole() != Role.ADMIN) {
            return ResponseEntity.badRequest().body("Only employees can create requests");
        }

        Request request = requestService.createRequest(dto, user);
        return ResponseEntity.ok(request);
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveRequest(@PathVariable Long id, @RequestBody UpdateRequestDto dto, Authentication authentication) {
        return updateRequestStatus(id, RequestStatus.APPROVED, dto.getComment(), authentication);
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectRequest(@PathVariable Long id, @RequestBody UpdateRequestDto dto, Authentication authentication) {
        return updateRequestStatus(id, RequestStatus.REJECTED, dto.getComment(), authentication);
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<?> completeRequest(@PathVariable Long id, @RequestBody UpdateRequestDto dto, Authentication authentication) {
        return updateRequestStatus(id, RequestStatus.COMPLETED, dto.getComment(), authentication);
    }

    private ResponseEntity<?> updateRequestStatus(Long id, RequestStatus status, String comment, Authentication authentication) {
        Optional<User> userOpt = userService.findByUsername(authentication.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = userOpt.get();
        if (user.getRole() == Role.EMPLOYEE && status != RequestStatus.COMPLETED) {
            return ResponseEntity.badRequest().body("Employees can only mark requests as completed");
        }

        Request request = requestService.updateRequestStatus(id, status, user, comment);
        if (request == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(request);
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<?> getRequestHistory(@PathVariable Long id) {
        List<StatusHistory> history = requestService.getRequestHistory(id);
        return ResponseEntity.ok(history);
    }
}