package com.alineramos.companysuppliermanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class CompanySupplierManagerApplication {

	public static void main(String[] args) {
		SpringApplication.run(CompanySupplierManagerApplication.class, args);
	}

}
