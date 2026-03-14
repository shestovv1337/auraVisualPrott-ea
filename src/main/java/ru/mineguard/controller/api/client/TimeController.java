package ru.mineguard.controller.api.client;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TimeController {

    @PostMapping("/swamp")
    @ResponseBody
    public byte[] swamp(){
        byte[] bytes = new String(System.currentTimeMillis() + "").getBytes();
        for(int i = 0; i < bytes.length; i++){
            bytes[i] = (byte) (bytes[i] ^ bytes.length % 28121 ^ 4);
        }
        return bytes;
    }

}
