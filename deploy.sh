#!/bin/sh

name="pomodoro"
cd /home/wiloon/projects/pomodoro-vue || exit
yarn install
yarn build
sudo buildah bud -t registry.wiloon.com/pomodoro:v0.0.1 .
sudo buildah push registry.wiloon.com/pomodoro:v0.0.1
ansible -i '192.168.50.92,' all -u root -m shell -a 'podman pull registry.wiloon.com/pomodoro:v0.0.1'
ansible -i '192.168.50.92,' all -u root -m shell -a 'podman stop pomodoro'
ansible -i '192.168.50.92,' all -u root -m shell -a 'podman rm pomodoro'
ansible -i '192.168.50.92,' all -u root -m shell -a 'podman run -d --name pomodoro -p 30000:80 -v /etc/localtime:/etc/localtime:ro -v pomodoro-logs:/var/log/nginx registry.wiloon.com/pomodoro:v0.0.1'
ansible -i '192.168.50.92,' all -u root -m shell -a 'podman ps -f name=pomodoro'
