pipeline {
    agent any

    parameters {
        choice(
            name: 'BROWSER',
            choices: ['chrome', 'firefox', 'electron'],
            description: 'Браузер для запуска тестов'
        )
        choice(
            name: 'TEST_SUITE',
            choices: ['smoke', 'regression', 'all'],
            description: 'Набор тестов для запуска'
        )
        booleanParam(
            name: 'PARALLEL_PATHS',
            defaultValue: false,
            description: 'Запустить smoke и regression параллельно'
        )
    }

    environment {
        CYPRESS_RECORD_KEY = '6212e8b1-0355-4604-b1be-720f3a1d7c79'
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests - Single Suite') {
            when {
                allOf {
                    expression { return !params.PARALLEL_PATHS }
                    expression { return params.TEST_SUITE != 'all' }
                }
            }
            steps {
                script {
                    sh "npm run cy:${params.TEST_SUITE}:${params.BROWSER}"
                }
            }
        }

        stage('Run Tests - All') {
            when {
                allOf {
                    expression { return !params.PARALLEL_PATHS }
                    expression { return params.TEST_SUITE == 'all' }
                }
            }
            steps {
                script {
                    sh "npm run cy:run:${params.BROWSER}"
                }
            }
        }

        stage('Run Tests - Parallel Paths') {
            when {
                expression { return params.PARALLEL_PATHS }
            }
            parallel {
                stage('Smoke') {
                    steps {
                        sh 'npm run cy:smoke:chrome'
                    }
                }
                stage('Regression') {
                    steps {
                        sh 'npm run cy:regression:firefox'
                    }
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: '**/cypress/screenshots/**/*.png', allowEmptyArchive: true
            archiveArtifacts artifacts: '**/cypress/videos/**/*.mp4', allowEmptyArchive: true
        }
        failure {
            echo 'Tests failed!'
        }
        success {
            echo 'All tests passed!'
        }
    }
}
