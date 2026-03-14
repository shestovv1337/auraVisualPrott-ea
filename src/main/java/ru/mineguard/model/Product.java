package ru.mineguard.model;

import jakarta.persistence.*;

import java.util.Calendar;
import java.util.Date;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String image;
    private String description;
    private int price;
    private int discount;
    private int duration;
    private String funPayLink;
    private boolean role;

    public Product() {
    }

    public Product(String name, int price, int discount, String image, String descName, int duration, String funPayLink) {
        this.name = name;
        this.price = price;
        this.discount = discount;
        this.image = image;
        this.description = descName;
        this.duration = duration;
        this.funPayLink = funPayLink;
    }

    public Product(String name, int price, int discount, String image, String descName, int duration, String funPayLink, boolean role) {
        this.name = name;
        this.price = price;
        this.discount = discount;
        this.image = image;
        this.description = descName;
        this.duration = duration;
        this.funPayLink = funPayLink;
        this.role = role;
    }


    public void action(User user) {
        if (!role) {
            if ("ResetHWID".equals(description)) {
                user.setHwid("Неизвестный");
            } else if (duration > 0) {
                Calendar calendar = Calendar.getInstance();
                Date currentDate = user.getProduct_time() != null && !user.getProduct_time().equals(user.getRegistrationDate())
                        ? user.getProduct_time()
                        : new Date();
                calendar.setTime(currentDate);
                calendar.add(Calendar.DAY_OF_MONTH, duration);
                user.setProduct_time(calendar.getTime());
            }
        } else {
            user.setCurrent(this.description);
            user.setRoles("%s;%s".formatted(user.getRoles(), this.description));
        }
    }

    public Long getId() {
        return this.id;
    }

    public String getName() {
        return this.name;
    }

    public String getImage() {
        return this.image;
    }

    public String getDescription() {
        return this.description;
    }

    public int getPrice() {
        return this.price;
    }

    public int getDiscount() {
        return this.discount;
    }

    public int getDuration() {
        return this.duration;
    }

    public String getFunPayLink() {
        return this.funPayLink;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public void setDiscount(int discount) {
        this.discount = discount;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public void setFunPayLink(String funPayLink) {
        this.funPayLink = funPayLink;
    }

    public boolean equals(final Object o) {
        if (o == this) return true;
        if (!(o instanceof Product)) return false;
        final Product other = (Product) o;
        if (!other.canEqual((Object) this)) return false;
        final Object this$id = this.getId();
        final Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        final Object this$name = this.getName();
        final Object other$name = other.getName();
        if (this$name == null ? other$name != null : !this$name.equals(other$name)) return false;
        final Object this$image = this.getImage();
        final Object other$image = other.getImage();
        if (this$image == null ? other$image != null : !this$image.equals(other$image)) return false;
        final Object this$description = this.getDescription();
        final Object other$description = other.getDescription();
        if (this$description == null ? other$description != null : !this$description.equals(other$description))
            return false;
        if (this.getPrice() != other.getPrice()) return false;
        if (this.getDiscount() != other.getDiscount()) return false;
        if (this.getDuration() != other.getDuration()) return false;
        final Object this$funPayLink = this.getFunPayLink();
        final Object other$funPayLink = other.getFunPayLink();
        if (this$funPayLink == null ? other$funPayLink != null : !this$funPayLink.equals(other$funPayLink))
            return false;
        return true;
    }

    protected boolean canEqual(final Object other) {
        return other instanceof Product;
    }

    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        final Object $name = this.getName();
        result = result * PRIME + ($name == null ? 43 : $name.hashCode());
        final Object $image = this.getImage();
        result = result * PRIME + ($image == null ? 43 : $image.hashCode());
        final Object $description = this.getDescription();
        result = result * PRIME + ($description == null ? 43 : $description.hashCode());
        result = result * PRIME + this.getPrice();
        result = result * PRIME + this.getDiscount();
        result = result * PRIME + this.getDuration();
        final Object $funPayLink = this.getFunPayLink();
        result = result * PRIME + ($funPayLink == null ? 43 : $funPayLink.hashCode());
        return result;
    }

    public String toString() {
        return "Product(id=" + this.getId() + ", name=" + this.getName() + ", image=" + this.getImage() + ", description=" + this.getDescription() + ", price=" + this.getPrice() + ", discount=" + this.getDiscount() + ", duration=" + this.getDuration() + ", funPayLink=" + this.getFunPayLink() + ")";
    }
}
