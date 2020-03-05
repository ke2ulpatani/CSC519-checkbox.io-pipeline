# Checkpoint 1
## Planning
We planned on how to achieve the objective of this milestone and divided the tasks amongst ourselves by creating different stories on GitHub Project Board for this [milestone](https://github.ncsu.edu/cscdevops-spring2020/DEVOPS-10/projects/1). Each story is created such that it can be performed independently.

## Goals Achieved
We created skeleton for our node project from [CM-Template](https://github.com/CSC-DevOps/CM-Template). After that we implemented `pipeline setup` command which currently Issue jenkins-srv VM with specific [ip-address](https://github.com/CSC-DevOps/Course/blob/master/Project/Pipeline1.md#constraints) and installed ansible in it to install other dependencies like Java, Jenkins, etc in it using an ansible playbook. We will be using this playbook for automating remaining tasks in the future.

Also, we implemented `pipeline build <buildJobName>` command which triggers a build job (named buildJobName), waits for output, and prints build log. For this we followed [Jenkins Workshop](https://github.com/CSC-DevOps/Jenkins) repository. But currently it runs the build job on the jenkins VM created in the workshop.

| Task | Issue |
| ------ | ------ |
| Create a node.js project to act as a driver | [Issue #5](https://github.ncsu.edu/cscdevops-spring2020/DEVOPS-10/Issue/5) |
| Create ansible playbook for installing jenkins | [Issue #4](https://github.ncsu.edu/cscdevops-spring2020/DEVOPS-10/Issue/4) |
| Decide which automation tool to use for creating jenkins build job | [Issue #2](https://github.ncsu.edu/cscdevops-spring2020/DEVOPS-10/Issue/2) |
| Decide which automation tool to use for retrieving jenkins build log | [Issue #10](https://github.ncsu.edu/cscdevops-spring2020/DEVOPS-10/Issue/10) |
| Add pipeline build command to trigger a build | [Issue #9](https://github.ncsu.edu/cscdevops-spring2020/DEVOPS-10/Issue/9) |

## Future Work
| Task | Issue |
| ------ | ------ |
| Update ansible playbook  for configuring jenkins server  | [Issue #8](https://github.ncsu.edu/cscdevops-spring2020/DEVOPS-10/Issue/8) |
| Ansible playbook/shell script to create a build job | [Issue #14](https://github.ncsu.edu/cscdevops-spring2020/DEVOPS-10/Issue/14) |
| Shift pipeline build from jenkins (workshop) VM to jenkins-srv | [Issue #13](https://github.ncsu.edu/cscdevops-spring2020/DEVOPS-10/Issue/13) |
| Integrate playbook with node application cli command | [Issue #7](https://github.ncsu.edu/cscdevops-spring2020/DEVOPS-10/Issue/7) |

## Current Snapshot of the Project Board:
![img](../imgs/milestone1_project_board_checkpoint1.png)


# Checkpoint 2
## Goals Achieved
We first updated `pipeline setup` command to run our ansible playbook.

We then started with [configuring build environment](https://github.com/CSC-DevOps/Course/blob/master/Project/Pipeline1.md#%EF%B8%8Fautomatically-configure-a-build-environment-checkboxio) for the jenkins server. For this, we created 2 roles to install nodejs and mongodb each, and 1 role to configure mongodb.

Lastly, one more role is created to install jenkins-job-builder.

| Task | Issue |
| ------ | ------ |
| Ansible playbook/shell script to setup build environment | [Issue #6](https://github.ncsu.edu/cscdevops-spring2020/DEVOPS-10/Issue/6) |
| Integrate playbook with node application cli command | [Issue #7](https://github.ncsu.edu/cscdevops-spring2020/DEVOPS-10/Issue/7) |
| Ansible playbook/shell script to install jenkins-job-builder | [Issue #17](https://github.ncsu.edu/cscdevops-spring2020/DEVOPS-10/Issue/17) |

## Future Work

We are not required to complete configuration of the jenkins server and create a build a job. We'll have to update ansible playbook for these tasks.

| Task | Issue |
| ------ | ------ |
| Update ansible playbook  for configuring jenkins server  | [Issue #8](https://github.ncsu.edu/cscdevops-spring2020/DEVOPS-10/Issue/8) |
| Ansible playbook/shell script to create a build job | [Issue #14](https://github.ncsu.edu/cscdevops-spring2020/DEVOPS-10/Issue/14) |
| Shift pipeline build from jenkins (workshop) VM to jenkins-srv | [Issue #13](https://github.ncsu.edu/cscdevops-spring2020/DEVOPS-10/Issue/13) |

## Current Snapshot of the Project Board:
![img](../imgs/milestone1_project_board_checkpoint2.png)
