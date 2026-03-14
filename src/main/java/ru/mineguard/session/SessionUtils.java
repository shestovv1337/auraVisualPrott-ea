package ru.mineguard.session;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import ru.mineguard.model.User;
import ru.mineguard.session.model.Session;
import ru.mineguard.session.model.repo.SessionRepository;

import java.util.Arrays;
import java.util.Optional;
import java.util.UUID;

public class SessionUtils {

    public static Optional<String> getSessionIdFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            return Arrays.stream(cookies)
                    .filter(cookie -> "sessionId".equals(cookie.getName()))
                    .map(Cookie::getValue)
                    .findFirst();
        }
        return Optional.empty();
    }

    public static boolean hasRole(String role, HttpServletRequest request, SessionRepository sessionRepository){
        Optional<User> optional = getUser(request, sessionRepository);

        if(optional.isPresent()){
            setup(request, optional);
        }

        return optional.map(user -> user.getRole().equals(role)).orElse(false);
    }

    public static boolean isAuthenticated(HttpServletRequest request, SessionRepository sessionRepository) {
        Optional<String> optional = getSessionIdFromCookie(request);
        if(optional.isEmpty()) return false;
        Optional<User> user = sessionRepository.findUserByToken(optional.get());
        if(user.isEmpty()) return false;
        setup(request, user);
        return true;
    }

    public static void setup(HttpServletRequest request, Optional<User> user){
        request.setAttribute("isAuth", true);
        request.setAttribute("user", user.get());
        request.setAttribute("admin", user.get().getRole().equals("Администратор"));
        request.setAttribute("youtuber", user.get().getRole().equals("Ютубер") || user.get().getRole().equals("Администратор"));

    }

    public static Optional<User> getUser(HttpServletRequest request, SessionRepository sessionRepository){
        Optional<String> sessionid = SessionUtils.getSessionIdFromCookie(request);
        if(sessionid.isEmpty()) return Optional.empty();
        return sessionRepository.findUserByToken(sessionid.get());
    }

    public static void saveSession(User user, HttpServletResponse response, SessionRepository sessionRepository) {
        String session = UUID.randomUUID().toString();
        Cookie cookie = new Cookie("sessionId", session);
        cookie.setMaxAge(7 * 24 * 60 * 60); // Время жизни cookie: 7 дней
        cookie.setPath("/");
        response.addCookie(cookie);
        sessionRepository.save(new Session(user.getId(), session));
    }
}
