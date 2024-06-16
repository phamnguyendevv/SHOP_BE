pipeline {
    agent any

    stages {
        stage('Check Docker') {
            steps {
                script {
                    try {
                        bat 'docker --version'
                        bat 'docker info'
                    } catch (Exception e) {
                        echo "Docker is not installed or not running: ${e.message}"
                        currentBuild.result = 'FAILURE'
                        error "Stopping pipeline because Docker is not available."
                    }
                }
            }
        }

        stage('Clone') {
            steps {
                script {
                    try {
                        git branch: 'main', credentialsId: 'github-credentials', url: 'https://github.com/Enestar-28/SHOP_BE.git'
                    } catch (Exception e) {
                        echo "Failed to clone repository: ${e.message}"
                        currentBuild.result = 'FAILURE'
                        error "Stopping pipeline because the repository could not be cloned."
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    try {
                        def imageName = "myapp"
                        def imageTag = "v1.0"
                        echo "Building Docker image..."
                        // Change directory to where the Dockerfile is located
                        bat 'cd /d C:\\ProgramData\\Jenkins\\.jenkins\\workspace\\demo-pipeline'
                        bat "docker build -t ${imageName}:${imageTag} ."
                    } catch (Exception e) {
                        echo "Failed to build Docker image: ${e.message}"
                        currentBuild.result = 'FAILURE'
                        error "Stopping pipeline because the Docker image build failed."
                    }
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline completed with result: ${currentBuild.result}"
        }
    }
}
