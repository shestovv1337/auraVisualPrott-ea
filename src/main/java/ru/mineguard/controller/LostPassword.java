package ru.mineguard.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
 //import ru.mineguard.mail.MailConfig;
//import ru.mineguard.mail.MailSender;
import ru.mineguard.model.User;
import ru.mineguard.model.repo.UserRepository;
import ru.mineguard.utils.Hash;


import java.util.HashMap;
import java.util.Optional;
import java.util.UUID;

@Controller
public class LostPassword {

    @GetMapping("/lostpassword")
    public String lostpassword(Model model, HttpServletRequest request) {
        model.addAttribute("url", request.getRequestURI());
        return "lostpassword";
    }

    @Autowired
    public UserRepository userRepository;
//    @Autowired
//    public MailSender sender;
//
//    HashMap<String, String> map = new HashMap();
//
//    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
//
//    @GetMapping(value = "/resetpass", produces = "text/plain;charset=UTF-8")
//    @ResponseBody
//    public String resetpass(@RequestParam String code){
//
//        if(map.containsKey(code)){
//
//            Optional<User> optional = userRepository.findByEmail(map.get(code));
//
//
//            if(optional.isPresent()){
//                User user = optional.get();
//
//
//                PasswordGenerator generator = new PasswordGenerator();
//                String password = generator.generate(10);
//                user.setPw_hash(encoder.encode(password));
//                userRepository.save(user);
//
//                sender.send(user.getEmail(), "Ваши новые данные", MailConfig.newData(user.getEmail(), password, user.getLogin()), true);
//
//                map.remove(code);
//                return "Ваш новый пароль был отправлен на почту: " + user.getEmail();
//            }
//
//        }
//
//        return "Код восстановления не верный!";
//    }
//
//    @PostMapping(value = "/lostpassword", produces = "text/plain;charset=UTF-8")
//    @ResponseBody
//    public String postAuth(@RequestParam String email, HttpServletResponse response, Model model){
//        Optional<User> optional = userRepository.findByEmail(email);
//        if(optional.isPresent()) {
//            User user = optional.get();
//
//            String code = Hash.md5(UUID.randomUUID().toString());
//
//            sender.send(user.getEmail(), "Восстановление доступа", MailConfig.getResetPasswordMsg(user.getLogin(), "https://deltaclient.fun/resetpass?code=" + code), true);
//
//            map.put(code, user.getEmail());
//        }else{
//            return "<p class=\"text-danger\">" + "Пользователь с такой почтой не найден." + "</p>";
//
//        }
//
//
//        return "<p class=\"text-success\">" + "Вашу почту отправлено письмо с восстановлением" + "</p>";
//
//     }

}
