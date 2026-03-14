package ru.mineguard.model.repo;

import org.springframework.data.repository.CrudRepository;
import ru.mineguard.model.Payment;

import java.util.Optional;


public interface PaymentRepository extends CrudRepository<Payment, Long> {

    Optional<Payment> findByOrderID(String orderId);
    Optional<Payment> findByPromo(String orderId);


}
