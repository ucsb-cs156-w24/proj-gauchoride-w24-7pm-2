package edu.ucsb.cs156.gauchoride.controllers;

import edu.ucsb.cs156.gauchoride.repositories.UserRepository;
import edu.ucsb.cs156.gauchoride.testconfig.TestConfig;
import edu.ucsb.cs156.gauchoride.ControllerTestCase;
import edu.ucsb.cs156.gauchoride.entities.DriverAvailability;
import edu.ucsb.cs156.gauchoride.repositories.DriverAvailabilityRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = DriverAvailabilityController.class)
@Import(TestConfig.class)
public class DriverAvailabilityControllerTests extends ControllerTestCase {

        @MockBean
        DriverAvailabilityRepository driverAvailabilityRepository;

        @MockBean
        UserRepository userRepository;

        @Test
        public void logged_out_users_cannot_get_all() throws Exception {
                mockMvc.perform(get("/api/driverAvailability"))
                                .andExpect(status().is(403)); // logged out users can't get all
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_users_cannot_get_all() throws Exception {
                mockMvc.perform(get("/api/driverAvailability"))
                                .andExpect(status().is(403));
        }

        @WithMockUser(roles = { "DRIVER" })
        @Test
        public void logged_in_driver_can_get_all() throws Exception {
                mockMvc.perform(get("/api/driverAvailability"))
                                .andExpect(status().is(200)); // logged
        }

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void logged_in_admin_can_get_all() throws Exception {
                mockMvc.perform(get("/api/driverAvailability"))
                                .andExpect(status().is(200)); // logged
        }

        @Test
        public void logged_out_users_cannot_get_by_id() throws Exception {
                mockMvc.perform(get("/api/driverAvailability?id=7"))
                                .andExpect(status().is(403)); // logged out users can't get by id
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_users_cannot_get_by_id() throws Exception {
                mockMvc.perform(get("/api/driverAvailability?id=7"))
                                .andExpect(status().is(403));
        }

        @WithMockUser(roles = { "DRIVER" })
        @Test
        public void logged_in_driver_can_get_by_id() throws Exception {
                mockMvc.perform(get("/api/driverAvailability?id=7"))
                                .andExpect(status().is(404)); // logged, but no id exists
        }

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void logged_in_admin_can_get_by_id() throws Exception {
                mockMvc.perform(get("/api/driverAvailability?id=7"))
                                .andExpect(status().is(404)); // logged, but no id exists
        }

        // Authorization tests for /api/driverAvailability/new

        @Test
        public void logged_out_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/driverAvailability/new"))
                                .andExpect(status().is(403));
        }

        @WithMockUser(roles = { "RIDER" })
        @Test
        public void logged_in_rider_cannot_post() throws Exception {
                mockMvc.perform(post("/api/driverAvailability/new"))
                                .andExpect(status().is(403));
        }

        // Authorization tests for delete /api/driverAvailability

        @Test
         public void logged_out_users_cannot_delete() throws Exception {
                 mockMvc.perform(delete("/api/driverAvailability?id=9"))
                                 .andExpect(status().is(403));
        }


        // Authorization tests for put /api/driverAvailability

        @Test
         public void logged_out_users_cannot_edit() throws Exception {
                 mockMvc.perform(put("/api/driverAvailability?id=9"))
                                 .andExpect(status().is(403));
        }

        // // Tests with mocks for database actions



        // GET BY ID


        @WithMockUser(roles = { "DRIVER" })
        @Test
        public void test_that_logged_in_driver_can_get_by_id_when_the_id_exists_and_driver_id_matches() throws Exception {

                // arrange

                long driverId = currentUserService.getCurrentUser().getUser().getId();

                DriverAvailability availability = DriverAvailability.builder()
                                .driverId(driverId)
                                .day("Monday")
                                .startTime("2:00PM")
                                .endTime("3:15PM")
                                .notes("notes")
                                .build();

                when(driverAvailabilityRepositoryRepository.findByIdAndDriverId(eq(7L), eq(driverId))).thenReturn(Optional.of(availability));

                // act
                MvcResult response = mockMvc.perform(get("/api/driverAvailability?id=7"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(driverAvailabilityRepository, times(1)).findByIdAndRiderId(eq(7L), eq(driverId));
                String expectedJson = mapper.writeValueAsString(availability);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void test_that_logged_in_admin_can_get_by_id_when_the_id_exists_and_driver_id_matches() throws Exception {

                // arrange

                long driverId = currentUserService.getCurrentUser().getUser().getId();

                DriverAvailability availability = DriverAvailability.builder()
                                .driverId(driverId)
                                .day("Monday")
                                .startTime("2:00PM")
                                .endTime("3:15PM")
                                .notes("notes")
                                .build();

                when(driverAvailabilityRepositoryRepository.findByIdAndDriverId(eq(7L), eq(driverId))).thenReturn(Optional.of(availability));

                // act
                MvcResult response = mockMvc.perform(get("/api/driverAvailability?id=7"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(driverAvailabilityRepository, times(1)).findByIdAndRiderId(eq(7L), eq(driverId));
                String expectedJson = mapper.writeValueAsString(availability);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

}