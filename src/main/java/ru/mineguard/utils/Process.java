package ru.mineguard.utils;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;

public class Process {

    public static void execute(String[] string) throws Exception {

        ProcessBuilder processBuilder = new ProcessBuilder(string);

        processBuilder.redirectErrorStream(true);
        java.lang.Process process = processBuilder.start();

        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        String line;
        while ((line = reader.readLine()) != null) {
            System.out.println(line);
        }
        process.waitFor();
    }


    public static void execute(String[] string, File file) throws Exception {

        ProcessBuilder processBuilder = new ProcessBuilder(string);
        processBuilder.directory(file);
        processBuilder.redirectErrorStream(true);
        java.lang.Process process = processBuilder.start();
        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        String line;
        while ((line = reader.readLine()) != null) {
            System.out.println(line);
        }
        process.waitFor();
    }


}
