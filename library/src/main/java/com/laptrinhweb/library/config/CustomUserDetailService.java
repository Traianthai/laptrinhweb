package com.laptrinhweb.library.config;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.laptrinhweb.library.model.User;
import com.laptrinhweb.library.repository.UserRepository;



public class CustomUserDetailService implements UserDetailsService {
    @Autowired
    private UserRepository customUserRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = customUserRepository.findUserByUsername(username);
        if(user == null){
            throw new UsernameNotFoundException("ERROR");
        }
        return new CustomUserDetail(user);
    }

}
