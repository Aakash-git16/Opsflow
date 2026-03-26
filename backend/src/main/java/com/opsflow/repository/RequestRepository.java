package com.opsflow.repository;

import com.opsflow.entity.Request;
import com.opsflow.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {
    List<Request> findByEmployeeId(Long employeeId);
    List<Request> findByStatus(RequestStatus status);
}
