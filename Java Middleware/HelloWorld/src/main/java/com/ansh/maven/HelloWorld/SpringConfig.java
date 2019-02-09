package com.ansh.maven.HelloWorld;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@PropertySource("application.properties")
public class SpringConfig {
	
	@Autowired
	Environment env;
	
	@Bean(name = "gideon")
	public JdbcTemplate gideonJdbcTemplate() {
		DriverManagerDataSource ds = new DriverManagerDataSource(env.getProperty("DB_URL"), env.getProperty("USER"), env.getProperty("PASS"));
		return new JdbcTemplate(ds);
	}
	
	@Bean
	public PasswordEncoder passwordEncoder() {
	    return new BCryptPasswordEncoder();
	}
	
}
