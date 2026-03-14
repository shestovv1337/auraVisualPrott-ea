package ru.mineguard.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import ru.mineguard.config.AppConfig;
import ru.mineguard.model.User;
import ru.mineguard.model.repo.UserRepository;


import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import java.util.stream.Stream;

import static org.springframework.http.HttpStatus.OK;

@Controller
public class ProtectionService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AppConfig appConfig;

    private String parse() {
        StringBuilder stringBuilder = new StringBuilder();
        try {
            String currentPath = "%s/client/".formatted(appConfig.getPath());
            File currentFile = new File(currentPath);
            Stream<Path> stream = Files.walk((currentFile).toPath()).filter(file -> file.toFile().isFile() && file.toFile().getName().endsWith(".jar"));

            for (Path file : stream.toList()) {
                stringBuilder.append("%s/".formatted(appConfig.getArgumentClientPath()));
                stringBuilder.append(file.toFile()
                                .getAbsoluteFile().getAbsolutePath().replaceAll("\\\\", "/")
                                .replaceAll(currentPath, ""))
                        .append(";");
            }

        } catch (IOException e) {
            throw new RuntimeException(e);
        }


        return stringBuilder.toString();

    }
    @GetMapping("/getRam")
    @ResponseBody
    public String getRam(HttpServletRequest httpServletRequest, @RequestParam("hwid") String hwid) {
//            String token = payload.get("token");
        User user = userRepository.findByhwid(hwid);
        if (user == null) {
            return "2024";
        }
        return String.valueOf(user.getRam());
    }

    @GetMapping("/launcher/arguments")
    @ResponseBody
    public ResponseEntity<String> arguments(@RequestParam("hwid") String hwid, @RequestParam("token") String token) {
        if (!hwid.isEmpty()) {
            StringBuilder stringBuilder = new StringBuilder("extracted<mx>");

            stringBuilder
                    .append("-Djava.library.path=").append(appConfig.getArgumentClientPath()).append("/bin/").append("<mx>")
                    .append("-Djava.class.path=").append(parse()).append("<mx>")
                    .append("-Xverify:none<mx>")
                    .append("--gameDir<mx>")
                    .append(appConfig.getArgumentClientPath()).append("/game").append("<mx>")
                    .append("--assetsDir<mx>")
                    .append(appConfig.getArgumentClientPath()).append("/game").append("/assets/").append("<mx>")
                    .append("--version<mx>1.16<mx>--username<mx>--assetIndex<mx>1.16<mx>--userProperties<mx>{}<mx>--accessToken<mx>0<mx>zdarova<mx>nah<mx>")
            ;

            byte[] dataBytes = stringBuilder.toString().getBytes();
            for (int i = 0; i < dataBytes.length; i++) {
                dataBytes[i] ^= 0;
            }
            try {
                return new ResponseEntity<>(stringBuilder.toString(), OK);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }

        } else {
            User user = userRepository.findByhwid(hwid);
            user.setRole("Заблокирован");
            userRepository.save(user);
            return new ResponseEntity<>("", OK);
        }
    }






}