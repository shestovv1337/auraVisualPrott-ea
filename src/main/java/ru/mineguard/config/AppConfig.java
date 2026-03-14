package ru.mineguard.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.json.JsonMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mineguard.model.Product;
import ru.mineguard.model.repo.ProductRepository;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class AppConfig {

    private final JsonMapper jsonMapper = new JsonMapper();

    private JsonNode config;

    @Autowired
    public ProductRepository productRepository;

    @PostConstruct
    public void init(){
        try {
            File configFile = new File("config.json");
            this.config = jsonMapper.readTree(configFile);
        } catch (Exception e) {
            throw new RuntimeException("Failed to load config.json", e);
        }

        JsonNode products = getProducts();

        List<Product> list = new ArrayList<>();

        for(JsonNode product : products){
            Product object = new Product(product.get("name").asText(), product.get("price").asInt(), 0, "/img/logo.png", product.get("desc").asText(), product.get("duration").asInt(),  "");
            list.add(object);
        }

        updateProducts(list);
    }

    public void updateProducts(List<Product> products){

        products.forEach(product -> {
            Product existingProduct =  productRepository.findByDescription(product.getDescription());

            if (existingProduct == null) {
                productRepository.save(product);
                System.out.printf("[%d] Product %s has created!\n", product.getId(), product.getDescription());
            } else {
                boolean updated = false;
                if (existingProduct.getPrice() != product.getPrice()) {
                    existingProduct.setPrice(product.getPrice());
                    updated = true;
                    System.out.printf("[%d] Product %s price updated to %d!\n",
                            existingProduct.getId(), existingProduct.getName(), existingProduct.getPrice());
                }
                if (existingProduct.getDiscount() != product.getDiscount()) {
                    existingProduct.setDiscount(product.getDiscount());
                    updated = true;
                    System.out.printf("[%d] Product %s discount updated to %d%%!\n",
                            existingProduct.getId(), existingProduct.getName(), existingProduct.getDiscount());
                }
                if (!Objects.equals(existingProduct.getFunPayLink(), product.getFunPayLink())) {
                    existingProduct.setFunPayLink(product.getFunPayLink());
                    updated = true;
                    System.out.printf("[%d] Product %s funPayLink updated to %s!\n",
                            existingProduct.getId(), existingProduct.getName(), existingProduct.getFunPayLink());
                }
                if (updated) {
                    productRepository.save(existingProduct);
                }
            }
        });
    }

    public JsonNode getProducts() {
        return config.path("web").path("products");
    }

    public String getClientName() {
        return "auraVisual";
    }

    public String getPath(){
        return config.get("client").get("path").asText();
    }

    public String getArgumentClientPath(){
        return config.get("client").get("argumentClientPath").asText();
    }


    public String getDomain(){
        return config.get("web").get("domain").asText();
    }

    public String getSupportEmail() {
        return config.get("web").get("support_mail").asText();
    }

    public String getLLC() {
        return config.get("web").get("LLC").asText();
    }

    public String getRUNAME() {
        return config.get("web").get("RU_NAME").asText();
    }


    public String getPaluchShopID() {
        return config.path("web").path("payment_system").get("shopID").asText();
    }

    public String getPaluchShopToken() {
        return config.path("web").path("payment_system").get("token").asText();
    }


    public boolean isBcrypt() {
        return config.path("web").get("bcrypt").asBoolean();
    }


    public String getHCaptchaSite() {
        return config.path("web").path("captcha").get("HCaptchaSite").asText();
    }

    public String getHCaptchaSecret() {
        return config.path("web").path("captcha").get("HCaptchaSecret").asText();
    }



    public String getVideo() {
        return config.get("web").get("social").get("video").asText();
    }

    public String getDiscord() {
        return config.get("web").get("social").get("discord").asText();
    }

    public String getTelegram() {
        return config.get("web").get("social").get("telegram").asText();
    }

    public String getYouTube() {
        return config.get("web").get("social").get("youtube").asText();
    }

    public String getAccentColor() {
        return config.get("web").get("accent-color").asText();
    }
    public String getContrastColor() {
        return config.get("web").get("contrast-color").asText();
    }
}