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
            "pos_cli_token": "test",
            "reserved_at": null,
            "reserved_by": null
        },
        {
            "available": "true",
            "domain": "ci-instance2.example.com",
            "pos_cli_token": "test",
            "reserved_at": null,
            "reserved_by": null
        },
        {
            "available": "true",
            "domain": "ci-instance3.example.com",
            "pos_cli_token": "test",
            "reserved_at": null,
            "reserved_by": null
        }
    ]
};
