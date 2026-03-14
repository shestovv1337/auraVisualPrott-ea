package ru.mineguard.controller.api;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.mineguard.model.Promo;
import ru.mineguard.model.User;
import ru.mineguard.model.repo.PromoRepository;
import ru.mineguard.model.repo.UserRepository;
import ru.mineguard.session.SessionUtils;
import ru.mineguard.session.model.repo.SessionRepository;

import java.util.Date;
 import java.util.Optional;

import static ru.mineguard.DemoApplication.adminSettings;

@RestController
@RequestMapping("/api")
public class Admin {

    @Autowired
    public SessionRepository sessionRepository;

    @Autowired
    public UserRepository userRepository;
    @Autowired
    private PromoRepository promoRepository;

    @PostMapping(value = "/texworks", consumes = "application/x-www-form-urlencoded; charset=UTF-8", produces = "text/plain; charset=UTF-8")
    public String texworks(@RequestParam("type") String type, HttpServletResponse response, HttpServletRequest request) throws Exception {
        if(SessionUtils.hasRole("Администратор", request, sessionRepository)) {
            if(type.isEmpty() || type.equals("Отключены")){
                adminSettings.setTexWorks(0);
                return "Технические работы отключены!";
            }
            int parse = Integer.parseInt(type);
            adminSettings.setTexWorks(parse);
            return "Сохранено!";
        }
        return "ban";
    }

    @PostMapping(value = "/resetHWID", consumes = "application/x-www-form-urlencoded; charset=UTF-8", produces = "text/plain; charset=UTF-8")
    public String resetHWID(@RequestParam("uid") Long uid, HttpServletResponse response, HttpServletRequest request) throws Exception {
        if(SessionUtils.hasRole("Администратор", request, sessionRepository)) {
            Optional<User> user = userRepository.findById(uid);
            if (user.isPresent()) {
                user.get().setHwid(null);
                userRepository.save(user.get());
                return "HWID успешно скинут!";
            }
            return "Пользователь с таким UID не найден";
        }
        return "ban";
    }




    @PostMapping(value = "/deletePromo", consumes = "application/x-www-form-urlencoded; charset=UTF-8", produces = "text/plain; charset=UTF-8")
    public String deletePromo(@RequestParam("name") String name, HttpServletResponse response, HttpServletRequest request) throws Exception {
        if(SessionUtils.hasRole("Администратор", request, sessionRepository)) {
            Optional<Promo> promo = promoRepository.findByName(name);
            if (promo.isPresent()) {
                Promo promocode = promo.get();
                promoRepository.deleteById(promocode.getId());
                 return "Промокод: " + promocode.getName() + " удален!";
            }
            return "Промокод с таким названием не найден!";
        }
        return "ban";
    }


    @PostMapping(value = "/removeSub", consumes = "application/x-www-form-urlencoded; charset=UTF-8", produces = "text/plain; charset=UTF-8")
    public String removeSub(@RequestParam("uid") Long uid, HttpServletResponse response, HttpServletRequest request) throws Exception {
        if(SessionUtils.hasRole("Администратор", request, sessionRepository)) {
            Optional<User> user = userRepository.findById(uid);
            if (user.isPresent()) {
                user.get().setProduct_time(new Date());
                userRepository.save(user.get());
                return "Подписка у пользователя: " + user.get().getLogin() + " снята!";
            }
            return "Пользователь с таким UID не найден";
        }
        return "ban";
    }
}
