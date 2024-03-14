package edu.ucsb.cs156.gauchoride.controllers;

import edu.ucsb.cs156.gauchoride.entities.DriverAvailability;
import edu.ucsb.cs156.gauchoride.errors.EntityNotFoundException;
import edu.ucsb.cs156.gauchoride.repositories.DriverAvailabilityRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@Tag(name = "Driver Availability")
@RequestMapping("/api/driverAvailability")
@RestController

public class DriverAvailabilityController extends ApiController{
    
    @Autowired
    DriverAvailabilityRepository driverAvailabilityRepository;

    @Operation(summary = "List all availabilities, only current user's if not admin")
    @PreAuthorize("hasRole('ROLE_ADMIN') || hasRole('ROLE_DRIVER')")
    @GetMapping("/all")
    public Iterable<DriverAvailability> allAvailabilities() {
        Iterable<DriverAvailability> availabilities;

        if (getCurrentUser().getRoles().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
            availabilities = driverAvailabilityRepository.findAll();
        } else {
            availabilities = driverAvailabilityRepository.findAllByDriverId(getCurrentUser().getUser().getId());
        }

        return availabilities;
    }

    @Operation(summary = "Get a single availability by id, can only be current user's if not admin")
    @PreAuthorize("hasRole('ROLE_ADMIN') || hasRole('ROLE_DRIVER')")
    @GetMapping("")
    public DriverAvailability getById(
        @Parameter(name="id", description = "long, Id of the availability to get", 
        required = true)  
        @RequestParam Long id) {
            DriverAvailability availability;
        
        if (getCurrentUser().getRoles().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
            availability = driverAvailabilityRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(DriverAvailability.class, id));;
        } else {
            availability = driverAvailabilityRepository.findByIdAndDriverId(id, getCurrentUser().getUser().getId())
                .orElseThrow(() -> new EntityNotFoundException(DriverAvailability.class, id));
        }

        return availability;
    }

    @Operation(summary = "Create a new driver availability")
    @PreAuthorize("hasRole('ROLE_ADMIN') || hasRole('ROLE_DRIVER')")
    @PostMapping("/new")
    public DriverAvailability postAvailability(
        @Parameter(name="day", description="String, Day of the week driver is available (Monday - Sunday) and allows Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday", 
                    example="Tuesday", required = true) 
        @RequestParam String day,

        @Parameter(name="startTime", description="String, Time the availability starts HH:MM(A/P)M", example="12:30AM", required = true)
        @RequestParam String startTime,

        @Parameter(name="endTime", description="String, Time the availability ends HH:MM(A/P)M", example="12:30AM", required = true)
        @RequestParam String endTime,

         @Parameter(name="notes", description="String, Extra information", example="Have to stay near the city", required = true)
        @RequestParam String notes
        )
        {

        DriverAvailability availability = new DriverAvailability();
        
        availability.setDriverId(getCurrentUser().getUser().getId());
        availability.setDay(day);
        availability.setStartTime(startTime);
        availability.setEndTime(endTime);
        availability.setNotes(notes);

        DriverAvailability savedAvailability = driverAvailabilityRepository.save(availability);

        return savedAvailability;
    }

    @Operation(summary = "Delete an availability if admin or owned by current user")
    @PreAuthorize("hasRole('ROLE_ADMIN') || hasRole('ROLE_DRIVER')")
    @DeleteMapping("")
    public Object deleteAvailability(
        @Parameter(name="id", description="long, Id of the availability to be deleted", 
        required = true)
        @RequestParam Long id) {

        DriverAvailability availability;

        if (getCurrentUser().getRoles().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
            availability = driverAvailabilityRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(DriverAvailability.class, id));;
        } else {
            availability = driverAvailabilityRepository.findByIdAndDriverId(id, getCurrentUser().getUser().getId())
                .orElseThrow(() -> new EntityNotFoundException(DriverAvailability.class, id));
        }

        driverAvailabilityRepository.delete(availability);
        return genericMessage("Availability with id %s deleted".formatted(id));
    }


    @Operation(summary = "Edits an availability if admin or owned by current user")
    @PreAuthorize("hasRole('ROLE_ADMIN') || hasRole('ROLE_DRIVER')")
    @PutMapping("")
    public DriverAvailability updateAvailability(
            @Parameter(name="id", description="long, Id of the Availability to be edited", 
            required = true)
            @RequestParam Long id,
            @RequestBody @Valid DriverAvailability incoming) {

        DriverAvailability availability;

        if (getCurrentUser().getRoles().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
            availability = driverAvailabilityRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(DriverAvailability.class, id));;
        } else {
            availability = driverAvailabilityRepository.findByIdAndDriverId(id, getCurrentUser().getUser().getId())
                .orElseThrow(() -> new EntityNotFoundException(DriverAvailability.class, id));
        }

        availability.setDay(incoming.getDay());
        availability.setStartTime(incoming.getStartTime());
        availability.setEndTime(incoming.getEndTime());
        availability.setNotes(incoming.getNotes());

        driverAvailabilityRepository.save(availability);

        return availability;
    }

}
