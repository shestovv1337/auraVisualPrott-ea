package ru.mineguard.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "payments")
@Getter
@Setter
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int productID;
    private Long userID;
    private String orderID;
    private String paymentType;
    private String status;
    private int price;
    private String promo;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "date")
    private Date date;

    @Transient
    private String url;

    private String signature;

    public Payment(){}

    public Payment(String paymentType, String orderID) {
        this.paymentType = paymentType;
        this.orderID = orderID;
        this.date = new Date();
        this.setStatus("WAIT");
    }


}
