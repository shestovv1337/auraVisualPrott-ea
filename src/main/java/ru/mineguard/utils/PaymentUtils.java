package ru.mineguard.utils;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import org.json.simple.parser.ParseException;
import ru.mineguard.config.AppConfig;
import ru.mineguard.model.Payment;

import java.io.BufferedReader;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


public class PaymentUtils {


    public static Payment createPaymentPalych(int amount, String desc, String email, AppConfig config) {
        String order = UUID.randomUUID().toString();
        Payment payment = new Payment("Palych", order);
        payment.setPrice(amount);
        payment.setOrderID(order);

        if (amount < 100) {
            amount = 100;
        }

        try {

            CloseableHttpClient httpClient = HttpClients.createDefault();

            HttpPost httpPost = new HttpPost("https://pal24.pro/api/v1/bill/create");

            httpPost.addHeader("Authorization", "Bearer " + config.getPaluchShopToken());

            List<NameValuePair> params = new ArrayList<>();
            params.add(new BasicNameValuePair("amount", "" + amount));
            params.add(new BasicNameValuePair("description", desc));
            params.add(new BasicNameValuePair("order_id", payment.getOrderID()));
            params.add(new BasicNameValuePair("type", "multi"));
            params.add(new BasicNameValuePair("shop_id", config.getPaluchShopID()));
            params.add(new BasicNameValuePair("currency_in", "RUB"));
            params.add(new BasicNameValuePair("payer_email", email));


            httpPost.setEntity(new UrlEncodedFormEntity(params));

            HttpResponse response = httpClient.execute(httpPost);
            BufferedReader reader = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));

            String line;
            StringBuilder result = new StringBuilder();
            while ((line = reader.readLine()) != null) {
                result.append(line);
            }
            JSONObject jo = (JSONObject) new JSONParser().parse(result.toString());

            String link = (String) jo.get("link_page_url");


            payment.setUrl(link);

        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return payment;
    }


    public static boolean isCaptchaValid(String response, String secret) {

        try {
            String remoteIp = "127.0.0.1";

            String urlString = "https://api.hcaptcha.com/siteverify";
            URL url = new URL(urlString);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();

            connection.setRequestMethod("POST");
            connection.setDoOutput(true);

            String postData = "secret=" + secret + "&remoteip=" + remoteIp + "&response=" + response;

            connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            connection.setRequestProperty("Content-Length", String.valueOf(postData.length()));

            try (OutputStream os = connection.getOutputStream()) {
                byte[] input = postData.getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }


            try (BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8))) {
                StringBuilder responseBuilder = new StringBuilder();
                String responseLine;
                while ((responseLine = br.readLine()) != null) {
                    responseBuilder.append(responseLine.trim());
                }
                JSONParser parser = new JSONParser();
                JSONObject jsonObject = (JSONObject) parser.parse(responseBuilder.toString());

                System.out.println(jsonObject.toJSONString());
                return (boolean) jsonObject.get("success");
            } catch (ParseException e) {
                throw new RuntimeException(e);
            }


        } catch (IOException e) {
            e.printStackTrace();
        }

        return false;
    }
}
