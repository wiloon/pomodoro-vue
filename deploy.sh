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

sudo buildah manifest create ${manifest_name}:${version}

sudo buildah bud --arch=amd64 -t registry.wiloon.com/${project_name}:${version} --manifest ${manifest_name} .
sudo buildah bud --arch=arm64 -t registry.wiloon.com/${project_name}:${version} --manifest ${manifest_name} .

sudo buildah manifest push --all \
    ${manifest_name} \
    docker://registry.wiloon.com/${project_name}:${version}

rm -rf ~/projects/pomodoro-vue/dist

ansible -i '192.168.50.228,' all -u root -m copy -a 'src=~/projects/pomodoro-vue/pomodoro-k8s.yaml dest=/tmp'
ansible -i '192.168.50.228,' all -u root -m shell -a 'kubectl delete -f /tmp/pomodoro-k8s.yaml'
ansible -i '192.168.50.228,' all -u root -m shell -a 'kubectl create -f /tmp/pomodoro-k8s.yaml'
