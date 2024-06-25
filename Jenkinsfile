pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = "enestars"
        DOCKERHUB_PASSWORD = "nguyen123"
        IMAGE_NAME = "nguyendeptrai"
        IMAGE_TAG = "v1.0"
        DOCKERHUB_REPO = "${DOCKERHUB_USERNAME}/${IMAGE_NAME}"
        DOCKERHUB_TAG = "${DOCKERHUB_REPO}:${IMAGE_TAG}"
    }

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


        stage('Build Docker Image') {
            steps {
                script {
                    try {
                        echo "Building Docker image..."
                        bat 'cd /d C:\\ProgramData\\Jenkins\\.jenkins\\workspace\\demo-pipeline'
                        bat "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                        
                    } catch (Exception e) {
                        echo "Failed to build Docker image: ${e.message}"
                        currentBuild.result = 'FAILURE'
                        error "Stopping pipeline because the Docker image build failed."
                    }
                }
            }
        }

        stage('Push Docker Image to Docker Hub') {
            steps {
                script {
                    try {
                        // Login to Docker Hub
                        bat "docker login -u ${DOCKERHUB_USERNAME} -p ${DOCKERHUB_PASSWORD}"
                        
                        // Tag the local image with Docker Hub repository
                        bat "docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${DOCKERHUB_TAG}"
                        
                        // Push the image to Docker Hub
                        bat "docker push ${DOCKERHUB_TAG}"
                        
                        // Remove the local image after pushing to Docker Hub
                        bat "docker rmi ${IMAGE_NAME}:${IMAGE_TAG}"
                        
                        echo "Docker image ${DOCKERHUB_TAG} pushed to Docker Hub and removed locally."
                    } catch (Exception e) {
                        echo "Failed to push Docker image to Docker Hub: ${e.message}"
                        currentBuild.result = 'FAILURE'
                        error "Stopping pipeline because the Docker image push failed."
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
