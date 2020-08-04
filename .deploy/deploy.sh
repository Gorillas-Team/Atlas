#!/bin/bash
set -e

eval "$(ssh-agent -s)"
chmod 600 .deploy/deploy_rsa
echo -e "Host $SSH_IP\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config
ssh-add .deploy/deploy_rsa

ssh -i .deploy/deploy_rsa atlas@$SSH_IP << EOF
  docker stop ${TRAVIS_BRANCH}
  docker rm ${TRAVIS_BRANCH}
  echo ${DOCKER_PASSWORD} | docker login -u ${DOCKER_USERNAME} --password-stdin
  docker pull ${DOCKER_IMAGE}:${DOCKER_TAG}
  docker run --name=${TRAVIS_BRANCH} --env-file ~/.env/${TRAVIS_BRANCH}.env --restart unless-stopped -d ${DOCKER_IMAGE}:${DOCKER_TAG}
  docker system prune -a -f
EOF

exit 0