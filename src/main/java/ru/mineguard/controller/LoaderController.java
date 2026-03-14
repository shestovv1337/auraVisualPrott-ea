package ru.mineguard.controller;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.mineguard.model.User;
import ru.mineguard.session.SessionUtils;
import ru.mineguard.session.model.repo.SessionRepository;


import java.util.*;


@Controller
public class LoaderController {

    @Autowired
    private SessionRepository sessionRepo;


    @GetMapping("/loaderTest")
    public String loaderSurface(Model model, HttpServletRequest request){
        return "loader";
    }

    @GetMapping("/LoaderPage")
    public String LoaderPage(Model model, HttpServletRequest request){
        String userAgent = request.getHeader("User-Agent");


        Optional<String> optional = SessionUtils.getSessionIdFromCookie(request);

        if(optional.isPresent()) {

            Optional<User> userOptional = SessionUtils.getUser(request, sessionRepo);
            if (userOptional.isPresent()) {

                User user = userOptional.get();


                model.addAttribute("userLogin", user.getLogin());
                model.addAttribute("userRole", user.getRole() == null ? "Пользователь" : user.getRole());
                model.addAttribute("avatar", user.getAvatar());
                model.addAttribute("token", 1);
                return "LoaderPage";
            }
        }
        return "redirect:/";
    }



}
