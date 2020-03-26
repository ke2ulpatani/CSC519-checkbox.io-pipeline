# Build Milestone

## Discussions
In this milestone, we sat & discussed all the ways we could achieve the goal and divide the tasks amongst ourselves in such a way that nobody gets overwhelmed. To get everyone to work at their own speed, we decided that each member would be performing one task which were then added to Github Kanban Board with appropriate tags. The tag was decided on the basis of a particular story's major task i.e. `setup jenkins server`, `build environment`, `build job`. Further, we focussed on inter-tasks dependability. Since each member was resposible for one task, we began to accord our tasks. For example, Ketul was given the task to setup jenkins environment and Maharsh was given the task to setup jenkins server. They sat down together and mereged their code and remove any turbulence between their codes. Additionaly, we had separate sessions to help each other stuck on known issues such as Anshul was struggling with npm tests timeouts using jenkins build job api which was resolved by having discussion with Ketul & Maharsh.

## Implementation
1. `pipeline setup`  
This command helps to create a VM using bakerx CLI utility and installs Jenkins contingious integration server on it. This commands also create a pipeline and job to build and test ```checkbox.io``` recent changes.

2. `pipeline build`  
This command helps to trigger build job in Jenkins server to build and analyse the recent changes made to ```checkbox.io``` development repository.

### Dependencies:
- Ansible
- Jenkins
- MongoDB
- NodeJS

## Credentials Management
In order to protect credentials, they're are managed using :
- Ansible Vault
- Config files

## Tasks

| Task | Issue |
| ------ | ------ |
| Create a node.js project to act as a driver | [Issue #5](https://github.ncsu.edu/cscdevops-spring2020/DEVOPS-10/Issue/5) |
| Create ansible playbook for installing jenkins | [Issue #4](https://github.ncsu.edu/cscdevops-spring2020/DEVOPS-10/Issue/4) |
| Decide which automation tool to use for creating jenkins build job | [Issue #2](https://github.ncsu.edu/cscdevops-spring2020/DEVOPS-10/Issue/2) |
| Decide which automation tool to use for retrieving jenkins build log | [Issue #10](https://github.ncsu.edu/cscdevops-spring2020/DEVOPS-10/Issue/10) |
| Add pipeline build command to trigger a build | [Issue #9](https://github.ncsu.edu/cscdevops-spring2020/DEVOPS-10/Issue/9) |
| Ansible playbook/shell script to setup build environment | [Issue #6](https://github.ncsu.edu/cscdevops-spring2020/DEVOPS-10/Issue/6) |
| Integrate playbook with node application cli command | [Issue #7](https://github.ncsu.edu/cscdevops-spring2020/DEVOPS-10/Issue/7) |
| Ansible playbook/shell script to install jenkins-job-builder | [Issue #17](https://github.ncsu.edu/cscdevops-spring2020/DEVOPS-10/Issue/17) |
| Update ansible playbook  for configuring jenkins server  | [Issue #8](https://github.ncsu.edu/cscdevops-spring2020/DEVOPS-10/Issue/8) |
| Ansible playbook/shell script to create a build job | [Issue #14](https://github.ncsu.edu/cscdevops-spring2020/DEVOPS-10/Issue/14) |
| Shift pipeline build from jenkins (workshop) VM to jenkins-srv | [Issue #13](https://github.ncsu.edu/cscdevops-spring2020/DEVOPS-10/Issue/13) |

## Current Snapshot of the Project Board:
![img](../imgs/build_milestone_project_board.png)

## Screencast
[Screencast Video](https://drive.google.com/open?id=1fCF1fJTuE-TnvXc0Pq80S0OMo9cfMXGD)