pipeline {
  agent any

  environment {
    KUBECONFIG = "/var/lib/jenkins/.kube/config"
  }

  parameters {
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
            kubectl apply \
              --dry-run=client \
              --validation=false \
              -k ${kustomizeDir}
          """
        }
      }
    }

  stage('Deploy to DEV') {
    when {
      expression { params.ENV == 'dev'}
    }
    steps {
      script {
        String kustomizeDir = "apps/hellosaanvika/overlays/dev"
        sh """
          kubectl apply -k ${kustomizeDir}
        """
      }
    }
  }

  stage('Approve PROD Deployment') {
    when {
      allof {
        expression { params.ENV == 'prod'}
        branch 'main'
      }
    }
    steps{
      input message: 'Approve deployment to PROD?', ok: 'Deploy'        
      }
    }
  
  stage('Deploy to PROD') {
    when {
      allof {
        expression { params.ENV == 'prod' }
        branch 'main'
      }
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
