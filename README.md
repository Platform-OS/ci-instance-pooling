# Setting up a Release Pool

**Setting up a release pool is a prerequisite for setting up a CI pipeline used with PlatformOS.**

A release pool consists of a set of ready-to-use instances in a CI environment, managed to ensure efficient resource allocation and avoid conflicts. These instances are dynamically assigned to tests, ensuring isolated test environments.

## Steps to Set Up a Release Pool

### 1. Clone the `ci-instance-pooling` repository

Clone the [ci-instance-pooling](https://github.com/Platform-OS/ci-instance-pooling) repository to your local machine to get the tools for managing CI instances.

```bash
git clone https://github.com/Platform-OS/ci-instance-pooling
```

### 2. Create the Main Instance

Go to [Instances in the Partner Portal](https://partners.platformos.com/instances) and create a new instance (e.g., `ci-main-instance`), set the environment to **Staging**, and mark it as **Unbillable**.

### 3. Set up and Connect the Main Instance

Navigate to the `ci-instance-pooling` directory and run:

```bash
cd ci-instance-pooling
pos-cli env add --url https://YOUR-INSTANCE.staging.oregon.platform-os.com <env-for-ci-pool>
```

### 4. Authorize the Main Instance

Click **Authorize** in the Partner Portal to authenticate the instance.

### 5. Deploy the Main Instance

Deploy the main instance using the following command:

```bash
pos-cli deploy <env-for-ci-pool>
```

### 6. Create additional Test Instances

Create additional test instances (e.g., `test-ci-instance-01`, `test-ci-instance-02`) and set them to **Staging** and **Unbillable**.

### 7. Set up and authorize Test Instances

Set up and authorize each test instance with:

```bash
pos-cli env add --url https://test-ci-instance-01.staging.oregon.platform-os.com test-ci-instance-01
```

! Important: Tokens are generated and stored in the `.pos` file in your project root. Be sure to use these tokens in the next step.

### 8. Add your instances to the Database

Start the **pos-cli GUI** and navigate to [http://localhost:3333](http://localhost:3333):

```bash
pos-cli gui serve <env-for-ci-pool>
```

In the **Database** section, add a new record for each instance:

- **Available**: Set to `true`.
- **Domain**: Use the instance URL (without `https://`).
- **pos_cli_token**: Copy from the `.pos` file.

### 9. Configure GitHub Secrets: `POS_CI_REPO_ACCESS_TOKEN`

To enable communication between the CI environment and **your GitHub repository you want to set up a CI/CD pipeline for**, you need to add the `POS_CI_REPO_ACCESS_TOKEN` to your GitHub repository secrets.

Access the **Constants GUI** at [http://localhost:3333/constants](http://localhost:3333/constants) and copy the `POS_CI_REPO_ACCESS_TOKEN` from your main instance.

Next, configure the CI with your GitHub repository:

- Navigate to the GitHub repository where you want to set up the CI pipeline. Click on the **Settings** tab in the upper-right corner of the repository page, then go to **Security** → **Secrets and variables** → **Secrets**.
- Click on **New repository secret**, enter `POS_CI_REPO_ACCESS_TOKEN` as the token name, and paste the copied value. Save the new token.

## Configuration 

Endpoints:

## Reserve - /api/instances/reserve

### Parameters:

* timeout - (optional) Default is 45 minutes. Specifies the number of minutes after which the instance will be automatically released.
* with_token - (optional) A feature flag. If set to `true`, will return JSON like {"id":"1","domain":"example.com","pos_cli_token":"secret","available":false,"reserved_at":"2024-08-06T12:28:20.290Z","reserved_by":"Test client"} instead of string (domain name only).

Example:

curl -H "AUTHORIZATION: Bearer <token>" --data "client=Test client&with_token=true&timeut=1" -X POST https://<host>/api/instances/reserve.json
