export const responses = {
    "notAuthorized": {
        "errors": {
            "base": "not authorized"
        }
    },
    "alreadyReserved": {
        "error": "Instance already reserved. Please release or wait for auto-realeasing"
    },
    "notFound": {
        "error": "instance not found"
    },
    "noAvailableInstances": {
        "error": "no available instances"
    },
    "instances": [
        {
            "available": "true",
            "domain": "ci-instance1.example.com",
            "id": "1",
            "pos_cli_token": "instance1-e9s12fksx",
            "reserved_at": null,
            "reserved_by": null
        },
        {
            "available": "true",
            "domain": "ci-instance2.example.com",
            "id": "2",
            "pos_cli_token": "instance2-l1sz3x21m",
            "reserved_at": null,
            "reserved_by": null
        },
        {
            "available": "true",
            "domain": "ci-instance3.example.com",
            "id": "3",
            "pos_cli_token": "instance3-pq1w2s3f4",
            "reserved_at": null,
            "reserved_by": null
        }
    ]
};
