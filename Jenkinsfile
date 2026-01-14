pipeline {
  agent any

  parameters {
    choice(
      name: 'ENV',
      choices: ['dev'],
      description: 'Target environment (DEV only for now)'
    )
  }

  stages {

    stage('Checkout Verification') {
      steps {
        echo "Deploying to environment: ${params.ENV}"
        sh 'git --version'
      }
    }

    stage('Debug Workspace Structure') {
        steps {
            sh '''
                echo "Current directory:"
                pwd
                echo "Listing workspace root:"
                ls -la
                echo "Recursive apps listing (if exists):"
                ls -R apps || echo "apps directory not found"
            '''
        }
    }
    
    stage('Kubernetes Client Check') {
      steps {
        sh '''
          kubectl version --client
        '''
      }
    }

    stage('Kustomize Build (Dry Run)') {
      steps {
        script {
          String kustomizeDir = "apps/overlays/${params.ENV}"
          sh """
            echo "Rendering manifests from ${kustomizeDir}"
            kubectl kustomize ${kustomizeDir} > /tmp/rendered.yaml
            echo "Rendered manifest size:"
            wc -l /tmp/rendered.yaml
          """
        }
      }
    }

    stage('Kubectl Dry Run Apply') {
      steps {
        script {
          String kustomizeDir = "apps/overlays/${params.ENV}"
          sh """
            kubectl apply --dry-run=client -k ${kustomizeDir}
          """
        }
      }
    }
  }

  post {
    success {
      echo "Phase 3 DEV validation successful"
    }
    failure {
      echo "Phase 3 failed – no changes applied to cluster"
    }
  }
}
