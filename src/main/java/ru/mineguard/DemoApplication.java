package ru.mineguard;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Component;

import ru.mineguard.model.repo.UserRepository;
import ru.mineguard.utils.AdminSettings;



@Component
@SpringBootApplication
public class DemoApplication implements CommandLineRunner {

	public static AdminSettings adminSettings = new AdminSettings();

	@Autowired
	public UserRepository userRepository;

	public static void main(String[] args) {
		String externalConfigPath = "file:./external-config.properties";
		System.setProperty("spring.config.location", externalConfigPath);
		SpringApplication.run(DemoApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {



	}
}
