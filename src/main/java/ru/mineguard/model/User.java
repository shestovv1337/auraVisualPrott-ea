package ru.mineguard.model;

import jakarta.persistence.*;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email, login, password, role, hwid, avatarUrl, salt, userAgent, roles, current;
    int ram;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "registration_date")
    private Date registrationDate;

    @Column(name = "ip_address")
    private String ipAddress;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "product_time")
    private Date product_time;

    public User() {
    }

    public User(String email, String login, String password, String salt) {
        this.email = email;
        this.login = login;
        this.password = password;
        this.salt = salt;
        this.ram = 2048;
        this.hwid = "Неизвестный";
        this.role = "Пользователь";
        this.registrationDate = new Date();
        this.product_time = new Date(/*Date.UTC(2025-1900, Calendar.MARCH, 19, 0, 0, 0)*/);
        this.current = "v1.16.5;";
        roles = "v1.16.5;";
    }

    public boolean isActiveSomeThing(){

        if(product_time != null && new Date().before(product_time)){
            return true;
        }

        return false;
    }

    public Long getId() {
        return this.id;
    }

    public String getEmail() {
        return this.email;
    }

    public String getLogin() {
        return this.login;
    }

    public String getPassword() {
        return this.password;
    }

    public String getRole() {
        return this.role;
    }

    public String getHwid() {
        return this.hwid;
    }

    public String getAvatarUrl() {
        return this.avatarUrl;
    }

    public String getSalt() {
        return this.salt;
    }

    public String getUserAgent() {
        return this.userAgent;
    }

    public int getRam() {
        return this.ram;
    }

    public Date getRegistrationDate() {
        return this.registrationDate;
    }

    public String getIpAddress() {
        return this.ipAddress;
    }

    public Date getProduct_time() {
        return this.product_time;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setHwid(String hwid) {
        this.hwid = hwid;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public void setSalt(String salt) {
        this.salt = salt;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public void setRam(int ram) {
        this.ram = ram;
    }

    public void setRegistrationDate(Date registrationDate) {
        this.registrationDate = registrationDate;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public void setProduct_time(Date product_time) {
        this.product_time = product_time;
    }

    public String getCurrent() {
        if (current == null) return "v1.16.5";
        return current;
    }

    public String getRoles() {
        return roles;
    }

    public void setRoles(String roles) {
        this.roles = roles;
    }

    public void setCurrent(String current) {
        this.current = current;
    }

    public String toString() {
        return "User(id=" + this.getId() + ", email=" + this.getEmail() + ", login=" + this.getLogin() + ", password=" + this.getPassword() + ", role=" + this.getRole() + ", hwid=" + this.getHwid() + ", avatarUrl=" + this.getAvatarUrl() + ", salt=" + this.getSalt() + ", userAgent=" + this.getUserAgent() + ", ram=" + this.getRam() + ", registrationDate=" + this.getRegistrationDate() + ", ipAddress=" + this.getIpAddress() + ", product_time=" + this.getProduct_time() + ")";
    }
    public String getAvatar(){
        String currentDirectory = System.getProperty("user.dir") + "/avatars/";
        Path uploadDir = Paths.get(currentDirectory);
        Path filePath = uploadDir.resolve(login + ".png");
        if(!filePath.toFile().exists()){
            return "/avatars/d.png";
        }
        return "/avatars/" + login + ".png";
    }

}
