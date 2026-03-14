package ru.mineguard.controller.api.client;

import jakarta.servlet.http.HttpServletResponse;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ru.mineguard.config.AppConfig;
import ru.mineguard.crypt.BCryptPasswordEncoder;
import ru.mineguard.model.User;
import ru.mineguard.model.repo.UserRepository;
import ru.mineguard.utils.Hash;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Optional;


@RestController
@RequestMapping("/api")
public class ClientAuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AppConfig appConfig;


    BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping(value = "/auth", consumes = "application/x-www-form-urlencoded; charset=UTF-8", produces = "text/plain; charset=UTF-8")
    @ResponseBody
    public String auth(HttpServletResponse response, @RequestParam("login") String login, @RequestParam("password") String password, @RequestParam("hwid") String hwid){

        JSONObject obj = new JSONObject();

        boolean isEmail = login.contains("@");

        Optional<User> optional = isEmail ? userRepository.findByEmail(login) : userRepository.findByLogin(login);

        if (optional.isPresent()) {
            User user = optional.get();

            boolean isPasswordValid = appConfig.isBcrypt()
                    ? passwordEncoder.matches(password, user.getPassword())
                    : Hash.verifyPassword(password, user.getSalt(), user.getPassword());

            if(isPasswordValid) {
                return sendData(user, obj, hwid);
            }
        }

        JSONObject fail = new JSONObject();
        fail.put("status", "fail");
        return fail.toJSONString();
    }


    private String sendData(User user, JSONObject obj, String hwid){

        if(user.getProduct_time().before(new Date())){
            obj.put("status", "ended");
            return obj.toJSONString();
        }

        if(user.getHwid() == null){
            user.setHwid(hwid);
            userRepository.save(user);
        }


        if(user.getHwid().equals(hwid)){
            SimpleDateFormat dateFormat = new SimpleDateFormat("dd.MM.yyyy HH:mm");

            String formattedDate = dateFormat.format(user.getRegistrationDate());
            String product_time = dateFormat.format(user.getProduct_time());

            obj.put("status", "ok");
            obj.put("username", user.getLogin());
            obj.put("register_date", formattedDate);
            obj.put("role", user.getRole());
            obj.put("uid", user.getId());
            obj.put("product_time", product_time);
            obj.put("hwid", user.getHwid());
            return obj.toJSONString();
        }

        if(!user.getHwid().equals(hwid)){
            obj.put("status", "incorrectHW");

            return obj.toJSONString();
        }

        return obj.toJSONString();
    }


}