package ru.mineguard.model.repo;

import org.antlr.v4.runtime.misc.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import ru.mineguard.model.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    Optional<User> findByLogin(String login);
    User findByhwid(String hwid);
    Page<User> findByRole(String role, Pageable pageable);
    @NotNull
    Optional<User> findById(@NotNull Long id);

    Page<User> findByIdIs(Long id, Pageable pageable);
}
