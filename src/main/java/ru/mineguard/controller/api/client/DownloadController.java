package ru.mineguard.controller.api.client;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api")
public class DownloadController {

    @PostMapping("/download")
    @ResponseBody
    public String getList(String type, @RequestHeader(value = "Authorization", required = true)  String authorizationHeader) {

        if(authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")){
            return "";
        }
        String tokenDir = System.getProperty("user.dir") + "/client";
        String token = authorizationHeader.replace("Bearer ", "");

        int version = Integer.parseInt(token);

        if (type.equals("bin") || type.equals("assets") || type.equals("libs") || type.equals("runtime")) {
            String currentDirectory = type;
            switch (type) {
                case "bin":
                    currentDirectory = tokenDir + "/bin";
                    break;
                case "libs":
                    currentDirectory = tokenDir + "/libraries";
                    break;
                case "assets":
                    currentDirectory = tokenDir + "/game/assets";
                    break;
                case "runtime":
                    currentDirectory = tokenDir + "/runtime";
                    break;
            }
            JSONObject jsonObject = new JSONObject();
            File dir = new File(currentDirectory);
            JSONArray filesArray = new JSONArray();
            exploreDirectory(dir, filesArray);
            jsonObject.put("files", filesArray);
            return jsonObject.toJSONString();
        }
        return "";
    }



    private void exploreDirectory(File dir, JSONArray filesArray) {
        for (File file : dir.listFiles()) {
            JSONObject fileObject = new JSONObject();
            fileObject.put("name", file.getName());
            fileObject.put("isDirectory", file.isDirectory());
            if (file.isDirectory()) {
                JSONArray subFilesArray = new JSONArray();
                exploreDirectory(file, subFilesArray);
                fileObject.put("files", subFilesArray);
            }
            filesArray.add(fileObject);
        }
    }
    @GetMapping("/download")
    public ResponseEntity<FileSystemResource> downloadFile(@RequestParam(name = "name") String name, @RequestParam(name = "type") String type) {
        try {
            String currentDirectory = System.getProperty("user.dir") + "/client/";
            File dir = new File(currentDirectory);
            if (dir.exists() && dir.isDirectory()) {
                return downloadFilesFromSubdirectories(dir, name);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return ResponseEntity.notFound().build();
    }

    private ResponseEntity<FileSystemResource> downloadFilesFromSubdirectories(File directory, String name) {
        try {
            for (File file : directory.listFiles()) {
                if (file.isDirectory()) {
                    ResponseEntity<FileSystemResource> response = downloadFilesFromSubdirectories(file, name);
                    if (response != null) {
                        return response;
                    }
                } else {
                    if (name.equals(file.getName())) {
                        HttpHeaders headers = new HttpHeaders();
                        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + name);
                        headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_OCTET_STREAM_VALUE);
                        return ResponseEntity.ok()
                                .headers(headers)
                                .contentLength(file.length())
                                .body(new FileSystemResource(file));
                    }
                }
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }


}
