import {Given, Then, When} from "@badeball/cypress-cucumber-preprocessor";

export let responseReg: any = {}
export let userEmail: string = `testmail${Math.floor(Math.random() * 1000)}@gmail.com`
export let accessToken: string = ""
export let phoneNumber: string = `6${Math.floor(Math.random() * 10000000)}`

Given("Send request with new user data", () => {
    cy.fixture('../e2e/user-reg-auth-del-functionality/simple_user.json').then((json: any) => {
        cy.request({
            method: 'POST',
            url: `${Cypress.env("apiUrl")}/users/register/`,
            headers: {
                'app-platform': 'Android'
            },
            body: {
                ...json,
                email: userEmail,
                phone_number: phoneNumber
            }
        }).then((response: any) => {
            responseReg = response;
            accessToken = response.body.access;
        })
    })
})

Given("Send request to login", () => {
    cy.request({
        method: 'POST',
        url: `${Cypress.env("apiUrl")}/users/login/email/`,
        headers: {
            'app-platform': 'Android'
        },
        body: {
            username: userEmail,
            password: "Test100417!"
        },
        failOnStatusCode: false
    }).then((response: any) => {
        responseReg = response;
        accessToken = response.body.access;
    })
})

Given("Send request with existing email address", () => {
    cy.fixture('../e2e/user-reg-auth-del-functionality/simple_user.json').then((json: any) => {
        cy.request({
            method: 'POST',
            url: `${Cypress.env("apiUrl")}/users/register/`,
            headers: {
                'app-platform': 'Android'
            },
            body: {
                ...json,
                email: userEmail,
                phone_number: `6${Math.floor(Math.random() * 10000000)}`
            },
            failOnStatusCode: false
        }).then((response: any) => {
            responseReg = response;
        })
    })
})

Given("Send request with existing phone number", () => {
    cy.fixture('../e2e/user-reg-auth-del-functionality/simple_user.json').then((json: any) => {
        cy.request({
            method: 'POST',
            url: `${Cypress.env("apiUrl")}/users/register/`,
            headers: {
                'app-platform': 'Android'
            },
            body: {
                ...json,
                email: `testmail${Math.floor(Math.random() * 1000)}@gmail.com`,
                phone_number: phoneNumber
            },
            failOnStatusCode: false
        }).then((response: any) => {
            responseReg = response;
        })
    })
})

Given("Send request to register new user with invalid {string} email address", (email: string) => {
    cy.fixture('../e2e/user-reg-auth-del-functionality/simple_user.json').then((json: any) => {
        cy.request({
            method: 'POST',
            url: `${Cypress.env("apiUrl")}/users/register/`,
            headers: {
                'app-platform': 'Android'
            },
            body: {
                ...json,
                email: email,
                phone_number: phoneNumber
            },
            failOnStatusCode: false
        }).then((response: any) => {
            responseReg = response;
            accessToken = response.body.access;
        })
    })
})

Given("Send request to register new user with invalid phone {int} number", (phone: number) => {
    cy.fixture('../e2e/user-reg-auth-del-functionality/simple_user.json').then((json: any) => {
        cy.request({
            method: 'POST',
            url: `${Cypress.env("apiUrl")}/users/register/`,
            headers: {
                'app-platform': 'Android'
            },
            body: {
                ...json,
                email: userEmail,
                phone_number: phone
            },
            failOnStatusCode: false
        }).then((response: any) => {
            responseReg = response;
            accessToken = response.body.access;
        })
    })
})

Given("Send request to register new user with not accepted terms and conditions: {string}", (isConfirmed: string) => {
    cy.fixture('../e2e/user-reg-auth-del-functionality/simple_user.json').then((json: any) => {
        cy.request({
            method: 'POST',
            url: `${Cypress.env("apiUrl")}/users/register/`,
            headers: {
                'app-platform': 'Android'
            },
            body: {
                ...json,
                email: userEmail,
                phone_number: phoneNumber,
                terms_and_conditions_agreement: isConfirmed
            },
            failOnStatusCode: false
        }).then((response: any) => {
            responseReg = response;
            accessToken = response.body.access;
        })
    })
})

Given("Send request to register new user with not privacy policy: {string}", (isConfirmed: string) => {
    cy.fixture('../e2e/user-reg-auth-del-functionality/simple_user.json').then((json: any) => {
        cy.request({
            method: 'POST',
            url: `${Cypress.env("apiUrl")}/users/register/`,
            headers: {
                'app-platform': 'Android'
            },
            body: {
                ...json,
                email: userEmail,
                phone_number: phoneNumber,
                privacy_agreement: isConfirmed
            },
            failOnStatusCode: false
        }).then((response: any) => {
            responseReg = response;
            accessToken = response.body.access;
        })
    })
})

Given("Send request to register new user with incorrect value at gender parameter: {string}", (value: string) => {
    cy.fixture('../e2e/user-reg-auth-del-functionality/simple_user.json').then((json: any) => {
        cy.request({
            method: 'POST',
            url: `${Cypress.env("apiUrl")}/users/register/`,
            headers: {
                'app-platform': 'Android'
            },
            body: {
                ...json,
                email: userEmail,
                phone_number: phoneNumber,
                gender: value
            },
            failOnStatusCode: false
        }).then((response: any) => {
            responseReg = response;
            accessToken = response.body.access;
            return accessToken
        }).then((accessToken) => {
            cy.request({
                method: 'DELETE',
                url: `${Cypress.env("apiUrl")}/profile/`,
                headers: {
                    'app-platform': 'Android',
                    Authorization: `Bearer ${accessToken}`
                },
                failOnStatusCode: false
            }).then(() => {
            })
        })
    })
})

Given("Register new user with invalid password value {string}", (password: string) => {
    cy.fixture('../e2e/user-reg-auth-del-functionality/simple_user.json').then((json: any) => {
        cy.request({
            method: 'POST',
            url: `${Cypress.env("apiUrl")}/users/register/`,
            headers: {
                'app-platform': 'Android'
            },
            body: {
                ...json,
                email: userEmail,
                phone_number: phoneNumber,
                password: password
            },
            failOnStatusCode: false
        }).then((response: any) => {
            responseReg = response;
            accessToken = response.body.access;
        })
    })
})

Given("Send request to register new user with incorrect format at signature: {string}", (value: string) => {
    cy.fixture('../e2e/user-reg-auth-del-functionality/simple_user.json').then((json: any) => {
        cy.request({
            method: 'POST',
            url: `${Cypress.env("apiUrl")}/users/register/`,
            headers: {
                'app-platform': 'Android'
            },
            body: {
                ...json,
                email: userEmail,
                phone_number: phoneNumber,
                signature: value
            },
            failOnStatusCode: false
        }).then((response: any) => {
            responseReg = response;
            accessToken = response.body.access;
        })
    })
})

Given("Send request to register new user without {string} field", (emptyValue: string) => {
    cy.fixture('../e2e/user-reg-auth-del-functionality/simple_user.json').then((json: any) => {
        json["email"] = userEmail;
        json["phone_number"] = phoneNumber;
        json[emptyValue] = "";

        cy.request({
            method: 'POST',
            url: `${Cypress.env("apiUrl")}/users/register/`,
            headers: {
                'app-platform': 'Android'
            },
            body: json,
            failOnStatusCode: false
        }).then((response: any) => {
            responseReg = response;
            accessToken = response.body.access;
            return accessToken
        }).then((accessToken) => {
            cy.request({
                method: 'DELETE',
                url: `${Cypress.env("apiUrl")}/profile/`,
                headers: {
                    'app-platform': 'Android',
                    Authorization: `Bearer ${accessToken}`
                },
                failOnStatusCode: false
            }).then(() => {
            })
        })
    })
})

Then("Check status code: {int} and authentication token", (statusCode: number) => {
    expect(responseReg.status).eq(statusCode)
    expect(responseReg.body.access).not.be.empty
})

Given("Send request to deleting user", () => {
    cy.request({
        method: 'DELETE',
        url: `${Cypress.env("apiUrl")}/profile/`,
        headers: {
            'app-platform': 'Android',
            Authorization: `Bearer ${accessToken}`
        }
    }).then((response: any) => {
        responseReg = response;
    })
})

Then("Check status code: {int}", (statusCode: number) => {
    expect(responseReg.status).eq(statusCode)
})