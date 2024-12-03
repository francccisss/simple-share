import { fail } from "assert";
import test, { describe } from "node:test";

test("Testing sesssion operations for users", async (t) => {
  let header = {};
  await t.test("Create session", async () => {
    try {
      const f = await fetch("http://localhost:8081/", {
        method: "GET",
        headers: {
          Accept: "text/html",
        },
      });
      const r = await f;
      console.log(r);
      if (r.headers === null) {
        fail("Failed to pass in a cookie session");
      }
    } catch (err) {
      fail("Unable to create session");
    }
  });
});
