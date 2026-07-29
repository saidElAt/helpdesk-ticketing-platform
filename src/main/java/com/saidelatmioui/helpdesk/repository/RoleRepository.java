package com.saidelatmioui.helpdesk.repository;

import com.saidelatmioui.helpdesk.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
}