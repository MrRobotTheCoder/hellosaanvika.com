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
    
        stage('Kubernetes Client Check'){
            steps {
                sh '''
                    kubectl version --client
                    kustomize version
                '''
            }
        }

        stage('Kustomize Build (Dry Run)') {
            steps {
                script {
                    def kustomizeDir = "apps/overlays/${params.ENV}"                
                sh '''
                    echo "Rendering manifests from ${KUSTOMIZE_DIR}"
                    Kustomize build ${KUSTOMIZE_DIR} > /tmp/rendered.yaml
                    echo "Rendered manifest size:"
                    wc -l /tmp/rendered.yaml
                '''
                }
            }
        }

        stage('kubectl Dry Run Apply') {
            steps {
                script {
                    def kustomizeDir = "apps/overlays/${params.ENV}"
                sh '''
                    kubectl apply \
                    --dry-run=client \
                    -k ${KUSTOMIZE_DIR}
                '''
                }
            }
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
