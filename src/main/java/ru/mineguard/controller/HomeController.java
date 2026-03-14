package ru.mineguard.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import ru.mineguard.model.repo.UserRepository;
import ru.mineguard.session.model.repo.SessionRepository;


import java.time.LocalDate;
import java.time.temporal.ChronoUnit;


@Controller
public class HomeController {

    @Autowired
    public SessionRepository sessionRepository;

    @Autowired
    public UserRepository userRepository;

    @GetMapping("/")
    public String home(Model model, HttpServletRequest request){
        model.addAttribute("userCount", userRepository.count());


        LocalDate targetDate = LocalDate.of(2025, 5, 21);
        LocalDate currentDate = LocalDate.now();
        long daysRemaining = ChronoUnit.DAYS.between(currentDate, targetDate);
        daysRemaining = Math.abs(daysRemaining);


        model.addAttribute("daysRemaining", daysRemaining);
        return "index";
    }



}
