//package com.backend.boardMate;
//
//import org.junit.jupiter.api.Test;
//import org.springframework.boot.test.context.SpringBootTest;
//
//@SpringBootTest
//class BoardMateApplicationTests {
//
//	@Test
//	void contextLoads() {
//	}
//
//}

package com.backend.boardMate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.backend.boardMate.repository")
class BoardMateApplication {

	public static void main(String[] args) {
		SpringApplication.run(BoardMateApplication.class, args);
	}
}
