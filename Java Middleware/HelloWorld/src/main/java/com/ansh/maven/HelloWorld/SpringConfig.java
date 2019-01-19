package com.ansh.maven.HelloWorld;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.core.env.Environment;

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
	
	@Bean(name = "demo")
	public JdbcTemplate demoJdbcTemplate() {
		DriverManagerDataSource ds = new DriverManagerDataSource("jdbc:mysql://gideondb.cebb7aomhqwq.us-east-1.rds.amazonaws.com:3306/gideondb", "masteruser", "gideonFrisco!");
		return new JdbcTemplate(ds);
	}
	
	public static JdbcTemplate getGideonJdbcTemplate() {
		return new SpringConfig().gideonJdbcTemplate();
	}
	
	public static JdbcTemplate getDemoJdbcTemplate() {
		return new SpringConfig().demoJdbcTemplate();
	}
	
	
}
