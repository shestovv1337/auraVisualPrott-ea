package ru.mineguard.session.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "sessions")
@Getter @Setter
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    private String token;
    private Long userid;

    public Session(Long userid, String token) {
        this.userid = userid;
        this.token = token;
    }

    public Session(){}
}
