package com.daw9;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class Daw9Application {

    public static void main(String[] args) {
        SpringApplication.run(Daw9Application.class, args);
    }
}
