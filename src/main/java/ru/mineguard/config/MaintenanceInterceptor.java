package ru.mineguard.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
import ru.mineguard.session.SessionUtils;
import ru.mineguard.session.model.repo.SessionRepository;

import static ru.mineguard.DemoApplication.adminSettings;


@Component
public class MaintenanceInterceptor implements HandlerInterceptor {

    private boolean maintenanceMode = false;

    @Autowired
    public SessionRepository sessionRepository;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if(SessionUtils.hasRole("Администратор", request, sessionRepository)){
            return true;
        }

        if(request.getRequestURI().endsWith(".css") || request.getRequestURI().endsWith("/texworks") || request.getRequestURI().endsWith(".ico") || request.getRequestURI().endsWith(".png")) return true;

        if (adminSettings.getTexWorks() == 2) {
            response.sendRedirect("/texworks");
            return true;
        }

        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
    }
}
