export const instances = {
  instanceToCreate: {
    domain: 'https://ci-playwright.example.com/',
    pos_cli_token: 'X9e!tzP7r@QwL6vZn#k12YgRm$DxuAF3oB5VjchEs4a'
  },
  instanceWithWeakToken: {
    domain: 'https://ci-playwright2.example.com/',
    pos_cli_token: 'weak_token(too_short)'
  },
  instanceWithInvalidDomain: {
    domain: 'ci-playwright3.example.com',
    pos_cli_token: 'a4sEhcjV5Bo3FAuxD$mRgY21k#nZv6LwQ@r7Pzt!e9X'
  },
  instanceToDelete: {
    domain: 'ci-instance3.example.com',
  },
  instanceToReserve: {
    domain: 'ci-instance2.example.com',
  },
  instanceToRelease: {
    domain: 'ci-instance2.example.com',
  },
  instanceReservedByApi: {
    domain: 'ci-instance2.example.com',
    reservedByUrl: 'https://github.com/ORG-name/projectName/actions/runs/jobId'
  }
};
