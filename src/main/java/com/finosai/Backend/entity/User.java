package com.finosai.Backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.finosai.Backend.expense.Expense;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "users")
public class User {


@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

private String name;

private String email;

@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
private String password;

@OneToMany(mappedBy = "user")
@JsonIgnore
private List<Expense> expenses;

public User() {
}

public Long getId() {
    return id;
}

public String getName() {
    return name;
}

public String getEmail() {
    return email;
}

public String getPassword() {
    return password;
}

public List<Expense> getExpenses() {
    return expenses;
}

public void setId(Long id) {
    this.id = id;
}

public void setName(String name) {
    this.name = name;
}

public void setEmail(String email) {
    this.email = email;
}

public void setPassword(String password) {
    this.password = password;
}

public void setExpenses(List<Expense> expenses) {
    this.expenses = expenses;
}


}
