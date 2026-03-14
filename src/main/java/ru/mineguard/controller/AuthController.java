package ru.mineguard.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import ru.mineguard.model.User;
import ru.mineguard.session.SessionUtils;
import ru.mineguard.session.model.repo.SessionRepository;

import java.util.Optional;

@Controller
public class AuthController {

    @Autowired
    public SessionRepository sessionRepository;

    @GetMapping("/register")
    public String register(Model model, HttpServletRequest request) {
        if(SessionUtils.isAuthenticated(request, sessionRepository)){
            return "redirect:/cabinet";
        }
        model.addAttribute("user", new User());
        model.addAttribute("url", request.getRequestURI());
        return "register";
    }

    @GetMapping("/login")
     public String login(Model model, HttpServletRequest request){
        if(SessionUtils.isAuthenticated(request, sessionRepository)){
            return "redirect:/cabinet";
        }

        model.addAttribute("url", request.getRequestURI());
        return "login";
    }

    @ResponseBody
    @GetMapping("/user")
    public String getCurrentUser(HttpServletRequest request) {
        if (SessionUtils.isAuthenticated(request, sessionRepository)) {
            Optional<User> user = SessionUtils.getUser(request, sessionRepository);
            return user.get().getLogin();
        }
        return "auth";
    }
}
