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

  stage('Validate PROD Image Immutability') {
    when {
      expression { params.ENV == 'prod' && params.ACTION == 'deploy' }
    }
    steps {
      sh '''
        echo " Validating PROD image immutability.. Git is the source of truth!! "

        PROD_TAG=$(grep "newTag:" apps/hellosaanvika/overlays/prod/kustomization.yaml | awk '{print $2}')

        echo "Git-defined PROD image version: $PROD_TAG"
        echo "Jenkins requested image version: ${IMAGE_VERSION}"

        if [ "$PROD_TAG" != "${IMAGE_VERSION}" ]; then
          echo "❌ IMMUTABILITY VIOLATION!! ❌"
          echo "PROD image must be changed via Git only."
          echo "Update overlays/prod/kustomization.yaml and retry."
          exit 1
        fi

        echo "✅ PROD image version is immutable and verified! ✅"
      '''
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

  stage('Verify PROD Rollout') {
    when {
      expression { params.ENV == 'prod' && params.ACTION == 'deploy' }
    }
    steps {
      sh """
        echo "Waiting for PROD rollout to complete.."
        kubectl rollout status deployment/hellosaanvika \
          -n hellosaanvika-prod \
          --timeout=180s
        """
    }
  }

  stage('Auto Rollback PROD on Failure') {
    when {
      allOf {
        expression { params.ENV == 'prod' }
        expression { currentBuild.currentResult == 'FAILURE' }
      }
    }
    steps {
      sh """
        echo "PROD deployment failed. Rolling back automatically..."
        kubectl rollout undo deployment/hellosaanvika \
          -n hellosaanvika-prod

        echo "Rollback status:"
        kubectl rollout status deployment/hellosaanvika \
          -n hellosaanvika-prod
        """
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