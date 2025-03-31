
![2025-02-06 (10)](https://github.com/user-attachments/assets/38d26261-e8b2-4e05-b2e7-bcbc0778fcaf)

![image](https://github.com/user-attachments/assets/f5a3c172-067f-4fbc-898c-191d7db51b0d)


Deploying the Fashionova App with GitHub Actions and DevSecOps: A Comprehensive Guide
In today's fast-paced development environment, integrating Continuous Integration and Continuous Deployment (CI/CD) practices is essential for delivering high-quality applications efficiently. This blog post will guide you through the step-by-step deployment of the Fashion App using GitHub Actions, leveraging Docker for containerization, and incorporating security checks with SonarQube and Docker Scout. Additionally, we'll cover using an EC2 instance to host the SonarQube server.


**Overview of the Tools Used**
- GitHub Actions: A CI/CD tool that automates workflows directly from your GitHub repository.
- SonarQube: A tool for continuous inspection of code quality and security vulnerabilities, hosted on an EC2 instance.
- Docker: A platform for developing, shipping, and running applications in containers.
- Docker Scout: A security tool that scans Docker images for vulnerabilities.
- Amazon EKS (Elastic Kubernetes Service): A managed Kubernetes service for deploying and managing containerized applications.
- mazon EC2: A cloud computing service that provides scalable computing capacity, used here to host the SonarQube server.

**Prerequisites**
-- Before we begin, ensure you have the following prerequisites:
- AWS Account: Sign up for an AWS account if you haven't already.
- Docker Hub Account: Needed for pushing Docker images to Docker Hub.
- GitHub Account: A repository to manage your code and CI/CD pipeline.
- AWS CLI and Terraform installed on your local system for resource provisioning.

**Step 1: Launching EC2 Instance and Installing GitHub Runner**
We start by creating an EC2 instance to act as the self-hosted runner for GitHub Actions. This instance will run the build and deploy jobs.
**1.1 Launch EC2 Instance**
-  in to your AWS Console and navigate to EC2.
- Click on Launch Instance and select an appropriate Amazon Machine Image (AMI) - we will use Ubuntu 22.04 for this setup.
- Choose an instance type (e.g., t2.large).
- Configure the instance settings, ensuring it has access to necessary IAM roles and security groups.
- For the IAM role, attach a role that allows access to the necessary services (e.g., S3, EKS, CloudWatch).
- Add a security group that allows inbound SSH access and all necessary ports for GitHub Actions and Docker.Launch an EC2 Instance:
- Accessing the Instance: Once the instance is launched, you can connect to it using SSH. Use the private key associated with the selected key pair to connect to the instance's public IP or DNS address.

**STEP 2: INSTALL REQUIRED PACKAGES ON INSTANCE.**
use this installations file: 

`vi docker-setup.sh`
Script
# Add Docker's official GPG key:
`sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg`
# Add the repository to Apt sources:
`echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release &amp;&amp; echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list &gt; /dev/null

sudo apt-get update
`sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin`
`curl -sSfL https://raw.githubusercontent.com/docker/scout-cli/main/install.sh | sh -s -- -b /usr/local/bin`
- sudo usermod -aG docker ubuntu
- newgrp docker
- sudo chmod 777 /var/run/docker.sock
**Provide executable versions**
sudo chmod 777 docker-setup.sh`

`sh docker-setup.sh`

**Create Script for other packages**
`vi script-packages.sh`
Script
``#!/bin/bash
sudo apt update -y
sudo touch /etc/apt/keyrings/adoptium.asc
sudo wget -O /etc/apt/keyrings/adoptium.asc https://packages.adoptium.net/artifactory/api/gpg/key/public
echo "deb [signed-by=/etc/apt/keyrings/adoptium.asc] https://packages.adoptium.net/artifactory/deb $(awk -F= '/^VERSION_CODENAME/{print$2}' /etc/os-release) main" | sudo tee /etc/apt/sources.list.d/adoptium.list
sudo apt update -y
sudo apt install temurin-17-jdk -y
/usr/bin/java --version``

# Install Terraform
``sudo apt install wget -y
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update &amp;&amp; sudo apt install terraform
# Install kubectl
sudo apt update
sudo apt install curl -y
curl -LO https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
kubectl version --client
# Install AWS CLI 
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
sudo apt-get install unzip -y
unzip awscliv2.zip
sudo ./aws/install
# Install Node.js 16 and npm
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource.gpg.key | sudo gpg --dearmor -o /usr/share/keyrings/nodesource-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/nodesource-archive-keyring.gpg] https://deb.nodesource.com/node_16.x focal main" | sudo tee /etc/apt/sources.list.d/nodesource.list
sudo apt update
sudo apt install -y nodejs``

#!/bin/bash

**Give executable permissions for script and run it**
`sudo chmod 777 script-packages.sh`
`sh script-packages.sh`

**check the package version**
- docker - version
- terraform - version
- aws - version
- kubectl version
- node -v
-java - version

- Run the Sonarqube container
`docker run -d --name sonar -p 9000:9000 sonarqube:lts-community`
- Now copy the IP address of the ec2 instance ec2-public-ip:9000`
- go to your browser and log into to sonarqube server.
- log in with
- username: admin - - password:admin
- change your password - -enter the old passwrod - - create a new username - - -wew password

**Step 3: Integrating SonarQube with GitHub Actions**
- Integrating SonarQube with GitHub Actions allows you to automatically analyze your code for quality and security as part of your continuous integration pipeline.
- We already have Sonarqube up and running
- On Sonarqube Dashboard click on Manually - - create project and give your project a name - - -click on steup - -click with github actions- - 
- Open your GitHub and select your Repository click settings - -actions - -secret and variables - new repository secret and add the Sonar_token and Sonar_url into the new rrepon environment on Github.
- Now go back to Your Sonarqube Dashboard
- Copy SONAR_TOKEN and click on Generate Token
- Go to Sonarqube Dashboard and click on continue
- Now it Generates a workflow for the Project use your generated file for this block
- Go back to GitHub. click on Add file and then create a new file
- create a new file on the repo: Add
 - file name: 
- `sonar-project.properties`
- File content:
`sonar.projectKey=fashionova-store`

![image](https://github.com/user-attachments/assets/9d92f29f-4e44-4c56-af86-0074ec8d578d)


Commit changes

**Step 4: Setting up Github workflow**
- .github/workflows/build.yml and add the generated code from sonarqube
- paste the content into the workflow file
```name: Build,Analyze,scan
on:
 push:
 branches:
 - main
jobs:
 build-analyze-scan:
 name: Build
 runs-on: [self-hosted]
 steps:
 - name: Checkout code
 uses: actions/checkout@v2
 with:
 fetch-depth: 0 # Shallow clones should be disabled for a better relevancy of analysis
 - name: Build and analyze with SonarQube
 uses: sonarsource/sonarqube-scan-action@master
 env:
 SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
 SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}``

- Commit changes
- Now click on Actions
- click on actions - runner - click your yml and view the progress.
- Step 5: Add GitHub Runner
- Go to GitHub and click on Settings –> Actions –> Runners-New self - hosted runner - -linux
- Copy this command one after another Use the below commands to add a self-hosted runner
- generated from Github runnerGithub actionsStep

**Step G: Setting Up Amazon EKS**
- `git clone: https://github.com/etaoko333/Fashionova-boutique.git`
- cd Fashionova-boutique
- cd EKS-TF
- terraform init
- terraform plan
- terraform apply
terraform resources verify the deployment in aws console

**Step 7: Generate a Docker Access Token**

- Navigate to Account Settings:
- Click on your profile icon in the upper right corner.
- Select Account Settings from the dropdown menu.
Access the Security Tab:
- In the left sidebar, click on Security. This tab is where you manage access tokens and other security settings.
- Create a New Access Token:
- Click on the New Access Token button.
- Name Your Token: Give your token a descriptive name (e.g., "GitHub Actions Token").
- Set Expiration (Optional): You can set an expiration date for the token if desired.
- Give permission read, wrire and delete
- Click Create.

Once the token is generated, it will be displayed on the screen. Copy the token immediately and store it securely; you won't be able to see it again once you navigate away from the page.

- Store the Access Token Securely
- To use the Docker access token in a CI/CD pipeline, you should store it securely:
- Use GitHub Secrets:
- Go to your GitHub repository.
- Click on Settings.
- In the left sidebar, click on Secrets and variables and then Actions.
- Click on New repository secret.
- Add a name for your secret (e.g., DOCKERHUB_TOKEN) and paste your copied Docker access token into the value field.
- Click Add secret.

**Use the Docker Access Token in Your Workflow**
- Now that you have stored your Docker access token as a secret, you can use it in your GitHub Actions workflow:

- In your workflow file, you can use the access token to log in to Docker Hub. Here's how you can include it in your .github/workflows/deploy.yml file:

``name: Build
on:
push:
branches:
- main
jobs:
build:
name: Build
runs-on: ubuntu-latest
steps:
- name: Checkout Code
uses: actions/checkout@v2
with:
fetch-depth: 0
- name: SonarQube Scan
uses: sonarsource/sonarqube-scan-action@master
env:
SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
- name: NPM Install
run: npm install
- name: Docker Login
run: echo "${{ secrets.DOCKERHUB_TOKEN }}" | docker login -u "${{ secrets.DOCKERHUB_USERNAME }}" - password-stdin
- name: Install Docker Scout
run: |
curl -sSfL https://raw.githubusercontent.com/docker/scout-cli/main/install.sh | sh -s - -b /usr/local/bin
- name: Docker Scout Scan
run: |
docker-scout quickview fs://.
docker-scout cves fs://.
- name: Docker Build and Push
run: |
docker build -t sholly333/boutique-store:latest .
docker push sholly333/boutique-store:latest
env:
DOCKER_CLI_ACI: 1
- name: Docker Scout Image Scan
run: |
docker-scout quickview sholly333/boutique-store:latest
docker-scout cves sholly333/boutique-store:latest
deploy:
needs: build
runs-on: self-hosted
steps:
- name: Docker Pull Image
run: docker pull sholly333/boutique-store:latest
- name: Deploy to Container
run: docker run -d - name game-new -p 3000:3000 sholly333/boutique-store:latest
- name: Update Kubeconfig
run: aws eks - region ap-south-1 update-kubeconfig - name EKS_CLOUD
- name: List Files
run: ls -al # Check for deployment-service.yml
- name: Deploy to Kubernetes
run: kubectl apply -f deployment-service.yml``


output

ec2ipaddress:3000

![image](https://github.com/user-attachments/assets/fbe213d2-9ce4-4962-b070-6d1bed12ae58)



















