package com.example.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 보안 관련 코드
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // 여기에 작성된 엔드 포인트의 접근만 허용한다
                        // authenticated(인증된 사용자만 접근 가능), hasRole(특정 역할을 가진 사용자만 접근 가능)
//                        api get 요청(간단한 체크)
                        .requestMatchers("/ajs/**").permitAll()

//                        api post 요청(백터db 관련)
                        .requestMatchers( "/api/vectorSearch/**", "/api/pinecone/**").permitAll()

//                        로그인
                        .requestMatchers("/api/auth/**").permitAll()

//                        api post 요청(LLM 관련)
                        .requestMatchers("/api/llm/**").permitAll()

//                        grafana, prometheus
                        .requestMatchers("/actuator/**").permitAll()

//                        api post 요청(테스트 관련)
                        .requestMatchers("/mongoTest/**").permitAll()
                        .anyRequest().authenticated()
                )
                .httpBasic(withDefaults());
        return http.build();
    }
}