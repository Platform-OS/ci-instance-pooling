
Endpoints:

## Reserve - /api/instances/reserve

### Parameters:

* timeout - default 45 minutes, provide number of minutes after which the instance will be automatically released
* with_token - feature flag, will return json like {"id":"1","domain":"example.com","pos_cli_token":"secret","available":false,"reserved_at":"2024-08-06T12:28:20.290Z","reserved_by":"Test client"} instead of string (domain name only)

Example:

curl -H "AUTHORIZATION: Bearer <token>" --data "client=Test client&with_token=true&timeut=1" -X POST https://<host>/api/instances/reserve.json
