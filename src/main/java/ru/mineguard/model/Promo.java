package ru.mineguard.model;

import jakarta.persistence.*;

@Entity
@Table(name = "promocodes")
public class Promo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String creator;
    private int discount;
    private int activates;

    private int maxActivates;

    private int discountReferral;
    private int sumAmount;

    public Promo() {
    }

    public Promo(String name, String creator, int discount, int discountReferral) {
        this.name = name;
        this.discount = discount;
        this.creator = creator;
        this.discountReferral = discountReferral;
        this.sumAmount = 0;
        this.activates = 0;
        this.maxActivates = 9999999;
    }

    public int setDiscountReferral(int discountReferral) {
        this.discountReferral = discountReferral;
        return discountReferral;
    }

    public Long getId() {
        return this.id;
    }

    public String getName() {
        return this.name;
    }

    public String getCreator() {
        return this.creator;
    }

    public int getDiscount() {
        return this.discount;
    }

    public int getActivates() {
        return this.activates;
    }

    public int getMaxActivates() {
        return this.maxActivates;
    }

    public int getDiscountReferral() {
        return this.discountReferral;
    }

    public int getSumAmount() {
        return this.sumAmount;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public void setDiscount(int discount) {
        this.discount = discount;
    }

    public void setActivates(int activates) {
        this.activates = activates;
    }

    public void setMaxActivates(int maxActivates) {
        this.maxActivates = maxActivates;
    }

    public void setSumAmount(int sumAmount) {
        this.sumAmount = sumAmount;
    }

    public boolean equals(final Object o) {
        if (o == this) return true;
        if (!(o instanceof Promo)) return false;
        final Promo other = (Promo) o;
        if (!other.canEqual((Object) this)) return false;
        final Object this$id = this.getId();
        final Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        final Object this$name = this.getName();
        final Object other$name = other.getName();
        if (this$name == null ? other$name != null : !this$name.equals(other$name)) return false;
        final Object this$creator = this.getCreator();
        final Object other$creator = other.getCreator();
        if (this$creator == null ? other$creator != null : !this$creator.equals(other$creator)) return false;
        if (this.getDiscount() != other.getDiscount()) return false;
        if (this.getActivates() != other.getActivates()) return false;
        if (this.getMaxActivates() != other.getMaxActivates()) return false;
        if (this.getDiscountReferral() != other.getDiscountReferral()) return false;
        if (this.getSumAmount() != other.getSumAmount()) return false;
        return true;
    }

    protected boolean canEqual(final Object other) {
        return other instanceof Promo;
    }

    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        final Object $name = this.getName();
        result = result * PRIME + ($name == null ? 43 : $name.hashCode());
        final Object $creator = this.getCreator();
        result = result * PRIME + ($creator == null ? 43 : $creator.hashCode());
        result = result * PRIME + this.getDiscount();
        result = result * PRIME + this.getActivates();
        result = result * PRIME + this.getMaxActivates();
        result = result * PRIME + this.getDiscountReferral();
        result = result * PRIME + this.getSumAmount();
        return result;
    }

    public String toString() {
        return "Promo(id=" + this.getId() + ", name=" + this.getName() + ", creator=" + this.getCreator() + ", discount=" + this.getDiscount() + ", activates=" + this.getActivates() + ", maxActivates=" + this.getMaxActivates() + ", discountReferral=" + this.getDiscountReferral() + ", sumAmount=" + this.getSumAmount() + ")";
    }
}
