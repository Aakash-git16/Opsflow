package com.opsflow.service;

import com.opsflow.dto.CreateRequestDto;
import com.opsflow.entity.Request;
import com.opsflow.entity.StatusHistory;
import com.opsflow.entity.User;
import com.opsflow.enums.RequestStatus;
import com.opsflow.enums.Role;
import com.opsflow.repository.RequestRepository;
import com.opsflow.repository.StatusHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class RequestService {
    
    @Autowired
    private RequestRepository requestRepository;
    
    @Autowired
    private StatusHistoryRepository statusHistoryRepository;

    public List<Request> getAllRequests(User user) {
        if (user.getRole() == Role.EMPLOYEE) {
            return requestRepository.findByEmployeeId(user.getId());
        }
        return requestRepository.findAll();
    }

    public Optional<Request> getRequestById(Long id) {
        return requestRepository.findById(id);
    }

    public Request createRequest(CreateRequestDto dto, User employee) {
        Request request = new Request();
        request.setTitle(dto.getTitle());
        request.setDescription(dto.getDescription());
        request.setEmployee(employee);
        request.setStatus(RequestStatus.PENDING);
        
        Request savedRequest = requestRepository.save(request);
        
        // Create status history
        createStatusHistory(savedRequest, null, RequestStatus.PENDING, employee, "Request created");
        
        return savedRequest;
    }

    public Request updateRequestStatus(Long requestId, RequestStatus newStatus, User changedBy, String comment) {
        Optional<Request> requestOpt = requestRepository.findById(requestId);
        if (requestOpt.isEmpty()) {
            return null;
        }
        
        Request request = requestOpt.get();
        RequestStatus oldStatus = request.getStatus();
        request.setStatus(newStatus);
        
        if (newStatus == RequestStatus.APPROVED || newStatus == RequestStatus.REJECTED) {
            request.setManager(changedBy);
        }
        
        Request savedRequest = requestRepository.save(request);
        
        // Create status history
        createStatusHistory(savedRequest, oldStatus, newStatus, changedBy, comment);
        
        return savedRequest;
    }

    private void createStatusHistory(Request request, RequestStatus oldStatus, RequestStatus newStatus, User changedBy, String comment) {
        StatusHistory history = new StatusHistory();
        history.setRequest(request);
        history.setOldStatus(oldStatus);
        history.setNewStatus(newStatus);
        history.setChangedBy(changedBy);
        history.setComment(comment);
        statusHistoryRepository.save(history);
    }

    public List<StatusHistory> getRequestHistory(Long requestId) {
        return statusHistoryRepository.findByRequestIdOrderByChangedAtDesc(requestId);
    }
}