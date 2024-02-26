package edu.ucsb.cs156.gauchoride.repositories;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import edu.ucsb.cs156.gauchoride.entities.DriverAvailability;

@Repository
public interface DriverAvailabilityRepository extends CrudRepository<DriverAvailability, Long> {
    Iterable<DriverAvailability> findAllByDriverId(String driverId);

    Optional<DriverAvailability> findByIdAndDriverId(long id, String driverId);
}
