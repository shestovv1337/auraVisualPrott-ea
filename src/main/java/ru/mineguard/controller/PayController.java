package ru.mineguard.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
 import ru.mineguard.model.Payment;
import ru.mineguard.model.Product;
import ru.mineguard.model.Promo;
import ru.mineguard.model.User;
import ru.mineguard.model.repo.PaymentRepository;
import ru.mineguard.model.repo.ProductRepository;
import ru.mineguard.model.repo.PromoRepository;
import ru.mineguard.model.repo.UserRepository;

 import java.util.*;

@Controller
public class PayController {


    @Autowired
    public PaymentRepository paymentRepository;
    @Autowired
    public UserRepository userRepository;

    @Autowired
    public PromoRepository promoRepository;

    @Autowired
    public ProductRepository productRepository;



    @PostMapping("/payment/pallych/result")
    @ResponseBody
    public String palych(HttpServletRequest request, HttpServletResponse response){

        HashMap<String, String> params = new HashMap<>();

        Enumeration<String> parameterNames = request.getParameterNames();
        while (parameterNames.hasMoreElements()) {
            String paramName = parameterNames.nextElement();
            String paramValue = request.getParameter(paramName);
            params.put(paramName, paramValue);
        }

        System.out.println("PALYCH CONNECTED!");
        JSONObject jsonObject = new JSONObject();

        for(Map.Entry<String, String> s : params.entrySet()){
            jsonObject.put(s.getKey(), s.getValue());
            System.out.println(s.getKey() + " : " + s.getValue());
        }
        String status = (String) jsonObject.get("Status");
        if(status.contains("SUCCESS")) {
            giveProduct((String) jsonObject.get("InvId"));
        }
        return "SUCCESS";
    }



    private void giveProduct(String orderID) {
        Optional<Payment> optional = paymentRepository.findByOrderID(orderID);
        if (optional.isPresent()) {
            Payment payment = optional.get();
                System.out.println("PAYMENT FOUND");
                User user = userRepository.findById(payment.getUserID()).get();
                Optional<Product> productOptional = productRepository.findById(Long.valueOf(payment.getProductID()));

                Product product = productOptional.orElse(null);

                if (payment.getPromo() != null && !payment.getPromo().isEmpty()) {
                    Optional<Promo> promoOptional = promoRepository.findByName(payment.getPromo());
                    if (promoOptional.isPresent()) {
                        Promo promo = promoOptional.get();
                        promo.setActivates(promo.getActivates() + 1);
                        payment.setStatus("PAID");
                        promoRepository.save(promo);
                        paymentRepository.save(payment);
                    }
                }
            product.action(user);
        }
    }

    @GetMapping("/payment/success")
    public String success(@RequestParam(name = "pay_id", required = false) String id){
        return "redirect:/cabinet";
    }
}
