#!/bin/bash
eval "$(ssh-agent -s)"
chmod 600 .deploy/deploy_rsa
echo -e "Host $SSH_IP\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config
ssh-add .deploy/deploy_rsa

ssh atlas@$SSH_IP <<EOF
  docker stop {$TRAVIS_BRANCH}
  docker rm {$TRAVIS_BRANCH}
  docker pull ${DOCKER_IMAGE}:${DOCKER_TAG}
  docker run --name={$TRAVIS_BRANCH} --env-file ~/.env/{$TRAVIS_BRANCH}.env --restart unless-stopped -d ${DOCKER_IMAGE}:${DOCKER_TAG}
  docker system prune -a -f
EOF

result=$?

if [ $result -ne 0 ]; then
  echo "Deployment failed"
  exit 1
fi

echo "Successfully deployed"
exit 0