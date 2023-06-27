package com.laptrinhweb.library.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int userId;
    private String firstName;
    private String lastName;
    private String address;
    private LocalDate date;
    private String phone;
    private String email;
    private String username;
    private String password;
    private String roles;

    public void setDate(String date) {
        if(date != null){
            this.date = LocalDate.parse(date);
        }
    }
}
