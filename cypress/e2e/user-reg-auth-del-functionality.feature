Feature: This feature was created for testing user registration, authentication and deleting functionality

  Scenario: Register new user
    Given Send request with new user data
    Then Check status code: 201 and authentication token

  Scenario: Login to the application by username as email
    Given Send request to login
    Then Check status code: 200 and authentication token

  Scenario: Register new user with existing email address
    Given Send request with existing email address
    Then Check status code: 400

  Scenario: Register new user with existing phone number
    Given Send request with existing phone number
    Then Check status code: 400

  Scenario: Remove user from application
    Given Send request to deleting user
    Then Check status code: 204

  Scenario: Login to the application with deleted user
    Given Send request to login
    Then Check status code: 401

  Scenario Outline: Register new user with invalid <example> email address
    Given Send request to register new user with invalid '<example>' email address
    Then Check status code: 400

    Examples:
      | example                    |
      | plainaddress               |
      | @missingusername.com       |
      | missingat.com              |
      | missingdomain@.com         |
      | @.com                      |
      | username@.com              |
      | user@domain..com           |
      | user@domain,com            |
      | user@domain#com            |
      | user@domain space.com      |
      | user@domain@com.com        |
      | user@domain@com..com       |
      | user@domain,com            |
      | user@domain_underscore.com |
      | user@domain.com.           |
      | us!er@domain.com           |
      | us$er@domain.com           |
      | us@er@domain.com           |
      | user@domain..com           |
      | user@domain_com            |

  Scenario Outline: Register new user without <example> required field
    Given Send request to register new user without '<example>' field
    Then Check status code: 400

    Examples:
      | example                        |
      | email                          |
      | password                       |
      | phone_number                   |
      | phone_code                     |
      | first_name                     |
      | last_name                      |
      | birthday                       |
      | gender                         |
      | signature                      |
      | terms_and_conditions_agreement |
      | privacy_agreement              |

  Scenario Outline: Register new user with invalid phone <example> number
    Given Send request to register new user with invalid phone <example> number
    Then Check status code: 400

    Examples:
      | example   |
      | 689898    |
      | 689898989 |

  Scenario Outline: Register new user with incorrect value at gender parameter: <example>
    Given Send request to register new user with incorrect value at gender parameter: '<example>'
    Then Check status code: 400

    Examples:
      | example  |
#TODO       | unisex   |
      | 1        |
      | 0        |
      | true     |
      | false    |
      | !@#$%^&* |

  Scenario Outline: Register new user with invalid password value: <example>
    Given Register new user with invalid password value '<example>'
    Then Check status code: 400

    Examples:
      | example |
#TODO       | password123! |
#TODO       | PASSWORD123! |
#TODO       | Password!    |
#TODO       | Password123  |
#TODO       | 111aa@!$#    |
#TODO       | 11aaa@#$%    |
      | aB1!    |

  Scenario Outline: Register new user with incorrect format at signature: <example>
    Given Send request to register new user with incorrect format at signature: '<example>'
    Then Check status code: 400

    Examples:
#TODO      | incorrect-url |
      | example     |
      | string-text |
      | true        |
      | false       |

  Scenario: Register new user with not accepted terms and conditions
    Given Send request to register new user with not accepted terms and conditions: 'false'
    Then Check status code: 400

  Scenario: Register new user with not accepted privacy policy
    Given Send request to register new user with not privacy policy: 'false'
    Then Check status code: 400