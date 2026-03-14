package ru.mineguard.model;

import jakarta.persistence.*;

@Entity
@Table(name = "license_keys")
public class LicenseKey {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    public String name;
    public int days;
    public boolean used;
    public String activated;

    public LicenseKey() {
    }

    public LicenseKey(String name, int days, boolean used, String activated) {
        this.name = name;
        this.days = days;
        this.used = used;
        this.activated = activated;
    }

    public boolean getUsed() {
        return used;
    }

    public boolean setUsed(boolean used) {
        this.used = used;
        return used;
    }

    public String getName() {
        return name;
    }

    public Long getId() {
        return id;
    }

    public int getDays() {
        return days;
    }

    public String getActivated() {
        return activated;
    }

    public String setActivated(String activated) {
        this.activated = activated;
        return activated;
    }

}
