package ru.mineguard.model.repo;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import ru.mineguard.model.LicenseKey;

public interface LicenseKeyRepository extends JpaRepository<LicenseKey, Long> {
    LicenseKey findByName(String name);
    LicenseKey findByActivated(String activated);
}
