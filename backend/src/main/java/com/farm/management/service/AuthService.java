package com.farm.management.service;

import com.farm.management.dto.AuthDtos;
import com.farm.management.model.Farm;
import com.farm.management.model.User;
import com.farm.management.repository.UserRepository;
import com.farm.management.util.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsServiceImpl userDetailsService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, AuthenticationManager authenticationManager, UserDetailsServiceImpl userDetailsService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
    }

    @Transactional
    public String registerUser(AuthDtos.RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username is already taken");
        }

        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));

        Farm newFarm = new Farm();
        newFarm.setAcres(request.getFarmDetails().getAcres());
        newFarm.setSoilType(request.getFarmDetails().getSoilType());
        newFarm.setSoilQuality(request.getFarmDetails().getSoilQuality());
        newFarm.setLocation(request.getFarmDetails().getLocation());
        
        if (request.getFarmDetails().getCrops() != null) {
            newFarm.getCrops().addAll(
                request.getFarmDetails().getCrops().stream().map(dto -> {
                    com.farm.management.model.FarmCrop fc = new com.farm.management.model.FarmCrop();
                    fc.setCropName(dto.getCropName());
                    fc.setAcresAllocated(dto.getAcresAllocated());
                    fc.setExpectedYield(com.farm.management.service.FarmService.calculateCropYield(dto.getCropName(), dto.getAcresAllocated(), newFarm.getSoilQuality()));
                    return fc;
                }).toList()
            );
        }
        newFarm.setUser(newUser);

        newUser.setFarm(newFarm);
        userRepository.save(newUser);

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        return jwtUtil.generateToken(userDetails);
    }

    public String loginUser(AuthDtos.LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        return jwtUtil.generateToken(userDetails);
    }
}
