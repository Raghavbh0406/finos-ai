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

private String resetToken;

private String securityQuestion;

@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
private String securityAnswer;

@OneToMany(mappedBy = "user")
@JsonIgnore
private List<Expense> expenses;

public User() {}

public Long getId() { return id; }
public String getName() { return name; }
public String getEmail() { return email; }
public String getPassword() { return password; }
public String getResetToken() { return resetToken; }
public String getSecurityQuestion() { return securityQuestion; }
public String getSecurityAnswer() { return securityAnswer; }
public List<Expense> getExpenses() { return expenses; }

public void setId(Long id) { this.id = id; }
public void setName(String name) { this.name = name; }
public void setEmail(String email) { this.email = email; }
public void setPassword(String password) { this.password = password; }
public void setResetToken(String resetToken) { this.resetToken = resetToken; }
public void setSecurityQuestion(String securityQuestion) { this.securityQuestion = securityQuestion; }
public void setSecurityAnswer(String securityAnswer) { this.securityAnswer = securityAnswer; }
public void setExpenses(List<Expense> expenses) { this.expenses = expenses; }
}