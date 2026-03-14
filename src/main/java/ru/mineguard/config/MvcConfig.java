package ru.mineguard.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@EnableWebMvc
@Configuration
public class MvcConfig implements WebMvcConfigurer {

    private static final String[] CLASSPATH_RESOURCE_LOCATIONS = {
            "classpath:/static/",
            "classpath:/templates/"
    };

    @Autowired
    private MaintenanceInterceptor maintenanceInterceptor;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        if (!registry.hasMappingForPattern("/**")) {
            registry.addResourceHandler("/**").addResourceLocations(CLASSPATH_RESOURCE_LOCATIONS);
        }
        registry.addResourceHandler("/avatars/**")
                .addResourceLocations("file:avatars/");
    }

    @Override
    public void configurePathMatch(PathMatchConfigurer configurer) {
        WebMvcConfigurer.super.configurePathMatch(configurer);
        configurer.setUseSuffixPatternMatch(false);
    }
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(maintenanceInterceptor);
    }
}
