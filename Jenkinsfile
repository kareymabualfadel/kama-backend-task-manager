pipeline {
  agent any

  environment {
    REPO_URL = 'https://github.com/kareymabualfadel/kama-backend-task-manager.git'
    BRANCH   = 'main'
    IMAGE    = 'kama-web-tasks'
    PROD_IP  = '192.168.28.121'
  }

  triggers {
    pollSCM('* * * * *')   // every minute for lab visibility
  }

  stages {
    stage('Checkout') {
      steps {
        deleteDir()
        checkout scm
        sh 'ls -la'
      }
    }

    stage('Build Docker image') {
      steps {
        sh '''
          docker build -t ${IMAGE}:jenkins-${BUILD_NUMBER} -f ./Dockerfile .
          docker images | head -n 10
        '''
      }
    }

    stage('Deploy to Production (ship image)') {
      steps {
        sh '''
          set -e
          docker tag ${IMAGE}:jenkins-${BUILD_NUMBER} ${IMAGE}:release
          docker save ${IMAGE}:release -o /tmp/${IMAGE}-release.tar

          scp -o StrictHostKeyChecking=no /tmp/${IMAGE}-release.tar deploy@${PROD_IP}:/tmp/${IMAGE}-release.tar

          ssh -o StrictHostKeyChecking=no deploy@${PROD_IP} "
            docker load -i /tmp/${IMAGE}-release.tar &&
            cd /opt/kama &&
            docker compose up -d --force-recreate &&
            docker ps
          "
        '''
      }
    }
  }
}
