# Build Milestone

## Implementation
1. `pipeline setup`  
This command helps to create a VM using bakerx CLI utility and installs Jenkins contingious integration server on it. This commands also create a pipeline and job to build and test ```checkbox.io``` recent changes.

2. `pipeline build`  
This command helps to trigger build job `` in Jenkins server to build and analyse the recent changes made to ```checkbox.io``` development repository.

## Credentials
In order to protect credentials, they're are managed using :
- Ansible Vault
- Config files

## Screencast
![]()