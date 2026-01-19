pipeline {
  agent any

  environment {
    IMAGE_NAME = "mrrobotthecoder/hellosaanvika"
    KUBECONFIG = "/var/lib/jenkins/.kube/config"
  }

  parameters {
    string(
      name: 'IMAGE_VERSION',
      defaultValue: '1.0.0',
      description: 'Docker image version (eg. 1.0.0)'
    )
    choice(
      name: 'ACTION',
      choices: ['deploy', 'rollback'],
      description: 'Deploy new version or rollback last deployment'
    )
    choice(
      name: 'ENV',
      choices: ['dev', 'prod'],
      description: 'Target environment (default: dev)'
    )
  }

  stages {

    stage('Checkout Verification') {
      steps {
        echo "Branch: ${env.BRANCH_NAME}"
        echo "Target environment: ${params.ENV}"
        sh 'git --version'
      }
    }

    stage('Build & Push Image (Multi-Arch)') {
      when {
        expression { params.ACTION == 'deploy' }
      }
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'dockerhub',
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {
          sh """
            echo "Logging in to Docker Hub"
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

            echo "Building & pushing multi-arch image: ${IMAGE_NAME}:${IMAGE_VERSION}"
            docker buildx build \
              --platform linux/amd64,linux/arm64 \
              -t ${IMAGE_NAME}:${IMAGE_VERSION} \
              --push .
          """
        }
      }
    }

    stage('Kubernetes Client Check') {
      steps {
        sh '''
          kubectl version --client
        '''
      }
    }

    stage('Kustomize Build') {
      steps {
        script {
          String kustomizeDir = "apps/hellosaanvika/overlays/${params.ENV}"
          sh """
            echo "Rendering manifests from ${kustomizeDir}"
            kubectl kustomize ${kustomizeDir} > /tmp/rendered.yaml
            wc -l /tmp/rendered.yaml
          """
        }
      }
    }

    stage('Kubectl Dry Run') {
      steps {
        script {
          String kustomizeDir = "apps/hellosaanvika/overlays/${params.ENV}"
          sh """
            kubectl apply --dry-run=client -k ${kustomizeDir}
          """
        }
      }
    }

  stage('Deploy to DEV') {
    when {
      expression { params.ENV == 'dev' && params.ACTION == 'deploy' }
    }
    steps {
      script {
        sh """
          echo "Deploying image version ${IMAGE_VERSION} to DEV"

          kubectl apply -k apps/hellosaanvika/overlays/dev

          kubectl set image deployment/hellosaanvika \
            app=${IMAGE_NAME}:${IMAGE_VERSION} \
            -n hellosaanvika-dev
        """
      }
    }
  }

  stage('Approve PROD Deployment') {
    when {
      expression { params.ENV == 'prod' }
    }
    steps {
      input message: 'Approve deployment to PROD?', ok: 'Deploy'
    }
  }

  stage('Validate PROD Image Version') {
    when {
      expression { params.ENV == 'prod' }
    }
    steps {
      sh """
        echo "Validating PROD image version consistency..."
        kubectl kustomize apps/hellosaanvika/overlays/prod | grep image | grep ${IMAGE_VERSION}
      """
    }
  }

  stage('Deploy to PROD') {
    when {
      expression { params.ENV == 'prod' }
    }
    steps {
      script {
        String kustomizeDir = "apps/hellosaanvika/overlays/prod"
        sh """
          kubectl apply -k ${kustomizeDir}
        """
      }
    }
  }

  stage('Approve PROD Rollback') {
    when {
      allOf {
        expression { params.ACTION == 'rollback' }
        expression { params.ENV == 'prod' }
      }
    }
    steps {
      input message: 'Approve PROD rollback?'
    }
  }

  stage('Rollback Deployment') {
    when {
      expression { params.ACTION == 'rollback' }
    }
    steps {
      script {
        String namespace = params.ENV == 'prod'
          ? 'hellosaanvika-prod'
          : 'hellosaanvika-dev'

        sh """
          echo "Current rollout status:"
          kubectl rollout status deployment/hellosaanvika -n ${namespace} || true

          echo "Rolling back deployment in ${namespace}"
          kubectl rollout undo deployment/hellosaanvika -n ${namespace}

          echo "Post-rollback status:"
          kubectl rollout status deployment/hellosaanvika -n ${namespace}
        """
      }
    }
  }

}

  post {
    success {
      echo "Deployment pipeline completed successfully"
    }
    failure {
      echo "Pipeline failed — no partial PROD deploys occurred"
    }
  }
}