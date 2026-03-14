package ru.mineguard.controller.api.client;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import jakarta.servlet.http.HttpServletResponse;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.web.bind.annotation.*;
import ru.mineguard.utils.Hash;


import java.io.File;

@RestController
@RequestMapping("/api")
public class ChecksumController {

    @PostMapping("/hash")
    public String hash(@RequestBody JsonNode node, @RequestHeader(value = "Authorization", required = true)  String authorizationHeader) throws Exception {

        String dir = System.getProperty("user.dir") + "/client";

        System.out.println(authorizationHeader + " <--------");

        String bin = node.get("bin").asText();
        String libs = node.get("libs").asText();
        String runtime = node.get("runtime").asText();
        String assets = node.get("assets").asText();
        String signature = node.get("signature").asText();

        long time = node.get("time").asLong();

        String mySign = Hash.sha512(bin + ":" + libs + ":" + runtime + ":" + assets + ":" + time);

        if(mySign.equals(signature)) {
            ObjectNode responseJson = new ObjectMapper().createObjectNode();
            responseJson.put("data", System.currentTimeMillis());
            responseJson.put("bin", Hash.getFilderHashSha512(new File((dir + "/bin"))));
            responseJson.put("libs", Hash.getFilderHashSha512(new File((dir + "/libraries"))));
            responseJson.put("runtime", Hash.getFilderHashSha512(new File((dir + "/runtime"))));
            responseJson.put("assets", Hash.getFilderHashSha512(new File((dir + "/game/assets"))));
            return responseJson.toPrettyString();
        }

        return "";
    }



}
