package ru.mineguard.model.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import ru.mineguard.model.Promo;

import java.util.List;
import java.util.Optional;

public interface PromoRepository extends CrudRepository<Promo, Long> {

    Optional<Promo> findByName(String name);
    List<Promo> findByCreator(String creator);
    Optional<Promo> findById(Long id);

    boolean existsByName(String name);
}