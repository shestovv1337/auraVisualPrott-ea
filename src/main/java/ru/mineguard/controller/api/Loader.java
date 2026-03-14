package ru.mineguard.controller.api;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.mineguard.model.User;
import ru.mineguard.model.repo.UserRepository;
import ru.mineguard.session.SessionUtils;
import ru.mineguard.session.model.repo.SessionRepository;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Optional;

import static ru.mineguard.DemoApplication.adminSettings;

@RestController
@RequestMapping("/api")
public class Loader {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SessionRepository sessionRepository;

    @GetMapping("/version")
    @ResponseBody
    public String version(HttpServletResponse response) {
        return "1.0.3";
    }


    @GetMapping("/Loader")
    public ResponseEntity<FileSystemResource> Loader(HttpServletResponse response, HttpServletRequest request) {

        Optional<User> user = SessionUtils.getUser(request, sessionRepository);

        if(user.isPresent()) {

            try {
                if (adminSettings.getTexWorks() == 1) {
                    response.sendRedirect("/texworks");
                }
            }catch (Exception ex){
                ex.printStackTrace();
            }

            if (new Date().before(user.get().getProduct_time())) {
                String path = System.getProperty("user.dir") + "/Loader.exe";
                File dir = new File(path);
                if (dir.exists()) {
                    HttpHeaders headers = new HttpHeaders();
                    headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + dir.getName());
                    headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_OCTET_STREAM_VALUE);
                    return ResponseEntity.ok()
                            .headers(headers)
                            .contentLength(dir.length())
                            .body(new FileSystemResource(dir));
                } else {
                    try {
                        response.sendRedirect("/texworks");
                    } catch (IOException e) {
                        e.printStackTrace();
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                    }
                }
            } else {
                try {
                    response.sendRedirect("/cabinet");
                } catch (IOException e) {
                    e.printStackTrace();
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                }
            }
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/update")
    public ResponseEntity<FileSystemResource> Loader(HttpServletResponse response) {
            String path = System.getProperty("user.dir") + "/Loader.exe";
            File dir = new File(path);
            if(dir.exists()){
                HttpHeaders headers = new HttpHeaders();
                headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + dir.getName());
                headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_OCTET_STREAM_VALUE);
                return ResponseEntity.ok()
                        .headers(headers)
                        .contentLength(dir.length())
                        .body(new FileSystemResource(dir));
            }
        return ResponseEntity.notFound().build();
    }

}
