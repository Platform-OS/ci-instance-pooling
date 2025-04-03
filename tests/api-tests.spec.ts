import { expect, test } from "@playwright/test";
import { responses } from './data/responses';

const accessToken = process.env.TEST_TOKEN;
console.log("Access token:" + accessToken);

test.describe.parallel('Unauthorized user tests', () => {
    test(`user can't access '/instances' endpoint`, async ({ request }) => {
        const response = await request.get("/api/instances")

        await expect(response.status()).toBe(401);

        //decode response
        const responseText = await response.text();
        const decodedResponse = responseText.replace(/&quot;/g, '"').replace(/$\;/, '');
        const responseJson = JSON.parse(decodedResponse);

        await expect(responseJson).toStrictEqual(responses.notAuthorized);
    });

    test('user cannot reserve an instance', async ({ request }) => {
        const response = await request.post("/api/instances/reserve")

        await expect(response.status()).toBe(401);

        const responseJson = await response.json();
        await expect(responseJson).toStrictEqual(responses.notAuthorized);
    });

    test('user cannot release an instance', async ({ request }) => {
        const response = await request.delete("/api/instances/release")

        await expect(response.status()).toBe(401);

        const responseJson = await response.json();
        await expect(responseJson).toStrictEqual(responses.notAuthorized);
    });
});

test.describe('Authorized user tests', () => {
    let reservedInstance: string | null = null;

    test(`user can access '/instances' endpoint`, async ({ request }) => {
        const response = await request.get("/api/instances", {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });

        await expect(response.status()).toBe(200);

        //decode response
        const responseText = await response.text();
        const decodedResponse = responseText.replace(/&quot;/g, '"').replace(/$\;/, '');
        const responseJson = JSON.parse(decodedResponse);

        await expect(responseJson).toStrictEqual(responses.instances);
    });

    test(`user can reserve an instance`, async ({ request }) => {
        await test.step(`an unassigned client can reserve an instance`, async () => {;
            const response = await request.post("/api/instances/reserve", {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-type": "application/json", 
                },
                data: {
                    "client": "fancyProject"
                }
            });
    
            await expect(response.status()).toBe(200);
            const responseText = await response.text();
            reservedInstance = responseText.trim();
    
            for (const instance of responses.instances) {
                if (reservedInstance === instance.domain) {
                    await expect(reservedInstance).toStrictEqual(instance.domain);
                    break;
                }
            }
        });

        await test.step(`an assigned client cannot reserve an instance a second time`, async () => {;
            const response = await request.post("/api/instances/reserve", {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-type": "application/json", 
                },
                data: {
                    "client": "fancyProject"
                }
            });
            

            await expect(response.status()).toBe(503);
            const responseJson = await response.json();
            await expect(responseJson).toStrictEqual(responses.alreadyReserved);
        });
    });

    test(`user can release an instance`, async ({ request }) => {
        await test.step(`an unassigned client cannot release not reserved instance`, async () => {;
            const response = await request.delete("/api/instances/release", {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-type": "application/json", 
                },
                data: {
                    "client": "unassignedClient"
                }
            });
    
            await expect(response.status()).toBe(200);
            const responseJson = await response.json();
            await expect(responseJson).toStrictEqual(responses.notFound);
        });

        await test.step(`an assigned client can release reserved instance`, async () => {;
            const response = await request.delete("/api/instances/release", {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-type": "application/json", 
                },
                data: {
                    "client": "fancyProject"
                }
            });
    
            await expect(response.status()).toBe(200);
            const responseJson = await response.json();

            await expect(responseJson).toStrictEqual({
                valid: true,
                domain: reservedInstance,
                available: true,
                operation: 'release'
            });
        });
    });
});

test.describe('Limit tests', () => {
    const clients = ["client1", "client2", "client3", "client4"];

    test(`reserving more instances than available in the pool returns an error`, async ({ request }) => {
        for (const client of clients) {
            await test.step(`reserve an instance as ${client}`, async () => {;
                const response = await request.post("/api/instances/reserve", {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        "Content-type": "application/json", 
                    },
                    data: {
                        "client": `${client}`
                    }
                });
                
                if (client != "client4") {
                    await expect(response.status()).toBe(200);
                } else {
                    const responseJson = await response.json();
                    await expect(responseJson).toStrictEqual(responses.noAvailableInstances);
                }
            });
        }

        await test.step(`release instances`, async () => {;
            for (const client of clients) {
                const response = await request.delete("/api/instances/release", {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        "Content-type": "application/json", 
                    },
                    data: {
                        "client": `${client}`
                    }
                });
        
                await expect(response.status()).toBe(200);
            }
        });
    });
});

test.describe('Get-token tests', () => {
    let reservedInstance: string | null = null;

    test(`get-token gives token of reserved instance`, async ({ request }) => {
        await test.step(`reserve an instance`, async () => {;
            const response = await request.post("/api/instances/reserve", {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-type": "application/json", 
                },
                data: {
                    "client": "coolProject"
                }
            });
    
            await expect(response.status()).toBe(200);
            const responseText = await response.text();
            reservedInstance = responseText.trim();
        });

        await test.step(`get token of reserved instance`, async () => {;
            const response = await request.post("/api/instances/get-token", {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-type": "application/json", 
                },
                data: {
                    "client": "coolProject"
                }
            });
            
            await expect(response.status()).toBe(200);
            const responseText = await response.text();
            const receivedToken = responseText.trim();

            for (const instance of responses.instances) {
                if (reservedInstance === instance.domain) {
                    await expect(receivedToken).toStrictEqual(instance.pos_cli_token);
                    break;
                }
            }            
        });
    });
});
