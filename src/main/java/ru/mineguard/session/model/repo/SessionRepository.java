package ru.mineguard.session.model.repo;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import ru.mineguard.session.model.Session;
import ru.mineguard.model.User;

import java.util.Optional;

public interface SessionRepository extends CrudRepository<Session, Long> {
    @Query("SELECT u FROM User u JOIN Session s ON u.id = s.userid WHERE s.token = :token")
    Optional<User> findUserByToken(@Param("token") String token);
    Optional<Session> findSessionByToken(String token);
 }
