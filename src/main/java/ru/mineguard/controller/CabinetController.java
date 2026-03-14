package ru.mineguard.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import ru.mineguard.config.AppConfig;
import ru.mineguard.crypt.BCryptPasswordEncoder;
import ru.mineguard.model.*;
import ru.mineguard.model.repo.*;
import ru.mineguard.session.SessionUtils;
import ru.mineguard.session.model.Session;
import ru.mineguard.session.model.repo.SessionRepository;
import ru.mineguard.utils.Hash;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.*;

import static ru.mineguard.DemoApplication.adminSettings;

@Controller
public class CabinetController {

    @Autowired
    public SessionRepository sessionRepository;

    @Autowired
    public UserRepository userRepository;

    @Autowired
    public PromoRepository promoRepository;

    @Autowired
    public LicenseKeyRepository licenseKeyRepository;

    @Autowired
    public PaymentRepository paymentRepository;

    @Autowired
    public ProductRepository productRepository;
    @Autowired
    private AppConfig appConfig;


    @GetMapping("/cabinet")
    public String login(Model model, HttpServletRequest request){
        if(!SessionUtils.isAuthenticated(request, sessionRepository)){
            return "redirect:/login";
        }
        User user = SessionUtils.getUser(request, sessionRepository).get();
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd.MM.yyyy HH:mm");
        String formattedDate = dateFormat.format(user.getRegistrationDate());
        model.addAttribute("userEmail", user.getEmail());
        model.addAttribute("userLogin", user.getLogin());
        model.addAttribute("userRole", user.getRole());
        model.addAttribute("userRegisterDate", formattedDate);
        model.addAttribute("userHwid", user.getHwid() == null ? "Неизвестный" : user.getHwid());
        model.addAttribute("userUID", user.getId());
        model.addAttribute("admin", user.getRole().equals("Администратор"));
        if(new Date().before(user.getProduct_time())) {
            String productTime = dateFormat.format(user.getProduct_time());
            model.addAttribute("license", productTime);
        }
        model.addAttribute("avatar", user.getAvatar());
        model.addAttribute("ram", user.getRam());
        return "cabinet";
    }


    @GetMapping("/promocodes")
    public String promos(Model model, HttpServletRequest request){
        if(!SessionUtils.hasRole("Администратор", request, sessionRepository)) {
            return "redirect:/";
        }
        List<Promo> promos = new ArrayList<>();

        promoRepository.findAll().forEach(promos::add);

        model.addAttribute("promos", promos);
        return "promocodes";
    }


    public List<LicenseKey> licenseKeys = new ArrayList<>();


    @PostMapping(value = "/generateKeys", consumes = "application/x-www-form-urlencoded; charset=UTF-8", produces = "text/plain; charset=UTF-8")
    public String generateKeys(@RequestParam("days") int days, @RequestParam("count") int count, HttpServletResponse response, HttpServletRequest request) throws Exception {
        if(SessionUtils.hasRole("Администратор", request, sessionRepository)) {
            licenseKeys.clear();
            StringBuilder builder = new StringBuilder();
            for(int i= 0; i < count; i++) {
                LicenseKey licenseKey = new LicenseKey(UUID.randomUUID().toString(), days, false, "");
                licenseKeys.add(licenseKey);
                licenseKeyRepository.save(licenseKey);
            }
            return "redirect:/admin";
        }
        return "redirect:/";
    }


    @ResponseBody
    @PostMapping("/setMemory")
    public String setMemory(@RequestParam int value, HttpServletRequest request) {
        if (SessionUtils.isAuthenticated(request, sessionRepository)) {
            Optional<User> user = SessionUtils.getUser(request, sessionRepository);
            if(user.isPresent()) {
                User userProfile = user.get();
                userProfile.setRam(value);
                userRepository.save(userProfile);
            }
        }
        return "OK";
    }


    @ResponseBody
    @PostMapping(value = "/resetPass", consumes = "application/x-www-form-urlencoded; charset=UTF-8", produces = "text/plain; charset=UTF-8")
    public String resetPass(@RequestParam("uid") Long uid, HttpServletResponse response, HttpServletRequest request) throws Exception {
        if(SessionUtils.hasRole("Администратор", request, sessionRepository)) {
            Optional<User> user = userRepository.findById(uid);
            if (user.isPresent()) {

                User person = user.get();

                String pass_new = Hash.sha1(UUID.randomUUID().toString()).substring(10);

                person.setPassword(appConfig.isBcrypt() ?  passwordEncoder.encode(pass_new) : Hash.hashPassword(pass_new, person.getSalt()));
                userRepository.save(person);

                return "<p class=\"text-success\">" + "Успех! Новый пароль: " + pass_new + "</p>";
            }
            return "<p class=\"text-danger\">" + "Пользователь с таким UID не найден."+ "</p>";
        }
        return "ban";
    }




    @ResponseBody
    @PostMapping(value = "/infoPromo", consumes = "application/x-www-form-urlencoded; charset=UTF-8", produces = "text/plain; charset=UTF-8")
    public String infoPromo(@RequestParam("promo") String promo,   @RequestParam("startDate") String startDateStr,
                            @RequestParam("endDate") String endDateStr, HttpServletResponse response, HttpServletRequest request) throws Exception {
        if(SessionUtils.hasRole("Администратор", request, sessionRepository)) {

            Optional<Promo> optional = promoRepository.findByName(promo);

            if (optional.isPresent()) {
                Promo promoObj = optional.get();

                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                Date startDate = dateFormat.parse(startDateStr);
                Date endDate = dateFormat.parse(endDateStr);


                Optional<User> optionalUser = userRepository.findByLogin(promoObj.getCreator());

                if(optionalUser.isPresent()) {

                    List<Payment> payments = new ArrayList<>();

                    paymentRepository.findAll().forEach(payments::add);

                    List<Payment> paymentsByPromo = payments.stream()
                            .filter(p -> p.getStatus().equals("PAID"))
                            .filter(p -> p.getPromo() != null && p.getPromo().equalsIgnoreCase(promo))
                            .filter(p -> !p.getDate().before(startDate) && !p.getDate().after(endDate))
                            .toList();

                    int howMuchMoneyWorked = 0;

                    for(Payment payment : paymentsByPromo) {
                        int totalPrice = payment.getPrice();

                        int temporaryDiscount = promoObj.getDiscount();
                        totalPrice -= (totalPrice * temporaryDiscount / 100);

                        howMuchMoneyWorked+=totalPrice;
                    }


                    int dolg = (howMuchMoneyWorked * promoObj.getDiscountReferral() / 100);


                    return "<p>Скидка: " + promoObj.getDiscount() + "%</p>" +
                            "<p>Активации: " + promoObj.getActivates() + "</p>" +
                            "<p>Процент реферального вознаграждения: " + promoObj.getDiscountReferral() + "%</p>" +
                            "<p>Заработано денег: " + howMuchMoneyWorked + "₽</p>" +
                            "<p>Сколько вы должны: " + dolg + "₽</p>";
                }

                return "<p>Скидка: " + promoObj.getDiscount() + "%</p>" +
                        "<p >Активации: " + promoObj.getActivates() + "</p>" +
                        "<p >Процент реферального вознаграждения: " + promoObj.getDiscountReferral() + "%</p>";
            }

            return "<p class=\"text-danger\">" + "Промокод не найден." + "</p>";
        }
        return "ban";
    }




    @ResponseBody
    @PostMapping(value = "/createPromo", consumes = "application/x-www-form-urlencoded; charset=UTF-8", produces = "text/plain; charset=UTF-8")
    public String generateKeys(@RequestParam("name") String name, @RequestParam("percent") int percent, @RequestParam("uid") Long uid, @RequestParam("ref_percent") int ref_percent, HttpServletResponse response, HttpServletRequest request) throws Exception {
        if(SessionUtils.hasRole("Администратор", request, sessionRepository)) {

            Optional<Promo> promoExist = promoRepository.findByName(name);

            if(promoExist.isPresent()){
                return "<p class=\"text-danger\">" + "Промокод с таким названием уже существует!" + "</p>";
            }

            Optional<User> optional = userRepository.findById(uid);
            Promo promo = new Promo();

            if(optional.isPresent()) {
                User user = optional.get();
                promo.setName(name);
                promo.setDiscount(percent);
                promo.setCreator(user.getLogin());
                promo.setDiscountReferral(ref_percent);
            }

            if(percent > 98){
                return "<p class=\"text-danger\">" + "Промокод не может быть больше 99% скидкой" + "</p>";
            }
            if(percent < 2){
                return "<p class=\"text-danger\">" + "Промокод не может быть меньше 2% скидкой" + "</p>";
            }

            promoRepository.save(promo);
            return "<p class=\"text-success\">" + "Промокод на: " + percent + "% создан!" + "</p>";
        }
        return "Неизвестная ошибка";
    }








    @GetMapping("/products")
    public String products(Model model, HttpServletRequest request) {
        if(!SessionUtils.isAuthenticated(request, sessionRepository)) {
            return "redirect:/login";
        }



        List<String> paymentMethods = Arrays.asList("СБП", "Банковская карта");
        model.addAttribute("paymentMethods", paymentMethods);

        List<Product> products = new ArrayList<>();
        productRepository.findAll().forEach(products::add);

        model.addAttribute("products", products);


        return "products";
    }
    @ResponseBody
    @PostMapping(value = "/uploadAvatar", produces = "text/plain;charset=UTF-8")
    public String avatar(HttpServletRequest request, @RequestParam("file") MultipartFile file, HttpServletResponse response) throws IOException {
        if(!SessionUtils.isAuthenticated(request, sessionRepository)){
            return "no";
        }

        User user = SessionUtils.getUser(request, sessionRepository).get();

        try {
            String currentDirectory = System.getProperty("user.dir") + "/avatars/";
            Path uploadDir = Paths.get(currentDirectory);
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }
            Path filePath = uploadDir.resolve(user.getLogin() + ".png");
            Files.write(filePath, file.getBytes());

        }catch (Exception exception){
            exception.printStackTrace();
        }
        return user.getAvatar();
    }

    @GetMapping("/avatar/{login}")
    public ResponseEntity<Resource> getAvatar(@PathVariable String login) {
        try {

            String currentDirectory = System.getProperty("user.dir") + "/avatars/";
            Path uploadDir = Paths.get(currentDirectory);
            Path filePath = uploadDir.resolve(login + ".png");

            if(!filePath.toFile().exists()) {
                filePath = uploadDir.resolve( "d.png");
            }

            if (Files.exists(filePath)) {

                Resource resource = new UrlResource(filePath.toUri());

                if (resource.exists() || resource.isReadable()) {
                    return ResponseEntity.ok()
                            .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                            .header(HttpHeaders.CONTENT_TYPE, Files.probeContentType(filePath))
                            .body(resource);
                }
            }

            return ResponseEntity.notFound().build();

        } catch (MalformedURLException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/admin")
    public String admin(Model model, HttpServletRequest request){

        if(!licenseKeys.isEmpty()){
            StringBuilder keysBuilder = new StringBuilder();
            for (LicenseKey key : licenseKeys) {
                keysBuilder.append(key.getName()).append("\n");
            }
            model.addAttribute("licenseKeysString", keysBuilder.toString().trim());
        }

        if(!SessionUtils.isAuthenticated(request, sessionRepository)){
            return "redirect:/login";
        }

        if(!SessionUtils.hasRole("Администратор", request, sessionRepository)){
            return "redirect:/";
        }

        model.addAttribute("currentTexWork", adminSettings.getTexWorks());

        return "admin";
    }



    @ResponseBody
    @PostMapping("/check-promo-code")
    public Map<String, Object> checkPromoCode(@RequestParam String promoCode) {
        Map<String, Object> response = new HashMap<>();
        Optional<Promo> optional = promoRepository.findByName(promoCode);
        if(optional.isEmpty()){
           response.put("valid", false);
           response.put("discountPercent", 0);
           return response;
        }
        Promo promo = optional.get();
        response.put("valid", true);
        response.put("discountPercent", promo.getDiscount());
        return response;
    }


    @GetMapping("/texworks")
    public String texworks(Model model, HttpServletRequest request){
        return "texworks";
    }

    @GetMapping("/logout")
    public String logout(HttpServletRequest request, HttpServletResponse response, Model model){
        Optional<String> optional = SessionUtils.getSessionIdFromCookie(request);

        optional.ifPresent(string -> {
            Optional<Session> sessionOptional = sessionRepository.findSessionByToken(string);
            sessionOptional.ifPresent(session -> sessionRepository.delete(session));
        });

        return "redirect:/";
    }

    BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping(value = "/change_password", produces = "text/plain;charset=UTF-8")
    @ResponseBody
    public String change_password(@RequestParam String old_password, String new_password, String reapeat_password, HttpServletRequest request, HttpServletResponse response, Model model) {
        response.setCharacterEncoding("UTF-8");

        if(!SessionUtils.isAuthenticated(request, sessionRepository)){
            return "ban";
        }

        User user = SessionUtils.getUser(request, sessionRepository).get();


        boolean isPasswordValid = appConfig.isBcrypt()
                ? passwordEncoder.matches(old_password, user.getPassword())
                : Hash.verifyPassword(new_password, user.getSalt(), user.getPassword());

        if (!isPasswordValid) {
            return "Неверный пароль.";
        }


        if(!reapeat_password.equals(new_password)){
            return "Пароли отличаются (Подтверждение пароля).";
        }

        if(new_password.length() >= 6) {
            user.setPassword(appConfig.isBcrypt() ?  passwordEncoder.encode(new_password) : Hash.hashPassword(user.getPassword(), user.getSalt()));
            userRepository.save(user);
            return "OK";
        }
        return "Пароль должен быть больше 5 символов.";
    }



    @PostMapping(value = "/activate", produces =  "text/plain;charset=UTF-8")
    @ResponseBody
    public String activate(@RequestParam String key, HttpServletRequest request) {

        Optional<User> optional = SessionUtils.getUser(request, sessionRepository);

        if(optional.isEmpty()){
            return "fuck";
        }

        if(!key.isEmpty()){
            User user = optional.get();
            LicenseKey licenseKey = licenseKeyRepository.findByName(key);
            if(licenseKey != null){
                Date currentDate = new Date();
                Calendar calendar = Calendar.getInstance();
                calendar.setTime(currentDate);
                calendar.add(Calendar.DAY_OF_MONTH, licenseKey.getDays());
                user.setProduct_time(calendar.getTime());
                SimpleDateFormat dateFormat = new SimpleDateFormat("dd.MM.yyyy");
                String formattedDate = dateFormat.format(user.getProduct_time());
                userRepository.save(user);
                licenseKeyRepository.delete(licenseKey);
                return "Ключ активирован! Подписка активна до: " + formattedDate + ".";
            }else{
                return "Ключ не найден.";
            }
        }
        return "Что то пошло не так.";
    }


}
