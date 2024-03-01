package edu.ucsb.cs156.gauchoride.controllers;

import edu.ucsb.cs156.gauchoride.repositories.UserRepository;
import edu.ucsb.cs156.gauchoride.testconfig.TestConfig;
import edu.ucsb.cs156.gauchoride.ControllerTestCase;
import edu.ucsb.cs156.gauchoride.entities.DriverAvailability;
import edu.ucsb.cs156.gauchoride.entities.Ride;
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

        // AUTHORIZATION TESTS

        // GET ALL AUTHORIZATION

        @Test
        public void logged_out_users_cannot_get_all() throws Exception {
                mockMvc.perform(get("/api/driverAvailability/all"))
                                .andExpect(status().is(403)); // logged out users can't get all
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_users_cannot_get_all() throws Exception {
                mockMvc.perform(get("/api/driverAvailability/all"))
                                .andExpect(status().is(403));
        }

        @WithMockUser(roles = { "DRIVER" })
        @Test
        public void logged_in_driver_can_get_all() throws Exception {
                mockMvc.perform(get("/api/driverAvailability/all"))
                                .andExpect(status().is(200)); // logged
        }

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void logged_in_admin_can_get_all() throws Exception {
                mockMvc.perform(get("/api/driverAvailability/all"))
                                .andExpect(status().is(200)); // logged
        }

        // GET BY ID AUTHORIZATION

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

        // POST AUTHORIZATION

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

        // DELETE AUTHORIZATION

        @Test
         public void logged_out_users_cannot_delete() throws Exception {
                 mockMvc.perform(delete("/api/driverAvailability?id=9"))
                                 .andExpect(status().is(403));
        }

        @WithMockUser(roles = { "USER" })
        @Test
         public void logged_in_users_cannot_delete() throws Exception {
                 mockMvc.perform(delete("/api/driverAvailability?id=9"))
                                 .andExpect(status().is(403));
        }

        // PUT AUTHORIZATION

        @Test
         public void logged_out_users_cannot_edit() throws Exception {
                 mockMvc.perform(put("/api/driverAvailability?id=9"))
                                 .andExpect(status().is(403));
        }



        // GET BY ID TESTS

        @WithMockUser(roles = { "DRIVER" })
        @Test
        public void driver_can_get_by_id_when_id_exists_and_driver_id_matches() throws Exception {

                // arrange

                long driverId = currentUserService.getCurrentUser().getUser().getId();

                DriverAvailability availability = DriverAvailability.builder()
                                .driverId(driverId)
                                .day("Monday")
                                .startTime("2:00PM")
                                .endTime("3:15PM")
                                .notes("notes")
                                .build();

                when(driverAvailabilityRepository.findByIdAndDriverId(eq(7L), eq(driverId))).thenReturn(Optional.of(availability));

                // act
                MvcResult response = mockMvc.perform(get("/api/driverAvailability?id=7"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(driverAvailabilityRepository, times(1)).findByIdAndDriverId(eq(7L), eq(driverId));
                String expectedJson = mapper.writeValueAsString(availability);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void admin_can_get_own_availability_by_id_when_id_exists() throws Exception {

                // arrange

                long driverId = currentUserService.getCurrentUser().getUser().getId();

                DriverAvailability availability = DriverAvailability.builder()
                                .driverId(driverId)
                                .day("Monday")
                                .startTime("2:00PM")
                                .endTime("3:15PM")
                                .notes("notes")
                                .build();

                when(driverAvailabilityRepository.findById(eq(7L))).thenReturn(Optional.of(availability));

                // act
                MvcResult response = mockMvc.perform(get("/api/driverAvailability?id=7"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(driverAvailabilityRepository, times(1)).findById(eq(7L));
                String expectedJson = mapper.writeValueAsString(availability);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void admin_can_get_any_availability_by_id_when_the_id_exists() throws Exception {

                // arrange

                long driverId = currentUserService.getCurrentUser().getUser().getId();

                DriverAvailability availability = DriverAvailability.builder()
                                .driverId(driverId+1)
                                .day("Monday")
                                .startTime("2:00PM")
                                .endTime("3:15PM")
                                .notes("notes")
                                .build();

                when(driverAvailabilityRepository.findById(eq(7L))).thenReturn(Optional.of(availability));

                // act
                MvcResult response = mockMvc.perform(get("/api/driverAvailability?id=7"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(driverAvailabilityRepository, times(1)).findById(eq(7L));
                String expectedJson = mapper.writeValueAsString(availability);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN" , "DRIVER" })
        @Test
        public void admin_and_driver_can_get_by_id_when_id_does_not_exist() throws Exception {

                // arrange

                when(driverAvailabilityRepository.findById(eq(7L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(get("/api/driverAvailability?id=7"))
                                .andExpect(status().isNotFound()).andReturn();

                // assert

                verify(driverAvailabilityRepository, times(1)).findById(eq(7L));
                Map<String, Object> json = responseToJson(response);
                assertEquals("EntityNotFoundException", json.get("type"));
                assertEquals("DriverAvailability with id 7 not found", json.get("message"));
        }

        // GET ALL TESTS

        @WithMockUser(roles = { "DRIVER" })
        @Test
        public void driver_can_get_all_their_own_availabilities() throws Exception {

                long userId = currentUserService.getCurrentUser().getUser().getId();

                DriverAvailability availability1 = DriverAvailability.builder()
                                .driverId(userId)
                                .day("Monday")
                                .startTime("2:00PM")
                                .endTime("3:15PM")
                                .notes("test 1")
                                .build();

                DriverAvailability availability2 = DriverAvailability.builder()
                                .driverId(userId)
                                .day("Thursday")
                                .startTime("9:30AM")
                                .endTime("10:45AM")
                                .notes("test 2")
                                .build();

                ArrayList<DriverAvailability> expectedAvailabilities = new ArrayList<>();
                expectedAvailabilities.addAll(Arrays.asList(availability1, availability2));

                when(driverAvailabilityRepository.findAllByDriverId(eq(userId))).thenReturn(expectedAvailabilities);

                // act
                MvcResult response = mockMvc.perform(get("/api/driverAvailability/all"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(driverAvailabilityRepository, times(1)).findAllByDriverId(eq(userId));
                String expectedJson = mapper.writeValueAsString(expectedAvailabilities);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "DRIVER" })
        @Test
        public void admin_can_get_all_availabilities() throws Exception {

                long userId = currentUserService.getCurrentUser().getUser().getId();

                DriverAvailability availability1 = DriverAvailability.builder()
                                .driverId(userId)
                                .day("Monday")
                                .startTime("2:00PM")
                                .endTime("3:15PM")
                                .notes("test 1")
                                .build();

                DriverAvailability availability2 = DriverAvailability.builder()
                                .driverId(userId+1)
                                .day("Thursday")
                                .startTime("9:30AM")
                                .endTime("10:45AM")
                                .notes("test 2")
                                .build();
                
                DriverAvailability availability3 = DriverAvailability.builder()
                                .driverId(userId+2)
                                .day("Saturday")
                                .startTime("2:30AM")
                                .endTime("7:00PM")
                                .notes("test 3")
                                .build();

                ArrayList<DriverAvailability> expectedAvailabilities = new ArrayList<>();
                expectedAvailabilities.addAll(Arrays.asList(availability1, availability2, availability3));

                when(driverAvailabilityRepository.findAllByDriverId(eq(userId))).thenReturn(expectedAvailabilities);

                // act
                MvcResult response = mockMvc.perform(get("/api/driverAvailability/all"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(driverAvailabilityRepository, times(1)).findAllByDriverId(eq(userId));
                String expectedJson = mapper.writeValueAsString(expectedAvailabilities);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        // POST TESTS

        @WithMockUser(roles = { "DRIVER" })
        @Test
        public void a_driver_can_post_a_new_availability() throws Exception {
                // arrange

                long userId = currentUserService.getCurrentUser().getUser().getId();

                DriverAvailability availability1 = DriverAvailability.builder()
                                .driverId(userId)
                                .day("Monday")
                                .startTime("2:00PM")
                                .endTime("3:15PM")
                                .notes("test 1")
                                .build();

                when(driverAvailabilityRepository.save(eq(availability1))).thenReturn(availability1);

                String postRequestString = "day=Monday&startTime=2:00PM&endTime=3:15PM&notes=test 1";

                // act
                MvcResult response = mockMvc.perform(
                                post("/api/driverAvailability/new?" + postRequestString)
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(driverAvailabilityRepository, times(1)).save(availability1);
                String expectedJson = mapper.writeValueAsString(availability1);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        // DELETE TESTS

        @WithMockUser(roles = { "ADMIN", "DRIVER" })
        @Test
        public void driver_can_delete_own_availability() throws Exception {
                // arrange

                long userId = currentUserService.getCurrentUser().getUser().getId();

                DriverAvailability availability1 = DriverAvailability.builder()
                                .driverId(userId)
                                .day("Monday")
                                .startTime("2:00PM")
                                .endTime("3:15PM")
                                .notes("test 1")
                                .build();

                when(driverAvailabilityRepository.findByIdAndDriverId(eq(15L), eq(userId))).thenReturn(Optional.of(availability1));

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/driverAvailability?id=15")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assertuserId
                verify(driverAvailabilityRepository, times(1)).findByIdAndDriverId(eq(15L), eq(userId));
                verify(driverAvailabilityRepository, times(1)).delete(availability1);

                Map<String, Object> json = responseToJson(response);
                assertEquals("Availability with id 15 deleted", json.get("message"));
        }

        @WithMockUser(roles = { "ADMIN", "DRIVER" })
        @Test
        public void driver_can_not_delete_others_ride() throws Exception {
                // arrange

                long userId = currentUserService.getCurrentUser().getUser().getId();

                DriverAvailability availability1 = DriverAvailability.builder()
                                .driverId(userId+1)
                                .day("Monday")
                                .startTime("2:00PM")
                                .endTime("3:15PM")
                                .notes("test 1")
                                .build();

                when(driverAvailabilityRepository.findByIdAndDriverId(eq(15L), eq(userId + 1))).thenReturn(Optional.of(availability1));

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/driverAvailability?id=15")
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(driverAvailabilityRepository, times(1)).findByIdAndDriverId(eq(15L), eq(userId));
                Map<String, Object> json = responseToJson(response);
                assertEquals("DriverAvailability with id 15 not found", json.get("message"));
        }

        @WithMockUser(roles = { "ADMIN", "DRIVER" })
        @Test
        public void throw_right_error_message_when_deleting_nonexistent() throws Exception {
                // arrange

                long userId = currentUserService.getCurrentUser().getUser().getId();

                when(driverAvailabilityRepository.findByIdAndDriverId(eq(15L), eq(userId + 1))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/driverAvailability?id=15")
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(driverAvailabilityRepository, times(1)).findByIdAndDriverId(eq(15L), eq(userId));
                Map<String, Object> json = responseToJson(response);
                assertEquals("DriverAvailability with id 15 not found", json.get("message"));
        }

        // PUT TESTS

        @WithMockUser(roles = { "ADMIN", "DRIVER" })
        @Test
        public void driver_can_edit_their_own_availability() throws Exception {
                // arrange

                long userId = currentUserService.getCurrentUser().getUser().getId();

                DriverAvailability availability1 = DriverAvailability.builder()
                                .driverId(userId)
                                .day("Monday")
                                .startTime("2:00PM")
                                .endTime("3:15PM")
                                .notes("test 1")
                                .build();

                DriverAvailability availability2 = DriverAvailability.builder()
                                .driverId(userId)
                                .day("Thursday")
                                .startTime("9:30AM")
                                .endTime("10:45AM")
                                .notes("test 2")
                                .build();

                String requestBody = mapper.writeValueAsString(availability2);

                when(driverAvailabilityRepository.findByIdAndDriverId(eq(67L), eq(userId))).thenReturn(Optional.of(availability1));

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/driverAvailability?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(driverAvailabilityRepository, times(1)).findByIdAndDriverId(eq(67L), eq(userId));
                verify(driverAvailabilityRepository, times(1)).save(availability2); // should be saved with correct user
                String responseString = response.getResponse().getContentAsString();
                assertEquals(requestBody, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "DRIVER" })
        @Test
        public void driver_can_not_edit_others_availability() throws Exception {
                // arrange

                long userId = currentUserService.getCurrentUser().getUser().getId();

                DriverAvailability availability1 = DriverAvailability.builder()
                                .driverId(userId+1)
                                .day("Monday")
                                .startTime("2:00PM")
                                .endTime("3:15PM")
                                .notes("test 1")
                                .build();

                DriverAvailability availability2 = DriverAvailability.builder()
                                .driverId(userId+1)
                                .day("Thursday")
                                .startTime("9:30AM")
                                .endTime("10:45AM")
                                .notes("test 2")
                                .build();

                String requestBody = mapper.writeValueAsString(availability2);

                when(driverAvailabilityRepository.findByIdAndDriverId(eq(67L), eq(userId+1))).thenReturn(Optional.of(availability1));

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/driverAvailability?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(driverAvailabilityRepository, times(1)).findByIdAndDriverId(eq(67L), eq(userId));
                Map<String, Object> json = responseToJson(response);
                assertEquals("DriverAvailability with id 67 not found", json.get("message"));
        }

        @WithMockUser(roles = { "ADMIN", "DRIVER" })
        @Test
        public void driver_can_not_edit_nonexistent_availability() throws Exception {
                // arrange

                long userId = currentUserService.getCurrentUser().getUser().getId();

                DriverAvailability availability1 = DriverAvailability.builder()
                                .driverId(userId)
                                .day("Monday")
                                .startTime("2:00PM")
                                .endTime("3:15PM")
                                .notes("test 1")
                                .build();


                String requestBody = mapper.writeValueAsString(availability1);

                when(driverAvailabilityRepository.findByIdAndDriverId(eq(67L), eq(userId))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/driverAvailability?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(driverAvailabilityRepository, times(1)).findByIdAndDriverId(eq(67L), eq(userId));
                Map<String, Object> json = responseToJson(response);
                assertEquals("DriverAvailability with id 67 not found", json.get("message"));
        }


}