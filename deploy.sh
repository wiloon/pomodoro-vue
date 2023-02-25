#!/bin/sh

project_name="pomodoro"
version="v0.0.1"

cd ~/projects/pomodoro-vue || exit
yarn install
yarn build

export manifest_name=${project_name}-manifest
sudo podman image ls
sudo podman manifest rm ${manifest_name}:${version}
sudo podman manifest rm ${manifest_name}:latest
sudo podman image ls

sudo buildah bud --arch=amd64 -t registry.wiloon.com/${project_name}:${version}-amd64 .
sudo buildah push registry.wiloon.com/${project_name}:${version}-amd64

sudo buildah bud --arch=arm64 -t registry.wiloon.com/${project_name}:${version}-arm64 .
sudo buildah push registry.wiloon.com/${project_name}:${version}-arm64

rm -rf ~/projects/pomodoro-vue/dist

buildah manifest create registry.wiloon.com/${project_name}:${version} \
    --amend registry.wiloon.com/${project_name}:${version}-amd64 \
    --amend registry.wiloon.com/${project_name}:${version}-arm64

buildah manifest inspect registry.wiloon.com/${project_name}:${version}
buildah manifest push --all registry.wiloon.com/${project_name}:${version}  docker://registry.wiloon.com/${project_name}:${version}

ansible -i '192.168.50.228,' all -u root -m copy -a 'src=~/projects/pomodoro-vue/pomodoro-k8s.yaml dest=/tmp'
ansible -i '192.168.50.228,' all -u root -m shell -a 'kubectl delete -f /tmp/pomodoro-k8s.yaml'
ansible -i '192.168.50.228,' all -u root -m shell -a 'kubectl create -f /tmp/pomodoro-k8s.yaml'
