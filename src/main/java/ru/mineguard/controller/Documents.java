package ru.mineguard.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class Documents {


    @GetMapping("/eula")
    public String eula(Model model, HttpServletRequest request) {
        return "eula";
    }


    @GetMapping("/privacy_policy")
    public String privacy_policy(Model model, HttpServletRequest request) {
        return "policy";
    }
}
