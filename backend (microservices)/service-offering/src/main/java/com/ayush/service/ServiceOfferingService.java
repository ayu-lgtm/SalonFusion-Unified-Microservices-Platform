package com.ayush.service;

import com.ayush.modal.ServiceOffering;
import com.ayush.payload.dto.CategoryDTO;
import com.ayush.payload.dto.SalonDTO;
import com.ayush.payload.dto.ServiceDTO;

import java.util.List;
import java.util.Set;

public interface ServiceOfferingService {


    ServiceOffering createService(
            ServiceDTO service,
            SalonDTO salon,
            CategoryDTO category
    );

    com.ayush.modal.ServiceOffering updateService(
            Long serviceId,
            ServiceOffering service
    ) throws Exception;

    Set<ServiceOffering> getAllServicesBySalonId(Long salonId,Long categoryId);

    com.ayush.modal.ServiceOffering getServiceById(Long serviceId);

    Set<ServiceOffering> getServicesByIds(Set<Long> ids);
}
