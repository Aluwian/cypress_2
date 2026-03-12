pipeline {
    agent any
    parameters {
        choice(name: 'BROWSER', choices: ['chrome', 'firefox', 'electron'], description: 'Браузер')
        choice(name: 'TEST_SUITE', choices: ['admin', 'main', 'booking', 'booking-from-admin', 'parallel', 'all'], description: 'Тесты')
    }
    stages {
        stage('Install') {
            steps {
                sh 'npm install'
            }
        }
        stage('Run Tests') {
            steps {
                script {
                    if (params.TEST_SUITE == 'parallel') {
                        parallel(
                            'Admin': { sh "npx cypress run --spec 'cypress/e2e/smoke/admin.cy.js' --browser ${params.BROWSER} --record --key 6212e8b1-0355-4604-b1be-720f3a1d7c79" },
                            'Main': { sh "npx cypress run --spec 'cypress/e2e/smoke/main.cy.js' --browser ${params.BROWSER} --record --key 6212e8b1-0355-4604-b1be-720f3a1d7c79" },
                            'Booking': { sh "npx cypress run --spec 'cypress/e2e/regression/booking.cy.js' --browser ${params.BROWSER} --record --key 6212e8b1-0355-4604-b1be-720f3a1d7c79" },
                            'BookingFromAdmin': { sh "npx cypress run --spec 'cypress/e2e/regression/booking-from-admin.cy.js' --browser ${params.BROWSER} --record --key 6212e8b1-0355-4604-b1be-720f3a1d7c79" }
                        )
                    } else if (params.TEST_SUITE == 'all') {
                        sh "npm run cy:run:${params.BROWSER} -- --record --key 6212e8b1-0355-4604-b1be-720f3a1d7c79"
                    } else {
                        sh "npm run cy:${params.TEST_SUITE} -- --browser ${params.BROWSER} --record --key 6212e8b1-0355-4604-b1be-720f3a1d7c79"
                    }
                }
            }
        }
    }
}
