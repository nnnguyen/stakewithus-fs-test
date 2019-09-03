import request from "supertest";
import app from "./app";

describe("server", () => {
    describe("/api/users", () => {
        it("should response with text", () => {
            request(app)
                .get("/api/hello")
                .expect(200)
                .then(response => {
                    expect(response.body.express).toBe("Hello From Express");
                });
        });

        it("should response with json", () => {
            request(app)
                .get("/api/users")
                .expect(200)
                .then(response => {
                    expect(response.body).toBe(response.body);
                });
        });
    });
});
