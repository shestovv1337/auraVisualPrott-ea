package ru.mineguard.controller;

import java.security.SecureRandom;
import java.util.Random;

public class PasswordGenerator {

    private static final String UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String LOWER = UPPER.toLowerCase();
    private static final String DIGITS = "0123456789";
    private static final String ALPHANUM = UPPER + LOWER + DIGITS;

    private final Random random;

    public PasswordGenerator() {
        random = new SecureRandom();
    }

    public String generate(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            int index = random.nextInt(ALPHANUM.length());
            sb.append(ALPHANUM.charAt(index));
        }
        return sb.toString();
    }

}