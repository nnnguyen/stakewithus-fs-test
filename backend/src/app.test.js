import request from "supertest";
import app from "./app";

describe("server", () => {
    describe("/api/v1/validators", () => {
        it("should response with json", () => {
            request(app)
                .get("/api/v1/validators")
                .expect(200)
                .then(response => {
                    expect(response.body).toBe(response.body);
                });
        });
    });
});
