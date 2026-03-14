package ru.mineguard.controller.api;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.mineguard.config.AppConfig;
import ru.mineguard.crypt.BCryptPasswordEncoder;
import ru.mineguard.service.RequestService;
import ru.mineguard.session.SessionUtils;
import ru.mineguard.model.User;
import ru.mineguard.session.model.repo.SessionRepository;
import ru.mineguard.model.repo.UserRepository;

import ru.mineguard.utils.Hash;
import ru.mineguard.utils.PaymentUtils;

import java.util.Base64;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import static ru.mineguard.DemoApplication.adminSettings;


@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    public UserRepository userRepository;

    @Autowired
    public SessionRepository sessionRepository;


    @Autowired
    private Admin admin;

    @Autowired
    public RequestService requestService;

    @Autowired
    private AppConfig appConfig;



    public static String encode(String plainText, String hwid, String token) {

        byte[] dataBytes = plainText.getBytes();

        final var hwidBytes = hwid.getBytes();
        final var tokenBytes = token.getBytes();

        for (int i = 0; i < dataBytes.length; i++) {
            dataBytes[i] ^= (byte) (hwidBytes[5]
                    ^ tokenBytes[i % token.length()]
                    ^ tokenBytes[1]
                    ^ hwidBytes[i % hwidBytes.length]
            );
        }

        plainText = Base64.getEncoder().encodeToString(dataBytes);

        try {
            return (plainText);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private final String prefix = "\n[$]: ";

    @GetMapping("/check")
    @ResponseBody
    public String check(@RequestParam("hwid") String hwid, @RequestParam("token") String token, HttpServletResponse response) {

        User user = userRepository.findByhwid(hwid);

        if (user != null) {
            StringBuilder data = new StringBuilder();

            data
                    .append("ok").append(";")
                    .append(user.getLogin()).append(";")
                    .append(user.getId()).append(";")
                    .append(user.getRole()).append(";")
                    .append(user.getProduct_time()).append(";");

            return encode(data.toString(), hwid, token);
        }

        return encode(prefix + "This user not found;", hwid, token);
    }


    BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping(value = "/login", consumes = "application/x-www-form-urlencoded; charset=UTF-8", produces = "text/plain; charset=UTF-8")
    public String loginUser(@RequestParam("login") String login, @RequestParam("password") String password, HttpServletResponse response) throws Exception {
        Optional<User> user = login.contains("@") ? userRepository.findByEmail(login) : userRepository.findByLogin(login);
        if(user.isPresent()) {
            User userObject = user.get();

            boolean isPasswordValid = appConfig.isBcrypt()
                    ? passwordEncoder.matches(password, userObject.getPassword())
                    : Hash.verifyPassword(password, userObject.getSalt(), userObject.getPassword());

            if (isPasswordValid) {
                SessionUtils.saveSession(userObject, response, sessionRepository);
                return "OK";
            }

        }
        return "Вы ввели не правильно логин или пароль.";
    }


    @PostMapping(value = "/register", consumes = "application/x-www-form-urlencoded; charset=UTF-8", produces = "text/plain; charset=UTF-8")
    public String register(@RequestParam Map<String, String> allParams,  @ModelAttribute("user") User user, Model model, HttpServletRequest request, HttpServletResponse response) {

        String recaptcha = allParams.get("h-captcha-response");

        if(!PaymentUtils.isCaptchaValid(recaptcha, appConfig.getHCaptchaSecret())){
            return "Вы не прошли капчу!";
        }

        String clientIp = requestService.getClientIp(request);

        if(user.getLogin().length() < 3){
            return "Длинна логина должна быть больше 3 символов.";
        }

        if (!user.getLogin().matches("^[a-zA-Z0-9]*$")) {
            return "Логин должен состоять только из английских букв и цифр.";
        }

        if(user.getEmail().length() > 30){
            return "Длинна почты должна быть меньше 30 символов.";
        }

        if(adminSettings.getTexWorks() == 4){
            return "Администрация временно закрыла доступ к регистарции.";
        }

        if(userRepository.findByEmail(user.getEmail()).isPresent()) return "Пользователь с такой почтой уже существует!";
        if(userRepository.findByLogin(user.getLogin()).isPresent()) return "Пользователь с таким логином уже существует!";


        String salt = Hash.generateSalt();

        String hashedPassword = appConfig.isBcrypt() ?  passwordEncoder.encode(user.getPassword()) : Hash.hashPassword(user.getPassword(), salt);

        User userNew = new User(user.getEmail(), user.getLogin(), hashedPassword, salt);
        userNew.setUserAgent(request.getHeader("User-Agent"));
        userNew.setIpAddress(clientIp);
        userRepository.save(userNew);
        SessionUtils.saveSession(userNew, response, sessionRepository);
        return "OK";
    }


    @PostMapping(value = "/loginLoader", consumes = "application/x-www-form-urlencoded; charset=UTF-8", produces = "text/plain; charset=UTF-8")
    public String loginUserFromLoader(@RequestParam("login") String login,   @RequestParam("hwid") String hwid, @RequestParam("password") String password, HttpServletResponse response,  HttpServletRequest request) throws Exception {
        try {
            Optional<User> user = login.contains("@") ? userRepository.findByEmail(login) : userRepository.findByLogin(login);
            if(user.isPresent()) {
                User userObject = user.get();

                boolean isPasswordValid = appConfig.isBcrypt()
                        ? passwordEncoder.matches(password, userObject.getPassword())
                        : Hash.verifyPassword(password, userObject.getSalt(), userObject.getPassword());


                if(isPasswordValid) {


                    if(userObject.getHwid() != null && !userObject.getHwid().equals("Неизвестный")) {
                        if(!userObject.getHwid().equals(hwid)){
                            return "HWID не совпадает";
                        }
                    }


                    if (userObject.isActiveSomeThing()) {
                        SessionUtils.saveSession(userObject, response, sessionRepository);
                        userObject.setHwid(hwid);
                        userRepository.save(userObject);
                        return "OK";
                    }

                    return "У вас нет подписки";
                }
            }
            return "Ваши данные неверные";
        }catch (Exception ex){
            return ex.getLocalizedMessage();
        }
    }


}
