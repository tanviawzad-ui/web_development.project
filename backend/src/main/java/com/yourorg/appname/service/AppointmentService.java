package com.yourorg.appname.service;

import com.yourorg.appname.dto.request.AppointmentBookingRequest;
import com.yourorg.appname.dto.request.AppointmentRescheduleRequest;
import com.yourorg.appname.dto.response.AppointmentDTO;

import java.util.List;

public interface AppointmentService {
    AppointmentDTO bookAppointment(AppointmentBookingRequest request, String currentUserEmail);
    AppointmentDTO getAppointmentById(Long id);
    AppointmentDTO getAppointmentByToken(String tokenId);
    List<AppointmentDTO> getPatientAppointments(Long patientId);
    List<AppointmentDTO> getCurrentUserAppointments(String currentUserEmail);
    AppointmentDTO cancelAppointment(Long id, String currentUserEmail);
    AppointmentDTO rescheduleAppointment(Long id, AppointmentRescheduleRequest request, String currentUserEmail);
    AppointmentDTO getActiveAppointmentForPatient(Long patientId);
}
