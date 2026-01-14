pipeline {
    agent any

    parameters {
        choice(
            name: 'ENV',
            choices: ['dev'],
            description: 'Target environment (DEV only for now)'
        )
    }
    
    environment {
        KUSTOMIZE_DIR = "apps/overlays/${param.ENV}"
    }
    
    stages {
        stage('Checkout Verification') {
            steps {
                echo "Deploying to environment: ${param.ENV}"
                sh 'git --version'
            }
        }
    
        stage('Kustomize Build (Dry Run)') {
            steps {
                sh '''
                    echo "Rendering manifests from ${KUSTOMIZE_DIR}"
                    Kustomize build ${KUSTOMIZE_DIR} > /tmp/rendered.yaml
                    echo "Rendered manifest size:"
                    wc -l /tmp/rendered.yaml
                '''    
            }
        }

        stage('kubectl Dry Run Apply') {
            steps {
                sh '''
                    kubectl apply \
                    --dry-run=client \
                    -k ${KUSTOMIZE_DIR}
                '''
            }
        }

        post {
            success {
                echo "Phase 3 DEV validation successful"
            }
            failure {
                echo "Phase 3 failed - no changes applied to cluster"
            }
        }

    }
}