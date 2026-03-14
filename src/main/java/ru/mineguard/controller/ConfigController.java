package ru.mineguard.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import ru.mineguard.config.AppConfig;

import java.util.Map;

@Controller
public class ConfigController {

    @Autowired
    private AppConfig appConfig;

    @ResponseBody
    @GetMapping("/api/config/css-vars")
    public Map<String, String> getCssVars() {
        return Map.of(
                "--accent-color", appConfig.getAccentColor(),
                "--contrast-color", appConfig.getContrastColor()
        );
    }

}
