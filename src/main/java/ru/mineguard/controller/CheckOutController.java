package ru.mineguard.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.mineguard.DemoApplication;
import ru.mineguard.config.AppConfig;
import ru.mineguard.model.Payment;
import ru.mineguard.model.Product;
import ru.mineguard.model.Promo;
import ru.mineguard.model.User;
import ru.mineguard.model.repo.PaymentRepository;
import ru.mineguard.model.repo.ProductRepository;
import ru.mineguard.model.repo.PromoRepository;
import ru.mineguard.model.repo.UserRepository;
import ru.mineguard.session.SessionUtils;
import ru.mineguard.session.model.repo.SessionRepository;
import ru.mineguard.utils.PaymentUtils;

import java.util.Map;
import java.util.Optional;

@Controller
public class CheckOutController {

    @Autowired
    public UserRepository userRepository;

    @Autowired
    public PromoRepository promoRepository;

    @Autowired
    public SessionRepository sessionRepository;

    @Autowired
    public PaymentRepository paymentRepository;

    @Autowired
    public ProductRepository productRepository;

    @Autowired
    private AppConfig config;

    @ResponseBody
    @PostMapping("/createPayment")
    public String flex(HttpServletRequest request, Model model, @RequestBody Map<String, Object> payload) {

        if(!SessionUtils.isAuthenticated(request, sessionRepository)){
            return "ban";
        }

        long productID = Long.parseLong((String)payload.get("productId"));

        String promo = (String)payload.get("promoCode");
        Optional<Promo> optional = promoRepository.findByName(promo);

        Optional<Product> optionalProduct = productRepository.findById(productID);

        Product product = optionalProduct.orElse(null);

        assert product != null;
        int totalPrice = product.getPrice();

        boolean hasPromo = optional.isPresent();

        if(hasPromo){
            Promo promoObj = optional.get();
            int temporaryDiscount = promoObj.getDiscount();
            totalPrice -= (totalPrice * temporaryDiscount / 100);
        }

        User user = SessionUtils.getUser(request, sessionRepository).get();
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode jsonNode = mapper.createObjectNode();
        Payment payment = PaymentUtils.createPaymentPalych(totalPrice, product.getName(), user.getEmail(), config);
        jsonNode.put("redirectUrl", payment.getUrl());

        if(hasPromo) payment.setPromo(promo);
        payment.setProductID((int) productID);
        payment.setUserID(user.getId());
        paymentRepository.save(payment);

        return jsonNode.toPrettyString();
    }

}
